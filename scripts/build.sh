#!/bin/bash

# Build script for the monorepo
# This script builds all applications and packages

set -e

echo "🏗️ Building the monorepo..."

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

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root directory of the project"
    exit 1
fi

# Parse command line arguments
PRODUCTION=false
SKIP_TESTS=false
SKIP_LINT=false

while [[ $# -gt 0 ]]; do
    case $1 in
        --production)
            PRODUCTION=true
            shift
            ;;
        --skip-tests)
            SKIP_TESTS=true
            shift
            ;;
        --skip-lint)
            SKIP_LINT=true
            shift
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Usage: $0 [--production] [--skip-tests] [--skip-lint]"
            exit 1
            ;;
    esac
done

# Set NODE_ENV
if [ "$PRODUCTION" = true ]; then
    export NODE_ENV=production
    print_status "Building for production..."
else
    export NODE_ENV=development
    print_status "Building for development..."
fi

# Clean previous builds
print_status "Cleaning previous builds..."
npm run clean || true

# Install dependencies
print_status "Installing dependencies..."
npm ci

# Lint code (unless skipped)
if [ "$SKIP_LINT" = false ]; then
    print_status "Linting code..."
    npm run lint || {
        print_error "Linting failed"
        exit 1
    }
fi

# Type checking
print_status "Running type check..."
npm run type-check || {
    print_error "Type checking failed"
    exit 1
}

# Run tests (unless skipped)
if [ "$SKIP_TESTS" = false ]; then
    print_status "Running tests..."
    npm run test || {
        print_error "Tests failed"
        exit 1
    }
fi

# Build packages first
print_status "Building shared packages..."

# Build UI components
if [ -d "packages/ui" ]; then
    print_status "Building UI package..."
    cd packages/ui
    npm run build
    cd ../..
    print_success "UI package built successfully"
fi

# Build shared utilities
if [ -d "packages/shared" ]; then
    print_status "Building shared package..."
    cd packages/shared
    npm run build
    cd ../..
    print_success "Shared package built successfully"
fi

# Build database package
if [ -d "packages/database" ]; then
    print_status "Building database package..."
    cd packages/database
    npm run build
    cd ../..
    print_success "Database package built successfully"
fi

# Build applications
print_status "Building applications..."

# Build web application
if [ -d "apps/web" ]; then
    print_status "Building web application..."
    cd apps/web
    npm run build
    cd ../..
    print_success "Web application built successfully"
fi

# Build API application
if [ -d "apps/api" ]; then
    print_status "Building API application..."
    cd apps/api
    npm run build
    cd ../..
    print_success "API application built successfully"
fi

# Build mobile application
if [ -d "apps/mobile" ]; then
    print_status "Building mobile application..."
    cd apps/mobile
    npm run build
    cd ../..
    print_success "Mobile application built successfully"
fi

# Generate build info
print_status "Generating build information..."
BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
BUILD_HASH=$(git rev-parse --short HEAD 2>/dev/null || echo "unknown")
BUILD_BRANCH=$(git rev-parse --abbrev-ref HEAD 2>/dev/null || echo "unknown")

cat > build-info.json << EOF
{
  "buildTime": "$BUILD_TIME",
  "buildHash": "$BUILD_HASH",
  "buildBranch": "$BUILD_BRANCH",
  "nodeEnv": "$NODE_ENV",
  "production": $PRODUCTION
}
EOF

print_success "Build information generated"

# Create deployment archive (if production)
if [ "$PRODUCTION" = true ]; then
    print_status "Creating deployment archive..."
    tar -czf "deployment-$(date +%Y%m%d-%H%M%S).tar.gz" \
        --exclude="node_modules" \
        --exclude=".git" \
        --exclude="*.log" \
        --exclude=".env*" \
        apps/ packages/ package.json package-lock.json build-info.json
    print_success "Deployment archive created"
fi

print_success "🎉 Build completed successfully!"

if [ "$PRODUCTION" = true ]; then
    print_status "Production build artifacts:"
    print_status "- Web app: apps/web/.next/"
    print_status "- API: apps/api/dist/ (if available)"
    print_status "- Packages: packages/*/dist/"
    print_status "- Build info: build-info.json"
fi