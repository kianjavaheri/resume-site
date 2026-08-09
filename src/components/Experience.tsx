import React, { useState } from 'react'
import './../styling/Experience.css'

function Experience() {
  const [open, setOpen] = useState(true)

  return (
    <section id="experience" className={`section-card experience-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Experience</span>
      </div>

      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack">

            {/* Sandia National Laboratories */}
            <div className="sub-card experience-item">
              <div className="exp-meta">
                <p className="exp-company">Sandia National Laboratories</p>
                <p className="exp-location">Livermore, CA</p>
                <p className="exp-date">May 2023 – Aug 2024</p>
                <img src="/svgs/sandia.svg" className="exp-org-logo" alt="Sandia National Laboratories" />
              </div>
              <div className="exp-content">
                <p className="exp-role">R&D Bioresource and Environment Security Year-round Intern</p>
                <p className="exp-desc">
                  Developed a standalone tool that optimizes profits in bioresource systems using configurable
                  optimization algorithms tailored to user inputs. Built a QGIS plugin that analyzes geospatial
                  data and surfaces optimal feedstock pricing locations based on user-defined material quantities.
                  Collaborated closely with my mentor to build out both tools and communicate key milestones
                  through presentations.
                </p>
                <ul className="exp-bullets">
                  <li>Engineered a standalone optimization tool that ingests inputs across multiple bioresource systems and maximizes profit yields using configurable optimization algorithms, reducing manual analysis time for research teams.</li>
                  <li>Developed a QGIS geospatial plugin that parses spatial datasets and surfaces optimal feedstock sourcing locations based on user-defined material quantities and cost constraints.</li>
                </ul>
              </div>
            </div>

            {/* Arizona State University — combined card */}
            <div className="sub-card experience-item">
              <div className="exp-meta">
                <p className="exp-company">Arizona State University</p>
                <p className="exp-location">Tempe, AZ</p>
                <img src="/svgs/asu.svg" className="exp-org-logo" alt="Arizona State University" />
              </div>
              <div className="exp-content">
                <div className="exp-timeline">

                  {/* Most recent: Research Assistant */}
                  <div className="exp-timeline-item">
                    <div className="exp-tl-left">
                      <div className="exp-tl-dot" />
                      <div className="exp-tl-line" />
                    </div>
                    <div className="exp-tl-body">
                      <div className="exp-tl-header">
                        <p className="exp-role">Undergraduate Research Assistant</p>
                        <p className="exp-date">May 2025 – May 2026</p>
                      </div>
                      <p className="exp-desc">
                        Supervised by Professor Michael Hanemann. Built a web scraper using Selenium to collect
                        annual report documents from the Arizona Department of Water Resources (ADWR). Wrote
                        OCR extraction scripts to parse data from the collected reports and structured the output
                        into clean CSV files for downstream econometric modeling.
                      </p>
                      <ul className="exp-bullets">
                        <li>Automated large-scale document retrieval from the ADWR using Selenium WebDriver, eliminating manual collection across hundreds of annual reports.</li>
                        <li>Built OCR extraction pipelines to parse and structure tabular data from scanned PDFs, producing clean, analysis-ready datasets for downstream econometric modeling.</li>
                      </ul>
                    </div>
                  </div>

                  {/* Oldest: Teaching Assistant */}
                  <div className="exp-timeline-item">
                    <div className="exp-tl-left">
                      <div className="exp-tl-dot" />
                    </div>
                    <div className="exp-tl-body">
                      <div className="exp-tl-header">
                        <p className="exp-role">Undergraduate Teaching Assistant</p>
                        <p className="exp-date">Aug 2023 – May 2024</p>
                      </div>
                      <div className="exp-ta-rows">
                        <div className="exp-ta-row">
                          <div className="exp-ta-meta">
                            <span className="exp-ta-course">FSE 150: Intro to Grand Challenges</span>
                            <span className="exp-ta-date">Aug – Dec. 2023</span>
                          </div>
                          <p className="exp-ta-prof">Prof. Amy Trowbridge</p>
                          <ul className="exp-bullets">
                            <li>Facilitated weekly engineering discussions for a class of ~30, reinforcing problem-solving frameworks and interdisciplinary thinking.</li>
                          </ul>
                        </div>
                        <div className="exp-ta-row">
                          <div className="exp-ta-meta">
                            <span className="exp-ta-course">CSE 310: Data Structures & Algorithms</span>
                            <span className="exp-ta-date">Jan – May 2024</span>
                          </div>
                          <p className="exp-ta-prof">Prof. Xuerong Feng</p>
                          <ul className="exp-bullets">
                            <li>Led exam review sessions covering red-black trees, dynamic programming, and minimum spanning tree algorithms (Kruskal's and Prim's), improving class comprehension ahead of high-stakes assessments.</li>
                            <li>Held 5+ office hours per week, guiding students through complex coding assignments and algorithm design challenges.</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Experience;
