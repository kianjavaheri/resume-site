import React, { useState, useEffect, useCallback } from 'react'
import './../styling/components/Projects.css'

const works = [
  {
    tag: 'CS Capstone',
    title: 'Shipment Quoting Microservice',
    desc: 'Architected a high-throughput relational caching layer using PostgreSQL and Flask within a Dockerized microservice environment, intercepting and caching external carrier API responses to reduce redundant network calls. Achieved a 64.4% reduction in processing latency (334ms → 119ms) — a 2.8x speedup over live API calls.',
    pdfSrc: '/pdfs/cs-capstone.pdf',
    linkLabel: 'View Poster ↗',
  },
  {
    tag: 'Barrett Honors Thesis',
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    desc: 'Investigated the divergence between the economic outcomes of the 2018–2020 U.S.–China trade war and the public\'s perception of those outcomes. Empirical evidence points to complete tariff pass-through to U.S. importers and consumers, resulting in $1.4B/month in deadweight loss. The paper examines how partisan affiliation and media framing drove public support despite these costs, and offers frameworks for better policy communication.',
    link: 'https://keep.lib.asu.edu/items/203948',
    linkLabel: 'Read Paper ↗',
  },
  {
    tag: 'Economics Capstone',
    title: 'Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment',
    desc: 'Analyzed the macroeconomic feasibility and behavioral trade-offs of UBI versus targeted welfare systems. Drawing on empirical data and policy models from five recent global studies across developing nations (South Africa, Indonesia, Peru) and developed economies (U.S., Finland, New Zealand), the paper evaluates how funding mechanisms — consumption vs. income taxes — affect GDP growth, employment incentives, and long-term fiscal sustainability.',
    pdfSrc: '/pdfs/basic-income.pdf',
    linkLabel: 'Read Paper ↗',
  },
]

interface PDFModalProps {
  src: string
  onClose: () => void
}

function PDFModal({ src, onClose }: PDFModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
  }, [])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="pdf-close" onClick={onClose} aria-label="Close">×</button>
        <iframe src={src} className="pdf-frame" title="Document viewer" />
      </div>
    </div>
  )
}

interface WorkProps {
  tag: string
  title: string
  desc: string
  pdfSrc?: string
  link?: string
  linkLabel: string
  onOpenPdf?: (src: string) => void
}

function WorkCard({ tag, title, desc, pdfSrc, link, linkLabel, onOpenPdf }: WorkProps) {
  return (
    <div className="project-card">
      <span className="project-tag">{tag}</span>
      <h2 className="project-title">{title}</h2>
      <p className="project-desc">{desc}</p>
      <div className="project-links">
        {pdfSrc ? (
          <button
            type="button"
            className="project-link"
            onClick={() => onOpenPdf?.(pdfSrc)}
          >
            {linkLabel}
          </button>
        ) : (
          <a href={link} target="_blank" rel="noopener noreferrer" className="project-link">
            {linkLabel}
          </a>
        )}
      </div>
    </div>
  )
}

function Projects() {
  const [open, setOpen] = useState(false)
  const [activePdf, setActivePdf] = useState<string | null>(null)

  const openPdf = (src: string) => setActivePdf(src)
  const closePdf = () => setActivePdf(null)

  return (
    <>
      <section id="projects" className={`projects-section ${open ? 'section-open' : ''}`}>
        <button className="section-header" onClick={() => setOpen(!open)}>
          <span className="section-label">Selected Work</span>
          <span className="section-toggle-icon">{open ? '−' : '+'}</span>
        </button>
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

      {activePdf && <PDFModal src={activePdf} onClose={closePdf} />}
    </>
  )
}

export default Projects;
