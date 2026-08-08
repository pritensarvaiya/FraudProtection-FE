# ScamShield AI — Frontend

React UI for ScamShield AI. Lets a user paste a suspicious message, email, URL, or screenshot
text, calls the [Backend](../Backend) API, and displays an explainable risk assessment with
evidence highlights and English/Hindi safety guidance.

## Stack

- React 19 + [Vite](https://vite.dev/) (plain JS/JSX, no TypeScript)
- Plain `fetch` for API calls (no axios/React Query) — see `src/services/api.js`

## Prerequisites

- Node.js 18+ (tested on Node 25)
- The [Backend](../Backend) running locally (default `http://localhost:5199`)

## Setup

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173` by default.

## Configuration

The backend base URL is read from `VITE_API_BASE_URL` in `.env`:

```
VITE_API_BASE_URL=http://localhost:5199/api
```

Change this if your backend runs on a different host/port.

## Project structure

```
src/
├── components/
│   ├── AnalyzeForm.jsx    # input form (type, content, optional secondary context)
│   ├── RiskResult.jsx     # risk badge, score, evidence, actions, English/Hindi guidance toggle
│   └── HistoryList.jsx    # list of previously analyzed cases
├── services/
│   └── api.js             # fetch wrapper: analyzeContent, getHistory, getCase
├── App.jsx                # page composition + state
├── App.css                # component styling
└── index.css              # design tokens / global styles
```

## Build

```bash
npm run build
```

Outputs a production build to `dist/`.

## Known limits

- No client-side routing — single-page view.
- No auth — assumes the backend is open/CORS-permissive, matching the current backend MVP scope.
- History list re-fetches the full list after every analysis (no pagination) — fine at demo scale,
  would need pagination against a real database backend.

## Team contributions

| Name | Role | Contribution |
|---|---|---|
|  |  |  |
|  |  |  |
|  |  |  |
