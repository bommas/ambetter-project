# Ambetter Health Plan Search Application

**A comprehensive multi-state health plan search application powered by Elasticsearch and AI**

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Elasticsearch](https://img.shields.io/badge/Elasticsearch-Serverless-orange)](https://www.elastic.co/)
[![Deployed on Vercel](https://img.shields.io/badge/Vercel-Deployed-black)](https://vercel.com)

---

## 🚀 Quick Start

### Installation

```bash
# Clone the repository
git clone <repo-url>
cd ambetter-project

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# Run development server
npm run dev
```

### Access the Application

- **Homepage**: [http://localhost:3000](http://localhost:3000)
- **Search**: [http://localhost:3000/search?q=health+plans](http://localhost:3000/search?q=health+plans)

---

## 📖 Complete Documentation

### Core Documents

#### **[📘 PROJECT_MASTER.md](./docs/PROJECT_MASTER.md)** - Complete Project Documentation
- ✅ Complete project overview and status
- ✅ Phase 1 & Phase 2 details  
- ✅ Multi-state setup guide
- ✅ API documentation
- ✅ Troubleshooting guide

#### **[🏗️ ARCHITECTURE.md](./ARCHITECTURE.md)** - System Architecture & Data Flow ⭐ UPDATED
- 📥 **Data Ingestion Flow**: Interactive Mermaid flowcharts showing PDF crawling and indexing
- 🔍 **Search Architecture**: Hybrid search (lexical + semantic) with detailed query examples
- 🗄️ **Index Management**: Multi-index architecture with state-based versioning
- 🛠️ **Technology Stack**: Complete system component overview with visual diagrams
- 📊 **End-to-End Data Flow**: From admin ingestion to user search results
- 🔄 **Component Interaction Flows**: Sequence diagrams for user and admin workflows
- 🎨 **Visual System Architecture**: Comprehensive Mermaid diagrams for all system components

### Additional Documentation

#### **[🎯 DEMO_101_FLOWS.md](./docs/DEMO_101_FLOWS.md)** - Demo Flow Diagrams
- 📱 **User Journey Flows**: Step-by-step user experience diagrams
- 🤖 **AI Summary Flow**: How the optional AI summary works
- 👨‍💼 **Admin Management Flow**: Admin panel workflows
- 🔧 **System Architecture Flows**: Technical process flows
- 🎯 **Demo Scenarios**: Ready-to-use demo scripts

#### **[📋 CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)** - Development Guidelines
- 🎨 **Code Style**: TypeScript, React, and Next.js best practices
- 📝 **Naming Conventions**: Variables, functions, and file naming
- 🏗️ **Architecture Patterns**: Component structure and API design
- ✅ **Quality Standards**: Testing, error handling, and documentation

#### **[🚀 DEPLOYMENT.md](./docs/DEPLOYMENT.md)** - Deployment Guide
- 🌐 **Vercel Setup**: Production deployment instructions
- 🔧 **Environment Variables**: Configuration and secrets management
- 📊 **Monitoring**: Health checks and performance monitoring
- 🔄 **CI/CD**: Automated deployment workflows

---

## 🎯 What is This?

A comprehensive full-stack Next.js application that provides:

### 🔍 **Advanced Search Capabilities**
- **Multi-State Coverage**: Search health plans across Texas, Florida, and California
- **Hybrid Search**: Combines lexical (keyword) and semantic (AI-powered) search
- **Smart Filtering**: Filter by state, county, plan type, and document type
- **Real-time Facets**: Dynamic filtering with contextual result counts
- **Deduplication**: Shows unique plans with intelligent result collapsing

### 🤖 **AI-Powered Features**
- **Optional AI Summaries**: Get personalized plan comparisons (opt-in for performance)
- **Ambetter Assistant**: Specialized AI prompt for health plan guidance
- **Smart Caching**: Redis-powered caching for fast AI responses
- **Source Citations**: AI summaries include proper source references

### 👨‍💼 **Admin Management**
- **Dynamic Index Management**: Create state-specific indices with versioning
- **Search Curations**: Pin or exclude specific documents for queries
- **Field Boosting**: Configure search relevance with custom weights
- **Real-time Monitoring**: Track index health, document counts, and performance

### 📊 **Production-Ready Features**
- **Vercel Deployment**: Fully deployed and accessible
- **Elasticsearch Serverless**: Scalable cloud search infrastructure
- **Performance Optimized**: <500ms search response times
- **Mobile Responsive**: Works seamlessly on all devices

---

## 🆕 Latest Updates (October 2025)

### 📊 **Enhanced Documentation**
- **ARCHITECTURE.md**: Added comprehensive Mermaid flowcharts for all system components
- **DEMO_101_FLOWS.md**: Created simplified flow diagrams perfect for presentations
- **Visual System Diagrams**: Interactive charts showing data flow, search architecture, and component interactions

### 🔧 **System Improvements**
- **Dynamic Index Management**: Full admin UI for creating and managing state-specific indices
- **Search Curations**: Admin controls for pinning/excluding documents from specific queries
- **Field Boosting**: Configurable search relevance with custom field weights
- **Performance Optimization**: AI summary opt-in feature for better performance

### 🎨 **User Experience**
- **Google-like Interface**: Clean, fast search experience with 30 results per page
- **Smart Deduplication**: Shows unique plans with intelligent result collapsing
- **Contextual Facets**: Dynamic filtering that adapts to current selections
- **Mobile Optimization**: Fully responsive design for all devices

### 🚀 **Production Ready**
- **Vercel Deployment**: Live application with automatic CI/CD
- **Elasticsearch Serverless**: Scalable cloud infrastructure
- **Redis Caching**: Fast AI response times with intelligent caching
- **Multi-State Support**: Texas, Florida, and California health plans indexed

---

## 🏗️ Project Structure

```
ambetter-project/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.tsx          # Homepage (Google-like search)
│   │   ├── search/           # Search results page with filters
│   │   ├── admin/            # Admin management panel
│   │   │   ├── login/        # Admin authentication
│   │   │   ├── AdminTabs.tsx # Tabbed admin interface
│   │   │   ├── AdminIngest.tsx    # New document ingestion
│   │   │   ├── AdminIndices.tsx   # Index management
│   │   │   ├── AdminCurations.tsx # Search curations
│   │   │   └── AdminBoosts.tsx    # Field boosting
│   │   └── api/              # API routes
│   │       ├── search/       # Hybrid search endpoint
│   │       ├── facets/       # Dynamic faceting
│   │       ├── ai-summary/   # AI summary generation
│   │       └── admin/        # Admin management APIs
│   └── lib/                  # Utilities and services
│       ├── elasticsearch.ts  # Elasticsearch client
│       └── redis.ts          # Redis caching client
├── scripts/
│   ├── multi-state-processor.js  # PDF extraction & indexing
│   ├── build-suggester.js    # Autocomplete index builder
│   └── qa-test.sh            # QA validation scripts
├── config/
│   └── app-config.js         # Centralized configuration
├── docs/                     # Documentation
│   ├── README.md             # Documentation index
│   ├── DEPLOYMENT.md         # Deployment guide
│   └── archive/              # Historical documentation
├── run_multi_state_pipeline.py  # Pipeline orchestrator
├── README.md                # 📖 Project overview and quick start
├── ARCHITECTURE.md          # 🏗️ System architecture with flowcharts
├── docs/                    # 📚 All documentation
│   ├── PROJECT_MASTER.md    # 📘 Complete project documentation
│   ├── DEMO_101_FLOWS.md    # 🎯 Demo flow diagrams
│   ├── CODING_STANDARDS.md  # 📋 Development guidelines
│   ├── DEPLOYMENT.md        # 🚀 Deployment guide
│   └── archive/             # 📁 Historical documentation
└── package.json
```

---

## ⚡ Key Features

### 🔍 **Search & Discovery**
- **Multi-State Coverage**: Texas, Florida, and California health plans
- **Hybrid Search**: Combines lexical (keyword) and semantic (ELSER) search
- **Smart Deduplication**: Shows unique plans with intelligent result collapsing
- **Real-time Facets**: Dynamic filtering with contextual result counts
- **30 Results per Page**: Google-like pagination for better UX

### 🤖 **AI-Powered Intelligence**
- **Optional AI Summaries**: Personalized plan comparisons (opt-in for performance)
- **Ambetter Assistant**: Specialized AI prompt for health plan guidance
- **Smart Caching**: Redis-powered caching for fast AI responses
- **Source Citations**: AI summaries include proper source references

### 👨‍💼 **Admin Management**
- **Dynamic Index Management**: Create and manage state-specific indices
- **Search Curations**: Pin or exclude documents for specific queries
- **Field Boosting**: Configure search relevance with custom weights
- **Real-time Monitoring**: Track index health and performance metrics

### 📱 **User Experience**
- **Google-like Interface**: Clean, fast search experience
- **Mobile Responsive**: Works seamlessly on all devices
- **PDF Access**: Direct links to plan brochures
- **Contextual Filtering**: Filters adapt to current selections

### 🚀 **Production Ready**
- **Vercel Deployment**: Live application with automatic CI/CD
- **Elasticsearch Serverless**: Scalable cloud infrastructure
- **Performance Optimized**: <500ms search response times
- **Multi-State Support**: Expandable to additional states

---

## 🛠️ Tech Stack

### **Frontend & Backend**
- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript 5.0
- **UI**: React 18 with inline styles
- **API**: Next.js API Routes (Serverless Functions)

### **Search & Data**
- **Search Engine**: Elasticsearch Cloud Serverless
- **Semantic Search**: ELSER (Elastic's built-in LLM)
- **Caching**: Upstash Redis
- **AI**: OpenAI GPT-4o-mini

### **Data Processing**
- **Web Crawling**: Puppeteer (Headless Chrome)
- **PDF Processing**: pdftotext (Poppler Utils)
- **Orchestration**: Python + Node.js scripts

### **Deployment & Infrastructure**
- **Platform**: Vercel (Serverless)
- **Version Control**: Git + GitHub
- **CI/CD**: Automatic deployment on push

---

## 📊 Data Pipeline

### Running the Pipeline

```bash
# Full multi-state pipeline
python3 run_multi_state_pipeline.py

# Direct execution
node scripts/multi-state-processor.js

# Background execution
nohup python3 run_multi_state_pipeline.py > /tmp/pipeline-output.log 2>&1 &
```

### What It Does

1. **Crawls** Ambetter websites for Texas and Florida
2. **Extracts** PDF brochures and web content
3. **Processes** text from PDFs using pdftotext
4. **Enriches** documents with metadata
5. **Indexes** everything into Elasticsearch
6. **Reports** summary and statistics

### Current Data

- **Total Documents**: 544
  - Texas: 302 documents
  - Florida: 242 documents
- **Document Types**: Summary of Benefits, Evidence of Coverage, Brochures, etc.
- **Plan Types**: EPO, HMO, Bronze, Silver, Gold

---

## 🚀 Deployment

### Vercel (Production)

```bash
# Deploy to Vercel
vercel --prod

# Set environment variables
vercel env add ELASTIC_ENDPOINT
vercel env add ELASTIC_API_KEY
vercel env add OPENAI_API_KEY
```

**See [PROJECT_MASTER.md](./PROJECT_MASTER.md#deployment-guide) for detailed deployment instructions.**

---

## 🔗 Quick Links

### **Live Application**
- **Production**: [ambetter-project.vercel.app](https://ambetter-project.vercel.app)
- **Admin Panel**: [ambetter-project.vercel.app/admin](https://ambetter-project.vercel.app/admin)
- **Search Demo**: [ambetter-project.vercel.app/search?q=texas+health+plans](https://ambetter-project.vercel.app/search?q=texas+health+plans)

### **Documentation**
- **📘 Complete Guide**: [docs/PROJECT_MASTER.md](./docs/PROJECT_MASTER.md)
- **🏗️ Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md) (with flowcharts)
- **🎯 Demo Flows**: [docs/DEMO_101_FLOWS.md](./docs/DEMO_101_FLOWS.md)
- **📋 Coding Standards**: [docs/CODING_STANDARDS.md](./docs/CODING_STANDARDS.md)
- **🚀 Deployment**: [docs/DEPLOYMENT.md](./docs/DEPLOYMENT.md)

### **Development**
- **Local Development**: `npm run dev` → [localhost:3000](http://localhost:3000)
- **Admin Login**: `admin` / `admin`
- **API Test**: [localhost:3000/api/test-elastic](http://localhost:3000/api/test-elastic)

---

## 🔑 Environment Variables

```env
# Elasticsearch (REQUIRED)
ELASTIC_ENDPOINT=https://your-deployment.es.us-east-1.aws.elastic.cloud
ELASTIC_API_KEY=your_api_key_here

# OpenAI (OPTIONAL - falls back to mock)
OPENAI_API_KEY=sk-proj-your_key_here

# RabbitMQ (OPTIONAL - for analytics)
RABBITMQ_URL=amqp://your-rabbitmq-url:5672
```

---

## 📚 Additional Documentation

- **[PROJECT_MASTER.md](./PROJECT_MASTER.md)** - Complete documentation *(START HERE)*
- **[CODING_STANDARDS.md](./CODING_STANDARDS.md)** - Coding rules and best practices
- **[MULTI_STATE_SETUP.md](./MULTI_STATE_SETUP.md)** - Multi-state configuration guide
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** - Vercel deployment guide

---

## 🐛 Troubleshooting

### Common Issues

**Issue**: pdftotext not found
```bash
# macOS
brew install poppler

# Linux
sudo apt-get install poppler-utils
```

**Issue**: State inconsistency (TX vs Texas)
- See [PROJECT_MASTER.md - Troubleshooting](./PROJECT_MASTER.md#troubleshooting) for solutions

**Issue**: No results on Vercel
- Check environment variables in Vercel dashboard
- Disable Deployment Protection
- Verify Elasticsearch credentials

**For more troubleshooting, see [PROJECT_MASTER.md](./PROJECT_MASTER.md#troubleshooting)**

---

## 🎯 Current Status

### Phase 1: Data Foundation ✅ **COMPLETED**
- Multi-state data indexing (TX, FL)
- PDF processing pipeline
- Metadata extraction
- Elasticsearch integration

### Phase 2: Search Interface 🚧 **IN PROGRESS**
- Google-like search interface ✅
- AI-powered summaries ✅
- Faceted filtering ✅
- State consistency fixes 🔄
- ELSER semantic search ⏳
- Analytics dashboard ⏳

---

## 📞 Support

For issues, questions, or feature requests:
1. Check the [Troubleshooting Guide](./PROJECT_MASTER.md#troubleshooting)
2. Review the [Complete Documentation](./PROJECT_MASTER.md)
3. Consult individual documentation files

---

## 🤝 Contributing

This is a demo project. For production use:
1. Review the [Coding Standards](./CODING_STANDARDS.md)
2. Understand the [System Architecture](./PROJECT_MASTER.md#system-architecture)
3. Follow the [Development Workflow](./PROJECT_MASTER.md#development-workflow)

---

## 📄 License

Copyright © 2025. All rights reserved.

---

**For the complete documentation, see [PROJECT_MASTER.md](./PROJECT_MASTER.md)** 📘
