import { Client } from '@elastic/elasticsearch'

// Read directly from environment variables for Vercel compatibility
const ELASTIC_ENDPOINT = process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud'
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY || 'Z2t5cDdwa0JWVEtzRW5CbkhjbDc6c05ReVZ4NFZIQVdyYnppNlB3V1NxUQ=='

const client = new Client({
  node: ELASTIC_ENDPOINT,
  auth: {
    apiKey: ELASTIC_API_KEY
  },
  tls: {
    rejectUnauthorized: false
  }
})

export default client

// Elasticsearch indices configuration
export const INDICES = {
  HEALTH_PLANS: 'health-plans',
  SEARCH_EVENTS: 'search-events',
  CLICK_EVENTS: 'click-events',
  ANALYTICS_METRICS: 'analytics-metrics',
  USER_SESSIONS: 'user-sessions',
  CURATIONS: 'search-curations',
  SEARCH_BOOSTS: 'search-boosts',
  SUGGEST: 'health-plans-suggest'
} as const

// Health plan document mapping
export const HEALTH_PLANS_MAPPING: any = {
  properties: {
    plan_name: { type: 'text', analyzer: 'standard' },
    plan_type: { type: 'keyword' },
    plan_id: { type: 'keyword' },
    plan_variant: { type: 'keyword' },
    state: { type: 'keyword' },
    county: { type: 'keyword' },
    county_code: { type: 'keyword' },
    tobacco_use: { type: 'boolean' },
    coverage_area: { type: 'text' },
    premium_range: { type: 'text' },
    deductible_info: { type: 'text' },
    network_providers: { type: 'text' },
    specialty_benefits: { type: 'text' },
    eligibility_requirements: { type: 'text' },
    document_url: { type: 'keyword' },
    url: { type: 'keyword' },
    extracted_text: { type: 'text', analyzer: 'standard' },
    
    // Basic text fields for lexical search
    title: { type: 'text', analyzer: 'standard' },
    body: { type: 'text', analyzer: 'standard' },
    plan_description: { type: 'text', analyzer: 'standard' },
    benefits_summary: { type: 'text', analyzer: 'standard' },
    
    // PDF content field
    pdf: {
      properties: {
        content: { type: 'text', analyzer: 'standard' },
        filename: { type: 'keyword' },
        size: { type: 'long' },
        extracted_at: { type: 'date' }
      }
    },
    
    // Enhanced plan details
    plan_details: {
      properties: {
        plan_type: { type: 'keyword' },
        county_code: { type: 'keyword' },
        variant: { type: 'keyword' },
        full_plan_name: { type: 'text', analyzer: 'standard' },
        document_type: { type: 'keyword' },
        source_url: { type: 'keyword' }
      }
    },
    
    // Semantic text fields for vector search
    semantic_text: { type: 'text', analyzer: 'standard' },
    semantic_vector: { 
      type: 'dense_vector',
      dims: 1536,
      index: true,
      similarity: 'cosine'
    },
    
    metadata: {
      properties: {
        file_name: { type: 'keyword' },
        file_size: { type: 'long' },
        created_at: { type: 'date' },
        updated_at: { type: 'date' },
        indexed_at: { type: 'date' },
        plan_info: {
          properties: {
            plan_type: { type: 'keyword' },
            county_code: { type: 'keyword' },
            variant: { type: 'keyword' },
            document_type: { type: 'keyword' }
          }
        }
      }
    }
  }
}

// Search events mapping
export const SEARCH_EVENTS_MAPPING: any = {
  properties: {
    search_query: { type: 'text', analyzer: 'standard' },
    filters: {
      properties: {
        county: { type: 'keyword' },
        tobacco_use: { type: 'boolean' },
        plan_type: { type: 'keyword' }
      }
    },
    user_session_id: { type: 'keyword' },
    timestamp: { type: 'date' },
    result_count: { type: 'integer' },
    search_duration_ms: { type: 'integer' }
  }
}

// Click events mapping
export const CLICK_EVENTS_MAPPING: any = {
  properties: {
    search_query: { type: 'text', analyzer: 'standard' },
    clicked_plan_id: { type: 'keyword' },
    plan_name: { type: 'text' },
    plan_type: { type: 'keyword' },
    result_position: { type: 'integer' },
    time_to_click: { type: 'integer' },
    user_session_id: { type: 'keyword' },
    timestamp: { type: 'date' },
    event_type: { type: 'keyword' },
    plan_metadata: {
      properties: {
        county: { type: 'keyword' },
        tobacco_use: { type: 'boolean' },
        premium_range: { type: 'text' }
      }
    },
    user_agent: { type: 'text' },
    ip_address: { type: 'ip' }
  }
}

// Initialize indices
export async function initializeIndices() {
  try {
    // Check if indices already exist
    const existingIndices = await client.cat.indices({ format: 'json' })
    const existingIndexNames = existingIndices.map((index: any) => index.index)

    // Create health plans index
    if (!existingIndexNames.includes(INDICES.HEALTH_PLANS)) {
      await client.indices.create({
        index: INDICES.HEALTH_PLANS,
        body: {
          mappings: HEALTH_PLANS_MAPPING
        }
      })
      console.log('✅ Health plans index created')
    } else {
      console.log('ℹ️ Health plans index already exists')
    }

    // Create search events index
    if (!existingIndexNames.includes(INDICES.SEARCH_EVENTS)) {
      await client.indices.create({
        index: INDICES.SEARCH_EVENTS,
        body: {
          mappings: SEARCH_EVENTS_MAPPING
        }
      })
      console.log('✅ Search events index created')
    } else {
      console.log('ℹ️ Search events index already exists')
    }

    // Create click events index
    if (!existingIndexNames.includes(INDICES.CLICK_EVENTS)) {
      await client.indices.create({
        index: INDICES.CLICK_EVENTS,
        body: {
          mappings: CLICK_EVENTS_MAPPING
        }
      })
      console.log('✅ Click events index created')
    } else {
      console.log('ℹ️ Click events index already exists')
    }

    // Create analytics metrics index
    if (!existingIndexNames.includes(INDICES.ANALYTICS_METRICS)) {
      await client.indices.create({
        index: INDICES.ANALYTICS_METRICS,
        body: {
          mappings: {
            properties: {
              metric_name: { type: 'keyword' },
              metric_value: { type: 'double' },
              timestamp: { type: 'date' },
              dimensions: { type: 'object' }
            }
          }
        }
      })
      console.log('✅ Analytics metrics index created')
    } else {
      console.log('ℹ️ Analytics metrics index already exists')
    }

    // Create user sessions index
    if (!existingIndexNames.includes(INDICES.USER_SESSIONS)) {
      await client.indices.create({
        index: INDICES.USER_SESSIONS,
        body: {
          mappings: {
            properties: {
              session_id: { type: 'keyword' },
              user_id: { type: 'keyword' },
              start_time: { type: 'date' },
              end_time: { type: 'date' },
              search_count: { type: 'integer' },
              click_count: { type: 'integer' },
              total_duration: { type: 'integer' }
            }
          }
        }
      })
      console.log('✅ User sessions index created')
    } else {
      console.log('ℹ️ User sessions index already exists')
    }

    console.log('🎉 All Elasticsearch indices ready!')
  } catch (error) {
    console.error('❌ Error initializing indices:', error)
    throw error
  }
}
