import React, { useEffect, useRef, useState } from 'react'
import PdfModal, { withViewerParams } from './PdfModal'
import LinkIcon from './LinkIcon'
import { contactLinks, isMailto } from '../content/contact-links'
import ArrowOut from './ArrowOut'
import CarouselDots, { CarouselCounter } from './CarouselDots'
import PulseRing from './PulseRing'
import { useIsMobile } from './useIsMobile'
import { useCarouselAutoplay } from './useCarouselAutoplay'
import './../styling/components/About.css'

// The running order. Kian reordered the gallery and the FILES were renamed to
// match rather than the array being shuffled, so img1..img4 on disk really are
// the gallery's 1st..4th. (It was briefly img3, img1, img_dep2, img2.) Keep it
// that way -- renaming beats a comment explaining why the numbers are out of
// sequence.
//
// img4 is the one PORTRAIT source here (992x1119, against the others' ~1.3
// landscape). The frame is 4/3 with `object-fit: cover` and
// `object-position: center top`, so it keeps the top ~66% -- head to knees --
// and takes the crop off the bottom, which is where the path is. Checked by
// rendering it, per the rule the project thumbnails follow.
const images = [
  '/images/img1.jpg',
  '/images/img2.jpg',
  '/images/img3.jpg',
  '/images/img4.jpg',
]

/* KEPT FOR <DotGrid />, WHICH IS NOT CURRENTLY RENDERED — see the note at the
 * canvas below. This is unused today and that is on purpose; it is the other
 * half of reinstating the dot field in one line, and re-deriving it later
 * would mean re-deriving the reasoning with it.
 *
 * What the dot field keeps its distance from — every box of actual content in
 * the card. DotGrid measures each one's rect and tapers the dots out as they
 * approach it, so the effect thins toward the copy instead of stopping at a
 * rectangle. It lists the TEXT ELEMENTS rather than their wrappers on purpose:
 * `.about-text` would shelter the whole left column including the open space
 * under the button, which is exactly where the field should be liveliest.
 *
 * It is a prop rather than a constant inside DotGrid so that component stays
 * general — it knows nothing about About's class names.
 */
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const SHELTERED = [
  '.card-header-static',
  '.about-hero-name',
  '.about-bio',
  '.resume-link',
  '.about-gallery',
  // `.about-social-inner` is deliberately NOT here. The contact chips are
  // opaque `--well-bg` tiles with their own shadow, so they simply sit on top
  // of the field — Kian's call: "the buttons should just sit above the grid
  // and the block shouldn't be treated differently". Sheltering them punched
  // a hole in the one part of the card the dots have all to themselves.
].join(', ')

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

  // The one path to a new slide, shared by the arrows and the dots. Both have
  // to run the preload-and-await, or a jump to a photo the browser has not
  // fetched slides an empty frame in — the exact bug documented below.
  const slideTo = async (next: number, dir: 'right' | 'left') => {
    if (busy.current || next === idx) return
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

  // Cycles forward on its own until an arrow or a dot is used, then stops for
  // good. It goes through `slideTo` like everything else, so an autoplay step
  // onto a photo the browser has not fetched still awaits the decode rather
  // than sliding an empty frame in.
  const { rootRef, takeOver, pauseProps } = useCarouselAutoplay({
    count: images.length,
    advance: () => { void slideTo((idx + 1) % images.length, 'right') },
  })

  const go = (delta: number, dir: 'right' | 'left') => async (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    takeOver()
    await slideTo((idx + delta + images.length) % images.length, dir)
  }

  // A track translated by -idx would be simpler, but wrapping from the last
  // image to the first would slide the whole strip backwards — the wrong way.
  // With only three photos you hit that wrap every third click.
  const sliding = outgoing !== null

  return (
    <div className="about-gallery" ref={rootRef} {...pauseProps}>
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
        {/* Inside the frame, so it rides above both slides and is clipped by
            the frame's own `overflow: hidden` like they are. */}
        <CarouselCounter index={idx} count={images.length} />
      </div>
      <div className="gallery-controls">
        <button type="button" className="gallery-arrow" onClick={go(-1, 'left')} aria-label="Previous">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M10 3L5 8L10 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        {/* Dots rather than a bare `n / N`, so a reader can go straight to a
            photo instead of clicking through to it. `go` is the arrows' own
            handler, which is what carries the preload-and-await and the
            direction of travel -- jumping has to take the same path, or a
            dot click would slide an empty frame in on a cold image. */}
        <CarouselDots
          count={images.length}
          index={idx}
          itemLabel="photo"
          onSelect={(i) => {
            // A dot picks a slide, not a direction, so the direction is
            // derived: a jump forward enters from the right, back from the
            // left. Getting it wrong is not subtle — the photo travels the
            // wrong way across the frame.
            takeOver()
            void slideTo(i, i > idx ? 'right' : 'left')
          }}
        />
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
  const isMobile = useIsMobile()

  return (
    <>
      <section id="about" className="section-card about-section">
        {/* First in the DOM and behind everything — DotGrid.css carries the
            stacking rules that lift the card's own content over it, and they
            are written to serve whichever figure is in this slot.

            THE DOT GRID USED TO BE HERE AND IS DELIBERATELY STILL IN THE
            REPO. `DotGrid.tsx`, `DotGrid.css` and the `SHELTERED` list below
            are all intact and working; Kian moved away from the look, not
            from the code. Putting it back is this line plus the import — it
            reads the same `--about-ink` token, and its shelter prop is the
            constant still declared above. Don't delete it as dead code, and
            read its own header before reinstating it: the shelter taper, the
            two-weight bloom and the pulse's activity gate each took a round
            of tuning that is not obvious from the outside.

            IT IS FITTED TO THE GAP, not placed at fractions of the card.
            `above` and `below` name the blocks it sits between and
            `centreOn` the one it lines up with — all three the TEXT COLUMN's
            side of the card, which is where Kian wanted it. That is also why
            the gallery is not in `above`: it is the right-hand column and
            the figure never reaches it, so letting it set the band's top
            edge only robbed height for no reason.

            They name DRAWN blocks rather than wrappers on purpose.
            `.about-content-area`'s bottom sits 36px below the last thing
            inside it, and `.about-social`'s top is EXACTLY its icons' top
            with no padding at all — so wrappers threw away room at one end
            and claimed room that wasn't there at the other. That band is content-driven where the card's height
            is a viewport, so it is 191px at 1024x768 and three times that on
            a tall window; any fixed fraction is right at one size only.

            NOT RENDERED ON A PHONE. The dot grid's reason was that there is
            no pointer to track; this one is ambient and would work fine, so
            the reason here is COST — a canvas, two observers and forty
            stroked paths a frame is not something to hand a phone for
            decoration, and the card loses its full-viewport height at that
            width anyway. Rendering nothing beats hiding it in CSS, which
            would do all the work and then paint it to no one. */}
        {!isMobile && (
          <PulseRing
            above=".about-text"
            below=".about-social"
            centreOn=".about-text"
          />
        )}

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

        {/* The same three links the Contact section carries, at the foot of the
            card — the shape a reader looks for at the end of an intro. One list
            in content/contact-links.ts, so the two can't drift apart.

            The outer band re-creates `.about-content-area`'s two columns so the
            icons centre on the TEXT column rather than on the whole card; the
            inner div is the text column's stand-in. See About.css.

            Icon-only, so `aria-label` is the link's ONLY name and doubles as
            the tooltip, exactly as on the Projects cards' icon links. */}
        <div className="about-social">
          <div className="about-social-inner">
            {contactLinks.map((l) => (
              <a
                key={l.label}
                href={l.href}
                {...(isMailto(l.href) ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
                className="about-social-link"
                aria-label={l.label}
                title={l.label}
              >
                <LinkIcon kind={l.icon} />
              </a>
            ))}
          </div>
        </div>
      </section>

      {resumeOpen && <PdfModal src="/pdfs/resume.pdf" onClose={() => setResumeOpen(false)} />}
    </>
  )
}

export default About;
