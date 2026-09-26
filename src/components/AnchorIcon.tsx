import React from 'react'

// The chain-link glyph on the heading anchors. Inline SVG rather than a file in
// public/svgs/, for the reason ArrowOut and CalendarIcon give: it takes its
// colour from the text around it, which an <img> can't do. It also sidesteps
// the obvious alternative, a typed `#` — U+0023 carries Emoji=Yes and forms
// keycap sequences, and this file's whole icon set exists because iOS Safari
// picks an emoji presentation when one is available.
//
// Stroked at 1.3 on a 14-unit viewBox, matching ArrowOut and ArrowBack, and
// drawn between x 1.5 and 12.5 so it is centred in its box. Sized in CSS.
function AnchorIcon() {
  return (
    <svg
      className="anchor-icon"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M8.6 4.25h1.15a2.75 2.75 0 0 1 0 5.5H8.6" />
      <path d="M5.4 4.25H4.25a2.75 2.75 0 0 0 0 5.5H5.4" />
      <path d="M5.2 7h3.6" />
    </svg>
  )
}

export default AnchorIcon
