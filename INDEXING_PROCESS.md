# Ambetter Health Plan PDF Indexing Process

## Overview

This document describes the complete PDF indexing process for the Ambetter Health Plan search application. The process has been significantly improved to handle JavaScript-rendered content and extract all available PDFs from the Ambetter website.

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                           AMBETTER PDF INDEXING PIPELINE                        │
└─────────────────────────────────────────────────────────────────────────────────┘

┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Ambetter      │    │   Puppeteer      │    │   PDF           │    │   Elasticsearch │
│   Website       │───▶│   Browser        │───▶│   Processor     │───▶│   Serverless    │
│   (JavaScript)  │    │   (Headless)     │    │   (Node.js)     │    │   (Cloud)       │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
         │                        │                        │                        │
         │                        │                        │                        │
         ▼                        ▼                        ▼                        ▼
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│ • EPO Brochures │    │ • Dynamic        │    │ • Download      │    │ • health-plans  │
│ • SBC Documents │    │   Content        │    │   PDFs          │    │   Index         │
│ • EOC Policies  │    │   Loading        │    │ • Extract Text  │    │ • 138 Documents │
│ • OOC Disclosures│   │ • Pagination     │    │ • Index Data    │    │ • Full Text     │
│ • 138+ PDFs     │    │   Handling       │    │ • Metadata      │    │   Search        │
└─────────────────┘    └──────────────────┘    └─────────────────┘    └─────────────────┘
```

## Process Flow

### Step 1: Dynamic PDF Discovery
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              PDF DISCOVERY PROCESS                              │
└─────────────────────────────────────────────────────────────────────────────────┘

1. Launch Puppeteer Browser
   ├── Headless Chrome instance
   ├── User agent spoofing
   └── Network request monitoring

2. Navigate to Ambetter Website
   ├── URL: https://www.ambetterhealth.com/en/tx/2025-brochures-epo/#
   ├── Wait for DOM content loaded
   └── Wait for JavaScript execution (10 seconds)

3. Extract PDF Links
   ├── Query all <a href*=".pdf"> elements
   ├── Filter for api.centene.com URLs
   ├── Extract from page content via regex
   └── Handle pagination and "Show All" filters

4. Return Unique PDF URLs
   ├── Remove duplicates
   ├── Clean URL parameters
   └── Return array of 138+ PDF URLs
```

### Step 2: PDF Processing Pipeline
```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                            PDF PROCESSING PIPELINE                             │
└─────────────────────────────────────────────────────────────────────────────────┘

For each PDF URL:
├── 1. Download PDF
│   ├── HTTP GET request with timeout
│   ├── Stream to temporary file
│   └── Handle download errors with retry
│
├── 2. Extract Text Content
│   ├── Use pdftotext (poppler-utils)
│   ├── Extract full text content
│   └── Handle extraction errors gracefully
│
├── 3. Determine Document Type
│   ├── Brochures: /Brochures/2025/
│   ├── SBC: /SBC/2025/ (Summary of Benefits)
│   ├── EOC: /EOC/2025/ (Evidence of Coverage)
│   └── OOC: /OOC/2025/ (Out of Coverage)
│
├── 4. Create Document Structure
│   ├── Basic metadata (title, filename, size)
│   ├── Plan attributes (state, type, county)
│   ├── PDF content (extracted text, filename, size)
│   └── Timestamps (created, updated, indexed)
│
└── 5. Index to Elasticsearch
    ├── health-plans index
    ├── Full text searchable
    ├── Metadata filtering
    └── Vector search ready
```

## Document Types Indexed

### 1. Brochures (1 document)
- **29418PremierTX.pdf** - Main plan brochure

### 2. Summary of Benefits and Coverage - SBC (132 documents)
- **TX014 Series** (42 documents) - Plan variations for different counties
- **TX016 Series** (42 documents) - Plan variations for different counties  
- **TX017 Series** (48 documents) - Plan variations for different counties

### 3. Evidence of Coverage - EOC (3 documents)
- **29418TX014.pdf** - Coverage details for TX014 series
- **29418TX016.pdf** - Coverage details for TX016 series
- **29418TX017.pdf** - Coverage details for TX017 series

### 4. Out of Coverage - OOC (2 documents)
- **29418TX014-OC.pdf** - Out of coverage details for TX014
- **29418TX017-OC.pdf** - Out of coverage details for TX017

## Technical Implementation

### Key Technologies
- **Puppeteer**: Headless browser for JavaScript-rendered content
- **Node.js**: PDF processing and Elasticsearch integration
- **pdftotext**: PDF text extraction (poppler-utils)
- **Elasticsearch Serverless**: Cloud-based search and analytics
- **Axios**: HTTP client for PDF downloads

### Key Features
- **Dynamic Discovery**: No hardcoded PDF URLs
- **JavaScript Handling**: Properly handles SPA content loading
- **Error Resilience**: Retry logic and graceful error handling
- **Metadata Extraction**: Rich document metadata for filtering
- **Scalable Processing**: Handles 138+ documents efficiently

## File Structure

```
scripts/
├── extract-pdf-urls.js    # Puppeteer-based PDF discovery
├── pdf-processor.js       # PDF download and indexing
└── run_pipeline.py        # Orchestration script

crawler-config.yml         # Elastic Crawler configuration
docker-compose.yml         # Docker services (RabbitMQ, Crawler)
```

## Usage

### Run Complete Pipeline
```bash
python run_pipeline.py
```

### Run PDF Discovery Only
```bash
node scripts/extract-pdf-urls.js
```

### Run PDF Processing Only
```bash
node scripts/pdf-processor.js
```

## Results

- **Total Documents Indexed**: 138
- **Document Types**: 4 (Brochures, SBC, EOC, OOC)
- **Success Rate**: 100%
- **Processing Time**: ~15-20 minutes
- **Search Capabilities**: Full-text search, metadata filtering, vector search ready

## Next Steps

1. **Search Interface**: Build React frontend for searching
2. **Analytics**: Implement click tracking and search analytics
3. **Semantic Search**: Add vector embeddings for semantic search
4. **Real-time Updates**: Set up automated re-indexing
5. **Performance Optimization**: Implement caching and optimization

## Troubleshooting

### Common Issues
1. **PDF Download Timeouts**: Increased timeout to 30 seconds
2. **JavaScript Rendering**: Added 10-second wait for content loading
3. **Duplicate URLs**: Implemented deduplication logic
4. **Memory Issues**: Process PDFs sequentially with delays

### Monitoring
- Check Elasticsearch index count: `GET /health-plans/_count`
- Verify document structure: `GET /health-plans/_search?size=1`
- Monitor processing logs for errors and retries
