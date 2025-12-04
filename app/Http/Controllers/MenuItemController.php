<?php

namespace App\Http\Controllers;

use App\Models\MenuItem;
use Illuminate\Http\Request;

class MenuItemController extends Controller
{
    public function index()
    {
        // Ambil data menu dari database
        $items = MenuItem::all(); 
        
        // Kirim sebagai JSON agar bisa dibaca React
        return response()->json($items);
    }
}