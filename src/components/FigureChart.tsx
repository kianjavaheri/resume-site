import React, { useId, useMemo, useRef, useState } from 'react'
import type { PaperChart } from '../content/charts'

// Plot geometry in viewBox units. The box is sized to include the x-axis band
// and the axis titles, so nothing is clipped and the container never needs its
// own scrollbar.
const W = 680
const H = 340
const PAD = { top: 18, right: 66, bottom: 46, left: 56 }
const PLOT_W = W - PAD.left - PAD.right
const PLOT_H = H - PAD.top - PAD.bottom

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

  const { yMin, yMax } = useMemo(
    () => ({ yMin: Math.min(...chart.yTicks), yMax: Math.max(...chart.yTicks) }),
    [chart]
  )

  const n = chart.x.length
  const xAt = (i: number) => PAD.left + (n === 1 ? PLOT_W / 2 : (i * PLOT_W) / (n - 1))
  const yAt = (v: number) => PAD.top + PLOT_H - ((v - yMin) / (yMax - yMin)) * PLOT_H

  // Every other year, matching the source charts — nine labels on a narrow
  // column collide.
  const xTickShown = (i: number) => i % 2 === 0

  const move = (e: React.PointerEvent<SVGSVGElement>) => {
    const svg = svgRef.current
    if (!svg) return
    const box = svg.getBoundingClientRect()
    // Pointer position in viewBox units, so this is correct at any rendered size.
    const vx = ((e.clientX - box.left) / box.width) * W
    let best = 0
    for (let i = 1; i < n; i++) {
      if (Math.abs(vx - xAt(i)) < Math.abs(vx - xAt(best))) best = i
    }
    setActive(best)
  }

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
            onPointerMove={move}
            onPointerLeave={() => setActive(null)}
            onKeyDown={onKeyDown}
            onFocus={() => setActive((i) => i ?? n - 1)}
            onBlur={() => setActive(null)}
          >
            <defs>
              <clipPath id={clipId}>
                <rect x={PAD.left} y={PAD.top} width={PLOT_W} height={PLOT_H} />
              </clipPath>
            </defs>

            {/* Gridlines: solid hairlines one step off the surface, never dashed. */}
            {chart.yTicks.map((t) => (
              <g key={t}>
                <line
                  className={`paper-chart-grid${zeroCrossing && t === 0 ? ' paper-chart-zero' : ''}`}
                  x1={PAD.left}
                  x2={PAD.left + PLOT_W}
                  y1={yAt(t)}
                  y2={yAt(t)}
                />
                {/* Plain numbers: the axis title already carries the unit,
                    so "$200B" beside a "$ billions" label says it twice. */}
                <text className="paper-chart-tick" x={PAD.left - 10} y={yAt(t)} textAnchor="end" dominantBaseline="middle">
                  {t}
                </text>
              </g>
            ))}

            {chart.x.map((label, i) =>
              xTickShown(i) ? (
                <text key={label} className="paper-chart-tick" x={xAt(i)} y={PAD.top + PLOT_H + 22} textAnchor="middle">
                  {label}
                </text>
              ) : null
            )}

            <text className="paper-chart-axis-title" x={PAD.left + PLOT_W / 2} y={H - 6} textAnchor="middle">
              {chart.xLabel}
            </text>
            <text
              className="paper-chart-axis-title"
              transform={`translate(14 ${PAD.top + PLOT_H / 2}) rotate(-90)`}
              textAnchor="middle"
            >
              {chart.yLabel}
            </text>

            {active !== null && (
              <line className="paper-chart-crosshair" x1={xAt(active)} x2={xAt(active)} y1={PAD.top} y2={PAD.top + PLOT_H} />
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
              className="paper-chart-tooltip"
              style={{
                left: `${(xAt(active) / W) * 100}%`,
                // Flips to the left of the crosshair past the midpoint so it
                // never runs off the right edge.
                transform: active > n / 2 ? 'translate(calc(-100% - 14px), -50%)' : 'translate(14px, -50%)',
              }}
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
