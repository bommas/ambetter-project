#!/usr/bin/env node

/**
 * Reindex health-plans index into health-plans-tx-2025-11 and create alias
 * Usage: node scripts/reindex-health-plans.js
 */

const { Client } = require('@elastic/elasticsearch')

// Load environment variables from .env
try {
  require('fs').readFileSync('.env', 'utf8').split('\n').forEach(line => {
    if (line.includes('=')) {
      const [key, ...values] = line.split('=')
      if (key && values.length) {
        process.env[key.trim()] = values.join('=').trim()
      }
    }
  })
} catch (e) {
  console.log('⚠️  Could not load .env file')
}

const ELASTIC_ENDPOINT = (process.env.ELASTIC_ENDPOINT || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud').trim()
const ELASTIC_API_KEY = (process.env.ELASTIC_API_KEY || '').trim()

if (!ELASTIC_API_KEY) {
  console.error('❌ Error: ELASTIC_API_KEY environment variable is required')
  process.exit(1)
}

const client = new Client({
  node: ELASTIC_ENDPOINT,
  auth: {
    apiKey: ELASTIC_API_KEY
  },
  tls: {
    rejectUnauthorized: false
  }
})

async function main() {
  try {
    console.log('🔍 Connecting to Elasticsearch...')
    await client.ping()
    console.log('✅ Connected to Elasticsearch\n')

    const sourceIndex = 'health-plans'
    const targetIndex = 'health-plans-tx-2025-11'

    // Check if source index exists
    const sourceExists = await client.indices.exists({ index: sourceIndex })
    if (!sourceExists) {
      console.error(`❌ Error: Source index '${sourceIndex}' does not exist`)
      process.exit(1)
    }

    console.log(`📋 Source index: ${sourceIndex}`)
    console.log(`📋 Target index: ${targetIndex}\n`)

    // Get document count from source
    const countResponse = await client.count({ index: sourceIndex })
    const totalDocs = countResponse.count
    console.log(`📊 Found ${totalDocs.toLocaleString()} documents in ${sourceIndex}`)

    if (totalDocs === 0) {
      console.log('⚠️  Source index is empty, nothing to reindex')
      return
    }

    // Check if target index exists
    const targetExists = await client.indices.exists({ index: targetIndex })
    if (targetExists) {
      console.log(`⚠️  Target index '${targetIndex}' already exists`)
      console.log('🔄 Will update existing index\n')
    } else {
      // Create target index with same mapping as source
      console.log(`📝 Getting mapping from ${sourceIndex}...`)
      const mappingResponse = await client.indices.getMapping({ index: sourceIndex })
      const mapping = mappingResponse[sourceIndex].mappings

      console.log(`✅ Creating target index ${targetIndex}...`)
      await client.indices.create({
        index: targetIndex,
        body: {
          mappings: mapping
        }
      })
      console.log(`✅ Created index: ${targetIndex}\n`)
    }

    // Reindex documents (async, don't wait for completion)
    console.log('🔄 Starting reindexing (this may take a while)...')
    
    const reindexResponse = await client.reindex({
      wait_for_completion: false,
      refresh: true,
      request_timeout: 60000,
      body: {
        source: {
          index: sourceIndex
        },
        dest: {
          index: targetIndex
        }
      }
    })

    const taskId = reindexResponse.task
    console.log(`   Task ID: ${taskId}`)
    console.log('   Polling for completion...\n')

    // Poll task status
    let completed = false
    let attempts = 0
    const maxAttempts = 120 // 5 minutes max

    while (!completed && attempts < maxAttempts) {
      await new Promise(resolve => setTimeout(resolve, 2500)) // Wait 2.5 seconds

      try {
        const taskStatus = await client.tasks.get({ task_id: taskId })
        
        if (taskStatus.completed) {
          completed = true
          const docsCreated = taskStatus.response.created || 0
          const docsUpdated = taskStatus.response.updated || 0
          const docsDeleted = taskStatus.response.deleted || 0
          const versionsConflict = taskStatus.response.version_conflicts || 0

          console.log('📊 Reindex Results:')
          console.log(`   ✅ Created: ${docsCreated.toLocaleString()}`)
          console.log(`   🔄 Updated: ${docsUpdated.toLocaleString()}`)
          console.log(`   🗑️  Deleted: ${docsDeleted.toLocaleString()}`)
          if (versionsConflict > 0) {
            console.log(`   ⚠️  Version conflicts: ${versionsConflict.toLocaleString()}`)
          }
        } else {
          const progress = Math.round((taskStatus.task.status.created || 0) / totalDocs * 100)
          console.log(`   Progress: ${taskStatus.task.status.created || 0}/${totalDocs} (${progress}%)`)
        }
      } catch (taskError) {
        console.log('   Still processing...')
      }
      
      attempts++
    }

    if (!completed) {
      console.log('⚠️  Reindexing is taking longer than expected')
      console.log('   Continuing with verification...\n')
    }

    // Verify document count
    const verifyCount = await client.count({ index: targetIndex })
    console.log(`\n✅ Verification: ${targetIndex} now contains ${verifyCount.count.toLocaleString()} documents`)

    // Create or update alias
    console.log('\n🔗 Creating/updating health-plans alias...')
    
    try {
      // Remove old alias mapping if it points to source index
      const existingAlias = await client.indices.getAlias({ name: 'health-plans' }).catch(() => null)
      
      if (existingAlias && existingAlias[sourceIndex]) {
        console.log(`   Removing alias from ${sourceIndex}...`)
        await client.indices.updateAliases({
          body: {
            actions: [
              {
                remove: {
                  index: sourceIndex,
                  alias: 'health-plans'
                }
              }
            ]
          }
        })
      }

      // Add alias to target index
      console.log(`   Adding alias to ${targetIndex}...`)
      await client.indices.updateAliases({
        body: {
          actions: [
            {
              add: {
                index: targetIndex,
                alias: 'health-plans'
              }
            }
          ]
        }
      })
      console.log('✅ Successfully created health-plans alias')
    } catch (aliasError) {
      console.error(`⚠️  Could not create alias: ${aliasError.message}`)
      console.log('\n💡 You may need to manually create the alias using the Admin UI or API')
    }

    console.log('\n✅ Reindexing complete!')
    console.log(`\n📝 Summary:`)
    console.log(`   - Source: ${sourceIndex}`)
    console.log(`   - Target: ${targetIndex}`)
    console.log(`   - Documents: ${verifyCount.count.toLocaleString()}`)
    console.log(`   - Alias: health-plans → ${targetIndex}`)

  } catch (error) {
    console.error('\n❌ Error:', error.message)
    if (error.meta && error.meta.body) {
      console.error('Details:', JSON.stringify(error.meta.body, null, 2))
    }
    process.exit(1)
  }
}

main()
