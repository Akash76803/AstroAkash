# Astro Akash — UI/UX Design System

---

## Design Tokens & Global System

### Color Palette

| Token | Hex | Usage |
|---|---|---|
| `--bg-void` | `#06060F` | Page background, deepest layer |
| `--bg-cosmos` | `#0D0D1F` | Card backgrounds, panels |
| `--bg-nebula` | `#141432` | Elevated surfaces, modals |
| `--bg-stardust` | `#1E1E48` | Hover states, active surfaces |
| `--accent-gold` | `#F5C542` | Primary CTA, highlights, zodiac accents |
| `--accent-purple` | `#8B5CF6` | Secondary accent, active nav, links |
| `--accent-cyan` | `#22D3EE` | Info states, chart lines, data points |
| `--accent-rose` | `#F472B6` | Compatibility hearts, love sections |
| `--text-primary` | `#F0F0F5` | Headings, primary body text |
| `--text-secondary` | `#9CA3AF` | Descriptions, labels |
| `--text-muted` | `#6B7280` | Placeholder text, disabled |
| `--border-subtle` | `#2A2A5C` | Card borders, dividers |
| `--gradient-cosmic` | `#8B5CF6 → #22D3EE` | Hero gradients, premium badges |
| `--gradient-golden` | `#F5C542 → #F97316` | CTA buttons, score gauges |
| `--success` | `#34D399` | Positive compatibility, success |
| `--danger` | `#EF4444` | Errors, destructive actions |

#### Tailwind `tailwind.config.ts` extension
```javascript
colors: {
  void: '#06060F',
  cosmos: '#0D0D1F',
  nebula: '#141432',
  stardust: '#1E1E48',
  gold: '#F5C542',
  cosmic: { purple: '#8B5CF6', cyan: '#22D3EE', rose: '#F472B6' },
}
```

---

### Typography

| Element | Font | Weight | Size | Tailwind |
|---|---|---|---|---|
| Hero heading | **Space Grotesk** | 700 | 48–72px | `font-display text-5xl font-bold` |
| Section heading | Space Grotesk | 600 | 28–36px | `font-display text-3xl font-semibold` |
| Card title | **Inter** | 600 | 18–20px | `font-sans text-lg font-semibold` |
| Body text | Inter | 400 | 14–16px | `font-sans text-sm` |
| Caption / label | Inter | 500 | 12px | `font-sans text-xs font-medium uppercase tracking-wider` |
| Zodiac symbols | **Noto Sans Symbols 2** | — | Variable | For ♈♉♊ glyphs |

> [!TIP]
> Import via Google Fonts: `Space+Grotesk:wght@600;700` and `Inter:wght@400;500;600`

---

### Icon Libraries

| Library | Usage | Install |
|---|---|---|
| **Lucide React** | UI icons (menu, settings, search, arrows) | `lucide-react` |
| **React Icons (Gi)** | Zodiac & astrology-specific icons | `react-icons` (GiAries, GiTaurus…) |
| **Custom SVGs** | 12 zodiac signs, planet glyphs, house symbols | Hand-crafted or AI-generated |

---

### Animations & Effects

| Effect | Implementation | Tailwind |
|---|---|---|
| Star-field parallax bg | CSS `@keyframes` + `background-position` | Custom plugin or inline styles |
| Card hover glow | `box-shadow` with accent color + scale | `hover:shadow-[0_0_30px_rgba(139,92,246,0.3)] hover:scale-[1.02]` |
| Page fade-in | Framer Motion `motion.div` | `initial={{ opacity:0, y:20 }}` |
| Zodiac wheel spin | CSS `rotate` animation on SVG | `animate-spin-slow` (custom 20s) |
| Number count-up | Framer Motion `useSpring` | For compatibility score |
| Shimmer loading | Gradient animation placeholder | `animate-pulse bg-gradient-to-r from-cosmos via-stardust to-cosmos` |
| Constellation lines | SVG `stroke-dasharray` draw-in | CSS `@keyframes dash` |

---

## Page Designs

---

### 1. Home Page

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar (transparent → solid on scroll)       │
├──────────────────────────────────────────────┤
│  Hero Section                                 │
│  ┌────────────────────┬─────────────────────┐│
│  │ Tagline + CTA      │ Animated Zodiac     ││
│  │ "Discover Your     │ Wheel (D3/SVG)      ││
│  │  Cosmic Blueprint" │                     ││
│  └────────────────────┴─────────────────────┘│
├──────────────────────────────────────────────┤
│  Features Grid (3 cols)                       │
│  [Kundli] [Horoscope] [Compatibility]         │
├──────────────────────────────────────────────┤
│  Zodiac Carousel (horizontal scroll)          │
│  ♈ ♉ ♊ ♋ ♌ ♍ ♎ ♏ ♐ ♑ ♒ ♓              │
├──────────────────────────────────────────────┤
│  Testimonials (cards with star ratings)       │
├──────────────────────────────────────────────┤
│  CTA Banner ("Get Your Free Kundli")          │
├──────────────────────────────────────────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

#### Components
- `<Navbar />` — transparent, blur-glass on scroll, gold logo, CTA button
- `<HeroSection />` — split layout: text left, animated zodiac wheel right
- `<FeatureCard />` — icon + title + description, hover glow
- `<ZodiacCarousel />` — horizontal snap-scroll, each sign clickable
- `<TestimonialSlider />` — auto-play with dot indicators
- `<CTABanner />` — gradient bg, email input + button
- `<Footer />` — 4-col links, socials, copyright

#### User Flow
`Land → Scroll features → Click zodiac sign → Redirected to horoscope` OR
`Land → Click "Get Free Kundli" → Redirected to Kundli Generator (or login)`

#### Mobile Behavior
- Hero stacks vertically (text above, wheel below smaller)
- Feature grid → single column cards
- Zodiac carousel → swipeable
- Navbar → hamburger menu with slide-in drawer

#### Key Tailwind Classes
```
bg-void min-h-screen
/* Hero */ bg-gradient-to-br from-void via-cosmos to-nebula
/* Feature cards */ bg-cosmos/60 backdrop-blur-md border border-border-subtle rounded-2xl p-6
/* CTA */ bg-gradient-to-r from-gold to-orange-500 text-void font-bold rounded-full px-8 py-3
```

---

### 2. Horoscope Page

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────────────────────────────┤
│  Zodiac Selector Bar (12 signs, pill tabs)    │
│  [ ♈ Aries ] [♉ Taurus] [♊ Gemini] ...       │
├──────────┬───────────────────────────────────┤
│  Period  │  Horoscope Content Card            │
│  Tabs    │  ┌───────────────────────────────┐ │
│ [Daily]  │  │ Sign icon + name              │ │
│ [Weekly] │  │ Date range                    │ │
│ [Monthly]│  │ Horoscope text (AI-generated) │ │
│          │  │ Lucky: number, color, stone   │ │
│          │  └───────────────────────────────┘ │
│          ├───────────────────────────────────┤
│          │  Aspect Meters (Love/Career/Health)│
│          │  ████████░░ 8/10                   │
├──────────┴───────────────────────────────────┤
│  Related: "Check Your Kundli" CTA             │
└──────────────────────────────────────────────┘
```

#### Components
- `<ZodiacSelector />` — horizontal pill tabs, active = gold underline + glow
- `<PeriodTabs />` — Daily | Weekly | Monthly toggle
- `<HoroscopeCard />` — animated sign icon, content, lucky attributes
- `<AspectMeter />` — love/career/health progress bars with labels
- `<RelatedCTA />` — cross-sell banner

#### User Flow
`Select zodiac sign → View daily horoscope → Toggle to weekly/monthly → Click CTA for deeper analysis`

#### Mobile Behavior
- Zodiac selector → 2-row grid or horizontal scroll
- Period tabs → full-width pills
- Content card → full-width, stacked meters

---

### 3. Kundli Generator Page

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────────────────────────────┤
│  Page Header: "Generate Your Birth Chart"     │
├──────────────────┬───────────────────────────┤
│  Input Form      │  Live Preview / Result     │
│  ┌──────────────┐│  ┌───────────────────────┐│
│  │ Full Name    ││  │                       ││
│  │ Date of Birth││  │   North Indian Chart  ││
│  │ Time of Birth││  │       (D3.js SVG)     ││
│  │ Place (auto- ││  │                       ││
│  │  complete)   ││  └───────────────────────┘│
│  │ Ayanamsa     ││  Tab: [North] [South]     │
│  │ [Generate ✨]││                           │
│  └──────────────┘│  Planet Position Table     │
│                  │  ┌───────────────────────┐│
│                  │  │ Planet|Sign|Deg|Naksh  ││
│                  │  │ ☉ Sun |Ari |12°|Ashw  ││
│                  │  └───────────────────────┘│
│                  │  Dasha Timeline            │
│                  │  ═══════════════════════   │
├──────────────────┴───────────────────────────┤
│  AI Insight Summary (collapsible)             │
├──────────────────────────────────────────────┤
│  Actions: [Save] [Download PDF] [Share]       │
└──────────────────────────────────────────────┘
```

#### Components
- `<BirthDataForm />` — date picker, time picker, place autocomplete (geocode)
- `<NorthIndianChart />` — D3.js diamond-style SVG with planet glyphs
- `<SouthIndianChart />` — D3.js grid-style SVG
- `<ChartStyleToggle />` — North / South tab switch
- `<PlanetTable />` — sortable table with planet, sign, degree, nakshatra, pada
- `<DashaTimeline />` — horizontal bar chart showing Mahadasha periods
- `<AIInsightPanel />` — collapsible accordion with AI-generated interpretation
- `<ActionBar />` — Save, Download PDF, Share buttons

#### User Flow
`Fill birth data → Click Generate → Chart renders with animation → View planets → Expand AI insight → Save or Download`

#### Mobile Behavior
- Form and chart stack vertically (form first, chart below)
- Chart resizes to full-width with pinch-to-zoom
- Planet table → horizontal scroll
- Action bar → sticky bottom bar

#### Key Tailwind Classes
```
/* Form */ bg-cosmos border border-border-subtle rounded-2xl p-6
/* Inputs */ bg-void border border-border-subtle text-text-primary rounded-lg px-4 py-3 focus:ring-2 focus:ring-cosmic-purple
/* Generate btn */ bg-gradient-to-r from-cosmic-purple to-cosmic-cyan text-white font-semibold rounded-full px-8 py-3
/* Chart container */ bg-cosmos/40 backdrop-blur-sm rounded-2xl border border-border-subtle
```

---

### 4. Compatibility Checker

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────────────────────────────┤
│  Header: "Kundli Milan — Compatibility Check" │
├──────────────────────────────────────────────┤
│  ┌──────────┐   💕   ┌──────────┐            │
│  │ Person A  │  VS    │ Person B  │           │
│  │ Name      │        │ Name      │           │
│  │ DOB       │        │ DOB       │           │
│  │ Time      │        │ Time      │           │
│  │ Place     │        │ Place     │           │
│  └──────────┘        └──────────┘            │
│            [ Check Compatibility 💫 ]         │
├──────────────────────────────────────────────┤
│  Score Gauge (animated circular)              │
│         ╭──────╮                              │
│        │  28/36 │  "Excellent Match!"         │
│         ╰──────╯                              │
├──────────────────────────────────────────────┤
│  Guna Breakdown (8 rows)                      │
│  ┌───────────┬──────┬──────┬────────┐        │
│  │ Guna      │ Max  │Score │ Status │        │
│  │ Varna     │  1   │  1   │   ✅   │        │
│  │ Vashya    │  2   │  1   │   ⚠️   │        │
│  │ ...       │      │      │        │        │
│  └───────────┴──────┴──────┴────────┘        │
├──────────────────────────────────────────────┤
│  AI Summary (detailed paragraph)              │
├──────────────────────────────────────────────┤
│  [Save Result] [Download PDF]                 │
└──────────────────────────────────────────────┘
```

#### Components
- `<DualProfileForm />` — two side-by-side profile forms with heart divider
- `<ScoreGauge />` — animated circular progress (D3.js/SVG), gold fill, count-up
- `<GunaTable />` — 8-row table with progress indicators and status icons
- `<AIMatchSummary />` — card with rose-accent border, AI-generated text
- `<ActionBar />` — Save + Download buttons

#### User Flow
`Enter Person A & B data → Click Check → Animated score reveal → View guna breakdown → Read AI summary → Save/Download`

#### Mobile Behavior
- Person A & B forms stack vertically
- Score gauge → centered, full-width
- Guna table → card-based layout (one guna per card)

---

### 5. User Dashboard

#### Layout
```
┌────────┬─────────────────────────────────────┐
│Sidebar │  Welcome Header                     │
│        │  "Namaste, {Name} 🌟"               │
│ 🏠 Home │  ┌──────────┬──────────┬──────────┐ │
│ 📊Charts│  │Today's    │Moon Phase│Lucky     │ │
│ 🔮Horo  │  │Horoscope  │🌖        │Number: 7 │ │
│ 💕Compat│  └──────────┴──────────┴──────────┘ │
│ 🧠 AI   │                                     │
│ ⚙️ Set  │  Saved Birth Profiles               │
│ 🚪 Out  │  ┌────────┐ ┌────────┐ ┌────────┐  │
│        │  │Profile 1│ │Profile 2│ │ + Add  │  │
│        │  └────────┘ └────────┘ └────────┘  │
│        │                                     │
│        │  Recent Charts                      │
│        │  ┌─────────────────────────────────┐│
│        │  │ Chart thumbnail grid            ││
│        │  └─────────────────────────────────┘│
│        │                                     │
│        │  Compatibility History               │
│        │  ┌─────────────────────────────────┐│
│        │  │ A vs B — 28/36 — View           ││
│        │  └─────────────────────────────────┘│
└────────┴─────────────────────────────────────┘
```

#### Components
- `<Sidebar />` — fixed, icons + labels, collapsible on smaller screens
- `<WelcomeBar />` — greeting, user avatar, today's zodiac highlight
- `<QuickStatCards />` — 3-col: today's horoscope snippet, moon phase, lucky number
- `<ProfileGrid />` — cards for each saved birth profile + "Add New" card
- `<ChartHistory />` — thumbnail previews of generated charts
- `<CompatHistory />` — list of past compatibility results with score badge

#### User Flow
`Login → Dashboard → Quick view today's horoscope → Click saved profile → View chart → Navigate via sidebar`

#### Mobile Behavior
- Sidebar → bottom tab bar (5 icons)
- Quick stats → horizontal scroll cards
- Profile grid → 2-col grid
- Chart history → horizontal scroll with snap

#### Key Tailwind Classes
```
/* Sidebar */ bg-cosmos w-64 border-r border-border-subtle h-screen fixed
/* Active nav */ bg-stardust text-gold border-l-2 border-gold
/* Stat cards */ bg-gradient-to-br from-cosmos to-nebula border border-border-subtle rounded-2xl p-4
/* Profile card */ bg-cosmos hover:bg-stardust border border-border-subtle rounded-xl p-4 cursor-pointer transition-all
```

---

### 6. Login / Signup

#### Layout
```
┌──────────────────────────────────────────────┐
│            Constellation BG (animated)        │
│                                               │
│              ┌──────────────────┐             │
│              │    ✦ Logo ✦      │             │
│              │                  │             │
│              │ [Continue with   │             │
│              │  Google]  🔵     │             │
│              │                  │             │
│              │ ── or ──         │             │
│              │                  │             │
│              │ Email            │             │
│              │ [____________]   │             │
│              │ Password         │             │
│              │ [____________]   │             │
│              │                  │             │
│              │ [  Sign In  ✨]  │             │
│              │                  │             │
│              │ New here?        │             │
│              │ Create account → │             │
│              └──────────────────┘             │
│                                               │
└──────────────────────────────────────────────┘
```

#### Components
- `<AuthCard />` — centered glass card over constellation backdrop
- `<GoogleOAuthButton />` — Supabase `signInWithOAuth` trigger
- `<Divider />` — "or" line separator
- `<AuthForm />` — email + password fields, submit
- `<AuthToggle />` — switch between Login / Signup text links

#### User Flow
`Click Google → Supabase OAuth → Redirect to Dashboard` OR
`Enter email/password → Submit → JWT stored → Redirect to Dashboard`

#### Mobile Behavior
- Auth card → full-width with padding, no max-width cap
- Background animation stays but simplifies (fewer stars)

#### Key Tailwind Classes
```
/* Page */ bg-void min-h-screen flex items-center justify-center
/* Card */ bg-cosmos/70 backdrop-blur-xl border border-border-subtle rounded-3xl p-8 w-full max-w-md shadow-[0_0_60px_rgba(139,92,246,0.15)]
/* Google btn */ bg-white text-gray-800 font-semibold rounded-full px-6 py-3 w-full flex items-center justify-center gap-3
/* Submit */ bg-gradient-to-r from-cosmic-purple to-cosmic-cyan text-white font-semibold rounded-full px-8 py-3 w-full
```

---

### 7. Blog Page

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────────────────────────────┤
│  Featured Post (full-width hero card)         │
│  ┌──────────────────────────────────────────┐│
│  │ Image │ Title + Excerpt + Read More →     ││
│  └──────────────────────────────────────────┘│
├──────────────────────────────────────────────┤
│  Category Filters: [All] [Zodiac] [Kundli]   │
│  [Transits] [Vedic] [Remedies]                │
├──────────────────────────────────────────────┤
│  Post Grid (3 cols)                           │
│  ┌────────┐ ┌────────┐ ┌────────┐            │
│  │ Image  │ │ Image  │ │ Image  │            │
│  │ Title  │ │ Title  │ │ Title  │            │
│  │ Excerpt│ │ Excerpt│ │ Excerpt│            │
│  │ Date   │ │ Date   │ │ Date   │            │
│  └────────┘ └────────┘ └────────┘            │
├──────────────────────────────────────────────┤
│  Load More / Pagination                       │
└──────────────────────────────────────────────┘
```

#### Components
- `<FeaturedPost />` — hero card with image, gradient overlay, title
- `<CategoryFilter />` — pill toggle buttons
- `<BlogCard />` — image, title, excerpt, date, category badge, read time
- `<Pagination />` — numbered pagination or infinite scroll

#### Mobile Behavior
- Featured post → stacked (image above, text below)
- Grid → single column
- Category filters → horizontal scroll pills

---

### 8. Pricing Page

#### Layout
```
┌──────────────────────────────────────────────┐
│  Navbar                                       │
├──────────────────────────────────────────────┤
│  Header: "Choose Your Cosmic Plan"            │
│  Toggle: [Monthly] [Yearly — Save 20%]        │
├──────────────────────────────────────────────┤
│  ┌──────────┐  ┌──────────────┐  ┌────────┐  │
│  │   Free    │  │  Pro ⭐       │  │Premium │  │
│  │   ₹0/mo   │  │  ₹299/mo     │  │₹799/mo │  │
│  │           │  │ POPULAR       │  │        │  │
│  │ • 2 charts│  │ • ∞ charts   │  │• All   │  │
│  │ • Daily   │  │ • AI insight │  │• PDF   │  │
│  │   horo    │  │ • Compat     │  │• API   │  │
│  │           │  │ • Weekly     │  │• Prio  │  │
│  │           │  │              │  │  supp  │  │
│  │[Get Start]│  │[  Go Pro  ✨]│  │[Unlock]│  │
│  └──────────┘  └──────────────┘  └────────┘  │
├──────────────────────────────────────────────┤
│  FAQ Accordion                                │
├──────────────────────────────────────────────┤
│  Footer                                       │
└──────────────────────────────────────────────┘
```

#### Components
- `<BillingToggle />` — monthly/yearly switch with save badge
- `<PricingCard />` — plan name, price, feature list, CTA button
- `<PopularBadge />` — "Most Popular" gradient ribbon on Pro card
- `<FAQAccordion />` — expandable questions

#### Mobile Behavior
- Cards → single column, stacked vertically
- Popular card → highlighted with border glow, shown first
- FAQ → full-width accordion

#### Key Tailwind Classes
```
/* Popular card */ bg-cosmos border-2 border-gold rounded-2xl p-8 relative scale-105 shadow-[0_0_40px_rgba(245,197,66,0.2)]
/* Normal card */ bg-cosmos border border-border-subtle rounded-2xl p-8
/* Toggle active */ bg-cosmic-purple text-white rounded-full
/* Toggle inactive */ bg-void text-text-secondary rounded-full
```

---

### 9. Admin Panel

#### Layout
```
┌────────┬─────────────────────────────────────┐
│Sidebar │  Admin Header + Date               │
│        ├─────────────────────────────────────┤
│ 📊 Dash │  Stat Cards (4 cols)               │
│ 👥 Users│  [Total Users] [Charts] [Revenue]  │
│ 🔮 Horo │  [Active Today]                    │
│ 📝 Blog │                                    │
│ 💰 Plans├─────────────────────────────────────┤
│ ⚙️ Set  │  Charts: User Growth (line)        │
│        │  ┌─────────────────────────────────┐│
│        │  │  📈 Line chart (Chart.js)        ││
│        │  └─────────────────────────────────┘│
│        ├─────────────────────────────────────┤
│        │  Recent Users Table                 │
│        │  [Name | Email | Sign | Joined]     │
│        ├─────────────────────────────────────┤
│        │  Horoscope Manager                  │
│        │  [Generate Today's Horoscopes 🤖]   │
│        │  Status: ✅ 12/12 signs published   │
└────────┴─────────────────────────────────────┘
```

#### Components
- `<AdminSidebar />` — same style as dashboard, admin-specific links
- `<StatCard />` — number, label, trend arrow (green/red), sparkline
- `<UserGrowthChart />` — Chart.js line chart (last 30 days)
- `<UsersTable />` — paginated, searchable, sortable data table
- `<HoroscopeManager />` — trigger AI generation, view publish status

#### Mobile Behavior
- Sidebar → collapsible hamburger
- Stat cards → 2-col grid
- Table → horizontal scroll
- Charts → full-width, simplified

---

## Mobile-First Breakpoint Strategy

| Breakpoint | Tailwind | Target |
|---|---|---|
| Default | — | Mobile (< 640px) |
| `sm` | `640px` | Large phones |
| [md](file:///c:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/README.md) | `768px` | Tablets |
| `lg` | `1024px` | Laptops |
| `xl` | `1280px` | Desktops |

---

## Global Shared Components

| Component | Description |
|---|---|
| `<StarfieldBG />` | Animated canvas/CSS star background (used on Home, Auth) |
| `<GlassCard />` | Reusable glass-morphism card: `bg-cosmos/60 backdrop-blur-md border border-border-subtle rounded-2xl` |
| `<GradientButton />` | CTA button: `bg-gradient-to-r from-cosmic-purple to-cosmic-cyan rounded-full` |
| `<GoldButton />` | Secondary CTA: `bg-gradient-to-r from-gold to-orange-500 text-void rounded-full` |
| `<ZodiacIcon />` | SVG icon component accepting sign name, renders glyph |
| `<Loader />` | Cosmic spinner with orbiting dots |
| `<Toast />` | Notification toasts with cosmic styling |
| `<EmptyState />` | Illustration + message for empty data screens |
