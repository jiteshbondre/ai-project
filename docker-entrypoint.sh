#!/bin/bash
set -e

# Find PostgreSQL version and data directory
PG_VERSION=$(ls /etc/postgresql/ | head -n1)
PG_DATA_DIR="/var/lib/postgresql/${PG_VERSION}/main"
PG_CONFIG_DIR="/etc/postgresql/${PG_VERSION}/main"

# Configure PostgreSQL to allow connections
if [ -f "$PG_CONFIG_DIR/pg_hba.conf" ]; then
  if ! grep -q "host all all 0.0.0.0/0 md5" "$PG_CONFIG_DIR/pg_hba.conf"; then
    echo "host all all 0.0.0.0/0 md5" >> "$PG_CONFIG_DIR/pg_hba.conf"
  fi
fi

if [ -f "$PG_CONFIG_DIR/postgresql.conf" ]; then
  if ! grep -q "listen_addresses = '*'" "$PG_CONFIG_DIR/postgresql.conf"; then
    sed -i "s/#listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONFIG_DIR/postgresql.conf" || \
    sed -i "s/listen_addresses = 'localhost'/listen_addresses = '*'/g" "$PG_CONFIG_DIR/postgresql.conf" || \
    echo "listen_addresses='*'" >> "$PG_CONFIG_DIR/postgresql.conf"
  fi
fi

# Start PostgreSQL
echo "Starting PostgreSQL..."
service postgresql start || service postgresql restart

# Wait for PostgreSQL to be ready
echo "Waiting for PostgreSQL to be ready..."
for i in {1..30}; do
  if sudo -u postgres pg_isready > /dev/null 2>&1; then
    break
  fi
  sleep 1
done

# Set postgres password and create database
echo "Setting up database..."
sudo -u postgres psql -c "ALTER USER postgres WITH PASSWORD 'postgres';" 2>/dev/null || true
sudo -u postgres psql -tc "SELECT 1 FROM pg_database WHERE datname = 'schooldb'" | grep -q 1 || sudo -u postgres createdb schooldb

echo "PostgreSQL is ready!"

# Start Nginx in background
echo "Starting Nginx..."
service nginx start

# Start Spring Boot application in background
echo "Starting Spring Boot application..."
java -jar /app/backend/app.jar \
  --spring.profiles.active=docker \
  --spring.datasource.url=${SPRING_DATASOURCE_URL:-jdbc:postgresql://localhost:5432/schooldb} \
  --spring.datasource.username=${SPRING_DATASOURCE_USERNAME:-postgres} \
  --spring.datasource.password=${SPRING_DATASOURCE_PASSWORD:-postgres} \
  --server.port=${SERVER_PORT:-8081} \
  &

# Wait for Spring Boot to start
echo "Waiting for Spring Boot to start..."
for i in {1..60}; do
  if curl -f http://localhost:8081/api 2>/dev/null || curl -f http://localhost:8081/swagger-ui/index.html 2>/dev/null; then
    break
  fi
  sleep 2
done

echo "All services are running!"
echo "Frontend: http://localhost"
echo "Backend API: http://localhost/api"
echo "Swagger UI: http://localhost/api/swagger-ui/index.html"

# Keep container running
tail -f /dev/null

