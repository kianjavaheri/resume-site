import React, { useState } from 'react'
import Tags from './Tags'
import CalendarIcon from './CalendarIcon'
import { useClampedExpand } from './useClampedExpand'
import './../styling/Experience.css'

interface ExpCardProps {
  company: string
  date: string
  logo: string
  role: string
  tags?: string[]
  // The preview is the first two lines of the first child, so lead with text.
  children: React.ReactNode
}

// One role per card. Collapsed to a two-line preview; the tags stay visible
// below the clamp. Shares its expand behaviour with the Selected Work rows.
function ExpCard({ company, date, logo, role, tags, children }: ExpCardProps) {
  const { innerRef, expanded, canExpand, toggle, style, clampClass } = useClampedExpand()

  return (
    <div
      className={`sub-card experience-item ${canExpand ? 'expandable-card' : ''}`}
      onClick={canExpand ? toggle : undefined}
    >
      <div className="exp-meta">
        <div className="exp-meta-head">
          {/* Decorative: the company name is right beside it. */}
          <div className="exp-logo">
            <img src={logo} className="exp-org-logo" alt="" />
          </div>
          <p className="exp-company">{company}</p>
        </div>
        {/* Its own row under the tile, so it gets the column's full width
            rather than the ~132px the tile leaves beside it. */}
        <span className="exp-date"><CalendarIcon />{date}</span>
      </div>
      <div className="exp-content">
        <div className="card-title-row">
          <p className="exp-role">{role}</p>
          {canExpand && <span className="card-toggle-icon">{expanded ? '−' : '+'}</span>}
        </div>
        <div className={clampClass} style={style}>
          <div ref={innerRef} className="exp-details">{children}</div>
        </div>
        <Tags tags={tags} />
      </div>
    </div>
  )
}

function Experience() {
  const [open, setOpen] = useState(true)

  return (
    <section id="experience" className={`section-card experience-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Experience</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>

      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack">

            <ExpCard
              company="Sandia National Laboratories"
              date="May 2023 – Aug 2024"
              logo="/svgs/sandia.svg"
              role="R&D Bioresource and Environment Security Year-round Intern"
              tags={['Python', 'Pandas', 'QGIS', 'Optimization', 'Geospatial Data']}
            >
              <p className="exp-desc">
                I built a standalone tool that optimizes cash flow for bioresource systems, plus a QGIS plugin
                mapping county-dependent feedstock — the fuel for energy conversion — so users can trial different
                U.S. counties and see how energy prices affect project cash flow. I worked closely with my mentor
                and presented milestones and findings throughout.
              </p>
              <ul className="exp-bullets">
                <li>Led and designed a standalone optimization tool in Python that ingests operational data across multiple bioresource systems and maximizes projected cash flow via configurable optimization algorithms.</li>
                <li>Created and validated shapefile datasets, then engineered a companion QGIS plugin in Python that connects to the optimization tool via an internal API, letting users gauge how different feedstock locations affect profit yields.</li>
              </ul>
            </ExpCard>

            <ExpCard
              company="Arizona State University"
              date="May 2025 – May 2026"
              logo="/svgs/asu.svg"
              role="Junior Researcher"
              tags={['Python', 'Selenium', 'OCR', 'Web Scraping']}
            >
              <p className="exp-desc">
                Supervised by Professor Michael Hanemann, I built a Selenium scraper that collects annual reports
                from the Arizona Department of Water Resources (ADWR), then OCR scripts that parse them into clean
                CSVs for econometric analysis.
              </p>
              <ul className="exp-bullets">
                <li>Automated large-scale document retrieval from the ADWR using Selenium WebDriver, eliminating manual collection across hundreds of annual reports.</li>
                <li>Built OCR extraction pipelines to parse and structure tabular data from scanned PDFs, producing clean, analysis-ready datasets for econometric modeling.</li>
              </ul>
            </ExpCard>

            <ExpCard
              company="Arizona State University"
              date="Aug 2023 – May 2024"
              logo="/svgs/asu.svg"
              role="Undergraduate Teaching Assistant"
              tags={['Data Structures', 'Algorithms', 'Teaching']}
            >
              {/* CSE 310 leads, not chronological: it's the role that matters
                  most to employers, and the first row is the collapsed preview. */}
              <div className="exp-ta-rows">
                <div className="exp-ta-row">
                  <div className="exp-ta-meta">
                    <span className="exp-ta-course">CSE 310 — Data Structures & Algorithms</span>
                    <span className="exp-ta-date">Jan – May 2024</span>
                  </div>
                  <p className="exp-ta-prof">Prof. Xuerong Feng</p>
                  <ul className="exp-bullets">
                    <li>Led exam review sessions on red-black trees, dynamic programming, and minimum spanning tree algorithms (Kruskal's and Prim's).</li>
                    <li>Held 5+ office hours per week, guiding students through coding assignments and algorithm design challenges.</li>
                  </ul>
                </div>
                <div className="exp-ta-row">
                  <div className="exp-ta-meta">
                    <span className="exp-ta-course">FSE 150 — Intro to Grand Challenges</span>
                    <span className="exp-ta-date">Aug – Dec 2023</span>
                  </div>
                  <p className="exp-ta-prof">Prof. Amy Trowbridge</p>
                  <ul className="exp-bullets">
                    <li>Facilitated weekly engineering discussions for a class of ~30, reinforcing interdisciplinary thinking within an engineering context.</li>
                  </ul>
                </div>
              </div>
            </ExpCard>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience;
