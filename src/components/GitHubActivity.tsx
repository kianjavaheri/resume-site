import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import '../styling/components/GitHubActivity.css'

/* COMMITS TO THIS REPOSITORY OVER THE LAST 30 DAYS.
 *
 * NO TOKEN AND NO THIRD-PARTY SERVICE. GitHub's contribution GRAPH is only
 * available through the GraphQL API, which needs an authenticated request —
 * and a token shipped to a static site is a token you have published. The
 * usual workaround is a third-party proxy, which means trusting someone else's
 * uptime and someone else's idea of what to do with the traffic.
 *
 * None of that is needed to answer the narrower question. `/repos/:owner/:repo/
 * commits` is public and unauthenticated for a public repository, so the
 * commits to THIS repo — which is what was actually wanted — come straight
 * from the source. The rate limit is 60 requests an hour PER IP, and the fetch
 * runs in the visitor's browser, so the budget is theirs and a visitor would
 * have to reload sixty times in an hour to reach it.
 *
 * It degrades to nothing. Rate-limited, offline, API down, repo renamed: the
 * component renders null and the page reads exactly as it would have. A
 * portfolio that shows a broken widget is worse than one that shows no widget.
 */

const OWNER = 'kianjavaheri'
const REPO = 'resume-site'
const DAYS = 30
// Two pages of 100 is 200 commits in a month; past that the count saturates
// and says so rather than lying. One page is the realistic case.
const PER_PAGE = 100
const MAX_PAGES = 2

type Day = { date: string; count: number }
type Data = { days: Day[]; total: number; activeDays: number; saturated: boolean }

/* Held at module scope so moving between pages doesn't refetch. This is a
   cache, not state: the component remounts on every navigation to a reading
   page, and without it each one would spend another request from the
   visitor's hourly budget. */
let cache: Data | null = null
let inFlight: Promise<Data | null> | null = null

function startOfDayUTC(d: Date) {
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()))
}

async function load(): Promise<Data | null> {
  if (cache) return cache
  if (inFlight) return inFlight

  inFlight = (async () => {
    const since = new Date(Date.now() - DAYS * 86400000)
    const dates: string[] = []
    let saturated = false

    for (let page = 1; page <= MAX_PAGES; page++) {
      const url =
        `https://api.github.com/repos/${OWNER}/${REPO}/commits` +
        `?since=${since.toISOString()}&per_page=${PER_PAGE}&page=${page}`
      const res = await fetch(url, { headers: { Accept: 'application/vnd.github+json' } })
      // 403 is the rate limit, 404 a renamed or private repo. Either way there
      // is nothing honest to draw.
      if (!res.ok) return null
      const batch: unknown = await res.json()
      if (!Array.isArray(batch)) return null
      for (const c of batch) {
        const d = c?.commit?.author?.date ?? c?.commit?.committer?.date
        if (typeof d === 'string') dates.push(d.slice(0, 10))
      }
      if (batch.length < PER_PAGE) break
      if (page === MAX_PAGES) saturated = true
    }

    const counts = new Map<string, number>()
    for (const d of dates) counts.set(d, (counts.get(d) ?? 0) + 1)

    // A fixed 30-cell run ending today, so the strip is the same width whether
    // or not the quiet days had commits — a gap-free axis, not a list of hits.
    const today = startOfDayUTC(new Date())
    const days: Day[] = []
    for (let i = DAYS - 1; i >= 0; i--) {
      const day = new Date(today.getTime() - i * 86400000)
      const key = day.toISOString().slice(0, 10)
      days.push({ date: key, count: counts.get(key) ?? 0 })
    }

    cache = {
      days,
      total: dates.length,
      activeDays: counts.size,
      saturated,
    }
    return cache
  })().catch(() => null)

  return inFlight
}

// Four steps, like GitHub's own. Thresholds are low because this is one repo
// over one month, not a whole account over a year — at GitHub's scale almost
// every day here would be the palest step and the strip would say nothing.
function level(n: number) {
  if (n === 0) return 0
  if (n <= 2) return 1
  if (n <= 5) return 2
  if (n <= 9) return 3
  return 4
}

const dayOfWeek = (iso: string) => new Date(iso + 'T00:00:00Z').getUTCDay()

/* GITHUB'S OWN LAYOUT: weeks are COLUMNS and the seven weekdays are ROWS.
 *
 * It was a single 30-cell row first, which is a different thing wearing the
 * same colours — a run of cells says "the last thirty days" but a calendar
 * says WHICH days, and the weekly rhythm (nothing at weekends, a burst on a
 * Tuesday) is the part worth seeing.
 *
 * The first week is padded with nulls up to its weekday offset and the last is
 * padded out to seven, so every column is a full week and the rows line up as
 * Sunday-through-Saturday. A null is a day outside the window: it renders as
 * an empty slot with no cell at all, not as a zero-commit day, because those
 * are different claims.
 */
function toWeeks(days: Day[]): (Day | null)[][] {
  if (days.length === 0) return []
  const cells: (Day | null)[] = [
    ...Array(dayOfWeek(days[0].date)).fill(null),
    ...days,
  ]
  while (cells.length % 7 !== 0) cells.push(null)
  const weeks: (Day | null)[][] = []
  for (let i = 0; i < cells.length; i += 7) weeks.push(cells.slice(i, i + 7))
  return weeks
}

/* A label sits above the column in which a month STARTS, which is what GitHub
   does — keyed off the week containing the 1st, not off each week's first day.

   Keying it off the first day was wrong in a way one month hides: with a
   window of Sep 3 to Oct 2, the last column runs Sep 27 to Oct 3, so its first
   day is in September, the month matched the previous label, and **October was
   never labelled at all**. The 1st is the thing that actually marks a boundary.

   Column 0 gets a fallback label when nothing else claims it, so the reader can
   tell what they are looking at even though that month began off the left
   edge. */
function monthLabels(weeks: (Day | null)[][]) {
  const fmt = new Intl.DateTimeFormat('en-US', { month: 'short', timeZone: 'UTC' })
  const out = weeks.map((week) => {
    const first = week.find((d): d is Day => d !== null && d.date.endsWith('-01'))
    return first ? fmt.format(new Date(first.date + 'T00:00:00Z')) : ''
  })
  if (out.length > 0 && out[0] === '') {
    const first = weeks[0].find((d): d is Day => d !== null)
    if (first) out[0] = fmt.format(new Date(first.date + 'T00:00:00Z'))
  }
  return out
}

/* "September 24th" — GitHub's own tooltip wording, which needs an ordinal.
   The teens are the trap: 11th/12th/13th, not 11st/12nd/13rd, which is why
   this tests n % 100 before n % 10. */
function ordinal(n: number) {
  const teen = n % 100
  if (teen >= 11 && teen <= 13) return `${n}th`
  switch (n % 10) {
    case 1:
      return `${n}st`
    case 2:
      return `${n}nd`
    case 3:
      return `${n}rd`
    default:
      return `${n}th`
  }
}

const LONG_MONTH = new Intl.DateTimeFormat('en-US', { month: 'long', timeZone: 'UTC' })

function describe(d: Day) {
  const date = new Date(d.date + 'T00:00:00Z')
  const when = `${LONG_MONTH.format(date)} ${ordinal(date.getUTCDate())}`
  // "commits", not GitHub's "contributions": this counts one repository, and
  // borrowing their word would claim a broader number than it is.
  if (d.count === 0) return `No commits on ${when}.`
  return `${d.count} commit${d.count === 1 ? '' : 's'} on ${when}.`
}

type Tip = { text: string; x: number; y: number; key: string }

function GitHubActivity() {
  const [data, setData] = useState<Data | null>(cache)
  const [tip, setTip] = useState<Tip | null>(null)
  const calRef = useRef<HTMLDivElement>(null)
  const tipRef = useRef<HTMLDivElement>(null)
  // Resolved geometry, computed after measuring the pill. Null until then, and
  // the pill is `visibility: hidden` meanwhile so a pre-measurement position
  // can never be seen.
  const [pos, setPos] = useState<{ left: number; caret: number } | null>(null)

  useEffect(() => {
    let alive = true
    load().then((d) => {
      if (alive) setData(d)
    })
    return () => {
      alive = false
    }
  }, [])

  /* KEEP THE TOOLTIP INSIDE THE COLUMN. It is centred on a cell and is far
     wider than the 81px calendar, so on the leftmost column it would hang ~100px
     past the article's left edge — which at the mobile gutter is off the
     viewport, and an absolutely positioned box outside the article is exactly
     how this page has opened a sideways scroll before.

     Measured and corrected in a LAYOUT effect, so the nudge happens before
     paint and never shows as a jump. */
  /* POSITION THE PILL, THEN THE CARET — in that order, and both clamped.
   *
   * The pill is ~208px against an 81px calendar, so centred on the leftmost
   * column it hangs ~104px past the article's left edge. At the mobile gutter
   * that is off the viewport, and an absolutely positioned box outside the
   * article is exactly how this page has opened a sideways scroll before.
   *
   * THE CARET NEEDS ITS OWN CLAMP, and leaving it out was visibly wrong on the
   * three leftmost columns: the pill stops moving at the column edge while the
   * cell keeps going, so the caret ran out past the pill's 7px corner radius
   * and sat on the curve, reading as a torn speech bubble rather than a
   * pointer. It is held `CARET_INSET` from each end, which is the radius plus
   * the caret's own half-diagonal — past that there is no flat edge for it to
   * attach to. On the far columns it therefore stops tracking the cell exactly,
   * which is the right trade: a caret that points approximately at the right
   * area still reads as attached, where one hanging off a rounded corner does
   * not read as anything.
   *
   * A LAYOUT effect, so all of this resolves before paint.
   */
  useLayoutEffect(() => {
    if (!tip || !tipRef.current || !calRef.current) {
      if (pos !== null) setPos(null)
      return
    }
    const PAD = 2
    const CARET_INSET = 14
    const pill = tipRef.current.offsetWidth
    const host = calRef.current.offsetWidth
    // Centre on the cell, then pull back inside the column.
    const left = Math.max(PAD, Math.min(tip.x - pill / 2, host - pill - PAD))
    // Point at the cell, but never past the pill's flat edge.
    const caret = Math.min(Math.max(tip.x - left, CARET_INSET), pill - CARET_INSET)
    if (!pos || Math.abs(pos.left - left) > 0.5 || Math.abs(pos.caret - caret) > 0.5) {
      setPos({ left, caret })
    }
  }, [tip, pos])

  /* A TAP ANYWHERE ELSE CLOSES IT. Without this a tooltip opened by touch has
     no way out — there is no pointerleave to wait for, and iOS does not
     reliably fire blur on a non-input element when you tap away. The cells'
     own handler stops propagation, so this only ever sees taps that missed. */
  useEffect(() => {
    if (!tip) return
    const close = (e: PointerEvent) => {
      if (e.pointerType === 'touch') setTip(null)
    }
    document.addEventListener('pointerdown', close)
    return () => document.removeEventListener('pointerdown', close)
  }, [tip])

  // Nothing to show, or nothing worth showing. Renders null rather than an
  // empty frame or a spinner: this is a footnote on a reading page, and a
  // skeleton would draw more attention than the content it stands in for.
  if (!data || data.total === 0) return null

  const weeks = toWeeks(data.days)
  const labels = monthLabels(weeks)

  const place = (d: Day, el: HTMLElement) => {
    const host = calRef.current
    if (!host) return
    const cell = el.getBoundingClientRect()
    const box = host.getBoundingClientRect()
    setPos(null)
    setTip({
      text: describe(d),
      x: cell.left - box.left + cell.width / 2,
      y: cell.top - box.top,
      key: d.date,
    })
  }

  /* MOUSE AND TOUCH ARE HANDLED SEPARATELY, keyed off `pointerType` — the same
     split `FigureChart` makes, and for the same reason: a finger has no hover.
     Relying on the browser's emulated mouse events for a tap works by accident
     where it works at all, and leaves no way to dismiss. */
  const onEnter = (d: Day) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType === 'touch') return
    place(d, e.currentTarget)
  }

  // A tap opens; a second tap on the SAME day closes. Anywhere else, the
  // document listener above closes it.
  const onTap = (d: Day) => (e: ReactPointerEvent<HTMLSpanElement>) => {
    if (e.pointerType !== 'touch') return
    e.stopPropagation()
    if (tip && tip.key === d.date) {
      setTip(null)
      return
    }
    place(d, e.currentTarget)
  }

  return (
    <div
      className="gh-activity"
      ref={calRef}
      onPointerLeave={(e) => {
        if (e.pointerType !== 'touch') setTip(null)
      }}
    >
      <p className="gh-activity-summary">
        <strong>
          {data.saturated ? `${data.total}+` : data.total} commit
          {data.total === 1 ? '' : 's'}
        </strong>{' '}
        to this repository in the last {DAYS} days, across {data.activeDays} day
        {data.activeDays === 1 ? '' : 's'}.
      </p>
      {/* The calendar is decoration over the sentence above, which already
          carries the whole figure — so it is hidden from assistive tech rather
          than announced as three dozen unlabelled squares, and the cells are
          not focusable. The tooltip therefore ENHANCES and never gates: the
          totals are in the sentence, and only the per-day split is
          pointer-only. Same rule the thesis charts' tooltip follows. */}
      <div className="gh-activity-cal" aria-hidden="true">
        <div className="gh-activity-months">
          {labels.map((label, w) => (
            <span key={w} className="gh-activity-month">
              {label}
            </span>
          ))}
        </div>
        <div className="gh-activity-grid">
          {weeks.map((week, w) => (
            <div key={w} className="gh-activity-week">
              {week.map((d, i) =>
                d ? (
                  <span
                    key={d.date}
                    className={`gh-activity-cell gh-activity-l${level(d.count)}`}
                    onPointerEnter={onEnter(d)}
                    onPointerDown={onTap(d)}
                  />
                ) : (
                  // Outside the window. An empty slot rather than a cell: a
                  // day we are not reporting on is not a day with no commits.
                  <span key={`pad-${w}-${i}`} className="gh-activity-pad" />
                )
              )}
            </div>
          ))}
        </div>
      </div>
      {tip ? (
        <div
          ref={tipRef}
          className="gh-activity-tip"
          style={{
            left: pos ? pos.left : tip.x,
            top: tip.y,
            visibility: pos ? 'visible' : 'hidden',
          }}
        >
          {tip.text}
          {/* Tracks the cell until the pill's flat edge runs out — see the
              layout effect for why it stops there rather than following. */}
          <span
            className="gh-activity-tip-caret"
            style={{ left: pos ? pos.caret : 0 }}
          />
        </div>
      ) : null}
    </div>
  )
}

export default GitHubActivity
