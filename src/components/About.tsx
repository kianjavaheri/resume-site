import React from 'react'
import './../styling/components/About.css'
import asulogo from '../../svgs/asulogo.svg'

function About() {
  return (
    <div>
        <h1 className="about-header">About Me</h1>
        <section className="about-container">
          <div className="about-wrapper">
            <p>
                My name is Kian Javaheri, and I am an undergraduate student from the Bay Area, California. I am studying computer science and economics at Barret Honors at Arizona State University, and I am looking to work in backend development!
            </p>
            {/* <img src={asulogo} className="asulogo" alt="asu logo"></img> */}
          </div>
        </section>

    </div>
  )
}

export default About;