<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use App\Models\User;
use App\Models\Conversation;
use App\Models\Message;
use Illuminate\Support\Facades\Hash;

echo "=== Creation donnees de test ===\n\n";

// 1. Créer des enseignants de test
echo "[1/3] Creation enseignants...\n";
$teacher1 = User::firstOrCreate(
    ['email' => 'teacher1@coursflow.com'],
    [
        'name' => 'Prof. Martin Dupont',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
    ]
);
echo "  - {$teacher1->name} (ID: {$teacher1->id})\n";

$teacher2 = User::firstOrCreate(
    ['email' => 'teacher2@coursflow.com'],
    [
        'name' => 'Prof. Sophie Laurent',
        'password' => Hash::make('password'),
        'email_verified_at' => now(),
    ]
);
echo "  - {$teacher2->name} (ID: {$teacher2->id})\n";

// 2. Créer des conversations
echo "\n[2/3] Creation conversations...\n";
$admin = User::where('email', 'admin@coursflow.com')->first();

$conv1 = Conversation::firstOrCreate(
    ['admin_id' => $admin->id, 'teacher_id' => $teacher1->id],
    ['created_at' => now()->subDays(2), 'updated_at' => now()]
);
echo "  - Conversation avec {$teacher1->name}\n";

$conv2 = Conversation::firstOrCreate(
    ['admin_id' => $admin->id, 'teacher_id' => $teacher2->id],
    ['created_at' => now()->subDay(), 'updated_at' => now()]
);
echo "  - Conversation avec {$teacher2->name}\n";

// 3. Créer des messages
echo "\n[3/3] Creation messages...\n";

// Messages conversation 1
$messages1 = [
    ['sender' => $teacher1, 'text' => 'Bonjour, j\'ai une question sur le cours de PHP.', 'time' => now()->subHours(5)],
    ['sender' => $admin, 'text' => 'Bonjour! Je suis la pour vous aider. Quelle est votre question?', 'time' => now()->subHours(4)],
    ['sender' => $teacher1, 'text' => 'Comment configurer Laravel Sanctum pour l\'API?', 'time' => now()->subHours(3)],
    ['sender' => $admin, 'text' => 'Il faut installer le package avec composer require laravel/sanctum', 'time' => now()->subHours(2)],
    ['sender' => $teacher1, 'text' => 'Merci! Et pour les routes API?', 'time' => now()->subHour()],
];

foreach ($messages1 as $msg) {
    Message::firstOrCreate([
        'conversation_id' => $conv1->id,
        'sender_type' => get_class($msg['sender']),
        'sender_id' => $msg['sender']->id,
        'message_text' => $msg['text'],
        'created_at' => $msg['time'],
    ]);
}
$count1 = count($messages1);
echo "  - {$count1} messages dans conversation 1\n";

// Messages conversation 2
$messages2 = [
    ['sender' => $admin, 'text' => 'Bonjour Sophie! Comment se passe votre cours de React?', 'time' => now()->subHours(6)],
    ['sender' => $teacher2, 'text' => 'Tres bien! Les etudiants progressent rapidement.', 'time' => now()->subHours(5)],
    ['sender' => $teacher2, 'text' => 'J\'ai besoin de nouveaux exercices sur les hooks.', 'time' => now()->subHours(4)],
];

foreach ($messages2 as $msg) {
    Message::firstOrCreate([
        'conversation_id' => $conv2->id,
        'sender_type' => get_class($msg['sender']),
        'sender_id' => $msg['sender']->id,
        'message_text' => $msg['text'],
        'created_at' => $msg['time'],
    ]);
}
$count2 = count($messages2);
echo "  - {$count2} messages dans conversation 2\n";

echo "\n=== Donnees de test creees avec succes! ===\n";
echo "\nStatistiques:\n";
echo "  - Utilisateurs: " . User::count() . "\n";
echo "  - Conversations: " . Conversation::count() . "\n";
echo "  - Messages: " . Message::count() . "\n";
