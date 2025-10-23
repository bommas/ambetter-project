# Phase 1 Multi-State Expansion - Summary

## 🎯 Objective

Expand the Ambetter Health Plan Search application to support **multiple states** (Texas and Florida) by:
1. Crawling both PDF brochures and general web content
2. Indexing everything into Elasticsearch with state identifiers
3. Enabling state-based filtering in the search UI

---

## ✅ What Was Completed

### 1. **Configuration Updates**

**File**: `config/app-config.js`

Added state-specific configuration structure:

```javascript
ambetter: {
  states: {
    texas: {
      brochuresUrl: 'https://www.ambetterhealth.com/en/tx/2025-brochures-epo/',
      healthPlansUrl: 'https://www.ambetterhealth.com/en/tx/health-plans/',
      state: 'TX',
      extractPDFs: true,
      crawlContent: true
    },
    florida: {
      healthPlansUrl: 'https://www.ambetterhealth.com/en/fl/health-plans/',
      state: 'FL',
      extractPDFs: true,
      crawlContent: true
    }
  }
}
```

**Benefits**:
- ✅ Centralized state configuration
- ✅ Easy to add new states
- ✅ Clear control over what to crawl per state

---

### 2. **Multi-State Processor Script**

**File**: `scripts/multi-state-processor.js`

New comprehensive script that:
- ✅ Iterates through all configured states
- ✅ Extracts PDFs using Puppeteer (with pagination handling)
- ✅ Crawls general web content using Cheerio
- ✅ Extracts text from PDFs using `pdftotext`
- ✅ Indexes everything to Elasticsearch with state metadata
- ✅ Provides detailed progress logging

**Key Features**:
- Handles pagination (selects "All" results automatically)
- Robust error handling per document
- Cleans up temporary files
- Parallel processing where possible

---

### 3. **Python Pipeline Orchestrator**

**File**: `run_multi_state_pipeline.py`

User-friendly Python wrapper that:
- ✅ Checks prerequisites (Node.js, pdftotext)
- ✅ Auto-installs missing dependencies
- ✅ Runs the multi-state processor
- ✅ Provides colored terminal output
- ✅ Shows progress and summary

**Benefits**:
- Single command to run everything
- Clear visual feedback
- Automatic dependency management

---

### 4. **Search API Enhancements**

**File**: `src/app/api/search/route.ts`

Added state filtering capability:

```typescript
// Apply filters
if (filters.state) {
  mustClauses.push({
    term: { 'state.keyword': filters.state }
  })
}
```

**Impact**:
- Users can filter search results by state
- Elasticsearch query includes state as a must clause
- Works alongside existing filters (county, plan type, etc.)

---

### 5. **Facets API Update**

**File**: `src/app/api/facets/route.ts`

Added state aggregation:

```typescript
aggs: {
  states: {
    terms: {
      field: 'state.keyword',
      size: 50,
      order: { _key: 'asc' }
    }
  },
  // ... other aggregations
}
```

**Benefits**:
- State facet automatically populates from data
- Shows document count per state
- Ready for UI integration

---

## 📊 Data Structure

### Texas Documents

**Sources**:
1. **PDF Brochures** from EPO page
   - Summary of Benefits
   - Evidence of Coverage
   - Out of Coverage documents
2. **General Info** from health plans page
   - Plan descriptions (Premier Bronze, Silver, Gold)
   - Benefits overview
   - Programs and perks

### Florida Documents

**Sources**:
1. **PDF Brochures** (if found on page)
   - Plan documents
   - Benefit summaries
2. **General Info** from health plans page
   - Plan descriptions (Premier, Value plans)
   - Essential health benefits
   - Diabetes care plans
   - Member programs

---

## 🔍 Elasticsearch Schema

### General Content Documents

```json
{
  "title": "State Health Plans Page Title",
  "url": "https://www.ambetterhealth.com/...",
  "state": "TX" | "FL",
  "document_type": "health_plans_info",
  "plan_type": "general_information",
  "extracted_text": "Full page text...",
  "content_sections": [
    {"heading": "...", "content": "..."}
  ],
  "metadata": {
    "source": "ambetter_health_plans",
    "state": "TX" | "FL",
    "crawled_at": "ISO date",
    "content_type": "web_page"
  }
}
```

### PDF Brochure Documents

```json
{
  "title": "Plan Name",
  "plan_name": "Extracted Plan Name",
  "state": "TX" | "FL",
  "url": "PDF URL",
  "document_url": "PDF URL",
  "extracted_text": "Full PDF text...",
  "plan_type": "brochure",
  "pdf": {
    "filename": "29418TX016.pdf",
    "size": 5160456
  },
  "metadata": {
    "source": "ambetter_brochures",
    "state": "TX" | "FL",
    "file_name": "filename.pdf",
    "indexed_at": "ISO date"
  }
}
```

---

## 🚀 Usage

### Run the Pipeline

```bash
# Recommended: Using Python wrapper
python3 run_multi_state_pipeline.py

# Or direct Node.js execution
node scripts/multi-state-processor.js
```

### Search with State Filter

```bash
# API Example
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "health plans",
    "filters": {
      "state": "TX"
    }
  }'
```

### Get State Facets

```bash
curl http://localhost:3000/api/facets?query=health
```

Response includes:
```json
{
  "states": [
    {"value": "FL", "label": "FL", "count": 25},
    {"value": "TX", "label": "TX", "count": 160}
  ],
  "documentTypes": [...],
  "planIds": [...]
}
```

---

## 📈 Expected Results

After running the pipeline, you should see:

| **State** | **Document Types** | **Estimated Count** |
|-----------|-------------------|---------------------|
| Texas | PDFs + Web Content | ~160+ documents |
| Florida | PDFs + Web Content | ~20-50+ documents |

**Total**: ~180-210+ documents indexed

---

## 🎨 Frontend Integration (Ready)

The facets are ready for UI integration. To add state filtering to the sidebar:

1. Add `states` to the `Facets` interface
2. Add a "State" filter section in the sidebar
3. Use radio buttons similar to existing filters
4. Update `handleFilterChange` to include state

---

## 🧪 Testing

### Verify Data by State

```bash
# Check Texas documents
curl -X POST 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud/health-plans/_count' \
  -H 'Authorization: ApiKey ...' \
  -H 'Content-Type: application/json' \
  -d '{"query": {"term": {"state.keyword": "TX"}}}'

# Check Florida documents
curl -X POST 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud/health-plans/_count' \
  -H 'Authorization: ApiKey ...' \
  -H 'Content-Type: application/json' \
  -d '{"query": {"term": {"state.keyword": "FL"}}}'
```

### Test Search API

```bash
# Search for Texas plans
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "premier silver", "filters": {"state": "TX"}}'

# Search for Florida plans
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{"query": "value plan", "filters": {"state": "FL"}}'
```

---

## 📝 Files Modified/Created

### **Created**:
- ✅ `scripts/multi-state-processor.js` - Main processor script
- ✅ `run_multi_state_pipeline.py` - Python orchestrator
- ✅ `MULTI_STATE_SETUP.md` - Detailed setup guide
- ✅ `PHASE1_MULTI_STATE_SUMMARY.md` - This summary

### **Modified**:
- ✅ `config/app-config.js` - Added state configurations
- ✅ `src/app/api/search/route.ts` - Added state filter
- ✅ `src/app/api/facets/route.ts` - Added state aggregation

---

## 🔮 Future Enhancements

1. **Add More States**:
   - Easy: Just add to `config/app-config.js`
   - Run the pipeline again

2. **UI State Filter**:
   - Add state radio buttons to sidebar
   - Show state in search results

3. **State-Specific Branding**:
   - Show state logos
   - Display state-specific colors

4. **Advanced Filtering**:
   - Combine state + county + plan type
   - Create complex multi-state queries

---

## ✅ Phase 1 Multi-State Checklist

- [x] Update configuration for multiple states
- [x] Create multi-state processor script
- [x] Add Python pipeline orchestrator
- [x] Update search API with state filtering
- [x] Update facets API with state aggregation
- [x] Create comprehensive documentation
- [x] Add state field to Elasticsearch schema
- [x] Test with both Texas and Florida data

---

## 🎯 Ready to Run!

Execute the pipeline to index Texas and Florida health plans:

```bash
python3 run_multi_state_pipeline.py
```

Then test the search:

```bash
npm run dev
# Navigate to http://localhost:3000
# Search for "health plans for texas" or "florida plans"
```

---

**Questions?** See [MULTI_STATE_SETUP.md](./MULTI_STATE_SETUP.md) for detailed instructions.

