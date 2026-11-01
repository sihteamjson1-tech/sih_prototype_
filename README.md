# Pramaan frontend

JavaScript React app for the SIH 2026 application-validation prototype. This is not an official AICTE or Government of India portal.

## Layout

```
frontend/
  public/                 static files served as-is
  src/
    components/           shared UI (layout, forms, documents, feedback, tables)
    context/              language, session, and portal state
    hooks/
    i18n/
    pages/                one screen per route, including role dashboards
    services/             API client, document checks, and demonstration data
    styles/
    utils/
    App.jsx               providers and routes
    main.jsx              React entry
  index.html
  vite.config.js
```

## Run

```bash
cd frontend
npm install
npm run dev
```

Open the local Vite address. Demonstration mode is on by default (`VITE_DEMO_MODE=true` in `.env`).

Sign in with the password `demo` and any demonstration role. A prepared case is available from the homepage: reference `PRA/EOA/2026/MH/00421`.

## API

Set `VITE_DEMO_MODE=false` to call a FastAPI service at `VITE_API_BASE_URL`:

- `POST /api/applications`
- `POST /api/applications/{id}/documents`
- `POST /api/applications/{id}/validate`
- `GET /api/applications/{id}/results`
- `GET /api/applications/{id}/report`
- `GET /api/compliance/rules`

Do not put secrets in frontend environment files. If the service cannot be reached, use “Use demonstration checks instead” or the administrator connection test. Demonstration checks are labelled and do not claim a live authenticity result.
