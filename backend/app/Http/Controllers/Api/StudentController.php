<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Student;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\QuizAttempt;
use App\Models\Notification;
use App\Models\CalendarEvent;
use App\Services\GeminiQuizCorrectionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class StudentController extends Controller
{
    protected $geminiService;

    public function __construct(GeminiQuizCorrectionService $geminiService)
    {
        $this->geminiService = $geminiService;
    }

    /**
     * Get student dashboard statistics.
     */
    public function dashboard(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get paid courses count
            $totalCourses = $student->paidCourses()->count();

            // Get average progress across all courses
            $avgProgress = $student->paidCourses()->avg('course_student.progress') ?? 0;

            // Get unread notifications count
            $unreadNotifications = DB::table('student_notifications')
                ->where('student_id', $student->id)
                ->where('is_read', false)
                ->count();

            // Get average quiz score
            $avgQuizScore = $student->quizAttempts()
                ->whereNotNull('score')
                ->avg('score') ?? 0;

            // Get recent courses (last 5 enrolled)
            $recentCourses = $student->paidCourses()
                ->with('teacher.user:id,name')
                ->orderByPivot('enrolled_at', 'desc')
                ->limit(5)
                ->get()
                ->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'teacher' => $course->teacher->user->name ?? 'Unknown',
                        'progress' => $course->pivot->progress ?? 0,
                        'thumbnail' => $course->thumbnail,
                        'enrolled_at' => $course->pivot->enrolled_at,
                    ];
                });

            // Get upcoming events (next 7 days) - from teacher's courses the student is enrolled in
            $upcomingEvents = CalendarEvent::whereIn('course_id', $student->paidCourses()->pluck('courses.id'))
                ->where(function($query) {
                    $now = now();
                    $weekLater = now()->addDays(7);
                    $query->where(function($q) use ($now, $weekLater) {
                        $q->whereBetween('start_date', [$now, $weekLater])
                          ->orWhereBetween('start_time', [$now, $weekLater]);
                    });
                })
                ->orderByRaw('COALESCE(start_time, start_date) ASC')
                ->limit(5)
                ->get()
                ->map(function ($event) {
                    $startDateTime = $event->start_time ?? $event->start_date;
                    $endDateTime = $event->end_time ?? $event->end_date;

                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'type' => $event->type,
                        'start_date' => $startDateTime,
                        'end_date' => $endDateTime,
                        'location' => $event->location,
                        'color' => $event->color,
                    ];
                });

            // Get recent quiz attempts
            $recentQuizzes = $student->quizAttempts()
                ->with('quiz:id,title')
                ->latest()
                ->limit(5)
                ->get()
                ->map(function ($attempt) {
                    return [
                        'id' => $attempt->id,
                        'quiz_title' => $attempt->quiz->title ?? 'Unknown Quiz',
                        'score' => $attempt->score,
                        'submitted_at' => $attempt->submitted_at,
                        'passed' => $attempt->hasPassed(),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => [
                    'totalCourses' => $totalCourses,
                    'avgProgress' => round($avgProgress, 1),
                    'unreadNotifications' => $unreadNotifications,
                    'avgQuizScore' => round($avgQuizScore, 1),
                    'recentCourses' => $recentCourses,
                    'upcomingEvents' => $upcomingEvents,
                    'recentQuizzes' => $recentQuizzes,
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Student Dashboard Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student's paid courses.
     */
    public function getCourses(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $query = $student->paidCourses()
                ->with(['teacher.user:id,name,email']);

            // Search
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('description', 'like', "%{$search}%");
                });
            }

            // Sorting
            $sortBy = $request->get('sort_by', 'enrolled_at');
            $sortOrder = $request->get('sort_order', 'desc');

            if ($sortBy === 'progress') {
                $query->orderByPivot('progress', $sortOrder);
            } elseif ($sortBy === 'title') {
                $query->orderBy('title', $sortOrder);
            } else {
                $query->orderByPivot('enrolled_at', $sortOrder);
            }

            $perPage = $request->get('per_page', 12);
            $courses = $query->paginate($perPage);

            // Transform the data
            $courses->getCollection()->transform(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'thumbnail' => $course->thumbnail,
                    'duration_hours' => $course->duration_hours,
                    'teacher' => [
                        'id' => $course->teacher->id,
                        'name' => $course->teacher->user->name ?? 'Unknown',
                        'email' => $course->teacher->user->email ?? '',
                    ],
                    'progress' => $course->pivot->progress ?? 0,
                    'enrolled_at' => $course->pivot->enrolled_at,
                    'last_accessed_at' => $course->pivot->last_accessed_at,
                    'file_urls' => $course->file_urls ?? [],
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $courses
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get course details with files and lessons.
     */
    public function getCourseDetails(Request $request, $courseId)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Check if student has paid for this course
            if (!$student->hasPaidForCourse($courseId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have access to this course. Please complete payment.'
                ], 403);
            }

            $course = Course::with(['teacher.user:id,name,email', 'materials', 'quizzes'])
                ->findOrFail($courseId);

            // Note: last_accessed_at column doesn't exist in course_student table
            // Skip updating it for now

            // Get student's progress for this course
            $enrollment = DB::table('course_student')
                ->where('student_id', $student->id)
                ->where('course_id', $courseId)
                ->first();

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'thumbnail' => $course->thumbnail,
                    'duration_hours' => $course->duration_hours,
                    'teacher' => [
                        'id' => $course->teacher->id,
                        'name' => $course->teacher->user->name ?? 'Unknown',
                        'email' => $course->teacher->user->email ?? '',
                    ],
                    'progress' => $enrollment->progress ?? 0,
                    'enrolled_at' => $enrollment->enrolled_at ?? null,
                    'materials' => $course->materials ?? [],
                    'quizzes' => $course->quizzes->where('status', 'published')->values() ?? [],
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch course details',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Download course file.
     */
    public function downloadFile(Request $request, $courseId, $fileType)
    {
        try {
            $student = $request->user()->student;

            if (!$student || !$student->hasPaidForCourse($courseId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }

            $course = Course::findOrFail($courseId);
            $fileUrls = $course->file_urls ?? [];

            if (!isset($fileUrls[$fileType])) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found'
                ], 404);
            }

            $filePath = $fileUrls[$fileType];

            if (!Storage::exists($filePath)) {
                return response()->json([
                    'success' => false,
                    'message' => 'File not found on server'
                ], 404);
            }

            return Storage::download($filePath);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to download file',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update course progress.
     */
    public function updateProgress(Request $request, $courseId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'progress' => 'required|integer|min:0|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $student = $request->user()->student;

            if (!$student || !$student->hasPaidForCourse($courseId)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }

            DB::table('course_student')
                ->where('student_id', $student->id)
                ->where('course_id', $courseId)
                ->update([
                    'progress' => $request->progress,
                    'updated_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Progress updated successfully',
                'data' => ['progress' => $request->progress]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update progress',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get available quizzes for student.
     */
    public function getQuizzes(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get quizzes from paid courses
            $paidCourseIds = $student->paidCourses()->pluck('courses.id');

            $quizzes = Quiz::whereIn('course_id', $paidCourseIds)
                ->where('status', 'published')
                ->with(['course:id,title', 'teacher.user:id,name'])
                ->get()
                ->map(function ($quiz) use ($student) {
                    $attempts = QuizAttempt::where('quiz_id', $quiz->id)
                        ->where('student_id', $student->id)
                        ->count();

                    $bestScore = QuizAttempt::where('quiz_id', $quiz->id)
                        ->where('student_id', $student->id)
                        ->max('score');

                    return [
                        'id' => $quiz->id,
                        'title' => $quiz->title,
                        'description' => $quiz->description,
                        'course' => $quiz->course->title ?? 'Unknown',
                        'teacher' => $quiz->teacher->user->name ?? 'Unknown',
                        'duration_minutes' => $quiz->duration_minutes,
                        'total_marks' => $quiz->total_marks,
                        'passing_score' => $quiz->passing_score,
                        'attempts_count' => $attempts,
                        'best_score' => $bestScore,
                        'can_retake' => $quiz->allow_retake || $attempts === 0,
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $quizzes
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch quizzes',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get quiz details with questions.
     */
    public function getQuizDetails(Request $request, $quizId)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $quiz = Quiz::with(['questions', 'course:id,title'])
                ->findOrFail($quizId);

            // Check if student has access to this quiz's course
            $paidCourseIds = $student->paidCourses()->pluck('courses.id');

            if (!$paidCourseIds->contains($quiz->course_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'You do not have access to this quiz'
                ], 403);
            }

            // Check attempts
            $attemptsCount = QuizAttempt::where('quiz_id', $quizId)
                ->where('student_id', $student->id)
                ->count();

            if (!$quiz->allow_retake && $attemptsCount > 0) {
                return response()->json([
                    'success' => false,
                    'message' => 'You have already attempted this quiz and retakes are not allowed'
                ], 403);
            }

            // Remove correct answers from questions (student shouldn't see them)
            $questions = $quiz->questions->map(function ($question) {
                return [
                    'id' => $question->id,
                    'question' => $question->question,
                    'type' => $question->type,
                    'options' => $question->options,
                    'points' => $question->points,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $quiz->id,
                    'title' => $quiz->title,
                    'description' => $quiz->description,
                    'course' => $quiz->course->title ?? 'Unknown',
                    'duration_minutes' => $quiz->duration_minutes,
                    'total_marks' => $quiz->total_marks,
                    'passing_score' => $quiz->passing_score,
                    'instructions' => $quiz->instructions,
                    'questions' => $questions,
                    'attempts_remaining' => $quiz->allow_retake ? 'Unlimited' : (1 - $attemptsCount),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch quiz details',
                'error' => $e->getMessage()
            ], 404);
        }
    }

    /**
     * Submit quiz and get AI correction.
     */
    public function submitQuiz(Request $request, $quizId)
    {
        try {
            $validator = Validator::make($request->all(), [
                'answers' => 'required|array',
                'answers.*.question_id' => 'required|integer',
                'answers.*.answer' => 'required|string',
                'time_spent_seconds' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $quiz = Quiz::with('questions')->findOrFail($quizId);

            // Check access
            $paidCourseIds = $student->paidCourses()->pluck('courses.id');
            if (!$paidCourseIds->contains($quiz->course_id)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Access denied'
                ], 403);
            }

            // Prepare questions and answers for AI correction
            $questions = $quiz->questions->map(function ($q) {
                return [
                    'id' => $q->id,
                    'question' => $q->question,
                    'type' => $q->type,
                    'options' => $q->options,
                    'correct_answer' => $q->correct_answer,
                    'points' => $q->points,
                ];
            })->toArray();

            $studentAnswers = collect($request->answers)->map(function ($answer) {
                return [
                    'question_id' => $answer['question_id'],
                    'answer' => $answer['answer'],
                ];
            })->toArray();

            // Get AI correction
            $correction = $this->geminiService->correctQuiz($questions, $studentAnswers);

            // Save attempt to database
            $attempt = QuizAttempt::create([
                'quiz_id' => $quizId,
                'student_id' => $student->id,
                'answers' => $studentAnswers,
                'ai_feedback' => $correction,
                'score' => $correction['score'],
                'correct_answers' => $correction['correct_count'],
                'total_questions' => $correction['total_questions'],
                'submitted_at' => now(),
                'time_spent_seconds' => $request->time_spent_seconds ?? 0,
            ]);

            return response()->json([
                'success' => true,
                'data' => [
                    'attempt_id' => $attempt->id,
                    'score' => $correction['score'],
                    'correct_count' => $correction['correct_count'],
                    'total_questions' => $correction['total_questions'],
                    'passed' => $correction['score'] >= ($quiz->passing_score ?? 50),
                    'feedback' => $correction['feedback'],
                    'general_feedback' => $correction['general_feedback'],
                    'strengths' => $correction['strengths'],
                    'areas_for_improvement' => $correction['areas_for_improvement'],
                    'corrected_by' => $correction['corrected_by'],
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Quiz Submission Error', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to submit quiz',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get quiz attempt history.
     */
    public function getQuizAttempts(Request $request, $quizId)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $attempts = QuizAttempt::where('quiz_id', $quizId)
                ->where('student_id', $student->id)
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($attempt) {
                    return [
                        'id' => $attempt->id,
                        'score' => $attempt->score,
                        'correct_answers' => $attempt->correct_answers,
                        'total_questions' => $attempt->total_questions,
                        'passed' => $attempt->hasPassed(),
                        'submitted_at' => $attempt->submitted_at,
                        'time_spent' => $attempt->getTimeSpentInMinutes() . ' min',
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $attempts
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch attempts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student profile.
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            $student = $user->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get enrolled courses count
            $enrolledCoursesCount = $student->paidCourses()->count();

            // Get completed quizzes count (count distinct quizzes that have been attempted)
            $completedQuizzesCount = $student->quizAttempts()
                ->distinct('quiz_id')
                ->count('quiz_id');

            // Get average score
            $averageScore = $student->quizAttempts()
                ->whereNotNull('score')
                ->avg('score');

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $student->id,
                    'user_id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'student_code' => $student->student_code,
                    'phone' => $student->phone,
                    'address' => $student->address,
                    'date_of_birth' => $student->date_of_birth,
                    'profile_image' => $student->profile_image,
                    'status' => $student->status,
                    'enrolled_courses_count' => $enrolledCoursesCount,
                    'completed_quizzes_count' => $completedQuizzesCount,
                    'average_score' => $averageScore ? round($averageScore, 1) : null,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student profile.
     */
    public function updateProfile(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|string|max:255',
                'phone' => 'sometimes|string|max:20',
                'address' => 'sometimes|string|max:500',
                'date_of_birth' => 'sometimes|date',
                'profile_image' => 'sometimes|image|mimes:jpeg,png,jpg|max:2048',
                'current_password' => 'sometimes|required_with:password|string',
                'password' => 'sometimes|string|min:8|confirmed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'errors' => $validator->errors()
                ], 422);
            }

            $user = $request->user();
            $student = $user->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Update user name if provided
            if ($request->has('name')) {
                $user->name = $request->name;
            }

            // Handle password change
            if ($request->has('password') && $request->has('current_password')) {
                // Verify current password
                if (!Hash::check($request->current_password, $user->password)) {
                    return response()->json([
                        'success' => false,
                        'message' => 'Current password is incorrect'
                    ], 422);
                }

                // Update password
                $user->password = Hash::make($request->password);
            }

            $user->save();

            // Handle profile image upload
            if ($request->hasFile('profile_image')) {
                // Delete old image if exists
                if ($student->profile_image) {
                    Storage::delete($student->profile_image);
                }

                $path = $request->file('profile_image')->store('public/profiles');
                $student->profile_image = $path;
            }

            // Update student fields
            $student->fill($request->only(['phone', 'address', 'date_of_birth']));
            $student->save();

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => [
                    'name' => $user->name,
                    'phone' => $student->phone,
                    'address' => $student->address,
                    'date_of_birth' => $student->date_of_birth,
                    'profile_image' => $student->profile_image,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notification count
     */
    public function getUnreadNotificationCount(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $unreadCount = DB::table('student_notifications')
                ->where('student_id', $student->id)
                ->where('is_read', false)
                ->count();

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $unreadCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all notifications for student
     */
    public function getNotifications(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $notifications = DB::table('student_notifications')
                ->where('student_id', $student->id)
                ->orderBy('created_at', 'desc')
                ->limit(20)
                ->get();

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark notification as read
     */
    public function markNotificationAsRead(Request $request, $notificationId)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            DB::table('student_notifications')
                ->where('id', $notificationId)
                ->where('student_id', $student->id)
                ->update(['is_read' => true, 'updated_at' => now()]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark notification as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
