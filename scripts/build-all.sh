#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${2}${1}${NC}"
}

# Function to build for a specific environment
build_for_environment() {
    local env=$1
    print_status "Building for ${env}..." "${YELLOW}"
    
    # Use the existing npm scripts that handle dotenv
    if npm run build:${env}; then
        print_status "✓ ${env} build completed successfully" "${GREEN}"
        return 0
    else
        print_status "✗ ${env} build failed" "${RED}"
        return 1
    fi
}

# Main execution
print_status "Starting build process for all environments..." "${YELLOW}"
echo ""

# Track build results
devnet_result=0
testnet_result=0
mainnet_result=0

# Build for devnet
build_for_environment "devnet"
devnet_result=$?

# Build for testnet
build_for_environment "testnet"
testnet_result=$?

# Build for mainnet
build_for_environment "mainnet"
mainnet_result=$?

echo ""
print_status "Build Summary:" "${YELLOW}"
print_status "Devnet: $([ $devnet_result -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')" "$([ $devnet_result -eq 0 ] && echo $GREEN || echo $RED)"
print_status "Testnet: $([ $testnet_result -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')" "$([ $testnet_result -eq 0 ] && echo $GREEN || echo $RED)"
print_status "Mainnet: $([ $mainnet_result -eq 0 ] && echo '✓ PASSED' || echo '✗ FAILED')" "$([ $mainnet_result -eq 0 ] && echo $GREEN || echo $RED)"

echo ""

# Check if all builds succeeded
if [ $devnet_result -eq 0 ] && [ $testnet_result -eq 0 ] && [ $mainnet_result -eq 0 ]; then
    print_status "🎉 All builds completed successfully!" "${GREEN}"
    exit 0
else
    print_status "❌ One or more builds failed. Please check the errors above." "${RED}"
    exit 1
fi
