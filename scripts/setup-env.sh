#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${GREEN}Setting up Phase Platform environment...${NC}"

# Create .env.local if it doesn't exist
if [ ! -f .env.local ]; then
    echo -e "${YELLOW}Creating .env.local...${NC}"
    cat > .env.local << EOL
# ====================
# Application Settings
# ====================
NODE_ENV=development
APP_NAME=Phase Platform
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# ====================
# Database Configuration
# ====================
POSTGRES_DB=phase_dev
POSTGRES_USER=phase_user
POSTGRES_PASSWORD=phase_password
DATABASE_URL="postgresql://phase_user:phase_password@localhost:5432/phase_dev?schema=public"
DATABASE_POOL_SIZE=10

# ====================
# Authentication (NextAuth.js)
# ====================
NEXTAUTH_SECRET=HVdwJPVyapVE4adl8i7JYg==
NEXTAUTH_URL=http://localhost:3000

# GitHub OAuth
GITHUB_CLIENT_ID=Ph7t3upInWGc55kGpkJPEg==
GITHUB_CLIENT_SECRET=i2GtgfvflK1Pr3tXF+zw5A==
# Google OAuth
GOOGLE_CLIENT_ID=3AGf6ve5pXJ/ri1Y28y3rg==
GOOGLE_CLIENT_SECRET=YzE1s9jSsfB5OFuPQFRxzQ==

# ====================
# Redis Configuration
# ====================
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=pkIlv/rtqkskHtat7wvFkw==

# ====================
# Email Configuration
# ====================
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
SMTP_USER=phase_user
SMTP_PASSWORD=koRTSSXJShfZsEPH9nl2EA==
FROM_EMAIL=noreply@phaseplatform.com
FROM_NAME=Phase Platform

# ====================
# File Storage (S3 / MinIO)
# ====================
AWS_ACCESS_KEY_ID=MINIO_ROOT_USER
AWS_SECRET_ACCESS_KEY=MINIO_ROOT_PASSWORD
AWS_REGION=us-east-1
S3_BUCKET_NAME=phase-dev
S3_PUBLIC_URL=http://localhost:9000

# ====================
# Monitoring & Analytics
# ====================
SENTRY_DSN=
GA_TRACKING_ID=

# ====================
# Feature Flags
# ====================
ENABLE_REGISTRATION=true
ENABLE_GOOGLE_AUTH=true
ENABLE_GITHUB_AUTH=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SLACK_INTEGRATION=false
ENABLE_JIRA_INTEGRATION=false

# ====================
# API Keys & Integrations
# ====================
SLACK_CLIENT_ID=
SLACK_CLIENT_SECRET=
SLACK_SIGNING_SECRET=

JIRA_BASE_URL=
JIRA_USERNAME=
JIRA_API_TOKEN=

GITHUB_APP_ID=
GITHUB_APP_PRIVATE_KEY=
GITHUB_WEBHOOK_SECRET=

# ====================
# Development Settings
# ====================
DEBUG=true
LOG_LEVEL=debug
NODE_TLS_REJECT_UNAUTHORIZED=0

# ====================
# Docker & Deployment
# ====================
CONTAINER_PORT=3000
HEALTH_CHECK_PATH=/api/health
READY_CHECK_PATH=/api/ready
EOL
    echo -e "${GREEN}Created .env.local${NC}"
fi

# Create .env.production if it doesn't exist
if [ ! -f .env.production ]; then
    echo -e "${YELLOW}Creating .env.production...${NC}"
    cat > .env.production << EOL
# ====================
# Application Settings
# ====================
NODE_ENV=production
APP_NAME=Phase Platform
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# ====================
# Database Configuration
# ====================
POSTGRES_DB=phase_prod
POSTGRES_USER=phase_prod_user
POSTGRES_PASSWORD=your-secure-production-password
DATABASE_URL="postgresql://phase_prod_user:your-secure-production-password@postgres:5432/phase_prod?schema=public"
DATABASE_POOL_SIZE=20

# ====================
# Authentication (NextAuth.js)
# ====================
NEXTAUTH_SECRET=your-secure-production-secret
NEXTAUTH_URL=https://your-domain.com

# GitHub OAuth
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret

# ====================
# Redis Configuration
# ====================
REDIS_URL=redis://redis:6379
REDIS_PASSWORD=your-secure-redis-password

# ====================
# Email Configuration
# ====================
SMTP_HOST=your-smtp-host
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-smtp-user
SMTP_PASSWORD=your-smtp-password
FROM_EMAIL=noreply@your-domain.com
FROM_NAME=Phase Platform

# ====================
# File Storage (S3 / MinIO)
# ====================
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
AWS_REGION=your-aws-region
S3_BUCKET_NAME=your-production-bucket
S3_PUBLIC_URL=https://your-s3-url

# ====================
# Monitoring & Analytics
# ====================
SENTRY_DSN=your-sentry-dsn
GA_TRACKING_ID=your-ga-tracking-id

# ====================
# Feature Flags
# ====================
ENABLE_REGISTRATION=true
ENABLE_GOOGLE_AUTH=true
ENABLE_GITHUB_AUTH=true
ENABLE_EMAIL_NOTIFICATIONS=true
ENABLE_SLACK_INTEGRATION=true
ENABLE_JIRA_INTEGRATION=true

# ====================
# API Keys & Integrations
# ====================
SLACK_CLIENT_ID=your-slack-client-id
SLACK_CLIENT_SECRET=your-slack-client-secret
SLACK_SIGNING_SECRET=your-slack-signing-secret

JIRA_BASE_URL=your-jira-base-url
JIRA_USERNAME=your-jira-username
JIRA_API_TOKEN=your-jira-api-token

GITHUB_APP_ID=your-github-app-id
GITHUB_APP_PRIVATE_KEY=your-github-app-private-key
GITHUB_WEBHOOK_SECRET=your-github-webhook-secret

# ====================
# Production Settings
# ====================
DEBUG=false
LOG_LEVEL=info
NODE_TLS_REJECT_UNAUTHORIZED=1

# ====================
# Docker & Deployment
# ====================
CONTAINER_PORT=3000
HEALTH_CHECK_PATH=/api/health
READY_CHECK_PATH=/api/ready
EOL
    echo -e "${GREEN}Created .env.production${NC}"
fi

echo -e "${GREEN}Environment setup complete!${NC}"
echo -e "${YELLOW}Please review and update the environment files with your specific values.${NC}"
echo -e "${YELLOW}For development: .env.local${NC}"
echo -e "${YELLOW}For production: .env.production${NC}" 