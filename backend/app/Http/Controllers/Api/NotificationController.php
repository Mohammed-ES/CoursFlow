<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\TeacherNotification;
use App\Models\AdminNotification;
use App\Models\Course;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class NotificationController extends Controller
{
    /**
     * Get all notifications for the authenticated teacher
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

            $query = TeacherNotification::where('teacher_id', $teacher->id)
                ->with(['course']);

            // Filter by course
            if ($request->has('course_id')) {
                if ($request->course_id === 'null' || $request->course_id === '') {
                    $query->whereNull('course_id'); // Global notifications
                } else {
                    $query->where('course_id', $request->course_id);
                }
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by status
            if ($request->has('is_published')) {
                $query->where('is_published', $request->is_published);
            }

            // Order by created_at desc
            $query->orderBy('created_at', 'desc');

            $perPage = $request->input('per_page', 15);
            $notifications = $query->paginate($perPage);

            // Transform data
            $notifications->getCollection()->transform(function ($notification) {
                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'content' => $notification->content,
                    'type' => $notification->type,
                    'priority' => $notification->priority,
                    'is_published' => $notification->is_published,
                    'published_at' => $notification->published_at,
                    'expires_at' => $notification->expires_at,
                    'is_active' => $notification->is_active,
                    'course' => $notification->course ? [
                        'id' => $notification->course->id,
                        'title' => $notification->course->title,
                    ] : null,
                    'created_at' => $notification->created_at,
                ];
            });

            return response()->json($notifications);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notifications', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single notification
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

            $notification = TeacherNotification::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->with(['course'])
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            return response()->json([
                'id' => $notification->id,
                'title' => $notification->title,
                'content' => $notification->content,
                'type' => $notification->type,
                'priority' => $notification->priority,
                'is_published' => $notification->is_published,
                'published_at' => $notification->published_at,
                'expires_at' => $notification->expires_at,
                'is_active' => $notification->is_active,
                'course' => $notification->course ? [
                    'id' => $notification->course->id,
                    'title' => $notification->course->title,
                ] : null,
                'created_at' => $notification->created_at,
                'updated_at' => $notification->updated_at,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch notification', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new notification
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

            // DEBUG: Log incoming request data
            \Log::info('NotificationController@store - Request data:', [
                'teacher_id' => $teacher->id,
                'student_ids' => $request->input('student_ids'),
                'title' => $request->input('title'),
                'type' => $request->input('type'),
                'priority' => $request->input('priority'),
            ]);

            try {
                $validated = $request->validate([
                    'title' => 'required|string|max:255',
                    'content' => 'required|string',
                    'type' => 'required|in:announcement,reminder,alert,info',
                    'priority' => 'required|in:low,normal,medium,high,urgent',
                    'course_id' => 'nullable|exists:courses,id',
                    'published_at' => 'nullable|date',
                    'expires_at' => 'nullable|date|after:published_at',
                    'student_ids' => 'nullable|array',
                    'student_ids.*' => 'nullable|exists:students,id',
                    'send_to_admin' => 'nullable|boolean',
                ]);
                
                \Log::info('NotificationController@store - Validation passed');
            } catch (\Illuminate\Validation\ValidationException $e) {
                \Log::error('NotificationController@store - Validation failed:', [
                    'errors' => $e->errors(),
                    'student_ids' => $request->input('student_ids')
                ]);
                throw $e;
            }

            // DEBUG: Log validated data
            \Log::info('NotificationController@store - Validated data:', [
                'student_ids' => $validated['student_ids'] ?? null,
                'send_to_admin' => $validated['send_to_admin'] ?? null,
            ]);

            // Verify course belongs to teacher if course_id provided
            if (isset($validated['course_id'])) {
                $course = Course::where('id', $validated['course_id'])
                    ->where('teacher_id', $teacher->id)
                    ->first();

                if (!$course) {
                    return response()->json(['error' => 'Course not found or unauthorized'], 403);
                }
            }

            $validated['teacher_id'] = $teacher->id;
            $validated['is_published'] = false; // Draft by default

            $notification = TeacherNotification::create($validated);

            // If send_to_admin is true, create an admin notification
            if (isset($validated['send_to_admin']) && $validated['send_to_admin'] === true) {
                // Create admin notification from teacher
                AdminNotification::create([
                    'admin_id' => 1, // Default admin (you might want to get the actual admin)
                    'title' => '[From Teacher] ' . $validated['title'],
                    'content' => $validated['content'] . '<br><br><em>Sent by teacher: ' . $teacher->user->name . '</em>',
                    'type' => 'info', // Map teacher notification type to admin type
                    'priority' => $validated['priority'],
                    'target_audience' => 'all_teachers', // Use valid ENUM value
                    'is_published' => true,
                    'published_at' => now(),
                ]);
            }

            // Attach students if provided (only if not sending to admin)
            if (isset($validated['student_ids']) && is_array($validated['student_ids']) && count($validated['student_ids']) > 0) {
                // DEBUG: Log before attaching students
                \Log::info('NotificationController@store - Attaching students:', [
                    'notification_id' => $notification->id,
                    'student_ids' => $validated['student_ids'],
                    'count' => count($validated['student_ids'])
                ]);
                
                try {
                    $notification->students()->attach($validated['student_ids']);
                    \Log::info('NotificationController@store - Students attached successfully');
                } catch (\Exception $e) {
                    \Log::error('NotificationController@store - Error attaching students:', [
                        'error' => $e->getMessage(),
                        'student_ids' => $validated['student_ids']
                    ]);
                    throw $e;
                }
            }

            return response()->json([
                'message' => 'Notification created successfully',
                'notification' => $notification->load('course', 'students'),
            ], 201);

        } catch (\Exception $e) {
            \Log::error('NotificationController@store - Exception caught:', [
                'error' => $e->getMessage(),
                'file' => $e->getFile(),
                'line' => $e->getLine(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'error' => 'Failed to create notification', 
                'message' => $e->getMessage(),
                'details' => config('app.debug') ? $e->getTrace() : null
            ], 500);
        }
    }

    /**
     * Update a notification
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

            $notification = TeacherNotification::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'content' => 'sometimes|required|string',
                'type' => 'sometimes|required|in:announcement,reminder,alert,info',
                'priority' => 'sometimes|required|in:low,normal,medium,high,urgent',
                'course_id' => 'nullable|exists:courses,id',
                'published_at' => 'nullable|date',
                'expires_at' => 'nullable|date|after:published_at',
                'student_ids' => 'nullable|array',
                'student_ids.*' => 'exists:students,id',
                'send_to_admin' => 'nullable|boolean',
            ]);

            // Verify course belongs to teacher if course_id provided
            if (isset($validated['course_id'])) {
                $course = Course::where('id', $validated['course_id'])
                    ->where('teacher_id', $teacher->id)
                    ->first();

                if (!$course) {
                    return response()->json(['error' => 'Course not found or unauthorized'], 403);
                }
            }

            $notification->update($validated);

            // If send_to_admin is true, create/update admin notification
            if (isset($validated['send_to_admin']) && $validated['send_to_admin'] === true) {
                AdminNotification::create([
                    'admin_id' => 1,
                    'title' => '[From Teacher] ' . ($validated['title'] ?? $notification->title),
                    'content' => ($validated['content'] ?? $notification->content) . '<br><br><em>Sent by teacher: ' . $teacher->user->name . '</em>',
                    'type' => 'info',
                    'priority' => $validated['priority'] ?? $notification->priority,
                    'target_audience' => 'all_teachers', // Use valid ENUM value
                    'is_published' => true,
                    'published_at' => now(),
                ]);
            }

            // Update students if provided (only if not sending to admin)
            if (isset($validated['student_ids']) && is_array($validated['student_ids']) && count($validated['student_ids']) > 0) {
                $notification->students()->sync($validated['student_ids']);
            }

            return response()->json([
                'message' => 'Notification updated successfully',
                'notification' => $notification->fresh()->load('course', 'students'),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update notification', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a notification
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

            $notification = TeacherNotification::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete notification', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Publish a notification (make it visible to students)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function publish(Request $request, $id)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $notification = TeacherNotification::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            // Set as published
            $notification->update([
                'is_published' => true,
                'published_at' => $notification->published_at ?? now(),
            ]);

            return response()->json([
                'message' => 'Notification published successfully',
                'notification' => $notification->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to publish notification', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Unpublish a notification
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function unpublish($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $notification = TeacherNotification::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            // Set as unpublished
            $notification->update([
                'is_published' => false,
            ]);

            return response()->json([
                'message' => 'Notification unpublished successfully',
                'notification' => $notification->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to unpublish notification', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get admin notifications for the authenticated teacher
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getAdminNotifications(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            // Get admin notifications assigned to this teacher
            $query = AdminNotification::active()
                ->forAudience('all_teachers')
                ->whereHas('teachers', function ($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id);
                })
                ->with(['admin:id,name,email']);

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Filter by priority
            if ($request->has('priority')) {
                $query->where('priority', $request->priority);
            }

            // Filter by read status
            if ($request->has('unread_only') && $request->unread_only) {
                $query->whereHas('teachers', function ($q) use ($teacher) {
                    $q->where('teacher_id', $teacher->id)
                      ->whereNull('read_at');
                });
            }

            // Order by priority and created_at
            $query->orderByRaw("FIELD(priority, 'urgent', 'high', 'normal', 'low')")
                  ->orderBy('created_at', 'desc');

            $perPage = $request->input('per_page', 15);
            $notifications = $query->paginate($perPage);

            // Transform data
            $notifications->getCollection()->transform(function ($notification) use ($teacher) {
                $pivotData = $notification->teachers->where('id', $teacher->id)->first();

                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'content' => $notification->content,
                    'type' => $notification->type,
                    'priority' => $notification->priority,
                    'target_audience' => $notification->target_audience,
                    'is_published' => $notification->is_published,
                    'published_at' => $notification->published_at,
                    'expires_at' => $notification->expires_at,
                    'is_active' => $notification->is_active,
                    'is_read' => $pivotData ? ($pivotData->pivot->read_at !== null) : false,
                    'read_at' => $pivotData ? $pivotData->pivot->read_at : null,
                    'admin' => $notification->admin ? [
                        'id' => $notification->admin->id,
                        'name' => $notification->admin->name,
                    ] : null,
                    'created_at' => $notification->created_at,
                ];
            });

            return response()->json($notifications);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch admin notifications',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get unread notification count for teacher
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function getUnreadCount()
    {
        try {
            $user = auth()->user();
            
            // Get teacher profile ID
            $teacher = $user->teacher;
            if (!$teacher) {
                return response()->json([
                    'error' => 'Teacher profile not found'
                ], 404);
            }

            // Count unread admin notifications (sent to this teacher)
            $unreadAdminCount = DB::table('admin_notification_teacher')
                ->where('teacher_id', $teacher->id)
                ->whereNull('read_at')
                ->count();

            // Count unread student notifications (responses to teacher's notifications)
            $unreadStudentCount = TeacherNotification::where('teacher_id', $teacher->id)
                ->whereHas('students', function ($query) {
                    $query->whereNull('notification_student.read_at');
                })
                ->count();

            $totalUnread = $unreadAdminCount + $unreadStudentCount;

            return response()->json([
                'total' => $totalUnread,
                'admin_notifications' => $unreadAdminCount,
                'student_notifications' => $unreadStudentCount
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch unread count',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark an admin notification as read
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function markAdminNotificationAsRead($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $notification = AdminNotification::find($id);

            if (!$notification) {
                return response()->json(['error' => 'Notification not found'], 404);
            }

            // Check if teacher has access to this notification
            $hasAccess = $notification->teachers()
                ->where('teacher_id', $teacher->id)
                ->exists();

            if (!$hasAccess) {
                return response()->json(['error' => 'You do not have access to this notification'], 403);
            }

            // Mark as read
            $notification->teachers()
                ->updateExistingPivot($teacher->id, [
                    'read_at' => now(),
                ]);

            return response()->json([
                'message' => 'Notification marked as read',
                'read_at' => now(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to mark notification as read',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin notifications for authenticated student
     */
    public function getAdminNotificationsForStudent(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json(['error' => 'Student profile not found'], 404);
            }

            $notifications = AdminNotification::published()
                ->active()
                ->whereIn('target_audience', ['all_students', 'both'])
                ->with('admin:id,name')
                ->orderBy('published_at', 'desc')
                ->get()
                ->map(function ($notification) use ($student) {
                    $pivot = $notification->students()
                        ->where('student_id', $student->id)
                        ->first();

                    $notification->is_read = $pivot ? $pivot->pivot->read_at !== null : false;
                    $notification->read_at = $pivot ? $pivot->pivot->read_at : null;

                    return $notification;
                });

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch notifications',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark admin notification as read for student
     */
    public function markAdminNotificationAsReadForStudent(Request $request, $id)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json(['error' => 'Student profile not found'], 404);
            }

            $notification = AdminNotification::findOrFail($id);

            // Check if student has access to this notification
            if (!in_array($notification->target_audience, ['all_students', 'both'])) {
                return response()->json(['error' => 'You do not have access to this notification'], 403);
            }

            // Mark as read (sync without detaching)
            $notification->students()->syncWithoutDetaching([
                $student->id => ['read_at' => now()]
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'read_at' => now(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to mark notification as read',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher notifications for authenticated student
     */
    public function getTeacherNotificationsForStudent(Request $request)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json(['error' => 'Student profile not found'], 404);
            }

            // Get notifications assigned to this student
            $notifications = TeacherNotification::published()
                ->whereHas('students', function ($query) use ($student) {
                    $query->where('student_id', $student->id);
                })
                ->with(['teacher.user', 'course'])
                ->orderBy('published_at', 'desc')
                ->get()
                ->map(function ($notification) use ($student) {
                    $pivot = $notification->students()
                        ->where('student_id', $student->id)
                        ->first();

                    $notification->is_read = $pivot ? $pivot->pivot->read_at !== null : false;
                    $notification->read_at = $pivot ? $pivot->pivot->read_at : null;

                    return $notification;
                });

            return response()->json([
                'success' => true,
                'data' => $notifications
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to fetch notifications',
                'message' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Mark teacher notification as read for student
     */
    public function markTeacherNotificationAsReadForStudent(Request $request, $id)
    {
        try {
            $student = $request->user()->student;

            if (!$student) {
                return response()->json(['error' => 'Student profile not found'], 404);
            }

            $notification = TeacherNotification::findOrFail($id);

            // Check if student has access to this notification
            $hasAccess = $notification->students()
                ->where('student_id', $student->id)
                ->exists();

            if (!$hasAccess) {
                return response()->json(['error' => 'You do not have access to this notification'], 403);
            }

            // Mark as read
            $notification->students()
                ->updateExistingPivot($student->id, [
                    'read_at' => now(),
                ]);

            return response()->json([
                'success' => true,
                'message' => 'Notification marked as read',
                'read_at' => now(),
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Failed to mark notification as read',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
