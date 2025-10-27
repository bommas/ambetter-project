# 🔍 Current Elasticsearch Query Structure

## Overview

This document shows the current Elasticsearch query structure used in the Ambetter Health Plan Search application, including all recent improvements and configurations.

## Current Query Structure

### Base Query Structure
```json
{
  "query": {
    "bool": {
      "must": [...],
      "should": [...],
      "minimum_should_match": 1
    }
  },
  "from": 0,
  "size": 30
}
```

### Complete Query Example (for "health plans of texas")

```json
{
  "index": "health-plans",
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "state.keyword": "TX"
          }
        }
      ],
      "should": [
        {
          "multi_match": {
            "query": "health plans of texas",
            "fields": [
              "title^2",
              "plan_name^2",
              "state^3",
              "county^2",
              "extracted_text^5",
              "body^1",
              "pdf_extracted^3"
            ],
            "type": "best_fields",
            "fuzziness": "AUTO"
          }
        },
        {
          "multi_match": {
            "query": "health plans of texas",
            "fields": [
              "title^3",
              "plan_name^3",
              "state^4",
              "extracted_text^5",
              "pdf_extracted^2"
            ],
            "type": "phrase"
          }
        },
        {
          "query_string": {
            "query": "*health plans of texas*",
            "fields": ["state", "county", "plan_name", "extracted_text"],
            "default_operator": "OR"
          }
        },
        {
          "semantic": {
            "field": "extracted_text_semantic",
            "query": "health plans of texas",
            "boost": 2.0
          }
        },
        {
          "semantic": {
            "field": "body_semantic",
            "query": "health plans of texas",
            "boost": 1.5
          }
        },
        {
          "semantic": {
            "field": "pdf_semantic",
            "query": "health plans of texas",
            "boost": 1.5
          }
        }
      ],
      "minimum_should_match": 1
    }
  },
  "from": 0,
  "size": 30
}
```

## Key Features

### 1. **State Auto-Detection**
- Automatically detects state from query text
- Applies as a `must` filter for precise results
- Supported states: TX, FL, CA, NY, IL, PA, OH, GA, NC, MI

### 2. **Hybrid Search**
- **Lexical Search** (Keyword matching with fuzziness)
- **Semantic Search** (ELSER embeddings)
- **Phrase Matching** (Exact phrase searches)
- **Wildcard Search** (Partial text matching)

### 3. **Field Boosts**
Current field weights:
- `state`: 3-4x
- `extracted_text`: 5x
- `title`: 2-3x
- `plan_name`: 2-3x
- `county`: 2x
- `body`: 1x
- `pdf_extracted`: 2-3x

### 4. **Semantic Boosts** (when mode=semantic)
- `extracted_text_semantic`: 2.0
- `body_semantic`: 1.5
- `pdf_semantic`: 1.5

### 5. **Custom Weights & Boosts**
- Weights configurable via Admin UI (Boosting tab)
- Supports text field boosts
- Supports numeric field boosts (log/sigmoid functions)

### 6. **Curations**
- Pin specific documents for queries
- Exclude documents from results
- Applied after search execution

### 7. **Result Deduplication**
- Client-side deduplication by URL
- Strips query parameters from URLs
- Collapses based on `plan_id.keyword`

## Current Index Status

### Indices
1. **health-plans** (Main index)
   - Documents: 38,185
   - Status: Active
   - Used for search

2. **health-plans-tx-2025-11** (Versioned index)
   - Documents: 0
   - Status: Created but empty
   - Intended for reindexing

3. **health-plans-nv-2025-11** (Nevada index)
   - Documents: 0
   - Status: Created but empty

4. **health-plans-suggest** (Autocomplete)
   - Documents: 1,957
   - Status: Active

### Alias Status
- **health-plans alias**: Not currently configured
- Reason: `health-plans` exists as an index, not an alias
- Action needed: Reindex into versioned index and create alias

## Query Modes

### Keyword Mode (`mode=keyword`)
```json
{
  "should": [
    { "multi_match": {...} },
    { "multi_match": { "type": "phrase" } },
    { "query_string": {...} }
  ]
}
```
- Only lexical/phrase/wildcard search
- No semantic embeddings
- Faster response time
- Good for exact matches

### Semantic Mode (`mode=semantic`, default)
```json
{
  "should": [
    { "multi_match": {...} },
    { "multi_match": { "type": "phrase" } },
    { "query_string": {...} },
    { "semantic": { "field": "extracted_text_semantic" } },
    { "semantic": { "field": "body_semantic" } },
    { "semantic": { "field": "pdf_semantic" } }
  ]
}
```
- Combines lexical + semantic search
- ELSER embeddings for understanding
- Better for natural language queries
- Slightly slower but more accurate

## Filters

### Supported Filters
```javascript
{
  state: "TX",
  county: "2941",
  plan: "Ambetter Essential Care",
  planId: "TX016",
  planType: ["hmo", "epo"],
  documentType: ["summary_of_benefits", "policy"]
}
```

### Applied as `must` Clauses
```json
{
  "bool": {
    "must": [
      { "term": { "state.keyword": "TX" } },
      { "term": { "county_code.keyword": "2941" } },
      "term": { "plan_name.keyword": "Ambetter Essential Care" } }
    ]
  }
}
```

## Performance Optimizations

### 1. **Fetch Size Adjustment**
- Fetches `limit * 3` documents to account for deduplication
- Example: `limit: 10` → fetches 30, deduplicates, returns top 10

### 2. **Pagination**
- Default: 10 results per page
- Options: 10, 20, 30, 50
- Google-like pagination UI

### 3. **AI Summary Caching**
- Redis cache for AI summaries
- Cache key: `query + results_hash`
- Reduces OpenAI API calls
- Currently disabled (no Redis credentials)

### 4. **Result Deduplication**
```javascript
const normalizeUrl = (url: string): string => {
  const queryIndex = url.indexOf('?')
  return queryIndex > 0 ? url.substring(0, queryIndex) : url
}
```

## Recent Changes Summary

### ✅ What's Working
1. **Auto State Detection** - Works for 10 states
2. **Hybrid Search** - Lexical + Semantic working
3. **Dynamic Facets** - Contextual filtering
4. **Pagination** - Google-like interface
5. **Result Deduplication** - Client-side URL normalization
6. **Admin UI** - Protected indices, alias management
7. **Cookie Authentication** - Fixed path issues

### ⚠️ Pending Issues
1. **health-plans alias** - Need to reindex first
2. **Reindex script** - Need to remove invalid parameter
3. **Index naming** - Conflict between index and alias names

### 🔧 Next Steps
1. Fix reindex script (`request_timeout` → `request_timeout_ms`)
2. Complete reindexing of health-plans → health-plans-tx-2025-11
3. Create health-plans alias pointing to new versioned index
4. Delete old health-plans index

## Example Search Flow

1. **User searches**: "show me texas health plans"
2. **State detected**: TX
3. **Query built**: Hybrid search with semantic mode
4. **Filters applied**: state=TX (must clause)
5. **Search executed**: 30 results fetched
6. **Deduplication**: URLs normalized, duplicates removed
7. **Results returned**: Top 10-30 unique results
8. **AI Summary**: Optional, cached if available

## Search Performance

- **Current latency**: ~200-500ms
- **Total documents**: 38,185
- **Searchable fields**: 7+ fields
- **Semantic fields**: 3 fields
- **Maximum results**: 30 per page

---

*Last updated: October 27, 2025*
