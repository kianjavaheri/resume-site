import React, { useEffect, useId, useMemo, useRef, useState } from 'react'
import type { PaperChart } from '../content/charts'

// Plot geometry in viewBox units, in two sizes. Each box is sized to include
// the x-axis band and the axis titles, so nothing is clipped and the container
// never needs its own scrollbar.
//
// There are two because **the chart scales with its container but its type does
// not scale with it**: the mobile block in Paper.css bumps the axis chrome from
// 15 viewBox units to 23, so that at 0.49x it still renders at a readable
// ~11px. At 23 units the desktop gutters no longer hold it. Measured on
// Figure 4 at 375px, three pairs of labels overlapped — the bottom-left y-tick
// against the first x-tick, the y-ticks against the rotated axis title, and the
// x-ticks against "Year". Shrinking the type back is not the fix; ~11px is
// already the floor. The gutters are what have to grow.
const GEO = {
  wide: { W: 680, H: 340, top: 18, right: 66, bottom: 46, left: 56, xTickDy: 22, yTitleX: 14 },
  compact: {
    W: 680,
    H: 400,
    top: 18,
    // The end label is anchored to its right edge on mobile (see Paper.css) and
    // runs back over the plot, so it needs clearance, not a gutter.
    //
    // 32, up from 28, for the LAST X-TICK rather than the end label: "2024" is
    // centred on the final data point, which sits on the plot's right edge, so
    // half of it hangs into this gutter. Under Google Sans Flex — a wider face
    // than Inter — that half grew past the svg's own box by 0.8px on all four
    // charts. It opened no page scroll, but "nothing paints outside its svg" is
    // the standard the mobile geometry is held to. 4 units is ~2px rendered at
    // 375, which clears it with margin; the plot pays 0.6% of its width.
    right: 32,
    // 90: the rotated y-title reaches x 27 at 23 units, the widest tick ("325")
    // is 41 units, and the tick sits 10 off the axis. 27 + 41 + 10 plus air.
    left: 90,
    // The title's own x. At 14 its ascenders paint ~5px left of the svg's box,
    // out into the page gutter — harmless (the svg is overflow: visible and it
    // adds no page scroll) but it isn't inside the chart it labels. 24 seats it.
    yTitleX: 24,
    // 76 with a 36-unit tick offset: the y-tick centred on the plot's bottom
    // edge hangs 11.5 units below it, so the x-tick's cap top has to clear
    // that before "Year" clears the x-tick's descender.
    bottom: 76,
    xTickDy: 36,
  },
}

// Which box to draw. Matches Paper.css's own 768px breakpoint, so the geometry
// and the font-size override always switch together.
function useCompactGeometry() {
  const [compact, setCompact] = useState(() => window.matchMedia('(max-width: 768px)').matches)
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 768px)')
    const sync = () => setCompact(mq.matches)
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])
  return compact ? GEO.compact : GEO.wide
}

/**
 * The thesis's four Background charts, drawn from the same data as Tables 1
 * and 2 instead of shown as screenshots of a spreadsheet.
 *
 * Deliberate departures from the originals, which were Google Sheets defaults:
 * - **No value on every point.** The originals label all nine. Direct labels
 *   only work when they're sparing, so only the last point of each series is
 *   labelled; the axis and the tooltip carry the rest.
 * - **No in-chart title.** The figcaption underneath already names the chart,
 *   and a single-series chart needs no legend for the same reason.
 * - Series colour comes from the two validated categorical slots; all text
 *   stays on the page's own ink tokens, never the series colour.
 */
function FigureChart({ chart, caption }: { chart: PaperChart; caption?: string }) {
  const uid = useId()
  const clipId = `clip-${uid.replace(/[:]/g, '')}`
  const svgRef = useRef<SVGSVGElement>(null)
  const [active, setActive] = useState<number | null>(null)
  const geo = useCompactGeometry()
  const { W, H } = geo
  const PLOT_W = W - geo.left - geo.right
  const PLOT_H = H - geo.top - geo.bottom
  // Which input opened the current reading, so a touch selection can persist
  // (there is no hover to end it) while a mouse one still follows the pointer.
  const heldByTouch = useRef(false)

  const { yMin, yMax } = useMemo(
    () => ({ yMin: Math.min(...chart.yTicks), yMax: Math.max(...chart.yTicks) }),
    [chart]
  )

  const n = chart.x.length
  const xAt = (i: number) => geo.left + (n === 1 ? PLOT_W / 2 : (i * PLOT_W) / (n - 1))
  const yAt = (v: number) => geo.top + PLOT_H - ((v - yMin) / (yMax - yMin)) * PLOT_H

  // Every other year, matching the source charts — nine labels on a narrow
  // column collide.
  const xTickShown = (i: number) => i % 2 === 0

  // Nearest point by x, not by distance to the marker: the markers render about
  // 2px wide on a phone, so hitting one is not a thing a finger can do.
  const pick = (clientX: number) => {
    const svg = svgRef.current
    if (!svg) return null
    const box = svg.getBoundingClientRect()
    // Pointer position in viewBox units, so this is correct at any rendered size.
    const vx = ((clientX - box.left) / box.width) * W
    let best = 0
    for (let i = 1; i < n; i++) {
      if (Math.abs(vx - xAt(i)) < Math.abs(vx - xAt(best))) best = i
    }
    return best
  }

  // Hover only. A touch drag over the chart is the reader scrolling the page
  // past it, and tracking it there both fought the scroll and left the tooltip
  // stranded, since a finger fires no pointerleave the way a mouse does.
  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'touch') return
    const i = pick(e.clientX)
    if (i !== null) setActive(i)
  }

  const leave = (e: React.PointerEvent<SVGSVGElement>) => {
    if (e.pointerType === 'touch') return
    setActive(null)
  }

  // Touch reads the values by tapping, which is the gesture that has a chance
  // of being deliberate: a tap that turns into a scroll never fires `click`.
  // Tapping the same point again puts the tooltip away.
  const tap = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!heldByTouch.current) return
    const i = pick(e.clientX)
    if (i === null) return
    setActive((cur) => (cur === i ? null : i))
  }

  // A tap anywhere else dismisses it. Blur would mostly cover this, but iOS
  // does not reliably blur a focused non-input element on an outside tap.
  useEffect(() => {
    if (active === null || !heldByTouch.current) return
    const away = (e: PointerEvent) => {
      if (e.pointerType !== 'touch') return
      if (svgRef.current?.contains(e.target as Node)) return
      setActive(null)
    }
    document.addEventListener('pointerdown', away)
    return () => document.removeEventListener('pointerdown', away)
  }, [active])

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== 'ArrowLeft' && e.key !== 'ArrowRight') return
    e.preventDefault()
    setActive((i) => {
      const cur = i ?? 0
      return Math.min(n - 1, Math.max(0, cur + (e.key === 'ArrowRight' ? 1 : -1)))
    })
  }

  const zeroCrossing = yMin < 0 && yMax > 0

  return (
    <figure className="paper-chart">
      <div className="paper-chart-frame">
        {chart.series.length > 1 && (
          <div className="paper-chart-legend">
            {chart.series.map((s) => (
              <span key={s.label} className="paper-chart-legend-item">
                {/* A line key, matching the mark it stands for. */}
                <span className={`paper-chart-key paper-chart-s${s.slot}`} aria-hidden="true" />
                {s.label}
              </span>
            ))}
          </div>
        )}

        <div className="paper-chart-plot">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            className="paper-chart-svg"
            role="img"
            aria-label={caption || chart.series.map((s) => s.label).join(' and ')}
            tabIndex={0}
            onPointerDown={(e) => {
              heldByTouch.current = e.pointerType === 'touch'
            }}
            onPointerMove={move}
            onPointerLeave={leave}
            onClick={tap}
            onKeyDown={onKeyDown}
            // Tabbing in still opens the last point, but a tap must not: the
            // tap focuses the svg first, so seeding here would show the wrong
            // reading for a frame before the tap's own pick replaced it.
            // Keyed off the ref rather than :focus-visible, whose match depends
            // on a browser heuristic about the last input the page saw.
            onFocus={() => {
              if (!heldByTouch.current) setActive((i) => i ?? n - 1)
            }}
            onBlur={() => {
              heldByTouch.current = false
              setActive(null)
            }}
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={geo.left} y={geo.top} width={PLOT_W} height={PLOT_H} />
              </clipPath>
            </defs>

            {/* Gridlines: solid hairlines one step off the surface, never dashed. */}
            {chart.yTicks.map((t) => (
              <g key={t}>
                <line
                  className={`paper-chart-grid${zeroCrossing && t === 0 ? ' paper-chart-zero' : ''}`}
                  x1={geo.left}
                  x2={geo.left + PLOT_W}
                  y1={yAt(t)}
                  y2={yAt(t)}
                />
                {/* Plain numbers: the axis title already carries the unit,
                    so "$200B" beside a "$ billions" label says it twice. */}
                <text className="paper-chart-tick" x={geo.left - 10} y={yAt(t)} textAnchor="end" dominantBaseline="middle">
                  {t}
                </text>
              </g>
            ))}

            {chart.x.map((label, i) =>
              xTickShown(i) ? (
                <text key={label} className="paper-chart-tick" x={xAt(i)} y={geo.top + PLOT_H + geo.xTickDy} textAnchor="middle">
                  {label}
                </text>
              ) : null
            )}

            <text className="paper-chart-axis-title" x={geo.left + PLOT_W / 2} y={H - 6} textAnchor="middle">
              {chart.xLabel}
            </text>
            <text
              className="paper-chart-axis-title"
              transform={`translate(${geo.yTitleX} ${geo.top + PLOT_H / 2}) rotate(-90)`}
              textAnchor="middle"
            >
              {chart.yLabel}
            </text>

            {active !== null && (
              <line className="paper-chart-crosshair" x1={xAt(active)} x2={xAt(active)} y1={geo.top} y2={geo.top + PLOT_H} />
            )}

            <g clipPath={`url(#${clipId})`}>
              {chart.series.map((s) => (
                <polyline
                  key={s.label}
                  className={`paper-chart-line paper-chart-s${s.slot}`}
                  points={s.values.map((v, i) => `${xAt(i)},${yAt(v)}`).join(' ')}
                />
              ))}
            </g>

            {/* Markers carry a surface-coloured ring so they stay legible where
                the two series cross. */}
            {chart.series.map((s) =>
              s.values.map((v, i) => (
                <circle
                  key={`${s.label}-${i}`}
                  className={`paper-chart-dot paper-chart-s${s.slot}${active === i ? ' paper-chart-dot-active' : ''}`}
                  cx={xAt(i)}
                  cy={yAt(v)}
                  r={active === i ? 5 : 4}
                />
              ))
            )}

            {/* Selective direct labels: the last point only. */}
            {chart.series.map((s) => (
              <text
                key={`end-${s.label}`}
                className="paper-chart-end-label"
                x={xAt(n - 1) + 10}
                y={yAt(s.values[n - 1])}
                dominantBaseline="middle"
              >
                {chart.format(s.values[n - 1])}
              </text>
            ))}
          </svg>

          {active !== null && (
            <div
              className={`paper-chart-tooltip${active > (n - 1) / 2 ? ' paper-chart-tooltip-flip' : ''}`}
              // The crosshair's position goes in as a custom property rather
              // than as `left` directly, so the mobile rule can park the card
              // at a plot edge instead without having to out-specify an inline
              // style. Which side it takes is the same decision in both: the
              // one the reading isn't on.
              style={{ ['--tip-x' as string]: `${(xAt(active) / W) * 100}%` }}
              role="status"
            >
              <p className="paper-chart-tooltip-x">{chart.x[active]}</p>
              {chart.series.map((s) => (
                <p key={s.label} className="paper-chart-tooltip-row">
                  <span className={`paper-chart-key paper-chart-s${s.slot}`} aria-hidden="true" />
                  <span className="paper-chart-tooltip-value">{chart.format(s.values[active])}</span>
                  <span className="paper-chart-tooltip-label">{s.label}</span>
                </p>
              ))}
            </div>
          )}
        </div>
      </div>
      {caption ? <figcaption>{caption}</figcaption> : null}
    </figure>
  )
}

export default FigureChart
