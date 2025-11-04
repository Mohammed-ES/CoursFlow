<?php

require __DIR__ . '/vendor/autoload.php';

use Illuminate\Support\Facades\DB;

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Resetting Auto-Increment ===\n\n";

// Get the maximum ID
$maxId = DB::table('attendance')->max('id');
$nextId = $maxId ? $maxId + 1 : 1;

echo "Max ID: {$maxId}\n";
echo "Next ID will be: {$nextId}\n\n";

// Reset auto-increment
DB::statement("ALTER TABLE attendance AUTO_INCREMENT = {$nextId}");

echo "✅ Auto-increment reset to {$nextId}\n";
