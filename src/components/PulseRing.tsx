import { useEffect, useRef } from 'react'
import '../styling/components/PulseRing.css'

/* THE DISTORTED RING BEHIND THE ABOUT CARD.
 *
 * A closed loop whose radius is modulated by a handful of angular harmonics,
 * drawn many times over at slightly offset moments so the recent past of the
 * path is still on screen. The overlapping copies are what make the sheets
 * and the ribbon look: where the loop is moving fast the copies fan out into
 * a translucent surface, where it is nearly still they stack into one dark
 * line. It breathes between almost-a-circle and a spiked, self-crossing
 * tangle on a slow cycle.
 *
 * IT REPLACES <DotGrid />, WHICH IS STILL IN THE REPO. See DotGrid.tsx — it
 * is kept deliberately, not left behind by accident.
 *
 * Like the dot grid it is purely decoration. If the canvas fails to get a 2D
 * context the card renders exactly as it would have anyway, and nothing on
 * the page reads any state from here.
 *
 * AMBIENT ONLY — it does not track the pointer, which is Kian's call and the
 * behaviour in the reference recording. That also keeps it clear of the rule
 * that gives the About card no hover affordance: the card's header is static,
 * so a response to the cursor would be a promise the card can't keep. The dot
 * grid argued its way around that by never pointing at a control; this one
 * doesn't need the argument.
 */

/* THE LOOP HAS TO CLOSE, WHICH CONSTRAINS `m` TO INTEGERS.
 *
 * The radius is 1 + Σ a·sin(m·θ + w·t + p). At θ = 2π every term has to land
 * back where it was at θ = 0, and sin(m·2π + x) === sin(x) only when m is a
 * whole number. A fractional m leaves a step at the seam — a visible notch
 * where the path fails to meet itself, which is exactly the kind of thing
 * that reads as a rendering bug rather than as a design.
 *
 * They are also chosen to share no common factor. With, say, 2/4/6 the lobes
 * line up every half turn and the figure looks mirrored; 2/3/5/7 never
 * repeats inside one revolution, so the distortion reads as irregular.
 *
 * `w` is the term's own drift, in radians per second, and the SIGNS ALTERNATE
 * on purpose: harmonics all turning the same way slide across each other as
 * one moiré, where counter-rotating ones fold into and out of each other.
 * They are deliberately not round multiples of one another, so the whole
 * figure has no period short enough to notice.
 */
const HARMONICS = [
  { m: 2, a: 0.095, w: 0.95, p: 0.0 },
  { m: 3, a: 0.07, w: -0.71, p: 1.7 },
  { m: 5, a: 0.052, w: 0.53, p: 3.9 },
  { m: 7, a: 0.036, w: -0.38, p: 5.2 },
  { m: 11, a: 0.019, w: 0.27, p: 2.3 },
]

// Points per revolution. The loop is stroked as straight segments between
// them, so this is the only thing standing between the curve and a polygon —
// at 192 the longest segment on the biggest ring here is under 2px, which is
// below what the 1px stroke can show.
const SAMPLES = 192

/* THE TRAIL IS COMPUTED, NOT RECORDED.
 *
 * The obvious way to leave a trail is to keep the last N paths in a ring
 * buffer, or to fade the canvas by drawing a translucent rectangle over it
 * each frame. Both were rejected:
 *
 * - A buffer of paths ties the trail's LENGTH IN TIME to the frame rate, so
 *   the figure would look different on a 120Hz display than on a 60Hz one —
 *   the same bug the dot grid's frame-rate-independent easing exists to
 *   avoid.
 * - Fading the canvas with a translucent fill never reaches zero. The residue
 *   floors at the rounding of 8-bit alpha and leaves a permanent grey smear,
 *   and it also tints the whole card rather than only where the path went.
 *
 * Sampling the path's own function at t − k·TRAIL_DT has neither problem: it
 * is a pure function of time, so it is identical at any frame rate, it starts
 * correct on the very first frame instead of building up over a second, and
 * it costs nothing to keep.
 */
const TRAIL = 64
const TRAIL_DT = 0.06 // seconds between successive copies
// Alpha falls off as (1 − k/TRAIL)^FALLOFF. Above 1 this front-loads the
// weight, so the newest few copies carry the dark leading line and the rest
// thin out fast into sheets. At 1 (linear) the trail reads as a uniform
// smear with no leading edge at all.
const FALLOFF = 3.0
const HEAD_A = 0.13 // alpha of the newest copy, before the theme's scale

/* THE BREATH.
 *
 * `ENERGY_*` scales every harmonic together, so the figure travels between
 * nearly a circle and a spiked tangle. It is the "pulsing" in the brief, and
 * it is a slow cosine rather than anything noisier because the interesting
 * variety already comes from the harmonics drifting against each other — a
 * second irregular signal on top of that just reads as jitter.
 *
 * It never reaches 0. A perfect circle sitting in the middle of the cycle
 * looks like the animation has stalled, and a viewer who arrives at that
 * moment has no way to tell that it hasn't.
 *
 * THE RANGE IS NARROW ON PURPOSE, and it is narrow for a size reason rather
 * than a motion one. The figure is fitted so that its LOUDEST moment clears
 * the band, so a wide range spends most of the available room on a peak that
 * is rarely on screen and leaves the quiet end drawing a small plain circle
 * in a large gap. It was 0.3–2.2 and did exactly that. At 0.72–1.6 the
 * quiet end is still visibly lobed and the base radius is about 20% larger.
 */
const ENERGY_MIN = 0.72
const ENERGY_MAX = 1.6
const ENERGY_PERIOD = 17 // seconds

// The whole figure turns slowly. Applied to the POSITION angle only, not to
// the harmonics' own argument — rotating both would just re-phase the shape
// in place and nothing would appear to turn.
const SPIN = 0.16 // radians per second

/* THE FIGURE IS FITTED TO THE CARD'S OPEN BAND, NOT PLACED BY FRACTIONS.
 *
 * It first sat at fixed fractions of the card and that was wrong in a way
 * fractions cannot fix: the band of clear space runs from the bottom of the
 * content area to the top of the contact row, and its height is CONTENT-
 * DRIVEN — the copy's height is fixed but the card's is a viewport, so the
 * band is 191px at 1024x768 and roughly three times that at 1200 tall. Any
 * constant is therefore right at exactly one window size. Measured at 1024,
 * the old 0.29 of the short side put a 286px-diameter ring in a 191px gap,
 * which is why it ran over the bio and the gallery photo.
 *
 * `above` and `below` are selectors rather than numbers so the component
 * stays general and knows nothing about About's class names — the same call
 * DotGrid's `shelter` prop makes.
 */
/* How much of the band the figure is allowed to fill, AT ITS LOUDEST.
 *
 * The fit divides by `PEAK_FACTOR` below, so this is measured against the
 * widest the figure ever gets rather than against its base radius. It is 1
 * because the band is now measured to the DRAWN content with `BAND_INSET`
 * taken off each end, so there is no slack left over to borrow.
 *
 * SIZE THIS AGAINST THE PEAK, NOT AGAINST A FRAME YOU HAPPENED TO LOOK AT.
 * Judging it by eye from one screenshot put it at 0.9 of the band's
 * half-height as a BASE radius, which at peak energy reached 137px against
 * the 102px actually available and would have run over the gallery photo and
 * the contact icons — on a cycle slow enough that a casual look never caught
 * it. The same trap the dot grid's idle pulse documents.
 */
const BAND_FIT = 1
// Breathing room at each end of the band, in px. Small and explicit, because
// the band is now measured to the drawn content and there is no padding left
// to borrow at the bottom — the contact icons begin exactly on their row's
// top edge.
const BAND_INSET = 10
/* A ceiling as a fraction of the card's width, for the tall-viewport case
 * where the band alone would let the figure grow past the card's sides. Like
 * BAND_FIT it is measured against the PEAK, so this is half the widest the
 * figure ever gets — 0.22 puts its loudest moment at a little under half the
 * card's width. At 1024x768 it is slack and the band binds; on a 1050px-tall
 * card it is what binds instead. */
const MAX_RADIUS_FRAC = 0.22
// Used only when the band selectors resolve to nothing.
const RADIUS_FRAC = 0.2

type Props = {
  /* Held for the reduced-motion case: with no animation the figure is drawn
     once, and this is the moment it is drawn at. Any fixed value does, but a
     non-zero one avoids the instant where every harmonic's phase is its own
     `p` and the shape is at its most regular. */
  staticAt?: number
  /* The blocks the figure sits between, vertically. Each is a selector that
     may match SEVERAL elements — `above` takes the lowest bottom edge it
     finds and `below` the highest top edge, so the band is the gap between
     the real content on either side rather than between two wrappers. That
     matters: About's content area ends 36px below the last thing drawn in
     it, and its contact row starts exactly ON the icons with no padding at
     all, so measuring the wrappers threw away room at one end and claimed
     room that wasn't there at the other. Either may be absent, in which case
     that side of the band is the host's own edge. */
  above?: string
  below?: string
  /* The element whose horizontal centre the figure sits on. Defaults to the
     host's own centre. About passes its TEXT COLUMN, not the card: the card's
     centre falls in the gap between the bio and the gallery, which is the
     same reason `.about-social` centres its icons on the text column rather
     than on itself. The figure and the icons then share one vertical axis
     and read as one stack down the card's left half. */
  centreOn?: string
}

function PulseRing({ staticAt = 4.2, above, below, centreOn }: Props) {
  const hostRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = hostRef.current
    // MEASURE THE HOST, NOT THE CANVAS. `layout` gives the canvas an explicit
    // inline width and height, which from that moment on is what its own
    // bounding rect reports — so measuring itself is circular and it latches
    // at the 300x150 a canvas defaults to. The card is the thing whose size
    // actually means something here, and it is also what the ResizeObserver
    // has to watch: the canvas's box never changes on its own.
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let w = 0
    let h = 0
    // The fitted geometry, recomputed on layout. Held here rather than worked
    // out inside strokeAt, which runs 64 times a frame.
    let cx = 0
    let cy = 0
    let radius = 0
    let ink = 'rgb(0,0,0)'
    let alphaScale = 1
    let raf = 0

    // The pulse runs only when all three hold — the same three gates the dot
    // grid uses, and for the same reason: this animates with nothing asked of
    // it, so an ungated rAF is a battery draw on a tab someone has left open.
    let live = false // not prefers-reduced-motion
    let onScreen = false
    let tabVisible = document.visibilityState === 'visible'
    const running = () => live && onScreen && tabVisible

    /* A 2D context cannot resolve a custom property, so the two things that
       vary with the theme are read off the element's computed style. `color`
       carries the ink; the alpha scale has to come through as a named custom
       property because no ordinary CSS property means "how opaque should this
       canvas draw".

       THE ALPHA SCALE IS NOT COSMETIC. In dark the ink is white on a card at
       rgb(16,16,18), where the same alphas that read as ink on a light card
       composite to a faint grey — the same trap the dot grid hit, documented
       at --dot-grid-alpha-scale. */
    const readPaint = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.color || 'rgb(0,0,0)'
      const raw = parseFloat(cs.getPropertyValue('--ring-alpha-scale'))
      alphaScale = Number.isFinite(raw) && raw > 0 ? raw : 1
    }

    /* Where the figure goes: centred in the gap between `above` and `below`,
       and sized to it. Falls back to the host's own box when neither selector
       resolves, so the component still draws something sensible if it is ever
       mounted somewhere without them. */
    /* The most the radius is ever multiplied by. Derived from the constants
       rather than written down, so changing a harmonic's amplitude or the
       energy ceiling cannot silently make the figure outgrow its band. It is
       the all-aligned worst case, which is rare — that is what BAND_FIT's
       margin over 1 is spending. */
    const PEAK_FACTOR =
      1 + ENERGY_MAX * HARMONICS.reduce((sum, harm) => sum + harm.a, 0)

    const fit = () => {
      const hostRect = host.getBoundingClientRect()
      const found = (sel: string | undefined) =>
        sel ? Array.from(host.querySelectorAll(sel)) : []
      const aboveEls = found(above)
      const belowEls = found(below)

      // The lowest thing above the gap, and the highest thing below it.
      const top = aboveEls.length
        ? Math.max(
            ...aboveEls.map((el) => el.getBoundingClientRect().bottom),
          ) - hostRect.top
        : 0
      const bottom = belowEls.length
        ? Math.min(...belowEls.map((el) => el.getBoundingClientRect().top)) -
          hostRect.top
        : h

      const band = Math.max(1, bottom - top - BAND_INSET * 2)
      const axis = centreOn ? host.querySelector(centreOn) : null
      if (axis) {
        const a = axis.getBoundingClientRect()
        cx = (a.left + a.right) / 2 - hostRect.left
      } else {
        cx = w / 2
      }
      cy = top + BAND_INSET + band / 2
      radius = Math.min(
        ((band / 2) * BAND_FIT) / PEAK_FACTOR,
        (w * MAX_RADIUS_FRAC) / PEAK_FACTOR,
      )
      // Nothing resolved and the host is the whole card: fall back to a plain
      // fraction rather than drawing a ring the size of the card.
      if (!aboveEls.length && !belowEls.length) {
        radius = Math.min(w, h) * RADIUS_FRAC
      }
    }

    // One copy of the loop, at absolute time `t`.
    const strokeAt = (t: number, alpha: number) => {
      const R = radius
      const phase = (t % ENERGY_PERIOD) / ENERGY_PERIOD
      const energy =
        ENERGY_MIN +
        (ENERGY_MAX - ENERGY_MIN) * (0.5 - 0.5 * Math.cos(phase * Math.PI * 2))
      const spin = SPIN * t

      ctx.globalAlpha = alpha
      ctx.beginPath()
      for (let i = 0; i <= SAMPLES; i++) {
        // `i === SAMPLES` repeats θ = 0 rather than calling closePath(). The
        // final segment then goes through the identical vertex the path
        // started from, which is what makes the join at the seam render the
        // same as every other join instead of as a slight kink.
        const theta = ((i % SAMPLES) / SAMPLES) * Math.PI * 2
        let d = 0
        for (const harm of HARMONICS) {
          d += harm.a * Math.sin(harm.m * theta + harm.w * t + harm.p)
        }
        const r = R * (1 + energy * d)
        const ang = theta + spin
        const x = cx + r * Math.cos(ang)
        const y = cy + r * Math.sin(ang)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.stroke()
    }

    const paint = (t: number) => {
      ctx.clearRect(0, 0, w, h)
      ctx.strokeStyle = ink
      ctx.lineWidth = 1
      ctx.lineJoin = 'round'
      ctx.lineCap = 'round'
      // Oldest first, so the newest copy lands on top and reads as the
      // leading edge rather than being buried under its own history.
      for (let k = TRAIL - 1; k >= 0; k--) {
        const fade = Math.pow(1 - k / TRAIL, FALLOFF)
        const a = HEAD_A * fade * alphaScale
        if (a <= 0.002) continue
        strokeAt(t - k * TRAIL_DT, Math.min(1, a))
      }
      ctx.globalAlpha = 1
    }

    const frame = () => {
      // Absolute time, not an accumulator: after a scroll, a tab switch or a
      // gate closing and reopening the figure resumes where the clock says it
      // should be instead of snapping back to where it was suspended.
      paint(performance.now() / 1000)
      raf = requestAnimationFrame(frame)
    }

    const sync = () => {
      if (running()) {
        if (!raf) raf = requestAnimationFrame(frame)
      } else if (raf) {
        cancelAnimationFrame(raf)
        raf = 0
      }
    }

    const layout = () => {
      const r = host.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      // Capped at 2, as the dot grid's is: past that the backing store grows
      // faster than anyone can see on a 1px stroke.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      fit()
      // Re-read here, not only on mount. The dot grid learned this the hard
      // way: reading the paint tokens once meant a change to them resolved in
      // CSS and then never reached the canvas.
      readPaint()
      // Repaint immediately. While the loop is suspended — off screen, hidden
      // tab, reduced motion — nothing else will.
      paint(running() ? performance.now() / 1000 : staticAt)
    }

    layout()

    const ro = new ResizeObserver(layout)
    ro.observe(host)

    // The band is measured between two blocks of text, so the web font
    // arriving moves it. The ResizeObserver catches the card's own height
    // changing but not the content area's, which is inside it.
    let live_fonts = true
    document.fonts?.ready.then(() => {
      if (live_fonts) layout()
    })

    // The ink follows the theme with no reload. `data-theme` is mirrored onto
    // <html> by the pre-paint script and by useTheme, so that is what to
    // watch.
    const mo = new MutationObserver(() => {
      readPaint()
      paint(running() ? performance.now() / 1000 : staticAt)
    })
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    })

    // threshold 0, deliberately. The About card is a viewport tall, so a
    // higher threshold would never fire for it.
    const io = new IntersectionObserver(
      (entries) => {
        onScreen = entries[0]?.isIntersecting ?? false
        sync()
      },
      { threshold: 0 },
    )
    io.observe(canvas)

    const onVisibility = () => {
      tabVisible = document.visibilityState === 'visible'
      sync()
    }
    document.addEventListener('visibilitychange', onVisibility)

    /* WATCHED, NOT READ ONCE. Someone turning reduced motion on should stop an
       animation that is already running, and the figure still RENDERS when it
       is on — a static drawing is not motion, so suppressing it outright would
       take away more than the setting asks for. */
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const onMotion = () => {
      live = !mq.matches
      sync()
      if (!live) paint(staticAt)
    }
    mq.addEventListener('change', onMotion)
    onMotion()

    return () => {
      live_fonts = false
      if (raf) cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      mq.removeEventListener('change', onMotion)
    }
  }, [staticAt])

  return <canvas ref={hostRef} className="pulse-ring" aria-hidden="true" />
}

export default PulseRing
