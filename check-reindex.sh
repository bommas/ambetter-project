#!/bin/bash
source .env

echo "=== Checking Reindex Progress ==="
echo ""
echo "1. Source index (health-plans):"
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans?v&h=index,docs.count,store.size" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"
echo ""
echo "2. Target index (health-plans-tx-2025-11):"
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans-tx-2025-11?v&h=index,docs.count,store.size" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"
echo ""
echo "3. All health-plans indices:"
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans*?v" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"
echo ""
