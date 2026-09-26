// What a reading page ACTUALLY renders, as data.
//
// Paper.tsx used to compute this inline, which was fine while it was the only
// consumer. The search index is a second one, and it has to agree with the page
// exactly: an indexed paragraph that the page drops is a result that scrolls to
// nothing, and an indexed subheading whose id the page never renders is a dead
// deep link. So the three transforms that decide what survives live here, once:
//
//   1. `paperEdits` — already applied by the `papers` registry itself.
//   2. The SURVEY CUT. A section can end in a run of charts that the interactive
//      explorer supersedes; everything after the marker heading drops out.
//   3. The table ABSORBS. Several cropped tables cut off early and the remainder
//      was extracted as loose paragraphs, which the rebuilt tables now draw
//      themselves. Those paragraphs are filtered out or the page prints them
//      twice.
//
// Subheading ids are minted here too, for the same reason: the heading anchors
// on the page and the deep links in the palette have to be the same strings.
import { papers, surveyExplorers } from './papers'
import type { Block, PaperSection } from './papers'
import { paperIntros } from './intros'
import { paperTables } from './tables'

export interface RenderedSection {
  id: string
  title: string
  blocks: Block[]
  // Set when this section's trailing charts were replaced by the survey
  // explorer. The value is the heading it is drawn beneath.
  explorerHeading?: string
}

// `background` + "Actual Effects" -> "background-actual-effects". Scoped to the
// section so two sections can carry the same subheading without colliding, and
// stable across builds because it is derived from the text rather than counted.
export function headingId(sectionId: string, text: string): string {
  const slug = text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
  return slug ? `${sectionId}-${slug}` : sectionId
}

function sectionView(slug: string, section: PaperSection): RenderedSection {
  const explorer = surveyExplorers[slug]
  const cut =
    explorer && section.id === explorer.sectionId
      ? section.blocks.findIndex(
          (b) => b.type === 'h3' && b.text === explorer.afterHeading
        )
      : -1
  const stacked = cut === -1 ? section.blocks : section.blocks.slice(0, cut + 1)

  const absorbed = new Set(
    stacked.flatMap((b) => (b.type === 'figure' ? paperTables[b.src]?.absorbs ?? [] : []))
  )
  const visible = absorbed.size
    ? stacked.filter((b) => !(b.type === 'p' && absorbed.has(b.text.trim())))
    : stacked

  // Repeated subheading text inside one section gets a counted suffix, so the
  // ids stay unique even though they are derived from the text.
  const seen = new Map<string, number>()
  const blocks = visible.map((b) => {
    if (b.type !== 'h3') return b
    const base = headingId(section.id, b.text)
    const n = (seen.get(base) ?? 0) + 1
    seen.set(base, n)
    return { ...b, id: n === 1 ? base : `${base}-${n}` }
  })

  return {
    id: section.id,
    title: section.title,
    blocks,
    explorerHeading: cut === -1 ? undefined : explorer?.afterHeading,
  }
}

// Memoised because Paper.tsx calls it on every render and the thesis is 52KB of
// content. The registry is a module constant, so the result can never go stale.
const cache = new Map<string, RenderedSection[]>()

export function renderedSections(slug: string): RenderedSection[] {
  const hit = cache.get(slug)
  if (hit) return hit
  const paper = papers[slug]
  const out = paper ? paper.sections.map((s) => sectionView(slug, s)) : []
  cache.set(slug, out)
  return out
}

// Every id a link can land on for this paper: the intro, each section, each
// subheading, and the references list. The page uses it to tell one of its own
// fragments from a stray one — a nonsense `#100%` shouldn't be read as the
// reader asking to open a gated paper.
const linkable = new Map<string, Set<string>>()

export function linkableIds(slug: string): Set<string> {
  const hit = linkable.get(slug)
  if (hit) return hit
  const ids = new Set<string>()
  if (paperIntros[slug]) ids.add('intro')
  for (const s of renderedSections(slug)) {
    ids.add(s.id)
    for (const b of s.blocks) if (b.type === 'h3' && b.id) ids.add(b.id)
  }
  if (papers[slug]?.references?.length) ids.add('references')
  linkable.set(slug, ids)
  return ids
}
