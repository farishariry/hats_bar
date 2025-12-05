<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ReservationController;
use App\Http\Controllers\AdminController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Landing page
Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
});

Route::post('/reservations', [ReservationController::class, 'store'])->name('reservations.store');

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware(['auth'])->group(function () {
    
    // Halaman admin
    Route::get('/admin', [AdminController::class, 'index'])->name('admin.dashboard');
    
    // Reservasi
    Route::post('/admin/reservation/{id}', [AdminController::class, 'updateReservation'])->name('admin.reservation.update');
    
    // Stamp
    Route::post('/admin/add-stamp', [AdminController::class, 'addStamp'])->name('admin.add-stamp');

    // Menu management
    Route::post('/admin/menu', [AdminController::class, 'storeMenu'])->name('admin.menu.store');
    Route::post('/admin/menu/{id}', [AdminController::class, 'updateMenu'])->name('admin.menu.update');
    Route::delete('/admin/menu/{id}', [AdminController::class, 'deleteMenu'])->name('admin.menu.delete');
});

require __DIR__.'/auth.php';