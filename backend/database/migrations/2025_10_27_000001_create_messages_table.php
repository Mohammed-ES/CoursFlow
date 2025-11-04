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
        Schema::create('messages', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('conversation_id');
            $table->string('sender_type'); // Changed from enum to string for Laravel polymorphic relations
            $table->unsignedBigInteger('sender_id');
            $table->text('message_text');
            $table->boolean('is_read')->default(false);
            $table->timestamps();

            // Foreign key
            $table->foreign('conversation_id')
                  ->references('id')
                  ->on('conversations')
                  ->onDelete('cascade');

            // Indexes
            $table->index('conversation_id');
            $table->index(['sender_type', 'sender_id']);
            $table->index('is_read');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('messages');
    }
};
