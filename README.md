# Kalshi Bar

![Kalshi Bar favicon](frontend/public/favicon.ico)

A curated discovery experience for sports bars and event watch parties, with live Kalshi market snapshots and a map-first UI.

## Highlights
- Map-driven bar discovery with rich cards and event badges
- Event detail pages with related Kalshi markets and charts
- Optimized image rendering and consistent card layouts
- SEO + social preview metadata (Open Graph + Twitter)

## Tech Stack
- Next.js (App Router)
- Tailwind CSS
- Hono + Bun backend for Kalshi API proxying
- Mapbox GL

## Monorepo Layout
- `frontend/` — Next.js UI
- `backend/` — Hono service for Kalshi data, logos, and candlesticks

## Getting Started

### Frontend
```bash
cd frontend
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm run dev
```

## Environment Variables

### Frontend (`frontend/.env.local`)
```
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
NEXT_PUBLIC_SITE_URL=https://kalshi-bar.vercel.app
```

### Backend (`backend/.env.local`)
```
KALSHI_API_KEY=...
KALSHI_PRIVATE_KEY_PATH=./kalshi_private_key.pem
# or
KALSHI_PRIVATE_KEY_BASE64=...
OPENAI_API_KEY=...
KALSHI_API_BASE=https://api.elections.kalshi.com
```

## Notes
- If Kalshi main API (`api.kalshi.com`) is unreachable in your hosting environment, the elections API is used instead.
- Logo lookups are rate limited by third-party providers; fallbacks are used when limits are hit.

## Deploy
- Frontend: Vercel
- Backend: Railway (or any Node/Bun-compatible host)

## License
MIT
