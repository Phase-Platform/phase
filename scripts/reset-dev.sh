#!/bin/bash

# Reset development environment script
# This script resets the development environment to a clean state

set -e

echo "🔄 Resetting development environment..."

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

# Parse command line arguments
HARD_RESET=false
KEEP_DB=false
KEEP_ENV=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --hard)
            HARD_RESET=true
            shift
            ;;
        --keep-db)
            KEEP_DB=true
            shift
            ;;
        --keep-env)
            KEEP_ENV=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --hard      Perform hard reset (removes all generated files)"
            echo "  --keep-db   Keep database data"
            echo "  --keep-env  Keep environment files"
            echo "  --help      Show this help message"
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root directory of the project"
    exit 1
fi

# Confirmation prompt for hard reset
if [ "$HARD_RESET" = true ]; then
    print_warning "This will perform a HARD RESET and remove:"
    print_warning "- All node_modules"
    print_warning "- All build artifacts"
    print_warning "- All cache files"
    [ "$KEEP_DB" = false ] && print_warning "- Database data"
    [ "$KEEP_ENV" = false ] && print_warning "- Environment files"
    echo ""
    read -p "Are you sure you want to continue? (y/N): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Reset cancelled"
        exit 0
    fi
fi

# Stop running processes
print_status "Stopping running processes..."
pkill -f "next dev" || true
pkill -f "npm run dev" || true
pkill -f "node.*dev" || true

# Stop Docker containers
if command -v docker-compose &> /dev/null; then
    print_status "Stopping Docker containers..."
    docker-compose down || true
fi

# Clean npm cache
print_status "Cleaning npm cache..."
npm cache clean --force

# Remove node_modules
print_status "Removing node_modules..."
find . -name "node_modules" -type d -prune -exec rm -rf {} +

# Remove package-lock files
print_status "Removing lock files..."
find . -name "package-lock.json" -type f -delete
find . -name "yarn.lock" -type f -delete
find . -name "pnpm-lock.yaml" -type f -delete

# Remove build artifacts
print_status "Removing build artifacts..."
find . -name "dist" -type d -prune -exec rm -rf {} +
find . -name "build" -type d -prune -exec rm -rf {} +
find . -name ".next" -type d -prune -exec rm -rf {} +
find . -name ".nuxt" -type d -prune -exec rm -rf {} +
find . -name "out" -type d -prune -exec rm -rf {} +

# Remove cache directories
print_status "Removing cache directories..."
find . -name ".cache" -type d -prune -exec rm -rf {} +
find . -name ".parcel-cache" -type d -prune -exec rm -rf {} +
find . -name ".turbo" -type d -prune -exec rm -rf {} +
rm -rf .eslintcache

# Remove coverage reports
print_status "Removing coverage reports..."
find . -name "coverage" -type d -prune -exec rm -rf {} +
find . -name ".nyc_output" -type d -prune -exec rm -rf {} +

# Remove TypeScript build info
print_status "Removing TypeScript build info..."
find . -name "*.tsbuildinfo" -type f -delete
find . -name "tsconfig.tsbuildinfo" -type f -delete

# Remove Storybook build
print_status "Removing Storybook artifacts..."
find . -name "storybook-static" -type d -prune -exec rm -rf {} +

# Remove logs
print_status "Removing log files..."
find . -name "*.log" -type f -delete
find . -name "logs" -type d -prune -exec rm -rf {} +
rm -rf npm-debug.log*
rm -rf yarn-debug.log*
rm -rf yarn-error.log*

# Remove temporary files
print_status "Removing temporary files..."
find . -name "temp" -type d -prune -exec rm -rf {} +
find . -name "tmp" -type d -prune -exec rm -rf {} +
find . -name "*.tmp" -type f -delete

# Hard reset specific actions
if [ "$HARD_RESET" = true ]; then
    print_status "Performing hard reset actions..."
    
    # Remove generated files
    rm -f build-info.json
    rm -f setup-info.json
    rm -f deployment-*.tar.gz
    
    # Remove SSL certificates
    rm -rf certs/
    
    # Remove database data (if not keeping)
    if [ "$KEEP_DB" = false ]; then
        print_status "Removing database data..."
        if command -v docker-compose &> /dev/null; then
            docker-compose down -v || true
        fi
        rm -rf pgdata/
        rm -rf mysql-data/
    fi
    
    # Remove environment files (if not keeping)
    if [ "$KEEP_ENV" = false ]; then
        print_status "Removing environment files..."
        find . -name ".env.local" -type f -delete
        find . -name ".env.development" -type f -delete
        find . -name ".env.test" -type f -delete
    fi
    
    # Reset Git (be very careful)
    if [ -d ".git" ]; then
        print_status "Cleaning Git state..."
        git clean -fd || true
        git reset --hard HEAD || true
    fi
fi

# Reinstall dependencies
print_status "Reinstalling dependencies..."
npm install

# Rebuild packages
print_status "Rebuilding packages..."
npm run build:packages || print_warning "Failed to build packages"

# Reset database (if keeping database but need to reset schema)
if [ "$KEEP_DB" = false ] || [ "$HARD_RESET" = true ]; then
    print_status "Setting up fresh database..."
    
    # Start database
    if command -v docker-compose &> /dev/null; then
        docker-compose up -d db
        sleep 5
    fi
    
    # Run migrations
    npm run db:migrate || print_warning "No database migrations to run"
    
    # Seed database
    npm run db:seed || print_warning "No database seeds to run"
fi

# Generate Prisma client (if using Prisma)
if [ -f "prisma/schema.prisma" ]; then
    print_status "Generating Prisma client..."
    npx prisma generate
fi

# Clear Next.js cache
if [ -d "apps/web" ]; then
    print_status "Clearing Next.js cache..."
    cd apps/web
    rm -rf .next
    cd ../..
fi

# Run health check
print_status "Running health check..."
npm run lint || print_warning "Linting issues found"
npm run type-check || print_warning "Type checking issues found"

# Create fresh development directories
print_status "Creating development directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p temp

print_success "🎉 Development environment reset completed!"

echo ""
print_status "Summary of reset actions:"
print_status "✅ Removed all node_modules"
print_status "✅ Removed all build artifacts"
print_status "✅ Cleared all caches"
print_status "✅ Reinstalled dependencies"

if [ "$HARD_RESET" = true ]; then
    print_status "✅ Performed hard reset"
    [ "$KEEP_DB" = false ] && print_status "✅ Reset database"
    [ "$KEEP_ENV" = false ] && print_status "✅ Removed environment files"
fi

echo ""
print_status "Next steps:"
print_status "1. Update environment variables if needed"
print_status "2. Start development: npm run dev"
print_status "3. Run tests: npm test"

# Save reset info
cat > reset-info.json << EOF
{
  "resetDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "hardReset": $HARD_RESET,
  "keptDatabase": $KEEP_DB,
  "keptEnvironment": $KEEP_ENV,
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)"
}
EOF

print_success "Reset information saved to reset-info.json"