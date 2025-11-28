# Docker Setup for AI School Application

This setup combines the frontend (Vite/React), backend (Spring Boot), and PostgreSQL database in a single Docker container.

## Prerequisites

- Docker installed on your system
- Docker Compose (optional, but recommended)

## Quick Start

### Using Docker Compose (Recommended)

```bash
# Build and start the container
docker-compose up --build

# Or run in detached mode
docker-compose up -d --build
```

### Using Docker directly

```bash
# Build the image
docker build -t ai-school-app .

# Run the container
docker run -d \
  --name ai-school-app \
  -p 80:80 \
  -p 8081:8081 \
  -p 5432:5432 \
  ai-school-app
```

## Accessing the Application

Once the container is running:

- **Frontend**: http://localhost
- **Backend API**: http://localhost/api
- **Swagger UI**: http://localhost/api/swagger-ui/index.html
- **PostgreSQL**: localhost:5432

## Container Architecture

The container runs three services:

1. **Nginx** (port 80): Serves the React frontend and proxies API requests to Spring Boot
2. **Spring Boot** (port 8081): Backend API server
3. **PostgreSQL** (port 5432): Database server

## Environment Variables

You can customize the configuration using environment variables:

- `POSTGRES_PASSWORD`: PostgreSQL password (default: `postgres`)
- `POSTGRES_USER`: PostgreSQL user (default: `postgres`)
- `POSTGRES_DB`: Database name (default: `schooldb`)
- `SPRING_DATASOURCE_URL`: Spring Boot datasource URL
- `SPRING_DATASOURCE_USERNAME`: Spring Boot datasource username
- `SPRING_DATASOURCE_PASSWORD`: Spring Boot datasource password
- `SERVER_PORT`: Spring Boot server port (default: `8081`)

## Database Persistence

The `docker-compose.yml` includes a volume for PostgreSQL data persistence. Data will be preserved even if you stop and restart the container.

## Troubleshooting

### Check container logs

```bash
docker-compose logs -f
# or
docker logs -f ai-school-app
```

### Access container shell

```bash
docker-compose exec ai-school-app bash
# or
docker exec -it ai-school-app bash
```

### Restart services inside container

```bash
# Restart PostgreSQL
service postgresql restart

# Restart Nginx
service nginx restart

# Spring Boot will auto-restart if it crashes
```

### Check service status

```bash
# Inside the container
service postgresql status
service nginx status
ps aux | grep java
```

## Stopping the Application

```bash
# Using Docker Compose
docker-compose down

# Using Docker directly
docker stop ai-school-app
docker rm ai-school-app
```

## Building from Scratch

The Dockerfile uses multi-stage builds:

1. **Frontend builder**: Builds the React/Vite application
2. **Backend builder**: Builds the Spring Boot JAR file
3. **Runtime**: Combines everything with PostgreSQL and Nginx

## Notes

- The frontend is built for production (optimized bundle)
- The backend runs with the `docker` Spring profile
- PostgreSQL data is stored in `/var/lib/postgresql/14/main` inside the container
- All services start automatically when the container starts

