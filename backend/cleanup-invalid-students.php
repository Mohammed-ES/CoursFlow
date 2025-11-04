<?php

require __DIR__.'/vendor/autoload.php';

$app = require_once __DIR__.'/bootstrap/app.php';
$app->make('Illuminate\Contracts\Console\Kernel')->bootstrap();

use App\Models\Student;
use Illuminate\Support\Facades\DB;

echo "=== Nettoyage des étudiants sans user ===\n\n";

// Trouver les étudiants sans user
$studentsWithoutUser = Student::whereDoesntHave('user')->get();

echo "Étudiants sans user trouvés: " . $studentsWithoutUser->count() . "\n";

if ($studentsWithoutUser->count() > 0) {
    foreach ($studentsWithoutUser as $student) {
        echo "  - Student ID: {$student->id}, user_id: {$student->user_id}\n";
    }

    echo "\n⚠️  Suppression des étudiants sans user...\n";

    // Supprimer d'abord les enrollments
    foreach ($studentsWithoutUser as $student) {
        DB::table('course_student')->where('student_id', $student->id)->delete();
        echo "  ✅ Enrollments supprimés pour student ID: {$student->id}\n";
    }

    // Supprimer les étudiants
    Student::whereDoesntHave('user')->delete();
    echo "\n✅ Étudiants sans user supprimés\n";
} else {
    echo "✅ Aucun étudiant sans user trouvé\n";
}

echo "\n=== Vérification finale ===\n";
$validStudents = Student::with('user')->get();
echo "Nombre d'étudiants valides: " . $validStudents->count() . "\n";
foreach ($validStudents as $student) {
    if ($student->user) {
        echo "  ✅ {$student->user->name} (ID: {$student->id})\n";
    }
}
