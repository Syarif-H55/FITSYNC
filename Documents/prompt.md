

## 🧠 **Prompt Qwen Coder – FitSync Web (Week 1 Development Prototype)**

> 💡 **Tujuan Prompt ini:**
> Meminta Qwen Coder membangun *project skeleton + 2 halaman utama* (Login dan Dashboard) berdasarkan App Summary FitSync Web.

---

### 🧾 **Prompt Lengkap (Copy-paste ke Qwen Coder)**

> **Role:** You are an experienced full-stack web developer specialized in Next.js, authentication, and Tailwind UI design.
> You will now help me start building a new web application called **FitSync Web**, based on the product summary provided below.

---

#### 🩵 **Project Context (From App Summary)**

FitSync Web is a holistic health and fitness platform that combines features from Da Fit (wearable tracking) and 8fit (workout & meal planning) into one unified dashboard.
It offers activity tracking, smart workout planning, meal recommendations, sleep analysis, and AI-powered motivation — all inside a clean and modern web interface.

The MVP focus for this week:

* Web-based app (Next.js 14)
* Authentication (username/password + Google login with NextAuth.js)
* Simple Dashboard after login
* Logout functionality

**Core pages to implement now:**

1. `/login` — login & registration form (username/password, Google OAuth)
2. `/dashboard` — simple dashboard with user greeting, dummy stats (steps, calories, sleep), and logout button

---

#### 🧰 **Technical Requirements**

* **Framework:** Next.js 14 (App Router)
* **Styling:** Tailwind CSS + shadcn/ui
* **Authentication:** NextAuth.js

  * Credentials login (username/password)
  * Google OAuth provider
  * Placeholder for phone-based OTP login (for future)
* **UI Library:** shadcn/ui for components
* **Charts (future):** Recharts (not needed in this stage)
* **Design palette:**

  * Primary green `#00C48C`
  * Secondary blue `#4FB3FF`
  * Neutral background `#FFFFFF`

---

#### 🎯 **Development Goals (Week 1)**

✅ **1. Initialize Project Structure**

* Create a Next.js 14 app with Tailwind configured.
* Add `/login`, `/dashboard`, `/api/auth/[...nextauth]/route.ts`.

✅ **2. Build Login Page**

* Minimal modern UI using Tailwind + shadcn/ui.
* Inputs for username and password.
* “Login with Google” button integrated with NextAuth.
* “Register new account” link (inactive placeholder).
* “Login with phone number” placeholder button (for OTP later).
* Upon successful login → redirect to `/dashboard`.

✅ **3. Build Dashboard Page**

* Simple Navbar with app name “FitSync Web” and Logout button.
* Greet the logged-in user (e.g., “Hi, Syarif 👋”).
* Display three dummy metric cards:

  * Steps (8,420)
  * Calories burned (2,300 kcal)
  * Sleep (6h 40m)
* Layout should be responsive, card-based, clean, and light.

✅ **4. Implement Logout**

* Use NextAuth `signOut()` method.
* Redirect user back to `/login`.

✅ **5. Basic Design & UX**

* Use consistent font and spacing.
* Keep design modern, airy, and data-focused.
* Include smooth transitions between login and dashboard.

---

#### 📂 **Expected Output**

* Full source code of the working Next.js app, including:

  * `package.json` dependencies
  * Tailwind setup (`globals.css`, config)
  * NextAuth setup
  * Pages (`/login`, `/dashboard`)
  * Reusable components (`Navbar.tsx`, `DashboardCard.tsx`)
* Include code comments explaining key parts (auth flow, routing, etc.).
* Use dummy data or mock API for now (no real backend required yet).

---

#### ⚙️ **Example Flow**

1. User opens `/login` → enters username & password.
2. On success → redirected to `/dashboard`.
3. Dashboard shows greeting + dummy stats + Logout.
4. Clicking “Logout” ends session and redirects to `/login`.

---

### 🧩 **Additional Instructions for Qwen**

If needed, generate:

* `README.md` explaining how to run the app (commands, dependencies).
* Suggestions for future expansion (Workout page, Meal page, AI reminder system).
* Use modern, modular code structure (React server components + client components when required).

---

### 🧠 **Tone for UI**

* Clean, friendly, and motivating — like a digital wellness companion.
* Minimal icons, rounded cards, smooth hover effects.

---

> **Final Output Goal:**
> A fully functional **Next.js 14 web app** with login, dashboard, and logout flow matching the concept of FitSync Web from the App Summary.

---



> Please generate all necessary code files and configurations for this MVP version, ready to run locally with `npm run dev`.

---

