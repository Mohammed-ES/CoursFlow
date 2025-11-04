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
        Schema::table('users', function (Blueprint $table) {
            // Google OAuth fields
            $table->string('google_id')->nullable()->unique()->after('id');
            $table->text('google_token')->nullable()->after('password');
            $table->string('avatar')->nullable()->after('google_token');

            // Make password nullable for OAuth users
            $table->string('password')->nullable()->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['google_id', 'google_token', 'avatar']);

            // Restore password as required
            $table->string('password')->nullable(false)->change();
        });
    }
};
