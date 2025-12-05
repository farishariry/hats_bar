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

            // Data pemesan
            $table->string('name');
            $table->string('phone');
            
            // Data reservasi
            $table->integer('pax'); 
            $table->date('reservation_date');
            $table->time('reservation_time');
            
            // Status: pending, acc, reject
            $table->string('status')->default('pending');
            
            // Jika yang booking adalah member
            $table->foreignId('user_id')->nullable()->constrained()->nullOnDelete();
            
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('reservations');
    }
};