import { useCallback, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

// Used by the Experience cards — a card starts clamped to `lines` lines of its
// first text block and expands in place. It drove the Projects rows too until
// those became always-open grid tiles, so there is one caller now.
//
// Markup is two boxes — an outer one taking `clampClass` + `style`, around an
// inner wrapper taking `innerRef`. The inner wrapper is what gets measured and
// observed: it keeps its natural height inside the clamped box, so any reflow
// (a resize, the web font arriving) fires the observer.
export function useClampedExpand(lines = 2) {
  const innerRef = useRef<HTMLDivElement>(null)
  const [open, setOpen] = useState(false)
  const [m, setM] = useState<{ line: number; full: number } | null>(null)

  const measure = useCallback(() => {
    const inner = innerRef.current
    if (!inner) return
    // The preview is counted in lines of the first child, so lead with the text.
    const cs = getComputedStyle((inner.firstElementChild as HTMLElement | null) ?? inner)
    const lh = parseFloat(cs.lineHeight)
    const line = Number.isNaN(lh) ? parseFloat(cs.fontSize) * 1.4 : lh
    setM({ line, full: inner.offsetHeight })
  }, [])

  useLayoutEffect(() => {
    measure()
    const ro = new ResizeObserver(measure)
    if (innerRef.current) ro.observe(innerRef.current)
    return () => ro.disconnect()
  }, [measure])

  const canExpand = m !== null && m.full > m.line * lines + 1
  const expanded = open && canExpand

  // Measured again at click time: the observer can lag a resize by a frame,
  // and opening to a stale height would clip the text.
  const toggle = () => {
    measure()
    setOpen((o) => !o)
  }

  // No inline max-height until measured. `none` → length doesn't transition,
  // so the first measurement never visibly animates the card shut on load.
  const style = canExpand
    ? ({
        maxHeight: expanded ? m!.full : m!.line * lines,
        '--clamp-line': `${m!.line}px`,
      } as CSSProperties)
    : undefined

  const clampClass = `clamp ${canExpand && !expanded ? 'clamp-faded' : ''}`

  return { innerRef, expanded, canExpand, toggle, style, clampClass }
}
