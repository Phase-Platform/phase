@echo off
echo 🚀 Starting Phase Platform Docker containers...

REM Check if .env.local exists
if not exist .env.local (
    echo Error: .env.local file not found!
    echo Creating .env.local with default development values...
    
    (
        echo # Database Configuration
        echo POSTGRES_DB=phase_platform
        echo POSTGRES_USER=phase_user
        echo POSTGRES_PASSWORD=phase_password
        echo.
        echo # Redis Configuration
        echo REDIS_PASSWORD=phase_redis_password
        echo.
        echo # MinIO/S3 Configuration
        echo AWS_ACCESS_KEY_ID=minioadmin
        echo AWS_SECRET_ACCESS_KEY=minioadmin
    ) > .env.local
    
    echo Created .env.local with default values
)

REM Check if Docker is running
docker info > nul 2>&1
if errorlevel 1 (
    echo Error: Docker is not running!
    echo Please start Docker Desktop and try again.
    exit /b 1
)

REM Stop any existing containers
echo Stopping any existing containers...
docker-compose --env-file .env.local -f docker-compose.dev.yml down

REM Start the containers
echo Starting containers...
docker-compose --env-file .env.local -f docker-compose.dev.yml up -d

REM Check if containers started successfully
if errorlevel 1 (
    echo ❌ Failed to start Docker containers
    exit /b 1
) else (
    echo ✅ Docker containers started successfully!
    echo.
    echo Services available at:
    echo.
    echo [Database Services]
    echo - PostgreSQL: localhost:5432
    echo   Database: phase_platform
    echo   Username: phase_user
    echo   Password: phase_password
    echo.
    echo - Redis: localhost:6379
    echo   Password: phase_redis_password
    echo.
    echo [Web Interfaces - Click to open in browser]
    echo.
    echo - Mailhog: 
    echo   - SMTP: http://localhost:1025
    echo   - Web UI: http://localhost:8025
    echo - MinIO:
    echo   - API: http://localhost:9000
    echo   - Console: http://localhost:9001
    echo - Adminer: http://localhost:8080
    echo - Redis Commander: http://localhost:8081
    echo.
    echo Note: Hold Ctrl and click on any URL to open in your default browser
) 