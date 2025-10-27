#!/bin/bash
source .env

echo "=== State distribution across all health-plans-* indices ==="
echo ""

for index in health-plans-tx-2025-11 health-plans-fl-2025-11 health-plans-nv-2025-11; do
  echo "Checking $index..."
  curl -s -X POST "${ELASTIC_ENDPOINT}/$index/_search" \
    -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
    -H "Content-Type: application/json" \
    -d '{
      "size": 0,
      "aggs": {
        "states": {
          "terms": {
            "field": "state.keyword"
          }
        }
      }
    }' | jq ".aggregations.states.buckets"
  echo ""
done

