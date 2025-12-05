<?php

namespace App\Http\Controllers;

use App\Models\Reservation;
use App\Models\User;
use App\Models\MenuItem;
use Illuminate\Http\Request;
use Inertia\Inertia;

class AdminController extends Controller
{
    // Halaman admin
    public function index()
    {
        return Inertia::render('Admin/Dashboard', [
            'reservations' => Reservation::latest()->get(),
            'menuItems' => MenuItem::all(),
            // Kita tidak perlu kirim data member semua, cukup logic scan nanti
        ]);
    }

    // Status reservasi
    public function updateReservation(Request $request, $id)
    {
        $reservation = Reservation::findOrFail($id);
        $reservation->update(['status' => $request->status]);
        return redirect()->back()->with('success', 'Status reservasi diperbarui.');
    }

    // Logic stamp
    public function addStamp(Request $request)
    {
        $request->validate(['member_code' => 'required|exists:users,member_code']);

        $member = User::where('member_code', $request->member_code)->first();
        
        // Cek logic stamp
        if ($member->stamps >= 10) {
            $member->update(['stamps' => 0]);
            return redirect()->back()->with('success', "REWARD DIKLAIM! Stamp {$member->name} telah di-reset ke 0.");
        } else {
            $member->increment('stamps');
            if ($member->stamps == 10) {
                return redirect()->back()->with('success', "STAMP PENUH! {$member->name} berhak dapat Reward (Scan sekali lagi untuk Reset).");
            }
        }

        return redirect()->back()->with('success', "Stamp berhasil ditambahkan. Total: {$member->stamps}/10");
    }

    // CRUD menu item

    // Tambah menu
    public function storeMenu(Request $request)
    {
        // Validasi inputan
        $validated = $request->validate([
            'name' => 'required|string',
            'category' => 'required|in:beverage,food',
            'price' => 'required|numeric',
            'image' => 'required|image|max:2048', 
        ]);

        // Proses upload
        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-images', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']); 

        MenuItem::create($validated); 
        return redirect()->back()->with('success', 'Menu berhasil ditambahkan!');
    }

    // Edit menu
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

        if ($request->hasFile('image')) {
            $path = $request->file('image')->store('menu-images', 'public');
            $validated['image_url'] = '/storage/' . $path;
        }

        unset($validated['image']); 

        $menu->update($validated);
        return redirect()->back()->with('success', 'Menu berhasil diupdate!');
    }   

    // Apus menu
    public function deleteMenu($id)
    {
        MenuItem::findOrFail($id)->delete();
        return redirect()->back()->with('success', 'Menu dihapus.');
    }
}