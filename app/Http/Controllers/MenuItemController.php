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
        
        // JSON supaya bisa dibaca react
        return response()->json($items);
    }
}