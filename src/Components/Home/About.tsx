import React from 'react'
import './css/About.css'
import asulogo from '../../svgs/asulogo.svg'

function About() {
  return (
    <div>
        <h1 className="about-header">About Me</h1>
        <section className="about-container">
          <div className="about-wrapper">
            <p>
                My name is Kian Javaheri. I was born and raised in the Bay Area in California. Currently, I am an 18-year-old computer science major and economics minor at Barrett, The Honors College at Arizona State University. I am looking to work in full-stack development or ultimately machine learning/artificial intelligence!
            </p>
            {/* <img src={asulogo} className="asulogo" alt="asu logo"></img> */}
          </div>
        </section>

    </div>
  )
}

export default About;