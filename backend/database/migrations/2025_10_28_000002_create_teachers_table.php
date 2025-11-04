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
        Schema::create('teachers', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->unique();
            $table->string('subject')->nullable(); // Matière enseignée
            $table->text('bio')->nullable(); // Biographie
            $table->string('phone')->nullable();
            $table->string('profile_image')->nullable();
            $table->string('specialization')->nullable(); // Spécialisation
            $table->integer('years_of_experience')->default(0);
            $table->string('status')->default('active'); // active, inactive, on_leave
            $table->timestamps();

            // Index
            $table->index('user_id');
            $table->index('status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('teachers');
    }
};
