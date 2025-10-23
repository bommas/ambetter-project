# Ambetter Health Plan Search App - Concept Document

**Version**: 1.0
**Date**: October 2025
**Based on**: www.ambetterhealth.com/en/ UX Analysis

---

## 🎯 Executive Summary

The Ambetter Health Plan Search App is designed to provide an **intelligent, AI-powered search experience** for Texas health plan documents, going beyond the traditional ZIP-code-based plan finder to deliver **semantic search, instant answers, and personalized recommendations**.

Unlike the standard Ambetter enrollment flow (location → plans → external tool), our app provides:
- **Direct document search** across 160+ indexed PDFs
- **Natural language queries** (e.g., "What preventive services are free?")
- **County-specific filtering** without leaving the app
- **AI-powered summaries** of complex plan documents
- **Instant comparisons** between plan types (TX014, TX016, TX017)

---

## 🧭 User Journey Concept

### Traditional Ambetter Flow
```
Homepage → Select State → Enter ZIP → External Tool → View Plans → Download PDFs
```

### Our Enhanced Search App Flow
```
Homepage → Search Query → Instant Results → AI Summary → Filter & Compare → Direct PDF Access
```

---

## 🎨 Design Concept: "Search-First Healthcare Discovery"

### Core Design Principles

1. **Search-First Interface**
   - Prominent hero search bar (like Google, but for health plans)
   - Voice-to-text search capability
   - Real-time search suggestions as user types
   - Recent searches and trending topics

2. **County-Centric Filtering**
   - Visual county map of Texas (interactive)
   - Quick county selector dropdown
   - Auto-detect user location (with permission)
   - Multi-county comparison view

3. **AI-Powered Intelligence**
   - Natural language understanding
   - Query intent detection (benefits, costs, coverage, doctors)
   - Generative AI summaries of search results
   - "People also asked" related questions

4. **Progressive Disclosure**
   - Start simple: Search bar + popular queries
   - Reveal filters as needed
   - Expand details on demand
   - Deep-dive into specific plans

---

## 📱 Page Layout Concept

### 1. **Homepage - Search Hub**

```
┌─────────────────────────────────────────────────────────────┐
│  [Ambetter Logo]              Shop Plans  For Members  FAQ │
└─────────────────────────────────────────────────────────────┘

            ╔═══════════════════════════════════════╗
            ║   Find Your Perfect Health Plan       ║
            ║                                       ║
            ║   ┌─────────────────────────────┐    ║
            ║   │ 🔍 Search plans, benefits... │    ║
            ║   └─────────────────────────────┘    ║
            ║                                       ║
            ║   [Shop Plans]  [Find a Doctor]      ║
            ╚═══════════════════════════════════════╝

┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│ Popular      │  │ By County    │  │ By Plan Type │
│ Searches     │  │              │  │              │
│              │  │ 🗺️ Travis    │  │ TX014 EPO    │
│ • Maternity  │  │   Dallas     │  │ TX016 EPO    │
│ • Preventive │  │   Harris     │  │ TX017 EPO    │
│ • Dental     │  │   Bexar      │  │              │
└──────────────┘  └──────────────┘  └──────────────┘

                    Quick Stats
        ┌──────────┬──────────┬──────────┐
        │ 160+     │ 9        │ 3        │
        │ Documents│ Counties │ Plan Types│
        └──────────┴──────────┴──────────┘
```

**Key Features:**
- **Hero Search**: Large, centered search bar with placeholder text showing examples
- **Popular Searches**: One-click access to common queries
- **County Selector**: Visual map or quick-access tiles
- **Plan Type Cards**: Direct access to plan comparisons
- **Trust Indicators**: Document count, coverage area, plan variety

---

### 2. **Search Results Page - Intelligent Results**

```
┌─────────────────────────────────────────────────────────────┐
│  [Logo]  [Search: "maternity coverage"]  🔔 📊 👤          │
└─────────────────────────────────────────────────────────────┘

Filters ▼                      Results for "maternity coverage"
┌────────────┐                 ────────────────────────────────
│ 📍 County   │                 💡 AI Summary
│ ☐ Travis   │                 ┌────────────────────────────────┐
│ ☐ Dallas   │                 │ All Ambetter plans cover       │
│ ☐ Harris   │                 │ maternity services including   │
│            │                 │ prenatal visits, delivery, and │
│ 📋 Plan     │                 │ postnatal care. Preventive     │
│ ☐ TX014    │                 │ services like ultrasounds are  │
│ ☐ TX016    │                 │ covered at $0 copay...         │
│ ☐ TX017    │                 └────────────────────────────────┘
│            │
│ 📄 Type     │                 🔍 Top Results (12 documents)
│ ☐ Brochure │
│ ☐ EOC      │                 ┌─────────────────────────────────┐
│ ☐ Summary  │                 │ 📄 TX014-2941-00 EOC           │
│            │                 │ Evidence of Coverage           │
│ 🚬 Tobacco  │                 │ Travis County | Non-tobacco    │
│ ○ Yes/No   │                 │                                │
└────────────┘                 │ "...maternity and newborn care  │
                                │ covered at 100% after          │
                                │ deductible. Includes prenatal   │
                                │ care, delivery, and..."        │
                                │                                │
                                │ [View PDF] [Compare] [Save]    │
                                └─────────────────────────────────┘

                                ┌─────────────────────────────────┐
                                │ 📄 TX016-0019-01 Brochure      │
                                │ Plan Brochure                  │
                                │ Travis County | Tobacco        │
                                │ ...                            │
                                └─────────────────────────────────┘

                                Related Questions
                                • What prenatal visits are free?
                                • Does this cover C-sections?
                                • What about NICU coverage?
```

**Key Features:**
- **AI Summary Box**: Generative summary of top 2-3 results
- **Faceted Filters**: County, plan type, document type, tobacco
- **Smart Result Cards**:
  - Document type badge
  - County and plan ID
  - Contextual snippet (search term highlighted)
  - Quick actions (view, compare, save)
- **Related Questions**: AI-generated follow-up queries
- **Sort Options**: Relevance, plan type, county, date

---

### 3. **Plan Comparison View**

```
┌─────────────────────────────────────────────────────────────┐
│  Comparing 3 Plans                    [Save] [Share] [Print]│
└─────────────────────────────────────────────────────────────┘

                 TX014-2941-00  │  TX016-0019-01  │  TX017-0064-00
──────────────────────────────────────────────────────────────────
County           Travis         │  Travis         │  Dallas
Plan Type        EPO            │  EPO            │  EPO
Tobacco          No             │  Yes            │  No
──────────────────────────────────────────────────────────────────
💰 Premium        $XXX/mo        │  $XXX/mo        │  $XXX/mo
🏥 Deductible     $X,XXX         │  $X,XXX         │  $X,XXX
💊 Rx Coverage    ✅ Included     │  ✅ Included     │  ✅ Included
👶 Maternity      ✅ Covered      │  ✅ Covered      │  ✅ Covered
🦷 Dental         ❌ Separate     │  ❌ Separate     │  ❌ Separate
👁️ Vision         ❌ Separate     │  ❌ Separate     │  ❌ Separate
──────────────────────────────────────────────────────────────────
Documents        [View EOC]     │  [View Brochure]│  [View SBC]
                 [View Brochure]│  [View OOC]     │  [View EOC]
──────────────────────────────────────────────────────────────────
                 [Select Plan]     [Select Plan]     [Select Plan]
```

**Key Features:**
- **Side-by-side comparison**: Up to 3 plans
- **Key metrics**: Premium, deductible, coverage highlights
- **Visual indicators**: ✅/❌ for quick scanning
- **Document access**: Direct links to relevant PDFs
- **Export options**: Save comparison, share link, print

---

### 4. **Advanced Search Features**

#### A. **Natural Language Processing**

**User Query Examples:**
- "What are the cheapest plans in Travis County?"
- "Show me plans that cover maternity without tobacco surcharge"
- "Compare deductibles for TX014 vs TX016 in Dallas"
- "Which plans include free preventive care?"

**System Response:**
- Detect intent (cost, coverage, comparison, eligibility)
- Extract entities (county, plan type, benefit category)
- Generate targeted results
- Provide AI-generated answer + supporting documents

#### B. **Smart Filters**

```
Advanced Filters
├── Location
│   ├── County selector (9 Texas counties)
│   ├── Multi-county selection
│   └── Map view toggle
├── Plan Details
│   ├── Plan ID (TX014, TX016, TX017)
│   ├── Plan variant (00-06)
│   └── Tobacco use (Yes/No/Both)
├── Document Type
│   ├── Brochure
│   ├── Evidence of Coverage (EOC)
│   ├── Out of Coverage (OOC)
│   ├── Summary of Benefits (SBC)
│   └── Policy Documents
├── Coverage Features
│   ├── Maternity
│   ├── Prescription Drugs
│   ├── Mental Health
│   ├── Preventive Care
│   └── Specialist Visits
└── Cost Range
    ├── Premium (slider)
    ├── Deductible (slider)
    └── Out-of-pocket max (slider)
```

#### C. **Search Suggestions & Autocomplete**

**As user types "mater...":**
```
┌────────────────────────────────┐
│ 🔍 mater                       │
├────────────────────────────────┤
│ 💬 maternity coverage          │
│ 💬 maternity benefits          │
│ 💬 maternity copay             │
│ 📄 maternity services TX014    │
│ ❓ maternal health programs    │
└────────────────────────────────┘
```

---

## 🤖 AI-Powered Features

### 1. **Generative AI Summary**
- Summarize top 2-3 results into natural language
- Extract key facts (costs, coverage, requirements)
- Highlight differences between plans
- Cite source documents

**Example:**
```
💡 AI Summary

Based on 3 matching documents, all Ambetter TX014 plans in Travis
County cover maternity services including:
• Prenatal visits: $0 copay (preventive)
• Labor & delivery: Covered after deductible
• Postnatal care: 1 visit within 60 days at $0

Plans TX014-2941-00 and TX014-2941-01 have identical maternity
coverage but differ in tobacco surcharge.

Sources: EOC TX014-2941-00 (p. 23), Brochure TX014-2941-01 (p. 5)
```

### 2. **Question Answering**
- Direct answers to common questions
- "Smart suggestions" based on user intent
- Follow-up question generation

**Example Q&A:**
- **Q:** "What preventive services are free?"
- **A:** "All Ambetter plans cover annual check-ups, immunizations, screenings, and wellness visits at $0 copay when using in-network providers..."

### 3. **Plan Recommendations**
- Based on user search history
- Personalized suggestions
- "Best match" indicators

**Example:**
```
🎯 Recommended for You

Based on your searches for "maternity" and "Travis County":

TX014-2941-00 (Non-tobacco)
✨ Best Match - 95% relevance
• Comprehensive maternity coverage
• $0 preventive care
• Travis County network
```

---

## 📊 Analytics & Insights Dashboard

### User-Facing Insights
```
Your Search Activity
├── Recent Searches (5)
├── Saved Plans (3)
├── Compared Plans (2)
└── Popular This Week
    ├── "preventive care" (1,234 searches)
    ├── "maternity coverage" (987 searches)
    └── "dental options" (654 searches)
```

### Admin Dashboard Features
- Search volume by term
- Popular plan types
- County distribution
- Click-through rates
- Conversion funnel
- A/B testing results

---

## 🎯 Key Differentiators

| Feature | Traditional Ambetter Site | Our Search App |
|---------|--------------------------|----------------|
| **Search Method** | ZIP code lookup | Natural language search |
| **Results** | External enrollment tool | Direct PDF access + AI summary |
| **Filtering** | Limited (location only) | Multi-dimensional (county, plan, type, features) |
| **Comparison** | Manual PDF review | Side-by-side comparison tool |
| **Intelligence** | Static content | AI-powered answers & recommendations |
| **Document Access** | Buried in pages | Direct search results |
| **User Experience** | Multi-step process | Single-page search flow |

---

## 🚀 Implementation Roadmap

### Phase 1: Core Search (Current)
- ✅ Elasticsearch hybrid search
- ✅ 160+ documents indexed
- ✅ Basic filtering (county, plan type)
- ✅ Responsive UI with Ambetter design

### Phase 2: Enhanced Search (Next)
- 🔲 AI-powered summaries (OpenAI/Claude integration)
- 🔲 Natural language query processing
- 🔲 Advanced filters (cost, coverage features)
- 🔲 Search autocomplete & suggestions
- 🔲 Related questions generation

### Phase 3: Comparison & Recommendations
- 🔲 Side-by-side plan comparison
- 🔲 Personalized recommendations
- 🔲 Save & share functionality
- 🔲 Export to PDF/CSV

### Phase 4: Analytics & Optimization
- 🔲 User behavior tracking
- 🔲 Click-stream analytics
- 🔲 A/B testing framework
- 🔲 Search relevance tuning
- 🔲 Performance optimization

---

## 💡 Example User Scenarios

### Scenario 1: First-Time User
**User:** Maria, 32, pregnant, lives in Travis County

**Journey:**
1. Lands on homepage, sees "Find Your Perfect Health Plan"
2. Types: "maternity coverage Travis County"
3. Sees AI summary: "All plans cover maternity, here's what's included..."
4. Filters to TX014 plans, non-tobacco
5. Compares 2 plans side-by-side
6. Views EOC PDF for detailed benefits
7. Saves preferred plan for later

**Result:** Found comprehensive information in 3 minutes vs. 15+ minutes navigating traditional site

### Scenario 2: Existing Member
**User:** James, 45, has TX016 plan, needs specialist info

**Journey:**
1. Searches: "specialist copay TX016"
2. Gets instant answer: "$50 copay for specialists"
3. Sees related question: "Do I need a referral?"
4. Clicks through to find: "Yes, PCP referral required"
5. Downloads OOC document for reference

**Result:** Quick answer + supporting documentation without calling customer service

### Scenario 3: Comparison Shopper
**User:** Lisa, 28, moving from Dallas to Austin

**Journey:**
1. Searches: "compare plans Dallas vs Travis County"
2. Selects plans from both counties
3. Views side-by-side comparison
4. Notices Travis County has more provider options
5. Filters to show only plans with her current doctors
6. Exports comparison to share with spouse

**Result:** Data-driven decision with all information in one place

---

## 🎨 UI/UX Wireframe Concepts

### Mobile-First Design
```
┌───────────────────┐
│ [≡] 🔍 Ambetter  │
├───────────────────┤
│                   │
│  Search health    │
│  plans...         │
│  ┌─────────────┐  │
│  │ 🔍 Search   │  │
│  └─────────────┘  │
│                   │
│  Popular Searches │
│  ┌─────┐ ┌─────┐ │
│  │Mat- │ │Prev-│ │
│  │ern- │ │ent- │ │
│  │ity  │ │ive  │ │
│  └─────┘ └─────┘ │
│                   │
│  Select County    │
│  ┌─────────────┐  │
│  │ Travis  ▼   │  │
│  └─────────────┘  │
│                   │
│  [View All Plans] │
└───────────────────┘
```

### Tablet/Desktop - Search Results
```
┌──────────────────────────────────────────────────┐
│ [Ambetter] [Search: maternity]     🔔 👤        │
├──────────────────────────────────────────────────┤
│                                                  │
│ Filters          │  💡 AI Summary               │
│ ┌─────────┐     │  ┌──────────────────────┐   │
│ │ County  │     │  │ All plans cover...   │   │
│ │ Plan    │     │  └──────────────────────┘   │
│ │ Type    │     │                              │
│ └─────────┘     │  📄 Results (12)            │
│                 │  ┌──────────────────────┐   │
│                 │  │ TX014-2941-00        │   │
│                 │  │ [View] [Compare]     │   │
│                 │  └──────────────────────┘   │
└──────────────────────────────────────────────────┘
```

---

## 🔧 Technical Architecture

### Frontend
- **Next.js 14** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** + Ambetter design system
- **Framer Motion** for animations
- **React Hook Form** for search inputs
- **Zustand** for state management

### Backend
- **Next.js API Routes** for search endpoints
- **Elasticsearch** for document search & filtering
- **OpenAI/Claude API** for AI summaries
- **RabbitMQ** for analytics queue (future)

### Data Layer
- **Elasticsearch Indices:**
  - `health-plans` (160+ documents)
  - `search-events` (analytics)
  - `click-events` (user behavior)
  - `user-sessions` (tracking)

### Search Flow
```
User Query → NLP Processing → Query Builder → Elasticsearch
           ↓
    AI Summary Generator ← Top Results
           ↓
    Formatted Response → UI Rendering
```

---

## 📈 Success Metrics

### User Experience
- **Search response time**: < 500ms
- **Results relevance**: > 90% user satisfaction
- **Click-through rate**: > 40%
- **Comparison tool usage**: > 25% of searches

### Business Impact
- **Reduced support calls**: Target 30% reduction
- **Faster plan selection**: < 5 min avg. (vs. 15+ min traditional)
- **Increased document access**: 3x more PDF downloads
- **Higher engagement**: 50% increase in session duration

### Technical Performance
- **Search accuracy**: > 95%
- **Uptime**: 99.9%
- **Mobile performance**: < 3s load time
- **Accessibility**: WCAG AA compliance

---

## 🎯 Competitive Advantages

1. **Speed**: Instant results vs. multi-step ZIP code flow
2. **Intelligence**: AI-powered vs. static content
3. **Depth**: Direct document access vs. external tools
4. **Flexibility**: Natural language vs. structured forms
5. **Transparency**: All plans visible vs. filtered by ZIP
6. **Empowerment**: User-driven exploration vs. guided funnel

---

## 🔮 Future Enhancements

### Year 1
- Multi-language support (Spanish)
- Voice search capability
- Mobile app version
- Provider search integration
- Drug formulary search

### Year 2
- Predictive recommendations (ML-based)
- Chatbot assistant
- Virtual health advisor
- Cost estimator tool
- Eligibility checker

### Year 3
- Multi-state expansion
- Open enrollment reminders
- Plan change recommendations
- Health assessment integration
- Personalized health content

---

## 📝 Conclusion

The Ambetter Health Plan Search App reimagines health plan discovery by putting **intelligent search at the center** of the user experience. Instead of forcing users through a linear ZIP-code-to-external-tool journey, we empower them with:

- **Natural language search** that understands intent
- **AI-powered insights** that simplify complexity
- **Direct access** to authoritative plan documents
- **Smart filtering** that reveals the right options
- **Comparison tools** that enable confident decisions

This concept transforms how Texans find health coverage—making it **faster, smarter, and more transparent**.

---

**Next Steps:**
1. Review and approve concept
2. Prioritize Phase 2 features
3. Design detailed UI mockups
4. Integrate OpenAI/Claude API
5. User testing & iteration

**Questions? Let's discuss implementation priorities!**
