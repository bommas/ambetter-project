# Ambetter Health Plan Search - Search Examples

**Last Updated**: October 28, 2024  
**Application**: Ambetter Health Plan Search Application

---

## 🔍 Search Examples by Category

### **1. Basic Health Plan Searches**

#### **General Health Plans**
```
Search Query: "health plans"
Expected Results: All available health plans across states
Filters Applied: None (shows all states)
Key Features: Auto-detection, hybrid search, faceted filtering
```

#### **State-Specific Searches**
```
Search Query: "Texas health plans"
Expected Results: Texas-specific health plans only
Filters Applied: State = TX (auto-detected)
Key Features: State auto-detection, Texas county filtering
```

```
Search Query: "Florida health plans"
Expected Results: Florida-specific health plans only
Filters Applied: State = FL (auto-detected)
Key Features: State auto-detection, Florida county filtering
```

#### **Plan Tier Searches**
```
Search Query: "gold vs silver plans"
Expected Results: Gold and Silver tier plans for comparison
Filters Applied: Plan Type = Gold, Silver
Key Features: Plan comparison, tier-specific results
```

```
Search Query: "Texas Gold Plans"
Expected Results: Gold tier plans in Texas only
Filters Applied: State = TX, Plan Type = Gold
Key Features: Combined state and tier filtering
```

#### **Location-Based Searches**
```
Search Query: "Help me pick a plan if I live in Texas"
Expected Results: Texas-specific plans with recommendations
Filters Applied: State = TX
Key Features: Natural language processing, location-based results
```

---

## 🎯 Advanced Search Examples

### **2. Specific Plan Type Searches**

#### **EPO Plans**
```
Search Query: "EPO plans Texas"
Expected Results: EPO (Exclusive Provider Organization) plans in Texas
Filters Applied: State = TX, Plan Type = EPO
Key Features: Plan type filtering, state-specific results
```

#### **HMO Plans**
```
Search Query: "HMO health plans"
Expected Results: HMO (Health Maintenance Organization) plans
Filters Applied: Plan Type = HMO
Key Features: Plan type filtering across all states
```

#### **Bronze Tier Plans**
```
Search Query: "bronze tier plans"
Expected Results: Bronze tier health plans
Filters Applied: Plan Type = Bronze
Key Features: Tier-based filtering, cost-effective options
```

### **3. Coverage-Specific Searches**

#### **Dental Coverage**
```
Search Query: "dental coverage"
Expected Results: Plans with dental benefits
Filters Applied: Document Type = Summary of Benefits
Key Features: Coverage-specific search, benefit details
```

#### **Vision Coverage**
```
Search Query: "vision insurance"
Expected Results: Plans with vision benefits
Filters Applied: Document Type = Summary of Benefits
Key Features: Vision-specific search, benefit details
```

#### **Prescription Coverage**
```
Search Query: "prescription drug coverage"
Expected Results: Plans with prescription drug benefits
Filters Applied: Document Type = Summary of Benefits
Key Features: Prescription-specific search, benefit details
```

---

## 🏥 Healthcare-Specific Searches

### **4. Family and Individual Plans**

#### **Family Plans**
```
Search Query: "family health plans Texas"
Expected Results: Family-oriented health plans in Texas
Filters Applied: State = TX
Key Features: Family-specific search, Texas location
```

#### **Individual Plans**
```
Search Query: "individual health insurance"
Expected Results: Individual health insurance plans
Filters Applied: None
Key Features: Individual-specific search across states
```

#### **Student Plans**
```
Search Query: "student health plans"
Expected Results: Health plans suitable for students
Filters Applied: None
Key Features: Student-specific search, educational benefits
```

### **5. Specialized Coverage Searches**

#### **Mental Health Coverage**
```
Search Query: "mental health coverage"
Expected Results: Plans with mental health benefits
Filters Applied: Document Type = Summary of Benefits
Key Features: Mental health-specific search, benefit details
```

#### **Maternity Coverage**
```
Search Query: "maternity coverage Texas"
Expected Results: Plans with maternity benefits in Texas
Filters Applied: State = TX, Document Type = Summary of Benefits
Key Features: Maternity-specific search, Texas location
```

#### **Chronic Condition Coverage**
```
Search Query: "diabetes coverage plans"
Expected Results: Plans with diabetes management benefits
Filters Applied: Document Type = Summary of Benefits
Key Features: Chronic condition-specific search, benefit details
```

---

## 🔧 Admin Search Examples

### **6. Admin Dashboard Searches**

#### **Curations Testing**
```
Admin Query: "gold plans"
Purpose: Test curation functionality
Action: Pin important documents, exclude irrelevant ones
Result: Customized search results for this query
```

#### **Boosting Testing**
```
Admin Query: "Texas health plans"
Purpose: Test field boosting
Action: Adjust field weights, test numeric boosts
Result: Optimized search relevance
```

#### **Index Management**
```
Admin Query: "health-plans-tx-2025"
Purpose: Monitor index performance
Action: Check document count, health status
Result: Index statistics and health monitoring
```

---

## 🤖 AI Chat Assistant Examples

### **7. Analytics Queries**

#### **Top Queries Analysis**
```
Chat Query: "What are the top search queries?"
Expected Response: 
- List of most common search queries
- Search frequency and result counts
- Optimization recommendations
```

#### **Zero-Result Queries**
```
Chat Query: "Show me queries with no results"
Expected Response:
- List of queries returning zero results
- Frequency of zero-result queries
- Optimization suggestions
```

#### **Search Analytics Summary**
```
Chat Query: "Give me search analytics summary"
Expected Response:
- Overall search statistics
- Top queries and zero-result queries
- Performance recommendations
```

### **8. Optimization Queries**

#### **Relevance Improvement**
```
Chat Query: "How can I improve search relevance?"
Expected Response:
- Field boosting recommendations
- Synonym suggestions
- Query optimization tips
```

#### **Performance Optimization**
```
Chat Query: "What queries need optimization?"
Expected Response:
- Problematic query identification
- Specific optimization suggestions
- Performance improvement recommendations
```

---

## 📊 Search Analytics Examples

### **9. Real-Time Analytics**

#### **Search Event Tracking**
```
Search Query: "health plans"
Analytics Captured:
- Query text: "health plans"
- Result count: 30
- Timestamp: 2024-10-28T10:30:00Z
- User session: anonymous
- Search duration: 150ms
```

#### **Query Pattern Analysis**
```
Search Pattern: "Texas health plans"
Analytics Insights:
- Frequency: 45 searches in last 7 days
- Average results: 12 per search
- Success rate: 95%
- Optimization opportunity: High
```

#### **Zero-Result Query Analysis**
```
Query: "medicare advantage plans"
Analytics Insights:
- Frequency: 5 occurrences
- Result count: 0
- Optimization needed: Yes
- Suggested actions: Add synonyms, broaden search
```

---

## 🎯 Best Practices for Search

### **10. Effective Search Strategies**

#### **Natural Language Queries**
```
Good Examples:
- "Help me find a gold plan in Texas"
- "What are the best family plans?"
- "Show me plans with dental coverage"

Avoid:
- "TX GOLD PLAN"
- "FAMILY TX"
- "DENTAL TX"
```

#### **Specific vs. General Queries**
```
Specific (Recommended):
- "Texas gold EPO plans"
- "Florida bronze HMO plans"
- "Family dental coverage Texas"

General (Use sparingly):
- "health plans"
- "insurance"
- "coverage"
```

#### **Filter Combination**
```
Effective Combinations:
- State + Plan Type: "Texas gold plans"
- State + Coverage: "Florida dental plans"
- Plan Type + Coverage: "EPO vision plans"

Less Effective:
- Too many filters: "Texas gold EPO dental vision plans"
- Conflicting filters: "Texas Florida plans"
```

---

## 📈 Performance Metrics

### **11. Search Performance Examples**

#### **Fast Queries (< 100ms)**
```
Query: "health plans"
Response Time: 85ms
Results: 30
Index: health-plans
```

#### **Medium Queries (100-200ms)**
```
Query: "Texas gold plans"
Response Time: 150ms
Results: 15
Index: health-plans-tx-2025
```

#### **Complex Queries (200-300ms)**
```
Query: "Help me pick a plan if I live in Texas"
Response Time: 250ms
Results: 20
Index: health-plans-tx-2025
```

---

## 🔍 Troubleshooting Examples

### **12. Common Search Issues**

#### **No Results Found**
```
Query: "medicare advantage plans"
Issue: Query returns zero results
Solution: 
- Check if query is too specific
- Try broader terms
- Use admin chat assistant for optimization
```

#### **Too Many Results**
```
Query: "health plans"
Issue: Returns 1000+ results
Solution:
- Add state filter: "Texas health plans"
- Add plan type filter: "gold health plans"
- Use faceted filtering
```

#### **Irrelevant Results**
```
Query: "dental plans"
Issue: Returns general health plans
Solution:
- Use more specific terms: "dental coverage"
- Check document types
- Use admin curations to pin relevant results
```

---

*This examples guide provides comprehensive search examples for the Ambetter Health Plan Search Application, covering user searches, admin functions, AI chat interactions, and analytics.*
