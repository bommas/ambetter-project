import { NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'
import { INDICES } from '@/lib/elasticsearch'

export const dynamic = 'force-dynamic'

/**
 * QA Endpoint: Data Quality Analysis
 * Tests for duplicates, null values, and field coverage
 */
export async function GET() {
  try {
    const results: any = {
      timestamp: new Date().toISOString(),
      tests: []
    }

    // Test 1: Plan ID distribution
    const planIdAgg = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 0,
        aggs: {
          plan_ids: {
            terms: {
              field: 'plan_id.keyword',
              size: 50,
              missing: '__NULL__'
            }
          },
          total_docs: {
            value_count: { field: 'plan_name.keyword' }
          }
        }
      }
    })

    const planIdBuckets = (planIdAgg.aggregations as any).plan_ids.buckets
    const totalDocs = (planIdAgg.aggregations as any).total_docs.value
    const nullPlanIds = planIdBuckets.find((b: any) => b.key === '__NULL__')

    results.tests.push({
      name: 'Plan ID Coverage',
      total_documents: totalDocs,
      unique_plan_ids: planIdBuckets.length - (nullPlanIds ? 1 : 0),
      null_plan_ids: nullPlanIds?.doc_count || 0,
      null_percentage: nullPlanIds ? ((nullPlanIds.doc_count / totalDocs) * 100).toFixed(2) + '%' : '0%',
      status: nullPlanIds?.doc_count > 0 ? 'FAIL' : 'PASS',
      top_plan_ids: planIdBuckets.slice(0, 10).map((b: any) => ({
        plan_id: b.key,
        count: b.doc_count
      }))
    })

    // Test 2: Document URL uniqueness
    const urlAgg = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 0,
        aggs: {
          unique_urls: {
            cardinality: { field: 'document_url.keyword' }
          },
          total_docs: {
            value_count: { field: 'plan_name.keyword' }
          }
        }
      }
    })

    const uniqueUrls = (urlAgg.aggregations as any).unique_urls.value
    const totalDocsUrl = (urlAgg.aggregations as any).total_docs.value
    const potentialDuplicates = totalDocsUrl - uniqueUrls

    results.tests.push({
      name: 'Document URL Uniqueness',
      total_documents: totalDocsUrl,
      unique_urls: uniqueUrls,
      potential_duplicates: potentialDuplicates,
      duplicate_percentage: ((potentialDuplicates / totalDocsUrl) * 100).toFixed(2) + '%',
      status: potentialDuplicates === 0 ? 'PASS' : 'WARNING'
    })

    // Test 3: State field coverage
    const stateAgg = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 0,
        aggs: {
          states: {
            terms: {
              field: 'state.keyword',
              size: 10,
              missing: '__NULL__'
            }
          }
        }
      }
    })

    const stateBuckets = (stateAgg.aggregations as any).states.buckets
    const nullStates = stateBuckets.find((b: any) => b.key === '__NULL__')

    results.tests.push({
      name: 'State Field Coverage',
      states: stateBuckets.map((b: any) => ({
        state: b.key,
        count: b.doc_count
      })),
      null_states: nullStates?.doc_count || 0,
      status: nullStates?.doc_count > 0 ? 'WARNING' : 'PASS'
    })

    // Test 4: Sample duplicate documents (same plan_id)
    const sampleDuplicates = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 20,
        query: {
          term: { 'plan_id.keyword': 'TX016' }
        },
        _source: ['plan_id', 'plan_name', 'plan_type', 'document_url', 'title', 'state']
      }
    })

    results.tests.push({
      name: 'Sample Duplicates for plan_id=TX016',
      count: sampleDuplicates.hits.hits.length,
      documents: sampleDuplicates.hits.hits.map((hit: any) => ({
        plan_id: hit._source.plan_id,
        plan_name: hit._source.plan_name,
        plan_type: hit._source.plan_type,
        state: hit._source.state,
        url: hit._source.document_url,
        title: hit._source.title
      }))
    })

    // Test 5: Check for documents without plan_id
    const noPlanIdDocs = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 10,
        query: {
          bool: {
            must_not: [
              { exists: { field: 'plan_id' } }
            ]
          }
        },
        _source: ['plan_name', 'plan_type', 'document_url', 'title', 'state']
      }
    })

    results.tests.push({
      name: 'Documents Without plan_id',
      count: noPlanIdDocs.hits.total,
      sample_documents: noPlanIdDocs.hits.hits.map((hit: any) => ({
        plan_name: hit._source.plan_name,
        plan_type: hit._source.plan_type,
        state: hit._source.state,
        url: hit._source.document_url,
        title: hit._source.title
      }))
    })

    // Test 6: Collapse simulation - what happens with current collapse
    const withCollapse = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 30,
        query: {
          match: { extracted_text: 'Texas health plans' }
        },
        collapse: {
          field: 'plan_id.keyword'
        }
      }
    })

    const withoutCollapse = await client.search({
      index: INDICES.HEALTH_PLANS,
      body: {
        size: 30,
        query: {
          match: { extracted_text: 'Texas health plans' }
        }
      }
    })

    results.tests.push({
      name: 'Collapse Behavior Test',
      query: 'Texas health plans',
      with_collapse: {
        results_returned: withCollapse.hits.hits.length,
        total_matches: typeof withCollapse.hits.total === 'number' ? withCollapse.hits.total : withCollapse.hits.total?.value
      },
      without_collapse: {
        results_returned: withoutCollapse.hits.hits.length,
        total_matches: typeof withoutCollapse.hits.total === 'number' ? withoutCollapse.hits.total : withoutCollapse.hits.total?.value
      },
      difference: withoutCollapse.hits.hits.length - withCollapse.hits.hits.length,
      status: withCollapse.hits.hits.length < 10 ? 'FAIL' : 'PASS'
    })

    // Summary
    results.summary = {
      total_tests: results.tests.length,
      passed: results.tests.filter((t: any) => t.status === 'PASS').length,
      warnings: results.tests.filter((t: any) => t.status === 'WARNING').length,
      failed: results.tests.filter((t: any) => t.status === 'FAIL').length,
      overall_status: results.tests.some((t: any) => t.status === 'FAIL') ? 'FAIL' :
                      results.tests.some((t: any) => t.status === 'WARNING') ? 'WARNING' : 'PASS'
    }

    return NextResponse.json(results, { status: 200 })

  } catch (error: any) {
    console.error('Data quality test error:', error)
    return NextResponse.json(
      {
        error: 'Data quality test failed',
        details: error?.message || 'Unknown error'
      },
      { status: 500 }
    )
  }
}
