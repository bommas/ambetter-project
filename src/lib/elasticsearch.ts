import { Client } from '@elastic/elasticsearch'

const client = new Client({
  node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
  auth: {
    username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
    password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
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
    plan_embedding: { type: 'dense_vector', dims: 768 },
    metadata: {
      properties: {
        file_name: { type: 'keyword' },
        file_size: { type: 'long' },
        created_at: { type: 'date' },
        updated_at: { type: 'date' }
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
    // Create health plans index
    await client.indices.create({
      index: INDICES.HEALTH_PLANS,
      body: {
        mappings: HEALTH_PLANS_MAPPING,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      }
    })
    console.log('✅ Health plans index created')

    // Create search events index
    await client.indices.create({
      index: INDICES.SEARCH_EVENTS,
      body: {
        mappings: SEARCH_EVENTS_MAPPING,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      }
    })
    console.log('✅ Search events index created')

    // Create click events index
    await client.indices.create({
      index: INDICES.CLICK_EVENTS,
      body: {
        mappings: CLICK_EVENTS_MAPPING,
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      }
    })
    console.log('✅ Click events index created')

    // Create analytics metrics index
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
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      }
    })
    console.log('✅ Analytics metrics index created')

    // Create user sessions index
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
        },
        settings: {
          number_of_shards: 1,
          number_of_replicas: 0
        }
      }
    })
    console.log('✅ User sessions index created')

    console.log('🎉 All Elasticsearch indices initialized successfully!')
  } catch (error) {
    console.error('❌ Error initializing indices:', error)
    throw error
  }
}
