<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\User;

echo "\n========================================\n";
echo "  Update User Emails for OAuth Testing\n";
echo "  CoursFlow - Smart Learning Platform\n";
echo "========================================\n\n";

// Afficher les utilisateurs actuels
echo "📋 Current users:\n";
echo "─────────────────────────────────────\n";
$users = User::select('id', 'name', 'email', 'role')->get();

if ($users->isEmpty()) {
    echo "❌ No users found in database!\n";
    echo "\nPlease create users first using:\n";
    echo "  php artisan tinker\n";
    echo "  User::create(['name'=>'Admin User', 'email'=>'admin@test.com', 'password'=>bcrypt('password'), 'role'=>'admin']);\n\n";
    exit(1);
}

foreach ($users as $user) {
    echo sprintf(
        "  [%d] %-20s | %-30s | %s\n",
        $user->id,
        $user->name,
        $user->email,
        strtoupper($user->role)
    );
}

echo "\n🔄 Updating emails for OAuth role testing...\n";
echo "─────────────────────────────────────\n";

$updated = 0;

foreach ($users as $user) {
    $oldEmail = $user->email;
    $newEmail = null;

    // Attribution basée sur le rôle actuel
    switch ($user->role) {
        case 'admin':
            // Format: firstname@admin.edu
            $firstName = strtolower(explode(' ', $user->name)[0]);
            $newEmail = $firstName . '@admin.edu';
            break;

        case 'teacher':
            // Format: firstname@school.com
            $firstName = strtolower(explode(' ', $user->name)[0]);
            $newEmail = $firstName . '@school.com';
            break;

        case 'student':
            // Format: firstname@gmail.com
            $firstName = strtolower(explode(' ', $user->name)[0]);
            $newEmail = $firstName . '@gmail.com';
            break;
    }

    if ($newEmail && $newEmail !== $oldEmail) {
        try {
            $user->email = $newEmail;
            $user->save();

            echo "  ✓ {$user->name}: {$oldEmail} → {$newEmail}\n";
            $updated++;
        } catch (\Exception $e) {
            echo "  ✗ Failed to update {$user->name}: " . $e->getMessage() . "\n";
        }
    } else {
        echo "  ⊘ {$user->name}: Email already correct ({$oldEmail})\n";
    }
}

echo "\n📊 Summary:\n";
echo "─────────────────────────────────────\n";
echo "  Total users: " . $users->count() . "\n";
echo "  Updated: {$updated}\n";

echo "\n✅ Email update complete!\n";

echo "\n📋 Updated users:\n";
echo "─────────────────────────────────────\n";
$updatedUsers = User::select('id', 'name', 'email', 'role')->get();

foreach ($updatedUsers as $user) {
    echo sprintf(
        "  [%d] %-20s | %-30s | %s\n",
        $user->id,
        $user->name,
        $user->email,
        strtoupper($user->role)
    );
}

echo "\n🎯 OAuth Role Attribution:\n";
echo "─────────────────────────────────────\n";
echo "  @admin.edu emails   → Admin role\n";
echo "  @school.com emails  → Teacher role\n";
echo "  Other emails        → Student role\n";

echo "\n🚀 Ready to test Google OAuth!\n";
echo "  1. Go to: http://localhost:5173/login\n";
echo "  2. Click 'Sign in with Google'\n";
echo "  3. Use a Google account with matching domain\n";
echo "\n========================================\n\n";
