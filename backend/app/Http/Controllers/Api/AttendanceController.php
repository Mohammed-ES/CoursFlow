<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Attendance;
use App\Models\Course;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class AttendanceController extends Controller
{
    /**
     * Get attendance records with filters
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

            // Build query for teacher's courses only
            $query = Attendance::whereHas('course', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            })->with(['student.user', 'course']);

            // Filter by date range
            if ($request->has('start_date')) {
                $query->whereDate('date', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->whereDate('date', '<=', $request->end_date);
            }

            // Filter by specific date
            if ($request->has('date')) {
                $query->whereDate('date', $request->date);
            }

            // Filter by course
            if ($request->has('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Filter by student
            if ($request->has('student_id')) {
                $query->where('student_id', $request->student_id);
            }

            // Order by date desc
            $query->orderBy('date', 'desc')->orderBy('check_in_time', 'desc');

            // Paginate results
            $perPage = $request->input('per_page', 15);
            $attendances = $query->paginate($perPage);

            // Transform data
            $attendances->getCollection()->transform(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                    'check_in_time' => $attendance->check_in_time,
                    'notes' => $attendance->notes,
                    'student' => [
                        'id' => $attendance->student->id,
                        'name' => $attendance->student->user->name,
                        'student_code' => $attendance->student->student_code,
                        'profile_image' => $attendance->student->profile_image,
                    ],
                    'course' => [
                        'id' => $attendance->course->id,
                        'title' => $attendance->course->title,
                        'subject' => $attendance->course->subject,
                    ],
                ];
            });

            return response()->json($attendances);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch attendance records', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark attendance for a single student
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
                'student_id' => 'required|exists:students,id',
                'date' => 'required|date',
                'status' => 'required|in:present,absent,late,excused',
                'notes' => 'nullable|string',
                'check_in_time' => 'nullable|date_format:H:i:s',
            ]);

            // Verify course belongs to teacher
            $course = Course::where('id', $validated['course_id'])
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            // Verify student is enrolled in course with paid status
            $isEnrolled = DB::table('course_student')
                ->where('course_id', $validated['course_id'])
                ->where('student_id', $validated['student_id'])
                ->where('payment_status', 'paid')
                ->exists();

            if (!$isEnrolled) {
                return response()->json(['error' => 'Student is not enrolled in this course or payment not completed'], 403);
            }

            // Create or update attendance record
            $attendance = Attendance::updateOrCreate(
                [
                    'course_id' => $validated['course_id'],
                    'student_id' => $validated['student_id'],
                    'date' => $validated['date'],
                ],
                [
                    'teacher_id' => $teacher->id,
                    'status' => $validated['status'],
                    'notes' => $validated['notes'] ?? null,
                    'check_in_time' => $validated['check_in_time'] ?? now()->format('H:i:s'),
                ]
            );

            // Load relationships
            $attendance->load(['student.user', 'course']);

            return response()->json([
                'message' => 'Attendance marked successfully',
                'attendance' => [
                    'id' => $attendance->id,
                    'date' => $attendance->date,
                    'status' => $attendance->status,
                    'check_in_time' => $attendance->check_in_time,
                    'notes' => $attendance->notes,
                    'student' => [
                        'id' => $attendance->student->id,
                        'name' => $attendance->student->user->name,
                        'student_code' => $attendance->student->student_code,
                    ],
                    'course' => [
                        'id' => $attendance->course->id,
                        'title' => $attendance->course->title,
                    ],
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to mark attendance', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Mark attendance for multiple students at once
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function bulkStore(Request $request)
    {
        try {
            \Log::info('Bulk attendance request received', [
                'data' => $request->all()
            ]);

            $teacher = $request->user()->teacher;

            if (!$teacher) {
                \Log::error('Teacher profile not found for user', ['user_id' => $request->user()->id]);
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            \Log::info('Teacher found', ['teacher_id' => $teacher->id]);

            $validated = $request->validate([
                'course_id' => 'required|exists:courses,id',
                'date' => 'required|date',
                'attendances' => 'required|array',
                'attendances.*.student_id' => 'required|exists:students,id',
                'attendances.*.status' => 'required|in:present,absent,late,excused',
                'attendances.*.notes' => 'nullable|string',
            ]);

            \Log::info('Validation passed', ['validated' => $validated]);

            // Verify course belongs to teacher
            $course = Course::where('id', $validated['course_id'])
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                \Log::error('Course not found or unauthorized', [
                    'course_id' => $validated['course_id'],
                    'teacher_id' => $teacher->id
                ]);
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            \Log::info('Course verified', ['course_id' => $course->id]);

            $results = [];
            $errors = [];

            DB::beginTransaction();

            try {
                foreach ($validated['attendances'] as $item) {
                    // Verify student is enrolled with paid status
                    $isEnrolled = DB::table('course_student')
                        ->where('course_id', $validated['course_id'])
                        ->where('student_id', $item['student_id'])
                        ->where('payment_status', 'paid')
                        ->exists();

                    if (!$isEnrolled) {
                        \Log::warning('Student not enrolled', ['student_id' => $item['student_id']]);
                        $errors[] = "Student ID {$item['student_id']} is not enrolled or payment not completed";
                        continue;
                    }

                    // Create or update attendance
                    \Log::info('Creating/updating attendance', [
                        'course_id' => $validated['course_id'],
                        'student_id' => $item['student_id'],
                        'date' => $validated['date'],
                        'status' => $item['status']
                    ]);

                    $attendance = Attendance::updateOrCreate(
                        [
                            'course_id' => $validated['course_id'],
                            'student_id' => $item['student_id'],
                            'date' => $validated['date'],
                        ],
                        [
                            'teacher_id' => $teacher->id,
                            'status' => $item['status'],
                            'notes' => $item['notes'] ?? null,
                            'check_in_time' => now()->format('H:i:s'),
                        ]
                    );

                    \Log::info('Attendance saved', ['attendance_id' => $attendance->id]);
                    $results[] = $attendance->id;
                }

                DB::commit();
                \Log::info('Transaction committed', ['results_count' => count($results)]);

                return response()->json([
                    'message' => 'Bulk attendance marked successfully',
                    'successful_count' => count($results),
                    'error_count' => count($errors),
                    'errors' => $errors,
                ], 201);

            } catch (\Exception $e) {
                DB::rollBack();
                \Log::error('Transaction failed', ['error' => $e->getMessage(), 'trace' => $e->getTraceAsString()]);
                throw $e;
            }

        } catch (\Exception $e) {
            \Log::error('Bulk attendance failed', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json(['error' => 'Failed to mark bulk attendance', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get attendance statistics for a course
     *
     * @param Request $request
     * @param int $courseId
     * @return \Illuminate\Http\JsonResponse
     */
    public function statistics(Request $request, $courseId)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            // Verify course belongs to teacher
            $course = Course::where('id', $courseId)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found or unauthorized'], 403);
            }

            // Get date range
            $startDate = $request->input('start_date', now()->subMonth()->format('Y-m-d'));
            $endDate = $request->input('end_date', now()->format('Y-m-d'));

            // Calculate statistics
            $totalAttendances = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$startDate, $endDate])
                ->count();

            $presentCount = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('status', 'present')
                ->count();

            $absentCount = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('status', 'absent')
                ->count();

            $lateCount = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('status', 'late')
                ->count();

            $excusedCount = Attendance::where('course_id', $courseId)
                ->whereBetween('date', [$startDate, $endDate])
                ->where('status', 'excused')
                ->count();

            $attendanceRate = $totalAttendances > 0
                ? round(($presentCount / $totalAttendances) * 100, 2)
                : 0;

            return response()->json([
                'course_id' => $courseId,
                'course_title' => $course->title,
                'period' => [
                    'start_date' => $startDate,
                    'end_date' => $endDate,
                ],
                'statistics' => [
                    'total_records' => $totalAttendances,
                    'present' => $presentCount,
                    'absent' => $absentCount,
                    'late' => $lateCount,
                    'excused' => $excusedCount,
                    'attendance_rate' => $attendanceRate,
                ],
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch statistics', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Export attendance records to CSV
     *
     * @param Request $request
     * @return \Illuminate\Http\Response
     */
    public function export(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            // Build query
            $query = Attendance::whereHas('course', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            })->with(['student.user', 'course']);

            // Apply filters (same as index method)
            if ($request->has('start_date')) {
                $query->whereDate('date', '>=', $request->start_date);
            }
            if ($request->has('end_date')) {
                $query->whereDate('date', '<=', $request->end_date);
            }
            if ($request->has('course_id')) {
                $query->where('course_id', $request->course_id);
            }

            $attendances = $query->orderBy('date', 'desc')->get();

            // Generate CSV
            $csvData = "Date,Course,Student Code,Student Name,Status,Check-in Time,Notes\n";

            foreach ($attendances as $attendance) {
                $csvData .= sprintf(
                    "%s,%s,%s,%s,%s,%s,%s\n",
                    $attendance->date,
                    '"' . str_replace('"', '""', $attendance->course->title) . '"',
                    $attendance->student->student_code,
                    '"' . str_replace('"', '""', $attendance->student->user->name) . '"',
                    $attendance->status,
                    $attendance->check_in_time ?? '',
                    '"' . str_replace('"', '""', $attendance->notes ?? '') . '"'
                );
            }

            $filename = 'attendance_export_' . now()->format('Y-m-d_His') . '.csv';

            return response($csvData, 200, [
                'Content-Type' => 'text/csv',
                'Content-Disposition' => 'attachment; filename="' . $filename . '"',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to export attendance', 'message' => $e->getMessage()], 500);
        }
    }
}
