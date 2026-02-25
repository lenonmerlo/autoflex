# Autoflex Frontend (React + Vite)

Web UI for managing Products, Raw Materials, Product BOM (Product–Raw Material), and Production Suggestions.

## Requirements

- Node.js (LTS recommended)
- npm

Note: this project uses Vite 7, which requires Node.js `>=20.19 <22` or `>=22.12`.

## Setup

```bash
npm install
```

## Run (development)

```bash
npm run dev
```

Default URL: `http://localhost:5173`

## API base URL

The frontend uses the Vite environment variable `VITE_API_BASE_URL` as the API base URL.

Create `frontend/.env` (example for local backend on port 8080):

```bash
VITE_API_BASE_URL=http://localhost:8080
```

If `VITE_API_BASE_URL` is not defined, the HTTP client falls back to `http://localhost:8080`.

### Using the backend via Docker Compose

In this repository, Docker Compose exposes the backend API on `http://localhost:8081` by default.

Create/update `frontend/.env`:

```bash
VITE_API_BASE_URL=http://localhost:8081
```

## Available routes

- `/products`: Products CRUD + BOM section
- `/raw-materials`: Raw materials CRUD
- `/product-raw-materials`: Manage BOM associations
- `/production-suggestions`: Production suggestions listing (prioritizes higher-value products)

## Scripts

- `npm run dev`: start dev server
- `npm run build`: production build
- `npm run preview`: preview production build
- `npm run lint`: run ESLint
- `npm run test:e2e`: run Cypress E2E (headless)

## E2E tests (Cypress)

Requirements:

- Backend running (local or Docker)
- Frontend running (`npm run dev`) or Cypress configured to start it

Run:

```bash
npm run test:e2e
```

## Notes about credentials / sensitive defaults (evaluation)

For evaluation convenience, this project includes local defaults (ports and endpoints) and Docker Compose defaults.

In a real environment, sensitive values must not be committed to the repository and should be provided via secret management and environment-specific configuration.

## License

This repository is **proprietary evaluation material** for Projetada. No permission is granted to copy, modify, or redistribute it.

See [../LICENSE](../LICENSE).
