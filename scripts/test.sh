#!/bin/bash

# Test script for the monorepo
# This script runs all tests across the monorepo

set -e

echo "🧪 Running tests across the monorepo..."

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
WATCH=false
COVERAGE=false
UPDATE_SNAPSHOTS=false
VERBOSE=false
SPECIFIC_PACKAGE=""

while [[ $# -gt 0 ]]; do
    case $1 in
        --watch)
            WATCH=true
            shift
            ;;
        --coverage)
            COVERAGE=true
            shift
            ;;
        --update-snapshots)
            UPDATE_SNAPSHOTS=true
            shift
            ;;
        --verbose)
            VERBOSE=true
            shift
            ;;
        --package)
            SPECIFIC_PACKAGE="$2"
            shift 2
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Usage: $0 [--watch] [--coverage] [--update-snapshots] [--verbose] [--package <package-name>]"
            exit 1
            ;;
    esac
done

# Check if we're in the root directory
if [ ! -f "package.json" ]; then
    print_error "Please run this script from the root directory of the project"
    exit 1
fi

# Function to run tests for a specific directory
run_tests() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        print_warning "Directory $dir does not exist, skipping..."
        return 0
    fi
    
    if [ ! -f "$dir/package.json" ]; then
        print_warning "No package.json found in $dir, skipping..."
        return 0
    fi
    
    # Check if the package has test scripts
    if ! grep -q '"test"' "$dir/package.json"; then
        print_warning "No test script found in $name, skipping..."
        return 0
    fi
    
    print_status "Running tests for $name..."
    cd "$dir"
    
    # Build test command
    local test_cmd="npm test"
    
    if [ "$WATCH" = true ]; then
        test_cmd="$test_cmd -- --watch"
    fi
    
    if [ "$COVERAGE" = true ]; then
        test_cmd="$test_cmd -- --coverage"
    fi
    
    if [ "$UPDATE_SNAPSHOTS" = true ]; then
        test_cmd="$test_cmd -- --updateSnapshot"
    fi
    
    if [ "$VERBOSE" = true ]; then
        test_cmd="$test_cmd -- --verbose"
    fi
    
    # Run the tests
    if eval "$test_cmd"; then
        print_success "$name tests passed"
        cd - > /dev/null
        return 0
    else
        print_error "$name tests failed"
        cd - > /dev/null
        return 1
    fi
}

# Function to run linting
run_lint() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        return 0
    fi
    
    if [ ! -f "$dir/package.json" ]; then
        return 0
    fi
    
    if grep -q '"lint"' "$dir/package.json"; then
        print_status "Running lint for $name..."
        cd "$dir"
        if npm run lint; then
            print_success "$name linting passed"
        else
            print_error "$name linting failed"
            cd - > /dev/null
            return 1
        fi
        cd - > /dev/null
    fi
    
    return 0
}

# Function to run type checking
run_type_check() {
    local dir=$1
    local name=$2
    
    if [ ! -d "$dir" ]; then
        return 0
    fi
    
    if [ ! -f "$dir/package.json" ]; then
        return 0
    fi
    
    if grep -q '"type-check"' "$dir/package.json"; then
        print_status "Running type check for $name..."
        cd "$dir"
        if npm run type-check; then
            print_success "$name type checking passed"
        else
            print_error "$name type checking failed"
            cd - > /dev/null
            return 1
        fi
        cd - > /dev/null
    fi
    
    return 0
}

# Initialize test results
FAILED_TESTS=()
PASSED_TESTS=()

# If specific package is provided, run tests only for that package
if [ -n "$SPECIFIC_PACKAGE" ]; then
    print_status "Running tests for specific package: $SPECIFIC_PACKAGE"
    
    # Check common locations for the package
    PACKAGE_DIRS=("apps/$SPECIFIC_PACKAGE" "packages/$SPECIFIC_PACKAGE" "$SPECIFIC_PACKAGE")
    
    for dir in "${PACKAGE_DIRS[@]}"; do
        if [ -d "$dir" ]; then
            if run_tests "$dir" "$SPECIFIC_PACKAGE"; then
                PASSED_TESTS+=("$SPECIFIC_PACKAGE")
            else
                FAILED_TESTS+=("$SPECIFIC_PACKAGE")
            fi
            break
        fi
    done
    
    if [ ${#PASSED_TESTS[@]} -eq 0 ] && [ ${#FAILED_TESTS[@]} -eq 0 ]; then
        print_error "Package '$SPECIFIC_PACKAGE' not found"
        exit 1
    fi
else
    # Run tests for all packages
    print_status "Running comprehensive test suite..."
    
    # Test packages first
    print_status "Testing packages..."
    
    # UI Package
    if run_tests "packages/ui" "UI Package"; then
        PASSED_TESTS+=("packages/ui")
    else
        FAILED_TESTS+=("packages/ui")
    fi
    
    # Shared Package
    if run_tests "packages/shared" "Shared Package"; then
        PASSED_TESTS+=("packages/shared")
    else
        FAILED_TESTS+=("packages/shared")
    fi
    
    # Database Package
    if run_tests "packages/database" "Database Package"; then
        PASSED_TESTS+=("packages/database")
    else
        FAILED_TESTS+=("packages/database")
    fi
    
    # Test applications
    print_status "Testing applications..."
    
    # Web App
    if run_tests "apps/web" "Web Application"; then
        PASSED_TESTS+=("apps/web")
    else
        FAILED_TESTS+=("apps/web")
    fi
    
    # API App
    if run_tests "apps/api" "API Application"; then
        PASSED_TESTS+=("apps/api")
    else
        FAILED_TESTS+=("apps/api")
    fi
    
    # Mobile App
    if run_tests "apps/mobile" "Mobile Application"; then
        PASSED_TESTS+=("apps/mobile")
    else
        FAILED_TESTS+=("apps/mobile")
    fi
    
    # Run additional checks if not in watch mode
    if [ "$WATCH" = false ]; then
        print_status "Running additional checks..."
        
        # Linting
        print_status "Running linting checks..."
        run_lint "apps/web" "Web Application"
        run_lint "apps/api" "API Application"
        run_lint "packages/ui" "UI Package"
        run_lint "packages/shared" "Shared Package"
        
        # Type checking
        print_status "Running type checking..."
        run_type_check "apps/web" "Web Application"
        run_type_check "apps/api" "API Application"
        run_type_check "packages/ui" "UI Package"
        run_type_check "packages/shared" "Shared Package"
    fi
fi

# Generate test report
print_status "Generating test report..."

TOTAL_TESTS=$((${#PASSED_TESTS[@]} + ${#FAILED_TESTS[@]}))

echo ""
echo "=================================="
echo "           TEST SUMMARY           "
echo "=================================="
echo "Total packages tested: $TOTAL_TESTS"
echo "Passed: ${#PASSED_TESTS[@]}"
echo "Failed: ${#FAILED_TESTS[@]}"
echo ""

if [ ${#PASSED_TESTS[@]} -gt 0 ]; then
    print_success "Passed tests:"
    for test in "${PASSED_TESTS[@]}"; do
        echo "  ✅ $test"
    done
    echo ""
fi

if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    print_error "Failed tests:"
    for test in "${FAILED_TESTS[@]}"; do
        echo "  ❌ $test"
    done
    echo ""
fi

# Coverage report location
if [ "$COVERAGE" = true ]; then
    print_status "Coverage reports generated in:"
    find . -name "coverage" -type d | while read -r dir; do
        echo "  📊 $dir"
    done
    echo ""
fi

# Exit with appropriate code
if [ ${#FAILED_TESTS[@]} -gt 0 ]; then
    print_error "Some tests failed. Please check the output above."
    exit 1
else
    print_success "🎉 All tests passed!"
    exit 0
fi