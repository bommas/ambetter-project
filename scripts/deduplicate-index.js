#!/usr/bin/env node

/**
 * Deduplicate Elasticsearch Index
 * 
 * Removes duplicate documents based on URL, keeping only the most recent one.
 */

const { Client } = require('@elastic/elasticsearch');
const config = require('../config/app-config');

const client = new Client({
  node: config.elasticsearch.endpoint,
  auth: {
    apiKey: config.elasticsearch.apiKey
  },
  tls: {
    rejectUnauthorized: false
  }
});

const INDEX_NAME = 'health-plans';

async function findDuplicates() {
  console.log('🔍 Finding duplicate documents...\n');
  
  const response = await client.search({
    index: INDEX_NAME,
    size: 0,
    body: {
      aggs: {
        duplicate_urls: {
          terms: {
            field: 'url.keyword',
            min_doc_count: 2,
            size: 10000
          }
        }
      }
    }
  });
  
  const duplicateUrls = response.aggregations.duplicate_urls.buckets;
  console.log(`Found ${duplicateUrls.length} URLs with duplicates`);
  console.log(`Total duplicate documents: ${duplicateUrls.reduce((sum, b) => sum + b.doc_count, 0)}`);
  console.log(`Documents to remove: ${duplicateUrls.reduce((sum, b) => sum + (b.doc_count - 1), 0)}\n`);
  
  return duplicateUrls;
}

async function removeDuplicates(duplicateUrls) {
  console.log('🗑️  Removing duplicates...\n');
  
  let totalRemoved = 0;
  
  for (const urlBucket of duplicateUrls) {
    const url = urlBucket.key;
    const count = urlBucket.doc_count;
    
    // Get all documents with this URL
    const docs = await client.search({
      index: INDEX_NAME,
      size: count,
      body: {
        query: {
          term: {
            'url.keyword': url
          }
        },
        sort: [
          { 'metadata.indexed_at': { order: 'desc', unmapped_type: 'date' } }
        ]
      }
    });
    
    const hits = docs.hits.hits;
    
    if (hits.length <= 1) {
      continue; // No duplicates for this URL
    }
    
    // Keep the first (most recent), delete the rest
    const toKeep = hits[0];
    const toDelete = hits.slice(1);
    
    console.log(`URL: ${url}`);
    console.log(`  Found ${hits.length} documents, keeping most recent (ID: ${toKeep._id})`);
    console.log(`  Removing ${toDelete.length} duplicate(s)...`);
    
    // Delete duplicates
    for (const doc of toDelete) {
      try {
        await client.delete({
          index: INDEX_NAME,
          id: doc._id
        });
        totalRemoved++;
      } catch (error) {
        console.error(`  ❌ Error deleting ${doc._id}: ${error.message}`);
      }
    }
  }
  
  console.log(`\n✅ Removed ${totalRemoved} duplicate documents`);
  return totalRemoved;
}

async function getStats() {
  const countResponse = await client.count({ index: INDEX_NAME });
  const total = countResponse.count;
  
  // Get state distribution
  const stateResponse = await client.search({
    index: INDEX_NAME,
    size: 0,
    body: {
      aggs: {
        by_state: {
          terms: {
            field: 'state.keyword',
            size: 50
          }
        }
      }
    }
  });
  
  const states = stateResponse.aggregations.by_state.buckets;
  
  return { total, states };
}

async function main() {
  console.log('='.repeat(60));
  console.log('📋 Elasticsearch Index Deduplication');
  console.log('='.repeat(60));
  console.log(`Index: ${INDEX_NAME}`);
  console.log(`Endpoint: ${config.elasticsearch.endpoint}\n`);
  
  try {
    // Get initial stats
    const beforeStats = await getStats();
    console.log('📊 Before Deduplication:');
    console.log(`   Total Documents: ${beforeStats.total}`);
    beforeStats.states.forEach(state => {
      console.log(`   - ${state.key}: ${state.doc_count} documents`);
    });
    console.log();
    
    // Find duplicates
    const duplicateUrls = await findDuplicates();
    
    if (duplicateUrls.length === 0) {
      console.log('✅ No duplicates found!');
      process.exit(0);
    }
    
    // Remove duplicates
    const removed = await removeDuplicates(duplicateUrls);
    
    // Get final stats
    console.log('\n⏳ Refreshing index...');
    await client.indices.refresh({ index: INDEX_NAME });
    
    const afterStats = await getStats();
    console.log('\n📊 After Deduplication:');
    console.log(`   Total Documents: ${afterStats.total}`);
    afterStats.states.forEach(state => {
      console.log(`   - ${state.key}: ${state.doc_count} documents`);
    });
    console.log();
    
    console.log('='.repeat(60));
    console.log('✅ Deduplication Complete!');
    console.log(`   Documents Before: ${beforeStats.total}`);
    console.log(`   Documents After: ${afterStats.total}`);
    console.log(`   Duplicates Removed: ${removed}`);
    console.log('='.repeat(60));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();

