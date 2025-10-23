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
    const mapping = await client.indices.getMapping({ index: INDICES.HEALTH_PLANS })
    const idx = mapping[INDICES.HEALTH_PLANS] as any
    const out: FieldInfo[] = []
    flattenMapping('', idx?.mappings, out)
    // Return all fields that have a type so UI can decide applicability
    return NextResponse.json({ fields: out })
  } catch (e) {
    return NextResponse.json({ fields: [] })
  }
}


