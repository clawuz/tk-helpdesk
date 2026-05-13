'use client'

import { useState, useRef, useCallback } from 'react'
import {
  HelpdeskTheme, HelpdeskFormat, HelpdeskTopElement,
  HELPDESK_CATEGORIES, getHelpdeskCategoriesByTheme, getHelpdeskCategory,
  getHelpdeskBackground, getHelpdeskBgFallback, getHelpdeskLogo,
  FORMAT_DIMENSIONS, FORMAT_LAYOUT,
} from '@/lib/helpdesk-templates'
import { saveProject, addRender, getRenders } from '@/lib/projects'
import type { Project } from '@/lib/projects'

// ─── Types ────────────────────────────────────────────────────────────────────

export const FONT_OPTIONS = [
  { value: 'TKTextVF, sans-serif',    label: 'TK Text (varsayılan)' },
  { value: 'TKDISPLAYVF, sans-serif', label: 'TK Display' },
  { value: 'Helvetica Neue, Arial, sans-serif', label: 'Helvetica / Arial' },
  { value: 'Georgia, serif',          label: 'Georgia' },
]

export const TITLE_FONT_OPTIONS = [
  { value: 'TKDISPLAYVF, sans-serif', label: 'TK Display (varsayılan)' },
  { value: 'TKTextVF, sans-serif',    label: 'TK Text' },
  { value: 'Helvetica Neue, Arial, sans-serif', label: 'Helvetica / Arial' },
]

// Per-format adjustable settings — each format keeps its own values
interface FormatOverrides {
  fontSize: number        // body font size (pt, base-1080)
  lineHeight: number      // body line height multiplier
  bodyTracking: number    // body letter-spacing in em (e.g. 0.025)
  titleFontSize: number   // big title font size (pt, base-1080)
  titleOffsetY: number    // big title Y offset from baseline (px, base-1080)
  dateOffsetY: number     // date Y offset (px, base-1080)
  iconOffsetY: number     // icon Y offset (px, base-1080)
  logoOffsetY: number     // logo Y offset (px, base-1080)
}

const DEFAULT_FORMAT_OVERRIDES: FormatOverrides = {
  fontSize: 36,
  lineHeight: 1.72,
  bodyTracking: 0.025,
  titleFontSize: 112,
  titleOffsetY: 0,
  dateOffsetY: 0,
  iconOffsetY: 0,
  logoOffsetY: 0,
}

interface HelpdeskState {
  theme: HelpdeskTheme
  categoryId: string
  format: HelpdeskFormat
  topElement: HelpdeskTopElement
  iconUrl: string
  bigTitle: string
  bodyText: string
  date: string
  bodyFont: string
  titleFont: string       // big title font family
  safeAreaVisible: boolean
  formatOverrides: Record<HelpdeskFormat, FormatOverrides>
}

// ─── Live CSS Preview ─────────────────────────────────────────────────────────

function LivePreview({ state }: { state: HelpdeskState }) {
  const category = getHelpdeskCategory(state.categoryId)
  const layout = category?.layout ?? 'standard'
  const bgImage = getHelpdeskBackground(state.theme, state.categoryId, state.format)
  const bgFallback = getHelpdeskBgFallback(state.theme)
  const logoSrc = getHelpdeskLogo(state.theme)
  const letterSpacing = `${state.formatOverrides[state.format].bodyTracking}em`

  const { w, h } = FORMAT_DIMENSIONS[state.format]
  const fmtLayout = FORMAT_LAYOUT[state.format]

  // Fit preview into max box
  const maxW = 420
  const maxH = 560
  const fitScale = Math.min(maxW / w, maxH / h, 1)
  const previewW = Math.round(w * fitScale)
  const previewH = Math.round(h * fitScale)

  // sc: mirrors Remotion's baseScale (Math.min(w,h)/1080) then scales to preview size.
  // This keeps padding/gaps proportionally identical to what Remotion renders.
  const remotionBase = Math.min(w, h) / 1080
  const sc = (n: number) => Math.round(n * remotionBase * fitScale)

  // Per-format overrides for the currently selected format
  const ov = state.formatOverrides[state.format]

  // ── Base canvas constants (measured/designed at 1080px width) ──
  const PAD_X         = 60   // horizontal padding
  const PAD_Y         = 68   // date top offset
  const DATE_FS       = 29
  const ICON_SZ       = 175  // icon diameter
  const LOGO_H        = 100  // logo height
  const TITLE_TEXT_GAP = 80  // gap: big-title bottom → body text top
  const ICON_TEXT_GAP  = 80  // gap: icon bottom → body text top
  const BODY_LOGO_GAP  = 80  // gap: body text bottom → logo top

  if (layout === 'social-mockup') {
    const borderR = sc(16)
    const cardW = Math.min(sc(940), previewW - sc(PAD_X) * 2)
    return (
      <div style={{
        width: previewW, height: previewH,
        position: 'relative', overflow: 'hidden', borderRadius: 8, flexShrink: 0,
        background: bgFallback,
      }}>
        {bgImage && <img src={bgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />}
        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.55)' }} />
        {/* Date top-right */}
        <div style={{ position: 'absolute', top: sc(PAD_Y), right: sc(PAD_X), color: '#fff', fontSize: sc(DATE_FS), fontFamily: state.bodyFont, letterSpacing: '0.3px' }}>
          {state.date}
        </div>
        {/* Mockup card */}
        <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: sc(PAD_X) }}>
          <div style={{ width: cardW }}>
            <div style={{ background: 'rgba(200,0,0,0.92)', borderRadius: `${borderR}px ${borderR}px 0 0`, padding: `${sc(20)}px ${sc(28)}px`, display: 'flex', alignItems: 'center', gap: sc(12) }}>
              <span style={{ fontSize: sc(40) }}>⚠️</span>
              <span style={{ color: '#fff', fontWeight: 900, fontSize: sc(32), fontFamily: 'TKDISPLAYVF, sans-serif' }}>SAHTE HESAP UYARISI</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.97)', borderRadius: `0 0 ${borderR}px ${borderR}px`, padding: sc(28) }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: sc(16), marginBottom: sc(16) }}>
                <div style={{ width: sc(64), height: sc(64), borderRadius: '50%', background: '#e5e7eb', border: `${sc(3)}px solid #ef4444`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: sc(28), color: '#9ca3af', flexShrink: 0 }}>?</div>
                <div>
                  <div style={{ fontSize: sc(28), fontWeight: 700, color: '#111', fontFamily: state.bodyFont }}>@sahte_hesap</div>
                  <div style={{ fontSize: sc(22), color: '#ef4444', fontWeight: 700, fontFamily: state.bodyFont }}>✗ Türk Hava Yolları DEĞİL</div>
                </div>
              </div>
              <div style={{ fontSize: sc(26), color: '#374151', lineHeight: 1.55, whiteSpace: 'pre-wrap', wordBreak: 'break-word', borderTop: '1px solid #f3f4f6', paddingTop: sc(16), fontFamily: state.bodyFont }}>
                {state.bodyText}
              </div>
              <div style={{ fontSize: sc(20), color: '#9ca3af', marginTop: sc(12), fontFamily: state.bodyFont }}>{state.date}</div>
            </div>
          </div>
        </div>
        {/* Logo bottom */}
        <div style={{ position: 'absolute', bottom: sc(PAD_Y), left: 0, right: 0, display: 'flex', justifyContent: 'center' }}>
          <img src={logoSrc} alt="logo" style={{ height: sc(LOGO_H), objectFit: 'contain' }} />
        </div>
      </div>
    )
  }

  // ─── Standard layout ─────────────────────────────────────────────────────────
  // All Y positions derived from FORMAT_LAYOUT percentages × previewH + per-format offsets

  const logoH       = sc(LOGO_H)
  const logoCenterY = Math.round(fmtLayout.logoCenterYPct * previewH) + sc(ov.logoOffsetY)
  const logoTopY    = logoCenterY - logoH / 2

  const iconSz       = sc(ICON_SZ)
  const baseTopY     = Math.round(fmtLayout.iconCenterYPct * previewH)  // shared baseline for icon & title
  const iconCenterY  = baseTopY + sc(ov.iconOffsetY)
  const iconTopY     = iconCenterY - iconSz / 2
  const iconBottomY  = iconTopY + iconSz

  // Title: positioned from its top edge, independent offset from icon
  const titleTopY    = baseTopY + sc(ov.titleOffsetY)
  const titleLines   = Math.max(1, state.bigTitle.split('\n').length)
  const titleEstH    = sc(ov.titleFontSize * 1.2 * titleLines)  // approximate height
  const titleBottomY = titleTopY + titleEstH

  const contentStartY = Math.round(fmtLayout.contentStartYPct * previewH)
  const contentEndY   = logoTopY - sc(BODY_LOGO_GAP)

  const textTopY = state.topElement === 'icon'  ? iconBottomY + sc(ICON_TEXT_GAP)
                 : state.topElement === 'title' ? titleBottomY + sc(TITLE_TEXT_GAP)
                 : contentStartY

  return (
    <div style={{
      width: previewW, height: previewH,
      position: 'relative', overflow: 'hidden', borderRadius: 8, flexShrink: 0,
      background: bgFallback,
    }}>
      {/* Background */}
      {bgImage && (
        <img src={bgImage} alt="" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
      )}

      {/* Safe area guides */}
      {state.safeAreaVisible && (
        <>
          <div style={{ position: 'absolute', top: 0, bottom: 0, left: sc(PAD_X), width: 1, background: 'rgba(255,200,0,0.7)', zIndex: 10, pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', top: 0, bottom: 0, right: sc(PAD_X), width: 1, background: 'rgba(255,200,0,0.7)', zIndex: 10, pointerEvents: 'none' }} />
        </>
      )}

      {/* Date — top-right */}
      <div style={{
        position: 'absolute',
        top: sc(PAD_Y) + sc(ov.dateOffsetY),
        right: sc(PAD_X),
        color: '#ffffff',
        fontSize: sc(DATE_FS),
        fontFamily: state.bodyFont,
        letterSpacing,
        lineHeight: 1,
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
      } as React.CSSProperties}>
        {state.date}
      </div>

      {/* Icon — absolute, exact Y position */}
      {state.topElement === 'icon' && state.iconUrl && (
        <div style={{
          position: 'absolute',
          top: iconTopY,
          left: 0, right: 0,
          display: 'flex',
          justifyContent: 'center',
        }}>
          <img src={state.iconUrl} alt="icon" style={{ width: iconSz, height: iconSz, objectFit: 'contain' }} />
        </div>
      )}

      {/* Big title — independent Y position */}
      {state.topElement === 'title' && state.bigTitle && (
        <div style={{
          position: 'absolute',
          top: titleTopY,
          left: sc(PAD_X), right: sc(PAD_X),
          color: '#ffffff',
          fontSize: sc(ov.titleFontSize),
          fontWeight: 600,
          fontFamily: state.titleFont,
          lineHeight: 1.15,
          letterSpacing,
          textAlign: 'center',
          whiteSpace: 'pre-wrap',
          fontKerning: 'auto',
          textRendering: 'optimizeLegibility',
        } as React.CSSProperties}>
          {state.bigTitle}
        </div>
      )}

      {/* Body text — below icon/title */}
      <div style={{
        position: 'absolute',
        top: textTopY,
        left: sc(PAD_X),
        right: sc(PAD_X),
        bottom: previewH - contentEndY,
        overflow: 'hidden',
        color: '#ffffff',
        fontSize: sc(ov.fontSize),
        fontFamily: state.bodyFont,
        lineHeight: ov.lineHeight,
        letterSpacing,
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-word',
        textAlign: 'center',
        fontKerning: 'auto',
        textRendering: 'optimizeLegibility',
      } as React.CSSProperties}>
        {state.bodyText}
      </div>

      {/* Logo — exact Y from measurements */}
      <div style={{
        position: 'absolute',
        top: logoTopY,
        left: 0, right: 0,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}>
        <img src={logoSrc} alt="Turkish Airlines" style={{ height: logoH, objectFit: 'contain' }} />
      </div>
    </div>
  )
}

// ─── Icon Picker ──────────────────────────────────────────────────────────────

const PRESET_ICONS = [
  { label: 'Uyarı',      src: '/malzemeler/Asset 1.png' },
  { label: 'Uçuş',       src: '/malzemeler/ucus_duyuru.png' },
  { label: 'IT',         src: '/malzemeler/it_kriz.png' },
  { label: 'İkram',      src: '/malzemeler/ikram_vaka.png' },
  { label: 'Değişiklik', src: '/malzemeler/Ucus_Degisiklik.png' },
]

function IconPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const fileRef = useRef<HTMLInputElement>(null)

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => onChange(ev.target?.result as string)
    reader.readAsDataURL(file)
  }

  return (
    <div className="space-y-2">
      <div className="flex flex-wrap gap-2">
        {PRESET_ICONS.map((icon) => (
          <button
            key={icon.src}
            onClick={() => onChange(icon.src)}
            className={`w-12 h-12 rounded-lg border-2 overflow-hidden flex items-center justify-center transition-all bg-gray-100 ${
              value === icon.src ? 'border-gray-900' : 'border-gray-200 hover:border-gray-400'
            }`}
            title={icon.label}
          >
            <img src={icon.src} alt={icon.label} className="w-9 h-9 object-contain" />
          </button>
        ))}
        <button
          onClick={() => fileRef.current?.click()}
          className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 hover:border-gray-500 flex items-center justify-center text-gray-400 hover:text-gray-600 text-xl transition-all"
          title="İkon yükle (PNG/SVG)"
        >
          +
        </button>
      </div>
      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/svg+xml"
        className="hidden"
        onChange={handleFile}
      />
      {value && (
        <div className="flex items-center gap-2">
          <img src={value} alt="selected" className="w-10 h-10 object-contain border border-gray-200 rounded bg-gray-100" />
          <button onClick={() => onChange('')} className="text-xs text-red-500 hover:text-red-700">
            Kaldır
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Main Tab ─────────────────────────────────────────────────────────────────

const THEMES: { id: HelpdeskTheme; label: string; color: string }[] = [
  { id: 'red',      label: 'Kırmızı', color: 'bg-red-600' },
  { id: 'dark',     label: 'Dark',    color: 'bg-gray-900' },
  { id: 'graphite', label: 'Grafit',  color: 'bg-gray-600' },
]

const FORMATS: { id: HelpdeskFormat; label: string }[] = [
  { id: '9:16', label: '9:16' },
  { id: '1:1',  label: '1:1' },
  { id: '16:9', label: '16:9' },
]

const DEFAULT_OVERRIDES = {
  '1:1':  { ...DEFAULT_FORMAT_OVERRIDES, bodyTracking: 0.025 },
  '9:16': { ...DEFAULT_FORMAT_OVERRIDES, bodyTracking: 0.025 },
  '16:9': { ...DEFAULT_FORMAT_OVERRIDES, bodyTracking: -0.005 },
}

function stateFromProject(project: Project): HelpdeskState {
  const p = project.params as Partial<HelpdeskState>
  const fallbackCat = HELPDESK_CATEGORIES.find(c => c.id === 'ai-aciklama') ?? HELPDESK_CATEGORIES[0]
  return {
    theme: p.theme ?? fallbackCat.theme,
    categoryId: p.categoryId ?? fallbackCat.id,
    format: p.format ?? '1:1',
    topElement: p.topElement ?? fallbackCat.defaultTopElement,
    iconUrl: p.iconUrl ?? '',
    bigTitle: p.bigTitle ?? '',
    bodyText: p.bodyText ?? '',
    date: p.date ?? '',
    bodyFont: p.bodyFont ?? FONT_OPTIONS[0].value,
    titleFont: p.titleFont ?? TITLE_FONT_OPTIONS[0].value,
    safeAreaVisible: false,
    formatOverrides: p.formatOverrides ?? DEFAULT_OVERRIDES,
  }
}

interface HelpdeskTabProps {
  initialProject?: Project | null
}

export function HelpdeskTab({ initialProject }: HelpdeskTabProps = {}) {
  const initialCategory = HELPDESK_CATEGORIES.find(c => c.id === 'ai-aciklama') ?? HELPDESK_CATEGORIES[0]
  const [state, setState] = useState<HelpdeskState>(() =>
    initialProject
      ? stateFromProject(initialProject)
      : {
          theme: initialCategory.theme,
          categoryId: initialCategory.id,
          format: '1:1',
          topElement: initialCategory.defaultTopElement,
          iconUrl: initialCategory.defaultIcon,
          bigTitle: initialCategory.defaultTitle,
          bodyText: initialCategory.defaultBody,
          date: initialCategory.defaultDate,
          bodyFont: FONT_OPTIONS[0].value,
          titleFont: TITLE_FONT_OPTIONS[0].value,
          safeAreaVisible: false,
          formatOverrides: DEFAULT_OVERRIDES,
        }
  )

  const [projectName, setProjectName] = useState(initialProject?.name ?? '')
  const [pngLoading, setPngLoading] = useState(false)
  const [videoLoading, setVideoLoading] = useState(false)
  const [pngError, setPngError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [videoId, setVideoId] = useState<string | null>(null)

  const update = useCallback(<K extends keyof HelpdeskState>(key: K, value: HelpdeskState[K]) => {
    setState(prev => ({ ...prev, [key]: value }))
  }, [])

  // Update a per-format override for the currently selected format
  const updateFmt = useCallback(<K extends keyof FormatOverrides>(key: K, value: FormatOverrides[K]) => {
    setState(prev => ({
      ...prev,
      formatOverrides: {
        ...prev.formatOverrides,
        [prev.format]: { ...prev.formatOverrides[prev.format], [key]: value },
      },
    }))
  }, [])

  const handleCategoryChange = (id: string) => {
    const cat = getHelpdeskCategory(id)
    if (!cat) return
    setState(prev => ({
      ...prev,
      categoryId: id,
      topElement: cat.defaultTopElement,
      bigTitle: cat.defaultTitle,
      bodyText: cat.defaultBody,
      date: cat.defaultDate,
      iconUrl: cat.defaultIcon,
      bodyFont: FONT_OPTIONS[0].value,
    }))
  }

  const handleThemeChange = (theme: HelpdeskTheme) => {
    const cats = getHelpdeskCategoriesByTheme(theme)
    const first = cats[0]
    if (!first) return
    setState(prev => ({
      ...prev,
      theme,
      categoryId: first.id,
      topElement: first.defaultTopElement,
      bigTitle: first.defaultTitle,
      bodyText: first.defaultBody,
      date: first.defaultDate,
      iconUrl: '',
      bodyFont: FONT_OPTIONS[0].value,
    }))
  }

  const buildProjectParams = () => ({
    theme: state.theme,
    categoryId: state.categoryId,
    format: state.format,
    topElement: state.topElement,
    iconUrl: state.iconUrl,
    bigTitle: state.bigTitle,
    bodyText: state.bodyText,
    date: state.date,
    bodyFont: state.bodyFont,
    titleFont: state.titleFont,
    formatOverrides: state.formatOverrides,
  })

  const saveToHistory = async (renderId: string, durationSeconds: number) => {
    if (!projectName.trim()) return
    try {
      const params = buildProjectParams()
      const projectId = await saveProject(projectName.trim(), 'Helpdesk', state.format, params)
      const renders = await getRenders(projectId)
      await addRender(projectId, renderId, state.format, durationSeconds, renders.length + 1)
    } catch (err) {
      console.error('[HelpdeskTab] project save failed:', err)
    }
  }

  const buildRenderProps = () => {
    const cat = getHelpdeskCategory(state.categoryId)
    const { w, h } = FORMAT_DIMENSIONS[state.format]
    const bgImage = getHelpdeskBackground(state.theme, state.categoryId, state.format)
    const ov = state.formatOverrides[state.format]
    return {
      theme: state.theme,
      layout: cat?.layout ?? 'standard',
      width: w,
      height: h,
      topElement: state.topElement,
      iconUrl: state.iconUrl,
      bigTitle: state.bigTitle,
      bodyText: state.bodyText,
      date: state.date,
      logoVariant: state.theme === 'dark' ? 'dark' : 'light',
      bodyFont: state.bodyFont,
      titleFont: state.titleFont,
      letterSpacing: `${ov.bodyTracking}em`,
      backgroundImage: bgImage.replace(/^\//, ''),
      fontSize: ov.fontSize,
      lineHeight: ov.lineHeight,
      titleFontSize: ov.titleFontSize,
      titleOffsetY: ov.titleOffsetY,
      dateOffsetY: ov.dateOffsetY,
      iconOffsetY: ov.iconOffsetY,
      logoOffsetY: ov.logoOffsetY,
    }
  }

  const handleDownloadPng = async () => {
    setPngLoading(true)
    setPngError(null)
    try {
      const res = await fetch('/api/helpdesk-still', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ props: buildRenderProps(), format: state.format }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'PNG render hatası')
      const a = document.createElement('a')
      a.href = `/api/download-still/${data.id}`
      const catLabel = getHelpdeskCategory(state.categoryId)?.label ?? state.categoryId
      a.download = `${catLabel}-${state.format.replace(':', 'x')}.png`
      a.click()
      saveToHistory(data.id, 0)
    } catch (err) {
      setPngError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setPngLoading(false)
    }
  }

  const handleRenderVideo = async () => {
    setVideoLoading(true)
    setVideoError(null)
    setVideoId(null)
    try {
      const res = await fetch('/api/render', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ templateId: 'Helpdesk', overrides: buildRenderProps(), durationSeconds: 5 }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error ?? 'Video render hatası')
      setVideoId(data.id)
      saveToHistory(data.id, 5)
    } catch (err) {
      setVideoError(err instanceof Error ? err.message : 'Bilinmeyen hata')
    } finally {
      setVideoLoading(false)
    }
  }

  const categoriesInTheme = getHelpdeskCategoriesByTheme(state.theme)
  const currentCategory = getHelpdeskCategory(state.categoryId)
  const { w, h } = FORMAT_DIMENSIONS[state.format]

  return (
    <div className="flex flex-1 overflow-hidden">
      {/* ─── Left panel ─────────────────────────────────────────────── */}
      <div className="w-[52%] p-5 border-r border-gray-100 overflow-y-auto space-y-5">

        {/* Project name */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Proje Adı</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            placeholder="Projeye bir isim ver (kaydedilmesi için zorunlu)..."
            value={projectName}
            onChange={e => setProjectName(e.target.value)}
          />
        </div>

        {/* Theme */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Tema</label>
          <div className="flex gap-2">
            {THEMES.map(t => (
              <button
                key={t.id}
                onClick={() => handleThemeChange(t.id)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-semibold border-2 transition-all ${
                  state.theme === t.id ? 'border-gray-900 bg-gray-100' : 'border-gray-200 hover:border-gray-400'
                }`}
              >
                <span className={`w-3 h-3 rounded-full ${t.color}`} />
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Kategori</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={state.categoryId}
            onChange={e => handleCategoryChange(e.target.value)}
          >
            {categoriesInTheme.map(cat => (
              <option key={cat.id} value={cat.id}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Format */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Format</label>
          <div className="flex gap-2">
            {FORMATS.map(f => (
              <button
                key={f.id}
                onClick={() => update('format', f.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium border-2 transition-all ${
                  state.format === f.id
                    ? 'border-gray-900 bg-gray-900 text-white'
                    : 'border-gray-200 text-gray-600 hover:border-gray-400'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Tarih</label>
          <input
            type="text"
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={state.date}
            onChange={e => update('date', e.target.value)}
          />
        </div>

        {/* Body Font */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Metin Fontu</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={state.bodyFont}
            onChange={e => update('bodyFont', e.target.value)}
          >
            {FONT_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* Title Font */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">Başlık Fontu</label>
          <select
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300"
            value={state.titleFont}
            onChange={e => update('titleFont', e.target.value)}
          >
            {TITLE_FONT_OPTIONS.map(f => (
              <option key={f.value} value={f.value}>{f.label}</option>
            ))}
          </select>
        </div>

        {/* ── Per-format adjustments ── */}
        {(() => {
          const ov = state.formatOverrides[state.format]
          const fmtLabel = state.format

          function SliderRow({
            label, value, min, max, step, onChange, resetVal,
          }: {
            label: string; value: number; min: number; max: number; step: number
            onChange: (v: number) => void; resetVal: number
          }) {
            return (
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-24 shrink-0">{label}</span>
                <input type="range" min={min} max={max} step={step} value={value}
                  onChange={e => onChange(Number(e.target.value))}
                  className="flex-1 accent-gray-900" />
                <input type="number" min={min} max={max} step={step} value={value}
                  onChange={e => onChange(Number(e.target.value))}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-gray-300" />
                {value !== resetVal && (
                  <button onClick={() => onChange(resetVal)} className="text-xs text-gray-400 hover:text-gray-700">↺</button>
                )}
              </div>
            )
          }

          return (
            <div className="rounded-xl border border-gray-200 bg-gray-50 p-4 space-y-4">
              <div className="text-xs font-bold text-gray-700 flex items-center gap-2">
                <span className="bg-gray-900 text-white px-2 py-0.5 rounded font-mono">{fmtLabel}</span>
                Format Ayarları
                <span className="font-normal text-gray-400 ml-auto">sadece bu format için</span>
              </div>

              {/* Body font size */}
              <SliderRow label={`Metin boyutu`} value={ov.fontSize} min={16} max={80} step={1}
                onChange={v => updateFmt('fontSize', v)} resetVal={36} />

              {/* Line height */}
              <SliderRow label={`Satır aralığı`} value={ov.lineHeight} min={1.0} max={2.5} step={0.05}
                onChange={v => updateFmt('lineHeight', Math.round(v * 100) / 100)} resetVal={1.72} />

              {/* Tracking */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-gray-600 w-24 shrink-0">Tracking</span>
                <input type="range" min={-0.05} max={0.1} step={0.005} value={ov.bodyTracking}
                  onChange={e => updateFmt('bodyTracking', Math.round(Number(e.target.value) * 1000) / 1000)}
                  className="flex-1 accent-gray-900" />
                <input type="number" min={-0.05} max={0.1} step={0.005} value={ov.bodyTracking}
                  onChange={e => updateFmt('bodyTracking', Math.round(Number(e.target.value) * 1000) / 1000)}
                  className="w-16 border border-gray-200 rounded-lg px-2 py-1 text-xs text-center focus:outline-none focus:ring-2 focus:ring-gray-300" />
                {ov.bodyTracking !== DEFAULT_FORMAT_OVERRIDES.bodyTracking && (
                  <button onClick={() => updateFmt('bodyTracking', state.format === '16:9' ? -0.005 : 0.025)}
                    className="text-xs text-gray-400 hover:text-gray-700">↺</button>
                )}
              </div>

              {/* Title font size */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Büyük Başlık</div>
                <SliderRow label={`Başlık boyutu`} value={ov.titleFontSize} min={40} max={200} step={2}
                  onChange={v => updateFmt('titleFontSize', v)} resetVal={112} />
                <div className="mt-2">
                  <SliderRow label={`Başlık Y`} value={ov.titleOffsetY} min={-200} max={200} step={1}
                    onChange={v => updateFmt('titleOffsetY', v)} resetVal={0} />
                </div>
              </div>

              {/* Position adjustments */}
              <div>
                <div className="text-xs text-gray-500 mb-1">Pozisyon</div>
                <div className="space-y-2">
                  <SliderRow label="Tarih Y" value={ov.dateOffsetY} min={-100} max={200} step={1}
                    onChange={v => updateFmt('dateOffsetY', v)} resetVal={0} />
                  <SliderRow label="İkon Y" value={ov.iconOffsetY} min={-200} max={200} step={1}
                    onChange={v => updateFmt('iconOffsetY', v)} resetVal={0} />
                  <SliderRow label="Logo Y" value={ov.logoOffsetY} min={-200} max={450} step={1}
                    onChange={v => updateFmt('logoOffsetY', v)} resetVal={0} />
                </div>
              </div>
            </div>
          )
        })()}

        {/* Safe Area */}
        <div>
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={state.safeAreaVisible}
              onChange={e => update('safeAreaVisible', e.target.checked)}
              className="accent-gray-900"
            />
            <span className="text-xs font-bold text-gray-700">Safe Area Göster</span>
            <span className="text-xs text-gray-400">(sarı dikey çizgiler)</span>
          </label>
        </div>

        {/* Top element */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-2">Üst Element</label>
          <div className="flex gap-3">
            {(['icon', 'title', 'none'] as HelpdeskTopElement[]).map(opt => (
              <label key={opt} className="flex items-center gap-1.5 text-xs text-gray-600 cursor-pointer">
                <input
                  type="radio"
                  name="topElement"
                  value={opt}
                  checked={state.topElement === opt}
                  onChange={() => update('topElement', opt)}
                  className="accent-gray-900"
                />
                {opt === 'icon' ? 'İkon' : opt === 'title' ? 'Büyük Başlık' : 'Yok'}
              </label>
            ))}
          </div>
        </div>

        {/* Icon picker */}
        {state.topElement === 'icon' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">İkon</label>
            <IconPicker value={state.iconUrl} onChange={v => update('iconUrl', v)} />
          </div>
        )}

        {/* Big title */}
        {state.topElement === 'title' && (
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">
              Büyük Başlık <span className="font-normal text-gray-400">(Enter ile 2. satır)</span>
            </label>
            <textarea
              rows={2}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono resize-none"
              value={state.bigTitle}
              onChange={e => update('bigTitle', e.target.value)}
            />
          </div>
        )}

        {/* Body text */}
        <div>
          <label className="block text-xs font-bold text-gray-700 mb-1">İçerik Metni</label>
          <textarea
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 font-mono"
            rows={10}
            value={state.bodyText}
            onChange={e => update('bodyText', e.target.value)}
          />
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pt-2">
          <button
            onClick={handleDownloadPng}
            disabled={pngLoading}
            className="flex-1 bg-gray-900 text-white text-sm font-semibold rounded-lg py-3 hover:bg-gray-700 transition-colors disabled:opacity-50"
          >
            {pngLoading ? 'PNG hazırlanıyor...' : '⬇ PNG İndir'}
          </button>
          <button
            onClick={handleRenderVideo}
            disabled={videoLoading}
            className="flex-1 bg-white border-2 border-gray-900 text-gray-900 text-sm font-semibold rounded-lg py-3 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            {videoLoading ? 'Render ediliyor...' : '▶ Video Render'}
          </button>
        </div>

        {pngError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{pngError}</div>
        )}
        {videoError && (
          <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{videoError}</div>
        )}
        {videoId && (
          <div className="text-xs text-green-700 bg-green-50 border border-green-200 rounded-md p-3 flex items-center justify-between">
            <span>Video hazır!</span>
            <a href={`/api/download/${videoId}`} download className="underline font-semibold">İndir</a>
          </div>
        )}
      </div>

      {/* ─── Right panel: Live Preview ───────────────────────────────── */}
      <div className="flex-1 bg-gray-100 flex flex-col items-center justify-center gap-4 overflow-hidden p-6">
        <div className="text-xs text-gray-400 font-medium uppercase tracking-wide">
          {currentCategory?.label} · {state.format} · {w}×{h}
        </div>
        <div className="shadow-xl">
          <LivePreview state={state} />
        </div>
        <div className="text-xs text-gray-400">Canlı önizleme</div>
      </div>
    </div>
  )
}
