<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Deleting Old Test Records ===\n\n";

// Delete records with IDs 1-20 (old test data)
$deleted = DB::table('attendance')->whereIn('id', [1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20])->delete();

echo "✅ Deleted {$deleted} old test records\n\n";

echo "=== Remaining Records ===\n";
$remaining = DB::table('attendance')->orderBy('id')->get();
echo "Total: " . $remaining->count() . " records\n\n";

foreach ($remaining as $att) {
    echo "ID: {$att->id}, Date: {$att->date}, Student: {$att->student_id}, Status: {$att->status}\n";
}
