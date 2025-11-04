<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== STUDENTS LIST ===\n\n";

$students = DB::table('users')
    ->join('students', 'users.id', '=', 'students.user_id')
    ->select('users.id', 'users.email', 'users.name', 'students.id as student_id')
    ->get();

if ($students->isEmpty()) {
    echo "No students found.\n";
} else {
    foreach ($students as $student) {
        echo "Student ID: {$student->student_id}\n";
        echo "User ID: {$student->id}\n";
        echo "Name: {$student->name}\n";
        echo "Email: {$student->email}\n";
        echo "---\n";
    }
}

echo "\n=== CHECKING PAID COURSES ===\n\n";

$enrollments = DB::table('course_student')
    ->join('students', 'course_student.student_id', '=', 'students.id')
    ->join('users', 'students.user_id', '=', 'users.id')
    ->join('courses', 'course_student.course_id', '=', 'courses.id')
    ->select('users.name as student_name', 'courses.title as course_title', 'course_student.payment_status')
    ->get();

if ($enrollments->isEmpty()) {
    echo "No enrollments found.\n";
} else {
    foreach ($enrollments as $enrollment) {
        echo "Student: {$enrollment->student_name}\n";
        echo "Course: {$enrollment->course_title}\n";
        echo "Payment Status: {$enrollment->payment_status}\n";
        echo "---\n";
    }
}

echo "\n=== PUBLISHED QUIZZES ===\n\n";

$quizzes = DB::table('quizzes')
    ->join('courses', 'quizzes.course_id', '=', 'courses.id')
    ->where('quizzes.status', 'published')
    ->select('quizzes.id', 'quizzes.title', 'courses.title as course_title')
    ->get();

if ($quizzes->isEmpty()) {
    echo "No published quizzes found.\n";
} else {
    foreach ($quizzes as $quiz) {
        echo "Quiz ID: {$quiz->id}\n";
        echo "Quiz Title: {$quiz->title}\n";
        echo "Course: {$quiz->course_title}\n";
        echo "---\n";
    }
}
