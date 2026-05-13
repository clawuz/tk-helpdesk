import { bundle } from '@remotion/bundler'
import { renderStill, renderMedia, selectComposition } from '@remotion/renderer'
import path from 'path'
import os from 'os'
import { randomUUID } from 'crypto'

let bundled: string | null = null

async function getBundle(): Promise<string> {
  if (bundled) return bundled
  bundled = await bundle({
    entryPoint: path.resolve(process.cwd(), 'remotion/index.ts'),
    webpackOverride: (config) => config,
  })
  return bundled
}

export async function renderHelpdeskStill(
  props: Record<string, unknown>,
  width: number,
  height: number,
): Promise<string> {
  const serveUrl = await getBundle()
  const composition = await selectComposition({
    serveUrl,
    id: 'Helpdesk',
    inputProps: { ...props, width, height },
  })
  const outPath = path.join(os.tmpdir(), `${randomUUID()}.png`)
  await renderStill({
    composition,
    serveUrl,
    output: outPath,
    inputProps: { ...props, width, height },
  })
  return outPath
}

export async function renderHelpdeskVideo(
  props: Record<string, unknown>,
  width: number,
  height: number,
): Promise<string> {
  const serveUrl = await getBundle()
  const composition = await selectComposition({
    serveUrl,
    id: 'Helpdesk',
    inputProps: { ...props, width, height },
  })
  const outPath = path.join(os.tmpdir(), `${randomUUID()}.mp4`)
  await renderMedia({
    composition,
    serveUrl,
    codec: 'h264',
    outputLocation: outPath,
    inputProps: { ...props, width, height },
  })
  return outPath
}
