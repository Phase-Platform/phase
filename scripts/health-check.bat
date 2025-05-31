@echo off
echo 🏥 Starting system health check...

:: Check if Docker is running
docker info > nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running!
    exit /b 1
)

:: Check PostgreSQL
echo Checking PostgreSQL...
docker exec phase-platform-postgres-dev pg_isready -U phase_user -d phase_dev
if %errorlevel% equ 0 (
    echo ✅ PostgreSQL is healthy
) else (
    echo ❌ PostgreSQL is not responding
)

:: Check Redis
echo Checking Redis...
docker exec phase-platform-redis-dev redis-cli -a pkIlv/rtqkskHtat7wvFkw== ping
if %errorlevel% equ 0 (
    echo ✅ Redis is healthy
) else (
    echo ❌ Redis is not responding
)

:: Check MinIO
echo Checking MinIO...
curl -s http://localhost:9000/minio/health/live > nul
if %errorlevel% equ 0 (
    echo ✅ MinIO is healthy
) else (
    echo ❌ MinIO is not responding
)

:: Check Mailhog
echo Checking Mailhog...
curl -s http://localhost:8025/api/v2/messages > nul
if %errorlevel% equ 0 (
    echo ✅ Mailhog is healthy
) else (
    echo ❌ Mailhog is not responding
)

:: Check Adminer
echo Checking Adminer...
curl -s http://localhost:8080 > nul
if %errorlevel% equ 0 (
    echo ✅ Adminer is healthy
) else (
    echo ❌ Adminer is not responding
)

:: Check Redis Commander
echo Checking Redis Commander...
curl -s http://localhost:8081 > nul
if %errorlevel% equ 0 (
    echo ✅ Redis Commander is healthy
) else (
    echo ❌ Redis Commander is not responding
)

echo.
echo 📊 Service Status:
echo -----------------
echo PostgreSQL: http://localhost:5432
echo Redis: localhost:6379
echo MinIO Console: http://localhost:9001
echo Adminer: http://localhost:8080
echo Redis Commander: http://localhost:8081
echo Mailhog: http://localhost:8025
echo.
echo ✅ Health check complete! 