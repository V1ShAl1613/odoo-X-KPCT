# 🌍 Traveloop — Personalized Travel Planning Made Easy

<div align="center">

![Traveloop](https://img.shields.io/badge/Traveloop-Travel%20Planning-6366f1?style=for-the-badge&logo=globe&logoColor=white)
![Next.js](https://img.shields.io/badge/Next.js_16-black?style=for-the-badge&logo=next.js&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)

**Plan multi-city trips, build itineraries, track budgets, and share your travel plans.**

[Live Demo](#) · [Report Bug](../../issues) · [Request Feature](../../issues)

</div>

---

## ✨ Features

- 🗺️ **Multi-City Itineraries** — Plan trips across multiple cities with drag-and-drop reordering
- 💰 **Budget Analytics** — Track expenses by category with beautiful pie & bar charts
- 📅 **Day-wise Planning** — Organize activities for each day with timeline visualization
- 🔗 **Share Itineraries** — Generate public links to share beautiful itineraries
- ✅ **Packing Checklists** — Categorized packing lists with progress tracking
- 📝 **Trip Notes & Reminders** — Capture ideas, tips, and set reminders
- 🌆 **City Discovery** — Search and explore cities worldwide (GeoDB API)
- 🏛️ **Activity Search** — Discover activities and attractions (OpenTripMap API)
- 🖼️ **Destination Images** — Beautiful city photos (Unsplash API)
- 🔐 **Authentication** — Signup, login, password reset flows
- 📱 **Fully Responsive** — Mobile-first design, works on all devices
- 🌙 **Dark Mode** — Premium dark theme with glassmorphism effects

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Animations | Framer Motion |
| Charts | Recharts |
| Forms | React Hook Form + Zod |
| State | Zustand |
| Database | Supabase PostgreSQL (with localStorage fallback) |
| Auth | Supabase Auth (with local fallback) |
| Icons | Lucide React |
| Toasts | Sonner |

---

## 📁 Project Structure

```
src/
├── app/                        # Next.js App Router
│   ├── (dashboard)/            # Protected routes with sidebar
│   │   ├── dashboard/          # Main dashboard
│   │   ├── trips/              # Trip listing + creation
│   │   ├── trips/[id]/         # Trip detail
│   │   ├── trips/[id]/itinerary/  # Itinerary builder
│   │   ├── trips/[id]/budget/  # Budget analytics
│   │   ├── trips/[id]/packing/ # Packing checklist
│   │   ├── trips/[id]/notes/   # Trip notes
│   │   ├── trips/[id]/share/   # Share settings
│   │   ├── explore/            # City discovery
│   │   └── profile/            # User profile
│   ├── share/[token]/          # Public shared itinerary
│   ├── login/                  # Login page
│   ├── signup/                 # Signup page
│   ├── forgot-password/        # Password reset
│   └── page.tsx                # Landing page
├── components/
│   ├── layout/                 # Navbar, Sidebar
│   └── shared/                 # Skeletons, Empty states
├── hooks/                      # Custom React hooks
├── lib/                        # Utils, validators, data layer
├── services/                   # API services (cities, activities, images)
├── stores/                     # Zustand state management
└── types/                      # TypeScript type definitions
```

---

## 🗄️ Database Schema

9 tables with full relational integrity:

| Table | Description |
|-------|------------|
| `profiles` | User profiles (extends auth.users) |
| `trips` | Trip details with dates, budget, type |
| `trip_stops` | Cities in a trip with ordering |
| `activities` | Activity catalog from APIs |
| `trip_activities` | Activities assigned to stops |
| `budgets` | Expense tracking by category |
| `packing_items` | Packing checklist items |
| `trip_notes` | Notes and reminders |
| `shared_itineraries` | Public share tokens |

Full SQL migration: [`database/migration.sql`](database/migration.sql)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- npm

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd traveloop

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

### Environment Variables

```env
# Supabase (optional - uses localStorage fallback if empty)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

# APIs (optional - uses fallback data if empty)
NEXT_PUBLIC_GEODB_API_KEY=          # RapidAPI
NEXT_PUBLIC_OPENTRIPMAP_API_KEY=    # opentripmap.io
NEXT_PUBLIC_UNSPLASH_ACCESS_KEY=    # unsplash.com/developers
```

### Setting up Supabase (Optional)

1. Create a project at [supabase.com](https://supabase.com)
2. Go to SQL Editor and run `database/migration.sql`
3. Copy your project URL and anon key to `.env.local`
4. Enable Email auth in Authentication settings

---

## 🌐 APIs Used

| API | Purpose | Free Tier |
|-----|---------|-----------|
| [GeoDB Cities](https://rapidapi.com/wirefreethought/api/geodb-cities) | City search | 1000 req/day |
| [OpenTripMap](https://opentripmap.io/) | Activities & attractions | 10 req/sec |
| [Unsplash](https://unsplash.com/developers) | Destination images | 50 req/hr |

All APIs have built-in fallback data when keys are not configured.

---

## 📱 Pages

| # | Page | Route | Features |
|---|------|-------|----------|
| 1 | Landing | `/` | Hero, features, stats, CTA |
| 2 | Login | `/login` | Email/password, validation |
| 3 | Signup | `/signup` | Registration with confirmation |
| 4 | Forgot Password | `/forgot-password` | Reset flow |
| 5 | Dashboard | `/dashboard` | Stats, recent trips, recommendations |
| 6 | My Trips | `/trips` | Grid, search, filter, delete |
| 7 | Create Trip | `/trips/new` | Form with validation |
| 8 | Trip Detail | `/trips/[id]` | Overview, stats, quick links |
| 9 | Itinerary | `/trips/[id]/itinerary` | Drag-drop, city search, activities |
| 10 | Budget | `/trips/[id]/budget` | Charts, expenses, warnings |
| 11 | Packing | `/trips/[id]/packing` | Checklist, categories, progress |
| 12 | Notes | `/trips/[id]/notes` | Notes, reminders, edit |
| 13 | Share | `/trips/[id]/share` | Link generation, social share |
| 14 | Public View | `/share/[token]` | Read-only itinerary |
| 15 | Explore | `/explore` | City discovery, search |
| 16 | Profile | `/profile` | Settings, language, delete |

---

## 🎨 Design System

- **Theme**: Dark mode by default
- **Colors**: Deep navy backgrounds, violet-cyan gradient accents
- **Effects**: Glassmorphism, card shine, gradient borders
- **Animations**: Page transitions, staggered lists, hover effects
- **Typography**: Inter font family
- **Components**: Custom buttons, inputs, cards, skeletons

---

## 🚢 Deployment

### Vercel (Frontend)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

Configure environment variables in Vercel dashboard.

### Supabase (Backend)

Database is hosted on Supabase. Run `database/migration.sql` in SQL Editor.

---

## 📄 License

MIT License — feel free to use for your projects.

---

<div align="center">

Made with ❤️ for travelers everywhere

**[⬆ Back to Top](#-traveloop--personalized-travel-planning-made-easy)**

</div>
