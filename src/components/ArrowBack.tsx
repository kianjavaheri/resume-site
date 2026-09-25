import React from 'react'

// Back chevron for the paper pages' top bar. Inline SVG rather than a file in
// public/svgs/, for the same reason as ArrowOut and CalendarIcon: it takes its
// colour from the text around it, which an <img> can't do.
//
// Stroked at 1.3 on a 14-unit viewBox, matching ArrowOut exactly, so the two
// read as one icon set. Sized in CSS, not here.
function ArrowBack() {
  return (
    <svg
      className="arrow-back"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M11 7H3" />
      <path d="M6.5 3.5 3 7l3.5 3.5" />
    </svg>
  )
}

export default ArrowBack;
