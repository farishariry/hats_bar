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
        // 1. BUAT AKUN ADMIN
        User::create([
            'name' => 'Admin HATS',
            'email' => 'admin@hats.bar',
            'password' => Hash::make('password'), // Password: password
            'role' => 'admin',
            'phone' => '081234567890',
        ]);

        // 2. BUAT AKUN MEMBER CONTOH (Untuk Test)
        User::create([
            'name' => 'John Doe',
            'email' => 'member@gmail.com',
            'password' => Hash::make('password'),
            'role' => 'member',
            'stamps' => 5, // Sesuai desain (5/10)
            'member_code' => 'HATS-MEMBER-001',
        ]);

        // 3. ISI MENU COCKTAILS
        $cocktails = [
            ['name' => 'Negroni', 'price' => 120000],
            ['name' => 'Old Fashioned', 'price' => 135000],
        ];

        foreach ($cocktails as $c) {
            MenuItem::create([
                'name' => $c['name'],
                'category' => 'beverage',
                'price' => $c['price'],
                'description' => 'A classic cocktail with a twist of elegance.',
                // Gunakan gambar placeholder random yang elegan
                'image_url' => 'https://images.unsplash.com/photo-1514362545857-3bc16549766b?q=80&w=800', 
            ]);
        }

        // 4. ISI MENU FOODS
        $foods = [
            ['name' => 'Wagyu Steak', 'price' => 450000],
            ['name' => 'Truffle Pasta', 'price' => 180000],
            ['name' => 'Caesar Salad', 'price' => 95000],
            ['name' => 'Foie Gras', 'price' => 250000],
        ];

        foreach ($foods as $f) {
            MenuItem::create([
                'name' => $f['name'],
                'category' => 'food',
                'price' => $f['price'],
                'description' => 'Prepared by our award-winning chef.',
                'image_url' => 'https://images.unsplash.com/photo-1600891964092-4316c288032e?q=80&w=800',
            ]);
        }
    }
}