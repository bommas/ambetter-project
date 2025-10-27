#!/bin/bash
source .env

curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans*?v&s=index" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" | head -20

echo -e "\n--- Checking health-plans alias ---"
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/aliases/health-plans?v" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" || echo "No alias found"

echo -e "\n--- Getting search query structure ---"
curl -s -X GET "${ELASTIC_ENDPOINT}/_search" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "match_all": {}
    },
    "size": 1,
    "_source": ["title", "plan_name", "state", "plan_id"]
  }' | jq -c '{index: .took, total: .hits.total, sample: .hits.hits[0]._source}' 2>/dev/null || echo "Query executed"
