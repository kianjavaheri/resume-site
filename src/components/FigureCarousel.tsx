import React, { useState } from 'react'
import type { CarouselFigure } from '../content/papers'

// Figures shown one at a time instead of stacked down the page. A hand-written
// page writes a `carousel` block; a generated one declares `figureCarousels` in
// content/papers.ts and Paper.tsx folds its consecutive figures into the same
// block. The capstone's three design diagrams stacked ran 1,210px — a third of
// the page — for three pictures that are read one after another anyway.

function Chevron({ dir }: { dir: 'prev' | 'next' }) {
  // The same glyphs the About gallery uses, so the site has one arrow pair.
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
      <path
        d={dir === 'prev' ? 'M10 3L5 8L10 13' : 'M6 3L11 8L6 13'}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function FigureCarousel({ figures, plain }: { figures: CarouselFigure[]; plain?: boolean }) {
  const [idx, setIdx] = useState(0)
  const n = figures.length
  const go = (d: number) => setIdx((i) => (i + d + n) % n)

  // EVERY slide stays mounted, which is what keeps the arrows honest: the
  // browser fetches the whole set as the carousel comes into range, so a click
  // never has to wait and there is no preload flag to get stuck (the trap the
  // About gallery documents at length). They are `lazy` because the set can be
  // heavy — Material Boxes' seven screenshots are 561KB — and every carousel so
  // far starts below the fold; the frame reserves its height either way, so
  // nothing shifts as they land.
  //
  // The frame is sized to the TALLEST slide's ratio and the others letterbox
  // into it. Unreserved, changing slides moved everything below by up to 106px
  // — including the arrows being clicked.
  const ratio = Math.max(
    ...figures.map((f) => (f.width && f.height ? f.height / f.width : 9 / 16))
  )

  const current = figures[idx]

  return (
    <div
      className={`paper-carousel${plain ? ' paper-carousel-plain' : ''}`}
      role="group"
      aria-roledescription="carousel"
    >
      <div className="paper-carousel-frame" style={{ aspectRatio: String(1 / ratio) }}>
        {figures.map((f, i) => (
          <img
            key={f.src}
            src={f.src}
            alt={i === idx ? f.label ?? '' : ''}
            aria-hidden={i !== idx}
            width={f.width}
            height={f.height}
            loading="lazy"
            className={`paper-carousel-img${i === idx ? ' paper-carousel-img-on' : ''}`}
          />
        ))}
      </div>
      <div className="paper-carousel-bar">
        {/* A live region announces CHANGES only — its content on first paint is
            never read — so this needs no "has the reader moved yet" guard. */}
        <p className="paper-carousel-label" aria-live="polite">
          {current.label}
        </p>
        <div className="paper-carousel-controls">
          <button
            type="button"
            className="paper-carousel-arrow"
            onClick={() => go(-1)}
            aria-label="Previous figure"
          >
            <Chevron dir="prev" />
          </button>
          <span className="paper-carousel-count">{idx + 1} / {n}</span>
          <button
            type="button"
            className="paper-carousel-arrow"
            onClick={() => go(1)}
            aria-label="Next figure"
          >
            <Chevron dir="next" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default FigureCarousel
