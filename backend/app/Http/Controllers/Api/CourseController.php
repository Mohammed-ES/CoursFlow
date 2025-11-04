<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\CourseMaterial;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseController extends Controller
{
    /**
     * Get all courses for the authenticated teacher or all courses for admin
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            \Log::info('CourseController@index called');
            \Log::info('Auth header: ' . $request->header('Authorization'));
            \Log::info('User: ' . ($request->user() ? $request->user()->id : 'NULL'));

            $user = $request->user();

            // Build query
            $query = Course::query()
                ->withCount(['students as enrolled_count' => function ($q) {
                    $q->where('course_student.payment_status', 'paid');
                }])
                ->with(['materials']);

            // If user is a teacher, only show their courses
            if ($user->role === 'teacher') {
                $teacher = $user->teacher;

                if (!$teacher) {
                    \Log::error('Teacher profile not found for user: ' . $user->id);
                    return response()->json(['error' => 'Teacher profile not found'], 404);
                }

                $query->where('teacher_id', $teacher->id);
            }
            // Admin and students can see all courses

            // Filter by status
            if ($request->has('status')) {
                $query->where('status', $request->status);
            }

            // Search by title or subject
            if ($request->has('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('title', 'like', "%{$search}%")
                      ->orWhere('subject', 'like', "%{$search}%");
                });
            }

            // Order by created_at desc
            $query->orderBy('created_at', 'desc');

            // Check if client wants all results (no pagination)
            if ($request->input('all') === 'true' || $request->input('all') === '1') {
                $courses = $query->get();

                // Transform data
                $courses = $courses->map(function ($course) {
                    return [
                        'id' => $course->id,
                        'title' => $course->title,
                        'description' => $course->description,
                        'subject' => $course->subject,
                        'level' => $course->level,
                        'price' => $course->price,
                        'duration_hours' => $course->duration_hours,
                        'max_students' => $course->max_students,
                        'thumbnail' => $course->thumbnail,
                        'status' => $course->status,
                        'start_date' => $course->start_date,
                        'end_date' => $course->end_date,
                        'enrolled_count' => $course->enrolled_count ?? 0,
                        'is_full' => ($course->enrolled_count ?? 0) >= $course->max_students,
                        'materials_count' => $course->materials->count(),
                        'created_at' => $course->created_at,
                    ];
                });

                return response()->json($courses);
            }

            // Paginate or get all
            $perPage = $request->input('per_page', 10);
            $courses = $query->paginate($perPage);

            // Transform data
            $courses->getCollection()->transform(function ($course) {
                return [
                    'id' => $course->id,
                    'title' => $course->title,
                    'description' => $course->description,
                    'subject' => $course->subject,
                    'level' => $course->level,
                    'price' => $course->price,
                    'duration_hours' => $course->duration_hours,
                    'max_students' => $course->max_students,
                    'thumbnail' => $course->thumbnail,
                    'status' => $course->status,
                    'start_date' => $course->start_date,
                    'end_date' => $course->end_date,
                    'enrolled_count' => $course->enrolled_count,
                    'is_full' => $course->enrolled_count >= $course->max_students,
                    'materials_count' => $course->materials->count(),
                    'created_at' => $course->created_at,
                ];
            });

            return response()->json($courses);

        } catch (\Exception $e) {
            \Log::error('CourseController@index error: ' . $e->getMessage());
            \Log::error('Stack trace: ' . $e->getTraceAsString());
            return response()->json(['error' => 'Failed to fetch courses', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get a single course with details
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

            $course = Course::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->withCount(['students as enrolled_count' => function ($q) {
                    $q->where('course_student.payment_status', 'paid');
                }])
                ->with(['materials' => function ($q) {
                    $q->orderBy('order');
                }])
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            return response()->json([
                'id' => $course->id,
                'title' => $course->title,
                'description' => $course->description,
                'subject' => $course->subject,
                'level' => $course->level,
                'price' => $course->price,
                'duration_hours' => $course->duration_hours,
                'max_students' => $course->max_students,
                'thumbnail' => $course->thumbnail,
                'status' => $course->status,
                'start_date' => $course->start_date,
                'end_date' => $course->end_date,
                'enrolled_count' => $course->enrolled_count,
                'is_full' => $course->enrolled_count >= $course->max_students,
                'materials' => $course->materials->map(function ($material) {
                    return [
                        'id' => $material->id,
                        'title' => $material->title,
                        'description' => $material->description,
                        'file_type' => $material->file_type,
                        'file_name' => $material->file_name,
                        'file_size' => $material->file_size,
                        'file_size_human' => $material->file_size_human,
                        'file_icon' => $material->file_icon,
                        'downloads_count' => $material->downloads_count,
                        'is_public' => $material->is_public,
                        'order' => $material->order,
                        'created_at' => $material->created_at,
                    ];
                }),
                'created_at' => $course->created_at,
                'updated_at' => $course->updated_at,
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch course', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Create a new course
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
                'description' => 'required|string',
                'subject' => 'required|string|max:255',
                'level' => 'required|in:beginner,intermediate,advanced',
                'price' => 'required|numeric|min:0',
                'duration_hours' => 'required|integer|min:1',
                'max_students' => 'required|integer|min:1',
                'thumbnail' => 'nullable|string',
                'status' => 'required|in:draft,published,archived',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
            ]);

            $validated['teacher_id'] = $teacher->id;

            $course = Course::create($validated);

            return response()->json([
                'message' => 'Course created successfully',
                'course' => $course,
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to create course', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Update an existing course
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

            $course = Course::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            $validated = $request->validate([
                'title' => 'sometimes|required|string|max:255',
                'description' => 'sometimes|required|string',
                'subject' => 'sometimes|required|string|max:255',
                'level' => 'sometimes|required|in:beginner,intermediate,advanced',
                'price' => 'sometimes|required|numeric|min:0',
                'duration_hours' => 'sometimes|required|integer|min:1',
                'max_students' => 'sometimes|required|integer|min:1',
                'thumbnail' => 'nullable|string',
                'status' => 'sometimes|required|in:draft,published,archived',
                'start_date' => 'nullable|date',
                'end_date' => 'nullable|date|after:start_date',
            ]);

            $course->update($validated);

            return response()->json([
                'message' => 'Course updated successfully',
                'course' => $course->fresh(),
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update course', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete a course
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function destroy($id)
    {
        \Log::info('CourseController@destroy called with ID: ' . $id);
        \Log::info('Request URL: ' . request()->url());

        try {
            $teacher = request()->user()->teacher;
            \Log::info('Teacher found: ' . ($teacher ? $teacher->id : 'NULL'));

            if (!$teacher) {
                \Log::error('Teacher profile not found for user: ' . request()->user()->id);
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $course = Course::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            \Log::info('Course found: ' . ($course ? 'YES (ID: ' . $course->id . ')' : 'NO'));

            if (!$course) {
                \Log::error('Course not found or does not belong to teacher. Course ID: ' . $id . ', Teacher ID: ' . $teacher->id);
                return response()->json(['error' => 'Course not found'], 404);
            }

            // Delete associated materials files
            $materials = CourseMaterial::where('course_id', $id)->get();
            foreach ($materials as $material) {
                if (Storage::disk('public')->exists($material->file_path)) {
                    Storage::disk('public')->delete($material->file_path);
                }
                $material->delete();
            }

            // Delete course
            $course->delete();

            return response()->json([
                'message' => 'Course deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete course', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Get all materials for a course
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getMaterials($id)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $course = Course::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            $materials = CourseMaterial::where('course_id', $id)
                ->orderBy('order')
                ->get();

            return response()->json($materials->map(function ($material) {
                return [
                    'id' => $material->id,
                    'title' => $material->title,
                    'type' => $material->file_type,
                    'file_path' => $material->file_path,
                    'file_size' => $material->file_size,
                    'uploaded_at' => $material->created_at,
                ];
            }));

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch materials', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Upload course material (PDF, image, video)
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function uploadMaterial(Request $request, $id)
    {
        try {
            $teacher = $request->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $course = Course::where('id', $id)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            $validated = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'nullable|string',
                'file' => 'required|file|mimes:pdf,png,jpg,jpeg,mp4|max:51200', // Max 50MB
                'is_public' => 'boolean',
            ]);

            $file = $request->file('file');

            // Determine file type
            $mimeType = $file->getMimeType();
            if (str_starts_with($mimeType, 'image/')) {
                $fileType = 'image';
            } elseif ($mimeType === 'application/pdf') {
                $fileType = 'pdf';
            } elseif (str_starts_with($mimeType, 'video/')) {
                $fileType = 'video';
            } else {
                return response()->json(['error' => 'Invalid file type'], 422);
            }

            // Store file
            $fileName = time() . '_' . Str::slug(pathinfo($file->getClientOriginalName(), PATHINFO_FILENAME)) . '.' . $file->getClientOriginalExtension();
            $filePath = $file->storeAs('courses/' . $id, $fileName, 'public');

            // Get file size in KB
            $fileSize = round($file->getSize() / 1024, 2);

            // Get current max order
            $maxOrder = CourseMaterial::where('course_id', $id)->max('order') ?? 0;

            // Create material record
            $material = CourseMaterial::create([
                'course_id' => $id,
                'teacher_id' => $teacher->id,
                'title' => $validated['title'],
                'description' => $validated['description'] ?? null,
                'file_type' => $fileType,
                'file_path' => $filePath,
                'file_name' => $file->getClientOriginalName(),
                'file_size' => $fileSize,
                'is_public' => $validated['is_public'] ?? true,
                'order' => $maxOrder + 1,
                'downloads_count' => 0,
            ]);

            return response()->json([
                'message' => 'Material uploaded successfully',
                'material' => [
                    'id' => $material->id,
                    'title' => $material->title,
                    'description' => $material->description,
                    'file_type' => $material->file_type,
                    'file_name' => $material->file_name,
                    'file_size' => $material->file_size,
                    'file_size_human' => $material->file_size_human,
                    'file_icon' => $material->file_icon,
                    'is_public' => $material->is_public,
                    'order' => $material->order,
                ],
            ], 201);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to upload material', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Delete course material
     *
     * @param int $courseId
     * @param int $materialId
     * @return \Illuminate\Http\JsonResponse
     */
    public function deleteMaterial($courseId, $materialId)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $course = Course::where('id', $courseId)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            $material = CourseMaterial::where('id', $materialId)
                ->where('course_id', $courseId)
                ->first();

            if (!$material) {
                return response()->json(['error' => 'Material not found'], 404);
            }

            // Delete file from storage
            if (Storage::disk('public')->exists($material->file_path)) {
                Storage::disk('public')->delete($material->file_path);
            }

            // Delete record
            $material->delete();

            return response()->json([
                'message' => 'Material deleted successfully',
            ]);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to delete material', 'message' => $e->getMessage()], 500);
        }
    }

    /**
     * Download course material
     *
     * @param int $courseId
     * @param int $materialId
     * @return \Symfony\Component\HttpFoundation\StreamedResponse
     */
    public function downloadMaterial($courseId, $materialId)
    {
        try {
            $teacher = request()->user()->teacher;

            if (!$teacher) {
                return response()->json(['error' => 'Teacher profile not found'], 404);
            }

            $course = Course::where('id', $courseId)
                ->where('teacher_id', $teacher->id)
                ->first();

            if (!$course) {
                return response()->json(['error' => 'Course not found'], 404);
            }

            $material = CourseMaterial::where('id', $materialId)
                ->where('course_id', $courseId)
                ->first();

            if (!$material) {
                return response()->json(['error' => 'Material not found'], 404);
            }

            // Increment download counter
            $material->incrementDownloads();

            // Return file download
            return Storage::disk('public')->download($material->file_path, $material->file_name);

        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to download material', 'message' => $e->getMessage()], 500);
        }
    }
}
