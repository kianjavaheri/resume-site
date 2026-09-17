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
  // Shown above the title, matching the project's type label in Selected Work.
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
