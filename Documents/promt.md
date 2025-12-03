Keren 🔥 berarti kita lanjut ke tahap **Week 2 FitSync Web Development Plan** ya.
Berikut saya siapkan tiga hal penting yang kamu minta:

---

## 🧭 1. **Prompt Qwen Coder (Week 2 Development Task)**

> 💡 Kamu bisa langsung copy-paste prompt ini ke Qwen, dan dia akan tahu konteks dari FitSync Web yang sudah kamu buat di Week 1.

---

**Prompt untuk Qwen Coder:**

---

You are an expert full-stack developer assisting in the continuation of the **FitSync Web** application project, which currently includes:

* Next.js 14 with App Router
* Tailwind CSS and shadcn/ui components
* NextAuth.js authentication with username/password and Google OAuth
* A basic Login page and Dashboard page (with steps, calories, and sleep cards)
* Logout functionality and reusable components (Navbar, DashboardCard)

Now, we’re moving into **Week 2 development**, focused on improving authentication, dashboard interactivity, and user data simulation.

### 🎯 Goals for Week 2

Enhance the FitSync Web app with these new features:

#### 1. **Registration Page**

* New page `/register` where users can sign up using:

  * Username
  * Password
  * Phone number (mock field, no real SMS yet)
* Implement client-side validation (e.g., empty fields, short passwords)
* Store new users in a temporary **mock JSON file or array** inside `/app/api/register/route.js`
* Redirect to the login page after successful registration

#### 2. **Dummy API for User Wellness Data**

* Create `/api/user-data` to return mock data:

  ```json
  {
    "steps": 8420,
    "goalSteps": 10000,
    "calories": 2300,
    "sleep": "6h 40m",
    "xp": 25
  }
  ```
* Fetch this data on the Dashboard and display dynamically instead of hardcoded values.
* Add XP logic: if steps ≥ 10000, XP += 10.

#### 3. **Dashboard Enhancement**

* Add a small chart (use `recharts`) for visualizing daily steps.
* Add a "Profile section" on the top-right of the dashboard (user name + XP badge).
* Keep design consistent with the existing color palette (#00C48C green, #4FB3FF blue).

#### 4. **Structure Improvement**

Organize the project folders like this:

```
/app
  /auth (login, register)
  /dashboard
  /api (user-data, register)
/components
  /ui
  /cards
  /charts
/lib
  auth.js
  utils.js
```

#### 5. **Bonus (Optional if time permits)**

* Create a reusable `<XPBadge />` component that dynamically updates XP based on activity data.

---

### 🧩 Technical Requirements

* Must maintain compatibility with Next.js App Router.
* Keep UI responsive and minimalist.
* Use shadcn/ui components for form fields and buttons.
* Ensure routes are protected (redirect to login if unauthenticated).
* Use Tailwind classes for consistent styling.

---

### 💾 Expected Deliverables

* New files:

  * `/app/register/page.js`
  * `/app/api/register/route.js`
  * `/app/api/user-data/route.js`
  * `/components/charts/StepsChart.js`
  * `/components/ui/XPBadge.js` (optional)
* Updated `/app/dashboard/page.js` to use live data from `/api/user-data`.

---

Use clear modular code and comments so the implementation can be extended later for real API and OTP integration.

---

## 🗂️ 2. **Struktur Folder FitSync Web (versi Week 2)**

```
fitsync-web/
├─ app/
│  ├─ api/
│  │  ├─ register/
│  │  │  └─ route.js
│  │  ├─ user-data/
│  │  │  └─ route.js
│  ├─ auth/
│  │  ├─ login/
│  │  │  └─ page.js
│  │  ├─ register/
│  │  │  └─ page.js
│  ├─ dashboard/
│  │  └─ page.js
│  ├─ layout.js
│  └─ page.js
├─ components/
│  ├─ ui/
│  │  ├─ Button.js
│  │  ├─ Input.js
│  ├─ cards/
│  │  ├─ DashboardCard.js
│  ├─ charts/
│  │  └─ StepsChart.js
│  ├─ Navbar.js
│  ├─ XPBadge.js
├─ lib/
│  ├─ auth.js
│  ├─ utils.js
├─ styles/
│  └─ globals.css
└─ package.json
```

---

## ✅ 3. **Week 2 Developer Checklist**

| Task                        | Description                                        | Status |
| --------------------------- | -------------------------------------------------- | ------ |
| 🔐 Create Register Page     | Username, password, phone number form + validation | ☐      |
| 💾 API Mock Register        | `/api/register` stores data in-memory              | ☐      |
| 📊 Create `/api/user-data`  | Returns steps, calories, sleep, XP mock data       | ☐      |
| 🧠 Add XP Logic             | +10 XP if steps ≥ 10000                            | ☐      |
| 📈 Add StepsChart Component | Display bar/line chart using Recharts              | ☐      |
| 🧍 Add Profile Section      | Show username + XP badge in Navbar                 | ☐      |
| 🗂️ Clean File Structure    | Reorganize folders for scalability                 | ☐      |
| 🧪 Test Authentication Flow | Login, register, logout flow check                 | ☐      |

---

Apakah kamu mau saya bantu juga buatkan **prompt versi “App Summary (Week 2)”** agar Qwen bisa menulis ringkasan hasil develop-nya nanti (seperti log yang kamu tunjukkan sebelumnya)?
Itu bisa membantu kalau kamu mau terus dokumentasikan progres FitSync Web mingguan.
