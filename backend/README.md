# Autoflex Backend (Spring Boot API)

REST API for managing Products, Raw Materials, Product Bill of Materials (BOM), and Production Suggestions.

## Requirements

- Java 21
- Docker (optional, recommended for PostgreSQL)

## Run (Local)

### 1) Start PostgreSQL

From repository root:

```bash
docker compose up -d db
```

The database is exposed on `localhost:5433`.

### 2) Run the API

```bash
./mvnw.cmd spring-boot:run
```

Default API URL: `http://localhost:8080`

## Run (Docker)

From repository root:

```bash
docker compose up --build backend
```

By default, the backend is exposed on `http://localhost:8081`.

To change the host port:

```bash
set API_PORT=8080
docker compose up --build backend
```

## Configuration

Backend configuration is primarily controlled by environment variables.

### Database

- `DB_URL` (default: `jdbc:postgresql://localhost:5433/autoflex`)
- `DB_USER` (default: `postgres`)
- `DB_PASSWORD` (default: `123456`)

### CORS

- `CORS_ALLOWED_ORIGINS` (default: `http://localhost:5173`)

Examples:

```bash
set CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:4173
```

## Swagger / OpenAPI

- Swagger UI: `/swagger-ui/index.html`
- OpenAPI JSON: `/v3/api-docs`

Examples:

- `http://localhost:8080/swagger-ui/index.html`
- `http://localhost:8080/v3/api-docs`

## Endpoints

### Products

- `POST /products`
- `GET /products`
- `GET /products/{id}`
- `PUT /products/{id}`
- `PATCH /products/{id}`
- `DELETE /products/{id}`

### Raw Materials

- `POST /raw-materials`
- `GET /raw-materials`
- `GET /raw-materials/{id}`
- `PUT /raw-materials/{id}`
- `PATCH /raw-materials/{id}`
- `DELETE /raw-materials/{id}`

### Product BOM (Product–Raw Material)

- `POST /product-raw-materials`
- `GET /product-raw-materials`
- `GET /product-raw-materials/{id}`
- `GET /product-raw-materials/by-product/{productId}`
- `PUT /product-raw-materials/{id}`
- `PATCH /product-raw-materials/{id}`
- `DELETE /product-raw-materials/{id}`

### Production Suggestions

- `GET /production-suggestions`

The calculation prioritizes higher unit price products first and consumes shared raw material stock accordingly.

## Error Handling

The API uses HTTP status codes and returns a JSON response based on Spring's `ProblemDetail`.

- `400 Bad Request`: invalid payload / invalid request
- `404 Not Found`: entity not found
- `409 Conflict`: duplicate product/material codes or duplicate BOM association

## Tests

```bash
./mvnw.cmd test
```

## Notes about credentials / sensitive defaults (evaluation)

For evaluation convenience, the project includes local DB defaults (user/password and ports) in configuration files and Docker Compose.

In a real environment, these values should not be committed and must be provided via secret management and environment-specific configuration.

## License

This repository is **proprietary evaluation material** for Projetada. No permission is granted to copy, modify, or redistribute it.

See [../LICENSE](../LICENSE).
