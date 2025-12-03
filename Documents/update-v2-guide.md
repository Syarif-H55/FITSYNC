

### 🧩 Project Context

Project: **FitSync Web App**
Framework: **Next.js 14 (App Router)**
Tech Stack: **TypeScript, TailwindCSS, shadcn/ui, NextAuth.js, Zustand (optional), Recharts**
Phase: 2–4 Completion + Maintenance Update

Tujuan update kali ini adalah memperbaiki fitur login/register, menambahkan akun demo, dan menyatukan sistem XP agar sinkron di seluruh halaman. Sekaligus menyiapkan pondasi untuk fitur OTP dan data persistence untuk fase selanjutnya.

---

## 🧭 **TASK OVERVIEW**

Perbaikan dan tambahan yang perlu dilakukan:

1. **Perbaiki Register Account (belum bisa buat akun).**
2. **Gabungkan register dan login phone number menjadi satu alur.**
3. **Tambahkan akun demo `admin/admin123`.**
4. **Satu sistem XP global untuk semua halaman.**
5. *(Optional Improvement)* Auto-save XP ke localStorage.
6. *(Optional Improvement)* Tambah placeholder UI untuk OTP flow (tanpa backend).

---

## ⚙️ **IMPLEMENTATION DETAILS**

### **1️⃣ Register Account Fix**

📍 File: `/app/(auth)/register/page.tsx`

* Tambahkan form dengan input:

  * Username
  * Email
  * Password
  * Phone Number

* Validasi form:

  * Semua field wajib diisi
  * Password minimal 6 karakter
  * Phone number hanya angka

* Simpan data ke `/lib/users.ts` atau `/data/users.json` (dummy storage sementara).

* Setelah register berhasil → redirect ke `/login`.

✅ **Output Expected:** User baru bisa dibuat dan langsung login menggunakan data yang diregistrasikan.

---

### **2️⃣ Gabungkan Register & Login Phone Number**

📍 File: `/app/(auth)/login/page.tsx`

* Gabungkan form register & login menjadi dua tab atau toggle ("Login" / "Register").
* Hapus form “login by phone number” yang terpisah sebelumnya.
* Register tetap meminta **phone number**, tapi OTP belum aktif (disiapkan untuk nanti).
* Tambahkan login method:

  * **Email/Password (manual login)**
  * **GoogleAuth (NextAuth)**

✅ **Output Expected:** Register dan login berjalan di flow yang sama, login via Google & manual berhasil.

---

### **3️⃣ Demo Account (Static Admin User)**

📍 File: `/lib/users.ts`

Tambahkan akun statis berikut:

```ts
{
  username: "admin",
  email: "admin@example.com",
  password: "admin123",
  phone: "08123456789"
}
```

Jika user login dengan kredensial di atas, tampilkan data dummy di dashboard:

```ts
steps: 8420
calories: 2300
sleep: "6h 40m"
xp: 25
```

✅ **Output Expected:** User bisa login pakai `admin/admin123` dan melihat dummy data di dashboard.

---

### **4️⃣ Global XP System (Shared State)**

📍 File: `/context/XpContext.tsx`

Buat context global agar XP sinkron di seluruh halaman:

```tsx
import { createContext, useContext, useState } from "react";

const XpContext = createContext();

export const XpProvider = ({ children }) => {
  const [xp, setXp] = useState(0);

  const updateXp = (amount) => setXp((prev) => prev + amount);
  const resetXp = () => setXp(0);

  return (
    <XpContext.Provider value={{ xp, updateXp, resetXp }}>
      {children}
    </XpContext.Provider>
  );
};

export const useXp = () => useContext(XpContext);
```

Lalu bungkus `layout.tsx` utama dengan `<XpProvider>`.
Semua halaman (`/dashboard`, `/workout`, `/meal`, `/sleep`, `/profile`) gunakan `useXp()` untuk membaca XP.

✅ **Output Expected:** XP di semua halaman sama & selalu terupdate ketika berubah.

---

## 🧠 **OPTIONAL IMPROVEMENTS**

### **A. XP Persistence (Auto Save XP ke LocalStorage)**

Tambahkan di context:

```tsx
useEffect(() => {
  const savedXp = localStorage.getItem("fitsync-xp");
  if (savedXp) setXp(Number(savedXp));
}, []);

useEffect(() => {
  localStorage.setItem("fitsync-xp", xp.toString());
}, [xp]);
```

✅ XP tetap tersimpan setelah refresh / relogin.

---

### **B. OTP Placeholder UI (Future Integration)**

📍 File: `/app/(auth)/register/page.tsx`

Tambahkan step setelah klik “Register”:

* Muncul modal berisi “Enter OTP Code”.
* Simulasikan OTP 6 digit, validasi dummy: `123456`.
* Jika benar → simpan user & redirect ke dashboard.

Gunakan `shadcn/ui` component: `<Dialog>` atau `<Sheet>` untuk tampilan modal OTP.

✅ **Output Expected:** UI OTP muncul setelah register, tapi belum perlu backend (mock only).

---

## 🧪 **TESTING CHECKLIST**

| Fitur                                      | Status |
| ------------------------------------------ | ------ |
| Register & validasi form                   | ✅      |
| Login manual & GoogleAuth                  | ✅      |
| Demo account “admin/admin123”              | ✅      |
| XP sinkron di semua halaman                | ✅      |
| XP tersimpan setelah refresh               | ✅      |
| OTP UI placeholder muncul setelah register | ✅      |

---

## 📁 **FILES TO UPDATE**

* `/app/(auth)/login/page.tsx`
* `/app/(auth)/register/page.tsx`
* `/lib/users.ts`
* `/context/XpContext.tsx`
* `/app/layout.tsx`
* `/app/dashboard/page.tsx`
* `/app/workout/page.tsx`
* `/app/meal/page.tsx`
* `/app/sleep/page.tsx`
* `/app/profile/page.tsx`

---

## 📄 **DELIVERABLE FORMAT (Dari Qwen)**

```
✅ FitSync Web Update v0.4 Completed
───────────────────────────────
📂 Files Updated:
- /app/(auth)/login/page.tsx
- /app/(auth)/register/page.tsx
- /lib/users.ts
- /context/XpContext.tsx

💡 Key Changes:
- Fixed register & login integration
- Added static demo account (admin/admin123)
- Created global XP context with localStorage persistence
- Added OTP placeholder modal for future integration

🧪 Testing:
✅ Register & login works
✅ XP shared globally
✅ Admin login loads dummy data
✅ XP saved on refresh
✅ OTP modal appears correctly
```



