// The command palette's index: everything on the site that is worth jumping to,
// flattened into one list of entries with a destination each.
//
// Nothing here is a second copy of any content. The index is BUILT from the same
// modules the pages render — `works`, `courseGroups`, `skillGroups`, the papers
// registry and `renderedSections()` — so a project, a course or a paragraph
// cannot be searchable and absent, or present and unsearchable. That is the
// whole reason paper-view.ts exists.
//
// It is built LAZILY, on the first search, and then held. Walking ~120KB of
// paper text costs a couple of milliseconds, which is nothing on a keystroke and
// is worth avoiding on first paint.
import { works } from './projects'
import { courseGroups } from './courses'
import { skillGroups } from './skills'
import { papers } from './papers'
import { paperIntros } from './intros'
import { renderedSections } from './paper-view'
import type { Block } from './papers'

export type SearchKind = 'section' | 'project' | 'course' | 'skill' | 'heading' | 'text'

export interface SearchEntry {
  kind: SearchKind
  // The row's first line.
  title: string
  // Context, shown after the title in a muted tone.
  subtitle?: string
  // Searched but not shown as the title — the prose a 'text' entry matched on,
  // and the blurb and tags behind a project.
  body?: string
  // Where the entry goes. '/' for anything on the home page.
  path: string
  // An element id on a reading page.
  hash?: string
  // A home-page section to scroll to.
  focus?: string
}

// The seven cards on the home page. Awards is in here although it has no nav
// link — that omission is a deliberate call about the BAR (see CLAUDE.md), and
// a section you can't search for as well as not see in the nav is just hidden.
const homeSections: { id: string; title: string; body?: string }[] = [
  { id: 'about', title: 'About' },
  {
    id: 'education',
    title: 'Education',
    // The names a reader would actually type. Education's own copy lives in
    // JSX rather than in content/, so unlike the papers it can't be indexed
    // from its source; when it moves, delete this.
    body: 'Arizona State University Barrett, The Honors College Summa Cum Laude',
  },
  {
    id: 'experience',
    title: 'Experience',
    // Same caveat as Education above — these are the three role cards.
    body:
      'Sandia National Laboratories Junior Researcher Undergraduate Teaching Assistant ASU',
  },
  { id: 'projects', title: 'Projects' },
  { id: 'skills', title: 'Skills' },
  { id: 'awards', title: 'Awards', body: "Summa Cum Laude Dean's List Barrett" },
  { id: 'contact', title: 'Contact', body: 'LinkedIn GitHub Email' },
]

const slugOf = (to: string) => to.replace('/papers/', '')

// The card's short name, which is what a menu row wants — the papers' own titles
// run to 71 characters. Same fallback the nav dropdown uses.
const shortTitles = new Map(works.map((w) => [slugOf(w.to), w.navLabel ?? w.title]))

function textOf(b: Block): string[] {
  if (b.type === 'p' || b.type === 'quote') return [b.text]
  if (b.type === 'list') return b.items
  if (b.type === 'deflist') return b.items.map((i) => `${i.term} — ${i.detail}`)
  return []
}

function build(): SearchEntry[] {
  const out: SearchEntry[] = []

  for (const s of homeSections) {
    // No subtitle: the row's kind label on the right already says "Section",
    // and "About · Section  SECTION" is the same word twice.
    out.push({ kind: 'section', title: s.title, body: s.body, path: '/', focus: s.id })
  }

  for (const w of works) {
    const paper = papers[slugOf(w.to)]
    out.push({
      kind: 'project',
      title: w.navLabel ?? w.title,
      // The paper's eyebrow is its type — "CS Capstone", "Personal Project".
      // Dropped when it repeats the card's short title, which it does for the
      // thesis: both are "Barrett Honors Thesis".
      subtitle: paper && paper.eyebrow !== (w.navLabel ?? w.title) ? paper.eyebrow : undefined,
      // The full title goes in the body, so searching the long form finds the
      // card even though the row shows the short one.
      body: [w.title, paper?.title, w.blurb, w.tags?.join(' ')].filter(Boolean).join(' '),
      path: w.to,
    })
  }

  for (const g of courseGroups) {
    for (const c of g.courses) {
      out.push({
        kind: 'course',
        title: `${c.code} — ${c.name}`,
        subtitle: `${g.label} coursework`,
        path: '/',
        focus: 'education',
      })
    }
  }

  for (const g of skillGroups) {
    for (const s of g.skills) {
      out.push({ kind: 'skill', title: s.title, subtitle: g.label, path: '/', focus: 'skills' })
    }
  }

  for (const slug of Object.keys(papers)) {
    const paper = papers[slug]
    const short = shortTitles.get(slug) ?? paper.title
    const path = `/papers/${slug}`

    // The intro sits above the contents list and always carries the id `intro`,
    // whether it says Abstract or Summary.
    const intro = paperIntros[slug]
    if (intro) {
      out.push({ kind: 'heading', title: intro.title, subtitle: short, path, hash: 'intro' })
      for (const text of intro.paragraphs) {
        out.push({ kind: 'text', title: short, subtitle: intro.title, body: text, path, hash: 'intro' })
      }
    }

    for (const s of renderedSections(slug)) {
      out.push({ kind: 'heading', title: s.title, subtitle: short, path, hash: s.id })
      // Deep-link a paragraph to the nearest subheading above it when there is
      // one, and to the section otherwise.
      let hash = s.id
      let heading = s.title
      for (const b of s.blocks) {
        if (b.type === 'h3') {
          hash = b.id ?? s.id
          heading = b.text
          out.push({ kind: 'heading', title: b.text, subtitle: `${short} · ${s.title}`, path, hash })
          continue
        }
        for (const text of textOf(b)) {
          if (text.trim().length < 24) continue
          out.push({ kind: 'text', title: short, subtitle: heading, body: text, path, hash })
        }
      }
    }

    if (paper.references?.length) {
      out.push({ kind: 'heading', title: 'References', subtitle: short, path, hash: 'references' })
      for (const r of paper.references) {
        out.push({ kind: 'text', title: short, subtitle: 'References', body: r, path, hash: 'references' })
      }
    }
  }

  return out
}

let index: SearchEntry[] | null = null
let haystacks: string[] | null = null

function ensure() {
  if (!index) {
    index = build()
    haystacks = index.map((e) =>
      `${e.title}\u0000${e.subtitle ?? ''}\u0000${e.body ?? ''}`.toLowerCase()
    )
  }
  return { index: index!, haystacks: haystacks! }
}

// What the palette shows before anything is typed: the places you'd jump to
// without searching.
export function defaultEntries(): SearchEntry[] {
  return ensure().index.filter((e) => e.kind === 'section' || e.kind === 'project')
}

// A hit at the start of a word beats one buried inside one, and an early hit
// beats a late one. Deliberately not a fuzzy subsequence matcher: on an index
// this size, subsequence matching finds a path through almost every long
// paragraph and the results stop meaning anything.
function fieldScore(hay: string, term: string): number {
  const i = hay.indexOf(term)
  if (i === -1) return 0
  const boundary = i === 0 || !/[a-z0-9]/.test(hay[i - 1])
  return (boundary ? 100 : 55) - Math.min(i, 60) * 0.5
}

// Navigation outranks prose at equal match quality: typing "projects" wants the
// section, not the six paragraphs that mention the word.
const KIND_WEIGHT: Record<SearchKind, number> = {
  section: 90,
  project: 90,
  heading: 55,
  course: 45,
  skill: 45,
  text: 0,
}

// No one paper may take more than this many prose rows, or a query the thesis
// happens to use a lot fills the list with one document.
const PER_PAPER_TEXT = 3
const LIMIT = 12

export function search(raw: string): SearchEntry[] {
  const query = raw.trim().toLowerCase()
  if (!query) return defaultEntries()
  const terms = query.split(/\s+/)
  const { index: all, haystacks: hays } = ensure()

  const scored: { entry: SearchEntry; score: number }[] = []
  for (let i = 0; i < all.length; i++) {
    const e = all[i]
    const [title, subtitle, body] = hays[i].split('\u0000')
    let total = 0
    let matched = true
    for (const term of terms) {
      // Every term has to land somewhere, or a two-word query matches anything
      // containing either half of it.
      const best = Math.max(
        fieldScore(title, term) * 3,
        fieldScore(subtitle, term) * 1.6,
        fieldScore(body, term)
      )
      if (best <= 0) {
        matched = false
        break
      }
      total += best
    }
    if (!matched) continue
    total += KIND_WEIGHT[e.kind]
    // The whole query appearing contiguously in the title is the strongest
    // signal there is, and a term-by-term sum doesn't capture it.
    if (terms.length > 1 && title.includes(query)) total += 120
    // A title the query IS beats a title the query merely starts. Without
    // this, "r" put the heading "References" above the skill R — both match a
    // word boundary at position 0, and the heading's kind weight broke the tie
    // the wrong way. Same for "git" against "GitHub".
    if (title === query) total += 200
    else if (title.startsWith(query)) total += 60
    scored.push({ entry: e, score: total })
  }

  scored.sort((a, b) => b.score - a.score)

  const out: SearchEntry[] = []
  const perPaper = new Map<string, number>()
  for (const { entry } of scored) {
    if (entry.kind === 'text') {
      const n = perPaper.get(entry.path) ?? 0
      if (n >= PER_PAPER_TEXT) continue
      perPaper.set(entry.path, n + 1)
    }
    out.push(entry)
    if (out.length >= LIMIT) break
  }
  return out
}

// A window of the matched text, opened at the first term and trimmed to word
// boundaries so a snippet never starts mid-word.
export function excerpt(body: string, raw: string, len = 150): string {
  const query = raw.trim().toLowerCase()
  const lower = body.toLowerCase()
  let at = -1
  for (const term of query.split(/\s+/)) {
    const i = lower.indexOf(term)
    if (i !== -1 && (at === -1 || i < at)) at = i
  }
  if (at === -1 || body.length <= len) return body.slice(0, len) + (body.length > len ? '…' : '')

  let start = Math.max(0, at - 40)
  if (start > 0) {
    const space = body.indexOf(' ', start)
    if (space !== -1 && space < start + 20) start = space + 1
  }
  let end = Math.min(body.length, start + len)
  if (end < body.length) {
    const space = body.lastIndexOf(' ', end)
    if (space > start + len * 0.6) end = space
  }
  return (start > 0 ? '…' : '') + body.slice(start, end).trim() + (end < body.length ? '…' : '')
}
