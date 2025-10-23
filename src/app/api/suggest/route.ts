import { NextRequest, NextResponse } from 'next/server'
import client, { INDICES } from '@/lib/elasticsearch'

export async function GET(request: NextRequest) {
  try {
    const q = (request.nextUrl.searchParams.get('q') || '').trim()
    if (!q) return NextResponse.json({ suggestions: [] })

    const resp = await client.search({
      index: INDICES.SUGGEST,
      body: {
        size: 0,
        suggest: {
          plan_suggest: {
            prefix: q,
            completion: {
              field: 'suggest',
              fuzzy: { fuzziness: 1 },
              size: 8
            }
          }
        }
      }
    })
    const options = (resp as any).suggest?.plan_suggest?.[0]?.options || []
    const suggestions = options.map((o: any) => ({
      text: o.text,
      payload: o._source?.payload
    }))
    return NextResponse.json({ suggestions })
  } catch (e) {
    return NextResponse.json({ suggestions: [] })
  }
}


