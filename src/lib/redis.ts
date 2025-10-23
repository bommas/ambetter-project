import { Redis } from '@upstash/redis'

// Initialize Upstash Redis client for LLM response caching
// If credentials are not set, return null (cache will be disabled)
let redis: Redis | null = null

try {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN

  if (upstashUrl && upstashToken) {
    redis = new Redis({
      url: upstashUrl,
      token: upstashToken,
    })
    console.log('✅ Upstash Redis cache enabled')
  } else {
    console.log('⚠️  Upstash Redis credentials not found - cache disabled')
  }
} catch (error) {
  console.error('❌ Failed to initialize Redis cache:', error)
  redis = null
}

export default redis

/**
 * Cache key generator for AI summaries
 */
export function getCacheKey(query: string, resultsHash: string): string {
  return `ai-summary:${query.toLowerCase().trim()}:${resultsHash}`
}

/**
 * Get cached AI summary
 */
export async function getCachedSummary(query: string, resultsHash: string): Promise<string | null> {
  if (!redis) return null
  
  try {
    const key = getCacheKey(query, resultsHash)
    const cached = await redis.get<string>(key)
    if (cached) {
      console.log(`🎯 Cache HIT for query: "${query}"`)
    }
    return cached
  } catch (error) {
    console.error('Redis get error:', error)
    return null
  }
}

/**
 * Cache AI summary with 24 hour TTL
 */
export async function cacheSummary(query: string, resultsHash: string, summary: string): Promise<void> {
  if (!redis) return
  
  try {
    const key = getCacheKey(query, resultsHash)
    await redis.setex(key, 86400, summary) // 24 hours
    console.log(`💾 Cached summary for query: "${query}"`)
  } catch (error) {
    console.error('Redis set error:', error)
  }
}

/**
 * Generate a simple hash for search results to use in cache key
 */
export function hashResults(results: any[]): string {
  const ids = results.slice(0, 3).map(r => r.id || r.url).join('|')
  return Buffer.from(ids).toString('base64').substring(0, 16)
}

