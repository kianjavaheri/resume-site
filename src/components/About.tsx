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
  // The slide the frame is moving AWAY from. Kept mounted for the length of the
  // animation so both images move together — animating only the incoming one
  // reads as a pop, not a slide. Cleared on animationend.
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [direction, setDirection] = useState<'right' | 'left'>('right')

  const go = (delta: number, dir: 'right' | 'left') => (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDirection(dir)
    setOutgoing(idx)
    setIdx((i) => (i + delta + images.length) % images.length)
  }

  // A track translated by -idx would be simpler, but wrapping from the last
  // image to the first would slide the whole strip backwards — the wrong way.
  // With only three photos you hit that wrap every third click.
  const sliding = outgoing !== null

  return (
    <div className="about-gallery">
      <div className="gallery-frame">
        {sliding && (
          <img
            key={`out-${outgoing}`}
            src={images[outgoing]}
            alt=""
            aria-hidden="true"
            className={`gallery-img gallery-img-exit-${direction}`}
          />
        )}
        <img
          // No enter class on first paint, or the opening image slides in on
          // every page load.
          key={`in-${idx}`}
          src={images[idx]}
          alt={`Photo ${idx + 1}`}
          className={`gallery-img${sliding ? ` gallery-img-enter-${direction}` : ''}`}
          onAnimationEnd={() => setOutgoing(null)}
        />
      </div>
      <div className="gallery-controls">
        <button type="button" className="gallery-arrow" onClick={go(-1, 'left')} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <span className="gallery-count">{idx + 1} / {images.length}</span>
        <button type="button" className="gallery-arrow" onClick={go(1, 'right')} aria-label="Next">
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
