<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('reservations', function (Blueprint $table) {
            $table->id();
            // Data Tamu
            $table->string('name');
            $table->string('phone');
            $table->string('email')->nullable();
            
            // Data Reservasi
            $table->integer('pax'); // Jumlah orang
            $table->date('reservation_date');
            $table->time('reservation_time');
            
            // Status: pending, approved, rejected
            $table->string('status')->default('pending');
            
            // Jika yang booking adalah member (opsional)
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};