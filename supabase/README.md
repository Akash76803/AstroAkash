# Astro Bud Supabase Layer

This folder contains the current Supabase backend layer.

## Current role

Supabase is still used for:

- database
- auth
- current Edge Function flows
- chart and transit endpoints used by parts of the app

## Main functions

- `generate-chart`
- `compatibility-api`
- `horoscope-api`
- `transits-api`

Shared logic:

- [astrology-engine.ts](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/supabase/functions/_shared/astrology-engine.ts)
- [compatibility-engine.ts](C:/Users/DELL7480/Documents/AI%20Projects/Astro%20Akash/supabase/functions/_shared/compatibility-engine.ts)

## Migration direction

The project is moving toward:

- Supabase for auth and data
- Node service for deep astrology reporting
- optional proxy/orchestration from Supabase to Node later

## Local development

Typical setup:

```bash
supabase init
supabase start
supabase functions serve
```

## Notes

- Docker is needed for a full local Supabase stack.
- In the current local setup, the frontend is paired with the Node report service on `4102`.
- Supabase remains part of the app architecture, but the deep report path is being moved into the Node layer.
