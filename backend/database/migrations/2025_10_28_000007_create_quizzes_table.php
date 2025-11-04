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
        Schema::create('quizzes', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('teacher_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->json('questions'); // Questions générées par IA (JSON)
            $table->integer('duration_minutes')->default(30);
            $table->integer('total_marks')->default(100);
            $table->integer('passing_marks')->default(50);
            $table->integer('max_attempts')->nullable(); // Maximum number of attempts allowed (null = unlimited)
            $table->string('difficulty')->default('medium'); // easy, medium, hard
            $table->boolean('is_ai_generated')->default(false);
            $table->string('status')->default('draft'); // draft, published, archived
            $table->timestamp('available_from')->nullable();
            $table->timestamp('available_until')->nullable();
            $table->timestamps();

            // Index
            $table->index('course_id');
            $table->index('teacher_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('quizzes');
    }
};
