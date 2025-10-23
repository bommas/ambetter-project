# Multi-State Health Plans Setup Guide

## 🌎 Overview

This application now supports **multi-state health plan data** from:
- **Texas (TX)**: PDF brochures + General health plans info
- **Florida (FL)**: PDF brochures + General health plans info

## 📋 Configuration

All state-specific URLs are configured in `config/app-config.js`:

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

## 🚀 Running the Multi-State Pipeline

### Option 1: Python Wrapper (Recommended)

```bash
python3 run_multi_state_pipeline.py
```

**What it does:**
1. ✅ Checks prerequisites (Node.js, pdftotext)
2. ✅ Installs missing dependencies
3. ✅ Runs the multi-state processor
4. ✅ Provides progress tracking
5. ✅ Shows summary and next steps

### Option 2: Direct Node.js Execution

```bash
node scripts/multi-state-processor.js
```

## 📊 Data Sources

### Texas (TX)

| **Source** | **URL** | **Type** | **Description** |
|------------|---------|----------|-----------------|
| EPO Brochures | [ambetterhealth.com/en/tx/2025-brochures-epo/](https://www.ambetterhealth.com/en/tx/2025-brochures-epo/) | PDFs | Plan brochures, summaries, evidence of coverage |
| Health Plans Info | [ambetterhealth.com/en/tx/health-plans/](https://www.ambetterhealth.com/en/tx/health-plans/) | Web Content | General information about TX plans |

**What gets indexed:**
- ✅ PDF brochures (Summary of Benefits, Evidence of Coverage, etc.)
- ✅ Plan descriptions (Premier Bronze, Silver, Gold)
- ✅ Benefits information
- ✅ Coverage details

### Florida (FL)

| **Source** | **URL** | **Type** | **Description** |
|------------|---------|----------|-----------------|
| Health Plans Page | [ambetterhealth.com/en/fl/health-plans/](https://www.ambetterhealth.com/en/fl/health-plans/) | PDFs + Web Content | Plan brochures and general info |

**What gets indexed:**
- ✅ PDF brochures (if found on the page)
- ✅ Plan descriptions (Premier Bronze, Silver, Gold)
- ✅ Value plan information
- ✅ Benefits information (Essential Health Benefits, Diabetes Care, etc.)
- ✅ Member exclusive programs

## 🔍 Search Filtering by State

The application now supports state filtering:

```bash
# Search for plans in Texas only
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "health plans",
    "filters": {
      "state": "TX"
    }
  }'

# Search for plans in Florida only
curl -X POST http://localhost:3000/api/search \
  -H "Content-Type: application/json" \
  -d '{
    "query": "health plans",
    "filters": {
      "state": "FL"
    }
  }'
```

## 📈 Facets Available

After running the pipeline, the following facets will be available:

1. **State** (TX, FL)
2. **Document Type** (Summary of Benefits, Evidence of Coverage, etc.)
3. **Plan ID** (TX014, TX016, TX017, FL-specific plans)
4. **County** (if available in the data)

## 🛠️ How It Works

### Step-by-Step Process

```
┌─────────────────────────────────────────────────────────┐
│  1. Configuration Loading                                │
│     • Read state configs from app-config.js             │
│     • Prepare Elasticsearch connection                  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  2. For Each State (TX, FL)                             │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2a. Crawl General Content                        │  │
│  │     • Load health plans page                     │  │
│  │     • Extract headings, paragraphs, descriptions │  │
│  │     • Index as "health_plans_info" document      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2b. Extract PDFs                                 │  │
│  │     • Use Puppeteer to load brochures page       │  │
│  │     • Handle pagination (select "All" if needed) │  │
│  │     • Extract all PDF links                      │  │
│  └──────────────────────────────────────────────────┘  │
│                                                          │
│  ┌──────────────────────────────────────────────────┐  │
│  │ 2c. Process PDFs                                 │  │
│  │     • Download each PDF                          │  │
│  │     • Extract text using pdftotext               │  │
│  │     • Parse plan name from content               │  │
│  │     • Index to Elasticsearch                     │  │
│  │     • Clean up temporary files                   │  │
│  └──────────────────────────────────────────────────┘  │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│  3. Summary & Verification                               │
│     • Show total documents indexed per state            │
│     • Display duration                                  │
│     • Provide next steps                                │
└─────────────────────────────────────────────────────────┘
```

## 📝 Document Structure

### General Health Plans Info

```json
{
  "title": "Florida Health Plans | Ambetter from Sunshine Health",
  "url": "https://www.ambetterhealth.com/en/fl/health-plans/",
  "state": "FL",
  "document_type": "health_plans_info",
  "plan_type": "general_information",
  "extracted_text": "Ambetter Health offers reliable health insurance plans...",
  "content_sections": [
    {
      "heading": "Ambetter Health Premier",
      "content": "Available for 2025 coverage..."
    }
  ],
  "metadata": {
    "source": "ambetter_health_plans",
    "state": "FL",
    "crawled_at": "2025-10-22T18:30:00.000Z",
    "content_type": "web_page"
  }
}
```

### PDF Brochure Documents

```json
{
  "title": "Ambetter + Adult Vision",
  "plan_name": "Ambetter + Adult Vision",
  "state": "TX",
  "url": "https://www.ambetterhealth.com/.../29418TX016.pdf",
  "document_url": "https://www.ambetterhealth.com/.../29418TX016.pdf",
  "extracted_text": "2025 MAJOR MEDICAL EXPENSE POLICY Ambetter + Adult Vision...",
  "plan_type": "brochure",
  "pdf": {
    "filename": "29418TX016.pdf",
    "size": 5160456
  },
  "metadata": {
    "source": "ambetter_brochures",
    "state": "TX",
    "file_name": "29418TX016.pdf",
    "indexed_at": "2025-10-22T18:30:00.000Z"
  }
}
```

## 🔧 Adding More States

To add a new state (e.g., California):

1. **Update config/app-config.js:**

```javascript
california: {
  healthPlansUrl: 'https://www.ambetterhealth.com/en/ca/health-plans/',
  brochuresUrl: 'https://www.ambetterhealth.com/en/ca/2025-brochures/', // if available
  state: 'CA',
  extractPDFs: true,
  crawlContent: true
}
```

2. **Run the pipeline:**

```bash
python3 run_multi_state_pipeline.py
```

That's it! The processor will automatically crawl the new state.

## 🐛 Troubleshooting

### Issue: No PDFs found for Florida

**Solution**: The Florida page may not have a dedicated brochures page. The script will:
- Extract any PDFs found on the health plans page
- Crawl the general content regardless

### Issue: pdftotext not found

**Solution**:
```bash
# macOS
brew install poppler

# Linux
sudo apt-get install poppler-utils
```

### Issue: Puppeteer fails to launch

**Solution**:
```bash
# Install dependencies (Linux)
sudo apt-get install -y libx11-xcb1 libxcomposite1 libxcursor1 libxdamage1 libxi6 libxtst6 libnss3 libcups2 libxss1 libxrandr2 libasound2 libpangocairo-1.0-0 libatk1.0-0 libatk-bridge2.0-0 libgtk-3-0
```

## 📊 Verify Indexed Data

```bash
# Check total documents
curl -X GET 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud/health-plans/_count' \
  -H 'Authorization: ApiKey Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ=='

# Check by state
curl -X POST 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud/health-plans/_search' \
  -H 'Authorization: ApiKey Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ==' \
  -H 'Content-Type: application/json' \
  -d '{
    "size": 0,
    "aggs": {
      "by_state": {
        "terms": {"field": "state.keyword"}
      }
    }
  }'
```

## 🎯 Next Steps

1. ✅ Run the pipeline: `python3 run_multi_state_pipeline.py`
2. ✅ Verify data is indexed
3. ✅ Start the web app: `npm run dev`
4. ✅ Test search with state filters
5. ✅ Deploy to Vercel (if needed)

---

**Need help?** Check the main [README.md](./README.md) or [PHASE2_REQUIREMENTS.md](./PHASE2_REQUIREMENTS.md)

