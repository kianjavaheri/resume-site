import React, { useState } from 'react'
import './../styling/components/Proficiency.css'
import { skillGroups } from '../content/skills'

function Proficiency() {
  const [open, setOpen] = useState(true)

  return (
    <section id="skills" className={`section-card skills-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Skills</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="skills-wrapper">
            {skillGroups.map((g) => (
              <div className="skill-group" key={g.label}>
                <p className="skill-group-label">{g.label}</p>
                <div className="skills-grid">
                  {g.skills.map((s) => (
                    <div className="skill-item" key={s.title}>
                      <div className="skill-icon-wrap">
                        {s.src ? (
                          <img
                            src={s.src}
                            className={`skill-icon${s.invertDark ? ' skill-icon-invert' : ''}`}
                            alt={s.title}
                          />
                        ) : (
                          <span className="skill-monogram" aria-hidden="true">{s.abbr}</span>
                        )}
                      </div>
                      <span className="skill-name">{s.title}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Proficiency;
