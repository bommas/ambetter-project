import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'
import client from '@/lib/elasticsearch'
import { HEALTH_PLANS_MAPPING } from '@/lib/elasticsearch'

// Force dynamic route
export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const authCookie = request.cookies.get('admin_auth')
    if (!authCookie || authCookie.value !== '1') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { url, state, version } = await request.json()
    if (!url || !state || !version) {
      return NextResponse.json(
        { ok: false, error: 'url, state, and version are required' }, 
        { status: 400 }
      )
    }

    // Create dynamic index name: health-plans-{state}-{version}
    const indexName = `health-plans-${state.toLowerCase()}-${version}`
    console.log(`Creating index: ${indexName}`)

    // Check if index already exists
    const exists = await client.indices.exists({ index: indexName })
    
    if (!exists) {
      // Create the new index with the health-plans mapping
      await client.indices.create({
        index: indexName,
        body: {
          mappings: HEALTH_PLANS_MAPPING
        }
      })
      console.log(`✅ Created index: ${indexName}`)

      // Add to the health-plans alias
      await client.indices.updateAliases({
        body: {
          actions: [
            {
              add: {
                index: indexName,
                alias: 'health-plans'
              }
            }
          ]
        }
      })
      console.log(`✅ Added ${indexName} to health-plans alias`)
    } else {
      console.log(`⚠️  Index ${indexName} already exists, will update documents`)
    }

    // Run the multi-state processor in single-URL mode with dynamic index
    const cmd = `SINGLE_URL="${url}" SINGLE_STATE="${state || ''}" TARGET_INDEX="${indexName}" node scripts/multi-state-processor.js`

    await new Promise<void>((resolve, reject) => {
      const child = exec(cmd, { cwd: process.cwd() }, (err) => {
        if (err) return reject(err)
        resolve()
      })
      child.stdout?.on('data', (d) => process.stdout.write(d))
      child.stderr?.on('data', (d) => process.stderr.write(d))
    })

    return NextResponse.json({ 
      ok: true,
      message: `Successfully ingested data into index: ${indexName}`,
      index: indexName
    })
  } catch (error: any) {
    console.error('Ingest error:', error)
    return NextResponse.json(
      { ok: false, error: error.message || 'Failed to start ingest' }, 
      { status: 500 }
    )
  }
}


