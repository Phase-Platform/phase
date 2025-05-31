@echo off
echo Setting up Phase Platform environment...

REM Create .env.development if it doesn't exist
if not exist .env.development (
    echo Creating .env.development...
    (
        echo # Phase Platform - Development Environment
        echo NODE_ENV=development
        echo APP_NAME="Phase Platform"
        echo APP_URL=http://localhost:3000
        echo API_URL=http://localhost:3001
        echo.
        echo # Database Configuration
        echo POSTGRES_USER=phase_user
        echo POSTGRES_PASSWORD=phase_password
        echo POSTGRES_DB=phase_platform_dev
        echo DATABASE_URL="postgresql://phase_user:phase_password@postgres:5432/phase_platform_dev"
        echo.
        echo # Redis Configuration
        echo REDIS_URL="redis://redis:6379"
        echo REDIS_PASSWORD=""
        echo.
        echo # MinIO Configuration (Development S3)
        echo AWS_ACCESS_KEY_ID=minioadmin
        echo AWS_SECRET_ACCESS_KEY=minioadmin123
        echo AWS_REGION=us-east-1
        echo S3_BUCKET_NAME=phase-platform-files
        echo S3_PUBLIC_URL=http://localhost:9000
        echo.
        echo # Email Configuration (Mailhog)
        echo SMTP_HOST=mailhog
        echo SMTP_PORT=1025
        echo SMTP_SECURE=false
        echo FROM_EMAIL="noreply@phaseplatform.com"
        echo FROM_NAME="Phase Platform"
        echo.
        echo # Development Settings
        echo DEBUG=true
        echo LOG_LEVEL="debug"
        echo NODE_TLS_REJECT_UNAUTHORIZED=0
        echo.
        echo # Container Settings
        echo CONTAINER_PORT=3000
        echo HEALTH_CHECK_PATH="/api/health"
        echo READY_CHECK_PATH="/api/ready"
    ) > .env.development
    echo Created .env.development
)

REM Create .env.production if it doesn't exist
if not exist .env.production (
    echo Creating .env.production...
    (
        echo # Phase Platform - Production Environment
        echo NODE_ENV=production
        echo APP_NAME="Phase Platform"
        echo APP_URL=https://your-domain.com
        echo API_URL=https://api.your-domain.com
        echo.
        echo # Database Configuration
        echo POSTGRES_USER=phase_user
        echo POSTGRES_PASSWORD=change_this_password
        echo POSTGRES_DB=phase_platform
        echo DATABASE_URL="postgresql://phase_user:change_this_password@postgres:5432/phase_platform"
        echo.
        echo # Redis Configuration
        echo REDIS_URL="redis://redis:6379"
        echo REDIS_PASSWORD=change_this_redis_password
        echo.
        echo # AWS S3 Configuration
        echo AWS_ACCESS_KEY_ID=your_aws_access_key
        echo AWS_SECRET_ACCESS_KEY=your_aws_secret_key
        echo AWS_REGION=us-east-1
        echo S3_BUCKET_NAME=your-bucket-name
        echo S3_PUBLIC_URL=https://your-bucket.s3.amazonaws.com
        echo.
        echo # Email Configuration
        echo SMTP_HOST=smtp.gmail.com
        echo SMTP_PORT=587
        echo SMTP_SECURE=true
        echo SMTP_USER=your-email@gmail.com
        echo SMTP_PASSWORD=your-app-password
        echo FROM_EMAIL="noreply@your-domain.com"
        echo FROM_NAME="Phase Platform"
        echo.
        echo # Production Settings
        echo DEBUG=false
        echo LOG_LEVEL="info"
        echo.
        echo # Container Settings
        echo CONTAINER_PORT=3000
        echo HEALTH_CHECK_PATH="/api/health"
        echo READY_CHECK_PATH="/api/ready"
        echo.
        echo # Generate a random secret for NextAuth
        echo NEXTAUTH_SECRET=your-nextauth-secret-key-here
    ) > .env.production
    echo Created .env.production
)

REM Create .env if it doesn't exist (copy from development by default)
if not exist .env (
    echo Creating .env from .env.development...
    copy .env.development .env
    echo Created .env
)

echo Environment setup complete!
echo Please review and update the environment files with your specific values.
echo For development: .env.development
echo For production: .env.production 