#!/bin/bash
source .env

echo "Testing indexing to Florida index..."
echo ""

# Try indexing a test document directly
curl -X POST "${ELASTIC_ENDPOINT}/health-plans-fl-2025-11/_doc" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Document",
    "plan_name": "Test Plan",
    "state": "FL",
    "plan_id": "TEST001"
  }'

echo -e "\n\nChecking index now..."
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans-fl-2025-11?v&h=index,docs.count" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

