# Elasticsearch Query Structure

## Example Query: "health plans for texas"

### Full Elasticsearch Request

```json
{
  "index": "health-plans",
  "from": 0,
  "size": 10,
  "query": {
    "bool": {
      "must": [],
      "should": [
        {
          "multi_match": {
            "query": "health plans for texas",
            "fields": [
              "title^2",
              "plan_name^2",
              "state^3",
              "county^2",
              "extracted_text",
              "body",
              "pdf.content"
            ],
            "type": "best_fields",
            "fuzziness": "AUTO"
          }
        },
        {
          "multi_match": {
            "query": "health plans for texas",
            "fields": [
              "title^3",
              "plan_name^3",
              "state^4",
              "extracted_text^2"
            ],
            "type": "phrase"
          }
        },
        {
          "query_string": {
            "query": "*health plans for texas*",
            "fields": [
              "state",
              "county",
              "plan_name",
              "extracted_text"
            ],
            "default_operator": "OR"
          }
        }
      ],
      "minimum_should_match": 1
    }
  },
  "_source": [
    "title",
    "plan_name",
    "plan_type",
    "plan_id",
    "county_code",
    "extracted_text",
    "url",
    "document_url",
    "pdf.filename",
    "metadata"
  ]
}
```

---

## Query Breakdown

### 1. **Multi-Match Query (Lexical Search with Fuzziness)**
```json
{
  "multi_match": {
    "query": "health plans for texas",
    "fields": [
      "title^2",         // Boost by 2x
      "plan_name^2",     // Boost by 2x
      "state^3",         // Boost by 3x (highest priority for state)
      "county^2",        // Boost by 2x
      "extracted_text",  // No boost (base relevance)
      "body",
      "pdf.content"
    ],
    "type": "best_fields",
    "fuzziness": "AUTO"  // Handles typos: "texs" → "texas"
  }
}
```

**What it does:**
- Searches across multiple fields with different importance weights (boosts)
- Allows fuzzy matching for typos
- Returns best matching field score

---

### 2. **Phrase Match Query (Exact Phrase Matching)**
```json
{
  "multi_match": {
    "query": "health plans for texas",
    "fields": [
      "title^3",
      "plan_name^3",
      "state^4",         // Highest boost for exact state matches
      "extracted_text^2"
    ],
    "type": "phrase"
  }
}
```

**What it does:**
- Looks for the exact phrase "health plans for texas" in the text
- Higher boost than fuzzy search (rewards exact matches)
- Especially prioritizes exact state name matches

---

### 3. **Wildcard Query String (Flexible Matching)**
```json
{
  "query_string": {
    "query": "*health plans for texas*",
    "fields": [
      "state",
      "county",
      "plan_name",
      "extracted_text"
    ],
    "default_operator": "OR"
  }
}
```

**What it does:**
- Adds wildcards for partial matches
- Searches anywhere in the text (substring matching)
- OR operator means any word can match

---

### 4. **Boolean Logic**
```json
{
  "bool": {
    "must": [],              // Required filters (empty if no filters)
    "should": [...],         // At least one must match
    "minimum_should_match": 1
  }
}
```

**What it does:**
- `must`: Hard filters (plan type, county, tobacco use)
- `should`: Scoring queries (all 3 search strategies above)
- `minimum_should_match: 1`: At least one "should" clause must match

---

## With Filters Example

If user selects filters:
- County: "Harris"
- Plan Type: "EPO"
- Tobacco Use: false

```json
{
  "query": {
    "bool": {
      "must": [
        {
          "term": {
            "county_code.keyword": "Harris"
          }
        },
        {
          "terms": {
            "plan_id.keyword": ["EPO"]
          }
        },
        {
          "term": {
            "tobacco_use": false
          }
        }
      ],
      "should": [
        // ... same 3 search strategies ...
      ],
      "minimum_should_match": 1
    }
  }
}
```

---

## Response Structure

### Raw Elasticsearch Response
```json
{
  "hits": {
    "total": {
      "value": 160,
      "relation": "eq"
    },
    "hits": [
      {
        "_id": "abc123",
        "_score": 12.45,
        "_source": {
          "plan_name": "TX016-2941-16",
          "plan_type": "EPO",
          "plan_id": "TX016",
          "county_code": "2941",
          "state": "Texas",
          "extracted_text": "2025 MAJOR MEDICAL EXPENSE POLICY Ambetter + Adult Vision...",
          "document_url": "https://www.ambetterhealth.com/.../29418TX016.pdf",
          "metadata": {
            "county": "Harris County",
            "tobacco_use": "n"
          }
        }
      }
      // ... 9 more results ...
    ]
  }
}
```

### Enhanced API Response (with Plan Name Extraction)

The API automatically extracts human-readable plan names from document text:

```json
{
  "results": [
    {
      "id": "abc123",
      "plan_name": "Ambetter + Adult Vision",           // ✨ Extracted from body
      "original_plan_name": "TX016-2941-16",            // Original value
      "plan_type": "EPO",
      "plan_id": "TX016",
      "county_code": "2941",
      "extracted_text": "2025 MAJOR MEDICAL EXPENSE POLICY Ambetter + Adult Vision...",
      "document_url": "https://www.ambetterhealth.com/.../29418TX016.pdf",
      "_score": 12.45
    }
  ],
  "total": 160,
  "page": 1,
  "limit": 10
}
```

**Plan Name Extraction Patterns:**
1. `MAJOR MEDICAL EXPENSE POLICY [Plan Name]`
2. `Ambetter + [Plan Type]` (e.g., "Ambetter + Adult Vision")
3. `FOR AMBETTER FROM [Provider]`
4. `Ambetter from Superior HealthPlan`

---

## Key Points

1. **3 Search Strategies Combined**:
   - Fuzzy lexical search (typo-tolerant)
   - Exact phrase matching (highest relevance)
   - Wildcard substring search (broad coverage)

2. **Field Boosting**:
   - `state^4`: Highest priority (4x boost)
   - `title^3`, `plan_name^3`: High priority (3x boost)
   - `county^2`, `extracted_text^2`: Medium priority (2x boost)

3. **No Semantic Search Yet**:
   - ELSER model is disabled (line 129 in route.ts)
   - Only lexical/keyword-based matching

4. **Pagination**:
   - `from: 0, size: 10` - First 10 results
   - Can be controlled via `page` and `limit` parameters

5. **Source Filtering**:
   - Only returns specific fields (`_source`)
   - Reduces payload size and improves performance

