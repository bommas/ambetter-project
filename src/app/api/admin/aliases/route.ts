import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

// Force dynamic route
export const dynamic = 'force-dynamic'

/**
 * POST /api/admin/aliases
 * Add or remove an index from an alias
 */
export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const body = await request.json()
    const { action, index, alias } = body

    if (!action || !index || !alias) {
      return NextResponse.json(
        { error: 'Missing required fields: action, index, alias' },
        { status: 400 }
      )
    }

    if (action !== 'add' && action !== 'remove') {
      return NextResponse.json(
        { error: 'Action must be either "add" or "remove"' },
        { status: 400 }
      )
    }

    // Validate index name pattern
    if (!index.startsWith('health-plans-')) {
      return NextResponse.json(
        { error: 'Can only manage indices matching pattern health-plans-*' },
        { status: 400 }
      )
    }

    // Check if index exists
    const exists = await client.indices.exists({ index })
    if (!exists) {
      return NextResponse.json(
        { error: `Index ${index} does not exist` },
        { status: 404 }
      )
    }

    // Update the alias
    await client.indices.updateAliases({
      body: {
        actions: [
          {
            [action]: {
              index,
              alias
            }
          }
        ]
      }
    })

    console.log(`✅ ${action === 'add' ? 'Added' : 'Removed'} index ${index} ${action === 'add' ? 'to' : 'from'} alias ${alias}`)

    return NextResponse.json({ 
      success: true,
      message: `Successfully ${action === 'add' ? 'added' : 'removed'} ${index} ${action === 'add' ? 'to' : 'from'} alias ${alias}`
    })

  } catch (error: any) {
    console.error('Error updating alias:', error)
    return NextResponse.json(
      { 
        error: 'Failed to update alias',
        details: error.message
      },
      { status: 500 }
    )
  }
}

