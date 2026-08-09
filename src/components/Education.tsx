import React, { useState } from 'react'
import './../styling/Education.css'

function Education() {
  const [open, setOpen] = useState(true)

  return (
    <section id="education" className={`section-card education-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => !open && setOpen(true)}>
        <span className="card-title">Education</span>
        <button className="card-toggle-btn" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          <span className="card-toggle-icon">{open ? '−' : '+'}</span>
        </button>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack">
            <div className="sub-card education-item">
              <img src="/svgs/asu.svg" alt="Arizona State University" className="edu-logo" />
              <div className="edu-meta">
                <p className="edu-institution">Arizona State University</p>
                <p className="edu-location">Tempe, AZ</p>
                <p className="edu-date">Aug. 2022 – May 2026</p>
              </div>
              <div className="edu-content">
                <p className="edu-college">Barrett, The Honors College</p>
                <p className="edu-degree">B.S. Computer Science & Economics</p>
                <p className="edu-honors">Summa Cum Laude · GPA: 3.93</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Education;
