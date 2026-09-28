import { useEffect, useState } from 'react'

/* The site's main breakpoint, as a boolean a component can branch on.
 *
 * It exists because two components need to change their BEHAVIOUR and not just
 * their styling at 768px, which a media query alone cannot do:
 *
 * - `FigureChart` swaps its whole geometry (the mobile block sets a larger
 *   viewBox font-size, and the gutters have to grow with it or the labels
 *   collide). It owned this logic first; this is that hook, lifted out.
 * - `Proficiency` hides the skill names on a phone and reveals one at a time
 *   on tap, so the tiles have to become real controls — and a tile that is a
 *   button on desktop, where the name is already printed under it, would be a
 *   control that does nothing.
 *
 * The 768 matches `Nav.css`, `Paper.css` and `Proficiency.css`, so the
 * behaviour and the styling always switch together. Keep them in step.
 */
export function useIsMobile() {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 768px)').matches
  )

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setIsMobile(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return isMobile
}
