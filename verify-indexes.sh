#!/bin/bash
source .env

echo "=== Current indices and document counts ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans*?v&h=index,docs.count,store.size" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

echo -e "\n\n=== Checking health-plans-fl-2025-11 specifically ==="
curl -s -X POST "${ELASTIC_ENDPOINT}/health-plans-fl-2025-11/_count" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}" \
  -H "Content-Type: application/json" \
  -d '{}' | jq

echo -e "\n\n=== Checking health-plans alias ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/aliases/health-plans?v&h=alias,index" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

