#!/bin/bash
source .env

echo "Testing re-ingestion with TARGET_INDEX..."
echo ""

# Test with a small state index
cd /Users/satishbomma/ambetter-project
TARGET_INDEX="health-plans-fl-2025-11" SINGLE_URL="https://www.ambetterhealth.com/en/fl/2025-brochures-epo/" SINGLE_STATE="FL" node scripts/multi-state-processor.js 2>&1 | tail -20

echo -e "\n\n=== Checking FL index ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans-fl-2025-11?v&h=index,docs.count" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"
