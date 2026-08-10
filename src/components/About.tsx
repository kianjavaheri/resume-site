import React, { useState } from 'react'
import PdfModal from './PdfModal'
import './../styling/components/About.css'

const images = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  // '/images/img3.jpg',
  // '/images/img4.jpg',
]

function Gallery() {
  const [idx, setIdx] = useState(0)
  const [direction, setDirection] = useState<'right' | 'left'>('right')

  const prev = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('left')
    setIdx((i) => (i - 1 + images.length) % images.length)
  }
  const next = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection('right')
    setIdx((i) => (i + 1) % images.length)
  }

  return (
    <div className="about-gallery">
      <div className="gallery-frame">
        <img
          key={idx}
          src={images[idx]}
          alt={`Photo ${idx + 1}`}
          className={`gallery-img gallery-img-enter-${direction}`}
        />
      </div>
      <div className="gallery-controls">
        <button type="button" className="gallery-arrow" onClick={prev} aria-label="Previous">←</button>
        <span className="gallery-count">{idx + 1} / {images.length}</span>
        <button type="button" className="gallery-arrow" onClick={next} aria-label="Next">→</button>
      </div>
    </div>
  )
}

function About() {
  const [resumeOpen, setResumeOpen] = useState(false)

  return (
    <>
      <section id="about" className="section-card about-section">
        <div className="card-header-static">
          <span className="card-title">About</span>
        </div>

        <div className="about-hero">
          <h1 className="about-hero-name">Hi, I'm Kian Javaheri!</h1>
        </div>

        <div className="about-content-area">
          <div className="about-text">
            {/* <p className="about-bio">Hi, I'm Kian Javaheri.</p> */}
            <p className="about-bio">
              I am a recent graduate and aspiring developer based in the Bay Area, California, looking to
              start my career in software and data engineering. I recently graduated Summa Cum Laude from
              Barrett, The Honors College at Arizona State University with a double major in Computer
              Science and Economics.
            </p>
            <p className="about-bio">
              I'm actively applying for full-time Software Engineering and Data Engineering roles and am
              open to any opportunities in the area.
            </p>
            <button
              type="button"
              className="resume-link"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  window.open('/pdfs/resume.pdf', '_blank', 'noopener,noreferrer')
                } else {
                  setResumeOpen(true)
                }
              }}
            >
              View Resume ↗
            </button>
          </div>
          <Gallery />
        </div>
      </section>

      {resumeOpen && <PdfModal src="/pdfs/resume.pdf" onClose={() => setResumeOpen(false)} />}
    </>
  )
}

export default About;
