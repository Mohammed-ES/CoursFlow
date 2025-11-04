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
        Schema::create('calendar_events', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('teacher_id');
            $table->unsignedBigInteger('course_id')->nullable();
            $table->string('title');
            $table->text('description')->nullable();
            $table->string('type')->default('class'); // class, exam, meeting, reminder, holiday
            $table->string('location')->nullable();
            $table->timestamp('start_time')->nullable();
            $table->timestamp('end_time')->nullable();
            $table->boolean('is_recurring')->default(false);
            $table->string('recurring_pattern')->nullable(); // daily, weekly, monthly
            $table->string('color')->default('#3b82f6'); // Couleur dans le calendrier
            $table->timestamps();

            // Index
            $table->index('teacher_id');
            $table->index('course_id');
            $table->index('type');
            $table->index('start_time');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('calendar_events');
    }
};
