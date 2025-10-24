# Ambetter Project - System Architecture & Data Flow

**Version**: 2.1  
**Last Updated**: October 23, 2025  
**Status**: Production

---

## 📋 Table of Contents

1. [Overview](#overview)
2. [Data Ingestion Flow](#data-ingestion-flow)
3. [Search Architecture](#search-architecture)
4. [Index Management](#index-management)
5. [Technology Stack](#technology-stack)

---

## 🎯 Overview

The Ambetter Health Plan Search Application is a full-stack Next.js application that indexes, searches, and manages health plan documents across multiple states using Elasticsearch with dynamic index management and AI-powered search capabilities.

---

## 📥 Data Ingestion Flow

### High-Level Data Pipeline

```mermaid
flowchart TD
    A[Admin Creates New Index] --> B[User Input: URL + State + Version]
    B --> C[Example: ambetter.com/tx/brochures + TX + 2025-10]
    C --> D[Creates: health-plans-tx-2025-10]
    
    D --> E[STEP 1: Web Crawling]
    E --> F[Tool: Puppeteer Headless Chrome]
    F --> G[Navigate to Ambetter state page]
    G --> H[Detect pagination - select All]
    H --> I[Extract all PDF URLs + metadata]
    I --> J[Output: List of PDF URLs + metadata]
    
    J --> K[STEP 2: PDF Processing]
    K --> L[Tool: pdftotext Poppler Utils]
    L --> M[For each PDF URL:]
    M --> N[Download PDF to /tmp/temp-timestamp.pdf]
    N --> O[Extract text with pdftotext -layout]
    O --> P[Parse plan details from text]
    P --> Q[Plan ID, Name, County Code, Plan Type]
    Q --> R[Clean up temp files]
    R --> S[Output: Structured plan documents]
    
    S --> T[STEP 3: Elasticsearch Indexing]
    T --> U[Target: health-plans-state-version]
    U --> V[Document Structure with extracted text]
    V --> W[Semantic Fields ELSER vectors]
    
    W --> X[STEP 4: Alias Management]
    X --> Y[Add to health-plans alias]
    Y --> Z[All searches include new data automatically]
    
    style A fill:#e1f5fe
    style E fill:#f3e5f5
    style K fill:#fff3e0
    style T fill:#e8f5e8
    style X fill:#fce4ec
```

### Detailed Ingestion Sequence

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant UI as Admin UI
    participant API as Ingest API
    participant ES as Elasticsearch
    participant Puppeteer as Puppeteer
    participant PDF as PDF Processor

    Admin->>UI: Enter URL + State + Version
    UI->>API: POST /api/admin/ingest
    
    API->>ES: Check if index exists
    alt Index doesn't exist
        API->>ES: Create index: health-plans-{state}-{version}
        API->>ES: Apply HEALTH_PLANS_MAPPING
        API->>ES: Add to 'health-plans' alias
    end
    
    API->>Puppeteer: Launch crawler with TARGET_INDEX
    Puppeteer->>Puppeteer: Navigate to Ambetter page
    Puppeteer->>Puppeteer: Set pagination to "All"
    Puppeteer->>Puppeteer: Extract all PDF URLs
    
    loop For each PDF URL
        Puppeteer->>PDF: Process PDF
        PDF->>PDF: Download to /tmp
        PDF->>PDF: Extract text with pdftotext
        PDF->>PDF: Parse plan metadata
        PDF->>ES: Index document to target index
        PDF->>PDF: Clean up temp file
    end
    
    Puppeteer-->>API: Indexing complete
    API-->>UI: Success response
    UI-->>Admin: Show success message
```

---

### Detailed Ingestion Sequence

```mermaid
sequenceDiagram
    participant Admin as Admin User
    participant UI as Admin UI
    participant API as Ingest API
    participant ES as Elasticsearch
    participant Puppeteer as Puppeteer
    participant PDF as PDF Processor

    Admin->>UI: Enter URL + State + Version
    UI->>API: POST /api/admin/ingest
    
    API->>ES: Check if index exists
    alt Index doesn't exist
        API->>ES: Create index: health-plans-{state}-{version}
        API->>ES: Apply HEALTH_PLANS_MAPPING
        API->>ES: Add to 'health-plans' alias
    end
    
    API->>Puppeteer: Launch crawler with TARGET_INDEX
    Puppeteer->>Puppeteer: Navigate to Ambetter page
    Puppeteer->>Puppeteer: Set pagination to "All"
    Puppeteer->>Puppeteer: Extract all PDF URLs
    
    loop For each PDF URL
        Puppeteer->>PDF: Process PDF
        PDF->>PDF: Download to /tmp
        PDF->>PDF: Extract text with pdftotext
        PDF->>PDF: Parse plan metadata
        PDF->>ES: Index document to target index
        PDF->>PDF: Clean up temp file
    end
    
    Puppeteer-->>API: Indexing complete
    API-->>UI: Success response
    UI-->>Admin: Show success message
```

---

## 🔍 Search Architecture

### Search Flow Diagram

```mermaid
flowchart TD
    A[User Searches] --> B[User enters: texas gold plans]
    B --> C[Mode: Semantic or Keyword]
    
    C --> D[STEP 1: Query Processing]
    D --> E[State Detection: texas → filter by state:TX]
    E --> F[Load Curations: Check pinned/excluded docs]
    F --> G[Load Boosts: Apply field weights and numeric boosts]
    
    G --> H[STEP 2: Hybrid Search Query]
    H --> I[Lexical Search - Keyword Matching]
    I --> I1[multi_match across text fields]
    I --> I2[phrase search for exact matches]
    I --> I3[wildcard search for flexible matching]
    
    H --> J[Semantic Search - ELSER if enabled]
    J --> J1[extracted_text_semantic boost: 2.0]
    J --> J2[body_semantic boost: 1.5]
    J --> J3[pdf_semantic boost: 1.5]
    
    H --> K[Filtering]
    K --> K1[State filter: term query on state.keyword]
    K --> K2[County filter: term query on county_code.keyword]
    K --> K3[Plan type filter: terms query]
    
    H --> L[Deduplication]
    L --> L1[Collapse by plan_id.keyword]
    L --> L2[Show only unique plans]
    
    H --> M[Boosting]
    M --> M1[Text field weights configurable]
    M --> M2[Numeric boosts log/sigmoid]
    M --> M3[function_score for custom relevance]
    
    I1 --> N[STEP 3: Result Processing]
    J1 --> N
    K1 --> N
    L1 --> N
    M1 --> N
    
    N --> O[Apply Curations]
    O --> O1[Pins: Move curated docs to top]
    O --> O2[Excludes: Remove excluded docs]
    
    N --> P[Extract Plan Names]
    P --> P1[Parse plan names from extracted_text]
    P --> P2[Override with human-readable names]
    
    N --> Q[Format Results]
    Q --> Q1[Add plan metadata]
    Q --> Q2[Include document URLs]
    Q --> Q3[Calculate relevance scores]
    
    O1 --> R[STEP 4: Facet Generation]
    P1 --> R
    Q1 --> R
    
    R --> S[Parallel Aggregation Query]
    S --> S1[States: terms agg on state.keyword]
    S --> S2[Counties: terms agg on county_code.keyword]
    S --> S3[Plan Types: terms agg on plan_type.keyword]
    S --> S4[Document Types: terms agg on document_type.keyword]
    
    S1 --> T[STEP 5: Display Results 30/page]
    S2 --> T
    S3 --> T
    S4 --> T
    
    T --> U[Filters and Results UI]
    U --> V[Show AI Summary - Optional]
    
    V --> W[STEP 6: AI Summary Opt-in]
    W --> X[Check Redis cache for query hash]
    X --> Y{Not cached?}
    Y -->|Yes| Z[Send to OpenAI gpt-4o-mini]
    Y -->|No| AA[Return cached result]
    Z --> BB[Use Ambetter Assistant prompt]
    BB --> CC[Get personalized plan comparison]
    CC --> DD[Cache in Redis]
    DD --> EE[Display collapsible AI overview]
    AA --> EE
    
    style A fill:#e3f2fd
    style D fill:#f3e5f5
    style H fill:#fff3e0
    style N fill:#e8f5e8
    style R fill:#fce4ec
    style T fill:#e1f5fe
    style W fill:#fff8e1
```

### Search Query Processing Flow

```mermaid
sequenceDiagram
    participant User as User
    participant Frontend as Next.js Frontend
    participant SearchAPI as /api/search
    participant ES as Elasticsearch
    participant Redis as Redis Cache
    participant OpenAI as OpenAI API

    User->>Frontend: Enter search query
    Frontend->>SearchAPI: POST /api/search with query + filters
    
    SearchAPI->>SearchAPI: Process query (state detection, curations, boosts)
    SearchAPI->>ES: Execute hybrid search query
    
    ES-->>SearchAPI: Return search results + aggregations
    SearchAPI->>SearchAPI: Apply curations and format results
    SearchAPI-->>Frontend: Return formatted results + facets
    
    Frontend->>Frontend: Display results (30 per page)
    
    opt User clicks "Show AI Summary"
        Frontend->>SearchAPI: POST /api/ai-summary
        SearchAPI->>Redis: Check cache for query hash
        
        alt Cache miss
            SearchAPI->>OpenAI: Send top 3 results + prompt
            OpenAI-->>SearchAPI: Return AI summary
            SearchAPI->>Redis: Cache summary
        else Cache hit
            Redis-->>SearchAPI: Return cached summary
        end
        
        SearchAPI-->>Frontend: Return AI summary
        Frontend->>Frontend: Display collapsible AI overview
    end
```

---

### Search Query Structure

**Example Query for "texas gold plans":**

```json
{
  "from": 0,
  "size": 30,
  "collapse": {
    "field": "plan_id.keyword"
  },
  "_source": [
    "title", "plan_name", "plan_type", "plan_id", 
    "county_code", "extracted_text", "url", "document_url"
  ],
  "query": {
    "bool": {
      "must": [
        {
          "term": { "state.keyword": "TX" }
        }
      ],
      "should": [
        {
          "multi_match": {
            "query": "texas gold plans",
            "fields": [
              "title^2",
              "plan_name^2",
              "state^3",
              "extracted_text^3"
            ],
            "type": "best_fields",
            "fuzziness": "AUTO"
          }
        },
        {
          "multi_match": {
            "query": "texas gold plans",
            "fields": [
              "title^3",
              "plan_name^3",
              "extracted_text^2"
            ],
            "type": "phrase"
          }
        },
        {
          "semantic": {
            "field": "extracted_text_semantic",
            "query": "texas gold plans",
            "boost": 2.0
          }
        }
      ],
      "minimum_should_match": 1
    }
  }
}
```

---

## 🗄️ Index Management

### Multi-Index Architecture

```mermaid
graph TB
    subgraph "Physical Indices (State + Version)"
        A[health-plans-tx-2025-10<br/>302 docs • 15MB]
        B[health-plans-fl-2025-10<br/>242 docs • 12MB]
        C[health-plans-tx-2025-09<br/>298 docs • 14MB]
        D[health-plans-ca-2025-11<br/>450 docs • 22MB]
    end
    
    subgraph "Alias (Logical View)"
        E[health-plans alias<br/>Searches across ALL indices<br/>Total: 1,292 documents • 63MB]
    end
    
    A --> E
    B --> E
    C --> E
    D --> E
    
    style A fill:#e3f2fd
    style B fill:#e8f5e8
    style C fill:#fff3e0
    style D fill:#fce4ec
    style E fill:#f3e5f5
```

### Index Lifecycle

```mermaid
stateDiagram-v2
    [*] --> Create: Admin creates new index
    
    state Create {
        [*] --> UserInput: User: TX + 2025-10
        UserInput --> IndexCreation: Creates health-plans-tx-2025-10
        IndexCreation --> ApplyMapping: Apply HEALTH_PLANS_MAPPING
        ApplyMapping --> AddToAlias: Add to 'health-plans' alias
        AddToAlias --> [*]
    }
    
    Create --> Ingest: Index created successfully
    
    state Ingest {
        [*] --> CrawlURLs: Crawl Ambetter URLs
        CrawlURLs --> ExtractPDFs: Extract PDF documents
        ExtractPDFs --> IndexDocuments: Index to Elasticsearch
        IndexDocuments --> [*]
    }
    
    Ingest --> ActiveUse: Data populated
    
    state ActiveUse {
        [*] --> Searchable: Included in all searches
        Searchable --> UserSearches: Users search across states/versions
        UserSearches --> [*]
    }
    
    ActiveUse --> Update: Optional update
    
    state Update {
        [*] --> NewVersion: Create new version
        NewVersion --> AddToAlias2: Add to alias
        AddToAlias2 --> RemoveOld: Optionally remove old version
        RemoveOld --> [*]
    }
    
    Update --> ActiveUse: Updated successfully
    ActiveUse --> Archive: Admin decides to archive
    
    state Archive {
        [*] --> RemoveFromAlias: Remove from alias
        RemoveFromAlias --> DeleteIndex: Delete index
        DeleteIndex --> [*]
    }
    
    Archive --> [*]: Data cleaned up
```

### Admin Index Management Flow

```mermaid
flowchart TD
    A[Admin Login] --> B[Admin Dashboard]
    B --> C[Indices Tab]
    
    C --> D[View All Indices]
    D --> E[health-plans-* pattern]
    E --> F[Display Index Metadata]
    F --> G[Document Count, Size, Health Status]
    
    G --> H{Admin Action?}
    
    H -->|View Details| I[Show Index Information]
    H -->|Add to Alias| J[Add Index to health-plans alias]
    H -->|Remove from Alias| K[Remove Index from alias]
    H -->|Delete Index| L[Confirm Deletion]
    
    I --> M[Display Index Stats]
    M --> N[Creation Date, Health, Size]
    
    J --> O[Update Alias Configuration]
    O --> P[Index now searchable]
    
    K --> Q[Remove from Search]
    Q --> R[Index still exists but not searchable]
    
    L --> S{Confirm Delete?}
    S -->|Yes| T[Remove from alias first]
    S -->|No| U[Cancel operation]
    T --> V[Delete index completely]
    V --> W[Data permanently removed]
    U --> G
    
    style A fill:#e3f2fd
    style B fill:#f3e5f5
    style C fill:#fff3e0
    style H fill:#e8f5e8
    style L fill:#ffebee
    style S fill:#fff8e1
```

### Admin Index Management UI

```
┌─────────────────────────────────────────────────────────────────────┐
│  Admin Dashboard → Indices Tab                                      │
│                                                                      │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │ Index Name             Docs  Size  Created    Status  Actions│  │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ health-plans-tx-2025-10 302  15MB  10/15/25  🟢 [ALIAS]    │  │
│  │                                                    │           │  │
│  │                          [Remove Alias] [Delete]  │           │  │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ health-plans-fl-2025-10 242  12MB  10/18/25  🟢 [ALIAS]    │  │
│  │                          [Remove Alias] [Delete]              │  │
│  ├────────────────────────────────────────────────────────────┤    │
│  │ health-plans-tx-2025-09 298  14MB  09/01/25  🟢           │  │
│  │                          [Add Alias] [Delete]                 │  │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                      │
│  Features:                                                          │
│  • View all indices matching health-plans-*                        │
│  • See which indices are in the active alias                       │
│  • Add/remove indices from alias without deletion                  │
│  • Delete old/obsolete indices with confirmation                   │
│  • Monitor health status (green/yellow/red)                        │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🛠️ Technology Stack

### System Architecture Flow

```mermaid
graph TB
    subgraph "Frontend Layer"
        A[Next.js 14 App Router]
        B[React 18 + TypeScript]
        C[Inline Styles]
        D[Client State Management]
        
        subgraph "Pages"
            E[/ - Homepage Search]
            F[/search - Results + Filters]
            G[/admin - Management Panel]
        end
    end
    
    subgraph "API Routes Layer"
        H[Next.js API Routes]
        
        subgraph "Search & Data APIs"
            I[POST /api/search]
            J[GET /api/facets]
            K[POST /api/ai-summary]
        end
        
        subgraph "Admin APIs"
            L[POST /api/admin/ingest]
            M[GET /api/admin/indices]
            N[DELETE /api/admin/indices/:name]
            O[POST /api/admin/aliases]
            P[GET/POST /api/admin/curations]
            Q[GET/POST /api/admin/boosts]
        end
    end
    
    subgraph "Data Layer"
        R[Elasticsearch Cloud Serverless]
        S[Upstash Redis Cache]
        T[OpenAI API]
        
        subgraph "Elasticsearch Features"
            R1[health-plans alias]
            R2[Multiple indices]
            R3[ELSER semantic search]
            R4[Aggregations for facets]
        end
        
        subgraph "Redis Features"
            S1[LLM response caching]
            S2[Query hash keys]
            S3[Configurable TTL]
        end
        
        subgraph "OpenAI Features"
            T1[gpt-4o-mini model]
            T2[AI summaries]
            T3[Plan comparisons]
            T4[Ambetter Assistant prompt]
        end
    end
    
    subgraph "Ingestion Layer"
        U[Puppeteer Node.js]
        V[pdftotext Poppler Utils]
        W[Processing Scripts]
        
        subgraph "Puppeteer Features"
            U1[Headless Chrome automation]
            U2[PDF URL extraction]
            U3[Dynamic pagination]
        end
        
        subgraph "PDF Processing"
            V1[Text extraction]
            V2[Layout preservation]
            V3[High accuracy]
        end
        
        subgraph "Scripts"
            W1[multi-state-processor.js]
            W2[pdf-processor logic]
        end
    end
    
    A --> H
    B --> H
    C --> H
    D --> H
    
    E --> I
    F --> I
    F --> J
    F --> K
    G --> L
    G --> M
    G --> N
    G --> O
    G --> P
    G --> Q
    
    I --> R
    J --> R
    K --> S
    K --> T
    L --> U
    L --> V
    L --> W
    
    R --> R1
    R --> R2
    R --> R3
    R --> R4
    
    S --> S1
    S --> S2
    S --> S3
    
    T --> T1
    T --> T2
    T --> T3
    T --> T4
    
    U --> U1
    U --> U2
    U --> U3
    
    V --> V1
    V --> V2
    V --> V3
    
    W --> W1
    W --> W2
    
    style A fill:#e3f2fd
    style H fill:#f3e5f5
    style R fill:#e8f5e8
    style S fill:#fff3e0
    style T fill:#fce4ec
    style U fill:#fff8e1
    style V fill:#f1f8e9
    style W fill:#fafafa
```

### Component Interaction Flow

```mermaid
sequenceDiagram
    participant User as End User
    participant Admin as Admin User
    participant Frontend as Next.js Frontend
    participant API as API Routes
    participant ES as Elasticsearch
    participant Redis as Redis Cache
    participant OpenAI as OpenAI
    participant Puppeteer as Puppeteer
    participant PDF as PDF Processor

    Note over User,PDF: User Search Flow
    User->>Frontend: Search query
    Frontend->>API: POST /api/search
    API->>ES: Hybrid search query
    ES-->>API: Search results + aggregations
    API-->>Frontend: Formatted results
    Frontend-->>User: Display results

    opt AI Summary Request
        User->>Frontend: Click "Show AI Summary"
        Frontend->>API: POST /api/ai-summary
        API->>Redis: Check cache
        alt Cache miss
            API->>OpenAI: Generate summary
            OpenAI-->>API: AI response
            API->>Redis: Cache result
        else Cache hit
            Redis-->>API: Cached result
        end
        API-->>Frontend: AI summary
        Frontend-->>User: Display AI summary
    end

    Note over User,PDF: Admin Management Flow
    Admin->>Frontend: Access admin panel
    Frontend->>API: GET /api/admin/indices
    API->>ES: List indices
    ES-->>API: Index metadata
    API-->>Frontend: Index list
    Frontend-->>Admin: Display indices

    opt Add New Data
        Admin->>Frontend: Submit new URL + state
        Frontend->>API: POST /api/admin/ingest
        API->>ES: Create new index
        API->>Puppeteer: Start crawling
        Puppeteer->>Puppeteer: Extract PDF URLs
        loop For each PDF
            Puppeteer->>PDF: Process PDF
            PDF->>PDF: Extract text
            PDF->>ES: Index document
        end
        Puppeteer-->>API: Indexing complete
        API-->>Frontend: Success response
        Frontend-->>Admin: Show success
    end
```

### Key Technologies

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Frontend Framework** | Next.js 14 | Full-stack React framework with SSR/SSG |
| **Language** | TypeScript | Type-safe development |
| **Search Engine** | Elasticsearch Cloud | Hybrid search, aggregations, ELSER semantic |
| **Semantic Search** | ELSER (Elastic) | Contextual understanding without embeddings |
| **AI Summary** | OpenAI GPT-4o-mini | Intelligent plan comparisons |
| **Caching** | Upstash Redis | LLM response caching |
| **Web Scraping** | Puppeteer | PDF URL extraction from dynamic pages |
| **PDF Processing** | pdftotext | Text extraction from PDFs |
| **Deployment** | Vercel | Serverless deployment with CI/CD |
| **Version Control** | Git + GitHub | Source code management |

---

## 📊 Data Flow Summary

### Complete End-to-End Flow

```mermaid
flowchart LR
    subgraph "Data Ingestion Pipeline"
        A1[Admin Creates Index] --> A2[health-plans-state-version]
        A2 --> A3[Web Crawling: Puppeteer]
        A3 --> A4[PDF Processing: pdftotext]
        A4 --> A5[Elasticsearch Indexing]
        A5 --> A6[Alias Management]
    end
    
    subgraph "Search Pipeline"
        B1[User Searches] --> B2[Query Processing]
        B2 --> B3[Hybrid Search: Lexical + Semantic]
        B3 --> B4[Result Processing: Curations + Boosts]
        B4 --> B5[Display Results: 30/page with filters]
        B5 --> B6[Optional: AI Summary via OpenAI]
        B6 --> B7[Cached in Redis for reuse]
    end
    
    A6 --> B1
    
    style A1 fill:#e3f2fd
    style A2 fill:#e8f5e8
    style A3 fill:#fff3e0
    style A4 fill:#fce4ec
    style A5 fill:#f3e5f5
    style A6 fill:#fff8e1
    style B1 fill:#e1f5fe
    style B2 fill:#f3e5f5
    style B3 fill:#fff3e0
    style B4 fill:#e8f5e8
    style B5 fill:#fce4ec
    style B6 fill:#fff8e1
    style B7 fill:#f1f8e9
```

### System Data Flow Diagram

```mermaid
graph TB
    subgraph "User Interface"
        UI1[Homepage Search]
        UI2[Search Results Page]
        UI3[Admin Dashboard]
    end
    
    subgraph "API Layer"
        API1[Search API]
        API2[Facets API]
        API3[AI Summary API]
        API4[Admin APIs]
    end
    
    subgraph "Data Storage"
        ES[Elasticsearch<br/>health-plans alias]
        REDIS[Redis Cache<br/>LLM responses]
        OPENAI[OpenAI API<br/>gpt-4o-mini]
    end
    
    subgraph "Data Ingestion"
        PUPPETEER[Puppeteer<br/>Web Crawling]
        PDFTOTEXT[pdftotext<br/>PDF Processing]
        SCRIPTS[Processing Scripts<br/>multi-state-processor.js]
    end
    
    UI1 --> API1
    UI2 --> API1
    UI2 --> API2
    UI2 --> API3
    UI3 --> API4
    
    API1 --> ES
    API2 --> ES
    API3 --> REDIS
    API3 --> OPENAI
    API4 --> ES
    API4 --> PUPPETEER
    
    PUPPETEER --> PDFTOTEXT
    PDFTOTEXT --> SCRIPTS
    SCRIPTS --> ES
    
    ES --> API1
    ES --> API2
    REDIS --> API3
    OPENAI --> API3
    
    style UI1 fill:#e3f2fd
    style UI2 fill:#e8f5e8
    style UI3 fill:#fff3e0
    style API1 fill:#f3e5f5
    style API2 fill:#fce4ec
    style API3 fill:#fff8e1
    style API4 fill:#f1f8e9
    style ES fill:#e8f5e8
    style REDIS fill:#fff3e0
    style OPENAI fill:#fce4ec
    style PUPPETEER fill:#fff8e1
    style PDFTOTEXT fill:#f1f8e9
    style SCRIPTS fill:#fafafa
```

---

## 🔗 Related Documentation

- **[PROJECT_MASTER.md](./PROJECT_MASTER.md)** - Complete project documentation
- **[DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Vercel deployment guide  
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Development guidelines

---

**Last Updated**: October 23, 2025  
**Maintained By**: Development Team

---

