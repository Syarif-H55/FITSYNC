Sempurna 👏 — hasil App Summary dari DeepSeek itu **sudah sangat matang dan terstruktur**, seperti dokumen PRD internal startup kebugaran beneran. Isinya sudah mencakup: user flow, arsitektur data, desain komponen, sampai AI roadmap.
Jadi langkah kamu berikutnya **sudah siap masuk tahap implementasi Week 3 (Workout Planner System)**.

Berikut ini saya buatkan **prompt lengkap untuk Qwen Coder**, yang bisa kamu gunakan untuk mengubah app summary di atas menjadi **kode nyata di FitSync Web** (menggunakan Next.js 14, TailwindCSS, dan shadcn/ui).

---

## 💻 Prompt Qwen Coder — FitSync Web: Workout Planner System (Week 3)

````
Kamu adalah seorang full-stack web developer yang ahli dalam Next.js 14 (App Router), TypeScript, TailwindCSS, shadcn/ui, dan Recharts.  
Saya ingin kamu membantu mengimplementasikan **Week 3 Development** untuk aplikasi kebugaran saya bernama **FitSync Web**.

Berikut konteks aplikasinya:
- Sudah ada sistem login & dashboard (NextAuth.js)
- Dashboard sudah menampilkan data XP, langkah, kalori, dan tidur
- Folder struktur sudah terorganisir (app/auth, app/dashboard, components/charts, components/cards, dsb)
- Sekarang saya ingin menambahkan fitur **Workout Planner System** seperti dijelaskan di App Summary berikut:

---

# FitSync Web - Workout Planner System (Week 3)

**Tujuan:**  
Membangun sistem perencanaan dan pelaksanaan latihan di web app kebugaran FitSync Web yang terintegrasi dengan dashboard, sistem XP, dan gamifikasi.

---

## 🎯 Core Deliverables Minggu Ini
1. **Workout Main Page (`/workout`)**
   - Tampilkan daftar latihan yang direkomendasikan berdasarkan tingkat kebugaran user.
   - Tambahkan filter (durasi, intensitas, area fokus).
   - Gunakan mock data sementara di `/app/api/workouts/route.ts`.
   - Komponen utama:
     - `WorkoutCard` (gambar latihan, nama, durasi, intensitas)
     - `WorkoutCategoryCard` (untuk kategori latihan)
     - Filter dropdown dan tombol “Start Workout”.

2. **Workout Session Page (`/workout/session/[id]`)**
   - Saat user klik “Start Workout”, buka halaman sesi latihan.
   - Fitur yang wajib ada:
     - Menampilkan langkah-langkah latihan (`WorkoutStepCard`)
     - Countdown timer per latihan (gunakan React state dan `useEffect`)
     - Progress bar atau ring
     - Tombol Pause / Skip / Finish
   - Setelah sesi selesai, tampilkan **Workout Summary**.

3. **Workout Summary Page**
   - Tampilkan ringkasan hasil latihan:
     - Total durasi
     - Kalori terbakar (mock)
     - XP yang diperoleh
     - Badge (jika ada milestone)
   - Tambahkan tombol “Save to Dashboard”.

4. **Integrasi XP Logic**
   - Tambahkan perhitungan XP saat latihan selesai, gunakan fungsi:
     ```typescript
     const baseXP = 50;
     const durationXP = Math.floor(durationMinutes * 10);
     const intensityXP = intensityLevel * 20;
     const totalXP = baseXP + durationXP + intensityXP;
     ```
   - Kirim hasilnya ke endpoint `/api/user-data` untuk memperbarui XP (mock dulu).

5. **Dashboard Update**
   - Setelah sesi selesai, dashboard user menampilkan update XP dan aktivitas terbaru tanpa reload.
   - Gunakan `fetch` atau `SWR` untuk dynamic re-render.

---

## 🧩 Komponen yang Harus Dibuat

### `/components/workout/WorkoutCard.tsx`
Menampilkan 1 latihan:
- Thumbnail (gambar)
- Nama latihan
- Durasi, intensitas, kalori estimasi
- Tombol “Start Workout”

### `/components/workout/WorkoutSessionView.tsx`
- Menampilkan latihan saat ini + timer
- Progress bar per langkah
- Tombol kontrol (Pause, Skip, Finish)
- Integrasi animasi ringan dengan Framer Motion

### `/components/workout/WorkoutSummary.tsx`
- Tampilkan hasil latihan
- Hitung XP
- Tampilkan badge (misalnya: “First Workout!”)
- Tombol “Save to Dashboard”

---

## 🗂️ Struktur Folder yang Harus Dibuat

````

app/
├─ workout/
│   ├─ page.tsx                     // Workout main list
│   ├─ session/
│   │   ├─ [id]/page.tsx            // Workout session
│   │   └─ summary/page.tsx         // Workout summary
│
└─ api/
├─ workouts/route.ts            // Mock data: daftar workout
└─ user-data/route.ts           // Update XP (mock)
components/
├─ workout/
│   ├─ WorkoutCard.tsx
│   ├─ WorkoutSessionView.tsx
│   └─ WorkoutSummary.tsx
└─ ui/
└─ ProgressRing.tsx (opsional)

```

---

## 💡 Spesifikasi Teknis

- Gunakan **Next.js 14 App Router**
- Styling: TailwindCSS + shadcn/ui
- State Management: React Context atau useState lokal
- Timer: React hooks (`useEffect`, `setInterval`)
- Data: sementara gunakan mock JSON di `/api/workouts`
- Semua komponen harus responsive (mobile-first)
- Pastikan session timer tetap berjalan jika halaman tidak direload (gunakan `localStorage`)

---

## 🎨 UI/UX Guideline
- Warna utama: `#00C48C` (fit), sekunder: `#4FB3FF`
- Gunakan font “Inter”
- Animasi ringan untuk progress bar & transition halaman
- Hover & active state untuk semua tombol
- Layout clean dan intuitif, mengikuti gaya dashboard sebelumnya

---

## ✅ Acceptance Criteria
- [ ] User bisa melihat daftar latihan dan memilih salah satu untuk memulai
- [ ] Timer berfungsi dan menunjukkan progress latihan
- [ ] Setelah selesai, muncul halaman summary dengan XP dan kalori
- [ ] XP otomatis ditambahkan ke user (mock)
- [ ] Dashboard memperbarui data tanpa reload

---

## 📦 Output yang Diharapkan dari Kamu (Qwen Coder)
1. Buatkan kode **Next.js 14 project structure** yang sesuai.
2. Implementasikan halaman `/workout`, `/workout/session/[id]`, dan `/workout/session/summary`.
3. Gunakan komponen modular dan reusable sesuai App Summary.
4. Tambahkan komentar kode agar mudah dipahami.
5. Jangan lupa styling yang konsisten dengan dashboard FitSync Web.
6. Berikan output dalam format **kode lengkap** (bukan pseudocode).

---

Gunakan pendekatan **production-ready** dan **scalable**, seperti engineer di startup kebugaran profesional. Pastikan kodenya siap diintegrasikan dengan fitur XP dan dashboard yang sudah ada.
```

---

### ⚙️ Tips Pakai Prompt Ini

* Masukkan prompt di atas ke **Qwen Coder** (model reasoning atau code-heavy).
* Jika kamu mau hasil yang lebih “terstruktur komponen per komponen”, tambahkan di akhir prompt:

  > “Pisahkan hasil menjadi 3 bagian utama: API routes, pages, dan components.”

---

Kalau kamu mau, setelah Qwen Coder menghasilkan kode dasarnya, aku bisa bantu:

1. 🧱 Review struktur folder & file hasil Qwen
2. ⚡ Buatkan plan **Week 4 (Meal Planner System)** agar nyambung dari data Workout kamu

Apakah kamu mau saya bantu lanjutkan ke **Week 4 planning prompt untuk DeepSeek** sesudah kamu selesai implementasi ini?
