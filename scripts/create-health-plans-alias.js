#!/usr/bin/env node

/**
 * Create health-plans alias for existing indices
 * Usage: node scripts/create-health-plans-alias.js
 */

const { Client } = require('@elastic/elasticsearch')
require('dotenv').config()

const ELASTIC_ENDPOINT = process.env.ELASTIC_ENDPOINT?.trim() || 'https://centene-serverless-demo-a038f2.es.us-east-1.aws.elastic.cloud'
const ELASTIC_API_KEY = process.env.ELASTIC_API_KEY?.trim() || ''

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
    console.log('✅ Connected to Elasticsearch')

    // Get all indices matching health-plans-*
    console.log('\n🔍 Finding all health-plans-* indices...')
    const indicesResponse = await client.cat.indices({
      index: 'health-plans-*',
      format: 'json'
    })

    const healthPlansIndices = (indicesResponse as any).map((idx: any) => idx.index)
    
    if (healthPlansIndices.length === 0) {
      console.log('⚠️  No health-plans-* indices found')
      return
    }

    console.log(`\n📋 Found ${healthPlansIndices.length} indices:`)
    healthPlansIndices.forEach(idx => console.log(`   - ${idx}`))

    // Check if alias already exists
    console.log('\n🔍 Checking if health-plans alias exists...')
    const aliasExists = await client.indices.existsAlias({ name: 'health-plans' })
    
    if (aliasExists) {
      console.log('ℹ️  health-plans alias already exists')
      
      // Get current aliases
      const currentAliases = await client.indices.getAlias({ name: 'health-plans' })
      const currentIndices = Object.keys(currentAliases)
      
      console.log(`\n📋 Current indices in health-plans alias:`)
      currentIndices.forEach(idx => console.log(`   - ${idx}`))

      // Find indices that need to be added
      const indicesToAdd = healthPlansIndices.filter(idx => !currentIndices.includes(idx))
      
      if (indicesToAdd.length === 0) {
        console.log('\n✅ All indices are already in the alias')
        return
      }

      console.log(`\n➕ Adding ${indicesToAdd.length} indices to alias...`)
      indicesToAdd.forEach(idx => console.log(`   - ${idx}`))

      // Add new indices to alias
      await client.indices.updateAliases({
        body: {
          actions: indicesToAdd.map(index => ({
            add: { index, alias: 'health-plans' }
          }))
        }
      })

      console.log('✅ Added indices to health-plans alias')
    } else {
      console.log('\n➕ Creating health-plans alias with all indices...')
      
      // Create alias with all health-plans-* indices
      await client.indices.updateAliases({
        body: {
          actions: healthPlansIndices.map(index => ({
            add: { index, alias: 'health-plans' }
          }))
        }
      })

      console.log('✅ Created health-plans alias')
    }

    // Verify the alias
    console.log('\n✅ Verifying alias...')
    const verifyAliases = await client.indices.getAlias({ name: 'health-plans' })
    const verifyIndices = Object.keys(verifyAliases)
    
    console.log(`\n📊 health-plans alias now contains ${verifyIndices.length} indices:`)
    verifyIndices.forEach(idx => console.log(`   - ${idx}`))

    console.log('\n✅ Done!')
    
  } catch (error: any) {
    console.error('❌ Error:', error.message)
    if (error.meta?.body) {
      console.error('Details:', JSON.stringify(error.meta.body, null, 2))
    }
    process.exit(1)
  }
}

main()
