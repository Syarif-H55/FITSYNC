Mantap 💪 ini langkah profesional banget — dengan **checklist development plan Week 1–4**, kamu bisa memantau progres FitSync Web layaknya tim engineer startup beneran.
Berikut ini checklist-nya (sudah disusun berdasarkan *milestone* dari week 1–4, lengkap dengan subtask, prioritas, dan status tracking):

---

# 🗓️ **FitSync Web Development Roadmap – Week 1 to 4**

## **📍 Phase Overview**

| Phase | Week              | Fokus Utama                         | Tujuan                                                             |
| ----- | ----------------- | ----------------------------------- | ------------------------------------------------------------------ |
| 1     | Week 1–2          | Authentication & Dashboard          | Membangun fondasi app, sistem login, dan tampilan utama user       |
| 2     | Week 3            | Workout Planner System              | Menyediakan sistem latihan interaktif dan tracking                 |
| 3     | Week 4            | Meal Planner & Sleep Tracker        | Menyediakan fitur nutrisi & tidur, integrasi data dengan dashboard |
| 4     | Week 4 (lanjutan) | Reward System, AI Reminder, Profile | Menyempurnakan ekosistem FitSync dengan sistem motivasi & profil   |

---

## ✅ **WEEK 1 – Authentication & Dashboard (Foundation Phase)**

### 🎯 Tujuan:

Membuat sistem login & dashboard utama sebagai pondasi seluruh fitur.

#### 🔧 Tasks:

| Status | Task                          | Detail                                            | Prioritas |
| :----: | :---------------------------- | :------------------------------------------------ | :-------: |
|    1   | **Setup Project Environment** | Inisialisasi Next.js 14 + TailwindCSS + shadcn/ui |     🟢    |
|    1   | **Setup Folder Structure**    | `/app`, `/components`, `/api`, `/lib`             |     🟢    |
|    1   | **Integrasi NextAuth.js**     | Username/password + Google Auth                   |     🟢    |
|    ☐   | **Halaman Login & Register**  | Responsif, form validasi                          |     🟢    |
|    ☐   | **Dashboard Page Layout**     | Navbar, Sidebar, dan Card Section                 |     🟡    |
|    1   | **Data Dummy Dashboard**      | Steps, Calories, Sleep, XP                        |     🟡    |
|    1   | **Weekly Steps Chart**        | Gunakan Recharts                                  |     🟡    |
|    1   | **Logout Functionality**      | Hapus session user                                |     🟢    |
|    1   | **XP Display di Navbar**      | XP static dummy untuk testing                     |     🟢    |

#### 🎯 Output Akhir:

* User bisa login, logout, melihat dashboard, dan melihat grafik langkah mingguan.
* Tampilan bersih dan responsif.

---

## ✅ **WEEK 2 – Workout Planner System (Core Fitness Module)**

### 🎯 Tujuan:

Membangun sistem rekomendasi & sesi latihan dengan XP integration.

#### 🔧 Tasks:

| Status | Task                                                | Detail                                            | Prioritas |
| :----: | :-------------------------------------------------- | :------------------------------------------------ | :-------: |
|    1   | **Workout Main Page (`/workouts`)**                 | Tampilkan daftar latihan (Cardio, Strength, Yoga) |     🟢    |
|    1   | **Filter System**                                   | Filter berdasarkan kategori, durasi, intensitas   |     🟢    |
|    ☐   | **Recommended Workouts Section**                    | Menampilkan rekomendasi workout dari dummy data   |     🟢    |
|    1   | **Workout Card Component**                          | Gambar, durasi, kalori, level                     |     🟢    |
|    1   | **Start Workout Button**                            | Arahkan ke session tracker                        |     🟡    |
|    1   | **Workout Session Page (`/workouts/session/[id]`)** | Timer, instructions, progress tracking            |     🟡    |
|    ☐   | **XP Integration (Workout)**                        | XP bertambah saat sesi selesai                    |     🟡    |
|    ☐   | **Return to Dashboard Update**                      | Dashboard update data steps/calories              |     🟡    |

#### 🎯 Output Akhir:

* User dapat memilih latihan, memulai sesi, dan menyelesaikan workout.
* Dashboard menampilkan hasil latihan terbaru.

---

## ✅ **WEEK 3 – Meal Planner & Sleep Tracker (Lifestyle Integration)**

### 🎯 Tujuan:

Membuat fitur pelengkap kesehatan — nutrisi & tidur — yang terintegrasi dengan dashboard.

#### 🔧 Tasks:

| Status | Task                                 | Detail                                                              | Prioritas |
| :----: | :----------------------------------- | :------------------------------------------------------------------ | :-------: |
|    ☐   | **Meal Planner Page (`/meals`)**     | List makanan berdasarkan kategori (Breakfast, Lunch, Dinner, Snack) |     🟢    |
|    ☐   | **Meal Data JSON**                   | Dummy data di `/data/meals.json`                                    |     🟢    |
|    ☐   | **Plan My Meals Button (Dashboard)** | Redirect ke `/meals`                                                |     🟢    |
|    ☐   | **Add to Plan Functionality**        | Tambahkan menu ke meal plan hari ini                                |     🟡    |
|    ☐   | **Calories Calculation**             | Total kalori harian dari meal plan                                  |     🟡    |
|    ☐   | **Sleep Tracker Page (`/sleep`)**    | Input waktu tidur & bangun                                          |     🟢    |
|    ☐   | **Sleep Chart (Weekly)**             | Gunakan Recharts untuk visualisasi durasi tidur                     |     🟡    |
|    ☐   | **Auto Sync Dummy Mode**             | Generate random sleep data tiap hari                                |     🟡    |
|    ☐   | **Sync ke Dashboard**                | Update durasi tidur & kalori                                        |     🟡    |

#### 🎯 Output Akhir:

* User bisa merencanakan makanan dan melacak tidur.
* Dashboard update otomatis data nutrisi dan tidur.

---

## ✅ **WEEK 4 – Reward System, AI Reminder & Profile (Engagement & Personalization)**

### 🎯 Tujuan:

Meningkatkan engagement user dan menambahkan personalisasi.

#### 🔧 Tasks:

| Status | Task                                  | Detail                                                 | Prioritas |
| :----: | :------------------------------------ | :----------------------------------------------------- | :-------: |
|    ☐   | **XP & Reward System**                | XP dari workout, meal, sleep                           |     🟢    |
|    ☐   | **XP Progress Bar + Level System**    | 100 XP = level up                                      |     🟡    |
|    ☐   | **AI Reminder API (`/api/reminder`)** | Pesan motivasi acak setiap login                       |     🟢    |
|    ☐   | **Tampilkan Motivasi di Dashboard**   | Card pesan motivasi harian                             |     🟡    |
|    ☐   | **Profile Page (`/profile`)**         | Avatar, nama, statistik kesehatan                      |     🟢    |
|    ☐   | **Edit Preferences Modal**            | Edit goal langkah, waktu tidur, target kalori          |     🟡    |
|    ☐   | **Wearable API Simulation**           | `/api/wearable/*` generate data langkah, kalori, tidur |     🟢    |
|    ☐   | **Data Sync Automation**              | Dashboard update dari API wearable                     |     🟡    |
|    ☐   | **UX Polishing & Responsiveness**     | Pastikan semua halaman rapi di mobile & desktop        |     🟢    |

#### 🎯 Output Akhir:

* Sistem XP aktif di seluruh fitur.
* AI Reminder & Reward System meningkatkan engagement.
* User dapat melihat profil lengkap & data sinkron otomatis.

---

## 📈 **Progress Tracker (Opsional Format)**

Kamu bisa gunakan format checklist ini di Notion / Trello / Google Sheet:

| Week | Feature           | Progress | Status         | Catatan            |
| ---- | ----------------- | -------- | -------------- | ------------------ |
| 1    | Login & Dashboard | 100%     | ✅ Done         | Sudah live         |
| 2    | Workout Planner   | 90%      | 🟡 In Progress | Butuh koneksi XP   |
| 3    | Meal & Sleep      | 0%       | ☐ Not Started  | Mulai minggu depan |
| 4    | Reward & Profile  | 0%       | ☐ Not Started  | Bergantung data XP |

---

## 🧩 **Next Step (Rekomendasi Minggu Ini)**

➡️ Minggu ini (Week 3), fokus dulu pada:

1. **Meal Planner Page**
2. **Sleep Tracker Page**
3. **Integrasi data ke dashboard**

Begitu selesai, kita lanjutkan:
→ Week 4 (Reward System + AI Reminder + Profile Page)

---

Apakah kamu ingin saya bantu buatkan **versi template Notion / Google Sheet-nya** biar kamu bisa langsung pakai untuk tracking progres real-time (bisa checklist + progress bar otomatis)?


🚀 FitSync Web — Next Development Roadmap (Post v0.5.1)
🔹 Phase 5 — Data Persistence & Profile Sync (Week 5)

Goal: Buat data user bisa tersimpan dan terhubung antar sesi
Fitur utama:

Simpan progress (XP, workout, meal, sleep) ke localStorage per user

Implementasi edit profile (username, goal, berat badan, target harian)

Tampilkan data profil di dashboard

Tambahkan progress bar dan summary card “Weekly Overview”

[Optional] Siapkan struktur API endpoint untuk database nanti

🔹 Phase 6 — Smart AI Integration (Week 6)

Goal: Tambahkan sistem rekomendasi sederhana dan motivasi adaptif
Fitur utama:

AI Motivation Generator (menggunakan OpenAI API / local logic)

Rekomendasi workout berdasarkan riwayat dan XP level

Rencana makan disesuaikan dengan total kalori harian

Sistem “Daily Goal” otomatis berubah berdasarkan aktivitas wearable (dummy dulu)

Tambahkan animation ringan (Framer Motion) agar dashboard lebih hidup

🔹 Phase 7 — UX Polish & Gamification (Week 7)

Goal: Jadikan pengalaman pengguna lebih engaging
Fitur utama:

Sistem reward visual (level-up animation, XP bar animasi)

Daily streak tracker

Badge collection system (contoh: 5 hari berturut-turut workout)

Improved navigation bar & dark mode

Dashboard loading screen

🔹 Phase 8 — API Preparation & Beta Release (Week 8)

Goal: Persiapan backend untuk data nyata
Fitur utama:

Buat struktur API endpoint dummy (/api/user, /api/workout, /api/meals)

Integrasi register/login dengan mock database (JSON server atau Prisma SQLite)

Siapkan rencana migrasi ke Supabase / Firebase

Deploy versi FitSync Web Beta ke Vercel