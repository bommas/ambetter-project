#!/bin/bash
source .env

echo "=== Checking Nevada document URLs ==="
echo ""
curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans/_search?size=10" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "term": {
        "state.keyword": "NV"
      }
    },
    "_source": ["title", "plan_name", "state", "plan_id", "document_url", "url"]
  }' | jq '.hits | {total: .total, results: [.hits[]._source]}'

