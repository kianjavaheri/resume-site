import React, { useEffect, useRef, useState } from 'react'
import PdfModal, { withViewerParams } from './PdfModal'
import ArrowOut from './ArrowOut'
import './../styling/components/About.css'

const images = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  // '/images/img4.jpg',
]

// Resolves once the bitmap is actually ready to paint, so a slide never starts
// on an image the browser still has to fetch — that showed as an empty frame
// sliding in, with the photo popping in afterwards.
//
// It NEVER rejects. A decode failure, a 404 or a browser without
// HTMLImageElement.decode must not leave the arrows dead, so every path falls
// through to "go anyway" and the worst case is the old behaviour.
function preload(src: string): Promise<void> {
  return new Promise((resolve) => {
    let done = false
    const finish = () => {
      if (done) return
      done = true
      clearTimeout(timer)
      resolve()
    }
    // A hard cap, and it is NOT belt-and-braces. `decode()` can stay pending
    // indefinitely while the document is hidden, because the browser defers
    // rasterising for a page nobody is looking at — and a preload that never
    // settles would leave `busy` stuck and kill the arrows for the rest of the
    // session. Every path out of here has to settle.
    const timer = setTimeout(finish, 3000)

    const img = new Image()
    // `load` is the signal that actually fires regardless of visibility, so it
    // is the primary one; decode() only sharpens it to "ready to paint".
    img.onload = finish
    img.onerror = finish
    img.src = src
    if (img.complete) {
      finish()
      return
    }
    if (typeof img.decode === 'function') img.decode().then(finish, finish)
  })
}

function Gallery() {
  const [idx, setIdx] = useState(0)
  // Indices whose bitmap is known decoded. A click on one of these advances
  // synchronously, so the common case keeps its old instant feel.
  const ready = useRef<Set<number>>(new Set())
  // Guards the await window: without it a second click during a fetch would
  // queue a slide from a stale `idx`.
  const busy = useRef(false)
  // The slide the frame is moving AWAY from. Kept mounted for the length of the
  // animation so both images move together — animating only the incoming one
  // reads as a pop, not a slide. Cleared on animationend.
  const [outgoing, setOutgoing] = useState<number | null>(null)
  const [direction, setDirection] = useState<'right' | 'left'>('right')

  // Warm both neighbours so a click almost never has to wait. This runs in an
  // effect rather than at module scope, so it starts after the first slide is
  // mounted and competes with nothing for the initial paint.
  useEffect(() => {
    let cancelled = false
    for (const n of [idx + 1, idx - 1]) {
      const i = (n + images.length) % images.length
      if (i === idx || ready.current.has(i)) continue
      preload(images[i]).then(() => {
        if (!cancelled) ready.current.add(i)
      })
    }
    return () => { cancelled = true }
  }, [idx])

  const go = (delta: number, dir: 'right' | 'left') => async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (busy.current) return
    const next = (idx + delta + images.length) % images.length
    if (!ready.current.has(next)) {
      busy.current = true
      try {
        await preload(images[next])
      } finally {
        // Always, even if preload somehow throws: a stuck flag is a dead
        // gallery, and falling back to the old un-preloaded slide is far
        // better than an arrow that stops responding.
        busy.current = false
      }
      ready.current.add(next)
    }
    setDirection(dir)
    setOutgoing(idx)
    setIdx(next)
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
          onLoad={() => ready.current.add(idx)}
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

        {/* The title lives in the text column, not a full-width row above it,
            so the gallery starts level with the title instead of below it. */}
        <div className="about-content-area">
          <div className="about-text">
            <h1 className="about-hero-name">Hi, I'm Kian Javaheri!</h1>
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
