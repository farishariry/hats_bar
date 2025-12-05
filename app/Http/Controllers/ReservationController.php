<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use Illuminate\Http\Request;

class ReservationController extends Controller
{
    public function store(Request $request)
    {
        // Validasi inpitan
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'phone' => 'required|string',
            'guests' => 'required|integer|min:1',
            'date_time' => 'required',
        ]);

        // Konversi date_time ke date dan time terpisah
        try {
            $parts = explode('T', $validated['date_time']);
            $date = $parts[0];
            $time = $parts[1] ?? '00:00'; // Default jam jika error
        } catch (\Exception $e) {
            $date = now()->format('Y-m-d');
            $time = now()->format('H:i');
        }

        // Kirim ke database
        Reservation::create([
            'name' => $validated['name'],
            'phone' => $validated['phone'],
            'pax' => $validated['guests'], 
            'reservation_date' => $date,
            'reservation_time' => $time,
            'email' => 'guest@hats.bar',
            'status' => 'pending'
        ]);

        return redirect()->back()->with('message', 'Reservasi Berhasil!');
    }
}