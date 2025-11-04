<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;

return new class extends Migration
{
    public function up(): void
    {
        // Créer un admin de test
        DB::table('users')->insert([
            'name' => 'Admin Test',
            'email' => 'admin@coursflow.com',
            'password' => Hash::make('Admin@123'),
            'email_verified_at' => now(),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }

    public function down(): void
    {
        DB::table('users')->where('email', 'admin@coursflow.com')->delete();
    }
};
