# Coding Standards & Best Practices

## 🎯 Project-Wide Coding Rules & Standards

This document outlines the coding standards, best practices, and architectural principles established during the Ambetter Health Plan Search project. These rules should be applied to all future coding projects for consistency, maintainability, and quality.

---

## 📁 **File & Directory Management**

### Temporary File Management
- **✅ ALWAYS** create temporary files in a dedicated project subdirectory (e.g., `./temp/processing/`)
- **✅ NEVER** create temp files in the system temp directory or project root
- **✅ ALWAYS** implement cleanup functions that run at script start and end
- **✅ ALWAYS** handle cleanup in error scenarios (try/catch/finally blocks)
- **✅ ALWAYS** log cleanup operations for debugging
- **✅ ALWAYS** use descriptive temp file names with timestamps to avoid conflicts

```javascript
// ✅ GOOD: Project-contained temp directory
const tempDir = path.resolve('./temp/pdf-processing');
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

// ✅ GOOD: Cleanup function
function cleanupTempDir() {
  try {
    if (fs.existsSync(tempDir)) {
      const files = fs.readdirSync(tempDir);
      files.forEach(file => {
        const filePath = path.join(tempDir, file);
        if (fs.statSync(filePath).isFile()) {
          fs.unlinkSync(filePath);
        }
      });
      console.log(`🧹 Cleaned up ${files.length} temp files`);
    }
  } catch (error) {
    console.error('❌ Error cleaning up temp directory:', error.message);
  }
}
```

### Directory Structure
- **✅ ALWAYS** use consistent directory naming (kebab-case)
- **✅ ALWAYS** separate configuration, scripts, and source code
- **✅ ALWAYS** create dedicated directories for temporary files
- **✅ ALWAYS** use relative paths from project root when possible

---

## ⚙️ **Configuration Management**

### Centralized Configuration
- **✅ ALWAYS** create a single configuration file for all URLs, API keys, and settings
- **✅ NEVER** hardcode URLs, API keys, or configuration values in multiple files
- **✅ ALWAYS** use environment variables with sensible defaults
- **✅ ALWAYS** document all configuration options with comments
- **✅ ALWAYS** make configuration easily overrideable for different environments

```javascript
// ✅ GOOD: Centralized configuration
const config = {
  elasticsearch: {
    endpoint: process.env.ELASTIC_ENDPOINT || 'default-endpoint',
    apiKey: process.env.ELASTIC_API_KEY || 'default-key',
    indices: {
      healthPlans: 'health-plans',
      searchEvents: 'search-events'
    }
  },
  processing: {
    tempDir: './temp/processing',
    maxRetries: 3,
    retryDelay: 2000
  }
};

module.exports = config;
```

### Environment Variables
- **✅ ALWAYS** provide `.env.example` file with all required variables
- **✅ ALWAYS** use descriptive environment variable names
- **✅ ALWAYS** include fallback values for development
- **✅ NEVER** commit actual API keys or sensitive data

---

## 🔧 **Code Organization & Structure**

### Function Design
- **✅ ALWAYS** create single-purpose functions with clear responsibilities
- **✅ ALWAYS** use descriptive function names that explain what they do
- **✅ ALWAYS** implement proper error handling with try/catch blocks
- **✅ ALWAYS** add comprehensive logging for debugging and monitoring
- **✅ ALWAYS** validate inputs and handle edge cases

```javascript
// ✅ GOOD: Well-structured function
async function processPDF(pdfUrl) {
  try {
    console.log(`\n🔄 Processing: ${path.basename(pdfUrl)}`);
    
    // Download PDF
    const tempFilename = path.join(tempDir, `temp_${Date.now()}_${filename}`);
    await downloadPDF(pdfUrl, tempFilename);
    
    // Extract text
    const extractedText = await extractTextFromPDF(tempFilename);
    
    // Create document
    const document = createDocument(extractedText, pdfUrl);
    
    // Index document
    const response = await client.index({
      index: config.elasticsearch.indices.healthPlans,
      body: document
    });
    
    console.log(`✅ Indexed: ${filename} (ID: ${response._id})`);
    return response;
    
  } catch (error) {
    console.error(`❌ Error processing ${pdfUrl}:`, error.message);
    throw error;
  }
}
```

### Error Handling
- **✅ ALWAYS** implement retry logic for external API calls
- **✅ ALWAYS** log errors with context and stack traces
- **✅ ALWAYS** provide meaningful error messages
- **✅ ALWAYS** handle cleanup in error scenarios
- **✅ ALWAYS** use appropriate HTTP status codes for API responses

### Logging Standards
- **✅ ALWAYS** use consistent emoji prefixes for different log types
- **✅ ALWAYS** include timestamps and context in logs
- **✅ ALWAYS** log start/completion of major operations
- **✅ ALWAYS** log errors with full context

```javascript
// ✅ GOOD: Consistent logging
console.log('🚀 Starting PDF extraction...');
console.log('✅ Successfully processed: 138 PDFs');
console.log('❌ Failed to process PDF:', error.message);
console.log('📊 Total documents in index: 160');
```

---

## 🚫 **Anti-Patterns & What NOT to Do**

### Hardcoding
- **❌ NEVER** hardcode URLs, API keys, or configuration values
- **❌ NEVER** hardcode file paths or directory names
- **❌ NEVER** hardcode magic numbers or strings
- **❌ NEVER** duplicate configuration across multiple files

### File Management
- **❌ NEVER** create files in system temp directories
- **❌ NEVER** leave temporary files after script completion
- **❌ NEVER** use generic or unclear file names
- **❌ NEVER** ignore file cleanup in error scenarios

### Code Quality
- **❌ NEVER** create functions that do multiple unrelated things
- **❌ NEVER** ignore error handling
- **❌ NEVER** use unclear variable or function names
- **❌ NEVER** skip input validation

---

## 📚 **Documentation Standards**

### Code Documentation
- **✅ ALWAYS** add comprehensive comments for complex logic
- **✅ ALWAYS** document function parameters and return values
- **✅ ALWAYS** explain the purpose of each major code section
- **✅ ALWAYS** include examples for complex functions

### Project Documentation
- **✅ ALWAYS** create detailed README with setup instructions
- **✅ ALWAYS** document the complete process workflow
- **✅ ALWAYS** include architecture diagrams and flow charts
- **✅ ALWAYS** provide troubleshooting guides
- **✅ ALWAYS** keep documentation up-to-date with code changes

### Process Documentation
- **✅ ALWAYS** document data flow and transformations
- **✅ ALWAYS** explain configuration options and their effects
- **✅ ALWAYS** provide step-by-step setup instructions
- **✅ ALWAYS** include validation and testing procedures

---

## 🔄 **Process & Workflow Standards**

### Data Processing
- **✅ ALWAYS** implement batch processing for large datasets
- **✅ ALWAYS** add progress indicators for long-running operations
- **✅ ALWAYS** implement proper retry logic with exponential backoff
- **✅ ALWAYS** validate data before processing
- **✅ ALWAYS** log processing statistics and metrics

### Pipeline Management
- **✅ ALWAYS** create orchestration scripts for complex workflows
- **✅ ALWAYS** implement proper dependency checking
- **✅ ALWAYS** add validation steps at each pipeline stage
- **✅ ALWAYS** provide clear success/failure indicators

### Testing & Validation
- **✅ ALWAYS** validate results against expected outcomes
- **✅ ALWAYS** test error scenarios and edge cases
- **✅ ALWAYS** verify data integrity after processing
- **✅ ALWAYS** document test results and validation procedures

---

## 🏗️ **Architecture Principles**

### Separation of Concerns
- **✅ ALWAYS** separate configuration from business logic
- **✅ ALWAYS** separate data processing from data storage
- **✅ ALWAYS** separate error handling from main logic
- **✅ ALWAYS** use modular, reusable components

### Scalability
- **✅ ALWAYS** design for horizontal scaling
- **✅ ALWAYS** implement proper resource management
- **✅ ALWAYS** use efficient data structures and algorithms
- **✅ ALWAYS** consider memory usage and cleanup

### Maintainability
- **✅ ALWAYS** write self-documenting code
- **✅ ALWAYS** use consistent naming conventions
- **✅ ALWAYS** implement proper abstraction layers
- **✅ ALWAYS** make code easy to modify and extend

---

## 📊 **Monitoring & Observability**

### Logging
- **✅ ALWAYS** log all major operations and decisions
- **✅ ALWAYS** include performance metrics in logs
- **✅ ALWAYS** log data processing statistics
- **✅ ALWAYS** provide clear success/failure indicators

### Metrics
- **✅ ALWAYS** track processing success rates
- **✅ ALWAYS** monitor resource usage
- **✅ ALWAYS** log performance metrics
- **✅ ALWAYS** provide data quality indicators

---

## 🎯 **Project-Specific Rules**

### Elasticsearch Integration
- **✅ ALWAYS** use keyword fields for aggregations and filtering
- **✅ ALWAYS** implement proper mapping for all data types
- **✅ ALWAYS** validate document structure before indexing
- **✅ ALWAYS** handle Elasticsearch errors gracefully

### PDF Processing
- **✅ ALWAYS** use robust PDF parsing libraries (pdf-parse)
- **✅ ALWAYS** handle different PDF formats and encodings
- **✅ ALWAYS** extract and clean text properly
- **✅ ALWAYS** validate extracted content quality

### Web Scraping
- **✅ ALWAYS** use headless browsers for JavaScript-heavy sites
- **✅ ALWAYS** implement proper pagination handling
- **✅ ALWAYS** add delays between requests to avoid rate limiting
- **✅ ALWAYS** handle dynamic content loading

---

## 📋 **Code Review Checklist**

Before committing any code, ensure:

- [ ] No hardcoded values (URLs, API keys, paths)
- [ ] Proper error handling and logging
- [ ] Temporary files are managed correctly
- [ ] Configuration is centralized
- [ ] Functions are single-purpose and well-named
- [ ] Input validation is implemented
- [ ] Cleanup functions are called in all scenarios
- [ ] Documentation is updated
- [ ] Code follows consistent style
- [ ] No magic numbers or strings
- [ ] Proper resource management
- [ ] Comprehensive logging
- [ ] Error scenarios are handled
- [ ] Performance considerations are addressed

---

## 🚀 **Quick Reference Commands**

### Common Patterns
```bash
# Create temp directory
mkdir -p ./temp/processing

# Clean up temp files
rm -rf ./temp/processing/*

# Check file counts
ls -la ./temp/processing/ | wc -l

# Validate configuration
node -e "console.log(require('./config/app-config'))"
```

### Git Workflow
```bash
# Before committing
git status
git add .
git commit -m "descriptive message"
git push origin main
```

---

## 📝 **Notes**

- These standards were established during the Ambetter Health Plan Search project
- They should be applied to all future coding projects
- Standards should be updated as new best practices are discovered
- All team members should follow these standards consistently
- Regular code reviews should ensure compliance

---

**Last Updated**: January 20, 2025  
**Project**: Ambetter Health Plan Search  
**Status**: Active Standards
