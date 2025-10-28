#!/bin/bash
source .env

echo "=== Checking Nevada documents in detail ==="
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
    "_source": true
  }' | jq '.hits.hits[] | {_id: ._id, title: ._source.title, url: ._source.document_url, plan_id: ._source.plan_id, _index: ._index}'

