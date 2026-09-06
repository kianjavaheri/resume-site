import React, { useState } from 'react'
import PdfModal, { withViewerParams } from './PdfModal'
import ArrowOut from './ArrowOut'
import './../styling/components/About.css'

const images = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
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
        <button type="button" className="gallery-arrow" onClick={prev} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="gallery-count">{idx + 1} / {images.length}</span>
        <button type="button" className="gallery-arrow" onClick={next} aria-label="Next">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M6 3L11 8L6 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
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
              I am a recent graduate based in the Bay Area, California, looking to start my career in software engineering or data science. I graduated Summa Cum Laude from Barrett, The Honors College at Arizona State University with dual B.S. degrees in Computer Science and Economics.
            </p>
            <p className="about-bio">
              I'm actively applying for full-time Data Science, Software Engineering and ML/AI roles. Open to any
              opportunities in the Bay Area.
            </p>
            <button
              type="button"
              className="resume-link"
              onClick={() => {
                if (window.innerWidth <= 768) {
                  window.open(withViewerParams('/pdfs/resume.pdf'), '_blank', 'noopener,noreferrer')
                } else {
                  setResumeOpen(true)
                }
              }}
            >
              View Resume<ArrowOut />
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
