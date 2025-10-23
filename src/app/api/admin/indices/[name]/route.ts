import { NextRequest, NextResponse } from 'next/server'
import client from '@/lib/elasticsearch'

// Force dynamic route
export const dynamic = 'force-dynamic'

/**
 * DELETE /api/admin/indices/:name
 * Delete a specific index
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { name: string } }
) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== 'authenticated') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const indexName = params.name

    // Validate index name pattern
    if (!indexName.startsWith('health-plans-')) {
      return NextResponse.json(
        { error: 'Can only delete indices matching pattern health-plans-*' },
        { status: 400 }
      )
    }

    // Check if index exists
    const exists = await client.indices.exists({ index: indexName })
    if (!exists) {
      return NextResponse.json(
        { error: `Index ${indexName} does not exist` },
        { status: 404 }
      )
    }

    // First, remove from alias if it's in there
    try {
      await client.indices.updateAliases({
        body: {
          actions: [
            {
              remove: {
                index: indexName,
                alias: 'health-plans'
              }
            }
          ]
        }
      })
    } catch (err) {
      // Ignore errors if index is not in alias
      console.log('Index not in alias or error removing:', err)
    }

    // Delete the index
    await client.indices.delete({ index: indexName })

    console.log(`✅ Deleted index: ${indexName}`)

    return NextResponse.json({ 
      success: true,
      message: `Index ${indexName} deleted successfully`
    })

  } catch (error: any) {
    console.error('Error deleting index:', error)
    return NextResponse.json(
      { 
        error: 'Failed to delete index',
        details: error.message
      },
      { status: 500 }
    )
  }
}

