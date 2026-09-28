import { useCallback, useEffect, useRef, useState } from 'react'

/* Advances a carousel on a timer, for both sliders on the site.
 *
 * Autoplay is content that moves without being asked, which is a real
 * accessibility hazard rather than a style choice, so this stops in five
 * situations and every one of them matters:
 *
 * 1. **`prefers-reduced-motion: reduce`** — off entirely. The About gallery
 *    already downgrades its slide to a fade under that setting; a fade every
 *    six seconds, unbidden, is still the thing the setting is asking us not
 *    to do.
 * 2. **The reader took over.** One click on an arrow or a dot and the timer
 *    never runs again for that carousel. Someone steering it does not want
 *    the thing moving under them a moment later, and WCAG 2.2.2 wants a way
 *    to stop auto-updating content — this is it, and it needs no extra
 *    control in the bar.
 * 3. **Pointer or keyboard focus is inside it.** Reading a label or aiming at
 *    a dot should not be a race.
 * 4. **The carousel is off screen.** An IntersectionObserver, because every
 *    carousel on the paper pages starts below the fold and there is no point
 *    cycling — or, in the gallery's case, fetching — pictures nobody is
 *    looking at.
 * 5. **The tab is hidden.** The interval would otherwise queue up advances to
 *    fire in a burst on return. (The gallery's own `preload()` documents the
 *    same hidden-tab trap from the other side: `decode()` never settles
 *    there.)
 *
 * A single slide never animates at all, whatever the settings.
 */

/** Six seconds: long enough to read a figure's label, short enough that a
 *  three-photo gallery gets round itself while someone is still on the page.
 *  One value for both callers, so the two sliders stay one register. */
export const AUTOPLAY_MS = 6000

export function useCarouselAutoplay({
  count,
  advance,
  intervalMs = AUTOPLAY_MS,
}: {
  count: number
  /** Called to move on by one. Wrapping is the caller's business. */
  advance: () => void
  intervalMs?: number
}) {
  const [hovered, setHovered] = useState(false)
  const [visible, setVisible] = useState(false)
  const [takenOver, setTakenOver] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  // Held in a ref so a changing closure doesn't restart the interval on every
  // render — the timer should keep its own phase, not reset each time the
  // slide index changes.
  const advanceRef = useRef(advance)
  advanceRef.current = advance

  /** Call from any control the reader can operate. Permanent, by design. */
  const takeOver = useCallback(() => setTakenOver(true), [])

  useEffect(() => {
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      setVisible(true)
      return
    }
    const io = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      // Any sliver on screen counts: a carousel taller than the viewport
      // would never reach a higher threshold.
      { threshold: 0 }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (count < 2 || takenOver || hovered || !visible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let id = 0
    const start = () => {
      window.clearInterval(id)
      id = window.setInterval(() => advanceRef.current(), intervalMs)
    }
    const onVisibility = () => {
      if (document.visibilityState === 'hidden') window.clearInterval(id)
      else start()
    }

    if (document.visibilityState === 'visible') start()
    document.addEventListener('visibilitychange', onVisibility)
    return () => {
      window.clearInterval(id)
      document.removeEventListener('visibilitychange', onVisibility)
    }
  }, [count, takenOver, hovered, visible, intervalMs])

  return {
    rootRef,
    takeOver,
    /* Spread onto the carousel's outermost element. `focusin`/`focusout`
       rather than `focus`/`blur`, because focus landing on a dot inside it
       has to count as focus in the carousel. */
    pauseProps: {
      onMouseEnter: () => setHovered(true),
      onMouseLeave: () => setHovered(false),
      onFocus: () => setHovered(true),
      onBlur: () => setHovered(false),
    },
  }
}
