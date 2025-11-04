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
        Schema::create('quiz_attempts', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('quiz_id');
            $table->unsignedBigInteger('student_id');
            $table->json('answers'); // Store student's answers
            $table->json('ai_feedback')->nullable(); // Gemini AI feedback
            $table->decimal('score', 5, 2)->nullable(); // Percentage score
            $table->integer('correct_answers')->default(0);
            $table->integer('total_questions')->default(0);
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('submitted_at')->nullable();
            $table->integer('time_spent_seconds')->nullable(); // Time taken
            $table->timestamps();

            // Foreign Keys
            $table->foreign('quiz_id')->references('id')->on('quizzes')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');

            // Index for quick lookup
            $table->index(['quiz_id', 'student_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quiz_attempts');
    }
};
