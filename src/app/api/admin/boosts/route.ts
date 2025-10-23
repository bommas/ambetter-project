import { NextRequest, NextResponse } from 'next/server'
import client, { INDICES } from '@/lib/elasticsearch'

// Schema
// {
//   weights: { field: number },
//   numeric_boosts: [{ field: string, type: 'log'|'sigmoid', factor?: number }],
//   updated_at: date
// }

export async function GET() {
  try {
    const resp = await client.search({ index: INDICES.SEARCH_BOOSTS, body: { size: 1, sort: [{ 'updated_at': { order: 'desc' } }] } })
    const doc = resp.hits.hits[0]?.['_source'] || { weights: {}, numeric_boosts: [] }
    return NextResponse.json(doc)
  } catch (e) {
    return NextResponse.json({ weights: {}, numeric_boosts: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { weights = {}, numeric_boosts = [] } = await request.json()
    await client.index({
      index: INDICES.SEARCH_BOOSTS,
      refresh: 'wait_for',
      body: { weights, numeric_boosts, updated_at: new Date().toISOString() }
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed to save' }, { status: 500 })
  }
}


