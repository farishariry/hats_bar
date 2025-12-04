<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // --- HALAMAN UTAMA ADMIN ---
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'reservations' => Reservation::latest()->get(),
            'menuItems' => MenuItem::all(),
            // Kita tidak perlu kirim data member semua, cukup logic scan nanti
        ]);
    }

    // --- UPDATE STATUS RESERVASI ---
    public function updateReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Status reservasi diperbarui.');
    }

    // --- LOGIC STAMP (REVISI: Auto Reset) ---
    public function addStamp(Request $request)
    {
        $request->validate(['member_code' => 'required|exists:users,member_code']);

        $member = User::where('member_code', $request->member_code)->first();
        
        // Cek Logic Stamp
        if ($member->stamps >= 10) {
            // Jika sudah 10, maka scan berikutnya adalah RESET (Klaim Reward)
            $member->update(['stamps' => 0]);
            return redirect()->back()->with('success', "REWARD DIKLAIM! Stamp {$member->name} telah di-reset ke 0.");
        } else {
            // Jika belum 10, tambah 1
            $member->increment('stamps');
            // Cek apakah setelah ditambah jadi 10?
            if ($member->stamps == 10) {
                return redirect()->back()->with('success', "STAMP PENUH! {$member->name} berhak dapat Reward (Scan sekali lagi untuk Reset).");
            }
        }

        return redirect()->back()->with('success', "Stamp berhasil ditambahkan. Total: {$member->stamps}/10");
    }

    // --- CRUD MENU ---

    // 1. TAMBAH MENU
    public function storeMenu(Request $request)
    {
        // Validasi input
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|in:beverage,food',
            'price' => 'required|numeric',
            'image' => 'required|image|max:2048', 
        ]);

        // Proses Upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-images', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        // --- PERBAIKAN DI SINI ---
        // Kita HAPUS 'image' dari data yang mau disimpan
        // Karena di database tidak ada kolom 'image', adanya 'image_url'
        unset($validated['image']); 

        MenuItem::create($validated); 
        return redirect()->back()->with('success', 'Menu berhasil ditambahkan!');
    }

    // 2. EDIT MENU
    public function updateMenu(Request $request, $id)
    {
        $menu = MenuItem::findOrFail($id);
        
        $rules = [
            'name' => 'required|string',
            'category' => 'required|in:beverage,food',
            'price' => 'required|numeric',
            'image' => 'nullable|image|max:2048',
        ];

        $validated = $request->validate($rules);

        // Cek apakah user upload gambar baru?
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-images', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        // --- PERBAIKAN DI SINI JUGA ---
        unset($validated['image']); 

        $menu->update($validated);
        return redirect()->back()->with('success', 'Menu berhasil diupdate!');
    }   

    // 3. HAPUS MENU
    public function deleteMenu($id)
    {
        MenuItem::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Menu dihapus.');
    }
}