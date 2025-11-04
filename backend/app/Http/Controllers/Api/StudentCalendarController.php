<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class StudentCalendarController extends Controller
{
    /**
     * Get student calendar events.
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

            // Get student's paid course IDs
            $paidCourseIds = $student->paidCourses()->pluck('courses.id');

            $query = CalendarEvent::where(function ($q) use ($student, $paidCourseIds) {
                // Student's personal events
                $q->where('student_id', $student->id)
                  // Or events from enrolled courses
                  ->orWhereIn('course_id', $paidCourseIds);
            });

            // Filter by date range
            if ($request->has('start') && $request->has('end')) {
                $query->whereBetween('start_date', [$request->start, $request->end]);
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            $events = $query->with(['course:id,title', 'teacher.user:id,name'])
                ->orderBy('start_date')
                ->get()
                ->map(function ($event) use ($student) {
                    return [
                        'id' => $event->id,
                        'title' => $event->title,
                        'description' => $event->description,
                        'type' => $event->type,
                        'start' => $event->start_date,
                        'end' => $event->end_date,
                        'location' => $event->location,
                        'is_personal' => $event->student_id === $student->id,
                        'course' => $event->course->title ?? null,
                        'teacher' => $event->teacher->user->name ?? null,
                        'color' => $this->getEventColor($event->type),
                    ];
                });

            return response()->json([
                'success' => true,
                'data' => $events
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch calendar events',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create personal calendar event.
     */
    public function store(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'type' => 'required|in:personal,course,quiz,other,study,exam,assignment',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'location' => 'nullable|string|max:255',
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

            $event = CalendarEvent::create([
                'student_id' => $student->id,
                'title' => $request->title,
                'description' => $request->description,
                'type' => $request->type,
                'start_date' => $request->start_date,
                'end_date' => $request->end_date,
                'location' => $request->location,
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Event created successfully',
                'data' => $event
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update personal calendar event.
     */
    public function update(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|string|max:255',
                'description' => 'nullable|string',
                'type' => 'sometimes|in:personal,course,quiz,other,study,exam,assignment',
                'start_date' => 'sometimes|date',
                'end_date' => 'sometimes|date|after_or_equal:start_date',
                'location' => 'nullable|string|max:255',
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

            // Only allow updating personal events
            $event = CalendarEvent::where('student_id', $student->id)
                ->findOrFail($id);

            $event->update($request->only([
                'title',
                'description',
                'type',
                'start_date',
                'end_date',
                'location',
            ]));

            return response()->json([
                'success' => true,
                'message' => 'Event updated successfully',
                'data' => $event
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete personal calendar event.
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

            // Only allow deleting personal events
            $event = CalendarEvent::where('student_id', $student->id)
                ->findOrFail($id);

            $event->delete();

            return response()->json([
                'success' => true,
                'message' => 'Event deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete event',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get event color by type.
     */
    private function getEventColor($type): string
    {
        return match($type) {
            'lecture' => '#3B82F6', // Blue
            'exam' => '#EF4444', // Red
            'assignment' => '#F59E0B', // Orange
            'personal' => '#8B5CF6', // Purple
            'study' => '#10B981', // Green
            default => '#6B7280', // Gray
        };
    }
}
