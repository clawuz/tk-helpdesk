export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@/lib/storage'

export async function GET(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const url = await getSignedUrl(params.id, 'mp4')
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
