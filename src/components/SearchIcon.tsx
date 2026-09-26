import React from 'react'

// The magnifier on the palette's trigger, in the nav bar and the paper pages'
// top bar. Inline SVG for the usual reason — it has to take `currentColor` from
// the chip it sits in, which is `--textcolor` in one place and `--muted` in
// another. Stroked at 1.3 on a 14-unit viewBox, with the rest of the set.
function SearchIcon() {
  return (
    <svg
      className="search-icon"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.3}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <circle cx="6.1" cy="6.1" r="4" />
      <path d="M9.1 9.1 12.3 12.3" />
    </svg>
  )
}

export default SearchIcon
