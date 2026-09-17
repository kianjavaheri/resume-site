import React from 'react'

/**
 * Calendar glyph for the date chips.
 *
 * Inline SVG rather than a file in `public/svgs/` like the skill icons, for
 * the same reason the Selected Work link icons are inline: it sits on a chip
 * whose text is `--textcolor` and has to take its colour from it, which an
 * `<img>` can't do. Drawn as strokes at the same 1.3–1.4 weight as ArrowOut,
 * so the two read as one icon set.
 *
 * No day dots inside the body: the chip renders this at about 11px, where a
 * grid of 1px dots turns to mush. The header rule alone reads as a calendar.
 *
 * Sized in `em` by `.cal-icon`, so it tracks whatever label it sits beside.
 */
function CalendarIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `cal-icon ${className}` : 'cal-icon'}
      viewBox="0 0 14 14"
      aria-hidden="true"
      focusable="false"
    >
      <g
        fill="none"
        stroke="currentColor"
        strokeWidth="1.3"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="1.65" y="2.9" width="10.7" height="9.45" rx="2.1" />
        {/* Header rule, then the two hangers poking above the body. */}
        <path d="M1.65 6.2h10.7M4.6 1.5v2.3M9.4 1.5v2.3" />
      </g>
    </svg>
  )
}

export default CalendarIcon
