<?php

use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- HALAMAN UTAMA (LANDING PAGE) ---
Route::get('/', function () {
    // 1. DUMMY DATA MENU (Nanti ini kita ambil dari Database MySQL)
    // Struktur data ini disesuaikan dengan kode React kamu: id, name, category, price
    $menuItems = [
        ['id' => 1, 'name' => 'Negroni', 'category' => 'beverage', 'price' => 120000],
        ['id' => 2, 'name' => 'Old Fashioned', 'category' => 'beverage', 'price' => 135000],
        ['id' => 3, 'name' => 'Cosmopolitan', 'category' => 'beverage', 'price' => 110000],
        ['id' => 4, 'name' => 'Wagyu Steak', 'category' => 'food', 'price' => 450000],
        ['id' => 5, 'name' => 'Truffle Pasta', 'category' => 'food', 'price' => 180000],
        ['id' => 6, 'name' => 'Caesar Salad', 'category' => 'food', 'price' => 95000],
    ];

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'menuItems' => $menuItems, // <--- INI KUNCINYA AGAR TIDAK ERROR
    ]);
});

// --- DUMMY ROUTE RESERVASI (Agar kode route('reservations.store') tidak error) ---
// Nanti di Fase 2 kita ganti jadi Controller beneran
Route::post('/reservations', function () {
    return redirect()->back()->with('success', 'Ini hanya simulasi. Database belum connect.');
})->name('reservations.store');

// ... (Biarkan route dashboard/auth bawaan Breeze di bawahnya)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

require __DIR__.'/auth.php';