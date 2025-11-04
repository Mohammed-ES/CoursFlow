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
        Schema::table('calendar_events', function (Blueprint $table) {
            // Add student_id column (nullable since some events are teacher-created)
            $table->unsignedBigInteger('student_id')->nullable()->after('teacher_id');

            // Add start_date and end_date as aliases (keep original columns for compatibility)
            // We'll add these as datetime columns
            $table->timestamp('start_date')->nullable()->after('location');
            $table->timestamp('end_date')->nullable()->after('start_date');

            // Add index for student_id
            $table->index('student_id');

            // Make teacher_id nullable since students can create events too
            $table->unsignedBigInteger('teacher_id')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('calendar_events', function (Blueprint $table) {
            $table->dropColumn(['student_id', 'start_date', 'end_date']);
            $table->dropIndex(['student_id']);
        });
    }
};
