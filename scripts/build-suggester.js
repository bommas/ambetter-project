#!/usr/bin/env node
const { Client } = require('@elastic/elasticsearch')

const endpoint = process.env.ELASTIC_ENDPOINT
const apiKey = process.env.ELASTIC_API_KEY
if (!endpoint || !apiKey) {
  console.error('Missing ELASTIC_ENDPOINT or ELASTIC_API_KEY')
  process.exit(1)
}

const client = new Client({ node: endpoint, auth: { apiKey }, tls: { rejectUnauthorized: false } })
const SRC_INDEX = 'health-plans'
const DEST_INDEX = 'health-plans-suggest'

async function run() {
  // Create suggester index
  try {
    await client.indices.delete({ index: DEST_INDEX })
  } catch {}
  await client.indices.create({
    index: DEST_INDEX,
    body: {
      mappings: {
        properties: {
          suggest: { type: 'completion' },
          payload: { properties: { url: { type: 'keyword' }, state: { type: 'keyword' }, plan_type: { type: 'keyword' } } }
        }
      }
    }
  })

  // Scroll source docs and index suggest entries
  let count = 0
  const search = await client.search({ index: SRC_INDEX, scroll: '2m', size: 500, body: { _source: ['plan_name','title','plan_type','state','url','document_url'] } })
  let sid = search._scroll_id
  async function handleHits(hits) {
    if (!hits.length) return
    const body = []
    for (const h of hits) {
      const s = h._source || {}
      const texts = new Set()
      if (s.plan_name) texts.add(String(s.plan_name))
      if (s.title) texts.add(String(s.title))
      if (s.plan_type) texts.add(String(s.plan_type))
      for (const t of texts) {
        body.push({ index: { _index: DEST_INDEX } })
        body.push({ suggest: t, payload: { url: s.document_url || s.url || '', state: s.state || '', plan_type: s.plan_type || '' } })
        count++
      }
    }
    if (body.length) await client.bulk({ refresh: true, body })
  }
  await handleHits(search.hits.hits)
  while (true) {
    const next = await client.scroll({ scroll_id: sid, scroll: '2m' })
    sid = next._scroll_id
    const hits = next.hits.hits
    if (!hits.length) break
    await handleHits(hits)
  }
  console.log(`Indexed ${count} suggest entries`)
}

run().catch(e => { console.error(e); process.exit(1) })


