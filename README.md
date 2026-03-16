# ✨ Astro Akash — AI-Powered Vedic Astrology Platform

Astro Akash is a modern, production-ready astrology web application designed with a cosmic, mystical aesthetic. It provides users with deep astrological insights through birth charts (Kundli), daily horoscopes, compatibility matching, and AI-powered readings.

![Astro Akash Hero](https://images.unsplash.com/photo-1506318137071-a8e063b4b477?q=80&w=1200&auto=format&fit=crop)

## 🌌 Features

-   **🔐 Secure Authentication**: Integrated with Supabase Auth (Email/Password + Google OAuth).
-   **📅 Daily Horoscopes**: Personalized daily, weekly, and monthly predictions for all 12 zodiac signs.
-   **☸️ Kundli Generator**: Detailed North Indian and Western birth charts with planetary positions, degrees, and nakshatras.
-   **❤️ Compatibility Checker**: Ashtakoot Guna Milan (36-point match) with detailed score breakdowns.
-   **🧠 AI Insights**: Advanced AI-driven analysis of birth charts for personality, career, and relationships.
-   **📊 Interactive Visualizations**: Dynamic SVG charts built with D3.js and responsive UI components.
-   **📱 Fully Responsive**: A premium "mobile-first" experience with a cosmic dark-mode theme.

## 🛠️ Technology Stack

-   **Frontend**: [Next.js 15](https://nextjs.org/) (App Router, TypeScript)
-   **Styling**: [Tailwind CSS 4](https://tailwindcss.com/)
-   **Database & Auth**: [Supabase](https://supabase.com/)
-   **Animations**: [Framer Motion](https://www.framer.com/motion/)
-   **Data Visualization**: [D3.js](https://d3js.org/) & [Chart.js](https://www.chartjs.org/)
-   **Icons**: [Lucide React](https://lucide.dev/)

## 📂 Project Structure

```bash
├── client/              # Next.js frontend application
│   ├── src/
│   │   ├── app/         # App router pages and layouts
│   │   ├── components/  # Reusable UI, Layout, and Feature components
│   │   ├── hooks/       # Custom React hooks (useAuth, etc.)
│   │   ├── lib/         # Utility functions and API clients
│   │   └── types/       # Global TypeScript interfaces
├── Note/                # Project design and implementation docs
└── README.md            # Project overview
```

## 🚀 Getting Started

### 1. Clone & Install

```bash
# Clone the repository
git clone <your-repo-url>
cd astro-akash

# Install dependencies
cd client
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the `client` directory:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the application.

## 🎨 Design Philosophy

Astro Akash follows a **"Cosmic Mystical"** design language:
-   **Color Palette**: Deep void purples, nebula blues, and stardust golds.
-   **Glassmorphism**: Elegant translucent cards with subtle glow effects.
-   **Micro-animations**: Parallax star fields and smooth zodiac rotations.
-   **Typography**: Space Grotesk for headings and Inter for readability.

---

Built with ✨ and 🌌 by the Astro Akash Team.
