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
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('course_id')->nullable(); // Null = notification pour tous
            $table->string('title');
            $table->text('content');
            $table->string('type')->default('announcement'); // announcement, reminder, alert, info
            $table->string('priority')->default('normal'); // low, normal, high, urgent
            $table->timestamp('published_at')->nullable();
            $table->timestamp('expires_at')->nullable();
            $table->boolean('is_published')->default(false);
            $table->timestamps();

            // Index
            $table->index('teacher_id');
            $table->index('course_id');
            $table->index('is_published');
            $table->index('published_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('notifications');
    }
};
