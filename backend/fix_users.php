<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "\n===========================================\n";
echo "   FIX USERS DATA\n";
echo "===========================================\n\n";

// Fix Admin
$admin = User::where('email', 'like', '%admin%')->first();
if ($admin) {
    $admin->email = 'admin@coursflow.com';
    $admin->role = 'admin';
    $admin->name = 'Admin User';
    $admin->password = Hash::make('password');
    $admin->save();
    echo "✅ ADMIN: {$admin->email} | Role: {$admin->role}\n";
}

// Fix Teacher
$teacher = User::where('email', 'like', '%teacher%')->first();
if ($teacher) {
    $teacher->email = 'teacher@coursflow.com';
    $teacher->role = 'teacher';
    $teacher->name = 'John Smith';
    $teacher->password = Hash::make('password');
    $teacher->save();
    echo "✅ TEACHER: {$teacher->email} | Role: {$teacher->role}\n";
}

// Fix Student
$student = User::where('email', 'like', '%student%')->first();
if ($student) {
    $student->email = 'student1@coursflow.com';
    $student->role = 'student';
    $student->name = 'Student One';
    $student->password = Hash::make('password');
    $student->save();
    echo "✅ STUDENT: {$student->email} | Role: {$student->role}\n";
}

echo "\n===========================================\n";
echo "✅ ALL USERS FIXED!\n";
echo "===========================================\n\n";

echo "Login credentials:\n";
echo "👤 Admin:   admin@coursflow.com / password\n";
echo "👤 Teacher: teacher@coursflow.com / password\n";
echo "👤 Student: student1@coursflow.com / password\n\n";
