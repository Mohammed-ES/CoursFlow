<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\TeacherProfile;
use App\Models\StudentProfile;
use App\Models\AdminNotification;
use App\Models\Teacher;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;

class AdminController extends Controller
{
    /**
     * Get all students
     */
    public function getStudents()
    {
        try {
            $students = User::where('role', 'student')
                ->with('studentProfile')
                ->select('id', 'name', 'email', 'created_at', 'updated_at')
                ->get()
                ->map(function ($user) {
                    $nameParts = explode(' ', $user->name, 2);

                    // Count enrolled courses from course_student table using students.id
                    $enrolledCourses = 0;
                    if ($user->studentProfile) {
                        $enrolledCourses = DB::table('course_student')
                            ->where('student_id', $user->studentProfile->id)
                            ->count();
                    }

                    return [
                        'id' => 'ST' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                        'firstName' => $nameParts[0] ?? '',
                        'lastName' => $nameParts[1] ?? '',
                        'email' => $user->email,
                        'phone' => $user->studentProfile->phone ?? 'N/A',
                        'address' => $user->studentProfile->address ?? 'N/A',
                        'location' => $user->studentProfile->location ?? 'N/A',
                        'firstLoginDate' => $user->created_at ? $user->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'lastLogoutDate' => $user->updated_at ? $user->updated_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'status' => $user->studentProfile->status ?? 'active',
                        'enrolledCourses' => $enrolledCourses,
                    ];
                });

            return response()->json($students);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all teachers
     */
    public function getTeachers()
    {
        try {
            $teachers = User::where('role', 'teacher')
                ->with('teacherProfile')
                ->select('id', 'name', 'email', 'created_at', 'updated_at')
                ->get()
                ->map(function ($user) {
                    $nameParts = explode(' ', $user->name, 2);

                    // Count courses assigned to this teacher
                    $coursesCount = DB::table('courses')
                        ->where('teacher_id', $user->id)
                        ->count();

                    // Count students enrolled in this teacher's courses
                    $studentsCount = DB::table('course_student')
                        ->whereIn('course_id', function($query) use ($user) {
                            $query->select('id')
                                  ->from('courses')
                                  ->where('teacher_id', $user->id);
                        })
                        ->distinct('student_id')
                        ->count('student_id');

                    return [
                        'id' => 'T' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                        'firstName' => $nameParts[0] ?? '',
                        'lastName' => $nameParts[1] ?? '',
                        'email' => $user->email,
                        'phone' => $user->teacherProfile->phone ?? 'N/A',
                        'address' => $user->teacherProfile->bio ?? 'N/A',
                        'location' => $user->teacherProfile->location ?? 'N/A',
                        'subject' => $user->teacherProfile->department ?? 'N/A',
                        'department' => $user->teacherProfile->department ?? 'N/A',
                        'specialization' => $user->teacherProfile->specialization ?? 'N/A',
                        'experience' => $user->teacherProfile->experience ? (int)$user->teacherProfile->experience : null,
                        'hireDate' => $user->created_at ? $user->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'lastActive' => $user->updated_at ? $user->updated_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'status' => 'active',
                        'coursesCount' => $coursesCount,
                        'studentsCount' => $studentsCount,
                    ];
                });

            return response()->json($teachers);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch teachers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new student
     */
    public function createStudent(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                // location field is removed as it doesn't exist in students table
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->firstName . ' ' . $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'student',
                'email_verified_at' => now(),
            ]);

            // Create student profile using the students table
            $user->student()->create([
                'student_code' => 'S' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                'phone' => $request->phone,
                'address' => $request->address,
                'status' => 'active',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Student created successfully',
                'student' => [
                    'id' => 'ST' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'firstName' => $request->firstName,
                    'lastName' => $request->lastName,
                    'email' => $user->email,
                    'phone' => $request->phone ?? 'N/A',
                    'address' => $request->address ?? 'N/A',
                    'location' => $request->location ?? 'N/A',
                    'firstLoginDate' => $user->created_at->format('Y-m-d'),
                    'lastLogoutDate' => $user->updated_at->format('Y-m-d'),
                    'status' => 'active',
                    'enrolledCourses' => 0,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student
     */
    public function updateStudent(Request $request, $id)
    {
        try {
            // Log incoming request for debugging
            \Log::info('Update student request', [
                'id' => $id,
                'data' => $request->all()
            ]);

            // Extract numeric ID from format "ST001"
            $numericId = (int) preg_replace('/[^0-9]/', '', $id);

            $user = User::where('role', 'student')->findOrFail($numericId);

            // Accept both camelCase and snake_case
            $firstName = $request->input('firstName') ?? $request->input('first_name');
            $lastName = $request->input('lastName') ?? $request->input('last_name');

            $validator = Validator::make([
                'firstName' => $firstName,
                'lastName' => $lastName,
                'email' => $request->email,
                'password' => $request->password,
                'phone' => $request->phone,
                'address' => $request->address,
                'location' => $request->location,
            ], [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'location' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                \Log::error('Validation failed', [
                    'errors' => $validator->errors()->toArray()
                ]);
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Update user
            $user->name = $firstName . ' ' . $lastName;
            $user->email = $request->email;

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            // Update or create student profile
            $user->studentProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'student_code' => 'S' . str_pad($user->id, 5, '0', STR_PAD_LEFT),
                    'phone' => $request->phone,
                    'address' => $request->address,
                    'location' => $request->location,
                    'status' => 'active',
                ]
            );

            DB::commit();

            // Count enrolled courses
            $enrolledCourses = DB::table('course_student')
                ->where('student_id', $user->id)
                ->count();

            return response()->json([
                'message' => 'Student updated successfully',
                'student' => [
                    'id' => 'ST' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'firstName' => $firstName,
                    'lastName' => $lastName,
                    'email' => $user->email,
                    'phone' => $request->phone ?? 'N/A',
                    'address' => $request->address ?? 'N/A',
                    'location' => $request->location ?? 'N/A',
                    'firstLoginDate' => $user->created_at ? $user->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'lastLogoutDate' => $user->updated_at ? $user->updated_at->format('Y-m-d') : now()->format('Y-m-d'),
                    'status' => 'active',
                    'enrolledCourses' => $enrolledCourses,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete student (soft delete - move to deleted list)
     */
    public function deleteStudent($id)
    {
        try {
            $numericId = (int) preg_replace('/[^0-9]/', '', $id);
            $user = User::where('role', 'student')->findOrFail($numericId);

            // Soft delete the user
            $user->delete();

            return response()->json([
                'message' => 'Student deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get deleted students
     */
    public function getDeletedStudents()
    {
        try {
            $students = User::where('role', 'student')
                ->onlyTrashed()
                ->with('studentProfile')
                ->select('id', 'name', 'email', 'created_at', 'updated_at', 'deleted_at')
                ->get()
                ->map(function ($user) {
                    $nameParts = explode(' ', $user->name, 2);

                    // Count enrolled courses from course_student table using students.id
                    $enrolledCourses = 0;
                    if ($user->studentProfile) {
                        $enrolledCourses = DB::table('course_student')
                            ->where('student_id', $user->studentProfile->id)
                            ->count();
                    }

                    return [
                        'id' => 'ST' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                        'firstName' => $nameParts[0] ?? '',
                        'lastName' => $nameParts[1] ?? '',
                        'email' => $user->email,
                        'phone' => $user->studentProfile->phone ?? 'N/A',
                        'address' => $user->studentProfile->address ?? 'N/A',
                        'location' => $user->studentProfile->location ?? 'N/A',
                        'firstLoginDate' => $user->created_at ? $user->created_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'lastLogoutDate' => $user->updated_at ? $user->updated_at->format('Y-m-d') : now()->format('Y-m-d'),
                        'deletedDate' => $user->deleted_at ? $user->deleted_at->format('Y-m-d') : null,
                        'status' => $user->studentProfile->status ?? 'active',
                        'enrolledCourses' => $enrolledCourses,
                    ];
                });

            return response()->json($students);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch deleted students',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Restore a deleted student
     */
    public function restoreStudent($id)
    {
        try {
            $numericId = (int) preg_replace('/[^0-9]/', '', $id);
            $user = User::where('role', 'student')->onlyTrashed()->findOrFail($numericId);

            $user->restore();

            return response()->json([
                'message' => 'Student restored successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to restore student',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new teacher
     */
    public function createTeacher(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email',
                'password' => 'required|string|min:6',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'location' => 'nullable|string',
                'subject' => 'nullable|string',
                'department' => 'nullable|string',
                'specialization' => 'nullable|string',
                'experience' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->firstName . ' ' . $request->lastName,
                'email' => $request->email,
                'password' => Hash::make($request->password),
                'role' => 'teacher',
                'email_verified_at' => now(),
            ]);

            // Create teacher profile
            TeacherProfile::create([
                'user_id' => $user->id,
                'phone' => $request->phone,
                'bio' => $request->address,
                'location' => $request->location,
                'department' => $request->subject ?? $request->department,
                'specialization' => $request->specialization,
                'experience' => $request->experience,
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Teacher created successfully',
                'teacher' => [
                    'id' => 'T' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'firstName' => $request->firstName,
                    'lastName' => $request->lastName,
                    'email' => $user->email,
                    'phone' => $request->phone ?? 'N/A',
                    'department' => $request->subject ?? $request->department ?? 'N/A',
                    'specialization' => $request->specialization ?? 'N/A',
                    'hireDate' => $user->created_at->format('Y-m-d'),
                    'lastActive' => $user->updated_at->format('Y-m-d'),
                    'status' => 'active',
                    'coursesCount' => 0,
                ]
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to create teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update teacher
     */
    public function updateTeacher(Request $request, $id)
    {
        try {
            $numericId = (int) preg_replace('/[^0-9]/', '', $id);
            $user = User::where('role', 'teacher')->findOrFail($numericId);

            $validator = Validator::make($request->all(), [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $user->id,
                'password' => 'nullable|string|min:6',
                'phone' => 'nullable|string',
                'address' => 'nullable|string',
                'location' => 'nullable|string',
                'subject' => 'nullable|string',
                'department' => 'nullable|string',
                'specialization' => 'nullable|string',
                'experience' => 'nullable|integer',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            DB::beginTransaction();

            $user->name = $request->firstName . ' ' . $request->lastName;
            $user->email = $request->email;

            if ($request->filled('password')) {
                $user->password = Hash::make($request->password);
            }

            $user->save();

            $user->teacherProfile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'phone' => $request->phone,
                    'bio' => $request->address,
                    'location' => $request->location,
                    'department' => $request->subject ?? $request->department,
                    'specialization' => $request->specialization,
                    'experience' => $request->experience,
                ]
            );

            DB::commit();

            // Count courses assigned to this teacher
            $coursesCount = DB::table('courses')
                ->where('teacher_id', $user->id)
                ->count();

            return response()->json([
                'message' => 'Teacher updated successfully',
                'teacher' => [
                    'id' => 'T' . str_pad($user->id, 3, '0', STR_PAD_LEFT),
                    'firstName' => $request->firstName,
                    'lastName' => $request->lastName,
                    'email' => $user->email,
                    'phone' => $request->phone ?? 'N/A',
                    'department' => $request->subject ?? $request->department ?? 'N/A',
                    'specialization' => $request->specialization ?? 'N/A',
                    'hireDate' => $user->created_at->format('Y-m-d'),
                    'lastActive' => $user->updated_at->format('Y-m-d'),
                    'status' => 'active',
                    'coursesCount' => $coursesCount,
                ]
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete teacher
     */
    public function deleteTeacher($id)
    {
        try {
            $numericId = (int) preg_replace('/[^0-9]/', '', $id);
            $user = User::where('role', 'teacher')->findOrFail($numericId);

            $user->delete();

            return response()->json([
                'message' => 'Teacher deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete teacher',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all payments from course_student table
     */
    public function getPayments()
    {
        try {
            $payments = DB::table('course_student')
                ->join('students', 'course_student.student_id', '=', 'students.id')
                ->join('users', 'students.user_id', '=', 'users.id')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->select(
                    'course_student.id',
                    'course_student.transaction_id',
                    'course_student.student_id',
                    'users.name as student_name',
                    'users.avatar as student_avatar',
                    'course_student.course_id',
                    'courses.title as course_name',
                    'course_student.amount_paid as amount',
                    'course_student.payment_status as status',
                    'course_student.payment_method',
                    'course_student.payment_date'
                )
                ->orderBy('course_student.payment_date', 'desc')
                ->get()
                ->map(function ($payment) {
                    return [
                        'id' => $payment->id,
                        'transaction_id' => $payment->transaction_id ?? 'TXN' . str_pad($payment->id, 9, '0', STR_PAD_LEFT),
                        'student_id' => $payment->student_id,
                        'student_name' => $payment->student_name,
                        'student_avatar' => $payment->student_avatar,
                        'course_id' => $payment->course_id,
                        'course_name' => $payment->course_name,
                        'amount' => (float) $payment->amount,
                        'status' => $payment->status === 'paid' ? 'completed' : $payment->status,
                        'payment_method' => $payment->payment_method ?? 'Credit Card',
                        'payment_date' => $payment->payment_date,
                    ];
                });

            return response()->json($payments);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payments',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get payment statistics
     */
    public function getPaymentStats()
    {
        try {
            $totalRevenue = DB::table('course_student')
                ->where('payment_status', 'paid')
                ->sum('amount_paid');

            $paidCount = DB::table('course_student')
                ->where('payment_status', 'paid')
                ->count();

            $pendingCount = DB::table('course_student')
                ->where('payment_status', 'pending')
                ->count();

            $failedCount = DB::table('course_student')
                ->where('payment_status', 'failed')
                ->count();

            return response()->json([
                'totalRevenue' => (float) $totalRevenue,
                'paidCount' => $paidCount,
                'pendingCount' => $pendingCount,
                'failedCount' => $failedCount,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch payment stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get dashboard statistics
     */
    public function getDashboardStats()
    {
        try {
            $totalStudents = User::where('role', 'student')->count();
            $totalTeachers = User::where('role', 'teacher')->count();
            $totalCourses = DB::table('courses')->count();

            $totalRevenue = DB::table('course_student')
                ->where('payment_status', 'paid')
                ->sum('amount_paid');

            // For growth percentages, you could calculate from previous month
            // For now, returning mock growth values
            return response()->json([
                'totalStudents' => $totalStudents,
                'totalTeachers' => $totalTeachers,
                'totalCourses' => $totalCourses,
                'totalRevenue' => (float) $totalRevenue,
                'studentsGrowth' => 12.5,
                'teachersGrowth' => 8.3,
                'coursesGrowth' => 15.7,
                'revenueGrowth' => 23.4,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch dashboard stats',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new payment
     */
    public function createPayment(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'user_id' => 'required|exists:users,id',
                'course_id' => 'required|exists:courses,id',
                'amount_paid' => 'required|numeric|min:0',
                'payment_method' => 'required|string',
                'payment_status' => 'required|in:pending,paid,failed',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get student profile ID from user ID
            $user = User::where('id', $request->user_id)
                ->where('role', 'student')
                ->with('studentProfile')
                ->first();

            if (!$user || !$user->studentProfile) {
                return response()->json([
                    'message' => 'Student not found. Please select a valid student.'
                ], 404);
            }

            $studentId = $user->studentProfile->id;

            // Check if enrollment already exists
            $existing = DB::table('course_student')
                ->where('student_id', $studentId)
                ->where('course_id', $request->course_id)
                ->first();

            if ($existing) {
                return response()->json([
                    'message' => 'This student is already enrolled in this course. Please choose another course or student.'
                ], 409);
            }

            $paymentId = DB::table('course_student')->insertGetId([
                'student_id' => $studentId,
                'course_id' => $request->course_id,
                'amount_paid' => $request->amount_paid,
                'payment_status' => $request->payment_status,
                'payment_method' => $request->payment_method,
                'payment_date' => now(),
                'transaction_id' => 'TXN' . strtoupper(uniqid()),
                'enrolled_at' => now(),
                'progress' => 0,
            ]);

            return response()->json([
                'message' => 'Payment created successfully',
                'payment_id' => $paymentId
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get enrolled courses for a specific student
     */
    public function getStudentEnrolledCourses($userId)
    {
        try {
            $user = User::where('id', $userId)
                ->where('role', 'student')
                ->with('studentProfile')
                ->first();

            if (!$user || !$user->studentProfile) {
                return response()->json([
                    'message' => 'Student not found'
                ], 404);
            }

            $enrolledCourses = DB::table('course_student')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('course_student.student_id', $user->studentProfile->id)
                ->select('courses.id', 'courses.title')
                ->get();

            return response()->json([
                'enrolled_courses' => $enrolledCourses
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch enrolled courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update payment status
     */
    public function updatePayment(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'payment_status' => 'required|in:pending,paid,failed',
                'amount_paid' => 'nullable|numeric|min:0',
                'payment_method' => 'nullable|string',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $updateData = [
                'payment_status' => $request->payment_status,
            ];

            if ($request->filled('amount_paid')) {
                $updateData['amount_paid'] = $request->amount_paid;
            }

            if ($request->filled('payment_method')) {
                $updateData['payment_method'] = $request->payment_method;
            }

            if ($request->payment_status === 'paid' && !$request->has('payment_date')) {
                $updateData['payment_date'] = now();
            }

            DB::table('course_student')
                ->where('id', $id)
                ->update($updateData);

            return response()->json([
                'message' => 'Payment updated successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete payment
     */
    public function deletePayment($id)
    {
        try {
            DB::table('course_student')->where('id', $id)->delete();

            return response()->json([
                'message' => 'Payment deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete payment',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get all admin notifications
     */
    public function getAllNotifications(Request $request)
    {
        try {
            $query = AdminNotification::with(['admin:id,name,email']);

            // Apply filters
            if ($request->has('type') && $request->type !== 'all') {
                $query->where('type', $request->type);
            }

            if ($request->has('priority') && $request->priority !== 'all') {
                $query->where('priority', $request->priority);
            }

            if ($request->has('target_audience') && $request->target_audience !== 'all') {
                $query->where('target_audience', $request->target_audience);
            }

            if ($request->has('published')) {
                $query->where('is_published', $request->published);
            }

            $notifications = $query->orderBy('created_at', 'desc')->get();

            // Format the response with read counts
            $formatted = $notifications->map(function ($notification) {
                $teachersCount = 0;
                $readCount = 0;

                if (in_array($notification->target_audience, ['all_teachers', 'both'])) {
                    $teachersCount = $notification->teachers()->count();
                    $readCount = $notification->teachers()->whereNotNull('read_at')->count();
                }

                return [
                    'id' => $notification->id,
                    'title' => $notification->title,
                    'content' => $notification->content,
                    'type' => $notification->type,
                    'priority' => $notification->priority,
                    'target_audience' => $notification->target_audience,
                    'admin' => $notification->admin ? [
                        'id' => $notification->admin->id,
                        'name' => $notification->admin->name,
                    ] : null,
                    'published' => $notification->is_published,
                    'available_from' => $notification->published_at,
                    'available_until' => $notification->expires_at,
                    'is_active' => $notification->is_active,
                    'recipients_count' => $teachersCount,
                    'read_count' => $readCount,
                    'created_at' => $notification->created_at,
                ];
            });

            return response()->json($formatted);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch notifications',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create admin notification
     */
    public function createNotification(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'type' => 'required|in:announcement,alert,info,update,reminder',
                'priority' => 'required|in:low,normal,high,urgent',
                'target_audience' => 'required|in:all_teachers,all_students,both',
                'available_from' => 'nullable|date',
                'available_until' => 'nullable|date',
                'publish_now' => 'boolean',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $publishNow = $request->input('publish_now', false);

            $notification = AdminNotification::create([
                'admin_id' => auth()->id(),
                'title' => $request->title,
                'content' => $request->content,
                'type' => $request->type,
                'priority' => $request->priority,
                'target_audience' => $request->target_audience,
                'is_published' => $publishNow,
                'published_at' => $publishNow ? now() : $request->available_from,
                'expires_at' => $request->available_until,
            ]);

            // Assign to recipients if published
            if ($publishNow || $request->available_from) {
                $this->assignNotificationToRecipients($notification);
            }

            return response()->json([
                'message' => 'Notification created successfully',
                'notification' => $notification->fresh()
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to create notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Assign notification to recipients based on target audience
     */
    private function assignNotificationToRecipients(AdminNotification $notification)
    {
        if (in_array($notification->target_audience, ['all_teachers', 'both'])) {
            $teachers = Teacher::all();
            $teacherIds = $teachers->pluck('id')->toArray();
            $notification->teachers()->attach($teacherIds);
        }

        if (in_array($notification->target_audience, ['all_students', 'both'])) {
            $students = Student::all();
            $studentIds = $students->pluck('id')->toArray();
            $notification->students()->attach($studentIds);
        }
    }

    /**
     * Update notification
     */
    public function updateNotification(Request $request, $id)
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255',
                'content' => 'required|string',
                'type' => 'required|in:announcement,alert,info,update,reminder',
                'priority' => 'required|in:low,normal,high,urgent',
                'target_audience' => 'required|in:all_teachers,all_students,both',
                'available_from' => 'nullable|date',
                'available_until' => 'nullable|date',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $notification = AdminNotification::findOrFail($id);

            $notification->update([
                'title' => $request->title,
                'content' => $request->content,
                'type' => $request->type,
                'priority' => $request->priority,
                'target_audience' => $request->target_audience,
                'published_at' => $request->available_from,
                'expires_at' => $request->available_until,
            ]);

            // Re-assign if target audience changed
            if ($notification->is_published) {
                $notification->teachers()->detach();
                $notification->students()->detach();
                $this->assignNotificationToRecipients($notification);
            }

            return response()->json([
                'message' => 'Notification updated successfully',
                'notification' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete notification
     */
    public function deleteNotification($id)
    {
        try {
            $notification = AdminNotification::findOrFail($id);
            $notification->delete();

            return response()->json([
                'message' => 'Notification deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to delete notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Publish notification
     */
    public function publishNotification($id)
    {
        try {
            $notification = AdminNotification::findOrFail($id);

            $notification->update([
                'is_published' => true,
                'published_at' => now(),
            ]);

            // Assign to recipients when publishing
            $this->assignNotificationToRecipients($notification);

            return response()->json([
                'message' => 'Notification published successfully',
                'notification' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to publish notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Unpublish notification
     */
    public function unpublishNotification($id)
    {
        try {
            $notification = AdminNotification::findOrFail($id);

            $notification->update([
                'is_published' => false,
            ]);

            return response()->json([
                'message' => 'Notification unpublished successfully',
                'notification' => $notification->fresh()
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to unpublish notification',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get student courses
     */
    public function getStudentCourses($id)
    {
        try {
            $user = User::where('role', 'student')->with('studentProfile')->findOrFail($id);

            if (!$user->studentProfile) {
                return response()->json([]);
            }

            $courses = DB::table('course_student')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('course_student.student_id', $user->studentProfile->id)
                ->select('courses.*')
                ->get();

            return response()->json($courses);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch student courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update student courses
     */
    public function updateStudentCourses(Request $request, $id)
    {
        try {
            $user = User::where('role', 'student')->with('studentProfile')->findOrFail($id);

            if (!$user->studentProfile) {
                return response()->json([
                    'message' => 'Student profile not found'
                ], 404);
            }

            DB::beginTransaction();

            // Remove all existing courses
            DB::table('course_student')->where('student_id', $user->studentProfile->id)->delete();

            // Add new courses
            if ($request->has('course_ids') && is_array($request->course_ids)) {
                foreach ($request->course_ids as $courseId) {
                    DB::table('course_student')->insert([
                        'student_id' => $user->studentProfile->id,
                        'course_id' => $courseId,
                        'enrolled_at' => now(),
                        'created_at' => now(),
                        'updated_at' => now(),
                    ]);
                }
            }

            DB::commit();

            return response()->json([
                'message' => 'Student courses updated successfully',
                'enrolled_count' => count($request->course_ids ?? [])
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Failed to update student courses',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get admin profile
     */
    public function getProfile()
    {
        try {
            $admin = auth()->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $nameParts = explode(' ', $admin->name, 2);

            return response()->json([
                'firstName' => $nameParts[0] ?? '',
                'lastName' => $nameParts[1] ?? '',
                'email' => $admin->email,
                'phone' => $admin->phone ?? '',
                'role' => 'Administrator',
                'joinedDate' => $admin->created_at->format('Y-m-d'),
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update admin profile
     */
    public function updateProfile(Request $request)
    {
        try {
            $admin = auth()->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'firstName' => 'required|string|max:255',
                'lastName' => 'required|string|max:255',
                'email' => 'required|email|unique:users,email,' . $admin->id,
                'phone' => 'nullable|string|max:20',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Update user
            $admin->name = $request->firstName . ' ' . $request->lastName;
            $admin->email = $request->email;

            // Add phone column to users table if needed, or store in separate table
            if ($request->has('phone')) {
                // For now, we'll just update the user record
                // You might need to add phone column to users table
                DB::table('users')
                    ->where('id', $admin->id)
                    ->update([
                        'name' => $admin->name,
                        'email' => $admin->email,
                        'updated_at' => now(),
                    ]);
            } else {
                $admin->save();
            }

            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => [
                    'firstName' => $request->firstName,
                    'lastName' => $request->lastName,
                    'email' => $request->email,
                    'phone' => $request->phone,
                ]
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to update profile',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Change admin password
     */
    public function changePassword(Request $request)
    {
        try {
            $admin = auth()->user();

            if (!$admin || $admin->role !== 'admin') {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 403);
            }

            $validator = Validator::make($request->all(), [
                'currentPassword' => 'required|string',
                'newPassword' => 'required|string|min:8|regex:/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Verify current password
            if (!Hash::check($request->currentPassword, $admin->password)) {
                return response()->json([
                    'message' => 'Le mot de passe actuel est incorrect'
                ], 400);
            }

            // Check if new password is different from current
            if (Hash::check($request->newPassword, $admin->password)) {
                return response()->json([
                    'message' => 'Le nouveau mot de passe doit être différent de l\'ancien'
                ], 400);
            }

            // Update password
            $admin->password = Hash::make($request->newPassword);
            $admin->save();

            return response()->json([
                'message' => 'Password changed successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to change password',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get recent activities (enrollments, payments, completions)
     */
    public function getRecentActivities()
    {
        try {
            $activities = [];

            // Get recent enrollments (course_student table)
            $enrollments = DB::table('course_student')
                ->join('students', 'course_student.student_id', '=', 'students.id')
                ->join('users', 'students.user_id', '=', 'users.id')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->select(
                    'course_student.id',
                    'users.name as student_name',
                    'courses.title as course_name',
                    'course_student.enrolled_at as timestamp',
                    DB::raw("'enrollment' as type"),
                    DB::raw("'New enrollment' as details")
                )
                ->orderBy('course_student.enrolled_at', 'desc')
                ->limit(10)
                ->get();

            foreach ($enrollments as $enrollment) {
                $activities[] = [
                    'id' => 'E' . $enrollment->id,
                    'type' => 'enrollment',
                    'student_name' => $enrollment->student_name,
                    'course_name' => $enrollment->course_name,
                    'timestamp' => $enrollment->timestamp,
                    'details' => $enrollment->details,
                ];
            }

            // Get recent payments from course_student table where payment_status is completed
            $payments = DB::table('course_student')
                ->join('students', 'course_student.student_id', '=', 'students.id')
                ->join('users', 'students.user_id', '=', 'users.id')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('course_student.payment_status', 'completed')
                ->whereNotNull('course_student.payment_date')
                ->select(
                    'course_student.id',
                    'users.name as student_name',
                    'courses.title as course_name',
                    'course_student.payment_date as timestamp',
                    'course_student.amount_paid as amount',
                    DB::raw("'payment' as type")
                )
                ->orderBy('course_student.payment_date', 'desc')
                ->limit(10)
                ->get();

            foreach ($payments as $payment) {
                $activities[] = [
                    'id' => 'P' . $payment->id,
                    'type' => 'payment',
                    'student_name' => $payment->student_name,
                    'course_name' => $payment->course_name,
                    'timestamp' => $payment->timestamp,
                    'details' => 'Payment received: ' . number_format($payment->amount, 2) . ' DH',
                ];
            }

            // Get recent course completions (courses with progress = 100)
            $completions = DB::table('course_student')
                ->join('students', 'course_student.student_id', '=', 'students.id')
                ->join('users', 'students.user_id', '=', 'users.id')
                ->join('courses', 'course_student.course_id', '=', 'courses.id')
                ->where('course_student.progress', 100)
                ->select(
                    'course_student.id',
                    'users.name as student_name',
                    'courses.title as course_name',
                    'course_student.updated_at as timestamp',
                    DB::raw("'completion' as type"),
                    DB::raw("'Course completed' as details")
                )
                ->orderBy('course_student.updated_at', 'desc')
                ->limit(10)
                ->get();

            foreach ($completions as $completion) {
                $activities[] = [
                    'id' => 'C' . $completion->id,
                    'type' => 'completion',
                    'student_name' => $completion->student_name,
                    'course_name' => $completion->course_name,
                    'timestamp' => $completion->timestamp,
                    'details' => $completion->details,
                ];
            }

            // Sort all activities by timestamp (most recent first)
            usort($activities, function ($a, $b) {
                return strtotime($b['timestamp']) - strtotime($a['timestamp']);
            });

            // Return only the 15 most recent activities
            return response()->json(array_slice($activities, 0, 15));

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Failed to fetch recent activities',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
