#!/usr/bin/env tsx

import { Client } from '@elastic/elasticsearch'
import { PDFCrawler } from '@/crawler/pdf-crawler'
import { initializeIndices } from '@/lib/elasticsearch'

async function main() {
  console.log('🚀 Starting Ambetter Health Plan Crawler...')
  
  try {
    // Initialize Elasticsearch client
    const client = new Client({
      node: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
      auth: {
        username: process.env.ELASTICSEARCH_USERNAME || 'elastic',
        password: process.env.ELASTICSEARCH_PASSWORD || 'changeme'
      }
    })

    // Test connection
    const health = await client.cluster.health()
    console.log('✅ Elasticsearch connection successful:', health.status)

    // Initialize indices
    await initializeIndices()

    // Create crawler
    const crawler = new PDFCrawler(client)

    // Crawl and extract documents
    const documents = await crawler.crawlAmbetterWebsite()

    if (documents.length === 0) {
      console.log('⚠️ No documents found to index')
      return
    }

    // Index documents
    await crawler.indexDocuments(documents)

    console.log('🎉 Crawl and indexing completed successfully!')
    console.log(`📊 Indexed ${documents.length} health plan documents`)

    // Display summary
    const planTypes = [...new Set(documents.map(doc => doc.plan_type))]
    const counties = [...new Set(documents.map(doc => doc.county).filter(Boolean))]
    
    console.log('\n📋 Summary:')
    console.log(`- Plan Types: ${planTypes.join(', ')}`)
    console.log(`- Counties: ${counties.join(', ')}`)
    console.log(`- Total Documents: ${documents.length}`)

  } catch (error) {
    console.error('❌ Error during crawl and indexing:', error)
    process.exit(1)
  }
}

// Run if called directly
if (require.main === module) {
  main()
}

export { main }
