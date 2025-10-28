#!/bin/bash
source .env

echo "=== Checking Florida index ==="
echo ""
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans-fl-2025-11?v&h=index,docs.count,store.size" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

echo -e "\n\n=== Sample documents from Florida index ==="
curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans-fl-2025-11/_search?size=3" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {"match_all": {}},
    "_source": ["title", "plan_name", "state", "plan_id"]
  }' | jq '.hits | {total: .total, results: [.hits[]._source]}'

echo -e "\n\n=== Checking health-plans alias ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/aliases/health-plans?v&h=alias,index,routing" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

