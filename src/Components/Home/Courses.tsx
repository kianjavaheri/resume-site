import React from 'react'
import './css/Courses.css'

function Courses() {
  return (
    <div>
        <h1 className="courses-header">Courses</h1>
        <section className="courses-container">
            <div className="course-list">
                <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-a" target="_blank" rel="noopener noreferrer">CSE 110: Principles of Programming (AP Computer Science A)</a>
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2227/98741" target="_blank" rel="noopener noreferrer">CSE 205: Object Oriented Programming and Data Structures</a>
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2201/13389" target="_blank" rel="noopener noreferrer">CSE 120: Digital Design Fundamentals</a>
                <a href="https://www.public.asu.edu/~ychen10/teaching/cse240/SyllabusInfoCSE240.pdf" target="_blank" rel="noopener noreferrer">CSE 240: Introduction to Programming Languages</a>
            </div>
        </section>
    </div>
  )
}

export default Courses;
