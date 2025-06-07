const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const ENV_FILES = {
  development: {
    path: '.env.development',
    content: `# Phase Platform - Development Environment
NODE_ENV=development
APP_NAME="Phase Platform"
APP_URL=http://localhost:3000
API_URL=http://localhost:3001

# Database Configuration
POSTGRES_USER=phase_user
POSTGRES_PASSWORD=phase_password
POSTGRES_DB=phase_platform_dev
DATABASE_URL="postgresql://phase_user:phase_password@postgres:5432/phase_platform_dev"

# Redis Configuration
REDIS_URL="redis://redis:6379"
REDIS_PASSWORD=""

# MinIO Configuration (Development S3)
AWS_ACCESS_KEY_ID=minioadmin
AWS_SECRET_ACCESS_KEY=minioadmin123
AWS_REGION=us-east-1
S3_BUCKET_NAME=phase-platform-files
S3_PUBLIC_URL=http://localhost:9000

# Email Configuration (Mailhog)
SMTP_HOST=mailhog
SMTP_PORT=1025
SMTP_SECURE=false
FROM_EMAIL="noreply@phaseplatform.com"
FROM_NAME="Phase Platform"

# Development Settings
DEBUG=true
LOG_LEVEL="debug"
NODE_TLS_REJECT_UNAUTHORIZED=0

# Container Settings
CONTAINER_PORT=3000
HEALTH_CHECK_PATH="/api/health"
READY_CHECK_PATH="/api/ready"`,
  },
  production: {
    path: '.env.production',
    content: `# Phase Platform - Production Environment
NODE_ENV=production
APP_NAME="Phase Platform"
APP_URL=https://your-domain.com
API_URL=https://api.your-domain.com

# Database Configuration
POSTGRES_USER=phase_user
POSTGRES_PASSWORD=change_this_password
POSTGRES_DB=phase_platform
DATABASE_URL="postgresql://phase_user:change_this_password@postgres:5432/phase_platform"

# Redis Configuration
REDIS_URL="redis://redis:6379"
REDIS_PASSWORD=change_this_redis_password

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your-bucket-name
S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com

# Email Configuration
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=true
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
FROM_EMAIL="noreply@your-domain.com"
FROM_NAME="Phase Platform"

# Production Settings
DEBUG=false
LOG_LEVEL="info"

# Container Settings
CONTAINER_PORT=3000
HEALTH_CHECK_PATH="/api/health"
READY_CHECK_PATH="/api/ready"

# Generate a random secret for NextAuth
NEXTAUTH_SECRET=your-nextauth-secret-key-here`,
  },
};

function createEnvFile(filePath, content) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, content);
    console.log(`Created ${filePath}`);
  } else {
    console.log(`${filePath} already exists`);
  }
}

function setupEnvironment() {
  console.log('Setting up Phase Platform environment...\n');

  // Create environment files
  Object.values(ENV_FILES).forEach(({ path: filePath, content }) => {
    createEnvFile(filePath, content);
  });

  // Create .env from development by default
  if (!fs.existsSync('.env')) {
    fs.copyFileSync('.env.development', '.env');
    console.log('Created .env from .env.development');
  }

  // Install dependencies
  console.log('\nInstalling dependencies...');
  try {
    execSync('pnpm install', { stdio: 'inherit' });
  } catch (error) {
    console.error('Error installing dependencies:', error.message);
    process.exit(1);
  }

  console.log('\nEnvironment setup complete!');
  console.log(
    'Please review and update the environment files with your specific values:'
  );
  console.log('- For development: .env.development');
  console.log('- For production: .env.production');
}

setupEnvironment();
