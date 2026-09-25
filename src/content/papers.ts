// Full text of the papers that have a reading page on the site, converted from
// the source PDFs. Paragraph breaks come from the PDF's own first-line indents
// (see CLAUDE.md, "Paper pages"), not from guessing at line lengths.

export type Block =
  | { type: 'p'; text: string }
  | { type: 'quote'; text: string }
  // Subheading inside a section (the thesis has two heading levels).
  | { type: 'h3'; text: string }
  // Bulleted list. The capstone poster is written as bullets, not prose;
  // `nested` marks the poster's second-level (➢) items.
  | { type: 'list'; items: string[]; nested?: boolean }
  // Cropped from the source PDF at the rectangle the image occupies there.
  // width/height are the PNG's real pixel size. They must be rendered on the
  // <img>, or lazy-loaded images have no reserved space: the page grows as you
  // scroll past them and a jump to a later section lands short.
  | { type: 'figure'; src: string; caption: string; width?: number; height?: number }

// A table rebuilt as markup rather than shown as a cropped image. The data
// lives in `tables.ts`, keyed by the image it replaces.
export interface PaperTable {
  // The thesis prints these as a title bar above the grid ("Table 3",
  // "Data Dictionary"). Rendered as a <caption>.
  title?: string
  columns: string[]
  rows: string[][]
  // Anything printed beneath the table, e.g. Table 4's 5-point scale key.
  notes?: Block[]
  // Paragraphs in the generated content that belong to this table and are now
  // drawn inside it — the title line the crop repeated, rows that spilled past
  // the crop's bottom edge, a notes block that fell outside it. Matched on the
  // exact text and dropped from the section, or the page prints them twice.
  absorbs?: string[]
}

export interface PaperSection {
  id: string
  title: string
  blocks: Block[]
}

export interface PaperAction {
  label: string
  href?: string
  pdfSrc?: string
}

export interface Paper {
  slug: string
  // Shown above the title. It used to match the Projects type label exactly;
  // that one has since been promoted to 600/--textcolor and this stayed
  // 500/--muted, because it sits directly above a much larger title rather than
  // beside one across a gutter.
  eyebrow: string
  title: string
  // Small key/value lines under the title: course, date, length.
  meta: { label: string; value: string }[]
  actions: PaperAction[]
  sections: PaperSection[]
  references?: string[]
}

import { basicIncome } from './basic-income'
import { csCapstone } from './cs-capstone'
import { thesis } from './thesis'
// Hand-written, not converted from a document — see project-pages.ts.
import { materialBoxes, rentalPrices, wageEffects } from './project-pages'

// PDFs that are no longer offered for download. Kian withdrew the full-text
// files for the thesis and the two capstones; the site links to the reading
// pages instead, and to the ASU Library record for the thesis.
//
// This is applied HERE rather than by editing the papers' own modules, because
// those three are generated from the source PDFs and carry a `View PDF` action
// in the generated output — a hand edit there is dropped by the next
// regeneration, and this isn't. The files themselves are gone from `public/`,
// so the action would 404 anyway.
const withheldPdfs = new Set([
  '/pdfs/thesis/thesis.pdf',
  '/pdfs/cs-capstone/cs-capstone.pdf',
  '/pdfs/basic-income/basic-income.pdf',
])

function withoutWithheldPdfs(paper: Paper): Paper {
  const actions = paper.actions.filter((a) => !(a.pdfSrc && withheldPdfs.has(a.pdfSrc)))
  return actions.length === paper.actions.length ? paper : { ...paper, actions }
}

// Structural edits to the papers, declared HERE for the same reason as
// withheldPdfs above: basic-income.ts, cs-capstone.ts and thesis.ts are
// generated from their source PDFs, so an edit made inside one of them is
// dropped by the next regeneration and an edit made here isn't.
export interface PaperEdit {
  // Section ids dropped from the page entirely.
  dropSections?: string[]
  // Figures dropped from the flow, by src. A figure that MOVED rather than
  // went away is dropped here and re-declared wherever it now renders.
  dropFigures?: string[]
  // Sections whose runs of consecutive figures are drawn as one carousel
  // instead of stacked down the page. Read at render time by Paper.tsx.
  carouselSections?: string[]
  // Names for the carousel's slides, by figure src. The poster carries no
  // captions, so these are written for the page — a carousel whose only label
  // is "2 / 3" tells the reader nothing about what they are flipping between.
  figureLabels?: Record<string, string>
}

export const paperEdits: Record<string, PaperEdit> = {
  'cs-capstone': {
    // "EPIC and Customer Archetypes" is poster apparatus: two one-word EPICs
    // and three customer types, no sentence between them. It reads as filler
    // on a page that is already short.
    dropSections: ['epic'],
    // The UI screenshot now opens the page underneath the Summary, where it
    // shows what was built before the reader is asked to read about it. It was
    // the last thing in Results, at the very bottom of the page.
    // Declared as the intro's `figure` in content/intros.ts.
    dropFigures: ['/pdfs/cs-capstone/figure4.png'],
    // Three architecture diagrams stacked ran 1,210px of a 3,862px page.
    carouselSections: ['design'],
    figureLabels: {
      '/pdfs/cs-capstone/figure1.png': 'The capstone API in place of EasyPost',
      '/pdfs/cs-capstone/figure2.png': 'Rate request sequence',
      '/pdfs/cs-capstone/figure3.png': 'Cache hit and miss flow',
    },
  },
}

function withEdits(paper: Paper): Paper {
  const edit = paperEdits[paper.slug]
  if (!edit) return paper
  const dropped = new Set(edit.dropSections ?? [])
  const figures = new Set(edit.dropFigures ?? [])
  return {
    ...paper,
    sections: paper.sections
      .filter((s) => !dropped.has(s.id))
      .map((s) => ({
        ...s,
        blocks: s.blocks.filter((b) => !(b.type === 'figure' && figures.has(b.src))),
      })),
  }
}

// Every project in the Projects grid has an entry here, because the cards link
// to `/papers/:slug` and nothing else. A project added to `works` without a
// page to point at is a dead card.
export const papers: Record<string, Paper> = {
  [basicIncome.slug]: withoutWithheldPdfs(withEdits(basicIncome)),
  [csCapstone.slug]: withoutWithheldPdfs(withEdits(csCapstone)),
  [thesis.slug]: withoutWithheldPdfs(withEdits(thesis)),
  [wageEffects.slug]: wageEffects,
  [rentalPrices.slug]: rentalPrices,
  [materialBoxes.slug]: materialBoxes,
}

// Sections that end in a long run of survey charts. Everything from the
// heading named here to the end of the section is replaced by the interactive
// explorer in components/SurveyExplorer.tsx, which draws the same results from
// the response counts in content/survey.ts. The heading itself stays visible
// above it, and the generated figure blocks it supersedes are dropped from the
// flow rather than rendered as pictures.
//
// Declared here rather than in the paper's own module because those modules are
// generated from the PDFs: this keeps the grouping out of the extracted content
// so regenerating can't drop it. `afterHeading` must match the heading exactly.
export const surveyExplorers: Record<string, { sectionId: string; afterHeading: string }> = {
  thesis: { sectionId: 'discussion', afterHeading: 'Bar Graph Breakdowns' },
}
