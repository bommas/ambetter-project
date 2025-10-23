import { NextRequest, NextResponse } from 'next/server'
import { exec } from 'child_process'

export async function POST(request: NextRequest) {
  try {
    const { url, state } = await request.json()
    if (!url) {
      return NextResponse.json({ ok: false, error: 'url is required' }, { status: 400 })
    }

    // Run the multi-state processor in single-URL mode
    const cmd = `SINGLE_URL="${url}" SINGLE_STATE="${state || ''}" node scripts/multi-state-processor.js`

    await new Promise<void>((resolve, reject) => {
      const child = exec(cmd, { cwd: process.cwd() }, (err) => {
        if (err) return reject(err)
        resolve()
      })
      child.stdout?.on('data', (d) => process.stdout.write(d))
      child.stderr?.on('data', (d) => process.stderr.write(d))
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ ok: false, error: 'Failed to start ingest' }, { status: 500 })
  }
}


