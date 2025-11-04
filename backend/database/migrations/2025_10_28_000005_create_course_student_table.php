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
        Schema::create('course_student', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('course_id');
            $table->unsignedBigInteger('student_id');
            $table->string('payment_status')->default('pending'); // pending, paid, refunded
            $table->decimal('amount_paid', 10, 2)->default(0);
            $table->string('payment_method')->nullable(); // card, paypal, cash, transfer
            $table->string('transaction_id')->nullable();
            $table->timestamp('enrolled_at')->nullable();
            $table->timestamp('payment_date')->nullable();
            $table->decimal('progress', 5, 2)->default(0); // Progression en %
            $table->timestamps();

            // Contrainte unique : un étudiant ne peut s'inscrire qu'une fois à un cours
            $table->unique(['course_id', 'student_id']);

            // Foreign Keys - Add after table creation for better compatibility
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('students')->onDelete('cascade');

            // Index
            $table->index('course_id');
            $table->index('student_id');
            $table->index('payment_status');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('course_student');
    }
};
