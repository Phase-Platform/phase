#!/bin/bash
# Database backup script
# This script creates backups of the database
set -e

echo "💾 Creating database backup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
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

# Default configuration from environment variables
BACKUP_DIR="${BACKUP_DIR:-backups}"
DB_HOST="${POSTGRES_HOST:-localhost}"
DB_PORT="${POSTGRES_PORT:-5432}"
DB_NAME="${POSTGRES_DB:-phase_dev}"
DB_USER="${POSTGRES_USER:-phase_user}"
DB_PASSWORD="${POSTGRES_PASSWORD:-phase_password}"
BACKUP_TYPE="full"
COMPRESS=true
RETENTION_DAYS=30

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --host)
            DB_HOST="$2"
            shift 2
            ;;
        --port)
            DB_PORT="$2"
            shift 2
            ;;
        --database)
            DB_NAME="$2"
            shift 2
            ;;
        --user)
            DB_USER="$2"
            shift 2
            ;;
        --backup-dir)
            BACKUP_DIR="$2"
            shift 2
            ;;
        --type)
            BACKUP_TYPE="$2"
            shift 2
            ;;
        --no-compress)
            COMPRESS=false
            shift
            ;;
        --retention-days)
            RETENTION_DAYS="$2"
            shift 2
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --host <hostname>       Database host (default: ${POSTGRES_HOST:-localhost})"
            echo "  --port <port>          Database port (default: ${POSTGRES_PORT:-5432})"
            echo "  --database <dbname>    Database name (default: ${POSTGRES_DB:-phase_dev})"
            echo "  --user <username>      Database user (default: ${POSTGRES_USER:-phase_user})"
            echo "  --backup-dir <dir>     Backup directory (default: ${BACKUP_DIR:-backups})"
            echo "  --type <type>          Backup type: full, schema, data (default: full)"
            echo "  --no-compress          Don't compress backup files"
            echo "  --retention-days <n>   Keep backups for n days (default: 30)"
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

# Create backup directory
mkdir -p "$BACKUP_DIR"

# Generate backup filename with timestamp
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="${BACKUP_DIR}/${DB_NAME}_${BACKUP_TYPE}_${TIMESTAMP}"

# Check if we're using Docker
DOCKER_CONTAINER=""
if command -v docker-compose &> /dev/null; then
    # Check if database container is running
    if docker-compose ps postgres | grep -q "Up"; then
        DOCKER_CONTAINER=$(docker-compose ps -q postgres)
        print_status "Using Docker container for database backup"
    fi
fi

# Function to execute pg_dump command
execute_backup() {
    local cmd="$1"
    local output_file="$2"
    
    if [ -n "$DOCKER_CONTAINER" ]; then
        # Execute inside Docker container
        docker exec "$DOCKER_CONTAINER" sh -c "$cmd" > "$output_file"
    else
        # Execute directly on host
        PGPASSWORD="$DB_PASSWORD" eval "$cmd" > "$output_file"
    fi
}

# Build pg_dump command based on backup type
build_dump_command() {
    local base_cmd="pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER"
    
    case $BACKUP_TYPE in
        "full")
            echo "$base_cmd $DB_NAME"
            ;;
        "schema")
            echo "$base_cmd --schema-only $DB_NAME"
            ;;
        "data")
            echo "$base_cmd --data-only $DB_NAME"
            ;;
        *)
            print_error "Invalid backup type: $BACKUP_TYPE"
            exit 1
            ;;
    esac
}

# Check if required tools are available
check_dependencies() {
    if [ -z "$DOCKER_CONTAINER" ] && ! command -v pg_dump &> /dev/null; then
        print_error "pg_dump is not installed and no Docker container found"
        exit 1
    fi
    
    if [ "$COMPRESS" = true ] && ! command -v gzip &> /dev/null; then
        print_warning "gzip not found, disabling compression"
        COMPRESS=false
    fi
}

# Test database connection
test_connection() {
    print_status "Testing database connection..."
    
    local test_cmd
    if [ -n "$DOCKER_CONTAINER" ]; then
        test_cmd="docker exec $DOCKER_CONTAINER pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER"
    else
        test_cmd="PGPASSWORD=$DB_PASSWORD pg_isready -h $DB_HOST -p $DB_PORT -U $DB_USER"
    fi
    
    if ! $test_cmd &> /dev/null; then
        print_error "Cannot connect to database"
        exit 1
    fi
    
    print_success "Database connection successful"
}

# Perform backup
perform_backup() {
    print_status "Starting $BACKUP_TYPE backup of database '$DB_NAME'..."
    
    local dump_cmd=$(build_dump_command)
    local final_file="$BACKUP_FILE.sql"
    
    if [ "$COMPRESS" = true ]; then
        final_file="$BACKUP_FILE.sql.gz"
        execute_backup "$dump_cmd" "$BACKUP_FILE.sql"
        gzip "$BACKUP_FILE.sql"
    else
        execute_backup "$dump_cmd" "$final_file"
    fi
    
    # Check if backup was successful
    if [ $? -eq 0 ] && [ -f "$final_file" ]; then
        local file_size=$(du -h "$final_file" | cut -f1)
        print_success "Backup completed successfully: $final_file ($file_size)"
        
        # Create a symlink to latest backup
        local latest_link="${BACKUP_DIR}/${DB_NAME}_${BACKUP_TYPE}_latest"
        if [ "$COMPRESS" = true ]; then
            latest_link="${latest_link}.sql.gz"
        else
            latest_link="${latest_link}.sql"
        fi
        
        ln -sf "$(basename "$final_file")" "$latest_link"
        print_status "Created symlink: $latest_link"
    else
        print_error "Backup failed"
        exit 1
    fi
}

# Clean up old backups
cleanup_old_backups() {
    if [ "$RETENTION_DAYS" -gt 0 ]; then
        print_status "Cleaning up backups older than $RETENTION_DAYS days..."
        
        local deleted_count=0
        while IFS= read -r -d '' file; do
            rm "$file"
            deleted_count=$((deleted_count + 1))
        done < <(find "$BACKUP_DIR" -name "${DB_NAME}_${BACKUP_TYPE}_[0-9]*" -type f -mtime +$RETENTION_DAYS -print0)
        
        if [ $deleted_count -gt 0 ]; then
            print_status "Deleted $deleted_count old backup(s)"
        else
            print_status "No old backups to clean up"
        fi
    fi
}

# Create backup summary
create_backup_summary() {
    local summary_file="${BACKUP_DIR}/backup_summary.log"
    local backup_info="$(date): $BACKUP_TYPE backup of $DB_NAME completed"
    
    if [ -f "$final_file" ]; then
        local file_size=$(du -h "$final_file" | cut -f1)
        backup_info="$backup_info (Size: $file_size)"
    fi
    
    echo "$backup_info" >> "$summary_file"
    print_status "Backup summary logged to $summary_file"
}

# Main execution
check_dependencies
test_connection
perform_backup
cleanup_old_backups
create_backup_summary