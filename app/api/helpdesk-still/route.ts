export const runtime = 'nodejs'
export const maxDuration = 300

import { NextRequest, NextResponse } from 'next/server'
import { FORMAT_DIMENSIONS, HelpdeskFormat } from '@/lib/helpdesk-templates'
import { renderHelpdeskStill } from '@/lib/remotion-renderer'
import { uploadFile } from '@/lib/storage'
import fs from 'fs'

export async function POST(req: NextRequest) {
  try {
    const { props, format } = await req.json() as { props: Record<string, unknown>; format: HelpdeskFormat }
    const { w, h } = FORMAT_DIMENSIONS[format] ?? FORMAT_DIMENSIONS['1:1']
    const localPath = await renderHelpdeskStill(props, w, h)
    const id = await uploadFile(localPath, 'png')
    fs.rmSync(localPath, { force: true })
    return NextResponse.json({ id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Still render hatası'
    console.error('[helpdesk-still]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
