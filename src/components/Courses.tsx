import React, { useState } from 'react'
import './../styling/components/Courses.css'

const cseCourses = [
  { code: 'CSE 310', name: 'Data Structures & Algorithms' },
  { code: 'CSE 330', name: 'Operating Systems' },
  { code: 'CSE 340', name: 'Principles of Programming Languages' },
  { code: 'CSE 355', name: 'Intro to Theoretical CS' },
  { code: 'CSE 434', name: 'Computer Networks' },
  { code: 'CSE 445', name: 'Distributed Software Development' },
  { code: 'CSE 446', name: 'Software Integration & Engineering' },
  { code: 'CSE 460', name: 'Software Analysis and Design' },
  { code: 'CSE 463', name: 'Human Computer Interaction' },
  { code: 'CSE 464', name: 'Software QA and Testing' },
  { code: 'CSE 471', name: 'Intro to Artificial Intelligence' },
]

const ecnCourses = [
  { code: 'ECN 306', name: 'Survey of International Economics' },
  { code: 'ECN 416', name: 'Game Theory & Economic Behavior' },
  { code: 'ECN 423', name: 'Economics of Education' },
  { code: 'ECN 425', name: 'Introduction to Econometrics' },
  { code: 'ECN 445', name: 'Environmental Economics' },
]

function Courses() {
  const [open, setOpen] = useState(false)

  return (
    <section id="courses" className={`section-card courses-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => !open && setOpen(true)}>
        <span className="card-title">Courses</span>
        <button className="card-toggle-btn" onClick={(e) => { e.stopPropagation(); setOpen(!open); }}>
          <span className="card-toggle-icon">{open ? '−' : '+'}</span>
        </button>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="courses-wrapper">

            <div className="course-section">
              <p className="course-section-label">Computer Science</p>
              <div className="courses-grid">
                {cseCourses.map((c) => (
                  <div key={c.code} className="course-card">
                    <span className="course-card-code">{c.code}</span>
                    <span className="course-card-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="course-section">
              <p className="course-section-label">Economics</p>
              <div className="courses-grid">
                {ecnCourses.map((c) => (
                  <div key={c.code} className="course-card">
                    <span className="course-card-code">{c.code}</span>
                    <span className="course-card-name">{c.name}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

export default Courses;
