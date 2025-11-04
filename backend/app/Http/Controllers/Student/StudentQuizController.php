<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

/**
 * Student Quiz Controller
 *
 * Handles quiz attempts, AI-powered evaluation using Gemini 2.5 Flash,
 * and provides intelligent feedback to students.
 *
 * @package App\Http\Controllers\Student
 */
class StudentQuizController extends Controller
{
    /**
     * Analyze student quiz submission with AI feedback
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function analyzeStudentQuiz(Request $request)
    {
        try {
            // Validate input data
            $validator = Validator::make($request->all(), [
                'quiz_id' => 'required|integer|exists:quizzes,id',
                'answers' => 'required|array',
                'answers.*' => 'required|string',
                'time_spent' => 'nullable|integer|min:0',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid input data',
                    'errors' => $validator->errors()
                ], 422);
            }

            $student = auth()->user();

            // Get student profile
            if (!$student || !$student->student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $studentProfile = $student->student;
            $quizId = $request->input('quiz_id');
            $answers = $request->input('answers');
            $timeSpent = $request->input('time_spent', 0);

            // Load quiz with course
            $quiz = Quiz::with('course')->findOrFail($quizId);

            // Check if student has access to this quiz (via enrolled course)
            $hasAccess = DB::table('course_student')
                ->where('student_id', $studentProfile->id)
                ->where('course_id', $quiz->course_id)
                ->where('payment_status', 'paid')
                ->exists();

            if (!$hasAccess) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have access to this quiz. Please enroll in the course first.'
                ], 403);
            }

            // Check attempt limits
            $attemptCount = QuizAttempt::where('quiz_id', $quizId)
                ->where('student_id', $studentProfile->id)
                ->count();

            if ($quiz->max_attempts && $attemptCount >= $quiz->max_attempts) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have reached the maximum number of attempts for this quiz.'
                ], 403);
            }

            // Prepare quiz data for AI evaluation
            $quizData = $this->prepareQuizDataForAI($quiz, $answers);

            // Get AI feedback from Gemini
            $aiFeedback = $this->getGeminiAIFeedback($quizData);

            // Calculate score and create attempt record
            $attemptData = $this->processQuizResults($quiz, $answers, $aiFeedback, $studentProfile->id, $timeSpent);

            // Get question count
            $quizQuestions = is_string($quiz->questions)
                ? json_decode($quiz->questions, true)
                : (is_array($quiz->questions) ? $quiz->questions : []);
            $totalQuestions = count($quizQuestions);

            return response()->json([
                'success' => true,
                'message' => 'Quiz evaluated successfully',
                'data' => [
                    'attempt_id' => $attemptData['attempt_id'],
                    'score' => $attemptData['score'],
                    'total_marks' => $quiz->total_marks,
                    'percentage' => $attemptData['percentage'],
                    'passed' => $attemptData['passed'],
                    'correct_answers' => $attemptData['correct_answers'],
                    'total_questions' => $totalQuestions,
                    'time_spent' => $timeSpent,
                    'ai_feedback' => $aiFeedback,
                    'can_retake' => $quiz->max_attempts ? ($attemptCount + 1 < $quiz->max_attempts) : true,
                    'attempts_remaining' => $quiz->max_attempts ? ($quiz->max_attempts - $attemptCount - 1) : 'unlimited',
                ]
            ], 200);

        } catch (\Exception $e) {
            Log::error('Student Quiz Analysis Error: ' . $e->getMessage(), [
                'student_id' => auth()->id(),
                'quiz_id' => $request->input('quiz_id'),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while evaluating your quiz. Please try again.',
                'error' => config('app.debug') ? $e->getMessage() : null
            ], 500);
        }
    }

    /**
     * Prepare quiz data in a structured format for AI evaluation
     *
     * @param Quiz $quiz
     * @param array $answers
     * @return array
     */
    private function prepareQuizDataForAI(Quiz $quiz, array $answers): array
    {
        $questions = [];

        // Get questions from JSON field or empty array
        $quizQuestions = is_string($quiz->questions)
            ? json_decode($quiz->questions, true)
            : (is_array($quiz->questions) ? $quiz->questions : []);

        foreach ($quizQuestions as $index => $question) {
            $questionNumber = $index + 1;
            // Use question number as key for answers
            $studentAnswer = $answers[$questionNumber] ?? $answers[$index] ?? 'No answer provided';

            $questions[] = [
                'question_number' => $questionNumber,
                'question_text' => $question['question'] ?? $question['question_text'] ?? 'N/A',
                'question_type' => $question['type'] ?? $question['question_type'] ?? 'multiple_choice',
                'correct_answer' => $question['correct_answer'] ?? 'N/A',
                'student_answer' => $studentAnswer,
                'marks' => $question['marks'] ?? $question['points'] ?? 1,
                'options' => $question['options'] ?? null,
            ];
        }

        return [
            'quiz_title' => $quiz->title,
            'course_name' => $quiz->course->title ?? 'N/A',
            'total_marks' => $quiz->total_marks,
            'passing_score' => $quiz->passing_score ?? 0,
            'questions' => $questions,
        ];
    }

    /**
     * Get AI-powered feedback from Gemini 2.5 Flash API
     *
     * @param array $quizData
     * @return array
     */
    private function getGeminiAIFeedback(array $quizData): array
    {
        try {
            $apiKey = config('services.gemini.student_api_key');

            if (empty($apiKey)) {
                Log::warning('Gemini Student API key not configured');
                return $this->getFallbackFeedback($quizData);
            }

            // Build comprehensive prompt for Gemini
            $prompt = $this->buildEvaluationPrompt($quizData);

            // Call Gemini API
            $response = Http::timeout(30)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key={$apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.7,
                        'topK' => 40,
                        'topP' => 0.95,
                        'maxOutputTokens' => 2048,
                    ]
                ]);

            if ($response->successful()) {
                $data = $response->json();
                return $this->parseGeminiFeedback($data, $quizData);
            } else {
                Log::warning('Gemini API request failed', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                return $this->getFallbackFeedback($quizData);
            }

        } catch (\Exception $e) {
            Log::error('Gemini API Error: ' . $e->getMessage());
            return $this->getFallbackFeedback($quizData);
        }
    }

    /**
     * Build evaluation prompt for Gemini AI
     *
     * @param array $quizData
     * @return string
     */
    private function buildEvaluationPrompt(array $quizData): string
    {
        $questionsText = '';

        foreach ($quizData['questions'] as $q) {
            $questionsText .= "\n\nQuestion {$q['question_number']} ({$q['marks']} marks):\n";
            $questionsText .= "Type: {$q['question_type']}\n";
            $questionsText .= "Question: {$q['question_text']}\n";

            if ($q['options']) {
                $questionsText .= "Options: " . json_encode($q['options']) . "\n";
            }

            $questionsText .= "Correct Answer: {$q['correct_answer']}\n";
            $questionsText .= "Student Answer: {$q['student_answer']}\n";
        }

        return <<<PROMPT
You are an expert educational evaluator. Analyze this student's quiz submission and provide detailed, constructive feedback.

**Quiz Information:**
- Title: {$quizData['quiz_title']}
- Course: {$quizData['course_name']}
- Total Marks: {$quizData['total_marks']}
- Passing Score: {$quizData['passing_score']}

**Questions and Answers:**
{$questionsText}

**Your Task:**
Evaluate each answer and provide:

1. **Question-by-Question Analysis** (for each question):
   - Is the answer correct? (true/false)
   - Points earned
   - Explanation of why the answer is right or wrong
   - Specific improvement tips if incorrect

2. **Overall Feedback:**
   - General performance summary
   - Key strengths demonstrated
   - Areas needing improvement
   - Study recommendations

**Response Format (JSON):**
{
  "question_feedback": [
    {
      "question_number": 1,
      "is_correct": true/false,
      "points_earned": number,
      "explanation": "detailed explanation",
      "improvement_tip": "specific advice"
    }
  ],
  "overall_feedback": "general summary",
  "strengths": ["strength 1", "strength 2"],
  "improvements": ["area 1", "area 2"],
  "recommendations": ["recommendation 1", "recommendation 2"]
}

Provide encouraging, professional feedback that helps the student learn and improve.
PROMPT;
    }

    /**
     * Parse Gemini API response into structured feedback
     *
     * @param array $apiResponse
     * @param array $quizData
     * @return array
     */
    private function parseGeminiFeedback(array $apiResponse, array $quizData): array
    {
        try {
            $text = $apiResponse['candidates'][0]['content']['parts'][0]['text'] ?? '';

            // Extract JSON from response (it might be wrapped in markdown code blocks)
            if (preg_match('/```json\s*(.*?)\s*```/s', $text, $matches)) {
                $jsonText = $matches[1];
            } elseif (preg_match('/\{.*\}/s', $text, $matches)) {
                $jsonText = $matches[0];
            } else {
                $jsonText = $text;
            }

            $feedback = json_decode($jsonText, true);

            if (json_last_error() === JSON_ERROR_NONE && is_array($feedback)) {
                return [
                    'question_feedback' => $feedback['question_feedback'] ?? [],
                    'overall_feedback' => $feedback['overall_feedback'] ?? 'Quiz completed successfully.',
                    'strengths' => $feedback['strengths'] ?? [],
                    'improvements' => $feedback['improvements'] ?? [],
                    'recommendations' => $feedback['recommendations'] ?? [],
                    'ai_generated' => true,
                ];
            }

            // If JSON parsing fails, extract key information from text
            return [
                'overall_feedback' => $text,
                'strengths' => $this->extractListFromText($text, 'strength'),
                'improvements' => $this->extractListFromText($text, 'improvement'),
                'recommendations' => $this->extractListFromText($text, 'recommendation'),
                'ai_generated' => true,
            ];

        } catch (\Exception $e) {
            Log::error('Error parsing Gemini feedback: ' . $e->getMessage());
            return $this->getFallbackFeedback($quizData);
        }
    }

    /**
     * Extract list items from text
     *
     * @param string $text
     * @param string $keyword
     * @return array
     */
    private function extractListFromText(string $text, string $keyword): array
    {
        $items = [];
        $pattern = "/-\s*(.+?)(?=\n-|\n\n|$)/s";

        if (preg_match_all($pattern, $text, $matches)) {
            foreach ($matches[1] as $match) {
                if (stripos($match, $keyword) !== false) {
                    $items[] = trim($match);
                }
            }
        }

        return array_slice($items, 0, 5); // Limit to 5 items
    }

    /**
     * Get fallback feedback when AI is unavailable
     *
     * @param array $quizData
     * @return array
     */
    private function getFallbackFeedback(array $quizData): array
    {
        $questionFeedback = [];

        foreach ($quizData['questions'] as $q) {
            $isCorrect = strtolower(trim($q['student_answer'])) === strtolower(trim($q['correct_answer']));

            $questionFeedback[] = [
                'question_number' => $q['question_number'],
                'is_correct' => $isCorrect,
                'points_earned' => $isCorrect ? $q['marks'] : 0,
                'explanation' => $isCorrect
                    ? 'Your answer is correct!'
                    : "The correct answer is: {$q['correct_answer']}",
                'improvement_tip' => $isCorrect
                    ? 'Great job! Keep up the good work.'
                    : 'Review the course material related to this topic.',
            ];
        }

        return [
            'question_feedback' => $questionFeedback,
            'overall_feedback' => 'Quiz completed. Review your answers carefully.',
            'strengths' => ['Completed the quiz', 'Submitted all answers'],
            'improvements' => ['Review incorrect answers', 'Study the course materials'],
            'recommendations' => ['Practice more quizzes', 'Consult with your instructor'],
            'ai_generated' => false,
        ];
    }

    /**
     * Process quiz results and create attempt record
     *
     * @param Quiz $quiz
     * @param array $answers
     * @param array $aiFeedback
     * @param int $studentId
     * @param int $timeSpent
     * @return array
     */
    private function processQuizResults(Quiz $quiz, array $answers, array $aiFeedback, int $studentId, int $timeSpent): array
    {
        $totalScore = 0;
        $correctAnswers = 0;

        // Calculate score from AI feedback
        if (isset($aiFeedback['question_feedback'])) {
            foreach ($aiFeedback['question_feedback'] as $qf) {
                $totalScore += $qf['points_earned'] ?? 0;
                if ($qf['is_correct'] ?? false) {
                    $correctAnswers++;
                }
            }
        } else {
            // Fallback calculation
            $quizQuestions = is_string($quiz->questions)
                ? json_decode($quiz->questions, true)
                : (is_array($quiz->questions) ? $quiz->questions : []);

            foreach ($quizQuestions as $index => $question) {
                $questionNumber = $index + 1;
                $studentAnswer = $answers[$questionNumber] ?? $answers[$index] ?? '';
                $correctAnswer = $question['correct_answer'] ?? '';
                $marks = $question['marks'] ?? $question['points'] ?? 1;

                if (strtolower(trim($studentAnswer)) === strtolower(trim($correctAnswer))) {
                    $totalScore += $marks;
                    $correctAnswers++;
                }
            }
        }

        $percentage = $quiz->total_marks > 0 ? ($totalScore / $quiz->total_marks) * 100 : 0;
        $passed = $percentage >= ($quiz->passing_score ?? 60);

        // Create quiz attempt record
        $attempt = QuizAttempt::create([
            'quiz_id' => $quiz->id,
            'student_id' => $studentId,
            'score' => $totalScore,
            'answers' => $answers,
            'ai_feedback' => $aiFeedback,
            'time_spent' => $timeSpent,
            'passed' => $passed,
            'submitted_at' => now(),
        ]);

        return [
            'attempt_id' => $attempt->id,
            'score' => $totalScore,
            'percentage' => round($percentage, 2),
            'passed' => $passed,
            'correct_answers' => $correctAnswers,
        ];
    }

    /**
     * Get student's quiz attempts history
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getQuizAttempts(Request $request)
    {
        try {
            $student = auth()->user();
            $quizId = $request->input('quiz_id');

            $query = QuizAttempt::where('student_id', $student->id)
                ->with(['quiz:id,title,total_marks']);

            if ($quizId) {
                $query->where('quiz_id', $quizId);
            }

            $attempts = $query->orderBy('submitted_at', 'desc')->get();

            return response()->json([
                'success' => true,
                'data' => $attempts
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error fetching quiz attempts: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve quiz attempts'
            ], 500);
        }
    }
}
