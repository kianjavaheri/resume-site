import { useEffect, useRef } from 'react'

/**
 * Drives the line across the bottom of a reading page's top bar. Returns a ref
 * to put on the line itself.
 *
 * It writes `transform` straight to the node instead of holding the fraction in
 * state: this updates on every scroll frame, and a `setState` there would
 * re-render the whole paper — the thesis page is 20,478px of content. `scaleX`
 * on a composited transform is the same call `.nav::after` makes for the docked
 * hairline, and costs nothing per frame.
 *
 * The page's height is observed as well as measured, because expanding the
 * abstract gate puts a whole document on the page without firing a resize —
 * the same reason the nav's dock watches `body` with a ResizeObserver.
 */
export function useReadingProgress() {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const update = () => {
      const doc = document.documentElement
      const scrollable = doc.scrollHeight - window.innerHeight
      // A page with nothing to scroll gets no line at all. A full bar on a
      // page that was never scrolled would be claiming something false.
      const fraction = scrollable > 8 ? Math.min(1, Math.max(0, window.scrollY / scrollable)) : 0
      el.style.transform = `scaleX(${fraction})`
    }

    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    const ro = new ResizeObserver(update)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
      ro.disconnect()
    }
  }, [])

  return ref
}
