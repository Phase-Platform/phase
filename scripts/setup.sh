#!/bin/bash

# Setup script for the monorepo
# This script sets up the development environment

set -e

echo "🔧 Setting up the development environment..."

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

# Check Node.js version
NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    print_error "Node.js version 18 or higher is required. Current version: $(node --version)"
    exit 1
fi

print_success "Node.js version check passed: $(node --version)"

# Check npm version
NPM_VERSION=$(npm --version | cut -d'.' -f1)
if [ "$NPM_VERSION" -lt 8 ]; then
    print_warning "npm version 8 or higher is recommended. Current version: $(npm --version)"
fi

# Install dependencies
print_status "Installing dependencies..."
npm install

# Set up environment files
print_status "Setting up environment files..."

# Web app environment
if [ ! -f "apps/web/.env.local" ]; then
    cp apps/web/.env.example apps/web/.env.local 2>/dev/null || {
        print_status "Creating web app environment file..."
        cat > apps/web/.env.local << EOF
# Web App Environment Variables
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_APP_NAME=MyApp
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
EOF
    }
    print_success "Web app environment file created"
fi

# API environment (if exists)
if [ -d "apps/api" ] && [ ! -f "apps/api/.env" ]; then
    cp apps/api/.env.example apps/api/.env 2>/dev/null || {
        print_status "Creating API environment file..."
        cat > apps/api/.env << EOF
# API Environment Variables
PORT=3001
DATABASE_URL=postgresql://user:password@localhost:5432/myapp
JWT_SECRET=your-jwt-secret-here
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
EOF
    }
    print_success "API environment file created"
fi

# Database setup
print_status "Setting up database..."

# Check if Docker is available
if command -v docker &> /dev/null; then
    print_status "Docker found. Setting up database with Docker Compose..."
    
    # Create docker-compose.yml if it doesn't exist
    if [ ! -f "docker-compose.yml" ]; then
        print_status "Creating docker-compose.yml..."
        cat > docker-compose.yml << EOF
version: '3.8'
services:
  db:
    image: postgres:15
    restart: always
    environment:
      POSTGRES_DB: myapp
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./docker/init-db.sql:/docker-entrypoint-initdb.d/init-db.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U user -d myapp"]
      interval: 30s
      timeout: 10s
      retries: 3

  redis:
    image: redis:7-alpine
    restart: always
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  postgres_data:
  redis_data:
EOF
        print_success "docker-compose.yml created"
    fi
    
    # Start the database
    docker-compose up -d db
    print_status "Waiting for database to be ready..."
    
    # Wait for database to be ready
    for i in {1..30}; do
        if docker-compose exec -T db pg_isready -U user -d myapp &> /dev/null; then
            print_success "Database is ready!"
            break
        fi
        if [ $i -eq 30 ]; then
            print_error "Database failed to start after 30 attempts"
            exit 1
        fi
        sleep 2
    done
    
else
    print_warning "Docker not found. Please install Docker or set up PostgreSQL manually."
    print_status "Database connection string: postgresql://user:password@localhost:5432/myapp"
fi

# Run database migrations
if [ -f "packages/database/migrations" ] || [ -f "prisma/schema.prisma" ]; then
    print_status "Running database migrations..."
    npm run db:migrate || print_warning "No database migrations found or migration failed"
fi

# Generate Prisma client (if using Prisma)
if [ -f "prisma/schema.prisma" ]; then
    print_status "Generating Prisma client..."
    npx prisma generate
fi

# Set up Git hooks (if using husky)
if [ -f ".husky" ] || grep -q "husky" package.json; then
    print_status "Setting up Git hooks..."
    npx husky install || print_warning "Failed to set up Git hooks"
fi

# Build packages
print_status "Building packages..."
npm run build:packages || print_warning "Failed to build packages"

# Run initial tests
print_status "Running initial tests..."
npm run test -- --passWithNoTests || print_warning "Some tests failed"

# Create necessary directories
print_status "Creating necessary directories..."
mkdir -p logs
mkdir -p uploads
mkdir -p temp

# Set up development tools
print_status "Setting up development tools..."

# Install global tools if needed
GLOBAL_TOOLS=("@storybook/cli" "prisma" "tsx")
for tool in "${GLOBAL_TOOLS[@]}"; do
    if ! npm list -g "$tool" &> /dev/null; then
        print_status "Installing global tool: $tool"
        npm install -g "$tool" || print_warning "Failed to install $tool globally"
    fi
done

# Generate SSL certificates for local development (optional)
if command -v openssl &> /dev/null; then
    if [ ! -f "certs/localhost.crt" ]; then
        print_status "Generating SSL certificates for local development..."
        mkdir -p certs
        openssl req -x509 -newkey rsa:4096 -keyout certs/localhost.key -out certs/localhost.crt -days 365 -nodes -subj "/C=US/ST=State/L=City/O=Organization/CN=localhost"
        print_success "SSL certificates generated"
    fi
fi

# Create helpful development scripts
print_status "Creating development shortcuts..."

# Create a quick start script
cat > quick-start.sh << 'EOF'
#!/bin/bash
echo "🚀 Quick starting development environment..."
docker-compose up -d && npm run dev
EOF
chmod +x quick-start.sh

# Create a reset script reference
cat > reset.sh << 'EOF'
#!/bin/bash
echo "🔄 Resetting development environment..."
./scripts/reset-dev.sh
EOF
chmod +x reset.sh

print_success "Development shortcuts created"

# Final checks
print_status "Running final checks..."

# Check if all required files exist
REQUIRED_FILES=("package.json" "tsconfig.json" "apps/web/package.json")
for file in "${REQUIRED_FILES[@]}"; do
    if [ ! -f "$file" ]; then
        print_error "Required file missing: $file"
        exit 1
    fi
done

print_success "All required files are present"

# Print setup summary
print_success "🎉 Setup completed successfully!"
echo ""
print_status "Next steps:"
print_status "1. Review and update environment variables in:"
print_status "   - apps/web/.env.local"
[ -f "apps/api/.env" ] && print_status "   - apps/api/.env"
echo ""
print_status "2. Start the development environment:"
print_status "   npm run dev"
print_status "   or"
print_status "   ./scripts/dev.sh"
echo ""
print_status "3. Access your applications:"
print_status "   - Web app: http://localhost:3000"
print_status "   - API: http://localhost:3001 (if available)"
print_status "   - Database: postgresql://user:password@localhost:5432/myapp"
echo ""
print_status "For more commands, check package.json scripts section"

# Save setup info
cat > setup-info.json << EOF
{
  "setupDate": "$(date -u +"%Y-%m-%dT%H:%M:%SZ")",
  "nodeVersion": "$(node --version)",
  "npmVersion": "$(npm --version)",
  "dockerAvailable": $(command -v docker &> /dev/null && echo "true" || echo "false"),
  "databaseSetup": $([ -f "docker-compose.yml" ] && echo "true" || echo "false")
}
EOF

print_success "Setup information saved to setup-info.json"