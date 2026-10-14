import React, { useEffect, useRef, useState } from 'react'
import './../styling/Education.css'
import './../styling/components/Courses.css'
import { cseCourses, ecnCourses, type Course } from '../content/courses'
import { COURSEWORK_EVENT, type CourseworkId } from './openCoursework'

// One collapsible coursework block per degree. Reuses the section-body-wrapper
// grid-rows animation, gated on `coursework-open` instead of `section-open`.
// Its open state lives in Education, so the nav's dropdown can open it too.
const Coursework = React.forwardRef<
  HTMLDivElement,
  { label: string; courses: Course[]; open: boolean; onToggle: () => void }
>(function Coursework({ label, courses, open, onToggle }, ref) {
  return (
    <div ref={ref} className={`coursework-block ${open ? 'coursework-open' : ''}`}>
      <div className="coursework-header" onClick={onToggle}>
        <span className="coursework-label">
          <span className="coursework-title">{label}</span>
          <span className="coursework-sub">Coursework · {courses.length} courses</span>
        </span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="courses-grid">
            {courses.map((c) => (
              <div key={c.code} className="course-card">
                <span className="course-card-text">
                  <span className="course-card-code">{c.code}</span>
                  <span className="course-card-name">{c.name}</span>
                </span>
                {/* Decorative watermark. The catalogue number is already in
                    .course-card-code above, so this is aria-hidden rather than
                    a second thing for a screen reader to read out. */}
                <span className="course-card-num" aria-hidden="true">
                  {c.code.split(' ')[1]}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

function Education() {
  const [open, setOpen] = useState(true)
  // The ASU card itself: collapsed shows school, degrees and honors; expanding
  // reveals the two coursework tabs, which then open individually.
  const [cardOpen, setCardOpen] = useState(false)
  const [courseworkOpen, setCourseworkOpen] = useState<Record<CourseworkId, boolean>>({
    cs: false,
    econ: false,
  })
  const blockRefs = {
    cs: useRef<HTMLDivElement>(null),
    econ: useRef<HTMLDivElement>(null),
  }
  const toggleCoursework = (id: CourseworkId) =>
    setCourseworkOpen((o) => ({ ...o, [id]: !o[id] }))

  // The nav's Education dropdown. Opens all three levels at once (section,
  // ASU card, the block itself) and scrolls to the block straight away, so the
  // page starts moving with the expand rather than after it. That first scroll
  // can land short: the block's position wobbles by ~20px while the levels
  // around it open (measured). So once the 0.35s expand has settled, a second
  // scroll corrects to the final position. The other block is left as the
  // reader had it.
  useEffect(() => {
    let settle: number | undefined
    const onOpen = (e: Event) => {
      const id = (e as CustomEvent<CourseworkId>).detail
      setOpen(true)
      setCardOpen(true)
      setCourseworkOpen((o) => ({ ...o, [id]: true }))
      const scroll = () =>
        blockRefs[id].current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      // One frame, so the first scroll measures the committed layout.
      requestAnimationFrame(scroll)
      window.clearTimeout(settle)
      settle = window.setTimeout(scroll, 400)
    }
    window.addEventListener(COURSEWORK_EVENT, onOpen)
    return () => {
      window.removeEventListener(COURSEWORK_EVENT, onOpen)
      window.clearTimeout(settle)
    }
    // Subscribed once: the refs inside blockRefs are stable across renders.
  }, [])

  return (
    <section id="education" className={`section-card education-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Education</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack">
            <div
              className={`sub-card education-item expandable-card ${cardOpen ? 'edu-open' : ''}`}
              onClick={() => setCardOpen(!cardOpen)}
            >
              <span className="card-toggle-icon edu-toggle">{cardOpen ? '−' : '+'}</span>
              <div className="edu-main">
                <img src="/svgs/asu.svg" alt="Arizona State University" className="edu-logo" />
                <div className="edu-meta">
                  <p className="edu-institution">Arizona State University</p>
                  <p className="edu-location">Tempe, AZ</p>
                  <p className="edu-date">Aug 2022 – May 2026</p>
                </div>
                <div className="edu-content">
                  <p className="edu-college">Barrett, The Honors College</p>
                  <div className="edu-degrees">
                    <p className="edu-degree">B.S. Computer Science</p>
                    <p className="edu-degree">B.S. Economics</p>
                  </div>
                  <p className="edu-honors">Summa Cum Laude · GPA: 3.93</p>
                </div>
              </div>

              {/* Same 0fr → 1fr wrapper as the sections, gated on .edu-open.
                  Clicks inside stop here: the tabs and course cards must not
                  also toggle the card they sit in. */}
              <div className="section-body-wrapper">
                <div className="section-body-inner">
                  <div className="edu-coursework" onClick={(e) => e.stopPropagation()}>
                    <Coursework
                      ref={blockRefs.cs}
                      label="Computer Science"
                      courses={cseCourses}
                      open={courseworkOpen.cs}
                      onToggle={() => toggleCoursework('cs')}
                    />
                    <Coursework
                      ref={blockRefs.econ}
                      label="Economics"
                      courses={ecnCourses}
                      open={courseworkOpen.econ}
                      onToggle={() => toggleCoursework('econ')}
                    />
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

export default Education;
