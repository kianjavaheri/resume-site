import React, { useState } from 'react'
import './../styling/components/Awards.css'

// Three academic honors, all from ASU — which is why the card carries the seal
// once on the left rather than repeating the school on each entry. The New
// American University Scholarship was here and Kian cut it.
//
// Summa Cum Laude and Barrett also appear in Education, where they sit against
// the degrees. Kian asked for them here as well: this section is the list of
// honors, and a reader skimming it should not have to have read that card.
const awards: Array<{ name: string; detail?: string }> = [
  { name: "Dean's List", detail: 'All eight semesters' },
  { name: 'Barrett, The Honors College' },
  { name: 'Summa Cum Laude' },
]

function Awards() {
  const [open, setOpen] = useState(true)

  return (
    <section id="awards" className={`section-card awards-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Awards</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack">
            <div className="sub-card award-card">
              {/* NOT decorative, unlike the Experience tiles: nothing else in
                  this card names the school, so the seal is the only thing
                  saying where these honors come from. */}
              <div className="award-logo">
                <img src="/svgs/asu.svg" className="award-org-logo" alt="Arizona State University" />
              </div>
              {/* A LinkedIn-style connector run sideways: a dot per honor with
                  the rule between them. See Awards.css. */}
              <ol className="award-track">
                {awards.map((a) => (
                  <li className="award-step" key={a.name}>
                    <span className="award-dot" aria-hidden="true" />
                    <span className="award-name">{a.name}</span>
                    {a.detail ? <span className="award-detail">{a.detail}</span> : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Awards;
