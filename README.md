## specialists-test

Fullstack sample using the requested stack:
- Frontend: Ionic + React (TypeScript) with Redux Toolkit + RTK Query (Vite).
- Backend: NestJS (TypeScript).
- Database: JSON file at `backend/data/specialists.json`.

### Requirements
- Node.js **20+** (LTS recommended).
- npm (tested with npm 10). If you hit cache permission errors, set a project cache: `npm config set cache .npm-cache`.

### Getting started
1) Install dependencies:
```bash
cd backend && npm install
cd ../frontend && npm install
```

2) Start the backend (NestJS):
```bash
cd backend
npm run start:dev    # http://localhost:3000
```
Note: run the backend commands from inside the `backend/` directory so the JSON data path (`backend/data/specialists.json`) resolves correctly.
API:
- `GET /specialists` — returns `{ items, total, hasMore }`
- Pagination: fixed `limit=10`, use `offset` (0, 10, 20, …)
- Filters: `minAge`, `maxAge`, `gender` (`man|woman`), `minPrice`, `maxPrice`

3) Start the frontend (Ionic React):
```bash
cd frontend
npm run dev          # default http://localhost:5173
```
If your backend host/port differs, set `VITE_API_URL` in `frontend/.env` (e.g. `http://localhost:3000/`).

### App behavior
- Specialists list with title/subtitle showing available count.
- Action bar: Filters modal (age, gender, price), working Sort (rating/price/age/name) and Favorites toggle with badge.
- Favorites persist to `localStorage`; favorites-only view available.
- Infinite scroll loads more as you scroll and respects current filters/sort; pull-to-refresh supported.
- Error → toast; empty results → empty state with reset option.
- JSON storage is created on demand if missing.

### Run in iOS Simulator with Capacitor
Prereqs: Xcode + CLI tools installed. Backend must be running on your Mac.

1) Set the API URL for the simulator (use your Mac’s LAN IP, not localhost):
```
cd frontend
echo "VITE_API_URL=http://<your-mac-ip>:3000/" > .env
```
Find your IP with `ipconfig getifaddr en0` (Wi‑Fi) or `ipconfig getifaddr en1` (Ethernet).

2) Build and sync web assets to iOS:
```
npm run build
npx cap copy ios
```
Re-run these after frontend or `.env` changes.

3) Open and run in Xcode:
```
npx cap open ios
```
In Xcode, select the `App` scheme and a simulator device (e.g., iPhone 15), then press Run (▶).

Live reload in Simulator (Capacitor dev server)
1) In `frontend/`, run the dev server so the simulator can reach it:
```
npm run dev -- --host --port 5173
```
2) Point Capacitor to your dev server (use your Mac’s LAN IP, not localhost) by editing `frontend/capacitor.config.ts`:
```ts
server: {
  url: "http://<your-mac-ip>:5173",
  cleartext: true,
}
```
3) Sync and open iOS, then run:
```
npx cap sync ios
npx cap open ios
```
Select a simulator and press Run. Changes served by Vite will show without rebuilding the native app. When you’re done, remove the `server.url` (or restore the original `server` block) and return to the bundled build flow (`npm run build && npx cap copy ios`).

### Type checking
- Frontend type-only check: `cd frontend && npm run typecheck`
- Backend type-only check: `cd backend && npm run typecheck`
