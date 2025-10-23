// Centralized configuration for Ambetter Health Plan Search Application
// This file contains all URLs, API keys, and configuration values

module.exports = {
  // Elasticsearch Configuration
  elasticsearch: {
    endpoint: process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud',
    apiKey: process.env.ELASTIC_API_KEY || 'Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ==',
    username: process.env.ELASTIC_USERNAME || null,
    password: process.env.ELASTIC_PASSWORD || null,
    indices: {
      healthPlans: 'health-plans',
      searchEvents: 'search-events',
      clickEvents: 'click-events',
      analyticsMetrics: 'analytics-metrics',
      userSessions: 'user-sessions'
    }
  },

  // Ambetter Website URLs
  ambetter: {
    baseUrl: 'https://www.ambetterhealth.com',
    
    // State-specific URLs
    states: {
      texas: {
        brochuresUrl: 'https://www.ambetterhealth.com/en/tx/2025-brochures-epo/',
        healthPlansUrl: 'https://www.ambetterhealth.com/en/tx/health-plans/',
        state: 'TX',
        extractPDFs: true, // Extract PDFs from brochures page
        crawlContent: true // Also crawl general health plans info
      },
      florida: {
        brochuresUrl: 'https://www.ambetterhealth.com/en/fl/2025-brochures-epo/',
        brochuresUrlHMO: 'https://www.ambetterhealth.com/en/fl/2025-brochures-hmo/',
        healthPlansUrl: 'https://www.ambetterhealth.com/en/fl/health-plans/',
        state: 'FL',
        extractPDFs: true, // Extract PDFs from brochures pages
        crawlContent: true // Also crawl general health plans info
      }
    },
    
    // Legacy URL (kept for backwards compatibility)
    brochuresUrl: 'https://www.ambetterhealth.com/en/tx/2025-brochures-epo/',
    apiBaseUrl: 'https://api.centene.com'
  },

  // PDF Processing Configuration
  pdfProcessing: {
    tempDir: './temp/pdf-processing', // Will be created in project root
    maxRetries: 2,
    retryDelay: 3000, // 3 seconds
    requestTimeout: 30000, // 30 seconds
    batchSize: 10 // Process PDFs in batches
  },

  // Puppeteer Configuration
  puppeteer: {
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-accelerated-2d-canvas',
      '--no-first-run',
      '--no-zygote',
      '--disable-gpu'
    ],
    userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  },

  // RabbitMQ Configuration
  rabbitmq: {
    host: process.env.RABBITMQ_HOST || 'localhost',
    port: process.env.RABBITMQ_PORT || 5672,
    username: process.env.RABBITMQ_USERNAME || 'guest',
    password: process.env.RABBITMQ_PASSWORD || 'guest',
    vhost: process.env.RABBITMQ_VHOST || '/'
  },

  // API Keys for External Services
  apiKeys: {
    openai: process.env.OPENAI_API_KEY || null,
    anthropic: process.env.ANTHROPIC_API_KEY || null
  },

  // Application Settings
  app: {
    name: 'Ambetter Health Plan Search',
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    port: process.env.PORT || 3000
  },

  // Logging Configuration
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined'
  }
};
