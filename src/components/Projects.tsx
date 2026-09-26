import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LinkIcon from './LinkIcon'
import ArrowOut from './ArrowOut'
import Tags from './Tags'
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
function WorkCard({ image, to, wip, release, title, blurb, tags, links }: WorkProps) {
  return (
    <div className="sub-card project-card">
      <Link to={to} className="project-main">
        <div className="project-visual">
          <img
            src={image.src}
            alt={image.alt}
            width={image.width}
            height={image.height}
            loading="lazy"
          />
        </div>
        {/* Badges are inline in the title, so on a wrapping title they follow
            the last word rather than floating beside the first line. */}
        <h2 className="project-title">
          {title}
          {(release || wip) && (
            // Grouped so the badges wrap as a unit — on a phone WIP used to
            // break onto a line of its own, away from the release badge.
            <span className="project-badges">
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
                href={l.href}
                target="_blank"
                rel="noopener noreferrer"
                className="project-icon-link"
                aria-label={l.label}
                title={l.label}
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

  return (
    <section id="projects" className={`section-card projects-section ${open ? 'section-open' : ''}`}>
      <div className="card-header" onClick={() => setOpen(!open)}>
        <span className="card-title">Projects</span>
        <span className="card-toggle-icon">{open ? '−' : '+'}</span>
      </div>
      <div className="section-body-wrapper">
        <div className="section-body-inner">
          <div className="sub-cards-stack work-grid">
            {works.map((w) => (
              <WorkCard key={w.to} {...w} />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects;
