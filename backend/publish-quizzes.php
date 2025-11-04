<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== PUBLISHING DRAFT QUIZZES ===\n\n";

// Get all draft quizzes
$draftQuizzes = DB::table('quizzes')
    ->where('status', 'draft')
    ->get();

if ($draftQuizzes->isEmpty()) {
    echo "No draft quizzes found.\n";
} else {
    echo "Found {$draftQuizzes->count()} draft quiz(zes). Publishing...\n\n";

    foreach ($draftQuizzes as $quiz) {
        echo "Publishing Quiz ID: {$quiz->id} - {$quiz->title}\n";

        DB::table('quizzes')
            ->where('id', $quiz->id)
            ->update(['status' => 'published']);
    }

    echo "\n✓ All quizzes published successfully!\n";
}

echo "\n=== VERIFYING PUBLISHED QUIZZES ===\n\n";

$publishedQuizzes = DB::table('quizzes')
    ->leftJoin('courses', 'quizzes.course_id', '=', 'courses.id')
    ->where('quizzes.status', 'published')
    ->select('quizzes.id', 'quizzes.title', 'courses.title as course_title', 'quizzes.course_id')
    ->get();

if ($publishedQuizzes->isEmpty()) {
    echo "No published quizzes found.\n";
} else {
    echo "Published Quizzes:\n";
    foreach ($publishedQuizzes as $quiz) {
        echo "- Quiz ID: {$quiz->id}\n";
        echo "  Title: {$quiz->title}\n";
        echo "  Course: " . ($quiz->course_title ?? 'N/A') . " (ID: {$quiz->course_id})\n";
        echo "\n";
    }
}

echo "\n=== CHECKING STUDENT ACCESS ===\n\n";

// Check which courses the student has access to
$studentCourses = DB::table('course_student')
    ->join('courses', 'course_student.course_id', '=', 'courses.id')
    ->where('course_student.student_id', 8)
    ->where('course_student.payment_status', 'paid')
    ->select('courses.id', 'courses.title')
    ->get();

echo "Student has access to:\n";
foreach ($studentCourses as $course) {
    echo "- Course ID: {$course->id} - {$course->title}\n";
}

// Check which quizzes the student can see
$accessibleQuizzes = DB::table('quizzes')
    ->join('course_student', 'quizzes.course_id', '=', 'course_student.course_id')
    ->where('course_student.student_id', 8)
    ->where('course_student.payment_status', 'paid')
    ->where('quizzes.status', 'published')
    ->select('quizzes.id', 'quizzes.title')
    ->get();

echo "\nStudent can see " . $accessibleQuizzes->count() . " quiz(zes):\n";
foreach ($accessibleQuizzes as $quiz) {
    echo "- Quiz ID: {$quiz->id} - {$quiz->title}\n";
}

echo "\n✓ Done!\n";
