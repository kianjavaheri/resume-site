import { useEffect, useRef } from 'react'
import './../styling/components/DotGrid.css'

/* An ambient field of dots behind a card. Dots near the pointer swell and
 * brighten, falling off with distance; the rest sit as quiet texture.
 *
 * It is decorative and nothing depends on it — `aria-hidden`, no keyboard
 * surface, `pointer-events: none` so it never intercepts a click meant for a
 * button or a link underneath. If the canvas fails to acquire a context the
 * effect simply returns and the card renders exactly as it did before.
 *
 * WHY A CANVAS AND NOT ELEMENTS. At a 24px pitch the About card holds well
 * over a thousand dots once it is a viewport tall. That many DOM nodes, each
 * with its own transform, is a layout and compositing cost for decoration —
 * and this sits directly under a `backdrop-filter` nav bar that already
 * re-rasterises on every scroll frame.
 *
 * **It responds to the pointer, and that does NOT contradict "About has no
 * hover tint".** That rule exists because a tint on a card whose header does
 * nothing reads as "click me" — a promise the card can't keep. This is ambient
 * motion under the content, not an affordance: it follows the cursor anywhere
 * on the card, including over dead space, so it never points at a control.
 */

const PITCH = 18 // px between dots
const BASE_R = 1 // px radius at rest
const PEAK_R = 3.4 // px radius directly under the pointer
/* THE THREE ALPHAS ARE LIGHT MODE'S, AND DARK SCALES THEM.
 *
 * They were one set for both themes, and in dark that was wrong in a way the
 * hex alone hides: the ink there is pure #ffffff, but 0.11 of it over the
 * card's rgb(16,16,18) composites to rgb(44,44,46) — so the dots rendered
 * GREY on a canvas whose ink is white. Kian read that as the colour being
 * wrong; it is the opacity.
 *
 * The fix is a single per-theme multiplier, `--dot-grid-alpha-scale`, rather
 * than three separate tokens: rest, pulse and peak were tuned against each
 * other (the pulse is deliberately much shallower than the hover, which is
 * what makes the hover feel like a response), and scaling them together is
 * the only way to raise the field without spending that relationship. It is
 * clamped at 1 per value, so a large scale flattens the top of the range
 * before it flattens the bottom. */
const BASE_A = 0.11 // alpha at rest, before shelter
const PEAK_A = 0.5
const INFLUENCE = 130 // px — how far the pointer reaches
/* HOW THE FIELD GETS OUT OF THE COPY'S WAY.
 *
 * A dot is dark until `SHELTER_DEAD` px from the nearest content box and
 * reaches full strength `SHELTER_RAMP` px after that. The ramp is LINEAR, not
 * smoothstepped, and that is deliberate: smoothstep is flat at both ends, so
 * it crams the whole visible transition into the middle two rows and the eye
 * reads those as an edge. Linear spreads it evenly — at a 24px pitch this is
 * about six rows, each a sixth brighter than the one above.
 *
 * `SHELTER_JITTER` is the important one, though. However long the ramp, every
 * dot at the same distance gets the same weight, so the field's boundary is a
 * clean iso-contour of a rectangle — which is exactly what reads as "a hard
 * rectangle border". A deterministic per-dot offset breaks the contour up so
 * the edge dissolves into noise instead of drawing itself.
 */
const SHELTER_DEAD = 10
const SHELTER_RAMP = 140
const SHELTER_JITTER = 0.26
// The field is inset from the card's LEFT AND RIGHT edges: it was creeping up
// both sides in the gutter beside the copy, which read as the grid escaping
// the card rather than sitting in it. Zero until `EDGE_INSET` (the card's own
// --about-gutter) and full `EDGE_FADE` further in.
//
// Top and bottom are deliberately NOT inset. The header and the copy already
// shelter the top, and fading the bottom would take the dots out from around
// the contact icons — which is the one place Kian asked for them.
const EDGE_INSET = 24
const EDGE_FADE = 120
// How much of the bloom survives in a fully sheltered spot. The pointer's OWN
// weight scales the whole effect (see weightAt), so without a floor hovering
// beside the copy would do nothing at all rather than doing less.
const POINTER_FLOOR = 0.15

/* THE IDLE PULSE — a band of brightness sweeping down the card.
 *
 * Deliberately much shallower than the hover: 1.9px / .24 alpha against the
 * pointer's 3.4 / .5, so it reads as the field breathing rather than as
 * something animating at you. What makes the hover feel responsive is that
 * everything else is still, and a loud pulse would spend that.
 *
 * The cycle SWEEPS for 62% of its length and then rests. A band that never
 * stops is an animation; one that arrives, passes and leaves is a pulse — and
 * the rest is also free, because a frame with no band and no pointer does no
 * canvas work at all (see `restPainted`).
 */
// How long after the last pointer move the field still counts as "being
// used". Comfortably longer than the gap between pointermove events on a
// slowly dragged mouse, which is the whole point of holding rather than
// decaying from each event.
const ACTIVITY_HOLD = 450
const PULSE_CYCLE = 5000 // ms, sweep + rest
const PULSE_SWEEP = 0.62 // fraction of the cycle the band is travelling
const PULSE_BAND = 120 // px, half-height of the band
const PULSE_R = 1.9
const PULSE_A = 0.24

const TAU = Math.PI * 2

const smoothstep = (u: number) => u * u * (3 - 2 * u)
const clamp01 = (u: number) => (u < 0 ? 0 : u > 1 ? 1 : u)
// Deterministic per-cell noise in 0..1. Same grid position always gives the
// same value, so the field does not shimmer when it is rebuilt on a resize.
const hash = (i: number, j: number) => {
  const n = Math.sin(i * 127.1 + j * 311.7) * 43758.5453
  return n - Math.floor(n)
}

function DotGrid({ shelter }: { shelter?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = ref.current
    const host = canvas?.parentElement
    if (!canvas || !host) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // The resting grid is drawn ONCE to an offscreen canvas and blitted each
    // frame, so a frame only has to draw the dots actually inside the pointer's
    // reach instead of all of them. Without this the cost of a frame is the
    // whole grid whether anything changed or not.
    const base = document.createElement('canvas')
    const bctx = base.getContext('2d')
    if (!bctx) return

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')

    let w = 0
    let h = 0
    let cols = 0
    let rows = 0
    let ox = 0
    let oy = 0
    let ink = 'rgb(0,0,0)'
    // The three constants above, scaled by --dot-grid-alpha-scale for the
    // current theme. Recomputed wherever the ink is.
    let baseA = BASE_A
    let peakA = PEAK_A
    let pulseA = PULSE_A
    // Per-dot 0..1: how much of the effect this dot is allowed. See buildField.
    let weight = new Float32Array(0)
    // The content rects, in card-local px. Kept past buildField because the
    // POINTER is weighed against them too, every frame.
    let boxes: { l: number; t: number; r: number; b: number }[] = []

    // Pointer: `t*` is where it actually is, `p*` is the eased value the dots
    // read, so the field glides rather than snapping between move events.
    let tx = 0
    let ty = 0
    let px = 0
    let py = 0
    let inside = false
    let strength = 0 // 0..1, eased — what makes the field fade out on leave
    // The pulse yields to THIS, not to `strength` — see the note where it is
    // used. Held at 1 for ACTIVITY_HOLD after the last move and only then
    // eased down, rather than decaying from every event: a pure decay sags
    // between pointermoves, and a slowly-dragged mouse let the band flicker
    // back in at up to a third strength in those gaps.
    let activity = 0
    let lastMoveAt = -Infinity
    let raf = 0
    let last = 0

    // The pulse runs only when ALL of these hold. See the note where they are
    // wired up for why each one is load-bearing.
    let live = false // not prefers-reduced-motion
    let onScreen = false // IntersectionObserver
    let tabVisible = document.visibilityState === 'visible'
    const pulsing = () => live && onScreen && tabVisible
    // True once the resting grid is on the canvas and nothing is moving, so an
    // idle frame can skip the clear+blit entirely.
    let restPainted = false

    // Read straight off the element's computed style, which DotGrid.css keys
    // to the theme tokens. The canvas never has to know the token names, and
    // this is the only way it can: a 2D context can't resolve a CSS variable.
    //
    // `color` carries the ink. The alpha scale has to come through as a custom
    // property instead — there is no ordinary CSS property that means "how
    // opaque should this canvas draw", so it is read by name. A missing or
    // unparseable value falls back to 1, i.e. the light-mode constants, which
    // is what the field did before this existed.
    const readPaint = () => {
      const cs = getComputedStyle(canvas)
      ink = cs.color || 'rgb(0,0,0)'
      const raw = parseFloat(cs.getPropertyValue('--dot-grid-alpha-scale'))
      const scale = Number.isFinite(raw) && raw > 0 ? raw : 1
      baseA = Math.min(1, BASE_A * scale)
      peakA = Math.min(1, PEAK_A * scale)
      pulseA = Math.min(1, PULSE_A * scale)
    }

    /* THE SHELTER FIELD — why the dots don't sit behind the text.
     *
     * Each dot gets a weight from its distance to the NEAREST content box, and
     * that weight scales both its resting alpha and how far it can swell. Near
     * the copy a dot is invisible and unresponsive; `SHELTER_RAMP` px past the
     * dead zone it is at full strength, with a linear ramp and a per-dot
     * jitter between — see the note on those constants.
     *
     * The alternative was clipping the canvas to a rectangle of empty space,
     * which Kian rejected and which would have looked worse: a hard edge where
     * the effect stops is far more obvious than a gradient where it thins out.
     *
     * Distance is to the RECTANGLE, not its centre — `max(l - x, 0, x - r)` per
     * axis is 0 while the point is inside the box's span, so the taper follows
     * the shape of a wide paragraph instead of ballooning from its middle.
     */
    const weightAt = (x: number, y: number) => {
      let best = Infinity
      for (const q of boxes) {
        // Distance to the RECTANGLE: 0 on an axis while the point is inside
        // that axis's span, so the taper follows the shape of a wide paragraph
        // instead of ballooning out of its middle.
        const dx = Math.max(q.l - x, 0, x - q.r)
        const dy = Math.max(q.t - y, 0, y - q.b)
        const d2 = dx * dx + dy * dy
        if (d2 < best) best = d2
      }
      // Linear, not smoothstep — see the note on SHELTER_RAMP. Returned
      // UN-jittered: this is what the pointer is weighed against, and a noisy
      // pointer response would feel like the effect was stuttering.
      const near = boxes.length
        ? clamp01((Math.sqrt(best) - SHELTER_DEAD) / SHELTER_RAMP)
        : 1
      const edge = Math.min(x, w - x)
      return near * clamp01((edge - EDGE_INSET) / EDGE_FADE)
    }

    const buildField = () => {
      weight = new Float32Array(cols * rows)
      const hostRect = host.getBoundingClientRect()
      boxes = shelter
        ? Array.from(host.querySelectorAll(shelter)).map((el) => {
          const r = el.getBoundingClientRect()
          return {
            l: r.left - hostRect.left,
            t: r.top - hostRect.top,
            r: r.right - hostRect.left,
            b: r.bottom - hostRect.top,
          }
        })
        : []

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          // Jitter is added to the WEIGHT, then clamped, so it only bites in
          // the ramp: a dot already at 0 or 1 mostly stays there and only the
          // boundary itself dissolves.
          const u = weightAt(ox + i * PITCH, oy + j * PITCH)
          weight[i * rows + j] = clamp01(u + (hash(i, j) - 0.5) * SHELTER_JITTER)
        }
      }
    }

    const paintBase = () => {
      bctx.clearRect(0, 0, w, h)
      bctx.fillStyle = ink
      // Per-dot alpha, so one path for the whole grid is out. That is fine:
      // this runs on layout and on a theme change, never per frame.
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const k = weight[i * rows + j]
          if (k <= 0.01) continue
          bctx.globalAlpha = baseA * k
          bctx.beginPath()
          bctx.arc(ox + i * PITCH, oy + j * PITCH, BASE_R, 0, TAU)
          bctx.fill()
        }
      }
      bctx.globalAlpha = 1
    }

    /* Where the pulse band's centre is right now, or -1 while it rests.
     * Driven off absolute time rather than an accumulator, so the band is
     * wherever it would have been when the loop restarts after a scroll or a
     * tab switch — it resumes mid-sweep instead of snapping back to the top.
     * It enters from above the card and leaves below it, so the sweep has no
     * visible start or end. */
    const bandCentre = (now: number) => {
      if (!pulsing()) return -1
      const u = (now % PULSE_CYCLE) / PULSE_CYCLE
      if (u > PULSE_SWEEP) return -1
      return -PULSE_BAND + (u / PULSE_SWEEP) * (h + 2 * PULSE_BAND)
    }

    const paintFrame = (bandY = -1) => {
      ctx.clearRect(0, 0, w, h)
      ctx.drawImage(base, 0, 0, w, h)

      /* THE PULSE YIELDS TO POINTER MOTION, NOT TO PRESENCE — and the
       * difference was a real bug. This was `1 - strength`, and `strength`
       * stays pinned at 1 for as long as the cursor is anywhere over the
       * card. So parking the mouse on the grid and letting go suppressed the
       * pulse indefinitely: it only came back once you moved the pointer off
       * the card entirely, which is why toggling the theme appeared to "fix"
       * it — that motion leaves the card on the way to the nav.
       *
       * `activity` is set to 1 on every move and decays on its own, so a
       * still cursor stops counting after about a second while the bloom
       * under it stays put. The two effects still never overlap in time,
       * which is the point: a band drifting through a live bloom makes the
       * bloom look like it is flickering rather than tracking the cursor.
       *
       * It is scaled by the dot's shelter weight `k` like everything else, so
       * the band does not light up behind the copy as it passes over it. */
      const fade = 1 - activity
      if (bandY >= 0 && fade > 0.01) {
        const b0 = Math.max(0, Math.floor((bandY - PULSE_BAND - oy) / PITCH))
        const b1 = Math.min(rows - 1, Math.ceil((bandY + PULSE_BAND - oy) / PITCH))
        ctx.fillStyle = ink
        for (let j = b0; j <= b1; j++) {
          const y = oy + j * PITCH
          // Constant down a row, so it is hoisted out of the column loop.
          const a = smoothstep(clamp01(1 - Math.abs(y - bandY) / PULSE_BAND)) * fade
          if (a <= 0.01) continue
          for (let i = 0; i < cols; i++) {
            const k = weight[i * rows + j]
            if (k <= 0.01) continue
            const t = a * k
            ctx.globalAlpha = baseA * k + (pulseA - baseA) * t
            ctx.beginPath()
            ctx.arc(ox + i * PITCH, y, BASE_R + (PULSE_R - BASE_R) * t, 0, TAU)
            ctx.fill()
          }
        }
        ctx.globalAlpha = 1
      }

      if (strength <= 0.002) return

      // Only the cells whose centres can fall inside the influence circle, by
      // index arithmetic rather than by distance-testing every dot.
      const i0 = Math.max(0, Math.floor((px - INFLUENCE - ox) / PITCH))
      const i1 = Math.min(cols - 1, Math.ceil((px + INFLUENCE - ox) / PITCH))
      const j0 = Math.max(0, Math.floor((py - INFLUENCE - oy) / PITCH))
      const j1 = Math.min(rows - 1, Math.ceil((py + INFLUENCE - oy) / PITCH))

      /* TWO weights damp the bloom, and it needs both.
       *
       * `k` is the DOT's — it stops a dot beside the copy from swelling into
       * it. On its own that was not enough, and the reason is geometric:
       * INFLUENCE (130px) reaches barely further than the shelter ramp, so a
       * pointer
       * parked just under the resume button still caught a crowd of
       * full-weight dots below and bloomed almost normally.
       *
       * `pw` is the POINTER's, measured at the cursor itself. It scales the
       * whole effect, so hovering in a sheltered spot is quiet wherever the
       * dots around it happen to sit. That is the behaviour Kian asked for —
       * "hovering right under the view resume button would mean the dots
       * don't grow as large as if I hovered right in the middle".
       *
       * The floor keeps a sheltered hover from doing literally nothing, which
       * would read as broken rather than as damped.
       */
      const pw = POINTER_FLOOR + (1 - POINTER_FLOOR) * weightAt(px, py)

      ctx.fillStyle = ink
      for (let i = i0; i <= i1; i++) {
        for (let j = j0; j <= j1; j++) {
          const k = weight[i * rows + j]
          if (k <= 0.01) continue
          const x = ox + i * PITCH
          const y = oy + j * PITCH
          const d = Math.hypot(x - px, y - py)
          if (d >= INFLUENCE) continue
          // Smoothstep, so the edge of the field has no visible rim — a linear
          // falloff leaves a hard circle you can see the boundary of.
          const t = smoothstep(1 - d / INFLUENCE) * strength * k * pw
          if (t <= 0.004) continue
          ctx.globalAlpha = baseA * k + (peakA - baseA) * t
          ctx.beginPath()
          ctx.arc(x, y, BASE_R + (PEAK_R - BASE_R) * t, 0, TAU)
          ctx.fill()
        }
      }
      ctx.globalAlpha = 1
    }

    const layout = () => {
      const r = host.getBoundingClientRect()
      w = Math.max(1, Math.round(r.width))
      h = Math.max(1, Math.round(r.height))
      // Capped at 2: past that the backing store grows faster than anyone can
      // see the difference on a field of 1px dots.
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      for (const c of [canvas, base]) {
        c.width = Math.round(w * dpr)
        c.height = Math.round(h * dpr)
      }
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      bctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      cols = Math.floor(w / PITCH) + 1
      rows = Math.floor(h / PITCH) + 1
      // Centred, so the margin left over is split evenly instead of piling up
      // on the right and bottom edges.
      ox = (w - (cols - 1) * PITCH) / 2
      oy = (h - (rows - 1) * PITCH) / 2
      // Re-read before repainting. The paint values were previously picked up
      // on mount and on a theme change only, which made a change to
      // --dot-grid-alpha-scale look like it did nothing: the token resolved
      // to its new value, `paintBase` ran on the next relayout, and it still
      // drew with the alphas read at mount. Reading here costs one
      // getComputedStyle per layout — never per frame.
      readPaint()
      buildField()
      paintBase()
      restPainted = false
      paintFrame()
      // Whatever was on screen is stale; if the pulse is live the loop needs
      // to be running again to redraw the band at the new size.
      start()
    }

    const tick = (now: number) => {
      const dt = last ? Math.min(now - last, 64) : 16
      last = now
      // Frame-rate independent easing: a fixed per-frame fraction would move
      // twice as fast on a 120Hz display.
      const pk = 1 - Math.exp(-dt / 55)
      px += (tx - px) * pk
      py += (ty - py) * pk
      const sk = 1 - Math.exp(-dt / 110)
      strength += ((inside ? 1 : 0) - strength) * sk
      // Slower than `strength` on purpose: this is "has the reader just been
      // doing something", and a pulse that restarted the instant the mouse
      // paused would feel twitchy. Hold, then ease.
      const stirred = now - lastMoveAt < ACTIVITY_HOLD
      activity += ((stirred ? 1 : 0) - activity) * (1 - Math.exp(-dt / 500))

      const bandY = bandCentre(now)
      // `activity` is in here so the band can fade back IN as it decays, on a
      // frame where nothing else is changing.
      const moving = inside || strength > 0.002 || activity > 0.002 || stirred || bandY >= 0

      if (moving) {
        paintFrame(bandY)
        restPainted = false
        raf = requestAnimationFrame(tick)
        return
      }

      // Nothing is moving. Settle exactly on the resting grid ONCE...
      if (!restPainted) {
        strength = 0
        paintFrame()
        restPainted = true
      }

      // ...and then either keep a free-running rAF alive through the pulse's
      // rest phase — it now does no canvas work at all — or stop outright if
      // the pulse is gated off and there is no pointer.
      if (pulsing()) {
        raf = requestAnimationFrame(tick)
      } else {
        raf = 0
        last = 0
      }
    }

    const start = () => {
      if (!raf) {
        last = 0
        raf = requestAnimationFrame(tick)
      }
    }

    const onMove = (e: PointerEvent) => {
      // A drag across the card on a touch screen is the reader scrolling the
      // page past it, the same call FigureChart makes. There is no hover to
      // track on a finger, and following it would fight the scroll.
      if (e.pointerType === 'touch') return
      const r = host.getBoundingClientRect()
      tx = e.clientX - r.left
      ty = e.clientY - r.top
      lastMoveAt = performance.now()
      if (!inside) {
        // Seed the eased position on entry, or the field swoops in from
        // wherever the pointer last left — usually the far corner.
        inside = true
        px = tx
        py = ty
      }
      start()
    }

    const onLeave = () => {
      inside = false
      start()
    }

    // layout() re-reads for itself; this only covers the paths that repaint
    // without a relayout.
    layout()

    // The card's height changes with the viewport, and the copy inside it
    // reflows when the web font lands — which moves the boxes the shelter
    // field is measured from, so both have to relay out.
    const ro = new ResizeObserver(layout)
    ro.observe(host)
    document.fonts?.ready.then(layout).catch(() => { })

    // `data-theme` moves on <html> (index.html's pre-paint script and useTheme
    // both write it) — the ink has to follow it.
    const mo = new MutationObserver(() => {
      readPaint()
      paintBase()
      paintFrame()
    })
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] })

    /* MOTION IS GATED ON THREE THINGS, and each one is load-bearing.
     *
     * The pulse runs on its own, so unlike the pointer effect it cannot rely
     * on "no cursor here means nothing to do". An ungated idle animation is a
     * rAF held open for as long as the tab exists, which is a battery draw on
     * a page someone has left open — the exact cost this file previously
     * avoided by only ever looping under the cursor.
     *
     * 1. `live` — `prefers-reduced-motion`. The grid still RENDERS, because
     *    texture is not motion, but neither the pulse nor the pointer moves.
     *    Watched rather than read once: someone turning the setting on should
     *    stop an animation that is already running.
     * 2. `onScreen` — an IntersectionObserver at `threshold: 0`, the same call
     *    `useCarouselAutoplay` makes. A higher threshold would never fire for
     *    a card that is a viewport tall. This is what stops the loop once the
     *    reader scrolls down to Education.
     * 3. `tabVisible` — a background tab gets no frames anyway on most
     *    engines, but this makes the stop explicit and stops the band lurching
     *    on return.
     *
     * NOTE this reverses an earlier decision. Before the pulse there was
     * deliberately no IntersectionObserver here, on the sound reasoning that a
     * card off screen cannot have the pointer over it. That stopped being true
     * the moment something moved without being asked to.
     */
    const syncLive = () => {
      live = !reduced.matches
      if (live) {
        host.addEventListener('pointermove', onMove)
        host.addEventListener('pointerleave', onLeave)
        start()
      } else {
        host.removeEventListener('pointermove', onMove)
        host.removeEventListener('pointerleave', onLeave)
        inside = false
      }
    }
    syncLive()
    reduced.addEventListener('change', syncLive)

    const io = new IntersectionObserver(
      ([e]) => {
        onScreen = e.isIntersecting
        if (onScreen) start()
      },
      { threshold: 0 }
    )
    io.observe(host)

    const onVisibility = () => {
      tabVisible = document.visibilityState === 'visible'
      if (tabVisible) start()
    }
    document.addEventListener('visibilitychange', onVisibility)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      mo.disconnect()
      io.disconnect()
      reduced.removeEventListener('change', syncLive)
      document.removeEventListener('visibilitychange', onVisibility)
      host.removeEventListener('pointermove', onMove)
      host.removeEventListener('pointerleave', onLeave)
    }
  }, [shelter])

  return <canvas ref={ref} className="dot-grid" aria-hidden="true" />
}

export default DotGrid
