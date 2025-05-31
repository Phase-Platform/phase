#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo "🚀 Starting Phase Platform Docker containers..."

# Check if .env.local file exists
if [ ! -f .env.local ]; then
    echo -e "${RED}Error: .env.local file not found!${NC}"
    echo "Please run setup-env.sh first to create the environment files."
    exit 1
fi

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running!${NC}"
    echo "Please start Docker Desktop and try again."
    exit 1
fi

# Stop any existing containers
echo "Stopping any existing containers..."
docker-compose -f docker-compose.dev.yml down

# Start the containers
echo "Starting containers..."
docker-compose -f docker-compose.dev.yml up -d

# Check if containers started successfully
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Docker containers started successfully!${NC}"
    echo "
Services available at:
- PostgreSQL: localhost:${POSTGRES_PORT:-5432}
  - Database: ${POSTGRES_DB:-phase_dev}
  - User: ${POSTGRES_USER:-phase_user}
  - Password: ${POSTGRES_PASSWORD:-phase_password}

- Redis: localhost:${REDIS_PORT:-6379}
  - Password: ${REDIS_PASSWORD:-pkIlv/rtqkskHtat7wvFkw==}

- Mailhog: 
  - SMTP: localhost:${MAILHOG_SMTP_PORT:-1025}
  - Web UI: localhost:${MAILHOG_WEB_PORT:-8025}

- MinIO:
  - API: localhost:${MINIO_API_PORT:-9000}
  - Console: localhost:${MINIO_CONSOLE_PORT:-9001}
  - User: ${MINIO_ROOT_USER:-phaseadmin}
  - Password: ${MINIO_ROOT_PASSWORD:-phaseadmin123}

- Adminer: localhost:${ADMINER_PORT:-8080}
  - Server: ${ADMINER_DEFAULT_SERVER:-postgres}
  - Design: ${ADMINER_DESIGN:-dracula}

- Redis Commander: localhost:${REDIS_COMMANDER_PORT:-8081}
"
else
    echo -e "${RED}❌ Failed to start Docker containers${NC}"
    exit 1
fi 