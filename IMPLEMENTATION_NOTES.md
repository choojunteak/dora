# Implementation Notes

## What Changed

This pass refactored the Dora map UI from a dashboard-style overlay into a mobile-first map experience. The map is now the primary full-screen surface, with compact floating controls and bottom drawers for secondary actions.

Latest focused update: `/app/map` now has a compact floating Home / Map / Lists navigation pill so users can leave the full-screen map without restoring the larger bottom navigation.

## Files Edited

- `src/components/AppShell.tsx`
- `src/components/FoodMapApp.tsx`
- `src/components/MapView.tsx`
- `src/components/SearchLocationBox.tsx`
- `src/components/ChatRecommendationPanel.tsx`
- `src/components/PlaceBottomSheet.tsx`
- `src/components/ListDrawer.tsx`
- `src/components/SelectedListChips.tsx`
- `src/app/app/map/page.tsx`
- `src/app/app/lists/page.tsx`
- `src/app/app/lists/[id]/page.tsx`
- `README.md`
- `IMPLEMENTATION_NOTES.md`

## Map Layout

`/app/map` now uses a `100dvh`-based viewport height and hides the normal bottom nav on the map page. The app shell keeps only a compact header, then the map fills the remaining screen. The default map UI now shows:

- Floating search bar near the top
- Compact list count button
- Small selected-list chips
- Bottom floating `Ask Dora` and `Add` buttons
- Compact floating Home / Map / Lists navigation pill
- Place details only when a pin is tapped

The desktop side list still exists on extra-wide screens, but it is narrower, shorter, and hidden on mobile.

## Map Navigation

The normal app bottom nav remains hidden on `/app/map` to preserve the full-screen map feel. `FoodMapApp.tsx` now renders a smaller map-specific floating navigation pill at the bottom of the viewport:

- `Home` links to `/app`
- `Map` links to `/app/map` and is visually active
- `Lists` links to `/app/lists`

The `Ask Dora` and `Add` controls were moved upward so they do not overlap with this navigation. The `5 lists` button remains only for filtering visible map pins, not for navigating to the Lists page.

## List Drawer

The old large list selector buttons were removed from the map view. `ListDrawer.tsx` now opens from the compact list count button. Each row includes:

- Avatar/initials
- List name
- Owner
- Number of places
- Toggle switch

The map prevents deselecting every list, so the user is never left with a blank state by accident.

## Chat Drawer

The chatbot is collapsed by default. The map shows only an `Ask Dora` bottom pill. Tapping it opens a bottom sheet with:

- Example prompt
- Query input
- Recommendation results

Selecting a recommendation closes the chat drawer and focuses the place on the map.

## List Detail Routes

`/app/lists` cards are now clickable. A new route, `/app/lists/[id]`, shows:

- List name
- Owner
- Description
- Number of places
- Saved places in that list
- `View this list on map` link

The map page accepts `?lists=<listId>` and starts with only that list selected.

## Manual Test Steps

1. Start the app with `npm.cmd run dev`.
2. Open `http://localhost:3000/app/map`.
3. Confirm the map fills the screen and the default UI is compact.
4. Tap the `5 lists` button and toggle one or more lists.
5. Confirm map pins update and selected-list chips change.
6. Search for `Orchard MRT` and select a result.
7. Tap `Ask Dora`, ask `dessert near Orchard MRT`, and select a result.
8. Tap a map pin and confirm the place bottom sheet is scrollable.
9. Tap the bottom `Home`, `Map`, and `Lists` navigation pill links.
10. Confirm `Map` is visually active while on `/app/map`.
11. Open `http://localhost:3000/app/lists`.
12. Click a list card, then click `View this list on map`.
13. Confirm `/app/map?lists=<listId>` loads with only that list selected.

## Known Limitations

- Add-place saves are still local state only.
- Ask Dora is still rule-based and keyword-driven.
- The map uses OpenStreetMap raster tiles for a no-key MVP.
- The list filter is represented in the URL only on initial page load.
- The compact map navigation is intentionally separate from the full app bottom nav, so nav styling is duplicated lightly for now.
- No real authentication or Supabase persistence is connected yet.

## Recommended Next Fixes

- Persist selected lists in the URL as the user toggles them.
- Add a compact mobile place-results drawer after recommendation queries.
- Add Supabase auth and saved-place persistence.
- Add proper PWA icons and service worker.
