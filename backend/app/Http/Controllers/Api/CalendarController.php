<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CalendarEvent;
use App\Models\Course;
use Illuminate\Http\Request;
use Carbon\Carbon;

class CalendarController extends Controller
{
    /**
     * Get calendar events for the authenticated teacher
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            $user = $request->user();
            
            if (!$user) {
                return response()->json(['error' => 'Unauthenticated'], 401);
            }
            
            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $query = CalendarEvent::where('teacher_id', $teacher->id)
                ->with(['course']);

            // Filter by date range
            if ($request->has('start') && $request->has('end')) {
                $query->whereBetween('start_time', [
                    $request->start,
                    $request->end
                ]);
            }

            // Filter by course
            if ($request->has('course_id')) {
                if ($request->course_id === 'null' || $request->course_id === '') {
                    $query->whereNull('course_id');
                } else {
                    $query->where('course_id', $request->course_id);
                }
            }

            // Filter by type
            if ($request->has('type')) {
                $query->where('type', $request->type);
            }

            // Order by start_time
            $query->orderBy('start_time', 'asc');

            $events = $query->get();

            // Transform to FullCalendar format
            $events = $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'description' => $event->description,
                    'start' => $event->start_time,
                    'end' => $event->end_time,
                    'type' => $event->type,
                    'location' => $event->location,
                    'color' => $event->color ?? $this->getTypeColor($event->type),
                    'is_recurring' => $event->is_recurring,
                    'recurring_pattern' => $event->recurring_pattern,
                    'duration_minutes' => $event->duration_minutes,
                    'course' => $event->course ? [
                        'id' => $event->course->id,
                        'title' => $event->course->title,
                    ] : null,
                ];
            });

            return response()->json($events);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch events', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single calendar event
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

            $event = CalendarEvent::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->with(['course'])
                ->first();

            if (!$event) {
                return response()->json(['error' => 'Event not found'], 404);
            }

            return response()->json([
                'id' => $event->id,
                'title' => $event->title,
                'description' => $event->description,
                'start_time' => $event->start_time,
                'end_time' => $event->end_time,
                'type' => $event->type,
                'location' => $event->location,
                'color' => $event->color,
                'is_recurring' => $event->is_recurring,
                'recurring_pattern' => $event->recurring_pattern,
                'duration_minutes' => $event->duration_minutes,
                'course' => $event->course ? [
                    'id' => $event->course->id,
                    'title' => $event->course->title,
                ] : null,
                'created_at' => $event->created_at,
                'updated_at' => $event->updated_at,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch event', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new calendar event
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
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'required|date',
                'end_time' => 'required|date|after:start_time',
                'type' => 'required|in:class,exam,meeting,reminder,holiday',
                'location' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:7', // Hex color
                'course_id' => 'nullable|exists:courses,id',
                'is_recurring' => 'boolean',
                'recurring_pattern' => 'nullable|in:daily,weekly,monthly',
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

            // Set default color based on type if not provided
            if (!isset($validated['color'])) {
                $validated['color'] = $this->getTypeColor($validated['type']);
            }

            $event = CalendarEvent::create($validated);

            return response()->json([
                'message' => 'Event created successfully',
                'event' => $event->load('course'),
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create event', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update a calendar event
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

            $event = CalendarEvent::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$event) {
                return response()->json(['error' => 'Event not found'], 404);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'nullable|string',
                'start_time' => 'sometimes|required|date',
                'end_time' => 'sometimes|required|date|after:start_time',
                'type' => 'sometimes|required|in:class,exam,meeting,reminder,holiday',
                'location' => 'nullable|string|max:255',
                'color' => 'nullable|string|max:7',
                'course_id' => 'nullable|exists:courses,id',
                'is_recurring' => 'boolean',
                'recurring_pattern' => 'nullable|in:daily,weekly,monthly',
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

            $event->update($validated);

            return response()->json([
                'message' => 'Event updated successfully',
                'event' => $event->fresh()->load('course'),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update event', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a calendar event
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

            $event = CalendarEvent::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$event) {
                return response()->json(['error' => 'Event not found'], 404);
            }

            $event->delete();

            return response()->json([
                'message' => 'Event deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete event', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get upcoming events for the teacher
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function upcoming(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $limit = $request->input('limit', 10);

            $events = CalendarEvent::where('teacher_id', $teacher->id)
                ->where('start_time', '>', now())
                ->with(['course'])
                ->orderBy('start_time', 'asc')
                ->limit($limit)
                ->get();

            $events = $events->map(function ($event) {
                return [
                    'id' => $event->id,
                    'title' => $event->title,
                    'start_time' => $event->start_time,
                    'end_time' => $event->end_time,
                    'type' => $event->type,
                    'location' => $event->location,
                    'color' => $event->color ?? $this->getTypeColor($event->type),
                    'course' => $event->course ? [
                        'id' => $event->course->id,
                        'title' => $event->course->title,
                    ] : null,
                ];
            });

            return response()->json($events);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch upcoming events', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get default color based on event type
     *
     * @param string $type
     * @return string
     */
    private function getTypeColor($type)
    {
        return match($type) {
            'class' => '#3B82F6',      // Blue
            'exam' => '#EF4444',       // Red
            'meeting' => '#10B981',    // Green
            'reminder' => '#F59E0B',   // Orange
            'holiday' => '#8B5CF6',    // Purple
            default => '#6B7280',      // Gray
        };
    }
}
