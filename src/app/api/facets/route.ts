import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'
import { INDICES } from '@/lib/elasticsearch'

/**
 * API endpoint to get facets (aggregations) for filtering
 * Returns unique values and counts for filterable fields
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('query') || '*'

    // Build aggregations for facets
    const response = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 0, // We only want aggregations, not documents
        query: query === '*' ? { match_all: {} } : {
          multi_match: {
            query,
            fields: ['state', 'county', 'plan_name', 'extracted_text']
          }
        },
        aggs: {
          states: {
            terms: {
              field: 'state.keyword',
              size: 50,
              order: { _key: 'asc' }
            }
          },
          counties: {
            terms: {
              field: 'county_code.keyword',
              size: 100,
              order: { _key: 'asc' }
            }
          },
          document_types: {
            terms: {
              field: 'metadata.plan_info.document_type.keyword',
              size: 50,
              order: { _count: 'desc' }
            }
          },
          plan_names: {
            terms: {
              field: 'plan_name.keyword',
              size: 100,
              order: { _count: 'desc' }
            }
          },
          plan_ids: {
            terms: {
              field: 'plan_id.keyword',
              size: 50,
              order: { _key: 'asc' }
            }
          },
          plan_types: {
            terms: {
              field: 'plan_type.keyword',
              size: 50,
              order: { _count: 'desc' }
            }
          }
        }
      }
    })

    // Format the aggregation results
    const aggregations = response.aggregations as any
    
    // Helper function to format document type labels
    const formatDocumentType = (type: string): string => {
      const labels: { [key: string]: string } = {
        'summary_of_benefits': 'Summary of Benefits',
        'evidence_of_coverage': 'Evidence of Coverage',
        'out_of_coverage': 'Out of Coverage',
        'brochure': 'Brochure',
        'sbc': 'Summary of Benefits & Coverage (SBC)',
        'policy': 'Policy Document',
        'disclosure': 'Disclosure'
      }
      return labels[type] || type
    }

    // Helper function to categorize and format plan names
    const categorizePlan = (planName: string) => {
      const name = planName.toLowerCase()
      
      // Determine tier
      let tier = 'Other'
      if (name.includes('bronze')) tier = 'Bronze'
      else if (name.includes('silver')) tier = 'Silver'
      else if (name.includes('gold')) tier = 'Gold'
      else if (name.includes('platinum')) tier = 'Platinum'
      
      // Determine plan type
      let type = ''
      if (name.includes('focused')) type = 'Focused'
      else if (name.includes('complete')) type = 'Complete'
      else if (name.includes('everyday')) type = 'Everyday'
      else if (name.includes('standard')) type = 'Standard'
      else if (name.includes('elite')) type = 'Elite'
      else if (name.includes('enhanced')) type = 'Enhanced'
      else if (name.includes('value')) type = 'Value'
      
      // Shorten long plan names
      let shortName = planName
      if (planName.startsWith('Summary of Benefits for ')) {
        shortName = planName.replace('Summary of Benefits for ', '')
      }
      if (shortName.includes(' Standard Cost Share')) {
        shortName = shortName.replace(' Standard Cost Share', '')
      }
      if (shortName.includes(' Limited Cost Share')) {
        shortName = shortName.replace(' Limited Cost Share', ' (Limited)')
      }
      if (shortName.includes(' Zero Cost Share')) {
        shortName = shortName.replace(' Zero Cost Share', ' (Zero)')
      }
      
      return { tier, type, shortName }
    }
    
    // Process and group plan names by tier
    const planNameBuckets = aggregations.plan_names?.buckets || []
    const plansByTier: { [key: string]: any[] } = {}
    
    planNameBuckets.forEach((bucket: any) => {
      const { tier, shortName } = categorizePlan(bucket.key)
      if (!plansByTier[tier]) {
        plansByTier[tier] = []
      }
      plansByTier[tier].push({
        value: bucket.key,
        label: shortName,
        count: bucket.doc_count,
        tier
      })
    })
    
    // Sort tiers: Bronze, Silver, Gold, Platinum, Other
    const tierOrder = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Other']
    const sortedPlans: any[] = []
    
    tierOrder.forEach(tier => {
      if (plansByTier[tier]) {
        // Sort plans within tier by count (descending)
        plansByTier[tier].sort((a, b) => b.count - a.count)
        sortedPlans.push(...plansByTier[tier])
      }
    })
    
    const facets = {
      states: aggregations.states?.buckets.map((bucket: any) => ({
        value: bucket.key,
        label: bucket.key,
        count: bucket.doc_count
      })) || [],
      counties: aggregations.counties?.buckets.map((bucket: any) => ({
        value: bucket.key,
        label: bucket.key,
        count: bucket.doc_count
      })) || [],
      documentTypes: aggregations.document_types?.buckets.map((bucket: any) => ({
        value: bucket.key,
        label: formatDocumentType(bucket.key),
        count: bucket.doc_count
      })) || [],
      plans: sortedPlans.slice(0, 30), // Top 30 plans, grouped by tier
      planIds: aggregations.plan_ids?.buckets.map((bucket: any) => ({
        value: bucket.key,
        label: `Plan ${bucket.key}`,
        count: bucket.doc_count
      })) || [],
      planTypes: aggregations.plan_types?.buckets.map((bucket: any) => ({
        value: bucket.key,
        label: formatDocumentType(bucket.key),
        count: bucket.doc_count
      })) || []
    }

    return NextResponse.json(facets)

  } catch (error) {
    console.error('Facets API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch facets' },
      { status: 500 }
    )
  }
}

