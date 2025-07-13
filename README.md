# Admin Dashboard - User Management

Ini adalah proyek dashboard untuk manajemen pengguna yang dibuat sebagai bagian dari tes seleksi **Frontend Developer Intern**. Proyek ini menampilkan implementasi operasi CRUD, sistem autentikasi, dan berbagai fitur interaktif lainnya menggunakan React dan Tailwind CSS, tanpa menggunakan library UI eksternal.

**[ Lihat Live Demo ](https://ganti-dengan-url-deploy-anda.com)** 

---

## Fitur Utama

- **Sistem Autentikasi**:
  - Fitur Login tanpa perlu registrasi (kredensial statis).
  - Sesi pengguna tetap aktif (persisten) menggunakan Local Storage hingga logout manual.
  - Nama pengguna yang login ditampilkan di navbar.

- **Manajemen Pengguna (CRUD)**:
  - **Create**: Menambah data pengguna baru melalui form.
  - **Read**: Menampilkan semua data pengguna dalam format tabel yang rapi.
  - **Update**: Mengedit data pengguna yang sudah ada.
  - **Delete**: Menghapus data pengguna dengan konfirmasi modal.

- **Fitur Tabel Interaktif**:
  - **Pencarian**: Mencari pengguna berdasarkan nama.
  - **Filter**: Menyaring pengguna berdasarkan peran (role).
  - **Paginasi**: Menampilkan data secara bertahap (5 data per halaman).
  - State (halaman, pencarian, filter) disimpan di URL *query string* sehingga tidak hilang saat halaman di-refresh.

- **Fitur Tambahan**:
  - **Mode Tampilan**: Tiga pilihan mode (Light, Dark, dan System) yang dapat mengikuti tema OS secara *real-time*.
  - **Halaman Dilindungi**: Semua halaman (kecuali Login) tidak bisa diakses sebelum autentikasi.
  - **Edit Profil**: Halaman khusus untuk mengubah nama pengguna yang sedang login.
  - **Desain Responsif**: Tampilan yang menyesuaikan diri dengan berbagai ukuran layar (desktop, tablet, mobile).
  - **Notifikasi Toast**: Memberikan feedback kepada pengguna untuk setiap aksi (login, logout, create, update).

---

## Teknologi yang Digunakan

- **Framework**: React.js (dengan Vite)
- **Bahasa**: TypeScript
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Manajemen Form**: React Hook Form
- **Validasi Skema**: Zod
- **Notifikasi**: React Hot Toast
- **Ikon**: React Icons

---

## Cara Menjalankan Secara Lokal

Untuk menjalankan proyek ini di lingkungan lokal Anda, ikuti langkah-langkah berikut:

1.  **Clone repository ini:**
    ```bash
    git clone [https://ganti-dengan-url-repo-anda.git](https://ganti-dengan-url-repo-anda.git)
    ```

2.  **Masuk ke direktori proyek:**
    ```bash
    cd nama-folder-proyek
    ```

3.  **Install semua dependensi:**
    ```bash
    npm install
    ```

4.  **Jalankan development server:**
    ```bash
    npm run dev
    ```
    Aplikasi akan berjalan di `http://localhost:5173`.
