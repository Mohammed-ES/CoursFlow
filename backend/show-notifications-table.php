<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== NOTIFICATIONS TABLE STRUCTURE ===\n\n";

$columns = DB::select('DESCRIBE notifications');

foreach ($columns as $col) {
    echo "{$col->Field} | {$col->Type} | Null: {$col->Null} | Key: {$col->Key} | Default: {$col->Default}\n";
}
