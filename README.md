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

### Run Frontend with Docker API

Because the dockerized API is exposed on port `8081`, configure the frontend base URL:

```bash
cd frontend
echo VITE_API_BASE_URL=http://localhost:8081 > .env
npm install
npm run dev
```

Open the app at `http://localhost:5173`.

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
