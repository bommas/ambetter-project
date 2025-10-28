#!/bin/bash
source .env

echo "=== Current health-plans alias status ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/aliases/health-plans?v&h=alias,index,routing" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

echo -e "\n\n=== All health-plans-* indices ==="
curl -s -X GET "${ELASTIC_ENDPOINT}/_cat/indices/health-plans*?v&h=index,docs.count,store.size" \
  -H "Authorization: ApiKey ${ELASTIC_API_KEY}"

