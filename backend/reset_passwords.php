<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;
use Illuminate\Support\Facades\Hash;

echo "\n===========================================\n";
echo "   RESET PASSWORDS FOR ALL USERS\n";
echo "===========================================\n\n";

$users = User::all();

foreach ($users as $user) {
    $user->password = Hash::make('password');
    $user->save();

    echo "✅ {$user->name} ({$user->email}) | Role: {$user->role}\n";
    echo "   Password reset to: password\n\n";
}

echo "===========================================\n";
echo "✅ ALL PASSWORDS RESET TO: password\n";
echo "===========================================\n\n";

echo "You can now login with:\n";
echo "- admin@coursflow.com / password\n";
echo "- teacher@coursflow.com / password\n";
echo "- student1@coursflow.com / password\n\n";
