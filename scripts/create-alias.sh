#!/bin/bash
source .env

echo "Creating health-plans alias..."

curl -X POST "${ELASTIC_ENDPOINT}/_aliases" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "actions": [
      {
        "add": {
          "index": "health-plans-tx-2025-11",
          "alias": "health-plans"
        }
      }
    ]
  }'

echo -e "\n\n=== Verifying Alias ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/aliases/health-plans?v" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

echo -e "\n\n=== Testing Search with Alias ==="
curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans/_search?size=1" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{"query":{"match_all":{}}}' | jq -c '{total: .hits.total, index: ._index}'

