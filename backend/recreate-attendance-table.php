<?php
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔧 Recreating attendance table with correct structure\n";
echo "====================================================\n\n";

// Drop and recreate attendance table with student_id referencing students table
echo "📋 Dropping old attendance table...\n";
\DB::statement("DROP TABLE IF EXISTS attendance");

echo "📋 Creating new attendance table (student_id → students.id)...\n";
\DB::statement("
    CREATE TABLE attendance (
        id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        student_id BIGINT UNSIGNED NOT NULL,
        course_id BIGINT UNSIGNED NOT NULL,
        teacher_id BIGINT UNSIGNED NULL,
        date DATE NOT NULL,
        status ENUM('present', 'absent', 'late') NOT NULL DEFAULT 'present',
        check_in_time TIMESTAMP NULL,
        notes TEXT NULL,
        created_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (course_id) REFERENCES courses(id) ON DELETE CASCADE,
        FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
        INDEX idx_student_course (student_id, course_id),
        INDEX idx_date (date)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
");
echo "✅ Attendance table created with correct structure!\n\n";

// Add attendance records
echo "📊 Adding attendance records (100% present)...\n";

$enrollments = \DB::table('course_student')->get();
$recordsAdded = 0;

foreach ($enrollments as $enrollment) {
    // Add 10 days of attendance (all present)
    for ($i = 0; $i < 10; $i++) {
        $date = date('Y-m-d', strtotime("-{$i} days"));
        $checkInTime = date('Y-m-d H:i:s', strtotime("-{$i} days 09:00:00"));

        \DB::table('attendance')->insert([
            'student_id' => $enrollment->student_id, // Now correctly references students.id
            'course_id' => $enrollment->course_id,
            'teacher_id' => null,
            'date' => $date,
            'status' => 'present',
            'check_in_time' => $checkInTime,
            'notes' => 'Sample attendance record',
            'created_at' => now(),
            'updated_at' => now(),
        ]);
        $recordsAdded++;
    }
}

echo "✅ Added {$recordsAdded} attendance records\n\n";

// Verify
$totalRecords = \DB::table('attendance')->count();
$presentRecords = \DB::table('attendance')->where('status', 'present')->count();
$attendanceRate = $totalRecords > 0 ? ($presentRecords / $totalRecords) * 100 : 0;

echo "📈 Final Statistics:\n";
echo "   - Total attendance records: {$totalRecords}\n";
echo "   - Present records: {$presentRecords}\n";
echo "   - Attendance Rate: " . round($attendanceRate, 1) . "%\n\n";

echo "✅ Done! Attendance table ready with 100% attendance rate.\n";
echo "✅ Now the attendance page should display students correctly!\n";
