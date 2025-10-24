# 📚 API Documentation - Ambetter Health Plan Search

## Overview

This document provides comprehensive documentation for all API endpoints in the Ambetter Health Plan Search application. The API is built with Next.js 14 and provides search, analytics, admin, and quality assurance capabilities.

## 🔗 Base URL

- **Local Development**: `http://localhost:3000`
- **Production**: `https://ambetter-project-bommas-projects-616cc7b7.vercel.app`

## 🔐 Authentication

Most admin endpoints require authentication via HTTP-only cookies. Use the `/api/admin/login` endpoint to authenticate.

---

## 🔍 Search & Discovery APIs

### 1. Search Health Plans

**Endpoint**: `POST /api/search`

**Description**: Main search endpoint for health plans with hybrid search (lexical + semantic) capabilities.

**Request Body**:
```json
{
  "query": "string (required)",
  "filters": {
    "state": "string (optional)",
    "county": "string (optional)", 
    "plan": "string (optional)",
    "planId": "string (optional)",
    "planType": "string[] (optional)",
    "documentType": "string[] (optional)",
    "tobaccoUse": "boolean (optional)"
  },
  "page": "number (optional, default: 1)",
  "limit": "number (optional, default: 20)",
  "sortBy": "string (optional, 'relevance'|'planType'|'county', default: 'relevance')",
  "mode": "string (optional, 'semantic'|'keyword', default: 'semantic')"
}
```

**Response**:
```json
{
  "results": [
    {
      "id": "string",
      "title": "string",
      "plan_name": "string",
      "plan_type": "string",
      "plan_id": "string",
      "state": "string",
      "county_code": "string",
      "extracted_text": "string",
      "url": "string",
      "document_url": "string",
      "pdf": {
        "filename": "string"
      },
      "metadata": "object",
      "_score": "number"
    }
  ],
  "total": "number",
  "page": "number",
  "limit": "number",
  "query": "string",
  "filters": "object"
}
```

**Features**:
- Hybrid search (lexical + semantic using ELSER)
- Auto-state detection from query
- Dynamic boosting and curations
- Result deduplication
- Search analytics tracking

---

### 2. Get Search Facets

**Endpoint**: `GET /api/facets`

**Description**: Returns aggregation data for filtering options (states, counties, plan types, etc.).

**Query Parameters**:
- `query` (optional): Search query for contextual faceting
- `state` (optional): Filter by state
- `county` (optional): Filter by county
- `documentType` (optional): Filter by document type
- `plan` (optional): Filter by plan name
- `planId` (optional): Filter by plan ID

**Response**:
```json
{
  "states": [
    {
      "value": "TX",
      "label": "TX", 
      "count": 150
    }
  ],
  "counties": [
    {
      "value": "2941",
      "label": "2941",
      "count": 25
    }
  ],
  "documentTypes": [
    {
      "value": "summary_of_benefits",
      "label": "Summary of Benefits",
      "count": 45
    }
  ],
  "plans": [
    {
      "value": "Ambetter Essential Care",
      "label": "Ambetter Essential Care",
      "count": 12,
      "tier": "Bronze"
    }
  ],
  "planIds": [
    {
      "value": "TX016",
      "label": "Plan TX016",
      "count": 8
    }
  ],
  "planTypes": [
    {
      "value": "hmo",
      "label": "HMO",
      "count": 30
    }
  ]
}
```

---

### 3. AI Summary Generation

**Endpoint**: `POST /api/ai-summary`

**Description**: Generates AI-powered summaries of search results using OpenAI GPT-4o-mini.

**Request Body**:
```json
{
  "query": "string (required)",
  "results": [
    {
      "plan_name": "string",
      "plan_id": "string", 
      "plan_type": "string",
      "county_code": "string",
      "extracted_text": "string",
      "url": "string (optional)",
      "document_url": "string (optional)"
    }
  ]
}
```

**Response**:
```json
{
  "summary": "string",
  "source": "string (openai|cache|mock)",
  "model": "string (optional)",
  "cached": "boolean"
}
```

**Features**:
- Redis caching for performance
- Fallback to mock summaries
- Grounded responses with citations
- Cost-optimized with gpt-4o-mini

---

### 4. Search Suggestions

**Endpoint**: `GET /api/suggest`

**Description**: Provides autocomplete suggestions for search queries.

**Query Parameters**:
- `q` (required): Search prefix

**Response**:
```json
{
  "suggestions": [
    {
      "text": "string",
      "payload": "object"
    }
  ]
}
```

---

## 🏥 Health & Monitoring APIs

### 5. Health Check

**Endpoint**: `GET /api/health`

**Description**: Comprehensive health check for all services.

**Response**:
```json
{
  "status": "string (healthy|degraded|unhealthy)",
  "timestamp": "string (ISO 8601)",
  "version": "string",
  "environment": "string",
  "services": {
    "elasticsearch": "string (healthy|unhealthy|unknown)",
    "rabbitmq": "string (healthy|unhealthy|not_configured)",
    "embeddings": "string (configured|not_configured)"
  },
  "uptime": "number (seconds)",
  "memory": {
    "used": "number (bytes)",
    "total": "number (bytes)",
    "external": "number (bytes)"
  }
}
```

---

### 6. Elasticsearch Test

**Endpoint**: `GET /api/test-elastic`

**Description**: Tests Elasticsearch connectivity and configuration.

**Response**:
```json
{
  "status": "string (success|error)",
  "elasticsearch": {
    "ping": "boolean",
    "endpoint": "string",
    "hasApiKey": "boolean",
    "indexExists": "boolean",
    "sampleDocCount": "number",
    "sampleDoc": "object"
  }
}
```

---

## 🔧 Admin APIs

### 7. Admin Login

**Endpoint**: `POST /api/admin/login`

**Description**: Authenticates admin users.

**Request Body**:
```json
{
  "username": "string (required)",
  "password": "string (required)"
}
```

**Response**:
```json
{
  "ok": "boolean",
  "error": "string (optional)"
}
```

**Environment Variables**:
- `ADMIN_USERNAME` (default: "admin")
- `ADMIN_PASSWORD` (default: "admin")

---

### 8. Admin Logout

**Endpoint**: `POST /api/admin/logout`

**Description**: Logs out admin users.

**Response**: Redirects to `/admin/login`

---

### 9. Document Ingestion

**Endpoint**: `POST /api/admin/ingest`

**Description**: Ingests new documents from Ambetter URLs.

**Authentication**: Required (admin cookie)

**Request Body**:
```json
{
  "url": "string (required)",
  "state": "string (required)",
  "version": "string (required)"
}
```

**Response**:
```json
{
  "ok": "boolean",
  "message": "string",
  "index": "string",
  "error": "string (optional)"
}
```

**Features**:
- Creates dynamic index: `health-plans-{state}-{version}`
- Adds index to `health-plans` alias
- Runs multi-state processor script

---

### 10. Search Curations Management

**Endpoint**: `GET /api/admin/curations`

**Description**: Lists all search curations.

**Authentication**: Required (admin cookie)

**Response**:
```json
{
  "items": [
    {
      "id": "string",
      "query": "string",
      "pins": "string[]",
      "excludes": "string[]",
      "updated_at": "string"
    }
  ]
}
```

---

**Endpoint**: `POST /api/admin/curations`

**Description**: Creates or updates search curations.

**Authentication**: Required (admin cookie)

**Request Body**:
```json
{
  "query": "string (required)",
  "pins": "string[] (required)",
  "excludes": "string[] (optional)"
}
```

**Response**:
```json
{
  "ok": "boolean",
  "error": "string (optional)"
}
```

---

**Endpoint**: `DELETE /api/admin/curations`

**Description**: Deletes search curations.

**Authentication**: Required (admin cookie)

**Query Parameters**:
- `all=true` (optional): Delete all curations
- `query` (optional): Delete specific curation by query

**Response**:
```json
{
  "ok": "boolean",
  "error": "string (optional)"
}
```

---

### 11. Search Boosts Management

**Endpoint**: `GET /api/admin/boosts`

**Description**: Retrieves current boost configuration.

**Authentication**: Required (admin cookie)

**Response**:
```json
{
  "weights": {
    "field_name": "number"
  },
  "numeric_boosts": [
    {
      "field": "string",
      "type": "string (log|sigmoid)",
      "factor": "number"
    }
  ],
  "updated_at": "string"
}
```

---

**Endpoint**: `POST /api/admin/boosts`

**Description**: Updates boost configuration.

**Authentication**: Required (admin cookie)

**Request Body**:
```json
{
  "weights": {
    "field_name": "number"
  },
  "numeric_boosts": [
    {
      "field": "string",
      "type": "string (log|sigmoid)",
      "factor": "number"
    }
  ]
}
```

**Response**:
```json
{
  "ok": "boolean",
  "error": "string (optional)"
}
```

---

### 12. Boost Fields

**Endpoint**: `GET /api/admin/boosts/fields`

**Description**: Returns all available fields for boosting.

**Authentication**: Required (admin cookie)

**Response**:
```json
{
  "fields": [
    {
      "name": "string",
      "type": "string"
    }
  ]
}
```

---

### 13. Index Management

**Endpoint**: `GET /api/admin/indices`

**Description**: Lists all health-plans indices.

**Authentication**: Required (admin cookie)

**Response**:
```json
{
  "indices": [
    {
      "name": "string",
      "docCount": "number",
      "size": "string",
      "createdDate": "string (ISO 8601)",
      "health": "string",
      "inAlias": "boolean"
    }
  ],
  "alias": "string",
  "totalIndices": "number"
}
```

---

**Endpoint**: `DELETE /api/admin/indices/[name]`

**Description**: Deletes a specific index.

**Authentication**: Required (admin cookie)

**Path Parameters**:
- `name` (required): Index name (must match `health-plans-*` pattern)

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "error": "string (optional)"
}
```

---

### 14. Alias Management

**Endpoint**: `POST /api/admin/aliases`

**Description**: Adds or removes indices from aliases.

**Authentication**: Required (admin cookie)

**Request Body**:
```json
{
  "action": "string (required, add|remove)",
  "index": "string (required)",
  "alias": "string (required)"
}
```

**Response**:
```json
{
  "success": "boolean",
  "message": "string",
  "error": "string (optional)"
}
```

---

## 🧪 Quality Assurance APIs

### 15. Data Quality Analysis

**Endpoint**: `GET /api/qa/data-quality`

**Description**: Performs comprehensive data quality tests.

**Response**:
```json
{
  "timestamp": "string (ISO 8601)",
  "tests": [
    {
      "name": "string",
      "status": "string (PASS|WARNING|FAIL)",
      "details": "object"
    }
  ],
  "summary": {
    "total_tests": "number",
    "passed": "number",
    "warnings": "number",
    "failed": "number",
    "overall_status": "string (PASS|WARNING|FAIL)"
  }
}
```

**Tests Include**:
- Plan ID coverage
- Document URL uniqueness
- State field coverage
- Sample duplicates analysis
- Documents without plan_id
- Collapse behavior testing

---

### 16. QA Reports

**Endpoint**: `GET /api/qa/reports`

**Description**: Retrieves historical QA reports.

**Query Parameters**:
- `limit` (optional): Number of reports to return (default: 10)
- `environment` (optional): Environment filter (default: production)

**Response**:
```json
{
  "reports": [
    {
      "id": "string",
      "timestamp": "string",
      "overallStatus": "string",
      "totalTests": "number",
      "passedTests": "number",
      "failedTests": "number",
      "warningTests": "number",
      "duration": "number",
      "environment": "string"
    }
  ],
  "total": "number",
  "environment": "string"
}
```

---

**Endpoint**: `DELETE /api/qa/reports`

**Description**: Deletes old QA reports.

**Query Parameters**:
- `olderThan` (required): ISO 8601 timestamp
- `environment` (optional): Environment filter

**Response**:
```json
{
  "message": "string",
  "deleted": "number"
}
```

---

### 17. QA Validation

**Endpoint**: `POST /api/qa/validate`

**Description**: Runs full QA validation suite.

**Request Body**:
```json
{
  "environment": "string (optional, default: development)"
}
```

**Response**:
```json
{
  "success": "boolean",
  "report": "object",
  "markdown_report": "string",
  "error": "string (optional)"
}
```

---

**Endpoint**: `GET /api/qa/validate`

**Description**: Describes the QA validation endpoint.

**Response**:
```json
{
  "message": "string",
  "usage": "string",
  "available_tests": "string[]"
}
```

---

## 🕷️ Data Ingestion APIs

### 18. Elastic Crawler

**Endpoint**: `POST /api/crawl`

**Description**: Triggers Elastic Crawler to index documents.

**Response**:
```json
{
  "message": "string",
  "count": "number",
  "crawlerOutput": "string",
  "crawlerErrors": "string",
  "error": "string (optional)"
}
```

---

**Endpoint**: `GET /api/crawl`

**Description**: Describes the crawl endpoint.

**Response**:
```json
{
  "message": "string",
  "usage": "string"
}
```

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 400 | Bad Request |
| 401 | Unauthorized |
| 404 | Not Found |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

## 🔧 Environment Variables

### Required
- `ELASTIC_ENDPOINT`: Elasticsearch serverless endpoint
- `ELASTIC_API_KEY`: Elasticsearch API key

### Optional
- `OPENAI_API_KEY`: OpenAI API key for AI summaries
- `ADMIN_USERNAME`: Admin username (default: "admin")
- `ADMIN_PASSWORD`: Admin password (default: "admin")
- `UPSTASH_REDIS_REST_URL`: Redis URL for caching
- `UPSTASH_REDIS_REST_TOKEN`: Redis token for caching

## 🚀 Rate Limiting

Currently no rate limiting is implemented. Consider implementing rate limiting for production use.

## 📝 Error Handling

All endpoints return consistent error responses:

```json
{
  "error": "string",
  "details": "string (optional)",
  "meta": "object (optional)"
}
```

## 🔗 Related Documentation

- [PROJECT_MASTER.md](./PROJECT_MASTER.md) - Complete project documentation
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System architecture
- [ELASTIC_AGENT_BUILDER_INTEGRATION.md](./ELASTIC_AGENT_BUILDER_INTEGRATION.md) - Agent Builder integration

---

*Last updated: January 2025*
