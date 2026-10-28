import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LinkIcon from './LinkIcon'
import ArrowOut from './ArrowOut'
import Tags from './Tags'
import PdfModal, { withViewerParams } from './PdfModal'
import { works } from '../content/projects'
import type { WorkProps } from '../content/projects'
import './../styling/components/Projects.css'

// The card is a DIV wrapping two things: a <Link> over the picture, title and
// blurb, and a footer that is outside it.
//
// That split is the whole reason for the structure. The icon links are real
// <a>s, and an <a> inside an <a> is invalid and unreachable by keyboard — so
// the card cannot be one big link any more. Keeping the footer as a sibling of
// the main link is simpler than the alternative (a "stretched link" whose
// ::after covers the card while the icons sit above it on z-index), and it
// needs no :has() support. The cost is that clicking the tag row doesn't
// navigate, which is the right behaviour anyway.
function WorkCard({
  image, to, wide, wip, release, title, blurb, tags, links, onOpenPdf,
}: WorkProps & { onOpenPdf: (src: string) => void }) {
  /* DERIVED, NOT A FLAG. A card earns the LIVE badge by carrying a link whose
     icon is `site`, which is already what that icon means — somewhere you can
     open and use the thing right now, in a browser, without installing
     anything. A separate `live?: boolean` would be a second copy of the same
     fact and could disagree with the links below it.
     GitHub, CurseForge and a PDF are deliberately NOT live: source you have to
     build, a mod you have to install into Minecraft, a document you read. */
  const live = links?.some((l) => l.icon === 'site') ?? false
  return (
    <div className={`sub-card project-card${wide ? ' project-card-wide' : ''}`}>
      <Link to={to} className="project-main">
        {/* A wide card draws no picture — `image` is only there for its share
            image. See `wide` in content/projects.ts. */}
        {!wide && (
          <div className="project-visual">
            <img
              src={image.src}
              alt={image.alt}
              width={image.width}
              height={image.height}
              loading="lazy"
            />
          </div>
        )}
        {/* Badges are inline in the title, so on a wrapping title they follow
            the last word rather than floating beside the first line. */}
        <h2 className="project-title">
          {title}
          {(release || wip || live) && (
            // Grouped so the badges wrap as a unit — on a phone WIP used to
            // break onto a line of its own, away from the release badge.
            <span className="project-badges">
              {live && <span className="project-live">Live</span>}
              {release && <span className="project-release">{release}</span>}
              {wip && <span className="project-wip">WIP</span>}
            </span>
          )}
        </h2>
        <p className="project-blurb">{blurb}</p>
      </Link>
      <div className="project-foot">
        <Tags tags={tags} />
        {/* Icons in the left corner, go-arrow in the right. `space-between` on
            two children, so the row holds its shape even on the two cards whose
            link list is empty. */}
        <div className="project-foot-row">
          <div className="project-links">
            {links?.map((l) => (
              <a
                key={l.label}
                // A PDF opens like the About card's resume: in the modal on
                // desktop, and in a new tab at ≤768px, where an iframe PDF
                // viewer is cramped and can't be pinched. It stays a real
                // anchor, so middle-click and "open in new tab" still work.
                href={l.icon === 'pdf' ? withViewerParams(l.href) : l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-icon-link"
                aria-label={l.label}
                title={l.label}
                onClick={
                  l.icon === 'pdf'
                    ? (e) => {
                        if (window.innerWidth > 768) {
                          e.preventDefault()
                          onOpenPdf(l.href)
                        }
                      }
                    : undefined
                }
              >
                <LinkIcon kind={l.icon} />
              </a>
            ))}
          </div>
          {/* Goes where the card goes. `aria-hidden` + `tabIndex={-1}` keeps it
              out of the accessibility tree and the tab order, because
              `.project-main` already links there and announcing the same
              destination twice is noise — but it stays clickable, since an
              arrow that looks like a control and isn't is worse. */}
          <Link to={to} className="project-go" aria-hidden="true" tabIndex={-1}>
            <ArrowOut />
          </Link>
        </div>
      </div>
    </div>
  )
}

function Projects() {
  const [open, setOpen] = useState(true)
  // Held HERE and not in the card: a card lifts on hover with a `transform`,
  // and a transformed ancestor becomes the containing block for `position:
  // fixed`, so a modal rendered inside one would be laid out against the card.
  const [pdf, setPdf] = useState<string | null>(null)

  return (
    <section id="projects" className={`section-card projects-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Projects</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack work-grid">
            {works.filter((w) => !w.wide).map((w) => (
              <WorkCard key={w.to} {...w} onOpenPdf={setPdf} />
            ))}
          </div>
          {/* OUTSIDE the grid, not a card that spans it. The grid's rows are
              `1fr` so every tile is one height, which would stretch a short
              banner to match them. */}
          {works.some((w) => w.wide) && (
            <div className="sub-cards-stack work-wide">
              {works.filter((w) => w.wide).map((w) => (
                <WorkCard key={w.to} {...w} onOpenPdf={setPdf} />
              ))}
            </div>
          )}
        </div>
      </div>
      {pdf && <PdfModal src={pdf} onClose={() => setPdf(null)} />}
    </section>
  )
}

export default Projects;
