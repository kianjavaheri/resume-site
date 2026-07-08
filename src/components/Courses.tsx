import React, { useState } from 'react'
import './../styling/components/Courses.css'

const cseCourses = [
  { code: 'CSE 310', name: 'Data Structures & Algorithms' },
  { code: 'CSE 330', name: 'Operating Systems' },
  { code: 'CSE 340', name: 'Principles of Programming Languages' },
  { code: 'CSE 355', name: 'Introduction to Theoretical Computer Science' },
  { code: 'CSE 434', name: 'Computer Networks' },
  { code: 'CSE 445', name: 'Distributed Software Development' },
  { code: 'CSE 446', name: 'Software Integration and Engineering' },
  { code: 'CSE 460', name: 'Software Analysis and Design' },
  { code: 'CSE 463', name: 'Introduction to Human Computer Interaction' },
  { code: 'CSE 464', name: 'Software QA and Testing' },
  { code: 'CSE 471', name: 'Introduction to Artificial Intelligence' },
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
    <section id="courses" className={`courses-section ${open ? 'section-open' : ''}`}>
      <button className="section-header" onClick={() => setOpen(!open)}>
        <span className="section-label">Courses</span>
        <span className="section-toggle-icon">{open ? '−' : '+'}</span>
      </button>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="section-body">
            <div className="courses-groups">
              <div className="course-group">
                <p className="course-group-label">Computer Science</p>
                <div className="courses-list">
                  {cseCourses.map((c) => (
                    <div key={c.code} className="course-row">
                      <span className="course-code">{c.code}</span>
                      <span className="course-name">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="course-group">
                <p className="course-group-label">Economics</p>
                <div className="courses-list">
                  {ecnCourses.map((c) => (
                    <div key={c.code} className="course-row">
                      <span className="course-code">{c.code}</span>
                      <span className="course-name">{c.name}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Courses;
