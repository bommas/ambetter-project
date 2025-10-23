# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Project Overview

**Ambetter Health Plan Search Application**: A full-stack Next.js application for searching and analyzing Texas Ambetter health plans. The system features hybrid search capabilities (lexical + semantic), PDF processing pipeline, analytics dashboard, and plan boosting functionality.

**Current Status**: Phase 1 (Data Indexing) complete with 160 documents indexed in Elasticsearch. Phase 2 (Search UI) in active development.

---

## Common Development Commands

### Running the Application
```bash
# Development server (localhost:3000)
npm run dev

# Production build
npm run build

# Start production server
npm start

# Linting
npm run lint
```

### Testing & QA
```bash
# Run QA tests
npm run qa

# Validate QA in production environment
npm run qa:validate

# Check application health
npm run health
```

### Data Processing Scripts
```bash
# Extract PDF URLs from Ambetter website
node scripts/extract-pdf-urls.js

# Process PDFs and index to Elasticsearch
node scripts/pdf-processor.js

# Run web crawler
bash scripts/run-crawler.sh

# Setup initial environment
bash scripts/setup.sh
```

---

## High-Level Architecture

### Data Flow
1. **PDF Extraction**: Puppeteer scrapes Ambetter website → Extracts PDF URLs
2. **PDF Processing**: Downloads PDFs → Extracts text with pdf-parse → Enriches metadata
3. **Indexing**: Documents indexed to Elasticsearch with enhanced metadata (plan types, counties, variants)
4. **Search**: Next.js app → API routes → Elasticsearch hybrid search (lexical + semantic)
5. **Analytics**: User interactions → Click tracking → Analytics dashboard

### Key Components

**Frontend (Next.js 14 + TypeScript)**
- `/src/app/page.tsx` - Homepage with hero banner and search interface
- `/src/app/search/page.tsx` - Search results page with filtering
- `/src/app/admin/page.tsx` - Admin dashboard for plan management
- `/src/app/qa/page.tsx` - QA testing interface
- `/src/components/` - Reusable React components (AmbetterLogo, etc.)

**API Routes**
- `/src/app/api/search/route.ts` - Hybrid search endpoint with filters
- `/src/app/api/crawl/route.ts` - PDF crawling functionality
- `/src/app/api/health/route.ts` - Health check endpoint
- `/src/app/api/qa/` - QA validation and reporting endpoints

**Backend Services**
- `/src/lib/elasticsearch.ts` - Elasticsearch client configuration and index mappings
- `/src/lib/simple-crawler.ts` - Web crawling utilities
- `/src/lib/qa-agent.ts` - QA testing agent
- `/src/lib/test-utilities.ts` - Testing helper functions

**Data Processing**
- `/scripts/pdf-processor.js` - Core PDF processing pipeline
- `/scripts/extract-pdf-urls.js` - Dynamic PDF URL extraction with pagination
- `/config/app-config.js` - Centralized configuration for all services

---

## Architecture Principles

### 1. Centralized Configuration
**ALL configuration lives in `/config/app-config.js`**. This includes:
- Elasticsearch endpoints and credentials
- Ambetter website URLs
- PDF processing settings
- Puppeteer configuration
- RabbitMQ settings (future use)
- API keys for external services

**NEVER hardcode URLs, API keys, or configuration values in components or scripts.**

### 2. Temporary File Management
PDF processing creates temporary files in **project-contained directory** (`./temp/pdf-processing/`):
- NEVER use system temp directories
- ALWAYS cleanup temp files at script start and end
- ALWAYS handle cleanup in error scenarios (try/catch/finally)
- Use descriptive temp filenames with timestamps

### 3. Enhanced Metadata System
Health plan documents include rich metadata:
- **Plan Types**: TX014, TX016, TX017
- **County Codes**: 0019, 0064, 0100, 0102, 0052, 0020, 0021, 0022, 0023 (primary: 2941)
- **Plan Variants**: 00, 01, 02, 03, 04, 05, 06
- **Document Types**: brochure, evidence_of_coverage, out_of_coverage, summary_of_benefits, policy, disclosure, sbc

### 4. Elasticsearch Index Structure

**Indices:**
- `health-plans` - Health plan documents and metadata
- `search-events` - Search queries and interactions
- `click-events` - User clicks and plan interactions
- `analytics-metrics` - Aggregated analytics data
- `user-sessions` - User session data and behavior

**Key Fields in health-plans:**
- Text fields: `title`, `plan_name`, `extracted_text`, `body`, `pdf.content`
- Keywords: `plan_id`, `plan_type`, `county_code`, `plan_variant`, `state`
- Structured: `plan_details`, `metadata.plan_info`, `pdf` object
- Semantic: `semantic_text`, `semantic_vector` (1536 dims, cosine similarity)

### 5. Hybrid Search Implementation
The search system combines:
- **Lexical search**: Multi-match queries on `title`, `plan_name`, `extracted_text`, `body`, `pdf.content`
- **Phrase search**: Exact phrase matching with boosted scoring
- **Filters**: County, plan type, document type, tobacco use
- **Future**: ELSER semantic search (currently disabled, awaiting model availability)

---

## Design System (Ambetter-Style)

### Brand Colors
```css
--ambetter-magenta: #C61C71;      /* Primary brand color */
--ambetter-pink: #DF87AF;         /* Secondary/hover states */
--ambetter-light-pink: #F7E0EC;   /* Backgrounds, accents */
--text-dark: #333333;             /* Headings */
--text-body: #6E6E6E;             /* Body text */
```

### Component Patterns
- Hero banner with magenta overlay (rgba(198, 28, 113, 0.85))
- White background with alternating light gray sections (#F5F5F5)
- Card components with hover lift effects
- Primary buttons: Magenta background, white text
- Secondary buttons: White background, magenta border
- Responsive design with Tailwind CSS
- Framer Motion for smooth animations

**Reference**: See `AMBETTER_DESIGN_SYSTEM.md` for complete design specifications.

---

## Error Handling & Logging Standards

### Logging Conventions
Use consistent emoji prefixes for different log types:
```javascript
console.log('🚀 Starting operation...')
console.log('✅ Successfully completed')
console.log('❌ Error occurred:', error.message)
console.log('📊 Metrics:', data)
console.log('🔄 Processing:', filename)
console.log('📄 Found PDFs:', count)
console.log('🧹 Cleaned up:', count)
```

### Error Handling
- ALWAYS implement retry logic for external API calls (configured in `app-config.js`)
- ALWAYS log errors with full context and stack traces
- ALWAYS provide meaningful error messages to users
- ALWAYS handle cleanup in error scenarios
- Use appropriate HTTP status codes (400 for bad requests, 500 for server errors)

---

## PDF Processing Workflow

### Step-by-Step Process
1. **URL Extraction** (`extract-pdf-urls.js`):
   - Launches Puppeteer with configured user agent
   - Handles pagination on Ambetter brochures page
   - Extracts PDF URLs from dynamic content
   - Returns array of PDF URLs

2. **PDF Processing** (`pdf-processor.js`):
   - Searches for PDFs in existing crawler data OR uses dynamic extraction
   - Downloads PDFs to temp directory
   - Extracts text using `pdf-parse` library
   - Enriches with metadata (plan type, county, variant, document type)
   - Indexes to Elasticsearch with complete document structure
   - Cleans up temp files

3. **Metadata Enrichment**:
   - Parses filename to extract plan info (TX014-0019-01 format)
   - Determines document type from URL path (/Brochures/, /EOC/, /OOC/, /SBC/)
   - Creates structured `plan_details` and `metadata.plan_info` objects
   - Adds PDF-specific fields (filename, size, extracted_at)

### Important Notes
- PDF processor handles retries automatically (max 2 retries, 3 second delay)
- Cleanup runs at start, end, and on errors
- All temp files use timestamp prefixes to avoid conflicts
- Processing adds delays between requests to avoid rate limiting

---

## Important Files & Their Purpose

### Configuration
- `config/app-config.js` - **SINGLE SOURCE OF TRUTH** for all configuration

### Documentation
- `README.md` - Project overview and quick start
- `PROJECT_REQUIREMENTS.md` - Detailed requirements and architecture diagrams
- `CODING_STANDARDS.md` - Comprehensive coding rules and best practices
- `AMBETTER_DESIGN_SYSTEM.md` - Complete design specifications
- `INDEXING_PROCESS.md` - PDF indexing workflow documentation
- `METADATA_ENHANCEMENTS.md` - Enhanced metadata system details
- `PHASE2_REQUIREMENTS.md` - Phase 2 development requirements

### Key Scripts
- `scripts/pdf-processor.js` - Core PDF processing logic (most important script)
- `scripts/extract-pdf-urls.js` - Dynamic PDF URL extraction with Puppeteer
- `scripts/qa-test.sh` - QA testing automation

---

## Development Best Practices

### When Adding New Features
1. Check if configuration needs to be added to `app-config.js`
2. Follow existing logging patterns with emoji prefixes
3. Implement proper error handling with try/catch
4. Add cleanup logic for any temporary resources
5. Update relevant documentation
6. Test with `npm run qa` before committing

### When Modifying Search
1. Search logic is in `/src/app/api/search/route.ts`
2. Use `buildSearchQuery()` function for query construction
3. Track analytics with `trackSearchEvent()`
4. Test with different filters (county, plan type, document type)
5. Ensure proper field mapping in Elasticsearch

### When Processing New PDFs
1. Ensure URLs follow Ambetter format
2. Test extraction with `extract-pdf-urls.js` first
3. Run `pdf-processor.js` to process and index
4. Verify indexing with health check: `npm run health`
5. Check Elasticsearch count after processing

### When Working with Elasticsearch
1. Client configuration is in `/src/lib/elasticsearch.ts`
2. Index mappings defined as exported constants
3. Use `initializeIndices()` to create missing indices
4. Always use centralized index names from `INDICES` constant
5. Test queries with small datasets first

---

## Common Troubleshooting

### PDF Processing Issues
- **No PDFs found**: Run crawler first or check `extract-pdf-urls.js` output
- **Extraction failures**: Check temp directory cleanup, increase retry delay in config
- **Timeout errors**: Increase `requestTimeout` in `app-config.js`

### Elasticsearch Issues
- **Connection errors**: Verify endpoint and API key in `app-config.js`
- **Index not found**: Run `initializeIndices()` function
- **Mapping conflicts**: Check field types match `HEALTH_PLANS_MAPPING`

### Search Issues
- **No results**: Verify index has documents with `npm run health`
- **Filter not working**: Check field name matches mapping (keyword vs text)
- **Slow queries**: Review query structure, consider adding more specific filters

---

## Phase-Based Development Status

### Phase 1: COMPLETED ✅
- Data indexing pipeline with 160 documents
- Enhanced metadata system
- Centralized configuration
- Elasticsearch integration
- PDF processing with 100% success rate

### Phase 2: IN PROGRESS 🚧
- Next.js search interface ✅
- Hybrid search API ✅
- Filtering and faceted search ✅
- Design matching Ambetter style ✅
- AI summaries (pending)

### Phase 3: PLANNED 📋
- Plan boosting system
- Click tracking functionality
- Authentication and security
- Admin interface for plan management

### Phase 4: PLANNED 📋
- RabbitMQ click stream integration
- Real-time analytics dashboard
- Performance metrics and visualizations
- A/B testing framework

---

## Key Technical Decisions

1. **Elasticsearch as unified data store**: Single source for search, analytics, click stream, and caching
2. **Centralized configuration**: Eliminates hardcoded values, enables easy environment changes
3. **Project-contained temp files**: Avoids system temp conflicts, simplifies cleanup
4. **Hybrid search approach**: Combines lexical (immediate) with semantic (future ELSER integration)
5. **Next.js API routes**: Simplifies architecture by avoiding separate backend service
6. **Metadata enrichment at indexing**: Structured data improves search quality and filtering

---

## Environment Variables

Required environment variables (see `.env.example`):
```bash
# Elasticsearch (defaults in app-config.js)
ELASTIC_ENDPOINT=
ELASTIC_API_KEY=
# OR
ELASTIC_USERNAME=
ELASTIC_PASSWORD=

# External AI Services (optional)
OPENAI_API_KEY=
ANTHROPIC_API_KEY=

# RabbitMQ (future use)
RABBITMQ_HOST=
RABBITMQ_PORT=
RABBITMQ_USERNAME=
RABBITMQ_PASSWORD=

# Application
NODE_ENV=development|production
PORT=3000
LOG_LEVEL=info
```

---

## Additional Resources

- Main README: `README.md`
- Coding Standards: `CODING_STANDARDS.md` (MUST READ for code quality rules)
- Design System: `AMBETTER_DESIGN_SYSTEM.md`
- Project Requirements: `PROJECT_REQUIREMENTS.md` (includes architecture diagrams)

---

**Last Updated**: October 2025
**Project Version**: 1.0.0
**Status**: Active Development
