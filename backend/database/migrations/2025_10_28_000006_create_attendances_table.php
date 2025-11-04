<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('attendances', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('student_id');
            $table->unsignedBigInteger('teacher_id');
            $table->date('date');
            $table->string('status')->default('absent'); // present, absent, late, excused
            $table->text('notes')->nullable(); // Notes du professeur
            $table->time('check_in_time')->nullable();
            $table->timestamps();

            // Contrainte unique : une présence par étudiant par cours par jour
            $table->unique(['course_id', 'student_id', 'date']);

            // Index
            $table->index('course_id');
            $table->index('student_id');
            $table->index('teacher_id');
            $table->index('date');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('attendances');
    }
};
