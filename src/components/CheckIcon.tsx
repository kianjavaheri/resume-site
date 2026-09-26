import React from 'react'

// Shown in place of AnchorIcon for a moment after a heading link is copied.
// It swaps INTO the same 1em box rather than adding a "Copied" label beside it:
// a label would either shift the heading's layout or need absolute positioning
// past the article's right edge, which is how this page last opened a sideways
// scroll at 375px (see CLAUDE.md, Paper pages).
//
// Stroked at 1.3 on a 14-unit viewBox, with the rest of the set.
function CheckIcon() {
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
      <path d="M2.8 7.4 5.6 10.2 11.2 4" />
    </svg>
  )
}

export default CheckIcon
