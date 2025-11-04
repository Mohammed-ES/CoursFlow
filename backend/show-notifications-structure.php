<?php

require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== STRUCTURE OF NOTIFICATIONS TABLE ===\n\n";

$columns = DB::select('DESCRIBE notifications');

foreach($columns as $col) {
    echo "{$col->Field} | {$col->Type} | Null: {$col->Null} | Default: " . ($col->Default ?? 'NULL') . "\n";
}
