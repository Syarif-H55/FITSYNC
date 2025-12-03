Kamu adalah Full-Stack Developer profesional yang akan melanjutkan pengembangan web app bernama FitSync Web, yaitu aplikasi kebugaran berbasis Next.js 14 + Tailwind + shadcn/ui.
Gunakan hasil App Summary terbaru dari DeepSeek (Phase 2–4) sebagai panduan fitur dan arsitektur.

🧩 Konteks Proyek

FitSync Web saat ini sudah memiliki:

Login & Register dengan NextAuth (username/password + Google Auth).

Dashboard Page menampilkan langkah, kalori, durasi tidur, grafik mingguan, XP tracker, dan tombol Start Workout & Plan Meals.

Workout Page dengan daftar latihan (Cardio, Strength, Yoga) dan filter kategori, intensitas, durasi.

UI/UX clean dan responsif dengan shadcn/ui & Recharts.

XP tracker dummy di navbar user.

🎯 Tujuan Prompt Ini

Lanjutkan pengembangan untuk Phase 2–4 (Week 3–4) berdasarkan App Summary.
Buat kode modular, terstruktur, dan scalable.

⚙️ Tugas Utama
Phase 2 — Week 3
🥗 1. Meal Planner Page

Buat halaman /meals dengan fitur berikut:

List Makanan & Kalori: tampilkan data dari file dummy JSON (/data/meals.json).

Kategori: Breakfast, Lunch, Dinner, Snack.

Kalori Total Harian dihitung otomatis berdasarkan pilihan pengguna.

Tombol “Plan My Meals” di dashboard akan redirect ke /meals.

Tambahkan tombol Add to Plan untuk menambahkan menu ke meal plan hari ini.

Simpan pilihan user menggunakan Zustand / Context API agar tampil di Dashboard.

😴 2. Sleep Tracker Page

Buat halaman /sleep dengan:

Input manual waktu tidur & bangun (form jam).

Hitung otomatis total durasi tidur.

Tambahkan chart mingguan durasi tidur (pakai Recharts).

Sinkronkan data ke Dashboard (Sleep card).

Sediakan mode dummy auto-sync wearable → generate random sleep data.

Phase 3 — Week 4
🏅 3. Reward System & XP

Setiap aktivitas (10.000 langkah, latihan selesai, meal plan tersimpan, tidur cukup) menambah XP tertentu.

Simpan XP di state global (Zustand).

Tampilkan level & progress bar di Navbar user.

Gunakan logika leveling (misal 100 XP = level up).

Buat komponen <XPBadge /> di pojok kanan atas Dashboard.

🧠 4. AI Reminder & Motivation (Dummy)

Buat API /api/reminder yang menampilkan pesan motivasi acak setiap kali user login.

Tampilkan pesan tersebut di dashboard, misalnya:

“🔥 You’re 2000 steps away from your daily goal — keep going!”

Phase 4 — Finishing
👤 5. Profile Page

Tambahkan halaman /profile menampilkan:

Avatar & nama user.

Statistik kesehatan (Steps, Calories, Sleep).

Level & XP.

Tombol edit preferensi (goal harian, waktu tidur ideal, dsb).

Data diambil dari context global & API dummy.

🔄 6. Data Sync Simulation

Tambahkan folder /api/wearable berisi endpoint dummy:

/api/wearable/steps

/api/wearable/calories

/api/wearable/sleep

Data di-generate random setiap hari (gunakan fungsi Math.random() untuk simulasi).

Dashboard otomatis update data saat refresh.

🧱 Struktur Folder yang Disarankan
/app
  /auth
  /dashboard
  /workouts
  /meals
  /sleep
  /profile
/api
  /user
  /wearable
  /reminder
/components
  /ui
  /cards
  /charts
  /forms
/lib
  auth.ts
  store.ts (Zustand)
  utils.ts
/data
  meals.json

🎨 UI & UX

Gunakan gaya minimalis seperti sebelumnya.

Gunakan komponen Card, Button, Progress, Dialog dari shadcn/ui.

Gunakan warna hijau (#22C55E) dan biru (#3B82F6) untuk elemen aktif.

Tambahkan smooth transition antar halaman (Framer Motion optional).

Setiap halaman memiliki breadcrumb (Dashboard → Meals → Details).

🧩 Teknologi

Next.js 14 (App Router)

NextAuth (Auth)

TailwindCSS + shadcn/ui (UI)

Recharts (Charts)

Zustand (State Management)

TypeScript (opsional)

API Routes untuk dummy data

⚠️ Instruksi Output

Tulis seluruh kode lengkap (Next.js project structure) agar bisa langsung dijalankan.

Jangan gunakan placeholder kosong — isi dengan contoh data dummy (misalnya JSON, fungsi acak, dsb).

Pastikan seluruh halaman dapat diakses melalui navbar/dashboard.

Gunakan komentar dalam kode agar mudah dipahami developer berikutnya.

Tulis seluruh kode lengkap (Next.js project structure) agar bisa langsung dijalankan.

Jangan gunakan placeholder kosong — isi dengan contoh data dummy (misalnya JSON, fungsi acak, dsb).

Pastikan seluruh halaman dapat diakses melalui navbar/dashboard.

Gunakan komentar dalam kode agar mudah dipahami developer berikutnya.