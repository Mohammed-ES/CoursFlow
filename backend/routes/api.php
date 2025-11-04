<?php

use App\Http\Controllers\Api\MessageController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\GoogleAuthController;
use App\Http\Controllers\Api\AdminController;
use App\Http\Controllers\Api\TeacherController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\AttendanceController;
use App\Http\Controllers\Api\QuizController;
use App\Http\Controllers\Api\NotificationController;
use App\Http\Controllers\Api\CalendarController;
use App\Http\Controllers\Api\ReportController;
use App\Http\Controllers\Api\StudentController;
use App\Http\Controllers\Api\StudentNotificationController;
use App\Http\Controllers\Api\StudentCalendarController;
use App\Http\Controllers\Student\StudentQuizController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
*/

// Google OAuth Routes (Public - No Auth Required)
Route::prefix('auth/google')->group(function () {
    Route::get('/', [GoogleAuthController::class, 'redirectToGoogle']);
    Route::get('/callback', [GoogleAuthController::class, 'handleGoogleCallback']);
});

// Authentication routes (public)
Route::post('/admin/login', [AuthController::class, 'login']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    // Courses (accessible to all authenticated users)
    Route::get('/courses', [CourseController::class, 'index']);

    Route::get('/user', function (Request $request) {
        return $request->user();
    });
});

// Routes pour la messagerie (protégées par Sanctum)
Route::middleware('auth:sanctum')->prefix('admin')->group(function () {
    // Auth routes
    Route::post('/logout', [AuthController::class, 'logout']);
    Route::get('/me', [AuthController::class, 'me']);

    // Dashboard Statistics
    Route::get('/dashboard/stats', [AdminController::class, 'getDashboardStats']);
    Route::get('/dashboard/activities', [AdminController::class, 'getRecentActivities']);

    // Students Management
    Route::get('/students', [AdminController::class, 'getStudents']);
    Route::get('/students/deleted', [AdminController::class, 'getDeletedStudents']);
    Route::post('/students', [AdminController::class, 'createStudent']);
    Route::put('/students/{id}', [AdminController::class, 'updateStudent']);
    Route::delete('/students/{id}', [AdminController::class, 'deleteStudent']);
    Route::post('/students/{id}/restore', [AdminController::class, 'restoreStudent']);
    Route::get('/students/{id}/courses', [AdminController::class, 'getStudentCourses']);
    Route::put('/students/{id}/courses', [AdminController::class, 'updateStudentCourses']);

    // Teachers Management
    Route::get('/teachers', [AdminController::class, 'getTeachers']);
    Route::post('/teachers', [AdminController::class, 'createTeacher']);
    Route::put('/teachers/{id}', [AdminController::class, 'updateTeacher']);
    Route::delete('/teachers/{id}', [AdminController::class, 'deleteTeacher']);

    // Payments Management
    Route::get('/payments', [AdminController::class, 'getPayments']);
    Route::get('/payments/stats', [AdminController::class, 'getPaymentStats']);
    Route::get('/students/{userId}/enrolled-courses', [AdminController::class, 'getStudentEnrolledCourses']);
    Route::post('/payments', [AdminController::class, 'createPayment']);
    Route::put('/payments/{id}', [AdminController::class, 'updatePayment']);
    Route::delete('/payments/{id}', [AdminController::class, 'deletePayment']);

    // Notifications Management
    Route::get('/notifications', [AdminController::class, 'getAllNotifications']);
    Route::post('/notifications', [AdminController::class, 'createNotification']);
    Route::put('/notifications/{id}', [AdminController::class, 'updateNotification']);
    Route::delete('/notifications/{id}', [AdminController::class, 'deleteNotification']);
    Route::post('/notifications/{id}/publish', [AdminController::class, 'publishNotification']);
    Route::post('/notifications/{id}/unpublish', [AdminController::class, 'unpublishNotification']);

    // Admin Profile Management
    Route::get('/profile', [AdminController::class, 'getProfile']);
    Route::put('/profile', [AdminController::class, 'updateProfile']);
    Route::put('/password', [AdminController::class, 'changePassword']);

    // Conversations
    Route::get('/conversations', [MessageController::class, 'getConversations']);

    // Messages
    Route::get('/conversations/{conversationId}/messages', [MessageController::class, 'getMessages']);
    Route::post('/messages', [MessageController::class, 'sendMessage']);
    Route::put('/conversations/{conversationId}/read', [MessageController::class, 'markAsRead']);
});

// ==================== TEACHERS MODULE ROUTES ====================
Route::middleware('auth:sanctum')->prefix('teachers')->group(function () {

    // Teacher Dashboard
    Route::get('/dashboard', [TeacherController::class, 'dashboard']);

    // Teacher Profile
    Route::get('/profile', [TeacherController::class, 'getProfile']);
    Route::put('/profile', [TeacherController::class, 'updateProfile']);
    Route::put('/profile/password', [TeacherController::class, 'updatePassword']);

    // Students Management
    Route::get('/students', [TeacherController::class, 'getStudents']);
    Route::get('/students/{id}', [TeacherController::class, 'getStudent']);

    // Courses Management
    // Specific routes first (before apiResource to avoid conflicts)
    Route::get('/courses/{id}/materials', [CourseController::class, 'getMaterials']);
    Route::post('/courses/{id}/materials', [CourseController::class, 'uploadMaterial']);
    Route::delete('/courses/{courseId}/materials/{materialId}', [CourseController::class, 'deleteMaterial']);
    Route::get('/courses/{courseId}/materials/{materialId}/download', [CourseController::class, 'downloadMaterial']);

    // Resource routes (CRUD)
    Route::apiResource('courses', CourseController::class);

    // Attendance Management
    Route::get('/attendance', [AttendanceController::class, 'index']);
    Route::post('/attendance', [AttendanceController::class, 'store']);
    Route::post('/attendance/bulk', [AttendanceController::class, 'bulkStore']);
    Route::get('/attendance/statistics/{courseId}', [AttendanceController::class, 'statistics']);
    Route::get('/attendance/export', [AttendanceController::class, 'export']);

    // Quiz Management
    Route::apiResource('quizzes', QuizController::class);
    Route::post('/quizzes/generate-ai', [QuizController::class, 'generateWithAI']);
    Route::post('/quizzes/save-ai', [QuizController::class, 'saveAIQuiz']);
    Route::get('/quizzes/{id}/results', [QuizController::class, 'results']);

    // Unread notification count (MUST be before apiResource)
    Route::get('/notifications/unread-count', [NotificationController::class, 'getUnreadCount']);

    // Notifications Management (Teacher's own notifications)
    Route::apiResource('notifications', NotificationController::class);
    Route::post('/notifications/{id}/publish', [NotificationController::class, 'publish']);
    Route::post('/notifications/{id}/unpublish', [NotificationController::class, 'unpublish']);

    // Admin Notifications (Received from admin)
    Route::get('/admin-notifications', [NotificationController::class, 'getAdminNotifications']);
    Route::post('/admin-notifications/{id}/mark-read', [NotificationController::class, 'markAdminNotificationAsRead']);

    // Calendar Events Management
    Route::apiResource('calendar', CalendarController::class);
    Route::get('/calendar/upcoming', [CalendarController::class, 'upcoming']);
});

// ==================== STUDENT MODULE ROUTES ====================
Route::middleware('auth:sanctum')->prefix('student')->group(function () {

    // Student Dashboard
    Route::get('/dashboard', [StudentController::class, 'dashboard']);

    // Student Profile
    Route::get('/profile', [StudentController::class, 'getProfile']);
    Route::put('/profile', [StudentController::class, 'updateProfile']);

    // Notifications
    Route::get('/notifications/unread-count', [StudentController::class, 'getUnreadNotificationCount']);
    Route::get('/notifications', [StudentController::class, 'getNotifications']);
    Route::post('/notifications/{id}/read', [StudentController::class, 'markNotificationAsRead']);

    // Courses (only paid courses)
    Route::get('/courses', [StudentController::class, 'getCourses']);
    Route::get('/courses/{id}', [StudentController::class, 'getCourseDetails']);
    Route::post('/courses/{id}/progress', [StudentController::class, 'updateProgress']);
    Route::get('/courses/{courseId}/download/{fileType}', [StudentController::class, 'downloadFile']);

    // Quizzes
    Route::get('/quizzes', [StudentController::class, 'getQuizzes']);
    Route::get('/quizzes/{id}', [StudentController::class, 'getQuizDetails']);
    Route::post('/quizzes/{id}/submit', [StudentController::class, 'submitQuiz']);
    Route::get('/quizzes/{id}/attempts', [StudentController::class, 'getQuizAttempts']);

    // AI-Powered Quiz Evaluation (Gemini 2.5 Flash)
    Route::post('/analyze-quiz', [StudentQuizController::class, 'analyzeStudentQuiz']);
    Route::get('/quiz-attempts', [StudentQuizController::class, 'getQuizAttempts']);

    // Notifications
    Route::get('/notifications/unread-count', [StudentNotificationController::class, 'unreadCount']);
    Route::get('/notifications', [StudentNotificationController::class, 'index']);
    Route::post('/notifications/{id}/mark-read', [StudentNotificationController::class, 'markAsRead']);
    Route::post('/notifications/mark-all-read', [StudentNotificationController::class, 'markAllAsRead']);
    Route::delete('/notifications/{id}', [StudentNotificationController::class, 'destroy']);

    // Admin Notifications for Students
    Route::get('/admin-notifications', [NotificationController::class, 'getAdminNotificationsForStudent']);
    Route::post('/admin-notifications/{id}/mark-read', [NotificationController::class, 'markAdminNotificationAsReadForStudent']);

    // Teacher Notifications for Students
    Route::get('/teacher-notifications', [NotificationController::class, 'getTeacherNotificationsForStudent']);
    Route::post('/teacher-notifications/{id}/mark-read', [NotificationController::class, 'markTeacherNotificationAsReadForStudent']);

    // Calendar
    Route::get('/calendar', [StudentCalendarController::class, 'index']);
    Route::post('/calendar', [StudentCalendarController::class, 'store']);
    Route::put('/calendar/{id}', [StudentCalendarController::class, 'update']);
    Route::delete('/calendar/{id}', [StudentCalendarController::class, 'destroy']);
});

