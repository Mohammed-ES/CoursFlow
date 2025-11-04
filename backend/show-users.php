<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "\n========================================\n";
echo "  CoursFlow Users - OAuth Ready\n";
echo "========================================\n\n";

$users = User::select('id', 'name', 'email', 'role')->orderBy('role')->get();

foreach ($users as $user) {
    $icon = match($user->role) {
        'admin' => '👑',
        'teacher' => '👨‍🏫',
        'student' => '👨‍🎓',
        default => '👤'
    };

    echo sprintf(
        "%s [%d] %-25s | %-30s | %s\n",
        $icon,
        $user->id,
        $user->name,
        $user->email,
        strtoupper($user->role)
    );
}

echo "\n🎯 OAuth Role Attribution:\n";
echo "─────────────────────────────────────\n";
echo "  📧 @admin.edu     → 👑 Admin\n";
echo "  📧 @school.com    → 👨‍🏫 Teacher\n";
echo "  📧 Other domains  → 👨‍🎓 Student\n";
echo "\n========================================\n\n";
