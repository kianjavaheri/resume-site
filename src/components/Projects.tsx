import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import LinkIcon from './LinkIcon'
import ArrowOut from './ArrowOut'
import Tags from './Tags'
import './../styling/components/Projects.css'

// Every card links to a page under /papers/:slug, and that is the ONLY thing a
// card does — the whole tile is one <Link>.
//
// `blurb` is a TEASER, not the project's description. Two or three lines, in
// the register of the reference portfolio's cards: what the thing is, and the
// one fact worth knowing. The full text lives on the project's own page, and
// the two are written separately on purpose — a truncated long description
// reads like a truncated long description.
//
// There is no `tag` any more. The project type ("CS Capstone", "Personal
// Project") moved onto each page, where it was already rendered as the
// `eyebrow` — it was duplicated, and on the card it was competing with the
// counter for the same corner.
const works: Array<WorkProps> = [
  {
    title: 'Revolution Parts Shipment Quoting Microservice',
    to: '/papers/cs-capstone',
    image: { src: '/images/projects/shipment-quoting.18712804.webp', width: 900, height: 534, alt: 'The quoting tool: shipment and package details on the left, live carrier rates and cache status on the right' },
    blurb: 'A Dockerized caching layer sitting in front of carrier quote APIs, in Flask and PostgreSQL. Cut quoting latency 64.4%, a 2.8x speedup over live calls.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    to: '/papers/thesis',
    links: [{ label: 'View in ASU Library', icon: 'library', href: 'https://keep.lib.asu.edu/items/203948' }],
    image: { src: '/images/projects/thesis-survey.bd86e9f6.webp', width: 900, height: 506, alt: 'The thesis survey as respondents saw it, asking whether the U.S. runs a trade deficit or a surplus' },
    blurb: 'Why the public read the 2018–2020 trade war so differently from the economy itself. A survey, and NLP over the open-ended answers. Barrett honors thesis.',
    tags: ['NLP', 'Survey Research', 'Qualtrics'],
  },
  {
    title: 'Universal Basic Income vs. Targeted Welfare',
    to: '/papers/basic-income',
    image: { src: '/images/projects/basic-income.9eabe994.webp', width: 700, height: 394, alt: 'An engraving of a hand holding banknotes, ringed by line drawings of the things a basic income pays for: housing, groceries, a car, healthcare' },
    blurb: 'Five recent studies on whether a basic income is affordable, across developing and developed economies, and what the choice of funding does to growth.',
    tags: ['Macroeconomics', 'Policy Analysis'],
  },
  {
    title: 'Estimating the Wage Effects of a Universal Basic Income',
    to: '/papers/wage-effects',
    links: [{ label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/welfare-model' }],
    image: { src: '/images/projects/wage-effects.120b1d50.webp', width: 1001, height: 563, alt: 'A histogram of per-mother wage-impact estimates from the causal forest, against the average treatment effect' },
    blurb: 'Double Machine Learning over CPS ASEC microdata, estimating what an unconditional $6,000 a year does to future labor income.',
    tags: ['Python', 'EconML', 'XGBoost', 'Causal Inference'],
  },
  {
    title: 'Santa Cruz Rental Price Model',
    to: '/papers/rental-prices',
    links: [
      { label: 'View Live Site', icon: 'site', href: 'https://rental-prices.vercel.app/' },
      { label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/rental-prices' },
    ],
    image: { src: '/images/projects/rental-prices.3ab58f9d.webp', width: 900, height: 506, alt: 'The rent model web app: a map of Santa Cruz with priced blocks, and an estimate panel showing a prediction interval' },
    blurb: 'A rent model for studios and one-bedrooms across Santa Cruz and Monterey counties. Type an address, get a price and an honest uncertainty range.',
    tags: ['LightGBM', 'Ridge Regression', 'Gradient Boosting', 'Feature Engineering'],
  },
  {
    wip: true,
    release: 'Version 1.1.0',
    title: 'Material Boxes',
    to: '/papers/material-boxes',
    links: [
      { label: 'View CurseForge', icon: 'curseforge', href: 'https://www.curseforge.com/minecraft/mc-mods/material-boxes' },
      { label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/material-boxes' },
    ],
    image: { src: '/images/projects/material-boxes.fbf45ff3.webp', width: 854, height: 480, alt: 'The mod in Minecraft: a chest marked as a Material Box, its slots colour-coded by progress beside a materials checklist' },
    blurb: 'A client-side Fabric mod that tracks the materials a Minecraft build needs, colour-coding chests by what is still missing.',
    tags: ['Java', 'Fabric', 'Minecraft Modding', 'Claude API'],
  },
]

// The card's visual. Required, not optional: this section is a grid of
// thumbnails, and one card without art would read as a broken tile rather than
// as a quieter entry. Making it required means a new project can't be added
// without one. width/height are the file's real pixel size — they cost nothing
// here because `.project-visual` already reserves the box by aspect-ratio, but
// they keep the <img> honest if that rule is ever dropped.
interface WorkImage {
  src: string
  width: number
  height: number
  // Describes what the picture SHOWS. Not a repeat of the title, which sits
  // next to it and is already read out.
  alt: string
}

// Icon-only, so `label` is the ONLY name this link has: it is both the
// accessible name and the tooltip. Every one is an ordinary outbound href —
// the card itself already covers the "read this on my site" case.
//
// `links` is optional and two cards have none: the paper PDFs were withdrawn
// (see papers.ts), which left the capstone poster and the Economics capstone
// with nothing outbound to point at. That used to misalign the footer, but the
// go-arrow is on every card now and holds the row's height on its own.
interface WorkLink {
  label: string
  icon: 'paper' | 'pdf' | 'library' | 'site' | 'github' | 'curseforge'
  href: string
}

interface WorkProps {
  image: WorkImage
  // Where the card goes. Always a route on this site — every project has a
  // page under /papers/:slug, so there is no outbound-link case to handle.
  to: string
  wip?: boolean
  // Shipped version, e.g. 'Version 1.1.0'. Green badge, left of the WIP one.
  release?: string
  title: string
  // Two or three lines. See the note on the `works` array.
  blurb: string
  tags?: string[]
  links?: WorkLink[]
}

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
