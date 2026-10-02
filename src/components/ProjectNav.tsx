import { Link } from 'react-router-dom'
import { works } from '../content/projects'
import '../styling/components/ProjectNav.css'

/* PREV / NEXT ARROWS ON A READING PAGE.
 *
 * Two small chevrons pinned to the left and right edges of the viewport, so a
 * reader who has finished one project can reach the next one without going
 * back to the grid first.
 *
 * THE ORDER IS `works`, NOT THE `papers` REGISTRY, and that is the whole point
 * of reading it from there: `works` is the order the Projects grid and the nav
 * dropdown already present, so "next" means the next card. Deriving a second
 * order here — or hard-coding one — would drift from the grid the moment a
 * project moved. It also means a project hidden from `works` is skipped for
 * free: wage-effects is commented out of that list, so these arrows step over
 * it exactly as the grid does, with no second place to remember.
 *
 * IT WRAPS. The last project's Next is the first one, and the first's Previous
 * is the last. The alternative is hiding an arrow at each end, which makes the
 * control appear and disappear as you move through the set — and both
 * carousels on this site already wrap, so this is the consistent call.
 */

type Props = {
  /* The slug of the page these sit on. Matched against each work's `to`, which
     is the single string the card already links to — so there is no second
     slug field to keep in step. */
  slug: string
}

function ProjectNav({ slug }: Props) {
  const here = works.findIndex((w) => w.to === `/projects/${slug}`)
  // A page with no card — or a set of one — has nowhere to go.
  if (here === -1 || works.length < 2) return null

  const prev = works[(here - 1 + works.length) % works.length]
  const next = works[(here + 1) % works.length]

  /* `navLabel` is the SHORT name, the one the nav dropdown uses, falling back
     to the full title. These are icon-only controls, so the label is the
     link's only accessible name and doubles as the tooltip — the same contract
     the Projects cards' icon links and the About contact chips use. The card
     titles run to 71 characters, which is not a tooltip. */
  const nameOf = (w: (typeof works)[number]) => w.navLabel ?? w.title

  return (
    <>
      <Link
        to={prev.to}
        className="project-nav project-nav-prev"
        aria-label={`Previous project: ${nameOf(prev)}`}
        title={nameOf(prev)}
      >
        {/* The About gallery's chevron, exactly — same viewBox, same path,
            same 1.5 stroke. Reach for the existing glyph before drawing a new
            one; that rule is why `.project-go` ended up as ArrowOut. */}
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M10 3L5 8L10 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
      <Link
        to={next.to}
        className="project-nav project-nav-next"
        aria-label={`Next project: ${nameOf(next)}`}
        title={nameOf(next)}
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 3L11 8L6 13"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </Link>
    </>
  )
}

export default ProjectNav
