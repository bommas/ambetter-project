import { Client } from '@elastic/elasticsearch'

const client = new Client({
  cloud: {
    id: process.env.ELASTIC_CLOUD_ID!,
  },
  auth: {
    apiKey: process.env.ELASTIC_API_KEY!,
  }
})

export default client

// Elasticsearch indices configuration
export const INDICES = {
  HEALTH_PLANS: 'health-plans',
  SEARCH_EVENTS: 'search-events',
  CLICK_EVENTS: 'click-events',
  ANALYTICS_METRICS: 'analytics-metrics',
  USER_SESSIONS: 'user-sessions'
} as const

// Health plan document mapping
export const HEALTH_PLANS_MAPPING = {
  properties: {
    plan_name: { type: 'text', analyzer: 'standard' },
    plan_type: { type: 'keyword' },
    state: { type: 'keyword' },
    county: { type: 'keyword' },
    tobacco_use: { type: 'boolean' },
    coverage_area: { type: 'text' },
    premium_range: { type: 'text' },
    deductible_info: { type: 'text' },
    network_providers: { type: 'text' },
    specialty_benefits: { type: 'text' },
    eligibility_requirements: { type: 'text' },
    document_url: { type: 'keyword' },
    extracted_text: { type: 'text', analyzer: 'standard' },
    
    // Semantic text fields for better search
    title: { 
      type: 'text', 
      analyzer: 'standard',
      fields: {
        semantic: { type: 'text', analyzer: 'standard' },
        semantic_vector: { type: 'dense_vector', dims: 768 }
      }
    },
    body: { 
      type: 'text', 
      analyzer: 'standard',
      fields: {
        semantic: { type: 'text', analyzer: 'standard' },
        semantic_vector: { type: 'dense_vector', dims: 768 }
      }
    },
    
    // Plan-specific semantic content
    plan_description: { 
      type: 'text', 
      analyzer: 'standard',
      fields: {
        semantic: { type: 'text', analyzer: 'standard' },
        semantic_vector: { type: 'dense_vector', dims: 768 }
      }
    },
    benefits_summary: { 
      type: 'text', 
      analyzer: 'standard',
      fields: {
        semantic: { type: 'text', analyzer: 'standard' },
        semantic_vector: { type: 'dense_vector', dims: 768 }
      }
    },
    
    // Legacy embedding field (keeping for compatibility)
    plan_embedding: { type: 'dense_vector', dims: 768 },
    
    metadata: {
      properties: {
        file_name: { type: 'keyword' },
        file_size: { type: 'long' },
        created_at: { type: 'date' },
        updated_at: { type: 'date' },
        semantic_processed: { type: 'boolean', default: false }
      }
    }
  }
}

// Search events mapping
export const SEARCH_EVENTS_MAPPING = {
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
export const CLICK_EVENTS_MAPPING = {
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
