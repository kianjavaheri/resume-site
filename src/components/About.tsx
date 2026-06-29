import React from 'react'
import './../styling/components/About.css'

function About() {
  return (
    <section id="about" className="about-section">
      <div className="about-hero">
        {/* <h1 className="about-hero-name">Kian<br />Javaheri</h1> */}
        <h1 className="about-hero-name">Kian Javaheri</h1>
      </div>
      <div className="section-inner">
        <span className="section-label">About</span>
        <div className="about-body">
          <p className="about-bio">
            May 2026 computer science and economics graduate from the Bay Area, California.
            Studied at Barrett Honors at Arizona State University. Looking to work in software development.
          </p>
          <a
            href="https://drive.google.com/file/d/1NU59Ov-BMng6bWruN8ES2jGUtGxMNxuM/view?usp=sharing"
            className="resume-link"
            target="_blank"
            rel="noopener noreferrer"
          >
            View Resume ↗
          </a>
        </div>
      </div>
    </section>
  )
}

export default About;
