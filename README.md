# Locco

Locco is a Singapore-focused social food map MVP. The core idea is: show me food near where I am going, but only from people whose taste I trust.

## What It Does

- Shows a MapLibre map centered on Singapore.
- Lets users select and deselect trusted food lists.
- Displays only places from the currently selected lists.
- Clusters nearby map pins and splits them as the map zooms in.
- Opens a mobile-friendly place bottom sheet when a pin is selected.
- Supports mock add-place flow with local state.
- Searches OneMap from a server route with local Singapore fallbacks.
- Provides Ask Locco, a rule-based recommendation assistant with compact map-focused result cards.

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- MapLibre GL JS
- OneMap Singapore search API route
- Read-only Supabase data access with mock-data fallback

## Run Locally

```bash
npm install
npm run dev
```

Then open:

```text
http://localhost:3000
```

Main app page:

```text
http://localhost:3000/app/map
```

List detail pages:

```text
http://localhost:3000/app/lists/list_annj
```

Open the map with one list selected:

```text
http://localhost:3000/app/map?lists=list_annj
```

On Windows PowerShell, if `npm` is blocked by script policy, use:

```powershell
npm.cmd run dev
```

## Environment Variables

Copy `.env.example` to `.env.local` when you are ready to add real integrations.

```text
ONEMAP_EMAIL=
ONEMAP_PASSWORD=
NEXT_PUBLIC_APP_URL=
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
# Optional legacy fallback:
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

The MVP does not require these values to run. For Supabase reads, Locco prefers `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` and still accepts the older `NEXT_PUBLIC_SUPABASE_ANON_KEY` name for compatibility. Do not add `SUPABASE_SERVICE_ROLE_KEY`, `sb_secret_*`, or other private Supabase keys to client-side env variables.

OneMap search currently uses the public search endpoint and falls back to local known Singapore locations if the live call fails.

## Supabase Setup

The project includes a read-only Supabase connection, and the app still runs without Supabase credentials.

1. Create a Supabase project.
2. Open the Supabase SQL editor.
3. Run `supabase/schema.sql` to create the MVP tables.
4. Run `supabase/seed.sql` to insert the current Locco demo lists, places, tags, comments, sources, and saved-place relationships.
5. Copy `.env.example` to `.env.local` only when you are ready to test Supabase reads locally.
6. Fill in:

```text
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=
```

If your Supabase project still shows the older public anon key name, you can use `NEXT_PUBLIC_SUPABASE_ANON_KEY=` instead. Do not commit `.env.local`.

When Supabase env values are present and all demo read queries succeed, `src/lib/data/` reads lists, places, saved-place relationships, tags, comments, and source links from Supabase. If env values are missing, any query fails, or the expected demo data is empty, Locco falls back to `src/data/mockData.ts`.

Current Supabase files:

- `src/lib/supabase/client.ts` - browser-safe client factory
- `src/lib/supabase/server.ts` - server read client factory using the public Supabase key
- `src/lib/supabase/types.ts` - typed database shape matching `schema.sql`
- `supabase/schema.sql` - MVP database tables for demo owners, lists, places, saves, tags, comments, and sources
- `supabase/seed.sql` - idempotent seed for the current mock Locco data
- `src/lib/data/` - data access helpers with read-only Supabase queries and mock fallback

## Testing Supabase And Fallback

With Supabase enabled:

1. Make sure `supabase/schema.sql` and `supabase/seed.sql` have both run successfully.
2. Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to `.env.local`.
3. Restart the dev server with `npm.cmd run dev`.
4. Open `/app/map`, `/app/lists`, a list detail page, and a place detail page.
5. Ask Locco for something like `dessert near Orchard MRT` and confirm recommendations still appear.

To test mock fallback:

1. Stop the dev server.
2. Rename `.env.local` to something like `.env.local.off`, or remove the Supabase values.
3. Restart with `npm.cmd run dev`.
4. Confirm the same pages still load and Ask Locco still returns demo recommendations.

## Important Files

- `src/app/app/map/page.tsx` - main map route
- `src/components/FoodMapApp.tsx` - main app state and map page composition
- `src/components/MapView.tsx` - MapLibre map, clustering, pin selection
- `src/components/ListDrawer.tsx` - compact mobile list selector drawer
- `src/components/SelectedListChips.tsx` - small selected-list chips on the map
- `src/components/ChatRecommendationPanel.tsx` - recommendation chat UI
- `src/utils/recommendations.ts` - rule-based parsing and scoring
- `src/data/mockData.ts` - mock lists and Singapore food places
- `src/lib/data/` - read-only Supabase data access with mock fallback
- `src/lib/supabase/` - Supabase client/server/type foundation
- `src/app/app/lists/[id]/page.tsx` - list detail route
- `src/app/api/onemap/search/route.ts` - server-side OneMap search route
- `src/app/api/recommend/route.ts` - recommendation API route
- `supabase/schema.sql` - planned database structure
- `supabase/seed.sql` - current mock data as SQL seed data

## Current MVP Limitations

- Authentication is mocked.
- Supabase reads are read-only and fall back to mock data whenever env values are missing, queries fail, or seeded demo data is incomplete.
- Places saved through the add modal only live in browser state until refresh.
- Recommendation logic is deterministic keyword matching, not an LLM yet.
- Map tiles use OpenStreetMap raster tiles for a simple no-key MVP.
- OneMap credential/token caching is documented but not required for the current search endpoint.
- No real TikTok or Instagram scraping is implemented.

## Next Steps

- Connect Supabase auth.
- Persist list saves, comments, tags, and sources.
- Add friend invitations and list privacy.
- Replace the rule-based recommender with an LLM-assisted parser while keeping the current scoring function.
- Add PWA service worker and production icons.
- Deploy to Vercel.
