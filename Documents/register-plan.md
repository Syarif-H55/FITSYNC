Perfect banget ⚡️ — kamu sudah mulai mikir ke **fitur autentikasi** yang serius, dan ini langkah yang sangat tepat sebelum nanti web app-mu naik ke tahap publik.
Kita bisa langsung integrasikan ide login itu ke dalam **rencana FitSync Web App (vibe coding style)** yang sudah kita buat tadi.

---

## 🔐 Tujuan Tambahan (Autentikasi Pengguna)

Kamu ingin pengguna bisa login dengan dua cara:

1. **Username + Password + Nomor HP (registrasi manual)**

   * Tujuan: pengguna umum yang belum punya akun Google.
   * Nanti bisa dikembangkan untuk kirim **OTP via SMS** (pakai API seperti Twilio, Firebase SMS Auth, dll).
   * Untuk saat MVP, kita buat dulu **simulasi form register + login** dan simpan di localStorage atau JSON dummy.

2. **Login dengan Google (NextAuth + Google Provider)**

   * Tujuan: pengguna yang ingin login cepat dan aman.
   * Menggunakan **NextAuth.js (Auth.js)** bawaan Next.js 14.
   * Integrasi penuh ke Dashboard nanti (menampilkan nama dan foto profil Google).

---

## 🧩 Integrasi Fitur Login ke Rencana Sebelumnya

### ✳️ Tambahan pada Week Plan:

#### 🗓️ **Week 1 – Setup Project & Struktur Awal**

Tambahkan:

* Install NextAuth:

  ```bash
  npm install next-auth
  ```
* Buat halaman `/login` dan `/register`
* Buat komponen form:

  * Username
  * Password
  * Nomor HP
* Simulasikan penyimpanan data user di localStorage (sementara)

**Output:**
User bisa register/login secara lokal dan diarahkan ke Dashboard.

---

#### 🗓️ **Week 2 – Integrasi NextAuth (Google Login)**

* Buat file konfigurasi Auth di `/app/api/auth/[...nextauth]/route.js`
* Aktifkan **GoogleProvider** dari NextAuth
* Tambahkan tombol “Login with Google”
* Setelah login, arahkan ke `/dashboard` dan tampilkan nama pengguna
* Tambahkan proteksi route (redirect ke login kalau belum login)

**Output:**
Login Google berfungsi, pengguna langsung masuk ke dashboard pribadinya.

---

#### 🗓️ **Week 3 – Rancang Sistem OTP (Mock)**

Sebelum pakai API SMS sungguhan, buat dulu simulasi OTP lokal:

* User input nomor HP → generate kode random 6 digit
* Tampilkan di layar (sebagai simulasi OTP)
* Validasi input OTP sebelum register selesai

**Output:**
Simulasi OTP berjalan, siap nanti dihubungkan ke API SMS asli (mis. Firebase Auth SMS).

---

#### 🗓️ **Week 4 – Sinkronisasi Akun + Dashboard Personal**

* Setiap user (Google/Manual) punya profil unik:

  * Nama
  * Nomor HP
  * Tujuan kebugaran
  * XP dan progress disimpan terpisah
* Dashboard menampilkan data sesuai user yang login.

**Output:**
Aplikasi multi-user sudah berfungsi, dengan sistem login ganda dan data personal.

---

## ⚙️ Arsitektur Login (MVP)

```plaintext
/app
 ├── /login
 ├── /register
 ├── /dashboard
 └── /api
      └── /auth/[...nextauth]/route.js
/lib
 └── auth.js  ← konfigurasi NextAuth
/components
 ├── LoginForm.jsx
 ├── RegisterForm.jsx
 └── ProtectedRoute.jsx
```

---

## 💡 Setelah MVP (Tahap Lanjutan)

Ketika nanti kamu siap menambahkan **OTP ke SMS sungguhan**, ada beberapa opsi:

1. 🔥 **Firebase Authentication (Phone Provider)** — gratis & mudah.
2. 💬 **Twilio Verify API** — cocok kalau mau sistem SMS global.
3. 📱 **Vonage / Nexmo** — alternatif murah untuk Asia.

---

## 🚀 Langkah Selanjutnya

Kalau kamu setuju dengan integrasi login ini, aku bisa bantu buatkan **template awal Week 1**:

* Struktur Next.js 14
* Halaman `/login` dan `/register`
* Form dasar (username, password, nomor HP)
* Navigasi ke dashboard setelah login

---

Apakah kamu ingin aku langsung bantu **buatkan template awal Week 1 dengan fitur login dasar (manual + tombol login Google)** sekarang?
Kalau ya, aku akan tuliskan struktur folder + contoh kode siap dijalankan (`Next.js 14 + Tailwind + NextAuth`).
