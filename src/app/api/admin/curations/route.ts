import { NextRequest, NextResponse } from 'next/server'
import client, { INDICES } from '@/lib/elasticsearch'

// Schema
// {
//   query: string (lowercased exact match)
//   pins: string[] (array of document_url or url to pin in order)
//   updated_at: date
// }

export async function GET() {
  try {
    const resp = await client.search({
      index: INDICES.CURATIONS,
      body: { size: 1000, query: { match_all: {} }, sort: [{ 'updated_at': { order: 'desc' } }] }
    })
    const items = resp.hits.hits.map((h: any) => ({ id: h._id, ...(h._source || {}) }))
    return NextResponse.json({ items })
  } catch (e) {
    return NextResponse.json({ items: [] })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query, pins } = await request.json()
    if (!query || !Array.isArray(pins)) {
      return NextResponse.json({ ok: false, error: 'query and pins[] required' }, { status: 400 })
    }
    const id = Buffer.from(query.toLowerCase()).toString('base64')
    await client.index({
      index: INDICES.CURATIONS,
      id,
      refresh: 'wait_for',
      body: { query: query.toLowerCase(), pins, updated_at: new Date().toISOString() }
    })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed to save' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('query') || ''
    if (!query) return NextResponse.json({ ok: false, error: 'query required' }, { status: 400 })
    const id = Buffer.from(query.toLowerCase()).toString('base64')
    await client.delete({ index: INDICES.CURATIONS, id, refresh: 'wait_for' })
    return NextResponse.json({ ok: true })
  } catch (e) {
    return NextResponse.json({ ok: false, error: 'failed to delete' }, { status: 500 })
  }
}


