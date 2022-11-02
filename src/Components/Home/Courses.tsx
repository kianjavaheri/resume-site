import React from 'react'
import './css/Courses.css'

function Courses() {
  return (
    <div>
        <h1 className="courses-header">Courses</h1>
        <section className="courses-container">
            <div className="course-list">
                <a href="https://ea.asu.edu/courses/introduction-to-programming-cse-110/" target="_blank">AP Computer Science (Principles of Programming)</a>
                <br/>
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2167/70787#:~:text=Course%20Objectives%20and%20Outcomes%3A&text=A%20student%20can%20use%20object,UML%20to%20the%20equivalent%20code." target="_blank">Object Oriented Programming and Data Structures</a>
            </div>
        </section>
    </div>
  )
}

export default Courses;
