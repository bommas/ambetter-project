# Ambetter Health Plan Search Application

A comprehensive full-stack application for searching and analyzing Ambetter health plans in Texas, featuring advanced search capabilities, plan boosting, and analytics dashboard.

## 🏥 Project Overview

This application provides a powerful search interface for Texas Ambetter health plans, enabling users to find the most suitable health insurance plans based on their specific needs. The system features hybrid search capabilities, AI-powered summaries, and comprehensive analytics.

### Key Features

- 🔍 **Hybrid Search**: Combines vector similarity with keyword matching
- 🤖 **AI-Powered Summaries**: Generative summaries of top search results
- 📊 **React Analytics Dashboard**: Real-time insights and click stream analytics
- ⚡ **Plan Boosting**: Dynamic plan ranking and A/B testing
- 📱 **Responsive Design**: Mobile-first approach matching Ambetter's design
- 🎯 **Smart Filtering**: Filter by county, tobacco use, plan type, and more

## 🏗️ System Architecture

### High-Level Architecture
```mermaid
graph TB
    subgraph "Next.js Application"
        A[Search Interface<br/>React Components]
        B[Analytics Dashboard<br/>Admin & Insights]
        C[API Routes<br/>Search, Analytics, Management]
    end
    
    subgraph "Data Layer"
        G[Elasticsearch<br/>Unified Data Store<br/>Search + Analytics + Click Stream]
        H[RabbitMQ<br/>Message Queue]
    end
    
    subgraph "External Services"
        J[Ambetter Website<br/>PDF Source]
        K[AI Services<br/>OpenAI/Claude]
    end
    
    A --> C
    B --> C
    C --> G
    C --> H
```

## 📋 Project Requirements

Detailed project requirements and architecture diagrams are available in [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md).

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (for Next.js)
- **Docker & Docker Compose**
- **Elasticsearch 8.x** or **OpenSearch 2.x**
- **RabbitMQ 3.8+**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/ambetter-project.git
   cd ambetter-project
   ```

2. **Set up environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

3. **Start services with Docker Compose**
   ```bash
   docker-compose up -d
   ```

4. **Install dependencies**
   ```bash
   npm install
   ```

5. **Run the application**
   ```bash
   # Start Next.js development server
   npm run dev
   ```

## 🛠️ Technology Stack

### Full-Stack
- **Next.js 14** with **TypeScript**
- **Tailwind CSS** for styling and responsive design
- **API Routes** for backend functionality
- **Framer Motion** for smooth animations
- **Chart.js** for analytics visualizations

### Data & Services
- **Elasticsearch/OpenSearch** for unified data store (search, analytics, click stream, caching)
- **RabbitMQ** for message queuing
- **JWT** for authentication

### AI/ML
- **OpenAI API** or **Anthropic Claude** for summaries
- **Elasticsearch Vector Search** for semantic search
- **Custom embeddings** for health plan documents

### Infrastructure
- **Docker** for containerization
- **Nginx** for reverse proxy
- **PM2** for process management

## 📁 Project Structure

```
ambetter-project/
├── docs/                          # Documentation
│   ├── PROJECT_REQUIREMENTS.md    # Detailed requirements
│   └── API_DOCUMENTATION.md       # API documentation
├── src/                           # Next.js application
│   ├── app/                       # App router pages
│   ├── components/                # React components
│   ├── lib/                       # Utility functions
│   └── api/                       # API routes
├── crawler/                       # PDF crawling service
│   ├── src/
│   │   ├── crawlers/              # Web crawlers
│   │   ├── processors/            # Data processors
│   │   └── indexers/              # Elasticsearch indexers
├── analytics/                     # Analytics service
│   ├── src/
│   │   ├── processors/            # Click stream processors
│   │   ├── dashboards/            # React analytics dashboards
│   │   └── exporters/             # Data exporters
├── docker-compose.yml             # Docker services
├── .env.example                   # Environment variables template
└── README.md                      # This file
```

## 🔧 Development Phases

### Phase 1: Data Foundation (Weeks 1-2)
- [ ] Set up Elasticsearch cluster
- [ ] Configure PDF crawler for Ambetter website
- [ ] Implement document processing pipeline
- [ ] Create custom mapping and indexing
- [ ] Test data extraction and indexing

### Phase 2: Next.js Application Development (Weeks 3-4)
- [ ] Set up Next.js 14 application with TypeScript
- [ ] Create pages for search, results, and analytics
- [ ] Implement API routes for search and analytics
- [ ] Build search interface matching Ambetter design
- [ ] Add filtering and faceted search

### Phase 3: API Routes & Features (Weeks 5-6)
- [ ] Build API routes for search, analytics, and plan management
- [ ] Implement plan boosting system
- [ ] Add click tracking functionality
- [ ] Set up authentication and security
- [ ] Integrate AI services for summaries

### Phase 4: Analytics & Dashboard (Weeks 7-8)
- [ ] Set up RabbitMQ for click stream
- [ ] Implement analytics data pipeline
- [ ] Build Next.js analytics dashboard
- [ ] Add real-time metrics and visualizations
- [ ] Implement A/B testing framework

## 📊 API Endpoints

### Search API
- `GET /api/search` - Main search endpoint with hybrid search
- `GET /api/plans` - Plan management and retrieval
- `POST /api/boost` - Plan boosting functionality

### Analytics API
- `GET /api/analytics` - Search analytics data
- `POST /api/click` - Click tracking endpoint
- `GET /api/metrics` - Performance metrics

## 🧪 Testing

```bash
# Run Next.js tests
npm test

# Run integration tests
npm run test:integration
```

## 📈 Performance Metrics

- Search response time < 200ms
- 95%+ search accuracy
- Real-time React analytics dashboard
- Mobile-responsive design
- Scalable architecture for future growth

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions, please open an issue in the GitHub repository or contact the development team.

## 🔮 Future Enhancements

- Machine learning for personalized recommendations
- Advanced analytics with predictive insights
- Multi-state expansion beyond Texas
- Integration with external health plan APIs
- Advanced reporting and export capabilities

---

**Built with ❤️ for better healthcare access in Texas**
