import React, { useEffect, useRef, useState } from 'react'
import PdfModal, { withViewerParams } from './PdfModal'
import ArrowOut from './ArrowOut'
import './../styling/components/Projects.css'

const works = [
  {
    tag: 'CS Capstone',
    date: 'Aug 2025 – May 2026',
    title: 'Shipment Quoting Microservice',
    desc: 'Architected a high-throughput relational caching layer using PostgreSQL and Flask within a Dockerized microservice environment, intercepting and caching external carrier API responses to reduce redundant network calls. Achieved a 64.4% reduction in processing latency (334ms →︎ 119ms) — a 2.8x speedup over live API calls.',
    pdfSrc: '/pdfs/cs-capstone.pdf',
    linkLabel: 'View Poster',
  },
  {
    tag: 'Barrett Honors Thesis',
    date: 'Aug 2025 – May 2026',
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    desc: 'Investigated the divergence between the economic outcomes of the 2018–2020 U.S.–China trade war and the public\'s perception of those outcomes.The thesis utilizes a survey to gather public perception of international trade policy and employs Natural Language Processing (NLP) to identify the key drivers of public perception towards trade. The paper identifies key substructures in the results and finds formal education, price sensitivity, and media influence to be the largest factors affecting trade opinions.',
    link: 'https://keep.lib.asu.edu/items/203948',
    linkLabel: 'Read Paper',
  },
  {
    tag: 'Economics Capstone',
    date: 'Aug – Dec 2025',
    title: 'Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment',
    desc: 'Analyzed the macroeconomic feasibility and behavioral trade-offs of UBI versus targeted welfare systems. Drawing on empirical data and policy models from five recent global studies across developing nations (South Africa, Indonesia, Peru) and developed economies (U.S., Finland, New Zealand), the paper evaluates how funding mechanisms — consumption vs. income taxes — affect GDP growth, employment incentives, and long-term fiscal sustainability.',
    pdfSrc: '/pdfs/basic-income.pdf',
    linkLabel: 'Read Paper',
  },
  {
    tag: 'Independent Research',
    date: 'Jun 2026 – Current',
    wip: true,
    title: 'Estimating the Wage Effects of a Universal Basic Income',
    desc: 'Applied Double Machine Learning (LinearDML and CausalForestDML) to longitudinal CPS ASEC microdata to estimate the causal effect of unconditional cash transfers on future labor income, then used the model to simulate the predicted wage impact of a $6,000/year UBI program. Used XGBoost within the DoubleML framework to control for nonlinear confounding across demographic and socioeconomic variables.',
    link: 'https://github.com/kianjavaheri/welfare-model',
    linkLabel: 'View GitHub',
  },
  {
    tag: 'Personal Project',
    date: 'Current',
    wip: true,
    title: 'Materials GUI',
    desc: 'Materials GUI is a client-side Fabric mod for Minecraft 26.2 that makes gathering materials for a build easier, and it works on servers that don\'t have it installed. You import a material list by pasting text, loading a Litematica export, or dropping in a screenshot that Claude reads. Then you mark chests, barrels or shulker boxes as Material Boxes. Items already in them count toward the list and are crossed off when complete. Empty slots show faded icons of what\'s still missing, and slots are colour-coded: red for empty, yellow for partly filled, green for full. Hovering a slot shows its progress, like “3/5”, plus the total across all boxes. Shift-clicking an item from your inventory sends it straight to its highlighted slots, but you can still put items anywhere and the highlights rearrange to match. Broken boxes are removed automatically, and a Boxes screen lets you remove any box yourself.',
  },
]

interface WorkProps {
  tag: string
  date: string
  wip?: boolean
  title: string
  desc: string
  pdfSrc?: string
  link?: string
  linkLabel?: string
  onOpenPdf?: (src: string) => void
}

// Collapsed rows show this many lines of the description. Keep in step with
// the max-height in .project-desc-clamped.
const COLLAPSED_LINES = 2

function WorkCard({ tag, date, wip, title, desc, pdfSrc, link, linkLabel, onOpenPdf }: WorkProps) {
  const [open, setOpen] = useState(false)
  const [fullHeight, setFullHeight] = useState(0)
  const [canExpand, setCanExpand] = useState(false)
  const descRef = useRef<HTMLParagraphElement>(null)

  // The expanded height is measured rather than set to `auto`, which max-height
  // can't transition to. Remeasured on resize, since rewrapping changes it.
  useEffect(() => {
    const el = descRef.current
    if (!el) return
    const measure = () => {
      const clamp = parseFloat(getComputedStyle(el).lineHeight) * COLLAPSED_LINES
      setFullHeight(el.scrollHeight)
      setCanExpand(el.scrollHeight > clamp + 1)
    }
    measure()
    const ro = new ResizeObserver(measure)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const expanded = open && canExpand

  // Measured again at click time: the observer's last reading can lag a resize
  // by a frame, and opening to a stale height would clip the text.
  const toggle = () => {
    if (descRef.current) setFullHeight(descRef.current.scrollHeight)
    setOpen(!open)
  }

  return (
    <div
      className={`sub-card project-card ${canExpand ? 'project-card-expandable' : ''}`}
      onClick={canExpand ? toggle : undefined}
    >
      <div className="project-card-meta">
        <span className="project-tag">{tag}{wip && <span className="project-wip">WIP</span>}</span>
        <span className="project-date">{date}</span>
      </div>
      <div className="project-body">
        <div className="project-title-row">
          <h2 className="project-title">{title}</h2>
          {canExpand && <span className="card-toggle-icon">{expanded ? '−' : '+'}</span>}
        </div>
        <p
          ref={descRef}
          className={`project-desc ${expanded ? '' : 'project-desc-clamped'} ${canExpand && !expanded ? 'project-desc-faded' : ''}`}
          style={expanded ? { maxHeight: fullHeight } : undefined}
        >
          {desc}
        </p>
      </div>
      {/* Optional — a project with nothing to link to yet renders no link row. */}
      {(pdfSrc || link) && (
        // Links act on their own — they must not also toggle the row.
        <div className="project-links" onClick={(e) => e.stopPropagation()}>
          {pdfSrc ? (
            <button
              type="button"
              className="project-link"
              onClick={() => onOpenPdf?.(pdfSrc)}
            >
              {linkLabel}<ArrowOut />
            </button>
          ) : (
            <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
              {linkLabel}<ArrowOut />
            </a>
          )}
        </div>
      )}
    </div>
  )
}

function Projects() {
  const [open, setOpen] = useState(false)
  const [activePdf, setActivePdf] = useState<string | null>(null)

  const openPdf = (src: string) => {
    if (window.innerWidth <= 768) {
      window.open(withViewerParams(src), '_blank', 'noopener,noreferrer')
    } else {
      setActivePdf(src)
    }
  }
  const closePdf = () => setActivePdf(null)

  return (
    <>
      <section id="projects" className={`section-card projects-section ${open ? 'section-open' : ''}`}>
        <div className="card-header" onClick={() => setOpen(!open)}>
          <span className="card-title">Selected Work</span>
          <span className="card-toggle-icon">{open ? '−' : '+'}</span>
        </div>
        <div className="section-body-wrapper">
          <div className="section-body-inner">
            <div className="sub-cards-stack">
              {works.map((w, i) => (
                <WorkCard key={i} {...w} onOpenPdf={openPdf} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {activePdf && <PdfModal src={activePdf} onClose={closePdf} />}
    </>
  )
}

export default Projects;
