#!/bin/bash

# QA Agent Test Script
# This script runs comprehensive tests for deployment validation

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
BASE_URL=${NEXT_PUBLIC_APP_URL:-"http://localhost:3000"}
ENVIRONMENT=${NODE_ENV:-"development"}

echo -e "${BLUE}🔍 QA Agent - Deployment Validation${NC}"
echo -e "${BLUE}=====================================${NC}"
echo "Environment: $ENVIRONMENT"
echo "Base URL: $BASE_URL"
echo ""

# Function to print test results
print_result() {
    local test_name="$1"
    local status="$2"
    local message="$3"
    
    if [ "$status" = "pass" ]; then
        echo -e "✅ ${GREEN}$test_name${NC}: $message"
    elif [ "$status" = "fail" ]; then
        echo -e "❌ ${RED}$test_name${NC}: $message"
    else
        echo -e "⚠️  ${YELLOW}$test_name${NC}: $message"
    fi
}

# Function to check if service is running
check_service() {
    local url="$1"
    local service_name="$2"
    
    if curl -s -f "$url" > /dev/null 2>&1; then
        print_result "$service_name" "pass" "Service is running"
        return 0
    else
        print_result "$service_name" "fail" "Service is not responding"
        return 1
    fi
}

# Function to run API test
test_api() {
    local endpoint="$1"
    local expected_status="$2"
    local test_name="$3"
    
    local response=$(curl -s -w "%{http_code}" -o /dev/null "$BASE_URL$endpoint")
    
    if [ "$response" = "$expected_status" ]; then
        print_result "$test_name" "pass" "API returned $response"
        return 0
    else
        print_result "$test_name" "fail" "Expected $expected_status, got $response"
        return 1
    fi
}

# Function to run validation via API
run_validation() {
    echo -e "${BLUE}Running comprehensive validation...${NC}"
    
    local response=$(curl -s -X POST "$BASE_URL/api/qa/validate" \
        -H "Content-Type: application/json" \
        -d "{\"environment\":\"$ENVIRONMENT\"}")
    
    if [ $? -eq 0 ]; then
        local status=$(echo "$response" | jq -r '.report.overallStatus // "unknown"')
        local total=$(echo "$response" | jq -r '.report.totalTests // 0')
        local passed=$(echo "$response" | jq -r '.report.passedTests // 0')
        local failed=$(echo "$response" | jq -r '.report.failedTests // 0')
        local warnings=$(echo "$response" | jq -r '.report.warningTests // 0')
        
        echo ""
        echo -e "${BLUE}Validation Results:${NC}"
        echo "Total Tests: $total"
        echo "Passed: $passed"
        echo "Failed: $failed"
        echo "Warnings: $warnings"
        echo ""
        
        if [ "$status" = "pass" ]; then
            print_result "Overall Validation" "pass" "All tests passed"
            return 0
        elif [ "$status" = "warning" ]; then
            print_result "Overall Validation" "warning" "Some warnings detected"
            return 1
        else
            print_result "Overall Validation" "fail" "Some tests failed"
            return 2
        fi
    else
        print_result "Validation API" "fail" "Could not reach validation endpoint"
        return 3
    fi
}

# Main test execution
main() {
    local exit_code=0
    
    echo -e "${BLUE}1. Basic Service Checks${NC}"
    echo "----------------------"
    
    # Check if Next.js app is running
    if ! check_service "$BASE_URL" "Next.js Application"; then
        echo -e "${RED}❌ Application is not running. Please start with: npm run dev${NC}"
        exit 1
    fi
    
    # Check health endpoint
    if ! test_api "/api/health" "200" "Health Check API"; then
        exit_code=$((exit_code + 1))
    fi
    
    echo ""
    echo -e "${BLUE}2. API Endpoint Tests${NC}"
    echo "---------------------"
    
    # Test individual API endpoints
    test_api "/api/search" "200" "Search API" || exit_code=$((exit_code + 1))
    test_api "/api/crawl" "200" "Crawl API" || exit_code=$((exit_code + 1))
    test_api "/api/process-embeddings" "200" "Embeddings API" || exit_code=$((exit_code + 1))
    test_api "/api/qa/validate" "200" "QA Validation API" || exit_code=$((exit_code + 1))
    
    echo ""
    echo -e "${BLUE}3. Comprehensive Validation${NC}"
    echo "----------------------------"
    
    # Run full validation
    run_validation
    local validation_exit_code=$?
    exit_code=$((exit_code + validation_exit_code))
    
    echo ""
    echo -e "${BLUE}4. Summary${NC}"
    echo "----------"
    
    if [ $exit_code -eq 0 ]; then
        echo -e "${GREEN}🎉 All tests passed! Deployment is healthy.${NC}"
    elif [ $exit_code -eq 1 ]; then
        echo -e "${YELLOW}⚠️  Some warnings detected. Check the results above.${NC}"
    else
        echo -e "${RED}❌ Some tests failed. Please review the results above.${NC}"
    fi
    
    echo ""
    echo -e "${BLUE}QA Agent completed with exit code: $exit_code${NC}"
    exit $exit_code
}

# Check dependencies
if ! command -v curl &> /dev/null; then
    echo -e "${RED}❌ curl is required but not installed.${NC}"
    exit 1
fi

if ! command -v jq &> /dev/null; then
    echo -e "${YELLOW}⚠️  jq is recommended for better output formatting.${NC}"
    echo "Install with: brew install jq (macOS) or apt-get install jq (Ubuntu)"
fi

# Run main function
main "$@"
