import React from 'react'
import './../styling/components/Proficiency.css'

import python from './../util/svgs/python.svg'
import java from './../util/svgs/java.svg'
import js from './../util/svgs/js.svg'
import react from './../util/svgs/react.svg'
import go from './../util/svgs/go.svg'
import cpp from './../util/svgs/cpp.svg'
import gcp from './../util/svgs/gcp.svg'

const skills = [
  { icon: python, lang: 'python', title: 'Python' },
  { icon: java, lang: 'java', title: 'Java' },
  { icon: js, lang: 'javascript', title: 'Javascript' },
  { icon: react, lang: 'react', title: 'React' },
  { icon: go, lang: 'go', title: 'Go' },
  { icon: cpp, lang: 'cpp', title: 'C++' },
  { icon: gcp, lang: 'gcp', title: 'GCP' },
]

function Proficiency() {
  return (
    <section id="skills" className="skills-section">
      <div className="section-inner">
        <span className="section-label">Skills</span>
        <div className="skills-grid">
          {skills.map((s) => (
            <div className="skill-item" key={s.lang}>
              <img src={s.icon} className={`skill-icon ${s.lang}`} alt={s.lang} />
              <span className="skill-name">{s.title}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Proficiency;
