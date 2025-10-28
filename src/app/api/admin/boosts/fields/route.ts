import { NextResponse } from 'next/server'
import client, { INDICES } from '@/lib/elasticsearch'

type FieldInfo = { name: string; type: string }

function flattenMapping(prefix: string, node: any, out: FieldInfo[]) {
  if (!node) return
  const props = node.properties || {}
  for (const [key, val] of Object.entries<any>(props)) {
    const name = prefix ? `${prefix}.${key}` : key
    if (val.type) {
      out.push({ name, type: val.type })
    }
    // Recurse into nested properties
    if (val.properties) {
      flattenMapping(name, val, out)
    }
  }
}

export async function GET() {
  try {
    // Get mapping from the health-plans alias, which may point to multiple indices
    const mapping = await client.indices.getMapping({ index: INDICES.HEALTH_PLANS })
    
    // If it's an alias, we need to get the underlying indices
    let mappings: any = mapping
    const idxKeys = Object.keys(mapping)
    
    // If we got back the alias name, try to get the actual index mappings
    if (idxKeys.length === 1 && idxKeys[0] === INDICES.HEALTH_PLANS) {
      // Get the actual indices from the alias
      const aliasesResp = await client.indices.getAlias({ name: INDICES.HEALTH_PLANS })
      const actualIndices = Object.keys(aliasesResp)
      
      if (actualIndices.length > 0) {
        // Get mapping from the first index under the alias
        const actualMapping = await client.indices.getMapping({ index: actualIndices[0] })
        mappings = actualMapping
      }
    }
    
    const firstIndex = Object.keys(mappings)[0]
    const idx = mappings[firstIndex] as any
    const out: FieldInfo[] = []
    flattenMapping('', idx?.mappings, out)
    
    console.log(`Found ${out.length} fields from index: ${firstIndex}`)
    
    // Return all fields that have a type so UI can decide applicability
    return NextResponse.json({ fields: out })
  } catch (e: any) {
    console.error('Error fetching fields:', e.message)
    return NextResponse.json({ fields: [] })
  }
}


