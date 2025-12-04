<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        // 1. Validasi Input 
        // (Kita sesuaikan rules dengan nama field yang dikirim dari React: guests & date_time)
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'guests' => 'required|integer|min:1', // React mengirim 'guests', bukan 'pax'
            'date_time' => 'required',             // React mengirim 'date_time' gabungan
        ]);

        // 2. Pecah date_time menjadi Tanggal dan Jam
        // Format dari React biasanya "2025-12-03T19:00"
        try {
            $parts = explode('T', $validated['date_time']);
            $date = $parts[0];
            $time = $parts[1] ?? '00:00'; // Default jam jika error
        } catch (\Exception $e) {
            $date = now()->format('Y-m-d');
            $time = now()->format('H:i');
        }

        // 3. Simpan ke Database (Lakukan Mapping Manual di sini)
        Reservation::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            // Masukkan data 'guests' dari input ke kolom 'pax' di database
            'pax' => $validated['guests'], 
            'reservation_date' => $date,
            'reservation_time' => $time,
            'email' => 'guest@hats.bar',
            'status' => 'pending'
        ]);

        return redirect()->back()->with('message', 'Reservasi Berhasil!');
    }
}