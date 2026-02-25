# Autoflex (Practical Test)

Autoflex is a simple inventory/production planning system for an industry that manufactures products using shared raw materials.

The system allows you to:

- Manage Products (code, name, price)
- Manage Raw Materials (code, name, stock quantity)
- Manage each Product Bill of Materials (raw materials + required quantity)
- Calculate Production Suggestions: which products (and how many units) can be produced with the current stock, prioritizing higher-value products when raw materials are shared

This repository contains two separate applications:

- `backend/`: Spring Boot REST API + persistence
- `frontend/`: React (Vite) web app consuming the API

## Tech Stack

- Backend: Java 21, Spring Boot, Spring Web, Spring Data JPA, Spring Security (CORS), springdoc-openapi
- Database: PostgreSQL
- Frontend: React + Vite + React Router + Axios
- E2E tests: Cypress

## Requirements

- Java 21 (backend)
- Node.js `>=20.19 <22` or `>=22.12` (frontend, due to Vite 7)
- Docker + Docker Compose (optional, recommended for PostgreSQL)

## Quick Start (Docker)

Requirements: Docker + Docker Compose

From the repository root:

```bash
docker compose up --build
```

This starts:

- PostgreSQL on `localhost:5433`
- Backend API exposed on `localhost:8081` (default)

The frontend is not containerized in this setup; run it locally (see next section).

## For reviewers

Minimal checklist to validate the practical test quickly:

1. Start DB + API:

```bash
docker compose up -d
```

(On first run, you may need `--build`.)

2. (Optional) Load clean demo data:

```bash
docker compose exec db psql -U postgres -d autoflex -f /seed/seed.sql
```

3. Open the frontend and validate `Production Suggestions` (shared-stock + price priority).

### Run Frontend with Docker API

Because the dockerized API is exposed on port `8081`, configure the frontend base URL:

```bash
cd frontend
echo VITE_API_BASE_URL=http://localhost:8081 > .env
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

## Demo data (optional, manual)

If you want a clean, evaluator-friendly dataset (for example after running Cypress E2E tests that create `TEST-*` data), you can manually apply the optional seed.

This seed is mounted read-only into the Postgres container at `/seed/seed.sql` and is NOT auto-applied.

If you already have the `db` container running and `/seed/seed.sql` is missing, recreate it so Docker applies the mount:

```bash
docker compose up -d --force-recreate db
```

1. Reset containers + DB volume (wipes all data):

```bash
docker compose down -v && docker compose up -d
```

2. Apply the seed (wipes tables and recreates demo data):

```bash
docker compose exec db psql -U postgres -d autoflex -f /seed/seed.sql
```

If you changed `POSTGRES_USER` or `POSTGRES_DB` in Docker Compose, replace `postgres`/`autoflex` accordingly.

After seeding, `GET /production-suggestions` will clearly show RF004 behavior: products are suggested by highest `price` first, consuming shared raw material stock so lower-value products may end up with fewer (or zero) producible units.

## Run Locally (No Docker for API)

You can run only the database with Docker and the API locally.

1. Start PostgreSQL:

```bash
docker compose up -d db
```

2. Run the backend:

```bash
cd backend
./mvnw.cmd spring-boot:run
```

The backend will use the default DB connection `jdbc:postgresql://localhost:5433/autoflex`.

3. Run the frontend (API on `8080` by default when running locally):

```bash
cd frontend
npm install
npm run dev
```

If your API is not running on `http://localhost:8080`, set `VITE_API_BASE_URL` accordingly.

## Configuration

### Backend environment variables

The backend reads these variables (with defaults for local evaluation):

- `DB_URL` (default: `jdbc:postgresql://localhost:5433/autoflex`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: `123456`)
- `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)

When running with Docker Compose, the backend container is configured to use the internal host `db:5432`.

### Docker Compose environment variables

- `API_PORT` (default: `8081`) maps host port to backend container port `8080`
- `POSTGRES_DB` (default: `autoflex`)
- `POSTGRES_USER` (default: `postgres`)
- `POSTGRES_PASSWORD` (default: `123456`)

### Frontend environment variables

- `VITE_API_BASE_URL` (default fallback: `http://localhost:8080`)

## Deployment Notes (Optional)

Full deployment is **optional** for this practical test.

For evaluation, the recommended approach is to run everything locally with Docker Compose (database + backend) and run the frontend locally with Vite.

### Frontend-only deploy concept (optional)

If you want a free/low-friction way to publish the UI, you can deploy only the frontend on a static hosting platform.

- In that case, configure the deployed frontend with `VITE_API_BASE_URL` pointing to a reachable backend URL.
- Note: a publicly hosted frontend cannot call an API running on your local machine (`localhost`) unless you expose it (e.g., via a tunnel or by deploying the backend too).

### Full deploy concept (optional)

This is a conceptual reference only (no deployment is performed/provided here):

- Backend: build and deploy the Docker image to a container platform (examples: Render, Railway, Fly.io)
- Database: provision a managed PostgreSQL instance (examples: Neon, Supabase)
- Frontend: deploy the static build to a static hosting platform (example: Vercel)

### Environment variables (real names used in this repository)

Backend (Spring Boot):

- `DB_URL` (includes DB host/port/name, e.g. `jdbc:postgresql://<host>:<port>/<db>`)
- `DB_USER`
- `DB_PASSWORD`
- `CORS_ALLOWED_ORIGINS` (comma-separated)

Docker Compose (database + port mapping):

- `POSTGRES_DB`
- `POSTGRES_USER`
- `POSTGRES_PASSWORD`
- `API_PORT` (maps host port -> backend container `8080`)

Frontend (React/Vite):

- `VITE_API_BASE_URL`

### Production considerations (optional)

- CORS: lock `CORS_ALLOWED_ORIGINS` to the real frontend origin(s) only
- HTTPS: use TLS end-to-end (browser -> frontend host -> API)
- Logging: ensure structured logs and avoid leaking secrets (DB URLs/passwords) in logs
- Schema management: this project relies on Hibernate auto-DDL (`ddl-auto: update`) for local evaluation; for production, use a controlled migration strategy instead of auto-updates

## API Documentation (Swagger)

With the backend running, open:

- Swagger UI: `http://localhost:8080/swagger-ui/index.html` (local run) or `http://localhost:8081/swagger-ui/index.html` (docker)
- OpenAPI JSON: `http://localhost:8080/v3/api-docs` (local run) or `http://localhost:8081/v3/api-docs` (docker)

## Main Endpoints

- `POST /products`, `GET /products`, `GET /products/{id}`, `PUT /products/{id}`, `PATCH /products/{id}`, `DELETE /products/{id}`
- `POST /raw-materials`, `GET /raw-materials`, `GET /raw-materials/{id}`, `PUT /raw-materials/{id}`, `PATCH /raw-materials/{id}`, `DELETE /raw-materials/{id}`
- `POST /product-raw-materials`, `GET /product-raw-materials`, `GET /product-raw-materials/{id}`
- `GET /product-raw-materials/by-product/{productId}`
- `PUT /product-raw-materials/{id}`, `PATCH /product-raw-materials/{id}`, `DELETE /product-raw-materials/{id}`
- `GET /production-suggestions`

## Error Handling

The API returns proper HTTP status codes and a JSON response using Spring's `ProblemDetail`:

- `400` for invalid requests
- `404` for not found
- `409` for conflicts (e.g., duplicate codes or duplicate associations)

## Tests

### Backend (unit tests)

```bash
cd backend
./mvnw.cmd test
```

### Frontend (lint/build)

```bash
cd frontend
npm install
npm run lint
npm run build
```

### Frontend (Cypress E2E)

With frontend and backend running:

```bash
cd frontend
npm run test:e2e
```

## Notes about credentials / sensitive defaults (evaluation)

This repository includes **default local credentials** (e.g. PostgreSQL user/password and local ports) in configuration files and Docker Compose.

This was kept **intentionally** to make the evaluation simple to run without any extra secret management setup.

In a real production environment, these values must not be committed to the repository. A production-ready setup would use secret management (environment-specific secrets, CI/CD secret stores, vaults), separate configuration per environment, and stronger credentials.

## License

This repository is **proprietary evaluation material** for Projetada. No permission is granted to copy, modify, or redistribute it.

See [LICENSE](LICENSE).

## Requirements checklist (from the practical test)

- RNF001: Web system, runnable in modern browsers
- RNF002: API concept with separate backend and frontend
- RNF003: Responsive frontend screens
- RNF004: Persistence in a DBMS (PostgreSQL used; JPA-based persistence)
- RNF005: Backend using a framework (Spring Boot)
- RNF006: Frontend using a framework (React)
- RNF007: English naming for code and DB structures

- RF001–RF004: Backend CRUD + production suggestions
- RF005–RF008: Frontend screens for CRUD + production suggestions listing
