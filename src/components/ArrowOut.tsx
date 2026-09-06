import React from 'react'

/**
 * Outbound-link arrow, drawn inline rather than typed as the Unicode ↗
 * (U+2197). That codepoint has an emoji presentation, and iOS Safari picks it
 * by default — the arrow turned into a blue emoji glyph on iPhone. Same reason
 * the back-to-top arrow and gallery chevrons are inline SVG.
 *
 * Sized in `em`, so it tracks the font-size of whatever label it sits next to.
 */
function ArrowOut({ className }: { className?: string }) {
  return (
    <svg
      className={className ? `arrow-out ${className}` : 'arrow-out'}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M3.2 8.8 8.8 3.2M4.3 3.2H8.8V7.7"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default ArrowOut
