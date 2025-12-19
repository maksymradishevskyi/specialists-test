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
- Action bar: Filters modal (age, gender, price), Sort + Favorites placeholders.
- Infinite scroll loads 10 at a time; pull-to-refresh supported.
- Error → toast; empty results → empty state with reset option.
- JSON storage is created on demand if missing.
