<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        // Dummy admin
        User::create([
            'name' => 'Admin HATS',
            'email' => 'admin@hats.bar',
            'password' => Hash::make('password'), // Password: password
            'role' => 'admin',
            'phone' => '081234567890',
        ]);

        // Dummy member
        User::create([
            'name' => 'Faris Hariri',
            'email' => 'farishariri@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'stamps' => 3,
            'member_code' => 'HATS-MEMBER-001',
        ]);
    }
}