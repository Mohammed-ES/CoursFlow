<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Notification;
use Illuminate\Http\Request;

class StudentNotificationController extends Controller
{
    /**
     * Get student notifications.
     */
    public function index(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get all published notifications for the student's courses
            $studentCourseIds = $student->enrolledCourses()->pluck('courses.id')->toArray();

            $notifications = Notification::published()
                ->where(function ($query) use ($studentCourseIds) {
                    // Notifications globales (course_id null)
                    $query->whereNull('course_id')
                        // OU notifications pour les cours de l'étudiant
                        ->orWhereIn('course_id', $studentCourseIds);
                })
                ->with(['teacher.user', 'course'])
                ->latest('published_at')
                ->get()
                ->map(function ($notification) use ($student) {
                    // Check if student has read this notification
                    $pivot = $notification->students()->where('student_id', $student->id)->first();

                    return [
                        'id' => $notification->id,
                        'teacher_id' => $notification->teacher_id,
                        'course_id' => $notification->course_id,
                        'type' => $notification->type,
                        'title' => $notification->title,
                        'message' => $notification->content,
                        'priority' => $notification->priority,
                        'published_at' => $notification->published_at?->toISOString(),
                        'expires_at' => $notification->expires_at?->toISOString(),
                        'read_at' => $pivot?->pivot->read_at ? \Carbon\Carbon::parse($pivot->pivot->read_at)->toISOString() : null,
                        'created_at' => $notification->created_at->toISOString(),
                        'teacher' => $notification->teacher ? [
                            'id' => $notification->teacher->id,
                            'name' => $notification->teacher->user->name,
                        ] : null,
                        'course' => $notification->course ? [
                            'id' => $notification->course->id,
                            'title' => $notification->course->title,
                        ] : null,
                    ];
                });

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
     * Mark notification as read.
     */
    public function markAsRead(Request $request, $id)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $notification = Notification::findOrFail($id);

            // Attach or update pivot table with read_at timestamp
            $student->notifications()->syncWithoutDetaching([
                $notification->id => ['read_at' => now()]
            ]);

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

    /**
     * Mark all notifications as read.
     */
    public function markAllAsRead(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Get all notifications for the student
            $studentCourseIds = $student->enrolledCourses()->pluck('courses.id')->toArray();

            $notificationIds = Notification::published()
                ->where(function ($query) use ($studentCourseIds) {
                    $query->whereNull('course_id')
                        ->orWhereIn('course_id', $studentCourseIds);
                })
                ->pluck('id')
                ->toArray();

            // Mark all as read
            $syncData = [];
            foreach ($notificationIds as $notifId) {
                $syncData[$notifId] = ['read_at' => now()];
            }

            $student->notifications()->syncWithoutDetaching($syncData);

            return response()->json([
                'success' => true,
                'message' => 'All notifications marked as read'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to mark all notifications as read',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete notification (remove from student's view).
     */
    public function destroy(Request $request, $id)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            // Just detach the notification from the student
            // This doesn't delete the notification, just removes it from student's view
            $student->notifications()->detach($id);

            return response()->json([
                'success' => true,
                'message' => 'Notification removed'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread count.
     */
    public function unreadCount(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json([
                    'success' => false,
                    'message' => 'Student profile not found'
                ], 404);
            }

            $studentCourseIds = $student->enrolledCourses()->pluck('courses.id')->toArray();

            $notifications = Notification::published()
                ->where(function ($query) use ($studentCourseIds) {
                    $query->whereNull('course_id')
                        ->orWhereIn('course_id', $studentCourseIds);
                })
                ->get();

            $unreadCount = 0;
            foreach ($notifications as $notification) {
                $pivot = $notification->students()->where('student_id', $student->id)->first();
                if (!$pivot || !$pivot->pivot->read_at) {
                    $unreadCount++;
                }
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'unread_count' => $unreadCount
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to get unread count',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
