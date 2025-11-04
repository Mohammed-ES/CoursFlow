<?php
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

echo "🔧 Updating payment_status to 'paid'\n";
echo "=====================================\n\n";

$updated = \DB::table('course_student')
    ->where('payment_status', 'pending')
    ->update([
        'payment_status' => 'paid',
        'amount_paid' => 50.00,
        'payment_method' => 'card',
        'payment_date' => now(),
    ]);

echo "✅ Updated {$updated} enrollments to 'paid' status\n\n";

// Verify
$enrollments = \DB::table('course_student')->get();

echo "📋 Updated enrollments:\n";
foreach ($enrollments as $enrollment) {
    echo "   • Student ID: {$enrollment->student_id}, Course ID: {$enrollment->course_id}, Payment: {$enrollment->payment_status}\n";
}

echo "\n✅ Done! All enrollments are now marked as paid.\n";
echo "✅ The attendance page should now show students!\n";
