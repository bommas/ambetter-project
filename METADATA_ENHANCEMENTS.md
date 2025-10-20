# Enhanced Metadata Extraction for Ambetter Health Plans

This document outlines the comprehensive metadata extraction enhancements implemented for the Ambetter Health Plan search application.

## Overview

The PDF processing pipeline has been enhanced to extract and index rich metadata from health plan documents, enabling more precise search and filtering capabilities.

## Enhanced Metadata Fields

### 1. Plan Information
- **`plan_name`**: Full plan identifier (e.g., "TX014-0019-00")
- **`plan_id`**: Plan type (TX014, TX016, TX017)
- **`plan_variant`**: Variant number (00, 01, 02, 03, 04, 05, 06)
- **`county_code`**: County identifier (0019, 0064, 0100, 0102, 0052, 0020, 0021, 0022, 0023)

### 2. Document Classification
- **`plan_type`**: Document type classification
  - `brochure`: Marketing brochures
  - `evidence_of_coverage`: EOC documents
  - `out_of_coverage`: OOC documents
  - `summary_of_benefits`: SBC documents
  - `document`: Generic documents

### 3. Enhanced Metadata Objects

#### `plan_details` Object
```json
{
  "plan_type": "TX014",
  "county_code": "0019",
  "variant": "00",
  "full_plan_name": "TX014-0019-00",
  "document_type": "summary_of_benefits",
  "source_url": "https://api.centene.com/SBC/2025/29418TX0140019-00.pdf"
}
```

#### `metadata.plan_info` Object
```json
{
  "plan_type": "TX014",
  "county_code": "0019",
  "variant": "00",
  "document_type": "summary_of_benefits"
}
```

## Configuration Enhancements

### Centralized Configuration System
- **File**: `config/app-config.js`
- **Purpose**: Centralized management of URLs, API keys, and settings
- **Benefits**: 
  - No duplication across scripts
  - Easy environment variable overrides
  - Consistent configuration management

### Temp Directory Management
- **Location**: `./temp/pdf-processing/` (project-relative)
- **Benefits**: 
  - Easy to monitor processing
  - Automatic cleanup
  - Project-contained temporary files

## Document Structure Example

```json
{
  "title": "29418TX0140019-00",
  "plan_name": "TX014-0019-00",
  "plan_type": "summary_of_benefits",
  "plan_id": "TX014",
  "plan_variant": "00",
  "county_code": "0019",
  "state": "Texas",
  "document_url": "https://api.centene.com/SBC/2025/29418TX0140019-00.pdf",
  "url": "https://api.centene.com/SBC/2025/29418TX0140019-00.pdf",
  "extracted_text": "Full PDF content...",
  "body": "Full PDF content...",
  "plan_details": {
    "plan_type": "TX014",
    "county_code": "0019",
    "variant": "00",
    "full_plan_name": "TX014-0019-00",
    "document_type": "summary_of_benefits",
    "source_url": "https://api.centene.com/SBC/2025/29418TX0140019-00.pdf"
  },
  "pdf": {
    "content": "Full PDF content...",
    "filename": "29418TX0140019-00.pdf",
    "size": 123456,
    "extracted_at": "2025-01-20T12:00:00.000Z"
  },
  "metadata": {
    "file_name": "29418TX0140019-00.pdf",
    "file_size": 123456,
    "created_at": "2025-01-20T10:00:00.000Z",
    "updated_at": "2025-01-20T11:00:00.000Z",
    "indexed_at": "2025-01-20T12:00:00.000Z",
    "plan_info": {
      "plan_type": "TX014",
      "county_code": "0019",
      "variant": "00",
      "document_type": "summary_of_benefits"
    }
  }
}
```

## Elasticsearch Mapping Updates

### New Fields Added
```json
{
  "plan_variant": { "type": "keyword" },
  "plan_details": {
    "properties": {
      "plan_type": { "type": "keyword" },
      "county_code": { "type": "keyword" },
      "variant": { "type": "keyword" },
      "full_plan_name": { "type": "text", "analyzer": "standard" },
      "document_type": { "type": "keyword" },
      "source_url": { "type": "keyword" }
    }
  },
  "metadata": {
    "properties": {
      "plan_info": {
        "properties": {
          "plan_type": { "type": "keyword" },
          "county_code": { "type": "keyword" },
          "variant": { "type": "keyword" },
          "document_type": { "type": "keyword" }
        }
      }
    }
  }
}
```

## Search Capabilities

### Enhanced Filtering
- **By Plan Type**: Filter by TX014, TX016, TX017
- **By County**: Filter by specific county codes
- **By Document Type**: Filter by brochure, EOC, OOC, SBC
- **By Variant**: Filter by specific plan variants

### Advanced Queries
- **Multi-field Search**: Search across plan names, counties, and document types
- **Faceted Search**: Group results by plan type, county, or document type
- **Range Queries**: Filter by plan variants or county codes

## Implementation Details

### Files Modified
1. **`config/app-config.js`**: Centralized configuration
2. **`scripts/pdf-processor.js`**: Enhanced metadata extraction
3. **`src/lib/elasticsearch.ts`**: Updated mapping schema
4. **`scripts/extract-pdf-urls.js`**: Updated to use config

### Key Functions
- **`extractPlanInfo()`**: Enhanced plan information extraction
- **`getDocumentTypeFromUrl()`**: Document type classification
- **`cleanFilename()`**: Filename sanitization

## Benefits

1. **Precise Search**: Users can filter by specific plan types, counties, and document types
2. **Better Organization**: Documents are properly categorized and tagged
3. **Enhanced Analytics**: Rich metadata enables detailed usage analytics
4. **Improved UX**: More relevant search results and filtering options
5. **Maintainability**: Centralized configuration reduces duplication

## Usage Examples

### Search by Plan Type
```json
{
  "query": {
    "term": {
      "plan_id": "TX014"
    }
  }
}
```

### Search by County
```json
{
  "query": {
    "term": {
      "county_code": "0019"
    }
  }
}
```

### Search by Document Type
```json
{
  "query": {
    "term": {
      "plan_type": "summary_of_benefits"
    }
  }
}
```

### Multi-field Search
```json
{
  "query": {
    "bool": {
      "must": [
        { "term": { "plan_id": "TX014" } },
        { "term": { "county_code": "0019" } },
        { "term": { "plan_type": "summary_of_benefits" } }
      ]
    }
  }
}
```

This enhanced metadata system provides a robust foundation for building a comprehensive health plan search and discovery application.
