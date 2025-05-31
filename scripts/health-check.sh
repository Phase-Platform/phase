#!/bin/bash
# Health check script for application and services
# This script checks the health of various system components
set -e

echo "🏥 Starting system health check..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Health check configuration from environment variables
HEALTH_CHECK_URL="${HEALTH_CHECK_URL:-http://localhost:3000/health}"
DATABASE_URL="${DATABASE_URL:-postgresql://${POSTGRES_USER:-phase_user}:${POSTGRES_PASSWORD:-phase_password}@${POSTGRES_HOST:-localhost}:${POSTGRES_PORT:-5432}/${POSTGRES_DB:-phase_dev}}"
REDIS_URL="${REDIS_URL:-redis://${REDIS_HOST:-localhost}:${REDIS_PORT:-6379}}"
CHECK_TIMEOUT="${HEALTH_CHECK_TIMEOUT:-10}"
CRITICAL_DISK_USAGE="${CRITICAL_DISK_USAGE:-90}"
WARNING_DISK_USAGE="${WARNING_DISK_USAGE:-80}"
CRITICAL_MEMORY_USAGE="${CRITICAL_MEMORY_USAGE:-90}"
WARNING_MEMORY_USAGE="${WARNING_MEMORY_USAGE:-80}"
CRITICAL_CPU_USAGE="${CRITICAL_CPU_USAGE:-90}"
WARNING_CPU_USAGE="${WARNING_CPU_USAGE:-80}"

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_critical() {
    echo -e "${PURPLE}[CRITICAL]${NC} $1"
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --url)
            HEALTH_CHECK_URL="$2"
            shift 2
            ;;
        --db-url)
            DATABASE_URL="$2"
            shift 2
            ;;
        --redis-url)
            REDIS_URL="$2"
            shift 2
            ;;
        --timeout)
            CHECK_TIMEOUT="$2"
            shift 2
            ;;
        --critical-disk)
            CRITICAL_DISK_USAGE="$2"
            shift 2
            ;;
        --warning-disk)
            WARNING_DISK_USAGE="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --url <url>            Health check URL (default: ${HEALTH_CHECK_URL})"
            echo "  --db-url <url>         Database URL (default: ${DATABASE_URL})"
            echo "  --redis-url <url>      Redis URL (default: ${REDIS_URL})"
            echo "  --timeout <seconds>    Request timeout (default: ${CHECK_TIMEOUT})"
            echo "  --critical-disk <n>    Critical disk usage % (default: ${CRITICAL_DISK_USAGE})"
            echo "  --warning-disk <n>     Warning disk usage % (default: ${WARNING_DISK_USAGE})"
            echo "  --help                 Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Global variables for health status
OVERALL_STATUS="HEALTHY"
HEALTH_ISSUES=()

# Function to update overall status
update_status() {
    local status="$1"
    local message="$2"
    
    case $status in
        "WARNING")
            if [ "$OVERALL_STATUS" = "HEALTHY" ]; then
                OVERALL_STATUS="WARNING"
            fi
            HEALTH_ISSUES+=("⚠️  $message")
            ;;
        "CRITICAL"|"ERROR")
            OVERALL_STATUS="CRITICAL"
            HEALTH_ISSUES+=("❌ $message")
            ;;
    esac
}

# Check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check application health endpoint
check_application_health() {
    print_status "Checking application health endpoint..."
    
    if command_exists curl; then
        local response=$(curl -s -w "%{http_code}" --max-time $CHECK_TIMEOUT "$HEALTH_CHECK_URL" 2>/dev/null)
        local http_code="${response: -3}"
        local body="${response%???}"
        
        if [ "$http_code" = "200" ]; then
            print_success "Application health endpoint is responding (HTTP $http_code)"
            if echo "$body" | grep -q "healthy\|ok\|success"; then
                print_success "Application reports healthy status"
            fi
        else
            print_error "Application health endpoint returned HTTP $http_code"
            update_status "CRITICAL" "Application health check failed (HTTP $http_code)"
        fi
    else
        print_warning "curl not available, skipping HTTP health check"
        update_status "WARNING" "Could not check application endpoint (curl not available)"
    fi
}

# Check database connectivity
check_database() {
    print_status "Checking database connectivity..."
    
    if command_exists psql; then
        if PGPASSWORD="${POSTGRES_PASSWORD:-phase_password}" echo "SELECT 1;" | psql "$DATABASE_URL" >/dev/null 2>&1; then
            print_success "Database connection successful"
        else
            print_error "Database connection failed"
            update_status "CRITICAL" "Database connection failed"
        fi
    elif command_exists pg_isready; then
        # Extract host and port from DATABASE_URL
        local db_host=$(echo "$DATABASE_URL" | sed -n 's/.*@\([^:]*\):.*/\1/p')
        local db_port=$(echo "$DATABASE_URL" | sed -n 's/.*:\([0-9]*\)\/.*/\1/p')
        
        if PGPASSWORD="${POSTGRES_PASSWORD:-phase_password}" pg_isready -h "$db_host" -p "$db_port" >/dev/null 2>&1; then
            print_success "Database server is ready"
        else
            print_error "Database server is not ready"
            update_status "CRITICAL" "Database server not ready"
        fi
    else
        print_warning "PostgreSQL client tools not available, skipping database check"
        update_status "WARNING" "Could not check database (PostgreSQL tools not available)"
    fi
}

# Check Redis connectivity
check_redis() {
    print_status "Checking Redis connectivity..."
    
    if command_exists redis-cli; then
        local redis_host=$(echo "$REDIS_URL" | sed -n 's/redis:\/\/\([^:]*\):.*/\1/p')
        local redis_port=$(echo "$REDIS_URL" | sed -n 's/.*:\([0-9]*\)$/\1/p')
        
        if redis-cli -h "$redis_host" -p "$redis_port" -a "${REDIS_PASSWORD:-pkIlv/rtqkskHtat7wvFkw==}" ping >/dev/null 2>&1; then
            print_success "Redis connection successful"
        else
            print_error "Redis connection failed"
            update_status "CRITICAL" "Redis connection failed"
        fi
    else
        print_warning "redis-cli not available, skipping Redis check"
        update_status "WARNING" "Could not check Redis (redis-cli not available)"
    fi
}

# Check system resources
check_system_resources() {
    print_status "Checking system resources..."
    
    # Check disk usage
    if command_exists df; then
        local disk_usage=$(df / | awk 'NR==2 {print int($5)}')
        if [ "$disk_usage" -ge "$CRITICAL_DISK_USAGE" ]; then
            print_critical "Disk usage critical: ${disk_usage}%"
            update_status "CRITICAL" "Disk usage critical (${disk_usage}%)"
        elif [ "$disk_usage" -ge "$WARNING_DISK_USAGE" ]; then
            print_warning "Disk usage high: ${disk_usage}%"
            update_status "WARNING" "Disk usage high (${disk_usage}%)"
        else
            print_success "Disk usage normal: ${disk_usage}%"
        fi
    fi
    
    # Check memory usage
    if command_exists free; then
        local memory_info=$(free | grep '^Mem:')
        local total_mem=$(echo $memory_info | awk '{print $2}')
        local used_mem=$(echo $memory_info | awk '{print $3}')
        local memory_usage=$((used_mem * 100 / total_mem))
        
        if [ "$memory_usage" -ge "$CRITICAL_MEMORY_USAGE" ]; then
            print_critical "Memory usage critical: ${memory_usage}%"
            update_status "CRITICAL" "Memory usage critical (${memory_usage}%)"
        elif [ "$memory_usage" -ge "$WARNING_MEMORY_USAGE" ]; then
            print_warning "Memory usage high: ${memory_usage}%"
            update_status "WARNING" "Memory usage high (${memory_usage}%)"
        else
            print_success "Memory usage normal: ${memory_usage}%"
        fi
    fi
    
    # Check CPU load
    if [ -f /proc/loadavg ]; then
        local load_avg=$(cat /proc/loadavg | awk '{print $1}')
        local cpu_cores=$(nproc 2>/dev/null || echo "1")
        local cpu_usage=$(echo "$load_avg $cpu_cores" | awk '{printf "%.0f", ($1/$2)*100}')
        
        if [ "$cpu_usage" -ge "$CRITICAL_CPU_USAGE" ]; then
            print_critical "CPU load critical: ${cpu_usage}% (load: $load_avg)"
            update_status "CRITICAL" "CPU load critical (${cpu_usage}%)"
        elif [ "$cpu_usage" -ge "$WARNING_CPU_USAGE" ]; then
            print_warning "CPU load high: ${cpu_usage}% (load: $load_avg)"
            update_status "WARNING" "CPU load high (${cpu_usage}%)"
        else
            print_success "CPU load normal: ${cpu_usage}% (load: $load_avg)"
        fi
    fi
}

# Check Docker containers (if using Docker)
check_docker_containers() {
    print_status "Checking Docker containers..."
    
    if command_exists docker; then
        local containers=$(docker ps --format "{{.Names}}" 2>/dev/null)
        if [ -n "$containers" ]; then
            print_success "Docker is running"
            echo "Running containers:"
            echo "$containers" | while read -r container; do
                local status=$(docker inspect --format='{{.State.Status}}' "$container" 2>/dev/null)
                if [ "$status" = "running" ]; then
                    echo -e "  ${GREEN}✓${NC} $container ($status)"
                else
                    echo -e "  ${RED}✗${NC} $container ($status)"
                    update_status "CRITICAL" "Container $container is not running"
                fi
            done
        else
            print_warning "No Docker containers running"
            update_status "WARNING" "No Docker containers running"
        fi
    else
        print_warning "Docker not available, skipping container check"
        update_status "WARNING" "Could not check Docker containers (Docker not available)"
    fi
}

# Main execution
echo "Starting health checks..."
check_application_health
check_database
check_redis
check_system_resources
check_docker_containers

# Print summary
echo -e "\n${BLUE}=== Health Check Summary ===${NC}"
echo -e "Overall Status: ${OVERALL_STATUS}"
if [ ${#HEALTH_ISSUES[@]} -gt 0 ]; then
    echo -e "\nIssues Found:"
    for issue in "${HEALTH_ISSUES[@]}"; do
        echo "  $issue"
    done
else
    echo -e "\n${GREEN}No issues found${NC}"
fi