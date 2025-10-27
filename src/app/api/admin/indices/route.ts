import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

// Force dynamic route
export const dynamic = 'force-dynamic'

/**
 * GET /api/admin/indices
 * List all health-plans-* indices with metadata
 */
export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get all indices matching pattern
    const indicesResponse = await client.cat.indices({
      index: 'health-plans-*',
      format: 'json',
      h: 'index,docs.count,store.size,creation.date,health'
    })

    // Get alias information
    const aliasResponse = await client.indices.getAlias({
      name: 'health-plans'
    }).catch(() => ({ body: {} }))

    const aliasIndices = new Set(Object.keys(aliasResponse || {}))

    // Format the response
    const indices = (indicesResponse as any[]).map((index: any) => ({
      name: index.index,
      docCount: parseInt(index['docs.count'] || '0'),
      size: index['store.size'] || '0b',
      createdDate: new Date(parseInt(index['creation.date'])).toISOString(),
      health: index.health || 'unknown',
      inAlias: aliasIndices.has(index.index)
    }))

    // Sort by creation date (newest first)
    indices.sort((a, b) => 
      new Date(b.createdDate).getTime() - new Date(a.createdDate).getTime()
    )

    return NextResponse.json({ 
      indices,
      alias: 'health-plans',
      totalIndices: indices.length
    })

  } catch (error: any) {
    console.error('Error listing indices:', error)
    return NextResponse.json(
      { 
        error: 'Failed to list indices',
        details: error.message
      },
      { status: 500 }
    )
  }
}

