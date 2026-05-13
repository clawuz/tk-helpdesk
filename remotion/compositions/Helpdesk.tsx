import React from 'react'
import { AbsoluteFill, Img as RemotionImg, staticFile, continueRender, delayRender } from 'remotion'

// Suppress strict type mismatch between @types/react versions and Remotion's Img
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const Img = RemotionImg as React.ComponentType<any>

// Per-format layout constants (same values as FORMAT_LAYOUT in helpdesk-templates.ts)
const FORMAT_LAYOUT = {
  '1:1':  { iconCenterYPct: 0.218, logoCenterYPct: 0.833, contentStartYPct: 0.130 },
  '9:16': { iconCenterYPct: 0.237, logoCenterYPct: 0.590, contentStartYPct: 0.175 },
  '16:9': { iconCenterYPct: 0.176, logoCenterYPct: 0.790, contentStartYPct: 0.085 },
} as Record<string, { iconCenterYPct: number; logoCenterYPct: number; contentStartYPct: number }>

// Load TK fonts once when the module initialises
const waitForFonts = delayRender('load-tk-fonts')

Promise.all([
  new FontFace('TKTextVF', `url(${staticFile('TKTextVF.woff2')})`).load(),
  new FontFace('TKDISPLAYVF', `url(${staticFile('TKDISPLAYVF.woff2')})`).load(),
]).then(([text, display]) => {
  ;(document.fonts as any).add(text)
  ;(document.fonts as any).add(display)
  continueRender(waitForFonts)
}).catch(() => {
  continueRender(waitForFonts)
})

export interface HelpdeskProps {
  theme: 'red' | 'dark' | 'graphite'
  layout: 'standard' | 'social-mockup' | 'no-card'
  width: number
  height: number
  topElement: 'icon' | 'title' | 'none'
  iconUrl: string
  bigTitle: string
  bodyText: string
  date: string
  logoVariant: 'light' | 'dark'  // kept for override; auto-selected from theme if not set
  bodyFont: string
  letterSpacing: string  // e.g. '0.025em' or '-0.005em'
  backgroundImage: string
  fontSize?: number        // body font size in base-1080 pt (default 36)
  lineHeight?: number      // line height multiplier (default 1.72)
  titleFont?: string       // big title font family (default TKDISPLAYVF)
  titleFontSize?: number   // big title font size in base-1080 pt (default 112)
  titleOffsetY?: number    // Y offset from default title position in base-1080 px
  dateOffsetY?: number     // Y offset from default date position in base-1080 px
  iconOffsetY?: number     // Y offset from default icon position in base-1080 px
  logoOffsetY?: number     // Y offset from default logo position in base-1080 px
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function isRemote(url: string) {
  return url.startsWith('http') || url.startsWith('data:')
}

function imgSrc(url: string) {
  if (!url) return ''
  return isRemote(url) ? url : staticFile(url)
}

// ─── Standard / No-card Layout ───────────────────────────────────────────────
// Both red/dark/graphite use the same layout:
// background fills frame, date top-right, icon+text centered, logo bottom-center

function getFormatKey(width: number, height: number): string {
  const ratio = width / height
  if (ratio > 1.5) return '16:9'
  if (ratio < 0.7) return '9:16'
  return '1:1'
}

function MainLayout({
  width, height, theme, topElement, iconUrl, bigTitle, bodyText, date, bodyFont, letterSpacing, backgroundImage,
  fontSize, lineHeight, titleFont, titleFontSize, titleOffsetY, dateOffsetY, iconOffsetY, logoOffsetY,
}: HelpdeskProps) {
  // All sizes use min(width,height)/1080 scale so they're consistent across formats
  const baseScale = Math.min(width, height) / 1080
  const sc = (n: number) => Math.round(n * baseScale)

  const formatKey = getFormatKey(width, height)
  const fmtLayout = FORMAT_LAYOUT[formatKey] ?? FORMAT_LAYOUT['1:1']

  const PAD_X        = sc(60)
  const PAD_Y        = sc(68)
  const dateSize     = sc(29)
  const iconSz       = sc(175)
  const titleSz      = sc(titleFontSize ?? 112)
  const bodySize     = sc(fontSize ?? 36)
  const logoH        = sc(100)
  const TITLE_TEXT_GAP = sc(80)
  const ICON_TEXT_GAP  = sc(80)
  const BODY_LOGO_GAP  = sc(80)
  const lineH        = lineHeight ?? 1.72
  const titleFontFamily = titleFont || 'TKDISPLAYVF, sans-serif'

  const logoSrc = theme === 'dark'
    ? imgSrc('malzemeler/logo_dark.png')
    : imgSrc('malzemeler/Logo.png')

  const bgSrc = backgroundImage ? imgSrc(backgroundImage) : ''
  const ls = letterSpacing || '0.025em'
  const font = bodyFont || 'TKTextVF, sans-serif'

  // Shared baseline for icon/title Y (both start from same format percentage)
  const baseTopY     = Math.round(fmtLayout.iconCenterYPct * height)
  const iconCenterY  = baseTopY + sc(iconOffsetY ?? 0)
  const iconTopY     = iconCenterY - iconSz / 2
  const iconBottomY  = iconTopY + iconSz

  const titleTopY    = baseTopY + sc(titleOffsetY ?? 0)
  const titleLines   = Math.max(1, bigTitle.split('\n').length)
  const titleEstH    = sc((titleFontSize ?? 112) * 1.2 * titleLines)
  const titleBottomY = titleTopY + titleEstH

  const logoCenterY  = Math.round(fmtLayout.logoCenterYPct * height) + sc(logoOffsetY ?? 0)
  const logoTopY     = logoCenterY - logoH / 2
  const contentStartY = Math.round(fmtLayout.contentStartYPct * height)
  const textTopY     = topElement === 'icon'  ? iconBottomY + ICON_TEXT_GAP
                     : topElement === 'title' ? titleBottomY + TITLE_TEXT_GAP
                     : contentStartY
  const textEndY     = logoTopY - BODY_LOGO_GAP

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {bgSrc && (
        <Img src={bgSrc} placeholder="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}

      {/* Date — top-right */}
      <div style={{ position: 'absolute', top: PAD_Y + sc(dateOffsetY ?? 0), right: PAD_X, color: '#ffffff', fontSize: dateSize, fontFamily: font, letterSpacing: ls, lineHeight: 1, fontKerning: 'auto', textRendering: 'optimizeLegibility' } as React.CSSProperties}>
        {date}
      </div>

      {/* Icon — exact Y */}
      {topElement === 'icon' && iconUrl && (
        <div style={{ position: 'absolute', top: iconTopY, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <Img src={imgSrc(iconUrl)} placeholder="" style={{ width: iconSz, height: iconSz, objectFit: 'contain' }} />
        </div>
      )}

      {/* Big title — independent Y position */}
      {topElement === 'title' && bigTitle && (
        <div style={{ position: 'absolute', top: titleTopY, left: PAD_X, right: PAD_X, color: '#ffffff', fontSize: titleSz, fontWeight: 600, fontFamily: titleFontFamily, lineHeight: 1.15, letterSpacing: ls, textAlign: 'center', whiteSpace: 'pre-wrap', fontKerning: 'auto', textRendering: 'optimizeLegibility' } as React.CSSProperties}>
          {bigTitle}
        </div>
      )}

      {/* Body text */}
      <div style={{
        position: 'absolute',
        top: textTopY,
        left: PAD_X, right: PAD_X,
        bottom: height - textEndY,
        overflow: 'hidden',
        color: '#ffffff',
        fontSize: bodySize,
        fontFamily: font,
        lineHeight: lineH,
        letterSpacing: ls,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        textAlign: 'center',
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
      } as React.CSSProperties}>
        {bodyText}
      </div>

      {/* Logo — exact Y */}
      <div style={{ position: 'absolute', top: logoTopY, left: 0, right: 0, display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
        <Img src={logoSrc} placeholder="" style={{ height: logoH, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  )
}

// ─── Social Mockup Layout (Sahte Hesaplar) ───────────────────────────────────

function SocialMockupLayout({
  width, height, bodyText, date, logoVariant, bodyFont, backgroundImage,
}: HelpdeskProps) {
  const scale = width / 1080
  const pad = Math.round(60 * scale)
  const cardW = Math.round(width * 0.85)
  const headerSize = Math.round(36 * scale)
  const bodySize = Math.round(32 * scale)
  const metaSize = Math.round(24 * scale)
  const avatarSize = Math.round(80 * scale)
  const borderR = Math.round(16 * scale)
  const logoH = Math.round(72 * scale)
  const dateSize = Math.round(26 * scale)

  const logoSrc = logoVariant === 'dark'
    ? imgSrc('malzemeler/logo_dark.png')
    : imgSrc('malzemeler/Logo.png')
  const bgSrc = backgroundImage ? imgSrc(backgroundImage) : ''

  return (
    <AbsoluteFill style={{ backgroundColor: '#000' }}>
      {bgSrc && (
        <Img src={bgSrc} placeholder="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}
      <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />

      {/* Date top-right */}
      <div style={{ position: 'absolute', top: pad, right: pad, color: '#fff', fontSize: dateSize, fontFamily: 'TKTextVF, sans-serif' }}>
        {date}
      </div>

      {/* Mockup card */}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: pad }}>
        <div style={{ width: cardW }}>
          {/* Warning banner */}
          <div style={{ background: 'rgba(200,0,0,0.92)', borderRadius: `${borderR}px ${borderR}px 0 0`, padding: `${Math.round(20 * scale)}px ${Math.round(28 * scale)}px`, display: 'flex', alignItems: 'center', gap: Math.round(12 * scale) }}>
            <div style={{ fontSize: Math.round(48 * scale) }}>⚠️</div>
            <div style={{ color: '#fff', fontFamily: 'TKDISPLAYVF, sans-serif', fontSize: headerSize, fontWeight: 900 }}>SAHTE HESAP UYARISI</div>
          </div>
          {/* Post body */}
          <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: `0 0 ${borderR}px ${borderR}px`, padding: Math.round(28 * scale) }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: Math.round(16 * scale), marginBottom: Math.round(20 * scale) }}>
              <div style={{ width: avatarSize, height: avatarSize, borderRadius: '50%', background: '#e5e7eb', border: `${Math.round(3 * scale)}px solid #ef4444`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9ca3af', fontSize: Math.round(32 * scale), flexShrink: 0 }}>?</div>
              <div>
                <div style={{ color: '#111', fontFamily: 'TKTextVF, sans-serif', fontSize: headerSize, fontWeight: 700 }}>@sahte_hesap</div>
                <div style={{ color: '#ef4444', fontFamily: 'TKTextVF, sans-serif', fontSize: metaSize, fontWeight: 700 }}>✗ Türk Hava Yolları DEĞİL</div>
              </div>
            </div>
            <div style={{ color: '#374151', fontFamily: 'TKTextVF, sans-serif', fontSize: bodySize, lineHeight: 1.6, whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderTop: `${Math.round(2 * scale)}px solid #f3f4f6`, paddingTop: Math.round(20 * scale) }}>
              {bodyText}
            </div>
            <div style={{ color: '#9ca3af', fontFamily: 'TKTextVF, sans-serif', fontSize: metaSize, marginTop: Math.round(16 * scale) }}>{date}</div>
          </div>
        </div>
      </div>

      {/* Logo bottom */}
      <div style={{ position: 'absolute', bottom: pad, left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
        <Img src={logoSrc} placeholder="" style={{ height: logoH, objectFit: 'contain' }} />
      </div>
    </AbsoluteFill>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export const Helpdesk: React.FC<HelpdeskProps> = (props) => {
  if (props.layout === 'social-mockup') return <SocialMockupLayout {...props} />
  return <MainLayout {...props} />
}
