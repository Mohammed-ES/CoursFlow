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
        Schema::create('course_materials', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('teacher_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('file_type'); // pdf, image, video
            $table->string('file_path');
            $table->string('file_name');
            $table->integer('file_size')->default(0); // En Ko
            $table->integer('downloads_count')->default(0);
            $table->boolean('is_public')->default(true);
            $table->integer('order')->default(0); // Ordre d'affichage
            $table->timestamps();

            // Index
            $table->index('course_id');
            $table->index('teacher_id');
            $table->index('file_type');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_materials');
    }
};
