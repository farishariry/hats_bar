<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Str; // <--- 1. INI TAMBAHAN PENTING (Import Library String)

class User extends Authenticatable
{
    /** @use HasFactory<\Database\Factories\UserFactory> */
    use HasFactory, Notifiable;

    /**
     * The attributes that are mass assignable.
     *
     * @var list<string>
     */
    protected $fillable = [
        'name',
        'email',
        'password',
        'role',
        'phone',
        'stamps',
        'member_code',
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var list<string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    // --- 2. INI BAGIAN LOGIKA OTOMATISNYA (Tambahkan di paling bawah sebelum tutup kurung) ---
    protected static function booted()
    {
        static::creating(function ($user) {
            // Jika member_code kosong saat user dibuat,
            // sistem akan membuatkan kode acak diawali "HATS-"
            if (empty($user->member_code)) {
                $user->member_code = 'HATS-' . strtoupper(Str::random(8));
            }
        });
    }
}