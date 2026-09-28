import React, { useState } from 'react'
import './../styling/components/Proficiency.css'
import { skillGroups } from '../content/skills'
import { useIsMobile } from './useIsMobile'

function Proficiency() {
  const [open, setOpen] = useState(true)

  // On a phone the names under the tiles are hidden and revealed one at a
  // time on tap. Twenty-six labelled tiles at two or three per row made the
  // section a wall of uppercase micro-type, and the label is the least useful
  // half of a tile whose icon is a brand mark you already recognise.
  //
  // The tile only becomes a CONTROL on mobile, and that is the whole reason
  // this is a JS branch and not a media query. On desktop the name is printed
  // under every tile, so there is nothing to disclose -- rendering a <button>
  // there would be a control that does nothing, which is the same rule that
  // keeps `.hover-card` and `.expandable-card` apart.
  const isMobile = useIsMobile()
  const [revealed, setRevealed] = useState<string | null>(null)

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
                  {g.skills.map((s) => {
                    const isOn = revealed === s.title
                    const inner = (
                      <>
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
                      </>
                    )
                    const cls = `skill-item${isOn ? ' skill-item-revealed' : ''}`

                    // A real <button>, so it is reachable by keyboard and
                    // announced as a control. `aria-expanded` is honest here,
                    // unlike on the paper gate: this one genuinely toggles
                    // both ways. The icon's own `alt` is the accessible name,
                    // so the label being visually hidden costs nothing.
                    return isMobile ? (
                      <button
                        type="button"
                        className={cls}
                        key={s.title}
                        aria-expanded={isOn}
                        onClick={() => setRevealed(isOn ? null : s.title)}
                      >
                        {inner}
                      </button>
                    ) : (
                      <div className={cls} key={s.title}>
                        {inner}
                      </div>
                    )
                  })}
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
