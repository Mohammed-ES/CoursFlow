<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Teacher;
use App\Models\Student;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin User
        $admin = User::firstOrCreate(
            ['email' => 'admin@example.com'],
            [
                'name' => 'Admin User',
                'password' => Hash::make('password'),
                'role' => 'admin',
            ]
        );

        // Create Teacher User
        $teacherUser = User::firstOrCreate(
            ['email' => 'teacher@example.com'],
            [
                'name' => 'John Smith',
                'password' => Hash::make('password'),
                'role' => 'teacher',
            ]
        );

        // Create Teacher Profile
        if ($teacherUser->wasRecentlyCreated || !Teacher::where('user_id', $teacherUser->id)->exists()) {
            Teacher::create([
                'user_id' => $teacherUser->id,
                'subject' => 'Mathematics',
                'bio' => 'Experienced mathematics teacher with over 10 years of teaching experience.',
                'phone' => '+1234567890',
                'specialization' => 'Algebra, Calculus, Statistics',
                'years_of_experience' => 10,
                'status' => 'active',
            ]);
        }

        // Create Student Users
        $studentEmails = [
            'student1@example.com',
            'student2@example.com',
            'student3@example.com',
        ];

        foreach ($studentEmails as $index => $email) {
            $studentUser = User::firstOrCreate(
                ['email' => $email],
                [
                    'name' => 'Student ' . ($index + 1),
                    'password' => Hash::make('password'),
                    'role' => 'student',
                ]
            );

            // Create Student Profile
            if ($studentUser->wasRecentlyCreated || !Student::where('user_id', $studentUser->id)->exists()) {
                Student::create([
                    'user_id' => $studentUser->id,
                    'student_code' => 'STD' . str_pad($index + 1, 4, '0', STR_PAD_LEFT),
                    'phone' => '+123456789' . $index,
                    'date_of_birth' => '2000-01-01',
                    'address' => '123 Student Street',
                    'status' => 'active',
                ]);
            }
        }

        $this->command->info('✅ Users seeded successfully!');
        $this->command->info('   Admin: admin@example.com / password');
        $this->command->info('   Teacher: teacher@example.com / password');
        $this->command->info('   Students: student1@example.com, student2@example.com, student3@example.com / password');
    }
}
