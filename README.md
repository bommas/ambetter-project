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

**For complete project documentation, requirements, architecture, and guides, see:**

### **[📘 PROJECT_MASTER.md](./PROJECT_MASTER.md)**

This master document contains:
- ✅ Complete project overview and status
- ✅ System architecture diagrams
- ✅ Phase 1 & Phase 2 details
- ✅ Multi-state setup guide
- ✅ API documentation
- ✅ Deployment instructions
- ✅ Troubleshooting guide
- ✅ Development workflow

---

## 🎯 What is This?

A full-stack Next.js application that allows users to:
- 🔍 Search health plans across **Texas** and **Florida**
- 🤖 Get **AI-powered summaries** of plan options
- 📊 Filter by state, document type, and plan ID
- 📄 Access PDF brochures directly
- 📈 Track search analytics (coming soon)

---

## 🏗️ Project Structure

```
ambetter-project/
├── src/
│   ├── app/                  # Next.js 14 App Router
│   │   ├── page.tsx          # Homepage (Google-like search)
│   │   ├── search/           # Search results page
│   │   └── api/              # API routes
│   ├── components/           # React components (future)
│   └── lib/                  # Utilities and services
│       └── elasticsearch.ts  # Elasticsearch client
├── scripts/
│   ├── multi-state-processor.js  # PDF extraction & indexing
│   └── qa-test.sh            # QA validation scripts
├── config/
│   └── app-config.js         # Centralized configuration
├── run_multi_state_pipeline.py  # Pipeline orchestrator
├── PROJECT_MASTER.md         # 📘 Complete documentation
└── package.json
```

---

## ⚡ Key Features

### Currently Available ✅
- **Multi-State Search**: Texas and Florida health plans
- **Hybrid Search**: Keyword-based search with Elasticsearch
- **AI Summaries**: OpenAI-powered plan summaries
- **Faceted Filtering**: Filter by state, document type, plan
- **PDF Access**: Direct links to plan brochures
- **Responsive Design**: Works on all devices
- **Ambetter Branding**: Matches official design guidelines

### Coming Soon 🚧
- **Semantic Search**: ELSER-powered contextual search
- **Analytics Dashboard**: Real-time search metrics
- **Click Tracking**: User behavior analytics
- **Plan Boosting**: Admin-controlled plan ranking
- **More States**: California, Georgia, and more

---

## 🛠️ Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Backend**: Next.js API Routes, Node.js
- **Search**: Elasticsearch Serverless
- **AI**: OpenAI GPT-4o-mini
- **Data Processing**: Puppeteer, pdftotext
- **Deployment**: Vercel
- **Analytics**: RabbitMQ (optional)

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
