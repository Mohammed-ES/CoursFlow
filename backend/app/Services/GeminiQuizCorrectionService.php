<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use Exception;

class GeminiQuizCorrectionService
{
    private string $apiKey;
    private string $apiUrl;
    private string $model = 'gemini-2.0-flash-exp';

    public function __construct()
    {
        $this->apiKey = config('services.gemini.api_key');
        $this->apiUrl = 'https://generativelanguage.googleapis.com/v1beta/models/';

        if (empty($this->apiKey)) {
            throw new Exception('Gemini API key not configured. Set GEMINI_API_KEY in .env file.');
        }
    }

    /**
     * Correct quiz answers using Gemini AI.
     *
     * @param array $questions Array of quiz questions with correct answers
     * @param array $studentAnswers Array of student's answers
     * @return array Corrected result with score, feedback, and corrections
     */
    public function correctQuiz(array $questions, array $studentAnswers): array
    {
        try {
            $prompt = $this->buildCorrectionPrompt($questions, $studentAnswers);

            $response = Http::timeout(60)
                ->withHeaders([
                    'Content-Type' => 'application/json',
                ])
                ->post("{$this->apiUrl}{$this->model}:generateContent?key={$this->apiKey}", [
                    'contents' => [
                        [
                            'parts' => [
                                ['text' => $prompt]
                            ]
                        ]
                    ],
                    'generationConfig' => [
                        'temperature' => 0.4,
                        'topK' => 40,
                        'topP' => 0.95,
                        'maxOutputTokens' => 2048,
                    ],
                    'safetySettings' => [
                        [
                            'category' => 'HARM_CATEGORY_HARASSMENT',
                            'threshold' => 'BLOCK_NONE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_HATE_SPEECH',
                            'threshold' => 'BLOCK_NONE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                            'threshold' => 'BLOCK_NONE'
                        ],
                        [
                            'category' => 'HARM_CATEGORY_DANGEROUS_CONTENT',
                            'threshold' => 'BLOCK_NONE'
                        ]
                    ]
                ]);

            if (!$response->successful()) {
                Log::error('Gemini API Error', [
                    'status' => $response->status(),
                    'body' => $response->body()
                ]);
                throw new Exception('Failed to get response from Gemini API: ' . $response->body());
            }

            $result = $response->json();

            if (!isset($result['candidates'][0]['content']['parts'][0]['text'])) {
                throw new Exception('Invalid response format from Gemini API');
            }

            $aiResponse = $result['candidates'][0]['content']['parts'][0]['text'];

            return $this->parseAiResponse($aiResponse, $questions, $studentAnswers);

        } catch (Exception $e) {
            Log::error('Quiz Correction Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Fallback to basic correction if AI fails
            return $this->fallbackCorrection($questions, $studentAnswers);
        }
    }

    /**
     * Build the correction prompt for Gemini.
     */
    private function buildCorrectionPrompt(array $questions, array $studentAnswers): string
    {
        $prompt = "You are an educational AI assistant. Your task is to correct a student's quiz and provide constructive feedback.\n\n";
        $prompt .= "**IMPORTANT**: Respond ONLY with valid JSON. Do not include any markdown formatting, code blocks, or explanations outside the JSON structure.\n\n";
        $prompt .= "Quiz Questions and Student Answers:\n\n";

        foreach ($questions as $index => $question) {
            $questionNum = $index + 1;
            $studentAnswer = $studentAnswers[$index] ?? ['answer' => 'No answer provided'];

            $prompt .= "Question {$questionNum}:\n";
            $prompt .= "Question: {$question['question']}\n";
            $prompt .= "Type: {$question['type']}\n";

            if ($question['type'] === 'multiple_choice' && isset($question['options'])) {
                $prompt .= "Options: " . json_encode($question['options']) . "\n";
            }

            $prompt .= "Correct Answer: {$question['correct_answer']}\n";
            $prompt .= "Student's Answer: {$studentAnswer['answer']}\n";
            $prompt .= "Points: {$question['points']}\n\n";
        }

        $prompt .= "\nPlease analyze each answer and return a JSON response with this exact structure:\n";
        $prompt .= "{\n";
        $prompt .= '  "overall_score": <percentage 0-100>,'."\n";
        $prompt .= '  "total_points_earned": <number>,'."\n";
        $prompt .= '  "total_points_possible": <number>,'."\n";
        $prompt .= '  "correct_count": <number>,'."\n";
        $prompt .= '  "feedback": ['."\n";
        $prompt .= "    {\n";
        $prompt .= '      "question_number": <number>,'."\n";
        $prompt .= '      "is_correct": <true/false>,'."\n";
        $prompt .= '      "points_earned": <number>,'."\n";
        $prompt .= '      "correct_answer": "<answer>",'."\n";
        $prompt .= '      "student_answer": "<answer>",'."\n";
        $prompt .= '      "explanation": "<detailed explanation>",'."\n";
        $prompt .= '      "improvement_tip": "<constructive suggestion>"'."\n";
        $prompt .= "    }\n";
        $prompt .= "  ],\n";
        $prompt .= '  "general_feedback": "<overall assessment>",'."\n";
        $prompt .= '  "strengths": ["<strength 1>", "<strength 2>"],'."\n";
        $prompt .= '  "areas_for_improvement": ["<area 1>", "<area 2>"]'."\n";
        $prompt .= "}\n\n";
        $prompt .= "Provide encouraging and constructive feedback. Respond ONLY with the JSON object, no additional text.";

        return $prompt;
    }

    /**
     * Parse AI response and structure the result.
     */
    private function parseAiResponse(string $aiResponse, array $questions, array $studentAnswers): array
    {
        // Remove markdown code blocks if present
        $aiResponse = preg_replace('/```json\s*|\s*```/', '', $aiResponse);
        $aiResponse = trim($aiResponse);

        $parsed = json_decode($aiResponse, true);

        if (json_last_error() !== JSON_ERROR_NONE) {
            Log::warning('Failed to parse AI response as JSON', ['response' => $aiResponse]);
            return $this->fallbackCorrection($questions, $studentAnswers);
        }

        return [
            'score' => $parsed['overall_score'] ?? 0,
            'total_points_earned' => $parsed['total_points_earned'] ?? 0,
            'total_points_possible' => $parsed['total_points_possible'] ?? 0,
            'correct_count' => $parsed['correct_count'] ?? 0,
            'total_questions' => count($questions),
            'feedback' => $parsed['feedback'] ?? [],
            'general_feedback' => $parsed['general_feedback'] ?? 'Quiz corrected successfully.',
            'strengths' => $parsed['strengths'] ?? [],
            'areas_for_improvement' => $parsed['areas_for_improvement'] ?? [],
            'corrected_by' => 'Gemini AI',
            'corrected_at' => now()->toISOString(),
        ];
    }

    /**
     * Fallback correction method if AI fails.
     */
    private function fallbackCorrection(array $questions, array $studentAnswers): array
    {
        $correctCount = 0;
        $totalPoints = 0;
        $earnedPoints = 0;
        $feedback = [];

        foreach ($questions as $index => $question) {
            $studentAnswer = $studentAnswers[$index] ?? ['answer' => ''];
            $isCorrect = $this->compareAnswers(
                $studentAnswer['answer'] ?? '',
                $question['correct_answer'],
                $question['type']
            );

            $points = $question['points'] ?? 1;
            $totalPoints += $points;

            if ($isCorrect) {
                $correctCount++;
                $earnedPoints += $points;
            }

            $feedback[] = [
                'question_number' => $index + 1,
                'is_correct' => $isCorrect,
                'points_earned' => $isCorrect ? $points : 0,
                'correct_answer' => $question['correct_answer'],
                'student_answer' => $studentAnswer['answer'] ?? 'No answer',
                'explanation' => $isCorrect
                    ? 'Correct answer!'
                    : 'Incorrect. The correct answer is: ' . $question['correct_answer'],
                'improvement_tip' => $isCorrect ? 'Keep up the good work!' : 'Review this topic for better understanding.',
            ];
        }

        $score = $totalPoints > 0 ? round(($earnedPoints / $totalPoints) * 100, 2) : 0;

        return [
            'score' => $score,
            'total_points_earned' => $earnedPoints,
            'total_points_possible' => $totalPoints,
            'correct_count' => $correctCount,
            'total_questions' => count($questions),
            'feedback' => $feedback,
            'general_feedback' => "You scored {$score}%. " . ($score >= 70 ? 'Good job!' : 'Keep practicing!'),
            'strengths' => [],
            'areas_for_improvement' => [],
            'corrected_by' => 'Automated System',
            'corrected_at' => now()->toISOString(),
        ];
    }

    /**
     * Compare student answer with correct answer.
     */
    private function compareAnswers(string $studentAnswer, string $correctAnswer, string $questionType): bool
    {
        $studentAnswer = trim(strtolower($studentAnswer));
        $correctAnswer = trim(strtolower($correctAnswer));

        if ($questionType === 'multiple_choice' || $questionType === 'true_false') {
            return $studentAnswer === $correctAnswer;
        }

        // For text answers, allow some flexibility
        return $studentAnswer === $correctAnswer ||
               str_contains($correctAnswer, $studentAnswer) ||
               similar_text($studentAnswer, $correctAnswer) / strlen($correctAnswer) > 0.8;
    }
}
