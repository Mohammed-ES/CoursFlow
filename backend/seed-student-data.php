<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;
use App\Models\Course;
use App\Models\Quiz;
use App\Models\QuizQuestion;
use Illuminate\Support\Facades\DB;

echo "=== CREATING TEST DATA FOR STUDENT ===\n\n";

// Get student and teacher
$studentUser = User::where('email', 'student@coursflow.com')->first();
$teacherUser = User::where('email', 'teacher@coursflow.com')->first();

if (!$studentUser || !$teacherUser) {
    echo "❌ Users not found!\n";
    exit(1);
}

$student = $studentUser->student;
$teacher = $teacherUser->teacher;

if (!$student || !$teacher) {
    echo "❌ Student or Teacher profile not found!\n";
    exit(1);
}

echo "✅ Student: {$studentUser->name} (ID: {$student->id})\n";
echo "✅ Teacher: {$teacherUser->name} (ID: {$teacher->id})\n\n";

// 1. Create a Course
echo "--- Creating Course ---\n";
$course = Course::firstOrCreate(
    ['title' => 'Introduction to Programming'],
    [
        'teacher_id' => $teacher->id,
        'subject' => 'Computer Science',
        'description' => 'Learn the fundamentals of programming with practical examples',
        'thumbnail' => '/images/courses/programming.jpg',
        'price' => 99.99,
        'duration_hours' => 40,
        'level' => 'beginner',
        'status' => 'published',
        'category' => 'Programming',
        'language' => 'English',
    ]
);
echo "✅ Course created: {$course->title} (ID: {$course->id})\n";

// 2. Enroll student in course (with paid status)
echo "\n--- Enrolling Student ---\n";
$enrolled = DB::table('course_student')->updateOrInsert(
    [
        'course_id' => $course->id,
        'student_id' => $student->id,
    ],
    [
        'payment_status' => 'paid',
        'progress' => 25,
        'enrolled_at' => now(),
        'created_at' => now(),
        'updated_at' => now(),
    ]
);
echo "✅ Student enrolled in course (paid status)\n";

// 3. Create a Quiz
echo "\n--- Creating Quiz ---\n";
$quiz = Quiz::firstOrCreate(
    ['title' => 'Programming Basics Quiz'],
    [
        'course_id' => $course->id,
        'teacher_id' => $teacher->id,
        'description' => 'Test your knowledge of programming basics',
        'instructions' => 'Answer all questions. You have 30 minutes.',
        'questions' => 5,
        'duration_minutes' => 30,
        'total_marks' => 100,
        'passing_marks' => 60,
        'max_attempts' => 3,
        'status' => 'published',
    ]
);
echo "✅ Quiz created: {$quiz->title} (ID: {$quiz->id})\n";

// 4. Skip Quiz Questions (table doesn't exist yet)
echo "\n--- Skipping Quiz Questions (table not found) ---\n";

// 5. Skip notifications (different table structure)
echo "\n--- Skipping Notifications (teacher-only table) ---\n";

echo "\n=== TEST DATA CREATION COMPLETE ===\n";
echo "\nSummary:\n";
echo "- 1 Course: Introduction to Programming\n";
echo "- Student enrolled with 'paid' status (25% progress)\n";
echo "- 1 Quiz: Programming Basics Quiz\n";
echo "\n✅ Student dashboard should now display real data!\n";
echo "\nRefresh your browser to see the data!\n";
