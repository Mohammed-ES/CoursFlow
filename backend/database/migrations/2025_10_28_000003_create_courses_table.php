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
        Schema::create('courses', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('subject'); // Matière
            $table->string('level')->default('beginner'); // beginner, intermediate, advanced
            $table->decimal('price', 10, 2)->default(0);
            $table->integer('duration_hours')->default(0); // Durée en heures
            $table->integer('max_students')->default(30);
            $table->string('thumbnail')->nullable(); // Image du cours
            $table->string('status')->default('draft'); // draft, published, archived
            $table->date('start_date')->nullable();
            $table->date('end_date')->nullable();
            $table->timestamps();

            // Index
            $table->index('teacher_id');
            $table->index('subject');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
