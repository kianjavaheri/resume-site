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
  // Shown above the title. It used to match Selected Work's type label exactly;
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

export const papers: Record<string, Paper> = {
  [basicIncome.slug]: basicIncome,
  [csCapstone.slug]: csCapstone,
  [thesis.slug]: thesis,
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
