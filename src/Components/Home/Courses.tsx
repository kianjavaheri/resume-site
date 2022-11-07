import React from 'react'
import './css/Courses.css'

function Courses() {
  return (
    <div>
        <h1 className="courses-header">Courses</h1>
        <section className="courses-container">
            <div className="course-list">
                <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-a" target="_blank" rel="noopener noreferrer">AP Computer Science (Principles of Programming)</a>
                <br/>
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2227/98741" target="_blank" rel="noopener noreferrer">Object Oriented Programming and Data Structures</a>
            </div>
        </section>
    </div>
  )
}

export default Courses;
