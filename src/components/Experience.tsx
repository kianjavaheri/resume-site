import React, { useState } from 'react'
import Tags from './Tags'
import { useClampedExpand } from './useClampedExpand'
import './../styling/Experience.css'

interface ExpCardProps {
  company: string
  location: string
  date: string
  logo: string
  role: string
  tags?: string[]
  // The preview is the first two lines of the first child, so lead with text.
  children: React.ReactNode
}

// One role per card. Collapsed to a two-line preview; the tags stay visible
// below the clamp. Shares its expand behaviour with the Selected Work rows.
function ExpCard({ company, location, date, logo, role, tags, children }: ExpCardProps) {
  const { innerRef, expanded, canExpand, toggle, style, clampClass } = useClampedExpand()

  return (
    <div
      className={`sub-card experience-item ${canExpand ? 'expandable-card' : ''} ${expanded ? 'exp-expanded' : ''}`}
      onClick={canExpand ? toggle : undefined}
    >
      <div className="exp-meta">
        <p className="exp-company">{company}</p>
        <p className="exp-location">{location}</p>
        <p className="exp-date">{date}</p>
        {/* Only shown while expanded — collapsed, it would set the card's
            height on its own. Decorative: the company name is right above. */}
        <div className="exp-logo-wrap">
          <div className="exp-logo-inner">
            <img src={logo} className="exp-org-logo" alt="" />
          </div>
        </div>
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
              location="Livermore, CA"
              date="May 2023 – Aug 2024"
              logo="/svgs/sandia.svg"
              role="R&D Bioresource and Environment Security Year-round Intern"
              tags={['QGIS', 'Optimization', 'Geospatial Data']}
            >
              <p className="exp-desc">
                At Sandia National Laboratories, I developed a standalone tool that optimizes theoretical cashflow for bioresource systems using configurable
                optimization algorithms tailored to user inputs. I also built a QGIS plugin that builds a geospatial
                map of county-dependent feedstock (fuel for energy conversion) prices. Users are allowed to select and trial different U.S. counties and to see how energy prices affect project cashflow.
                I collaborated closely with my mentor to build out this tool and communicate key milestones and findings through presentations.
              </p>
              <ul className="exp-bullets">
                <li>Engineered a standalone optimization tool that ingests inputs across multiple bioresource systems and maximizes cashflow using configurable optimization algorithms, reducing manual analysis time for research teams.</li>
                <li>Developed a QGIS plugin that parses U.S. county shapefile datasets and overlays them with energy price data to surface different feedstock sourcing.</li>
              </ul>
            </ExpCard>

            <ExpCard
              company="Arizona State University"
              location="Tempe, AZ"
              date="May 2025 – May 2026"
              logo="/svgs/asu.svg"
              role="Undergraduate Research Assistant"
              tags={['Python', 'Selenium', 'OCR', 'Web Scraping']}
            >
              <p className="exp-desc">
                Supervised by Professor Michael Hanemann, I built a web scraper using the Selenium Python library to collect
                annual report documents from the Arizona Department of Water Resources (ADWR). I also built
                OCR scripts to extract and parse data from the collected reports and structured the output
                into clean CSV files for econometric analysis.
              </p>
              <ul className="exp-bullets">
                <li>Automated large-scale document retrieval from the ADWR using Selenium WebDriver, eliminating manual collection across hundreds of annual reports.</li>
                <li>Built OCR extraction pipelines to parse and structure tabular data from scanned PDFs, producing clean, analysis-ready datasets for econometric modeling.</li>
              </ul>
            </ExpCard>

            <ExpCard
              company="Arizona State University"
              location="Tempe, AZ"
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
                    <li>Led review sessions covering red-black trees, dynamic programming, and minimum spanning tree algorithms (Kruskal's and Prim's), improving class comprehension ahead of the final exam.</li>
                    <li>Held 5+ office hours weekly, guiding students through complex coding assignments and algorithm design challenges.</li>
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
