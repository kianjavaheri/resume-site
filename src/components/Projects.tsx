import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import PdfModal, { withViewerParams } from './PdfModal'
import LinkIcon from './LinkIcon'
import ArrowOut from './ArrowOut'
import Tags from './Tags'
import './../styling/components/Projects.css'

// Annotated so each link's `icon` is checked against the union below rather
// than widening to string.
const works: Array<Omit<WorkProps, 'onOpenPdf'>> = [
  {
    tag: 'CS Capstone',
    title: 'Shipment Quoting Microservice',
    desc: 'Architected a high-throughput relational caching layer using PostgreSQL and Flask within a Dockerized microservice environment, intercepting and caching external carrier API responses to reduce redundant network calls. Achieved a 64.4% reduction in processing latency (334ms →︎ 119ms) — a 2.8x speedup over live API calls.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'Docker'],
    links: [
      { label: 'Read Poster', short: 'Read', icon: 'paper', to: '/papers/cs-capstone' },
      { label: 'View PDF', short: 'PDF', icon: 'pdf', pdfSrc: '/pdfs/cs-capstone/cs-capstone.pdf' },
    ],
  },
  {
    tag: 'Barrett Honors Thesis',
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    desc: 'Investigated the divergence between the economic outcomes of the 2018–2020 U.S.–China trade war and the public\'s perception of those outcomes. The thesis utilizes a survey to gather public perception of international trade policy and employs Natural Language Processing (NLP) to identify the key drivers of public perception towards trade. The paper identifies key substructures in the results and finds formal education, price sensitivity, and media influence to be the largest factors affecting trade opinions.',
    tags: ['NLP', 'Survey Research', 'Qualtrics'],
    links: [
      { label: 'Read Paper', short: 'Read', icon: 'paper', to: '/papers/thesis' },
      { label: 'View in ASU Library', short: 'ASU Library', icon: 'library', href: 'https://keep.lib.asu.edu/items/203948' },
    ],
  },
  {
    tag: 'Economics Capstone',
    title: 'Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment',
    desc: 'Analyzed the macroeconomic feasibility and behavioral trade-offs of UBI versus targeted welfare systems. Drawing on empirical data and policy models from five recent global studies across developing nations (South Africa, Indonesia, Peru) and developed economies (U.S., Finland, New Zealand), the paper evaluates how funding mechanisms — consumption vs. income taxes — affect GDP growth, employment incentives, and long-term fiscal sustainability.',
    tags: ['Macroeconomics', 'Policy Analysis'],
    links: [
      { label: 'Read Paper', short: 'Read', icon: 'paper', to: '/papers/basic-income' },
      { label: 'View PDF', short: 'PDF', icon: 'pdf', pdfSrc: '/pdfs/basic-income/basic-income.pdf' },
    ],
  },
  {
    tag: 'Independent Research',
    title: 'Estimating the Wage Effects of a Universal Basic Income',
    desc: 'Applied Double Machine Learning (LinearDML and CausalForestDML) to longitudinal CPS ASEC microdata to estimate the causal effect of unconditional cash transfers on future labor income, then used the model to simulate the predicted wage impact of a $6,000/year UBI program. Used XGBoost within the DoubleML framework to control for nonlinear confounding across demographic and socioeconomic variables.',
    tags: ['Python', 'EconML', 'XGBoost', 'Causal Inference'],
    links: [{ label: 'View GitHub', short: 'GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/welfare-model' }],
  },
  {
    tag: 'Personal Project',
    title: 'Santa Cruz Rental Price Model',
    desc: 'Built an end-to-end rent prediction model for studios and one-bedrooms in Santa Cruz and Monterey counties, from a RentCast data pipeline through geographic feature engineering to a gradient-boosted model with calibrated prediction intervals. Deployed it as a static web app that reruns the model client-side in JavaScript, so anyone can type an address and get a price with an honest uncertainty range.',
    tags: ['LightGBM', 'Ridge Regression', 'Gradient Boosting', 'Feature Engineering'],
    links: [
      { label: 'View Live Site', short: 'Live Site', icon: 'site', href: 'https://rental-prices.vercel.app/' },
      { label: 'View GitHub', short: 'GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/rental-prices' },
    ],
  },
  {
    tag: 'Personal Project',
    wip: true,
    release: 'Version 1.1.0',
    title: 'Material Boxes',
    desc: 'Built a client-side Fabric mod for Minecraft 26.2 that tracks the materials needed for a build, and works on servers that don\'t have it installed. Players import a material list by pasting text, loading a Litematica export, or dropping in a screenshot that Claude reads. Chests, barrels and shulker boxes marked as Material Boxes then count what\'s already stored, color-code each slot by progress, and route shift-clicked items straight to the slots that still need them.',
    tags: ['Java', 'Fabric', 'Minecraft Modding', 'Claude API'],
    links: [
      { label: 'View CurseForge', short: 'Curse\u200BForge', icon: 'curseforge', href: 'https://www.curseforge.com/minecraft/mc-mods/material-boxes' },
      { label: 'View GitHub', short: 'GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/material-boxes' },
    ],
  },
]

// A link opens the PDF modal (pdfSrc), an outbound page (href), or a page on
// this site (to — e.g. a paper's reading page).
interface WorkLink {
  // The button's accessible name and tooltip. Keep the visible `short` text a
  // subset of it ("Read" ⊂ "Read Paper"), so the name matches what's on screen.
  label: string
  // Visible text beside the icon — short, because the column is 200px wide.
  short: string
  icon: 'paper' | 'pdf' | 'library' | 'site' | 'github' | 'curseforge'
  pdfSrc?: string
  href?: string
  to?: string
}

interface WorkProps {
  tag: string
  wip?: boolean
  // Shipped version, e.g. 'Version 1.0.0'. Green badge, left of the WIP one.
  release?: string
  title: string
  desc: string
  tags?: string[]
  links?: WorkLink[]
  onOpenPdf?: (src: string) => void
}

// Always open. These rows used to clamp to a two-line preview like the
// Experience cards, but the descriptions are short enough that most of them
// cleared the clamp outright — so the section was a row of `+` icons where
// only some did anything, and the one card that couldn't expand also lost the
// hover tint, which read as a bug. Nothing is hidden now, so there is no
// toggle, and `.hover-card` gives every row the tint without the pointer
// cursor that `.expandable-card` carries (see App.css).
function WorkCard({ tag, wip, release, title, desc, tags, links, onOpenPdf }: WorkProps) {
  return (
    <div className="sub-card project-card hover-card">
      <div className="project-card-meta">
        <span className="project-tag">{tag}</span>
      </div>
      <div className="project-body">
        {/* Badge is inline in the title, so on a wrapping title it follows
            the last word rather than floating beside the first line. */}
        <h2 className="project-title">
          {title}
          {(release || wip) && (
            // Grouped so the badges wrap as a unit — on a phone WIP used to
            // break onto a line of its own, away from the release badge.
            <span className="project-badges">
              {release && <span className="project-release">{release}</span>}
              {wip && <span className="project-wip">WIP</span>}
            </span>
          )}
        </h2>
        <p className="project-desc">{desc}</p>
        <Tags tags={tags} />
      </div>
      {/* Optional — a project with nothing to link to yet renders no links. */}
      {links?.length ? (
        // No stopPropagation any more: the card itself has no click handler to
        // swallow, so the links are the only thing here that acts on a click.
        <div className="project-links">
          {links.map((l) => (
            l.to ? (
              <Link key={l.label} to={l.to} className="project-icon-link" aria-label={l.label} title={l.label}>
                <LinkIcon kind={l.icon} />
                <span className="project-icon-label">{l.short}</span>
                <ArrowOut />
              </Link>
            ) : l.pdfSrc ? (
              <button
                key={l.label}
                type="button"
                className="project-icon-link"
                aria-label={l.label}
                title={l.label}
                onClick={() => onOpenPdf?.(l.pdfSrc!)}
              >
                <LinkIcon kind={l.icon} />
                <span className="project-icon-label">{l.short}</span>
                <ArrowOut />
              </button>
            ) : (
              <a
                key={l.label}
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-icon-link"
                aria-label={l.label}
                title={l.label}
              >
                <LinkIcon kind={l.icon} />
                <span className="project-icon-label">{l.short}</span>
                <ArrowOut />
              </a>
            )
          ))}
        </div>
      ) : null}
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
            <div className="sub-cards-stack work-stack">
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
