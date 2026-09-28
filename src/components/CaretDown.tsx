/* The chevron beside the nav's "Projects" link, marking it as the one link
 * that expands. Inline SVG rather than a character, for the reason the whole
 * icon set is: U+2304 and the arrow characters carry an emoji presentation on
 * some mobile browsers (see "No emoji glyphs in copy" in CLAUDE.md).
 *
 * Stroked at 1.3 on a 14-unit viewBox with ArrowOut, ArrowBack, AnchorIcon and
 * CalendarIcon, so the site has one icon weight. Sized 1em by `.nav-caret` in
 * Nav.css, which is where the flip lives too — the caret points UP while the
 * panel is open, and that is driven by the panel's own state rather than by
 * `:hover`, because the pointer spends most of its time on the panel and not
 * on the link.
 */
function CaretDown() {
  return (
    <svg
      className="nav-caret"
      viewBox="0 0 14 14"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M3.5 5.5 L7 9 L10.5 5.5" />
    </svg>
  )
}

export default CaretDown
