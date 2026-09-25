import { useEffect, useLayoutEffect } from 'react'
import { useLocation, useNavigationType } from 'react-router-dom'

// Scroll restoration for the whole site: going BACK returns you to where you
// were, going forward to a new page starts at the top.
//
// react-router's own <ScrollRestoration> is only available to data routers,
// and index.tsx mounts a plain <BrowserRouter>, so this does the same job by
// hand. Both pages call it; nothing else has to know.

// Keyed by `location.key`, which react-router assigns per HISTORY ENTRY — not
// by pathname. Visiting the same page twice gives two entries with two
// positions, which is what you want when going back through a chain.
const KEY = 'scroll-positions'
// sessionStorage throws in some privacy modes, so an in-memory map backs it up.
// That one is lost on reload, which only costs restoration across a refresh.
const memory = new Map<string, number>()

// Entries that have been left and must not be written to again.
//
// This exists because of one specific, non-obvious failure. Navigating from a
// tall page to a SHORT one shrinks the document, and the browser then clamps
// the scroll position — firing a real `scroll` event on the way down to 0. The
// outgoing page's listener is still attached at that moment (passive cleanup
// runs after paint), so it faithfully recorded that 0 over the position the
// reader actually left from. Measured: Home held 1379.5 while on screen and 0
// the instant a one-paragraph project page mounted, so going back landed at the
// top. It only reproduced on the SHORT project pages — the thesis page is tall
// enough not to clamp, which is exactly the kind of partial symptom that makes
// this look like a flaky restore rather than a deterministic bug.
//
// Freezing on the way out is the fix: the layout cleanup takes the last honest
// reading, and nothing can overwrite it afterwards.
const frozen = new Set<string>()

function readAll(): Record<string, number> {
  try {
    return JSON.parse(sessionStorage.getItem(KEY) || '{}')
  } catch {
    return Object.fromEntries(memory)
  }
}

function write(key: string, y: number) {
  if (frozen.has(key)) return
  memory.set(key, y)
  try {
    const all = readAll()
    all[key] = y
    // A browsing session shouldn't grow this without bound.
    const keys = Object.keys(all)
    if (keys.length > 50) delete all[keys[0]]
    sessionStorage.setItem(KEY, JSON.stringify(all))
  } catch {
    /* memory map already has it */
  }
}

export function useScrollRestore() {
  const location = useLocation()
  const navigationType = useNavigationType()

  // Record where we are as the reader scrolls, coalesced to one write a frame.
  useEffect(() => {
    const key = location.key
    frozen.delete(key)
    let frame = 0
    const onScroll = () => {
      if (frame) return
      frame = requestAnimationFrame(() => {
        frame = 0
        write(key, window.scrollY)
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [location.key])

  // The final write on the way out, and it MUST be a layout effect.
  //
  // React runs passive (useEffect) cleanup after the browser has painted,
  // which is after the incoming route's layout effect has already scrolled the
  // window to 0 — so a final `write(key, window.scrollY)` in the effect above
  // saved 0 over the real position, every time. Measured: the entry held 1379.5
  // while on the page and 0 the moment the next one mounted.
  //
  // Layout-effect cleanup for an unmounting component runs in the mutation
  // phase, before any incoming layout effect, so the position here is still
  // the one the reader left.
  useLayoutEffect(() => {
    const key = location.key
    frozen.delete(key)
    return () => {
      write(key, window.scrollY)
      frozen.add(key)
    }
  }, [location.key])

  // Before paint, so a restored position never shows as a jump from the top.
  useLayoutEffect(() => {
    if (navigationType !== 'POP') {
      window.scrollTo(0, 0)
      return
    }
    const y = readAll()[location.key]
    if (y == null) {
      window.scrollTo(0, 0)
      return
    }
    window.scrollTo(0, y)

    // Re-apply once the web font lands. The webfont arriving changes line
    // counts and therefore document height, and a scroll set against the
    // fallback font's metrics ends up in the wrong place. Harmless when the
    // font is already cached — it resolves immediately and sets the same value.
    let cancelled = false
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(() => {
      if (!cancelled) window.scrollTo(0, y)
    })
    return () => { cancelled = true }
  }, [location.key, navigationType])
}

// True when there is an earlier entry from THIS app to go back to.
// react-router stores a running index on the history entry; at 0 the only
// thing behind us is whatever site the reader came from, and sending them
// there is not what a back button inside the page should do.
export function hasAppHistory(): boolean {
  const state = window.history.state as { idx?: number } | null
  return typeof state?.idx === 'number' && state.idx > 0
}
