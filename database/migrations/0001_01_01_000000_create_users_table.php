<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('users', function (Blueprint $table) {
            $table->id();
            $table->string('name'); // Username
            $table->string('email')->unique(); // Login pakai ini (atau username dianggap email)
            $table->string('password');
            
            // --- FIELD TAMBAHAN PROJEK HATS ---
            $table->string('role')->default('member'); // 'admin' atau 'member'
            $table->string('phone')->nullable();
            
            // GAMIFIKASI
            $table->integer('stamps')->default(0); // Jumlah stempel (max 10)
            $table->string('member_code')->unique()->nullable(); // Untuk QR Code
            
            $table->rememberToken();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('users');
    }
};