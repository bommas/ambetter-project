#!/bin/bash
source .env

echo "=== Testing health-plans alias with a search query ==="
echo ""

curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans/_search?size=5" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match": {
        "state": "TX"
      }
    },
    "_source": ["plan_name", "state", "plan_id"]
  }' | jq '.hits | {total: .total, results: [.hits[]._source]}'

