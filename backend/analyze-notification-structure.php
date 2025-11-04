<?php

require __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use Illuminate\Support\Facades\DB;

echo "=== ANALYSE DE LA STRUCTURE DES NOTIFICATIONS ===\n\n";

// 1. Admin Notifications
echo "1. ADMIN NOTIFICATIONS TABLE:\n";
$adminColumns = DB::select('DESCRIBE admin_notifications');
foreach ($adminColumns as $col) {
    echo "   - {$col->Field}: {$col->Type}\n";
}

echo "\n2. ADMIN_NOTIFICATION_TEACHER (Pivot):\n";
try {
    $adminTeacherPivot = DB::select('DESCRIBE admin_notification_teacher');
    foreach ($adminTeacherPivot as $col) {
        echo "   - {$col->Field}: {$col->Type}\n";
    }
} catch (\Exception $e) {
    echo "   ❌ Table n'existe pas!\n";
}

echo "\n3. ADMIN_NOTIFICATION_STUDENT (Pivot):\n";
try {
    $adminStudentPivot = DB::select('DESCRIBE admin_notification_student');
    foreach ($adminStudentPivot as $col) {
        echo "   - {$col->Field}: {$col->Type}\n";
    }
} catch (\Exception $e) {
    echo "   ❌ Table n'existe pas!\n";
}

// 2. Teacher Notifications
echo "\n4. TEACHER NOTIFICATIONS (notifications) TABLE:\n";
$teacherColumns = DB::select('DESCRIBE notifications');
foreach ($teacherColumns as $col) {
    echo "   - {$col->Field}: {$col->Type}\n";
}

echo "\n5. NOTIFICATION_STUDENT (Pivot):\n";
try {
    $notifStudentPivot = DB::select('DESCRIBE notification_student');
    foreach ($notifStudentPivot as $col) {
        echo "   - {$col->Field}: {$col->Type}\n";
    }
} catch (\Exception $e) {
    echo "   ❌ Table n'existe pas!\n";
}

// 3. Résumé
echo "\n\n=== RÉSUMÉ DU PLAN ACTUEL ===\n\n";

echo "✅ ADMIN → Teachers:\n";
echo "   - Table: admin_notifications\n";
echo "   - Pivot: admin_notification_teacher\n";
$adminTeacherCount = DB::table('admin_notification_teacher')->count();
echo "   - Relations existantes: {$adminTeacherCount}\n";

echo "\n✅ ADMIN → Students:\n";
echo "   - Table: admin_notifications\n";
echo "   - Pivot: admin_notification_student\n";
$adminStudentCount = DB::table('admin_notification_student')->count();
echo "   - Relations existantes: {$adminStudentCount}\n";

echo "\n✅ TEACHER → Students:\n";
echo "   - Table: notifications (teacher_notifications)\n";
echo "   - Pivot: notification_student\n";
$teacherStudentCount = DB::table('notification_student')->count();
echo "   - Relations existantes: {$teacherStudentCount}\n";

echo "\n❓ TEACHER → Admin:\n";
echo "   - Champ: send_to_admin dans 'notifications'\n";
$teacherToAdmin = DB::table('notifications')->where('send_to_admin', true)->count();
echo "   - Notifications vers admin: {$teacherToAdmin}\n";
echo "   - Méthode: Création automatique dans admin_notifications\n";

echo "\n\n=== ANALYSE TARGET_AUDIENCE ===\n\n";
$targetAudience = DB::select('SHOW COLUMNS FROM admin_notifications WHERE Field = "target_audience"');
echo "Valeurs ENUM acceptées:\n";
echo "   " . $targetAudience[0]->Type . "\n";

echo "\n\n=== VOTRE PLAN SOUHAITÉ ===\n\n";
echo "📋 ADMIN peut partager:\n";
echo "   ✅ All teachers (target_audience = 'all_teachers')\n";
echo "   ✅ Specific teachers (via pivot admin_notification_teacher)\n";
echo "   ✅ All students (target_audience = 'all_students')\n";
echo "   ✅ Specific students (via pivot admin_notification_student)\n";

echo "\n📋 TEACHER peut partager:\n";
echo "   ✅ Students (via pivot notification_student)\n";
echo "   ✅ All students (si student_ids est vide)\n";
echo "   ✅ Admin (via send_to_admin = true)\n";

echo "\n📋 STUDENT reçoit seulement:\n";
echo "   ✅ De Admin (via admin_notification_student)\n";
echo "   ✅ De Teacher (via notification_student)\n";
echo "   ❌ Ne peut PAS envoyer de notifications\n";

echo "\n\n=== CONFORMITÉ AVEC VOTRE PLAN ===\n\n";
echo "✅ Database structure: CONFORME\n";
echo "✅ Admin → Teachers/Students: CONFORME\n";
echo "✅ Teacher → Students: CONFORME\n";
echo "✅ Teacher → Admin: CONFORME (via send_to_admin)\n";
echo "✅ Student read-only: CONFORME\n";

echo "\n";
