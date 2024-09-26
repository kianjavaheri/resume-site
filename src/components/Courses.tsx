import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';
import './../styling/components/Courses.css'


function Courses() {
  const [expanded, setExpanded] = useState(false);


  return (
    <div>
        <h1 className="courses-header">Courses</h1>
        <section className="courses-container">
              <span onClick={() => setExpanded(!expanded)}>
                  <FontAwesomeIcon 
                    icon={faCaretDown} 
                    style={{ 
                      transition: 'transform 0.3s ease', 
                      transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)'
                    }} 
                  />
            </span>
            
            <div className={`course-list ${expanded ? 'expanded' : ''}`} style={{ display: expanded ? 'flex' : 'none' }}>
                {/* <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-a" target="_blank" rel="noopener noreferrer">CSE 110: Principles of Programming (AP Computer Science A)</a> */}
                
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2201/13389" target="_blank" rel="noopener noreferrer">CSE 120: Digital Design Fundamentals</a>

                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2227/98741" target="_blank" rel="noopener noreferrer">CSE 205: Object Oriented Programming and Data Structures</a>

                <a href="https://www.public.asu.edu/~ychen10/teaching/cse240/SyllabusInfoCSE240.pdf" target="_blank" rel="noopener noreferrer">CSE 240: Introduction to Programming Languages</a>

                {/* <a href="https://apstudents.collegeboard.org/courses/ap-macroeconomics" target="_blank" rel="noopener noreferrer">ECN 211: Macroeconomic Principles (AP Macroeconomics)</a> */}

                {/* <a href="https://math.asu.edu/mat267" target="_blank" rel="noopener noreferrer">MAT 267: Calculus for Engineers III</a> */}

                {/* <a href="https://math.asu.edu/mat243" target="_blank" rel="noopener noreferrer">MAT 243: Discrete Mathematical Structures</a> */}
                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2237/70479/pdf;jsessionid=3C1EE83573846AAEF2B912AA6D208CDB" target="_blank" rel="noopener noreferrer">CSE 310: Data Structures & Algorithms</a>

                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2241/17086/pdf" target="_blank" rel="noopener noreferrer">CSE 330: Operating Systems</a>

                <a href="https://catalog.apps.asu.edu/catalog/classes/classlist?campusOrOnlineSelection=C&catalogNbr=340&honors=F&promod=F&searchType=all&subject=CSE&term=2247#detailsOpen=66813-104194" target="_blank" rel="noopener noreferrer">CSE 340: Principles of Programming Languages</a>

                <a href="https://webapp4.asu.edu/bookstore/viewsyllabus/2241/13275/pdf" target="_blank" rel="noopener noreferrer">CSE 355: Introduction to Theoretical Computer Science</a>
            </div>
        </section>
    </div>
  )
}

export default Courses;
