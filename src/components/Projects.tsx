import React, { useState } from 'react'
import PdfModal, { withViewerParams } from './PdfModal'
import ArrowOut from './ArrowOut'
import Tags from './Tags'
import { useClampedExpand } from './useClampedExpand'
import './../styling/components/Projects.css'

const works = [
  {
    tag: 'CS Capstone',
    title: 'Shipment Quoting Microservice',
    desc: 'Architected a high-throughput relational caching layer using PostgreSQL and Flask within a Dockerized microservice environment, intercepting and caching external carrier API responses to reduce redundant network calls. Achieved a 64.4% reduction in processing latency (334ms →︎ 119ms) — a 2.8x speedup over live API calls.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'Docker'],
    pdfSrc: '/pdfs/cs-capstone.pdf',
    linkLabel: 'View Poster',
  },
  {
    tag: 'Barrett Honors Thesis',
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    desc: 'Investigated the divergence between the economic outcomes of the 2018–2020 U.S.–China trade war and the public\'s perception of those outcomes.The thesis utilizes a survey to gather public perception of international trade policy and employs Natural Language Processing (NLP) to identify the key drivers of public perception towards trade. The paper identifies key substructures in the results and finds formal education, price sensitivity, and media influence to be the largest factors affecting trade opinions.',
    tags: ['NLP', 'Survey Research', 'Qualtrics'],
    link: 'https://keep.lib.asu.edu/items/203948',
    linkLabel: 'Read Paper',
  },
  {
    tag: 'Economics Capstone',
    title: 'Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment',
    desc: 'Analyzed the macroeconomic feasibility and behavioral trade-offs of UBI versus targeted welfare systems. Drawing on empirical data and policy models from five recent global studies across developing nations (South Africa, Indonesia, Peru) and developed economies (U.S., Finland, New Zealand), the paper evaluates how funding mechanisms — consumption vs. income taxes — affect GDP growth, employment incentives, and long-term fiscal sustainability.',
    tags: ['Macroeconomics', 'Policy Analysis'],
    pdfSrc: '/pdfs/basic-income.pdf',
    linkLabel: 'Read Paper',
  },
  {
    tag: 'Independent Research',
    wip: true,
    title: 'Estimating the Wage Effects of a Universal Basic Income',
    desc: 'Applied Double Machine Learning (LinearDML and CausalForestDML) to longitudinal CPS ASEC microdata to estimate the causal effect of unconditional cash transfers on future labor income, then used the model to simulate the predicted wage impact of a $6,000/year UBI program. Used XGBoost within the DoubleML framework to control for nonlinear confounding across demographic and socioeconomic variables.',
    tags: ['Python', 'EconML', 'XGBoost', 'Causal Inference'],
    link: 'https://github.com/kianjavaheri/welfare-model',
    linkLabel: 'View GitHub',
  },
  {
    tag: 'Personal Project',
    wip: true,
    title: 'Material Boxes',
    desc: 'Built a client-side Fabric mod for Minecraft 26.2 that tracks the materials needed for a build, and works on servers that don\'t have it installed. Players import a material list by pasting text, loading a Litematica export, or dropping in a screenshot that Claude reads. Chests, barrels and shulker boxes marked as Material Boxes then count what\'s already stored, color-code each slot by progress, and route shift-clicked items straight to the slots that still need them.',
    tags: ['Java', 'Fabric', 'Minecraft Modding', 'Claude API'],
    link: 'https://github.com/kianjavaheri/material-boxes',
    linkLabel: 'View GitHub',
  },
]

interface WorkProps {
  tag: string
  wip?: boolean
  title: string
  desc: string
  tags?: string[]
  pdfSrc?: string
  link?: string
  linkLabel?: string
  onOpenPdf?: (src: string) => void
}

function WorkCard({ tag, wip, title, desc, tags, pdfSrc, link, linkLabel, onOpenPdf }: WorkProps) {
  const { innerRef, expanded, canExpand, toggle, style, clampClass } = useClampedExpand()

  return (
    <div
      className={`sub-card project-card ${canExpand ? 'expandable-card' : ''}`}
      onClick={canExpand ? toggle : undefined}
    >
      <div className="project-card-meta">
        <span className="project-tag">{tag}</span>
      </div>
      <div className="project-body">
        <div className="card-title-row">
          {/* Badge is inline in the title, so on a wrapping title it follows
              the last word rather than floating beside the first line. */}
          <h2 className="project-title">{title}{wip && <span className="project-wip">WIP</span>}</h2>
          {canExpand && <span className="card-toggle-icon">{expanded ? '−' : '+'}</span>}
        </div>
        <div className={clampClass} style={style}>
          <div ref={innerRef}>
            <p className="project-desc">{desc}</p>
          </div>
        </div>
        <Tags tags={tags} />
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
  const [open, setOpen] = useState(true)
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
