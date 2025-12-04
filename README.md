# 🍸 HATS - The Cocktail Bar & Resto

Web application modern untuk HATS, sebuah Cocktail Bar & Resto eksklusif. Proyek ini dibangun menggunakan Laravel dan Inertia.js (React) untuk menghadirkan pengalaman Single Page Application (SPA) yang elegan, responsif, dan seamless.

![Hero Banner](public/images/hero-bg.jpg)

## ✨ Fitur Utama

- **Immersive Landing Page**: Desain visual dark-themed dengan animasi halus, parallax effect, dan navigasi scroll.
- **Authentication System**: Login & Register member menggunakan Laravel Breeze.
- **Role-Based Access Control (RBAC)**:
  - **Admin**: Memiliki akses khusus CRUD (Admin Panel).
  - **User**: Memiliki akses ke dashboard member.
  - **Conditional Rendering**: Menu navigasi menyesuaikan role (Admin tidak melihat menu User).
- **Reservation System**: Formulir reservasi online yang terintegrasi langsung ke database.
- **Dynamic Menu Gallery**: Menu (Cocktails) dan makanan (Foods) yang diambil via API (`/api/menu-items`) dengan fitur horizontal scroll carousel.
- **Responsive Design**: Tampilan optimal di Desktop, Tablet, dan Mobile.
- **Stamp Gamification**: User akan mendapatkan reward apabila sudah memiliki 10 stamp.

## 🛠️ Tech Stack

- **Backend**: Laravel 12.41.1
- **Frontend**: React.js
- **Database**: MySQL

## 🚀 Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan proyek di komputer lokal Anda:

### 1. Clone Repository

```bash
git clone https://github.com/username-anda/hats-bar.git
cd hats-bar
```

### 2. Install Dependencies

Install dependensi backend (PHP) dan frontend (Node.js):

```bash
composer install
npm install
```

### 3. Konfigurasi Environment

Salin file `.env.example` menjadi `.env`:

```bash
cp .env.example .env
```

### 4. Generate Key & Migrasi Database

Generate app key dan jalankan migrasi tabel (pastikan database `hats_db` sudah dibuat di MySQL):

```bash
php artisan key:generate
php artisan migrate
```

**Opsional:** Jika ada seeder untuk menu items:

```bash
php artisan db:seed
```

### 5. Jalankan Aplikasi

Anda perlu menjalankan dua terminal terpisah:

**Terminal 1 (Laravel Server):**
```bash
php artisan serve
```

**Terminal 2 (Vite Development Server):**
```bash
npm run dev
```

Buka browser dan akses: [http://127.0.0.1:8000](http://127.0.0.1:8000)

## 👥 Pengaturan Role Admin

Secara default, user baru yang mendaftar akan memiliki role `user`. Untuk membuat akun Admin:

1. Daftar akun baru melalui halaman Register (`/register`).
2. Buka database administrator (phpMyAdmin/TablePlus).
3. Cari tabel `users`.
4. Ubah kolom `role` pada user tersebut dari `'user'` menjadi `'admin'`.

## 📂 Struktur Folder Penting

```
resources/js/Pages/       # Halaman utama (Welcome, Auth, Dashboard)
resources/js/Components/  # Komponen UI reusable
resources/js/Layouts/     # Layout utama (GuestLayout, AuthenticatedLayout)
app/Http/Controllers/    # Logika Backend
routes/web.php           # Definisi rute aplikasi
```

## 📝 Catatan Pengembang

- **Menu Images**: Pastikan gambar menu disimpan di folder `public/storage` atau sesuaikan path di database.
- **Backgrounds**: Aset gambar statis (background login, logo) berada di folder `public/images`.

---
© 2025 HATS Project. All Rights Reserved.