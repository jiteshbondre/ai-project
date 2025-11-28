# Multi-stage Dockerfile for AI School Application
# Combines Frontend (Vite/React), Backend (Spring Boot), and PostgreSQL

# Stage 1: Build Frontend
FROM node:20-alpine AS frontend-builder

WORKDIR /app/frontend

# Copy frontend package files
COPY ai-school-frontend/package*.json ./
COPY ai-school-frontend/bun.lockb ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY ai-school-frontend/ ./

# Build frontend
RUN npm run build

# Stage 2: Build Backend
FROM gradle:8.5-jdk17 AS backend-builder

WORKDIR /app/backend

# Copy Gradle files (including wrapper JAR)
COPY WebModule/gradle/wrapper ./gradle/wrapper
COPY WebModule/gradlew ./
COPY WebModule/build.gradle ./
COPY WebModule/settings.gradle ./
RUN chmod +x ./gradlew

# Copy source code
COPY WebModule/src ./src

# Build backend (skip tests for faster build)
# Build both jar and bootJar to ensure we have the executable JAR
RUN ./gradlew bootJar -x test --no-daemon

# Stage 3: Runtime with PostgreSQL
FROM ubuntu:22.04

# Install dependencies
RUN apt-get update && apt-get install -y \
    postgresql \
    postgresql-contrib \
    openjdk-17-jdk \
    nginx \
    curl \
    sudo \
    && rm -rf /var/lib/apt/lists/*

# PostgreSQL will be configured at runtime via entrypoint script

# Copy built frontend
COPY --from=frontend-builder /app/frontend/dist /usr/share/nginx/html

# Copy built backend JAR (bootJar creates executable JAR without -plain suffix)
COPY --from=backend-builder /app/backend/build/libs/WebModule-0.0.1-SNAPSHOT.jar /app/backend/app.jar

# Configure Nginx for frontend
RUN echo 'server { \
    listen 80; \
    server_name _; \
    root /usr/share/nginx/html; \
    index index.html; \
    location / { \
        try_files $uri $uri/ /index.html; \
    } \
    location /api { \
        proxy_pass http://localhost:8081; \
        proxy_http_version 1.1; \
        proxy_set_header Upgrade $http_upgrade; \
        proxy_set_header Connection "upgrade"; \
        proxy_set_header Host $host; \
        proxy_set_header X-Real-IP $remote_addr; \
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for; \
        proxy_set_header X-Forwarded-Proto $scheme; \
    } \
}' > /etc/nginx/sites-available/default

# Create startup script
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

# Expose ports
EXPOSE 80 8081 5432

# Set environment variables
ENV POSTGRES_PASSWORD=postgres
ENV POSTGRES_USER=postgres
ENV POSTGRES_DB=schooldb
ENV SPRING_DATASOURCE_URL=jdbc:postgresql://localhost:5432/schooldb
ENV SPRING_DATASOURCE_USERNAME=postgres
ENV SPRING_DATASOURCE_PASSWORD=postgres
ENV SERVER_PORT=8081

# Use entrypoint script
ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]

