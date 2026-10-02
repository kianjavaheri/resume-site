// The projects in the grid, and the types behind them.
//
// This lives in content/ rather than in components/Projects.tsx because there
// are two consumers now: the grid, and the nav bar's Projects dropdown. One
// list, so a project can't appear in one and not the other.

// The card's visual. Required, not optional: this section is a grid of
// thumbnails, and one card without art would read as a broken tile rather than
// as a quieter entry. Making it required means a new project can't be added
// without one. width/height are the file's real pixel size — they cost nothing
// here because `.project-visual` already reserves the box by aspect-ratio, but
// they keep the <img> honest if that rule is ever dropped.
export interface WorkImage {
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
export interface WorkLink {
  label: string
  icon: 'paper' | 'pdf' | 'library' | 'site' | 'github' | 'curseforge'
  href: string
}

export interface WorkProps {
  image: WorkImage
  // Where the card goes. Always a route on this site — every project has a
  // page under /projects/:slug, so there is no outbound-link case to handle.
  to: string
  wip?: boolean
  // Shipped version, e.g. 'Version 1.1.0'. Green badge, left of the WIP one.
  release?: string
  title: string
  // A SHORT name for the nav dropdown, where the card's title would wrap to
  // three lines (the thesis's runs 71 characters). Optional: it falls back to
  // `title`, so a project only needs one when the full title is too long for a
  // ~260px menu row. This is the third length the same project is written at —
  // the page's full title, the card's shortened one, and this.
  navLabel?: string
  // Two or three lines. See the note on the `works` array.
  blurb: string
  tags?: string[]
  links?: WorkLink[]
}

// Every card links to a page under /projects/:slug, and that is the ONLY thing a
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
export const works: Array<WorkProps> = [
  {
    title: 'Revolution Parts Shipment Quoting Microservice',
    navLabel: 'Shipment Quoting Microservice',
    to: '/projects/cs-capstone',
    image: { src: '/images/projects/shipment-quoting.18712804.webp', width: 900, height: 534, alt: 'The quoting tool: shipment and package details on the left, live carrier rates and cache status on the right' },
    blurb: 'A Dockerized caching layer sitting in front of carrier quote APIs, in Flask and PostgreSQL. Cut quoting latency 64.4%, a 2.8x speedup over live calls.',
    tags: ['Python', 'Flask', 'PostgreSQL', 'Docker'],
  },
  {
    title: 'Public Perception vs. Actual Economic Effects of U.S.–China Trade Policy',
    navLabel: 'Barrett Honors Thesis',
    to: '/projects/thesis',
    links: [{ label: 'View in ASU Library', icon: 'library', href: 'https://keep.lib.asu.edu/items/203948' }],
    image: { src: '/images/projects/thesis-survey.bd86e9f6.webp', width: 900, height: 506, alt: 'The thesis survey as respondents saw it, asking whether the U.S. runs a trade deficit or a surplus' },
    blurb: 'Why the public read the 2018–2020 trade war so differently from the economy itself. A survey, and NLP over the open-ended answers. Barrett honors thesis.',
    tags: ['NLP', 'Survey Research', 'Qualtrics'],
  },
  {
    title: 'Universal Basic Income vs. Targeted Welfare',
    navLabel: 'Universal Basic Income',
    to: '/projects/basic-income',
    image: { src: '/images/projects/basic-income.9eabe994.webp', width: 700, height: 394, alt: 'An engraving of a hand holding banknotes, ringed by line drawings of the things a basic income pays for: housing, groceries, a car, healthcare' },
    blurb: 'Five recent studies on whether a basic income is affordable, across developing and developed economies, and what the choice of funding does to growth.',
    tags: ['Macroeconomics', 'Policy Analysis'],
  },
  // HIDDEN, not deleted — A deliberate hold, Sep 2026: the project should be better understood the
  // project better before it represents him. Everything it needs is still here:
  // the page in project-pages.ts, its seven images under public/images/
  // wage-effects/ and public/og/, and the thumbnail above.
  //
  // To bring it back, uncomment THIS and the matching line in the `papers`
  // registry in papers.ts. Both, together — a work with no page fails the
  // build (prerender-meta.mjs throws), and a page with no work would be a live
  // URL with nothing linking to it. The card, the nav dropdown row, the search
  // index, the sitemap and its prerendered HTML all follow from these two.
  // {
  //   title: 'Estimating the Wage Effects of a Universal Basic Income',
  //   navLabel: 'Wage Effects of a UBI',
  //   to: '/projects/wage-effects',
  //   links: [{ label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/welfare-model' }],
  //   image: { src: '/images/projects/wage-effects.120b1d50.webp', width: 1001, height: 563, alt: 'A histogram of per-mother wage-impact estimates from the causal forest, against the average treatment effect' },
  //   blurb: 'Double Machine Learning over the Baby\u2019s First Years cash-transfer RCT, estimating what $333 a month did to mothers\u2019 hourly wages a year later.',
  //   tags: ['Python', 'EconML', 'XGBoost', 'Causal Inference'],
  // },
  {
    title: 'Santa Cruz Rental Price Model',
    to: '/projects/rental-prices',
    links: [
      { label: 'View Live Site', icon: 'site', href: 'https://rental-prices.vercel.app/' },
      { label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/rental-prices' },
    ],
    image: { src: '/images/projects/rental-prices.3ab58f9d.webp', width: 900, height: 506, alt: 'The rent model web app: a map of Santa Cruz with priced blocks, and an estimate panel showing a prediction interval' },
    blurb: 'A rent model for studios and one-bedrooms across Santa Cruz and Monterey counties. Type an address, get a price and the range it probably falls in.',
    tags: ['LightGBM', 'Linear Regression', 'Gradient Boosting', 'Ridge Regression', 'Feature Engineering'],
  },
  {
    wip: true,
    release: 'Version 1.1.0',
    title: 'Material Boxes',
    to: '/projects/material-boxes',
    links: [
      { label: 'View CurseForge', icon: 'curseforge', href: 'https://www.curseforge.com/minecraft/mc-mods/material-boxes' },
      { label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/material-boxes' },
    ],
    image: { src: '/images/projects/material-boxes.fbf45ff3.webp', width: 854, height: 480, alt: 'The mod in Minecraft: a chest marked as a Material Box, its slots color-coded by progress beside a materials checklist' },
    blurb: 'A client-side Fabric mod that tracks the materials a Minecraft build needs, color-coding chests by what is still missing.',
    // tags: ['Java', 'Fabric', 'Minecraft Modding', 'Claude API'],
    tags: ['Java', 'Fabric', 'Minecraft Modding'],
  },
  // LAST IN THE GRID, and that is the order it should keep: it is the site
  // itself, not a project, so it reads as a footnote to the five above rather
  // than competing with them. It still earns a card rather than a footer link,
  // because a reader who skims the grid and leaves is exactly the reader it is
  // written for — and because the authorship note belongs somewhere findable
  // rather than buried.
  //
  // The thumbnail is the site's OWN ambient figure, rendered to a still from
  // the same constants components/PulseRing.tsx animates — so the card cannot
  // show a motif the page no longer uses. See docs/components.md.
  {
    title: 'How This Site Is Built',
    navLabel: 'Colophon',
    to: '/projects/colophon',
    links: [
      { label: 'View GitHub', icon: 'github', href: 'https://github.com/kianjavaheri/resume-site' },
    ],
    image: { src: '/images/projects/colophon.7105eb66.webp', width: 900, height: 506, alt: 'The blue ring that drifts behind the About card, drawn as overlapping translucent strokes on a pale background' },
    blurb: 'Notes on the creation of this site and what I did.',
    // NOT a tech stack, deliberately. The tags credit the design work, not what
    // the project contains — and on this one the code was not hand-written.
    // React and Vite here would claim exactly the thing the page is careful
    // not to.
    tags: ['System Design', 'Agentic Coding'],
  },
]
