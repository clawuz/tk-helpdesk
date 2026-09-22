export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { getSignedUrl } from '@/lib/storage'

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const filename = req.nextUrl.searchParams.get('filename') ?? undefined
    const url = await getSignedUrl(params.id, 'mp4', filename)
    return NextResponse.redirect(url)
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
