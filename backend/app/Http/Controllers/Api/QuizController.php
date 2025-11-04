<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Quiz;
use App\Models\Course;
use App\Models\QuizResult;
use App\Services\GeminiService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class QuizController extends Controller
{
    protected $geminiService;

    /**
     * Inject GeminiService via constructor
     */
    public function __construct(GeminiService $geminiService)
    {
        $this->geminiService = $geminiService;
    }
    /**
     * Get all quizzes for the authenticated teacher
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $query = Quiz::where('teacher_id', $teacher->id)
                ->with(['course'])
                ->withCount('results');

            // Filter by course
            if ($request->has('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by AI-generated
            if ($request->has('is_ai_generated')) {
                $query->where('is_ai_generated', $request->is_ai_generated);
            }

            // Order by created_at desc
            $query->orderBy('created_at', 'desc');

            $perPage = $request->input('per_page', 15);
            $quizzes = $query->paginate($perPage);

            // Transform data
            $quizzes->getCollection()->transform(function ($quiz) {
                return [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'duration_minutes' => $quiz->duration_minutes,
                    'total_marks' => $quiz->total_marks,
                    'passing_marks' => $quiz->passing_marks,
                    'difficulty' => $quiz->difficulty,
                    'status' => $quiz->status,
                    'is_ai_generated' => $quiz->is_ai_generated,
                    'is_available' => $quiz->is_available,
                    'available_from' => $quiz->available_from,
                    'available_until' => $quiz->available_until,
                    'questions_count' => is_array($quiz->questions) ? count($quiz->questions) : (is_string($quiz->questions) ? count(json_decode($quiz->questions, true) ?? []) : 0),
                    'results_count' => $quiz->results_count,
                    'average_score' => $quiz->average_score,
                    'completion_rate' => $quiz->completion_rate,
                    'course' => $quiz->course ? [
                        'id' => $quiz->course->id,
                        'title' => $quiz->course->title,
                    ] : null,
                    'created_at' => $quiz->created_at,
                ];
            });

            return response()->json($quizzes);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch quizzes', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single quiz with questions
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $quiz = Quiz::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->with(['course'])
                ->withCount('results')
                ->first();

            if (!$quiz) {
                return response()->json(['error' => 'Quiz not found'], 404);
            }

            return response()->json([
                'id' => $quiz->id,
                'title' => $quiz->title,
                'description' => $quiz->description,
                'duration_minutes' => $quiz->duration_minutes,
                'total_marks' => $quiz->total_marks,
                'passing_marks' => $quiz->passing_marks,
                'difficulty' => $quiz->difficulty,
                'status' => $quiz->status,
                'is_ai_generated' => $quiz->is_ai_generated,
                'is_available' => $quiz->is_available,
                'available_from' => $quiz->available_from,
                'available_until' => $quiz->available_until,
                'questions' => is_string($quiz->questions) ? json_decode($quiz->questions, true) : $quiz->questions,
                'results_count' => $quiz->results_count,
                'average_score' => $quiz->average_score,
                'completion_rate' => $quiz->completion_rate,
                'course' => $quiz->course ? [
                    'id' => $quiz->course->id,
                    'title' => $quiz->course->title,
                    'subject' => $quiz->course->subject,
                ] : null,
                'created_at' => $quiz->created_at,
                'updated_at' => $quiz->updated_at,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new quiz manually
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'questions' => 'required|array|min:1',
                'questions.*.question' => 'required|string',
                'questions.*.type' => 'required|in:multiple_choice,true_false,short_answer',
                'questions.*.options' => 'required_if:questions.*.type,multiple_choice|array',
                'questions.*.correct_answer' => 'required',
                'questions.*.points' => 'required|integer|min:1',
                'duration_minutes' => 'required|integer|min:1',
                'total_marks' => 'required|integer|min:1',
                'passing_marks' => 'required|integer|min:1',
                'difficulty' => 'required|in:easy,medium,hard',
                'status' => 'required|in:draft,published,archived',
                'available_from' => 'nullable|date',
                'available_until' => 'nullable|date|after:available_from',
            ]);

            // Verify course belongs to teacher
            $course = Course::where('id', $validated['course_id'])
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            $validated['teacher_id'] = $teacher->id;
            $validated['is_ai_generated'] = false;

            $quiz = Quiz::create($validated);

            return response()->json([
                'message' => 'Quiz created successfully',
                'quiz' => $quiz->load('course'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing quiz
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $quiz = Quiz::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$quiz) {
                return response()->json(['error' => 'Quiz not found'], 404);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'questions' => 'sometimes|required|array|min:1',
                'duration_minutes' => 'sometimes|required|integer|min:1',
                'total_marks' => 'sometimes|required|integer|min:1',
                'passing_marks' => 'sometimes|required|integer|min:1',
                'difficulty' => 'sometimes|required|in:easy,medium,hard',
                'status' => 'sometimes|required|in:draft,published,archived',
                'available_from' => 'nullable|date',
                'available_until' => 'nullable|date|after:available_from',
            ]);

            $quiz->update($validated);

            return response()->json([
                'message' => 'Quiz updated successfully',
                'quiz' => $quiz->fresh()->load('course'),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a quiz
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $quiz = Quiz::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$quiz) {
                return response()->json(['error' => 'Quiz not found'], 404);
            }

            // Delete all results first
            QuizResult::where('quiz_id', $id)->delete();

            $quiz->delete();

            return response()->json([
                'message' => 'Quiz deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Generate quiz questions using Gemini AI
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function generateWithAI(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'topic' => 'required|string|max:500',
                'num_questions' => 'required|integer|min:5|max:20',
                'difficulty' => 'required|in:easy,medium,hard',
                'question_types' => 'required|array',
                'question_types.*' => 'in:multiple_choice,true_false',
            ]);

            // Verify course belongs to teacher
            $course = Course::where('id', $validated['course_id'])
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            // Use GeminiService to generate quiz
            $questions = $this->geminiService->generateQuiz(
                $course->subject,
                $validated['topic'],
                $validated['num_questions'],
                $validated['difficulty'],
                $validated['question_types']
            );

            // Calculate total marks
            $totalMarks = array_sum(array_column($questions, 'points'));

            // Return generated quiz data (not saved yet, teacher can review)
            return response()->json([
                'message' => 'Quiz generated successfully with AI',
                'quiz_data' => [
                    'title' => $validated['topic'] . ' Quiz',
                    'description' => "AI-generated quiz on {$validated['topic']} for {$course->title}",
                    'questions' => $questions,
                    'total_marks' => $totalMarks,
                    'passing_marks' => (int)($totalMarks * 0.6), // 60% passing
                    'difficulty' => $validated['difficulty'],
                    'duration_minutes' => $validated['num_questions'] * 2, // 2 min per question
                    'course_id' => $validated['course_id'],
                    'is_ai_generated' => true,
                ],
            ], 201);

        } catch (\Exception $e) {
            Log::error('Quiz AI generation error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to generate quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Save AI-generated quiz after teacher review
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function saveAIQuiz(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'questions' => 'required|array|min:1',
                'duration_minutes' => 'required|integer|min:1',
                'total_marks' => 'required|integer|min:1',
                'passing_marks' => 'required|integer|min:1',
                'difficulty' => 'required|in:easy,medium,hard',
                'status' => 'required|in:draft,published',
                'available_from' => 'nullable|date',
                'available_until' => 'nullable|date|after:available_from',
            ]);

            // Verify course belongs to teacher
            $course = Course::where('id', $validated['course_id'])
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            $validated['teacher_id'] = $teacher->id;
            $validated['is_ai_generated'] = true;

            $quiz = Quiz::create($validated);

            return response()->json([
                'message' => 'AI-generated quiz saved successfully',
                'quiz' => $quiz->load('course'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to save quiz', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get quiz results and statistics
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function results($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $quiz = Quiz::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$quiz) {
                return response()->json(['error' => 'Quiz not found'], 404);
            }

            $results = QuizResult::where('quiz_id', $id)
                ->with(['student.user'])
                ->where('status', 'completed')
                ->orderBy('percentage', 'desc')
                ->get();

            $results = $results->map(function ($result) {
                return [
                    'id' => $result->id,
                    'student' => [
                        'id' => $result->student->id,
                        'name' => $result->student->user->name,
                        'student_code' => $result->student->student_code,
                    ],
                    'score' => $result->score,
                    'percentage' => $result->percentage,
                    'grade' => $result->grade,
                    'is_passed' => $result->is_passed,
                    'time_taken_minutes' => $result->time_taken_minutes,
                    'submitted_at' => $result->submitted_at,
                ];
            });

            return response()->json([
                'quiz' => [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'total_marks' => $quiz->total_marks,
                    'passing_marks' => $quiz->passing_marks,
                ],
                'statistics' => [
                    'total_attempts' => $results->count(),
                    'average_score' => $quiz->average_score,
                    'highest_score' => $results->max('percentage'),
                    'lowest_score' => $results->min('percentage'),
                    'pass_rate' => $results->count() > 0
                        ? round(($results->where('is_passed', true)->count() / $results->count()) * 100, 2)
                        : 0,
                ],
                'results' => $results,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch results', 'message' => $e->getMessage()], 500);
        }
    }
}
