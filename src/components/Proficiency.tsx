import React, { useState } from 'react'
import './../styling/components/Proficiency.css'

const skills = [
  { src: '/svgs/python.svg', title: 'Python' },
  { src: '/svgs/java.svg', title: 'Java' },
  { src: '/svgs/js.svg', title: 'JavaScript' },
  { src: '/svgs/react.svg', title: 'React' },
  { src: '/svgs/stata.svg', title: 'Stata' },
  { src: '/svgs/sql.svg', title: 'SQL' },
  { src: '/svgs/postgresql.svg', title: 'PostgreSQL' },
  { src: '/svgs/flask.svg', title: 'Flask', invertDark: true },
  { src: '/svgs/pandas.svg', title: 'Pandas' },
]

function Proficiency() {
  const [open, setOpen] = useState(false)

  return (
    <section id="skills" className={`section-card skills-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Skills</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="skills-wrapper">
            <div className="skills-grid">
              {skills.map((s) => (
                <div className="skill-item" key={s.title}>
                  <div className="skill-icon-wrap">
                    <img
                      src={s.src}
                      className={`skill-icon${s.invertDark ? ' skill-icon-invert' : ''}`}
                      alt={s.title}
                    />
                  </div>
                  <span className="skill-name">{s.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Proficiency;
