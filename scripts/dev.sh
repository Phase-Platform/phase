#!/bin/bash

# Development script for the monorepo
# This script starts all development services

set -e

echo "🚀 Starting development environment..."

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

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root directory of the project"
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_warning "node_modules not found. Running npm install..."
    npm install
fi

# Start database if using Docker
if command -v docker &> /dev/null; then
    print_status "Starting database with Docker..."
    docker-compose up -d db
    
    # Wait for database to be ready
    print_status "Waiting for database to be ready..."
    sleep 5
else
    print_warning "Docker not found. Make sure your database is running manually."
fi

# Run database migrations
print_status "Running database migrations..."
npm run db:migrate || print_warning "Migration failed or no migrations to run"

# Start development servers
print_status "Starting development servers..."

# Function to handle cleanup on script exit
cleanup() {
    print_status "Cleaning up processes..."
    jobs -p | xargs -r kill
    exit 0
}

trap cleanup SIGINT SIGTERM

# Start the web app in development mode
print_status "Starting web application..."
npm run dev:web &

# Start the API server if it exists
if [ -d "apps/api" ]; then
    print_status "Starting API server..."
    npm run dev:api &
fi

# Start Storybook if it's configured
if [ -f "apps/web/.storybook/main.js" ] || [ -f "packages/ui/.storybook/main.js" ]; then
    print_status "Starting Storybook..."
    npm run storybook &
fi

print_status "Development environment is ready!"
print_status "Web app: http://localhost:3000"
print_status "API: http://localhost:3001 (if available)"
print_status "Storybook: http://localhost:6006 (if available)"
print_status ""
print_status "Press Ctrl+C to stop all services"

# Wait for all background processes
wait