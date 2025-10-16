# Ambetter Health Plan Search Application - Project Requirements

## Project Overview
A comprehensive full-stack application for searching and analyzing Ambetter health plans in Texas, featuring advanced search capabilities, plan boosting, and analytics dashboard.

### System Overview Architecture
```mermaid
graph TB
    subgraph "Frontend Layer"
        A[React Application<br/>Search Interface]
        B[Analytics Dashboard<br/>Admin & Insights]
    end
    
    subgraph "API Gateway"
        C[Nginx Reverse Proxy<br/>Load Balancer]
    end
    
    subgraph "Backend Services"
        D[Search API<br/>Node.js/Express]
        E[Analytics API<br/>Click Stream Processing]
        F[Plan Management API<br/>Boosting & A/B Testing]
    end
    
    subgraph "Data Layer"
        G[Elasticsearch<br/>Search & Analytics]
        H[RabbitMQ<br/>Message Queue]
        I[Redis<br/>Cache & Sessions]
    end
    
    subgraph "External Services"
        J[Ambetter Website<br/>PDF Source]
        K[AI Services<br/>OpenAI/Claude]
    end
    
    subgraph "Data Processing"
        L[Web Crawler<br/>PDF Extraction]
        M[Vector Embeddings<br/>AI Processing]
        N[Click Stream Processor<br/>Real-time Analytics]
    end
    
    A --> C
    B --> C
    C --> D
    C --> E
    C --> F
    
    D --> G
    D --> I
    E --> H
    E --> G
    F --> G
    
    H --> N
    N --> G
    
    J --> L
    L --> M
    M --> G
    
    D --> K
    E --> K
```

## System Components Overview

### Data Flow Architecture
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as API Gateway
    participant B as Backend API
    participant E as Elasticsearch
    participant R as RabbitMQ
    participant AI as AI Service
    
    Note over U,AI: Search Flow
    U->>F: Search Query
    F->>A: API Request
    A->>B: Route to Search Service
    B->>E: Hybrid Search (Vector + Lexical)
    E-->>B: Search Results
    B->>AI: Generate Summary
    AI-->>B: AI Summary
    B-->>A: Search Response
    A-->>F: Results + Summary
    F-->>U: Display Results
    
    Note over U,AI: Click Tracking Flow
    U->>F: Click on Plan
    F->>A: Click Event
    A->>B: Track Click
    B->>R: Publish Click Event
    R->>B: Process Click Stream
    B->>E: Index Analytics Data
    
    Note over U,AI: Plan Boosting Flow
    U->>F: Admin Boosts Plan
    F->>A: Boost Request
    A->>B: Update Plan Weights
    B->>E: Update Search Scoring
    E-->>B: Updated Rankings
    B-->>A: Confirmation
    A-->>F: Success Response
```

## Part 1: Data Indexing & Elasticsearch Setup

### Architecture Diagram
```mermaid
graph TB
    A[Ambetter Website<br/>https://www.ambetterhealth.com/en/tx/2025-brochures-epo/] --> B[Web Crawler<br/>OpenSearch Crawler]
    B --> C[PDF Processing<br/>Text Extraction & Parsing]
    C --> D[Data Enrichment<br/>Metadata & Categorization]
    D --> E[Vector Embeddings<br/>AI Model Processing]
    E --> F[Elasticsearch Cluster<br/>Document Indexing]
    F --> G[Search Index<br/>Health Plans Data]
    
    H[Admin Interface] --> I[Crawler Configuration]
    I --> B
    
    J[Monitoring] --> F
    J --> B
```

### Elasticsearch Configuration
- **Elasticsearch cluster** with OpenSearch or Elasticsearch
- **Crawler configuration** to scrape PDFs from: `https://www.ambetterhealth.com/en/tx/2025-brochures-epo/`
- **Document processing pipeline** to extract and structure data from PDFs

### Document Schema & Attributes
Custom mapping for health plan documents with the following attributes:
- `state` (Texas)
- `tobacco_use` (boolean)
- `county` (if applicable)
- `plan_name`
- `plan_type` (EPO, HMO, etc.)
- `coverage_area`
- `premium_range`
- `deductible_info`
- `network_providers`
- `specialty_benefits`
- `eligibility_requirements`
- `document_url`
- `extracted_text`
- `metadata`

### Data Processing Requirements
- PDF text extraction and parsing
- Structured data extraction from health plan documents
- Metadata enrichment and categorization
- Vector embeddings generation for semantic search

## Part 2: React Frontend Application

### Architecture Diagram
```mermaid
graph TB
    A[User Interface<br/>React App] --> B[Search Component<br/>Input & Filters]
    A --> C[Results Component<br/>Plan Display & AI Summary]
    A --> D[Filter Component<br/>County, Tobacco, Plan Type]
    
    B --> E[Search API<br/>/api/search]
    C --> E
    D --> E
    
    E --> F[Backend API<br/>Node.js/Express]
    F --> G[Elasticsearch<br/>Hybrid Search]
    F --> H[AI Service<br/>OpenAI/Claude]
    
    G --> I[Vector Search<br/>Semantic Similarity]
    G --> J[Lexical Search<br/>Keyword Matching]
    
    H --> K[Generative Summary<br/>Top 2 Results]
    
    L[State Management<br/>React Query] --> A
    M[React UI Components<br/>Tailwind CSS] --> A
    N[Animations<br/>Framer Motion] --> A
```

### Core Features
- **Search Interface**:
  - Search input with autocomplete
  - Filter options (county, tobacco use, plan type)
  - Search results display
- **React Search Results Page**:
  - Generative AI summary of top 2 results
  - Context highlighting of search terms
  - Plan value propositions
  - Eligibility information
  - Related PDF documents list

### Search Capabilities
- **Vector Search**: Semantic similarity using Elasticsearch's dense vector search
- **Lexical Search**: Traditional text search with keyword matching
- **Hybrid Search**: Combining vector similarity with keyword matching
- **Faceted Search**: Filter by county, tobacco use, plan type
- **Auto-complete**: Suggest search terms as user types

### UI/UX Requirements
- Match Ambetter's design language from `https://www.ambetterhealth.com/en/tx/`
- Responsive design for mobile and desktop
- Modern, clean interface
- Intuitive search experience

## Part 3: Backend API & Plan Boosting

### Architecture Diagram
```mermaid
graph TB
    A[Frontend React App] --> B[API Gateway<br/>Nginx Reverse Proxy]
    B --> C[Backend API<br/>Node.js/Express]
    
    C --> D[Search Service<br/>/api/search]
    C --> E[Plan Management<br/>/api/plans]
    C --> F[Boost Service<br/>/api/boost]
    C --> G[Analytics Service<br/>/api/analytics]
    C --> H[Click Tracking<br/>/api/click]
    
    D --> I[Elasticsearch<br/>Search Engine]
    E --> I
    F --> J[Plan Boosting<br/>Weighted Scoring]
    G --> K[Analytics Database<br/>Click Stream Data]
    H --> L[RabbitMQ<br/>Message Queue]
    
    I --> M[Vector Search<br/>Semantic]
    I --> N[Lexical Search<br/>Keywords]
    
    J --> O[Admin Interface<br/>Plan Management]
    L --> P[Click Stream Processor<br/>Real-time Analytics]
    P --> K
    
    Q[Redis Cache<br/>Session & Search Cache] --> C
    R[Authentication<br/>JWT Tokens] --> C
```

### Backend Architecture
- **Node.js + Express**
- **RESTful API** design
- **Authentication & Authorization**
- **Rate limiting and security**

### API Endpoints
- `GET /api/search` - Main search endpoint with hybrid search
- `GET /api/plans` - Plan management and retrieval
- `POST /api/boost` - Plan boosting functionality
- `GET /api/analytics` - Search analytics data
- `POST /api/click` - Click tracking endpoint

### Plan Boosting System
- **Admin Interface**: Manage plan boosting weights
- **Weighted Scoring Algorithm**: Dynamic plan ranking
- **A/B Testing**: Test different plan rankings
- **Performance Metrics**: Track plan click-through rates

### Click Tracking System
- Track search queries and user interactions
- Store plan clicks and user behavior
- Real-time analytics data collection

## Part 4: Analytics & Click Stream

### Architecture Diagram
```mermaid
graph TB
    A[User Interactions<br/>Search & Clicks] --> B[Click Tracking<br/>Frontend Events]
    B --> C[RabbitMQ<br/>Message Queue]
    
    C --> D[Click Stream Processor<br/>Real-time Analytics]
    D --> E[Data Enrichment<br/>User Session & Context]
    E --> F[Elasticsearch<br/>Analytics Index]
    
    F --> G[React Analytics Dashboard<br/>Real-time Components]
    G --> H[Search Metrics<br/>Volume & Trends]
    G --> I[Plan Performance<br/>Click Rates & Rankings]
    G --> J[User Behavior<br/>Journey & Patterns]
    G --> K[Geographic Insights<br/>County Distribution]
    
    L[React Admin Dashboard<br/>Plan Boosting] --> M[Boost Configuration<br/>Weight Management]
    M --> N[Plan Scoring<br/>Dynamic Rankings]
    N --> O[A/B Testing<br/>Performance Comparison]
    
    P[Real-time Alerts<br/>System Monitoring] --> Q[Performance Metrics<br/>Response Times]
    P --> R[Error Tracking<br/>System Health]
    
    S[Data Export<br/>CSV/JSON] --> F
    T[API Endpoints<br/>Analytics Data] --> G
```

### Message Queue System
- **RabbitMQ** message broker for click stream data
- **Real-time event collection**
- **Data processing and enrichment**
- **Elasticsearch indexing** of analytics data

### React Analytics Dashboard Features
- **Search Volume Metrics**: Real-time search counts
- **Top Searched Terms**: Most popular search queries
- **Most Clicked Plans**: Plan performance rankings
- **User Behavior Patterns**: Search to click conversion
- **Geographic Distribution**: County-level search insights
- **Plan Performance Comparisons**: A/B test results
- **Conversion Rates**: Search to click analytics
- **Historical Trends**: Search patterns over time

### Click Stream Data Structure
- `search_query`
- `timestamp`
- `user_session_id`
- `clicked_plan_id`
- `search_filters` (county, tobacco_use, etc.)
- `result_position`
- `time_to_click`
- `user_agent`
- `ip_address` (anonymized)

## Technical Stack

### Backend Technologies
- **Elasticsearch/OpenSearch**: Search engine and analytics storage
- **Node.js + Express**: API framework
- **RabbitMQ**: Message queuing for click stream
- **Redis**: Caching and session management
- **Docker**: Containerization
- **Nginx**: Reverse proxy

### Frontend Technologies
- **React 18** with TypeScript
- **Tailwind CSS**: Styling framework
- **Axios**: HTTP client
- **React Query**: Data fetching and caching
- **Framer Motion**: Animations
- **Chart.js** or **D3.js**: Analytics visualizations

### AI/ML Components
- **OpenAI API** or **Anthropic Claude**: Generative summaries
- **Elasticsearch Vector Search**: Semantic search
- **Custom Embedding Models**: Health plan document embeddings
- **Text Processing**: PDF extraction and parsing

### Infrastructure
- **Docker Compose**: Local development environment
- **PM2**: Process management
- **Git**: Version control
- **CI/CD Pipeline**: Automated deployment

## Development Phases

### Phase 1: Data Foundation (Weeks 1-2)
1. Set up Elasticsearch cluster
2. Configure PDF crawler for Ambetter website
3. Implement document processing pipeline
4. Create custom mapping and indexing
5. Test data extraction and indexing

### Phase 2: React Frontend Development (Weeks 3-4)
1. Set up React 18 application with TypeScript
2. Implement search interface matching Ambetter design
3. Build React search results page with AI summaries
4. Integrate with Node.js backend API
5. Add filtering and faceted search

### Phase 3: Backend API (Weeks 5-6)
1. Build Node.js + Express RESTful API with search endpoints
2. Implement plan boosting system
3. Add click tracking functionality
4. Set up authentication and security
5. Integrate with React frontend

### Phase 4: Analytics & Dashboard (Weeks 7-8)
1. Set up RabbitMQ for click stream
2. Implement analytics data pipeline
3. Build React analytics dashboard
4. Add real-time metrics and visualizations
5. Implement A/B testing framework

## Key Features Summary

### Search Capabilities
- ✅ Hybrid search (vector + lexical)
- ✅ Faceted search with filters
- ✅ Auto-complete suggestions
- ✅ Generative AI summaries
- ✅ Context highlighting

### Plan Management
- ✅ Dynamic plan boosting
- ✅ A/B testing framework
- ✅ Performance metrics tracking
- ✅ Admin interface for management

### Analytics & Insights
- ✅ Real-time click stream analytics
- ✅ Search volume metrics
- ✅ Geographic distribution insights
- ✅ User behavior analysis
- ✅ Plan performance comparisons
- ✅ Conversion rate tracking

## Success Metrics
- Search response time < 200ms
- 95%+ search accuracy
- Real-time React analytics dashboard
- Mobile-responsive design
- Scalable architecture for future growth

## Future Enhancements
- Machine learning for personalized recommendations
- Advanced analytics with predictive insights
- Multi-state expansion beyond Texas
- Integration with external health plan APIs
- Advanced reporting and export capabilities
