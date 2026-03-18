# Node Swiss Ephemeris Migration

## Objective

Move Kundli and compatibility calculations from Supabase Edge to a dedicated Node.js service where Swiss Ephemeris can run properly.

## Why move

- Supabase Edge is ideal for lightweight TypeScript but not the best home for native Swiss Ephemeris bindings.
- Node service can:
  - load native modules
  - mount ephemeris files
  - handle longer-running calculations
  - centralize real astrology logic in one place

## Impact on current system

### Frontend

- Minimal impact if JSON contract stays stable.
- Current pages can keep using the same sections and summary structure.

### Supabase

- Edge Functions become thin proxies or auth gates.
- Database remains source of truth for users, saved charts, and report history.

### Backend

- New service handles:
  - Swiss Ephemeris chart generation
  - compatibility matching
  - language-aware detailed explanations
  - permission-first flow

## Resolution strategy

1. Introduce Node service in `server/`.
2. Keep response format compatible with current frontend.
3. Let Supabase proxy requests to Node for auth-safe access.
4. Move `generate-chart` and `compatibility-api` to proxy mode later.
5. Store generated reports in Supabase after successful response.

## Permission-first response

```json
{
  "permission_required": true,
  "message": "क्या आप अपनी पूरी कुंडली का विस्तृत विश्लेषण देखना चाहते हैं?",
  "language": "hi",
  "data": {
    "summary": "आपकी कुंडली का summary तैयार है।"
  }
}
```

## Language strategy

- `hi`: default
- `hinglish`: optional toggle
- `en`: admin/testing/global support

## Suggested next implementation steps

1. Install dependencies in `server/`.
2. Mount Swiss ephemeris files and set `SWISSEPH_EPHE_PATH`.
3. Implement full Swiss chart calculations in `SwissEphemerisService`.
4. Replace stub compatibility snapshot with classical scoring from real Swiss chart output.
5. Add LLM explanation generation behind the prompt-builder layer.
