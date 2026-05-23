# 🌿 Sanctuary — Daily Bible Reading App

A whimsical, pastel-toned Progressive Web App (PWA) for daily Bible reading, journaling, and spiritual growth tracking.

**Built with:** Next.js 15 (App Router) · TypeScript · Turbopack · CSS Variables · Vercel-ready

---

## ✨ Features

| Feature | Description |
|---|---|
| **Daily Home** | Greeting, verse of the day, today's practice checklist, activity heatmap |
| **Morning & Evening Journal** | Reflection prompts, mood tracking, verse tagging, date navigation |
| **Reading Planner** | Choose from 4 structured plans (NT in 90 days, Bible in a Year, Gospels, Psalms & Proverbs), log individual chapters |
| **Goals** | Create and track custom reading goals with progress bars |
| **Streaks** | Automatic streak tracking for consecutive reading days |
| **PWA / Mobile Install** | Add to home screen on iOS/Android — works offline once cached |

---

## 🚀 Getting Started

```bash
# 1. Install dependencies
npm install

# 2. Run dev server (Turbopack)
npm run dev

# Open http://localhost:3000
```

## 📦 Build & Deploy

```bash
npm run build   # production build
npm start       # start production server

# Deploy to Vercel:
npx vercel      # or connect your GitHub repo in Vercel dashboard
```

---

## 🏗️ Project Structure

```
src/
├── app/
│   ├── layout.tsx          # Root layout + metadata
│   ├── page.tsx            # Entry point
│   └── globals.css         # Design system (tokens, components)
├── components/
│   ├── AppShell.tsx        # Tab router / app state
│   ├── ui/
│   │   └── Nav.tsx         # Bottom nav (mobile) / top nav (desktop)
│   ├── tracker/
│   │   ├── HomeView.tsx    # Today dashboard + heatmap
│   │   └── GoalsView.tsx   # Goals CRUD + stats
│   ├── journal/
│   │   └── JournalView.tsx # Morning/evening journal editor
│   └── planner/
│       └── PlannerView.tsx # Reading plan selector + log
├── hooks/
│   └── useAppData.ts       # localStorage state management
├── lib/
│   ├── storage.ts          # CRUD helpers for localStorage
│   └── bible.ts            # Bible books data + plan templates
└── types/
    └── index.ts            # TypeScript interfaces
```

---

## 🎨 Design System

The app uses a **Cormorant Garamond** display font (serif, editorial) paired with **Lato** for body text. The palette is soft cottagecore — cream, dusty rose, sage, lavender, and warm gold — all defined as CSS custom properties in `globals.css`.

All data is stored locally in `localStorage`. No backend required. Future extensions:

- **Supabase** — sync data across devices
- **Bible API** — pull actual scripture text
- **Push notifications** — daily reading reminders
- **Expo/React Native** — true native mobile app

---

## 📱 Mobile Install (PWA)

On iOS: tap Share → Add to Home Screen  
On Android: tap menu → Install App

The manifest is at `public/manifest.json`. Add 192×192 and 512×512 PNG icons to `/public` and reference them there for a polished install experience.

---

## 🛠️ Tech Stack

- **Next.js 15** — App Router, Server Components, Turbopack
- **TypeScript** — strict types throughout
- **CSS Variables** — zero-dependency design system
- **date-fns** — date formatting and manipulation
- **lucide-react** — consistent icon set
- **ESLint** (eslint-config-next) — linting

---

*Built with love for your daily quiet time. 🕊️*
