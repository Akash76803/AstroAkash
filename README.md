# Astro Bud

Astro Bud is a Vedic astrology web application built with:

- Next.js frontend in [client](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/client)
- Supabase backend and Edge Functions in [supabase](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/supabase)
- Node.js astrology report service in [server](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/server)

## Current architecture

- `client/`
  - Next.js App Router
  - Tailwind CSS
  - Kundli and compatibility pages
- `supabase/`
  - database
  - auth
  - current chart/transit function layer
- `server/`
  - Express-based astrology report service
  - Swiss Ephemeris-backed chart engine
  - multilingual report generation

## Current status

- Kundli generation is working with real chart data.
- Node report service is running locally and powers detailed Kundli analysis.
- Frontend form visibility has been refreshed and verified locally.
- Compatibility page works, but its deep narrative layer is still behind the Kundli report in quality and depth.

## Local URLs

Current verified local URLs:

- App Kundli: `http://127.0.0.1:3005/kundli`
- App Compatibility: `http://127.0.0.1:3005/compatibility`
- Node report backend: `http://127.0.0.1:4102`

## Project structure

```text
Astro Bud/
  client/      Next.js frontend
  supabase/    Supabase backend layer
  server/      Node astrology/report service
  database/    SQL migrations
  Note/        migration and architecture notes
```

## Run locally

### Frontend

```bash
cd client
npm install
npm run build
npm run start -- -H 127.0.0.1 -p 3005
```

### Node astrology report service

```bash
cd server
npm install
npm run build
set PORT=4102&& npm run start
```

### Supabase layer

See [supabase/README.md](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/supabase/README.md).

## Environment

Frontend:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_ASTROLOGY_REPORTS_URL=http://127.0.0.1:4102/api/v1
```

Node service:

```env
SWISSEPH_EPHE_PATH=./ephe
PORT=4102
```

## Notes

- `swisseph-v2` is a native Node addon and needs native build prerequisites on Windows.
- Kundli detailed analysis is currently the strongest verified flow.
- Compatibility scoring works, but the report-writing layer still needs another pass for deeper section-wise matching interpretation.

## Docs

- [client/README.md](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/client/README.md)
- [server/README.md](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/server/README.md)
- [supabase/README.md](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/supabase/README.md)
- [Note/node-swiss-migration.md](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/Note/node-swiss-migration.md)
