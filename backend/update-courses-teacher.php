<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Course;
use App\Models\Teacher;

echo "=== Mise à jour des cours pour Teacher Demo ===\n\n";

// Récupérer le Teacher Demo
$teacher = Teacher::with('user')->where('id', 8)->first();

if (!$teacher) {
    echo "❌ Teacher Demo (ID 8) non trouvé\n";
    exit(1);
}

echo "Teacher trouvé: {$teacher->user->name} (ID: {$teacher->id})\n\n";

// Récupérer les cours avec teacher_id = 16
$courses = Course::where('teacher_id', 16)->get();

if ($courses->isEmpty()) {
    echo "❌ Aucun cours trouvé avec teacher_id = 16\n";
    exit(1);
}

echo "Cours trouvés à mettre à jour:\n";
foreach ($courses as $course) {
    echo "   - ID: {$course->id}, Title: {$course->title}\n";
}

echo "\n⚠️  Mise à jour des cours...\n";

// Mettre à jour tous les cours
$updated = Course::where('teacher_id', 16)->update(['teacher_id' => 8]);

echo "✅ {$updated} cours mis à jour avec succès!\n\n";

// Vérification
echo "Vérification après mise à jour:\n";
$teacherCourses = Course::where('teacher_id', 8)->get();
foreach ($teacherCourses as $course) {
    echo "   ✅ {$course->title} (ID: {$course->id}) - Teacher ID: {$course->teacher_id}\n";
}

echo "\n=== Mise à jour terminée ===\n";
