<?php

require 'vendor/autoload.php';
$app = require 'bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== PUBLISHING QUIZ 9 ===\n\n";

DB::table('quizzes')->where('id', 9)->update(['status' => 'published']);

echo "✅ Quiz 9 (React Components) status updated to 'published'\n\n";

// Verify
$quiz = DB::table('quizzes')->where('id', 9)->first();
echo "Current status: {$quiz->status}\n";
