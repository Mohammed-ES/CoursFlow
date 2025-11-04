<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "\n========================================\n";
echo "  Reset User Passwords\n";
echo "  CoursFlow - Smart Learning Platform\n";
echo "========================================\n\n";

$password = 'password123';
$hashedPassword = Hash::make($password);

$users = User::all();

echo "🔑 Resetting all passwords to: {$password}\n\n";

foreach ($users as $user) {
    $user->password = $hashedPassword;
    $user->save();

    $icon = match($user->role) {
        'admin' => '👑',
        'teacher' => '👨‍🏫',
        'student' => '👨‍🎓',
        default => '👤'
    };

    echo sprintf(
        "  ✓ %s %-25s | %-30s\n",
        $icon,
        $user->name,
        $user->email
    );
}

echo "\n========================================\n";
echo "  📋 Login Credentials\n";
echo "========================================\n\n";

$users = User::select('name', 'email', 'role')->orderBy('role')->get();

foreach ($users as $user) {
    $icon = match($user->role) {
        'admin' => '👑',
        'teacher' => '👨‍🏫',
        'student' => '👨‍🎓',
        default => '👤'
    };

    echo sprintf("%s %-12s | %-30s\n", $icon, strtoupper($user->role), $user->email);
}

echo "\n🔐 Password for ALL users: {$password}\n";
echo "\n💡 Example login:\n";
echo "   Email: admin@admin.edu\n";
echo "   Password: {$password}\n";
echo "\n========================================\n\n";
