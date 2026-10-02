/* The row between a carousel's two arrows.
 *
 * ONE component for both sliders on the site — the About gallery and the
 * paper pages' FigureCarousel — for the reason the chevrons are already
 * shared: the site should have one slider register, not two that drift. The
 * CSS lives in App.css alongside `.arrow-out` for the same reason.
 *
 * It decides between dots and a counter, so neither caller carries the rule:
 *
 * - **Ten or fewer** slides get dots you can click to jump straight to one.
 *   Both current callers are well inside that (3 photos, 3 diagrams, 7
 *   screenshots), so in practice everything on the site is dots today.
 * - **More than ten** falls back to the `n / N` counter both carousels used
 *   before this existed. Eleven dots in a 210px control row are ~10px apart,
 *   which is under any reasonable touch target and reads as a texture rather
 *   than as a set of controls. The cutoff is a real limit, not a formality.
 *
 * Each dot is a real <button>, so the set is reachable by keyboard and each
 * one is announced. `aria-current` marks the active slide rather than
 * `aria-selected`, which belongs to a tablist — and a tablist would be a
 * promise of roving focus and arrow-key navigation that this does not keep.
 */

const MAX_DOTS = 10

function CarouselDots({
  count,
  index,
  onSelect,
  itemLabel,
}: {
  count: number
  index: number
  onSelect: (i: number) => void
  /** Singular noun for the aria-label, e.g. "photo" or "figure". */
  itemLabel: string
}) {
  // Over ten, the dots stop being controls and become a texture, so there are
  // none — `<CarouselCounter>` in the frame's corner carries the position on
  // its own. Nothing renders here.
  if (count > MAX_DOTS) return null

  return (
    <div className="carousel-dots">
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          className={`carousel-dot${i === index ? ' carousel-dot-on' : ''}`}
          aria-label={`Go to ${itemLabel} ${i + 1} of ${count}`}
          aria-current={i === index}
          onClick={() => onSelect(i)}
        >
          {/* The mark is an inner span, not the button itself: the button
              stays a ~24px touch target while the dot it draws stays 7px. A
              7px button would be unhittable with a finger. */}
          <span className="carousel-dot-mark" aria-hidden="true" />
        </button>
      ))}
    </div>
  )
}

/* The `n/N` badge, sitting in the top-right CORNER OF THE PICTURE — Instagram's
 * badge, copied deliberately by request, down to its corner radius. The
 * glass, the radius and the type are in `.carousel-badge` in App.css.
 *
 * It moved off the control row because the dots were already saying the same
 * thing 20px away, and two position indicators side by side is one too many.
 * In the corner it is out of the way but still on the thing it describes.
 *
 * **`1/4`, with NO SPACES around the slash**, which is the other half of what
 * made the first version look "spaced out" — the CSS dropped the 0.08em
 * tracking, and this drops the two spaces. Instagram writes it closed up.
 *
 * FIXED dark fill and white ink in BOTH themes, which is the one place on the
 * site that is right: this sits on a photograph or a screenshot, not on a
 * themed surface, so there is no token that describes what is behind it. The
 * scrim is what makes it legible over a light sky and a dark one alike.
 *
 * Its parent must be `position: relative` — both frames already are, because
 * their slides are absolutely positioned.
 */
export function CarouselCounter({ index, count }: { index: number; count: number }) {
  // A single slide has no position to report.
  if (count < 2) return null
  return <span className="carousel-badge">{index + 1}/{count}</span>
}

export default CarouselDots
