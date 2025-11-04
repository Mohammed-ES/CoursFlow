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
        Schema::create('conversations', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('admin_id');
            $table->unsignedBigInteger('teacher_id');
            $table->timestamp('last_message_at')->nullable();
            $table->timestamps();

            // Unique constraint - une seule conversation par paire admin-teacher
            $table->unique(['admin_id', 'teacher_id']);

            // Indexes
            $table->index('admin_id');
            $table->index('teacher_id');
            $table->index('last_message_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('conversations');
    }
};
