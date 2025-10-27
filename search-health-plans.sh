#!/bin/bash
source .env

echo "Searching in health-plans alias/index for Florida documents..."
curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans/_search?size=5" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{
    "query": {
      "term": {
        "state.keyword": "FL"
      }
    },
    "_source": ["title", "plan_name", "state", "plan_id", "_index"]
  }' | jq '.hits | {total: .total, results: [.hits[]._source]}'

