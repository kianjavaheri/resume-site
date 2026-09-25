import React from 'react'

// The "opens this" mark in each project card's bottom-right corner: a square
// with an arrow leaving it. Inline SVG rather than a file in public/svgs/, the
// same reason as ArrowOut, LinkIcon and CalendarIcon — it takes its colour from
// the text around it, which an <img> can't.
//
// Drawn on the same 12-unit viewBox as ArrowOut and at the same 1.4 stroke, so
// the two read as one family: the arrow and its tail are ArrowOut's exact path.
// The open-cornered box is what makes it the heavier "go to this page" mark
// rather than the small inline one that follows a text link.
//
// Sized in CSS by `.project-go svg`, not here.
function ArrowBox() {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.4}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      {/* Box, open at the top-right where the arrow escapes. */}
      <path d="M7.4 1.9H2.1v8h8V4.6" />
      {/* Arrow, matching ArrowOut. */}
      <path d="M5.1 6.9 10.1 1.9M6.2 1.9h3.9v3.9" />
    </svg>
  )
}

export default ArrowBox;
