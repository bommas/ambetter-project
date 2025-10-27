#!/bin/bash
cd /Users/satishbomma/ambetter-project

echo "Testing Florida brochure URLs from config..."
echo ""

# Test EPO brochures URL
echo "1. Testing EPO brochures URL: https://www.ambetterhealth.com/en/fl/2025-brochures-epo/"
TARGET_INDEX="health-plans-fl-test-epo" SINGLE_URL="https://www.ambetterhealth.com/en/fl/2025-brochures-epo/" SINGLE_STATE="FL" node scripts/multi-state-processor.js 2>&1 | grep -E "Found.*PDF|Total PDFs|Indexing to|Successfully indexed" | head -20

echo ""
echo "2. Testing HMO brochures URL: https://www.ambetterhealth.com/en/fl/2025-brochures-hmo/"
TARGET_INDEX="health-plans-fl-test-hmo" SINGLE_URL="https://www.ambetterhealth.com/en/fl/2025-brochures-hmo/" SINGLE_STATE="FL" node scripts/multi-state-processor.js 2>&1 | grep -E "Found.*PDF|Total PDFs|Indexing to|Successfully indexed" | head -20

