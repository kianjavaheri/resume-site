import React, { useState } from 'react'
import './../styling/components/Proficiency.css'

// `src` is an SVG in public/svgs/. Skills without one fall back to the `abbr`
// monogram — drop a file in and add `src` here and it swaps over automatically.
//
// The groups are the render structure, not just ordering. A flat list ordered
// languages → frameworks → tools reflowed straight across those boundaries in
// the wrapping grid, so the ordering carried no signal at all.
type Skill = { title: string; src?: string; abbr?: string; invertDark?: boolean }

// Annotated rather than inferred: without it each group's array gets its own
// narrow element type, and `s.invertDark` is an error in the groups that
// happen to have no inverted icon.
const skillGroups: { label: string; skills: Skill[] }[] = [
  {
    label: 'Languages',
    skills: [
      { title: 'Java', src: '/svgs/java.svg' },
      { title: 'Python', src: '/svgs/python.svg' },
      { title: 'C++', src: '/svgs/cplusplus.svg' },
      { title: 'SQL', src: '/svgs/sql.svg' },
      { title: 'JavaScript', src: '/svgs/js.svg' },
      { title: 'HTML/CSS', src: '/svgs/html5.svg' },
      { title: 'R', src: '/svgs/r.svg' },
    ],
  },
  {
    // "& Libraries" because Pandas and JUnit are libraries, not frameworks.
    label: 'Frameworks & Libraries',
    skills: [
      { title: 'React', src: '/svgs/react.svg' },
      { title: 'Node.js', src: '/svgs/nodedotjs.svg' },
      { title: 'Flask', src: '/svgs/flask.svg', invertDark: true },
      { title: 'JUnit', src: '/svgs/junit5.svg' },
      { title: 'Pandas', src: '/svgs/pandas.svg' },
    ],
  },
  {
    label: 'Developer Tools',
    skills: [
      { title: 'Git', src: '/svgs/git.svg' },
      { title: 'GitHub', src: '/svgs/github.svg', invertDark: true },
      { title: 'Docker', src: '/svgs/docker.svg' },
      { title: 'PostgreSQL', src: '/svgs/postgresql.svg' },
      { title: 'Firebase', src: '/svgs/firebase.svg' },
      { title: 'Postman', src: '/svgs/postman.svg' },
    ],
  },
  {
    // Kept separate from Developer Tools deliberately: these are the tools
    // behind the econometrics and the thesis, and they are the clearest
    // evidence on the site that the Economics degree is a real second
    // credential. Qualtrics is a survey platform, not a dev tool.
    label: 'Data & Research',
    skills: [
      { title: 'JupyterHub', src: '/svgs/jupyter.svg' },
      { title: 'MATLAB', abbr: 'ML' },
      { title: 'QGIS', src: '/svgs/qgis.svg' },
      { title: 'Stata', src: '/svgs/stata.svg' },
      { title: 'Qualtrics', src: '/svgs/qualtrics.svg' },
    ],
  },
]

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
