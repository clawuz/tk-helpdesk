export const runtime = 'nodejs'
export const maxDuration = 600

import { NextRequest, NextResponse } from 'next/server'
import { renderHelpdeskVideo } from '@/lib/remotion-renderer'
import { uploadFile } from '@/lib/storage'
import { FORMAT_DIMENSIONS } from '@/lib/helpdesk-templates'
import fs from 'fs'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const overrides = (body.overrides ?? body.props ?? {}) as Record<string, unknown>
    const format = (overrides.format ?? '1:1') as string
    const { w, h } = FORMAT_DIMENSIONS[format as keyof typeof FORMAT_DIMENSIONS] ?? FORMAT_DIMENSIONS['1:1']
    const localPath = await renderHelpdeskVideo(overrides, w, h)
    const id = await uploadFile(localPath, 'mp4')
    fs.rmSync(localPath, { force: true })
    return NextResponse.json({ id })
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Video render hatası'
    console.error('[render]', message)
    return NextResponse.json({ error: message }, { status: 500 })
  }
}
