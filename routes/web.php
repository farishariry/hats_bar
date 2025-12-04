<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// --- HALAMAN UTAMA (LANDING PAGE) ---
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

// --- DUMMY ROUTE RESERVASI (Agar kode route('reservations.store') tidak error) ---
// Nanti di Fase 2 kita ganti jadi Controller beneran
Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

// ... (Biarkan route dashboard/auth bawaan Breeze di bawahnya)
Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    
    // Admin Dashboard
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    
    // Reservasi
    Route::post('/admin/reservation/{id}', [AdminController::class, 'updateReservation'])->name('admin.reservation.update');
    
    // Stamp
    Route::post('/admin/add-stamp', [AdminController::class, 'addStamp'])->name('admin.add-stamp');

    // Menu Management (BARU)
    Route::post('/admin/menu', [AdminController::class, 'storeMenu'])->name('admin.menu.store');
    Route::post('/admin/menu/{id}', [AdminController::class, 'updateMenu'])->name('admin.menu.update');
    Route::delete('/admin/menu/{id}', [AdminController::class, 'deleteMenu'])->name('admin.menu.delete');
});

require __DIR__.'/auth.php';