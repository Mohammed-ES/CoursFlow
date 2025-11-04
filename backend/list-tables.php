<?php

require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

echo "=== Database Tables ===\n\n";

$tables = DB::select('SHOW TABLES');

foreach ($tables as $table) {
    $tableName = array_values((array)$table)[0];
    if (strpos($tableName, 'pay') !== false ||
        strpos($tableName, 'enroll') !== false ||
        strpos($tableName, 'student') !== false ||
        strpos($tableName, 'course') !== false) {
        echo "- $tableName\n";
    }
}
