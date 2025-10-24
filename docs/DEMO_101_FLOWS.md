# Ambetter Project - Demo 101 Flow Diagrams

**Version**: 1.0  
**Last Updated**: October 23, 2025  
**Purpose**: Simple flow diagrams for demo presentations

---

## 🎯 Demo Overview

This document contains simplified flow diagrams perfect for demonstrating the Ambetter Health Plan Search Application to stakeholders, clients, or new team members.

---

## 📱 User Journey Flows

### 1. Basic Search Flow (End User)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        USER SEARCH JOURNEY                          │
│                                                                      │
│  Step 1: User visits homepage                                       │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🌐 ambetter-project.vercel.app                            │    │
│  │                                                             │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  🔍 Search for health plans...                      │    │    │
│  │  │  [Semantic] [Keyword] [Search]                      │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  Step 2: User enters query                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  Query: "texas gold health plans"                          │    │
│  │  Mode: Semantic (AI-powered)                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  Step 3: System processes search                                   │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔍 Elasticsearch finds matching plans                     │    │
│  │  🤖 AI analyzes results for relevance                      │    │
│  │  📊 Filters by state, plan type, county                    │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  Step 4: Results displayed                                          │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📋 30 results found (showing 1-30 of 910)                │    │
│  │                                                             │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  🏥 Ambetter Essential Care - 29418TX016-2025      │    │    │
│  │  │  Gold EPO plan with comprehensive coverage...       │    │    │
│  │  │  [View PDF] [Learn More]                            │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  │                                                             │    │
│  │  [Show AI Summary] ← Optional AI-powered comparison        │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 2. AI Summary Flow (Optional)

```
┌─────────────────────────────────────────────────────────────────────┐
│                        AI SUMMARY JOURNEY                           │
│                                                                      │
│  User clicks "Show AI Summary" button                               │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔄 Checking cache...                                      │    │
│  │  (Previous similar queries are cached for speed)           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🤖 Sending to OpenAI GPT-4o-mini...                       │    │
│  │  • Top 3 search results as context                         │    │
│  │  • Ambetter Assistant prompt                               │    │
│  │  • Personalized plan comparison                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📋 AI Summary Generated                                   │    │
│  │                                                             │    │
│  │  "Based on your search for Texas Gold plans, here are      │    │
│  │   the top recommendations:                                  │    │
│  │                                                             │    │
│  │  1. Ambetter Essential Care - Best value for families      │    │
│  │  2. Ambetter Superior Health - Premium coverage            │    │
│  │  3. Ambetter Adult Vision - Specialized care               │    │
│  │                                                             │    │
│  │  Trade-offs: Essential Care has lower premiums but         │    │
│  │  higher deductibles. Superior Health offers more           │    │
│  │  comprehensive coverage at a higher cost."                 │    │
│  │                                                             │    │
│  │  Sources: [Plan 1] [Plan 2] [Plan 3]                      │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  💾 Cached for future similar queries                      │    │
│  │  (Saves time and API costs)                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 3. Admin Management Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                      ADMIN MANAGEMENT JOURNEY                       │
│                                                                      │
│  Step 1: Admin login                                                │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔐 Admin Login                                            │    │
│  │  Username: admin                                           │    │
│  │  Password: admin                                           │    │
│  │  [Login]                                                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  Step 2: Choose admin function                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📊 Admin Dashboard                                        │    │
│  │                                                             │    │
│  │  [New Documents] [Indices] [Curations] [Boosting]          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  Step 3A: Add new state data                                        │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📥 New Documents Tab                                      │    │
│  │                                                             │    │
│  │  URL: https://ambetter.com/ca/brochures/                   │    │
│  │  State: CA                                                 │    │
│  │  Version: 2025-11                                          │    │
│  │  [Start Indexing]                                          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔄 Processing...                                          │    │
│  │  • Crawling California health plan pages                   │    │
│  │  • Extracting PDF documents                                │    │
│  │  • Indexing to health-plans-ca-2025-11                    │    │
│  │  • Adding to search alias                                  │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  ✅ Success!                                               │    │
│  │  • 450 documents indexed                                   │    │
│  │  • Index: health-plans-ca-2025-11                         │    │
│  │  • Available for search immediately                        │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔧 System Architecture Flows

### 4. Data Ingestion Pipeline

```
┌─────────────────────────────────────────────────────────────────────┐
│                      DATA INGESTION PIPELINE                        │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📥 INPUT: Ambetter State URL                              │    │
│  │  Example: ambetter.com/tx/2025-brochures-epo/             │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🕷️  STEP 1: Web Crawling                                 │    │
│  │  Tool: Puppeteer (Headless Chrome)                         │    │
│  │                                                             │    │
│  │  • Navigate to Ambetter page                               │    │
│  │  • Set pagination to "All" (get all PDFs)                  │    │
│  │  • Extract PDF URLs and metadata                           │    │
│  │  • Output: List of 20+ PDF URLs                            │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📄 STEP 2: PDF Processing                                 │    │
│  │  Tool: pdftotext (Poppler Utils)                           │    │
│  │                                                             │    │
│  │  For each PDF:                                              │    │
│  │  • Download to /tmp/temp-{timestamp}.pdf                   │    │
│  │  • Extract text with layout preservation                   │    │
│  │  • Parse plan details (ID, name, county, type)             │    │
│  │  • Clean up temporary files                                │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🗄️  STEP 3: Elasticsearch Indexing                       │    │
│  │  Target: health-plans-{state}-{version}                   │    │
│  │                                                             │    │
│  │  Document Structure:                                        │    │
│  │  {                                                           │    │
│  │    "plan_id": "29418TX016-2025",                           │    │
│  │    "plan_name": "Ambetter Essential Care",                 │    │
│  │    "state": "TX",                                           │    │
│  │    "extracted_text": "full PDF content...",                │    │
│  │    "document_url": "https://...",                           │    │
│  │    "extracted_text_semantic": "ELSER vectors..."           │    │
│  │  }                                                           │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔗 STEP 4: Alias Management                               │    │
│  │  Add to 'health-plans' alias                               │    │
│  │                                                             │    │
│  │  health-plans (alias) →                                    │    │
│  │    ├── health-plans-tx-2025-10  (302 docs)               │    │
│  │    ├── health-plans-fl-2025-10  (242 docs)               │    │
│  │    └── health-plans-ca-2025-11  (450 docs) ← NEW         │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

### 5. Search Processing Flow

```
┌─────────────────────────────────────────────────────────────────────┐
│                        SEARCH PROCESSING FLOW                       │
│                                                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔍 USER QUERY: "texas gold health plans"                 │    │
│  │  Mode: Semantic (AI-powered)                               │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🧠 QUERY PROCESSING                                       │    │
│  │                                                             │    │
│  │  • State Detection: "texas" → filter by state:TX          │    │
│  │  • Load Curations: Check for pinned/excluded docs          │    │
│  │  • Load Boosts: Apply field weights                        │    │
│  │  • Mode Selection: Semantic vs Keyword                     │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  🔍 HYBRID SEARCH QUERY                                    │    │
│  │  Elasticsearch Query Components:                           │    │
│  │                                                             │    │
│  │  A. LEXICAL SEARCH (Keyword Matching)                     │    │
│  │     • multi_match across text fields                       │    │
│  │     • phrase search for exact matches                      │    │
│  │     • wildcard search for flexibility                      │    │
│  │                                                             │    │
│  │  B. SEMANTIC SEARCH (ELSER)                                │    │
│  │     • extracted_text_semantic (boost: 2.0)                 │    │
│  │     • body_semantic (boost: 1.5)                           │    │
│  │     • pdf_semantic (boost: 1.5)                            │    │
│  │                                                             │    │
│  │  C. FILTERING & DEDUPLICATION                              │    │
│  │     • State filter: TX only                                │    │
│  │     • Collapse by plan_id (unique plans)                   │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📊 RESULT PROCESSING                                      │    │
│  │                                                             │    │
│  │  • Apply Curations (pins to top, exclude unwanted)         │    │
│  │  • Extract Plan Names (human-readable)                     │    │
│  │  • Format Results (metadata, URLs)                         │    │
│  │  • Generate Facets (states, counties, plan types)          │    │
│  └─────────────────────────────────────────────────────────────┘    │
│                              ↓                                      │
│  ┌─────────────────────────────────────────────────────────────┐    │
│  │  📱 DISPLAY RESULTS (30 per page)                          │    │
│  │                                                             │    │
│  │  ┌─────────────────────────────────────────────────────┐    │    │
│  │  │  Filters                    Results                  │    │    │
│  │  │  ┌──────────┐              ┌─────────────────────┐   │    │    │
│  │  │  │ States   │              │ Plan Name - Plan ID │   │    │    │
│  │  │  │ • TX ✓   │              │ Description...      │   │    │    │
│  │  │  │ • FL     │              │ [View PDF]          │   │    │    │
│  │  │  │          │              └─────────────────────┘   │    │    │
│  │  │  │ Plan Type│              [Show AI Summary] ←opt   │    │    │
│  │  │  │ • EPO    │                                        │    │    │
│  │  │  │ • HMO    │              (30 of 910 results)       │    │    │
│  │  │  └──────────┘                                        │    │    │
│  │  └─────────────────────────────────────────────────────┘    │    │
│  └─────────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🎯 Demo Scenarios

### Scenario 1: "Show me Texas Gold plans"
```
User Journey:
1. Visit homepage → Enter "texas gold plans" → Click Search
2. See 30 results with Texas Gold EPO/HMO plans
3. Click "Show AI Summary" → Get personalized comparison
4. Click "View PDF" → Download plan brochure
```

### Scenario 2: "Find Florida EPO plans"
```
User Journey:
1. Enter "florida epo" → Select Keyword mode → Search
2. See Florida EPO plans with filters
3. Use state filter to narrow to FL only
4. Compare different plan tiers
```

### Scenario 3: "Admin adds California data"
```
Admin Journey:
1. Login to admin panel
2. Go to "New Documents" tab
3. Enter CA brochure URL + state + version
4. Watch indexing progress
5. Verify new data appears in search
```

---

## 📊 Key Metrics to Highlight

### Performance Metrics
- **Search Speed**: < 500ms average response time
- **Indexing Speed**: ~50 PDFs per minute
- **Cache Hit Rate**: 80%+ for AI summaries
- **Uptime**: 99.9% (Vercel + Elasticsearch)

### Data Metrics
- **Total Documents**: 1,292+ health plans
- **States Covered**: TX, FL, CA (expandable)
- **Document Types**: EPO, HMO brochures
- **Search Modes**: Keyword + Semantic (ELSER)

### User Experience
- **Results per Page**: 30 (Google-like)
- **AI Summary**: Opt-in, cached for performance
- **Mobile Responsive**: Works on all devices
- **Admin Controls**: Full index management

---

## 🔗 Related Documentation

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** - Detailed technical architecture
- **[PROJECT_MASTER.md](./PROJECT_MASTER.md)** - Complete project documentation
- **[README.md](./README.md)** - Quick start guide

---

**Perfect for**: Stakeholder demos, client presentations, team onboarding, technical reviews

---

**Last Updated**: October 23, 2025  
**Maintained By**: Development Team
