import React, { useState } from 'react'
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
]

interface WorkProps {
  tag: string
  date: string
  wip?: boolean
  title: string
  desc: string
  pdfSrc?: string
  link?: string
  linkLabel: string
  onOpenPdf?: (src: string) => void
}

function WorkCard({ tag, date, wip, title, desc, pdfSrc, link, linkLabel, onOpenPdf }: WorkProps) {
  return (
    <div className="sub-card project-card">
      <div className="project-card-meta">
        <span className="project-tag">{tag}{wip && <span className="project-wip">WIP</span>}</span>
        <span className="project-date">{date}</span>
      </div>
      <h2 className="project-title">{title}</h2>
      <p className="project-desc">{desc}</p>
      <div className="project-links">
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
            <div className="projects-grid">
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
