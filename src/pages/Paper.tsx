import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ScrollButton from '../components/Scroll'
import ArrowOut from '../components/ArrowOut'
import ArrowBack from '../components/ArrowBack'
import { hasAppHistory, useScrollRestore } from '../components/useScrollRestore'
import { useTheme } from '../components/useTheme'
import SurveyExplorer from '../components/SurveyExplorer'
import FigureCarousel from '../components/FigureCarousel'
import FigureChart from '../components/FigureChart'
import { figureCarousels, papers, surveyExplorers } from '../content/papers'
import type { Block, PaperTable } from '../content/papers'
import { paperTables } from '../content/tables'
import { paperCharts } from '../content/charts'
import { paperIntros } from '../content/intros'
import './../styling/pages/Paper.css'

// Columns of figures read better flush right, where the decimal points line
// up; text columns stay left. Detected rather than declared per table, so a
// new table doesn't need an alignment array maintained alongside it.
//
// "Quantity" rather than "number", because these tables write amounts as
// `$115.6 billion` and `~3.19%` — approximate, prefixed and suffixed. Matching
// bare digits only would leave those columns ragged left while `1.95%` beside
// them went right. What must NOT match is the Data Dictionary's prose, so the
// pattern still requires a digit up front: `% of U.S. GDP` and `Index Level`
// stay text.
const QUANTITY = /^[~≈]?\$?[+\-\u2212]?\d[\d.,]*%?(\s+(billion|million|trillion))?$/i

function isQuantityColumn(rows: string[][], col: number) {
  const cells = rows.map((r) => r[col]).filter((c) => c && c.trim())
  return cells.length > 0 && cells.every((c) => QUANTITY.test(c.trim()))
}

function PaperTableBlock({ table }: { table: PaperTable }) {
  // Column 0 is always the row label, even when it's all years — aligning the
  // header right while the <th> body cells stay left would just look broken.
  const numeric = table.columns.map((_, c) => c > 0 && isQuantityColumn(table.rows, c))

  return (
    <div className="paper-table-block">
      {/* The horizontal scroll lives on its own element so the table keeps its
          natural column widths instead of being squeezed on a phone. */}
      <div className="paper-table-scroll" tabIndex={0} role="group" aria-label={table.title}>
        <table className="paper-table">
          {table.title ? <caption className="paper-table-title">{table.title}</caption> : null}
          <thead>
            <tr>
              {table.columns.map((c, j) => (
                <th key={j} scope="col" className={numeric[j] ? 'paper-table-num' : undefined}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {table.rows.map((row, r) => (
              <tr key={r}>
                {row.map((cell, c) =>
                  c === 0 ? (
                    <th key={c} scope="row">{cell}</th>
                  ) : (
                    <td key={c} className={numeric[c] ? 'paper-table-num' : undefined}>{cell}</td>
                  )
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {table.notes?.length ? (
        <div className="paper-table-notes">{table.notes.map(renderBlock)}</div>
      ) : null}
    </div>
  )
}

// A run of consecutive figures in a carousel section becomes one `carousel`
// block — the same block a hand-written page writes inline, so both paths land
// in one renderer. Only a run of two or more is worth the controls; a lone
// figure in the same section still renders as a figure.
function groupFigures(blocks: Block[], labels: Record<string, string>): Block[] {
  const out: Block[] = []
  for (const b of blocks) {
    const last = out[out.length - 1]
    if (b.type === 'figure' && last) {
      if (last.type === 'carousel') {
        last.figures.push({ ...b, label: labels[b.src] })
        continue
      }
      if (last.type === 'figure') {
        out.pop()
        out.push({
          type: 'carousel',
          figures: [
            { ...last, label: labels[last.src] },
            { ...b, label: labels[b.src] },
          ],
        })
        continue
      }
    }
    out.push(b)
  }
  return out
}

function renderBlock(b: Block, i: number) {
  if (b.type === 'figure') {
    // Tables and charts that have been rebuilt from their data render from it;
    // the image each replaces stays on disk and stays referenced by the
    // generated content, it just isn't what gets drawn.
    const table = paperTables[b.src]
    if (table) return <PaperTableBlock key={i} table={table} />

    const chart = paperCharts[b.src]
    if (chart) return <FigureChart key={i} chart={chart} caption={b.caption} />

    return (
      <figure key={i} className={`paper-figure${b.plain ? ' paper-figure-plain' : ''}`}>
        <img
          src={b.src}
          alt={b.alt ?? b.caption ?? ''}
          width={b.width}
          height={b.height}
          loading="lazy"
        />
        {b.caption ? <figcaption>{b.caption}</figcaption> : null}
      </figure>
    )
  }
  if (b.type === 'carousel') {
    return <FigureCarousel key={i} figures={b.figures} plain={b.plain} />
  }
  if (b.type === 'list') {
    const items = b.items.map((item, j) => <li key={j}>{item}</li>)
    // An <ol> for steps whose order is the point. The global reset clears
    // list-style, so .paper-list restates it for both element types.
    return b.ordered ? (
      <ol key={i} className="paper-list paper-list-ordered">{items}</ol>
    ) : (
      <ul key={i} className={`paper-list${b.nested ? ' paper-list-nested' : ''}`}>{items}</ul>
    )
  }
  if (b.type === 'deflist') {
    return (
      <dl key={i} className="paper-deflist">
        {b.items.map((item, j) => (
          <React.Fragment key={j}>
            <dt>
              {item.href ? (
                // NOT .paper-link: that is the header's 0.7rem uppercase
                // micro-label, and these terms are sentences.
                <a href={item.href} target="_blank" rel="noopener noreferrer" className="paper-deflist-link">
                  {item.term}<ArrowOut />
                </a>
              ) : (
                item.term
              )}
            </dt>
            <dd>{item.detail}</dd>
          </React.Fragment>
        ))}
      </dl>
    )
  }
  if (b.type === 'h3') {
    return <h3 key={i} className="paper-subheading">{b.text}</h3>
  }
  if (b.type === 'quote') {
    return <blockquote key={i} className="paper-quote">{b.text}</blockquote>
  }
  return <p key={i} className="paper-para">{b.text}</p>
}

function Paper() {
  const { slug } = useParams()
  const paper = slug ? papers[slug] : undefined
  const { theme, switchTheme, isChecked } = useTheme()
  const navigate = useNavigate()
  useScrollRestore()
  const [activeId, setActiveId] = useState('')
  const explorer = slug ? surveyExplorers[slug] : undefined
  // Carousels on a GENERATED paper, folded together at render time. A
  // hand-written page writes a `carousel` block instead and isn't listed here.
  const carousels = slug ? figureCarousels[slug] : undefined
  const carouselSections = new Set(carousels?.sections ?? [])
  const figureLabels = carousels?.labels ?? {}

  // An intro is either an ABSTRACT, which stands in for the document and puts
  // the rest of the page behind a button, or an OVERVIEW, which is just a lede
  // and hides nothing — `gated` is what decides. A page with no intro renders
  // in full on arrival, as they all did before this existed.
  //
  // The gate is one-way on purpose: once you've asked for the paper, collapsing
  // it back out from under you is not something a reader wants.
  const intro = slug ? paperIntros[slug] : undefined
  const [expanded, setExpanded] = useState(false)
  const showFull = !intro?.gated || expanded

  // Scrolling on navigation belongs to useScrollRestore — this only resets the
  // gate, so a second paper doesn't open already expanded.
  useEffect(() => {
    setExpanded(false)
  }, [slug])

  useEffect(() => {
    if (!paper) return
    document.title = `${paper.title} — Kian Javaheri`
    return () => { document.title = 'Kian Javaheri' }
  }, [paper])

  // Highlights the section you're reading. Deterministic on purpose: the
  // active one is the last heading scrolled past. An IntersectionObserver
  // watching a band near the top of the viewport left nothing highlighted
  // whenever a jump landed between two headings.
  //
  // The probe line slides down as the page runs out of scroll. At 120px flat,
  // any section whose heading can never reach that line — the last few on a
  // page that ends in short sections, like the capstone poster — never lit up
  // at all: the page hit its scroll limit first, stranding the highlight three
  // or four sections early. `remaining` is how much scrolling is left, so at
  // the bottom the probe is the whole viewport (the last visible heading wins)
  // and it eases back to 120px as soon as there's room to scroll again.
  useEffect(() => {
    if (!paper) return
    const ids = [
      ...(intro ? ['intro'] : []),
      ...(showFull ? paper.sections.map((s) => s.id) : []),
      ...(showFull && paper.references?.length ? ['references'] : []),
    ]
    const update = () => {
      const doc = document.documentElement
      const remaining = doc.scrollHeight - (window.scrollY + window.innerHeight)
      const probe = Math.min(
        window.innerHeight,
        120 + Math.max(0, window.innerHeight - 120 - Math.max(0, remaining))
      )
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= probe) current = id
      }
      setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
    // `showFull` is a dependency because expanding adds every heading to the
    // page at once: without a re-run the probe keeps measuring the old id list
    // until the next scroll event.
  }, [paper, intro, showFull])

  const jumpTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveId(id)
  }

  if (!paper) {
    return (
      <div className="paper" data-theme={theme}>
        <div className="paper-inner paper-missing">
          <p className="paper-missing-text">That paper doesn't exist.</p>
          <Link to="/" className="paper-back">Back to the site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="paper" data-theme={theme}>
      <div className="paper-topbar">
        <div className="paper-topbar-left">
          {/* Icon only. `navigate(-1)` is a real history POP, which is what
              lets useScrollRestore put the reader back where they were —
              navigating to "/" instead would be a PUSH and land at the top. */}
          <button
            type="button"
            className="paper-back-btn"
            onClick={() => (hasAppHistory() ? navigate(-1) : navigate('/'))}
            aria-label="Go back"
            title="Go back"
          >
            <ArrowBack />
          </button>
          <Link to="/" className="paper-back">Kian Javaheri</Link>
        </div>
        <span className="paper-theme-toggle" onClick={switchTheme}>
          {isChecked() ? 'Light' : 'Dark'}
        </span>
      </div>

      <div className="paper-inner">
        <header className="paper-head">
          <p className="paper-eyebrow">{paper.eyebrow}</p>
          <h1 className="paper-title">{paper.title}</h1>
          <div className="paper-meta">
            {paper.meta.map((m) => (
              <span key={m.label} className="paper-meta-item">
                <span className="paper-meta-label">{m.label}</span>
                {m.value}
              </span>
            ))}
          </div>
          {paper.actions.length > 0 && (
            <div className="paper-actions">
              {paper.actions.map((a) => (
                <a
                  key={a.label}
                  href={a.pdfSrc ?? a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  {a.label}<ArrowOut />
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="paper-layout">
          {/* Hidden below 900px, where there's no room beside the text. The
              element stays in the tree even when it has nothing to list, so
              the two-column grid keeps its 210px track and the article doesn't
              jump sideways when the paper opens. */}
          <nav className="paper-toc" aria-label="Contents">
            {showFull ? <p className="paper-toc-label">Contents</p> : null}
            {intro ? (
              <a
                href="#intro"
                onClick={jumpTo('intro')}
                className={`paper-toc-link ${activeId === 'intro' ? 'paper-toc-active' : ''}`}
              >
                {intro.title}
              </a>
            ) : null}
            {showFull && paper.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={jumpTo(s.id)}
                className={`paper-toc-link ${activeId === s.id ? 'paper-toc-active' : ''}`}
              >
                {s.title}
              </a>
            ))}
            {showFull && paper.references?.length ? (
              <a
                href="#references"
                onClick={jumpTo('references')}
                className={`paper-toc-link ${activeId === 'references' ? 'paper-toc-active' : ''}`}
              >
                References
              </a>
            ) : null}
          </nav>

          <article className="paper-article">
            {intro ? (
              <section className="paper-section">
                <h2 id="intro" className="paper-section-title">{intro.title}</h2>
                {intro.paragraphs.map((text, i) => (
                  <p key={i} className="paper-para">{text}</p>
                ))}
                {intro.figure ? (
                  <figure className="paper-figure paper-intro-figure">
                    <img
                      src={intro.figure.src}
                      alt={intro.figure.alt}
                      width={intro.figure.width}
                      height={intro.figure.height}
                    />
                  </figure>
                ) : null}
              </section>
            ) : null}

            {intro?.gated && !expanded ? (
              <div className="paper-expand">
                <button
                  type="button"
                  className="paper-expand-btn"
                  onClick={() => setExpanded(true)}
                >
                  Read the full paper
                </button>
              </div>
            ) : null}

            {showFull && paper.sections.map((s) => {
              // A section can end in a run of survey charts that renders as the
              // explorer rather than as a stack of pictures. The marker heading
              // stays put and labels it; everything after it is superseded by
              // the explorer's own data and drops out of the flow.
              const cut =
                explorer && s.id === explorer.sectionId
                  ? s.blocks.findIndex(
                      (b) => b.type === 'h3' && b.text === explorer.afterHeading
                    )
                  : -1
              const stacked = cut === -1 ? s.blocks : s.blocks.slice(0, cut + 1)

              // Text the section's rebuilt tables now draw themselves. The
              // crops cut several tables off early and the remainder was
              // extracted as loose paragraphs, so without this the page prints
              // those rows twice — once in the table, once as running text.
              const absorbed = new Set(
                stacked.flatMap((b) =>
                  b.type === 'figure' ? paperTables[b.src]?.absorbs ?? [] : []
                )
              )
              const visible = absorbed.size
                ? stacked.filter((b) => !(b.type === 'p' && absorbed.has(b.text.trim())))
                : stacked

              return (
                // The thesis's references came out of the PDF as an ordinary
                // section — it groups them under h3 subheadings, which the flat
                // `references: string[]` field can't express — so they'd render
                // as body copy. The class hands them the reference treatment
                // (see .paper-section-references in Paper.css).
                <section
                  key={s.id}
                  className={`paper-section${s.id === 'references' ? ' paper-section-references' : ''}`}
                >
                  <h2 id={s.id} className="paper-section-title">{s.title}</h2>
                  {(carouselSections.has(s.id)
                    ? groupFigures(visible, figureLabels)
                    : visible
                  ).map(renderBlock)}
                  {cut !== -1 && explorer ? (
                    <SurveyExplorer heading={explorer.afterHeading} />
                  ) : null}
                </section>
              )
            })}

            {showFull && paper.references?.length ? (
              <section className="paper-section">
                <h2 id="references" className="paper-section-title">References</h2>
                <ul className="paper-references">
                  {paper.references.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        </div>
      </div>

      <Footer />
      <ScrollButton />
    </div>
  )
}

export default Paper;
