<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Teacher;
use App\Models\Course;
use App\Models\Student;
use App\Models\Attendance;
use App\Models\Quiz;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class TeacherController extends Controller
{
    /**
     * Get teacher dashboard statistics.
     */
    public function dashboard(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            // Total students across all courses (paid only)
            $totalStudents = DB::table('course_student')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('courses.teacher_id', $teacher->id)
                ->where('course_student.payment_status', 'paid')
                ->distinct('course_student.student_id')
                ->count('course_student.student_id');

            // Published courses count
            $publishedCourses = $teacher->courses()->where('status', 'published')->count();

            // Average attendance rate
            $attendanceRate = 0;
            $totalAttendances = $teacher->attendances()->count();
            if ($totalAttendances > 0) {
                $presentCount = $teacher->attendances()->where('status', 'present')->count();
                $attendanceRate = round(($presentCount / $totalAttendances) * 100, 2);
            }

            // Average quiz score across all quizzes
            $averageQuizScore = DB::table('quiz_results')
                ->join('quizzes', 'quiz_results.quiz_id', '=', 'quizzes.id')
                ->where('quizzes.teacher_id', $teacher->id)
                ->avg('quiz_results.percentage') ?? 0;

            // Recent students (last 10)
            $recentStudents = Student::whereHas('courses', function ($query) use ($teacher) {
                $query->where('teacher_id', $teacher->id)
                      ->where('course_student.payment_status', 'paid');
            })
            ->with('user:id,name,email')
            ->latest()
            ->limit(10)
            ->get()
            ->map(function ($student) {
                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'student_code' => $student->student_code,
                    'profile_image' => $student->profile_image,
                ];
            });

            // Attendance trend (last 7 days)
            $attendanceTrend = [];
            for ($i = 6; $i >= 0; $i--) {
                $date = now()->subDays($i)->format('Y-m-d');
                $present = $teacher->attendances()
                    ->whereDate('date', $date)
                    ->where('status', 'present')
                    ->count();
                $absent = $teacher->attendances()
                    ->whereDate('date', $date)
                    ->where('status', 'absent')
                    ->count();

                $attendanceTrend[] = [
                    'date' => $date,
                    'present' => $present,
                    'absent' => $absent,
                ];
            }

            return response()->json([
                'success' => true,
                'data' => [
                    'totalStudents' => $totalStudents,
                    'publishedCourses' => $publishedCourses,
                    'attendanceRate' => $attendanceRate,
                    'averageQuizScore' => round($averageQuizScore, 2),
                    'recentStudents' => $recentStudents,
                    'attendanceTrend' => $attendanceTrend,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch dashboard data',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher's enrolled students (paid only).
     */
    public function getStudents(Request $request)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $query = Student::whereHas('courses', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id)
                  ->where('course_student.payment_status', 'paid');
            })
            ->with(['user:id,name,email', 'courses' => function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            }]);

            // Search functionality
            if ($request->has('search')) {
                $search = $request->search;
                $query->whereHas('user', function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('email', 'like', "%{$search}%");
                });
            }

            // Filter by course
            if ($request->has('course_id')) {
                $query->whereHas('courses', function ($q) use ($request) {
                    $q->where('courses.id', $request->course_id);
                });
            }

            $students = $query->paginate($request->per_page ?? 15);

            // DEBUG: Log students IDs
            \Log::info('Teacher getStudents - IDs:', [
                'count' => $students->count(),
                'ids' => $students->pluck('id')->toArray()
            ]);

            $transformedStudents = $students->getCollection()->transform(function ($student) {
                // DEBUG: Log each student transformation
                \Log::info('Transforming student:', [
                    'student_id' => $student->id,
                    'user_name' => $student->user->name
                ]);

                return [
                    'id' => $student->id,
                    'name' => $student->user->name,
                    'email' => $student->user->email,
                    'student_code' => $student->student_code,
                    'phone' => $student->phone,
                    'profile_image' => $student->profile_image,
                    'status' => $student->status,
                    'courses' => $student->courses->map(function ($course) {
                        return [
                            'id' => $course->id,
                            'title' => $course->title,
                            'subject' => $course->subject,
                            'enrolled_at' => $course->pivot->enrolled_at,
                            'progress' => $course->pivot->progress,
                        ];
                    }),
                    'overall_attendance_rate' => $student->overall_attendance_rate,
                    'average_quiz_score' => $student->average_quiz_score,
                ];
            });

            return response()->json([
                'success' => true,
                'data' => $transformedStudents,
                'meta' => [
                    'current_page' => $students->currentPage(),
                    'last_page' => $students->lastPage(),
                    'per_page' => $students->perPage(),
                    'total' => $students->total(),
                    'from' => $students->firstItem(),
                    'to' => $students->lastItem(),
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a single student details.
     */
    public function getStudent(Request $request, $id)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $student = Student::whereHas('courses', function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id)
                  ->where('course_student.payment_status', 'paid');
            })
            ->with(['user:id,name,email', 'courses' => function ($q) use ($teacher) {
                $q->where('teacher_id', $teacher->id);
            }])
            ->findOrFail($id);

            $studentData = [
                'id' => $student->id,
                'name' => $student->user->name,
                'email' => $student->user->email,
                'student_code' => $student->student_code,
                'phone' => $student->phone,
                'address' => $student->address,
                'profile_image' => $student->profile_image,
                'status' => $student->status,
                'courses' => $student->courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'subject' => $course->subject,
                        'enrolled_at' => $course->pivot->enrolled_at,
                        'progress' => $course->pivot->progress,
                    ];
                }),
                'overall_attendance_rate' => $student->overall_attendance_rate,
                'average_quiz_score' => $student->average_quiz_score,
            ];

            return response()->json([
                'success' => true,
                'data' => $studentData
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch student details',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get teacher profile.
     */
    public function getProfile(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            // Calculate statistics
            $totalStudents = \DB::table('course_student')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('courses.teacher_id', $teacher->id)
                ->distinct('course_student.student_id')
                ->count('course_student.student_id');

            $totalCourses = \DB::table('courses')
                ->where('teacher_id', $teacher->id)
                ->count();

            // Calculate attendance rate
            $totalAttendanceRecords = \DB::table('attendance')
                ->join('courses', 'attendance.course_id', '=', 'courses.id')
                ->where('courses.teacher_id', $teacher->id)
                ->count();

            $presentRecords = \DB::table('attendance')
                ->join('courses', 'attendance.course_id', '=', 'courses.id')
                ->where('courses.teacher_id', $teacher->id)
                ->where('attendance.status', 'present')
                ->count();

            $attendanceRate = $totalAttendanceRecords > 0
                ? round(($presentRecords / $totalAttendanceRecords) * 100, 1)
                : 0;

            return response()->json([
                'success' => true,
                'data' => [
                    'id' => $teacher->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'subject' => $teacher->subject,
                    'bio' => $teacher->bio,
                    'phone' => $teacher->phone,
                    'profile_image' => $teacher->profile_image,
                    'specialization' => $teacher->specialization,
                    'years_of_experience' => $teacher->years_of_experience,
                    'status' => $teacher->status,
                    'statistics' => [
                        'total_students' => $totalStudents,
                        'total_courses' => $totalCourses,
                        'career_attendance_rate' => $attendanceRate,
                        'average_quiz_score' => 0,
                    ]
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
     * Update teacher profile.
     */
    public function updateProfile(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $validated = $request->validate([
                'name' => 'sometimes|string|max:255',
                'subject' => 'sometimes|string|max:255',
                'bio' => 'sometimes|string',
                'phone' => 'sometimes|string|max:20',
                'specialization' => 'sometimes|string|max:255',
                'years_of_experience' => 'sometimes|integer|min:0',
            ]);

            // Update user name if provided
            if (isset($validated['name'])) {
                $user->update(['name' => $validated['name']]);
                unset($validated['name']);
            }

            // Update teacher profile
            $teacher->update($validated);

            return response()->json([
                'success' => true,
                'message' => 'Profile updated successfully',
                'data' => $teacher
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
     * Upload profile photo.
     */
    public function uploadProfilePhoto(Request $request)
    {
        try {
            $user = $request->user();
            $teacher = $user->teacher;

            if (!$teacher) {
                return response()->json([
                    'success' => false,
                    'message' => 'Teacher profile not found'
                ], 404);
            }

            $request->validate([
                'photo' => 'required|image|mimes:jpeg,jpg,png,gif|max:5120' // Max 5MB
            ]);

            // Delete old photo if exists
            if ($teacher->profile_image) {
                $oldPhotoPath = public_path('storage/' . $teacher->profile_image);
                if (file_exists($oldPhotoPath)) {
                    unlink($oldPhotoPath);
                }
            }

            // Store new photo
            $path = $request->file('photo')->store('profile_photos', 'public');
            $teacher->update(['profile_image' => $path]);

            return response()->json([
                'success' => true,
                'message' => 'Profile photo updated successfully',
                'data' => [
                    'profile_image' => $path,
                    'profile_image_url' => asset('storage/' . $path)
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to upload photo',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update password.
     */
    public function updatePassword(Request $request)
    {
        try {
            $user = $request->user();

            $validated = $request->validate([
                'current_password' => 'required|string',
                'new_password' => 'required|string|min:8|confirmed',
            ]);

            // Verify current password
            if (!\Hash::check($validated['current_password'], $user->password)) {
                return response()->json([
                    'success' => false,
                    'message' => 'Current password is incorrect'
                ], 400);
            }

            // Update password
            $user->update([
                'password' => \Hash::make($validated['new_password'])
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Password updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update password',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
