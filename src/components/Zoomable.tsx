import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, MouseEvent, PointerEvent, ReactNode } from 'react'
import './../styling/components/Zoomable.css'

// A click-to-magnify wrapper for the paper pages' figures and the About
// gallery's photos. Hovering a picture shows the zoom-in cursor; a click opens
// a rectangular lens on that spot that follows the pointer until the next
// click, Esc, or the pointer leaving.
//
// It wraps rather than replaces the <img>, so a figure and the carousel frame
// share one implementation. The lens samples the SAME file the page already
// loaded (`currentSrc`), so there is no second request. See docs/paper-pages.md.

// 485x340: three times the area of the original 280x196, which is about 1.73x
// each way. It is a CEILING — the lens never takes more than LENS_FILL of the
// visible picture, so in the About gallery's 344px frame it is capped by the
// frame (~310px wide), not by this.
const LENS_MAX_W = 485
const LENS_RATIO = 0.7
const LENS_FILL = 0.9
// Magnify to the file's own pixels (so a crisp source is shown 1:1), but never
// less than 2x — an 854px screenshot drawn at 900px would otherwise "zoom" by
// nothing — and never so far that it is only grain.
const ZOOM_MIN = 2
const ZOOM_MAX = 4

// Where the picture is actually DRAWN, in viewport coordinates, and which part
// of it is VISIBLE. Not the <img>'s box: `.paper-figure img` carries 12px of
// padding and the carousel's slides are `object-fit: contain` inside a frame,
// so both leave a margin that is part of the element and not of the picture.
// `contain` is exact for the plain width:100%/height:auto case too, where the
// ratios already match. The About gallery is the opposite case — `cover` in a
// square frame — where the picture overshoots the box and the visible part is
// only a window onto it, positioned by `object-position`.
function drawnRect(img: HTMLImageElement) {
  const r = img.getBoundingClientRect()
  const cs = getComputedStyle(img)
  const pl = parseFloat(cs.paddingLeft) || 0
  const pt = parseFloat(cs.paddingTop) || 0
  const bw = r.width - pl - (parseFloat(cs.paddingRight) || 0)
  const bh = r.height - pt - (parseFloat(cs.paddingBottom) || 0)
  const { naturalWidth: nw, naturalHeight: nh } = img
  if (!nw || !nh || bw <= 0 || bh <= 0) return null
  const cover = cs.objectFit === 'cover'
  const s = cover ? Math.max(bw / nw, bh / nh) : Math.min(bw / nw, bh / nh)
  const w = nw * s
  const h = nh * s
  // Computed `object-position` is `50% 0%` for `center top`. Anything not in
  // percent (a length) falls back to centred, which no image here uses.
  const [ox, oy] = cs.objectPosition
    .split(' ')
    .map((v) => (v.endsWith('%') ? parseFloat(v) / 100 : 0.5))
  const left = r.left + pl + (bw - w) * ox
  const top = r.top + pt + (bh - h) * oy
  return {
    left,
    top,
    w,
    h,
    nw,
    // The part you can see: the drawn picture clipped to the element's box.
    vl: Math.max(left, r.left + pl),
    vt: Math.max(top, r.top + pt),
    vr: Math.min(left + w, r.left + pl + bw),
    vb: Math.min(top + h, r.top + pt + bh),
  }
}

function Zoomable({
  children,
  className,
  style,
  resetKey,
}: {
  children: ReactNode
  className?: string
  style?: CSSProperties
  // A change closes the lens. The carousel passes its slide index: the picture
  // under the lens is the one that just slid away.
  resetKey?: unknown
}) {
  const rootRef = useRef<HTMLDivElement>(null)
  const lensRef = useRef<HTMLDivElement>(null)
  const imgRef = useRef<HTMLImageElement | null>(null)
  const last = useRef({ x: 0, y: 0 })
  const kind = useRef('mouse')
  const [on, setOn] = useState(false)

  const close = useCallback(() => {
    imgRef.current = null
    setOn(false)
  }, [])

  // Imperative on purpose: this runs on every pointer move, and a re-render per
  // move for a div whose only changes are five style properties buys nothing.
  const place = useCallback(() => {
    const img = imgRef.current
    const lens = lensRef.current
    const root = rootRef.current
    if (!img || !lens || !root) return
    const d = drawnRect(img)
    const { x, y } = last.current
    // The lens only exists over the VISIBLE picture — not the plate, the
    // letterbox or the part a `cover` crop hides — so it never magnifies a
    // margin or something the reader cannot see.
    if (!d || x < d.vl || x > d.vr || y < d.vt || y > d.vb) {
      lens.style.display = 'none'
      return
    }
    const vw = d.vr - d.vl
    const vh = d.vb - d.vt
    const z = Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, d.nw / d.w))
    const lw = Math.round(Math.min(LENS_MAX_W, vw * LENS_FILL))
    const lh = Math.round(Math.min(lw * LENS_RATIO, vh * LENS_FILL))
    // The magnified spot is clamped so the window never runs off the visible
    // picture into empty space; the lens itself still sits centred on the
    // pointer.
    const px = Math.min(d.vr - lw / 2 / z, Math.max(d.vl + lw / 2 / z, x)) - d.left
    const py = Math.min(d.vb - lh / 2 / z, Math.max(d.vt + lh / 2 / z, y)) - d.top
    const rr = root.getBoundingClientRect()
    const s = lens.style
    s.display = 'block'
    s.width = `${lw}px`
    s.height = `${lh}px`
    s.left = `${x - rr.left - lw / 2}px`
    s.top = `${y - rr.top - lh / 2}px`
    s.backgroundImage = `url("${img.currentSrc || img.src}")`
    s.backgroundSize = `${d.w * z}px ${d.h * z}px`
    s.backgroundPosition = `${lw / 2 - px * z}px ${lh / 2 - py * z}px`
  }, [])

  useLayoutEffect(() => {
    if (on) place()
  }, [on, place])

  useEffect(() => {
    close()
  }, [resetKey, close])

  // Only while open: Esc, a press elsewhere, and scrolling. On a mouse the lens
  // is re-aimed at the same viewport point (the page moved under a still
  // pointer); on touch there is no pointer to re-aim, so it just closes.
  useEffect(() => {
    if (!on) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && close()
    const onDown = (e: Event) => {
      if (!rootRef.current?.contains(e.target as Node)) close()
    }
    const onScroll = () => (kind.current === 'touch' ? close() : place())
    document.addEventListener('keydown', onKey)
    document.addEventListener('pointerdown', onDown)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      document.removeEventListener('keydown', onKey)
      document.removeEventListener('pointerdown', onDown)
      window.removeEventListener('scroll', onScroll)
    }
  }, [on, close, place])

  const onClick = (e: MouseEvent) => {
    // Only the picture itself: the carousel's counter lives in the same frame.
    if (!(e.target instanceof HTMLImageElement)) return
    last.current = { x: e.clientX, y: e.clientY }
    // A mouse click closes an open lens. A tap MOVES it instead — there is no
    // hover to follow, so tapping the picture again is how it is re-aimed.
    if (imgRef.current && kind.current !== 'touch') return close()
    imgRef.current = e.target
    setOn(true)
    place()
  }

  const onPointerMove = (e: PointerEvent) => {
    kind.current = e.pointerType
    if (!imgRef.current || e.pointerType === 'touch') return
    last.current = { x: e.clientX, y: e.clientY }
    place()
  }

  return (
    <div
      ref={rootRef}
      className={`zoomable${on ? ' zoomable-on' : ''}${className ? ` ${className}` : ''}`}
      style={style}
      onClick={onClick}
      onPointerDown={(e) => (kind.current = e.pointerType)}
      onPointerMove={onPointerMove}
      onPointerLeave={(e) => e.pointerType !== 'touch' && close()}
    >
      {children}
      {on && <div ref={lensRef} className="zoom-lens" aria-hidden="true" />}
    </div>
  )
}

export default Zoomable
