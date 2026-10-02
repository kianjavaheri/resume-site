import type { Paper } from './papers'

/* THE SITE'S OWN READING PAGE.
 *
 * Hand-written, kept out of `project-pages.ts` because that file is
 * specifically "the projects with no source document" and this is not a
 * project.
 *
 * THE FRAME IS DESIGNER AND DIRECTOR, NOT AUTHOR OF THE CODE, and that is an
 * explicit instruction rather than a hedge chosen for the page. The design
 * decisions are the owner's; Claude writes the implementation. The page says
 * so in its first sentence, on the reasoning that a reader works it out anyway
 * and it lands far better stated plainly.
 *
 * THE PROSE HERE IS SUPPLIED VERBATIM. It is not a draft to be improved —
 * don't smooth it, don't lengthen it, and don't add sections. The one thing
 * that was changed is noted at the paragraph it affects.
 */
export const colophon: Paper = {
  slug: 'colophon',
  eyebrow: 'Colophon',
  title: 'How This Site Is Built',
  meta: [
    { label: 'Role', value: 'Design, direction, review' },
    { label: 'Implementation', value: 'Claude' },
    { label: 'Stack', value: 'React, TypeScript, Vite' },
  ],
  actions: [{ label: 'View GitHub', href: 'https://github.com/kianjavaheri/resume-site' }],
  sections: [
    {
      id: 'overview',
      title: 'Overview',
      blocks: [
        /* The supplied text ended this paragraph with an incomplete sentence —
           "The reason this project is listed " — which is left OUT rather than
           finished here. Inventing the end of a sentence about why the project
           is listed would be putting words in the author's mouth on the one
           page whose whole subject is who decided what. Restore it when the
           rest of it exists. */
        {
          type: 'p',
          text: 'I designed this site and directed the build process, however Claude wrote the code.',
        },
        {
          type: 'p',
          text: 'What it left me doing is the part I would have spent my time on anyway, which is deciding what the site should do, figuring out the constraints it had to work with, and deciding whether what came back was correct. Most of the work done here is a prompting, review, and a final decision of whether to keep the feature, refine it, or remove it.',
        },
        {
          type: 'p',
          text: 'This portfolio is not just a place to showcase my work, but also somewhere I can demonstrate my design skills both graphically and with agents. I’ve spent a lot of time refining this site and it’s been really fun to “own” something and continuously work on it.',
        },
        // Live commit count for this repository. It sits last so the page
        // still reads as written if the API is unreachable and it renders
        // nothing at all.
        { type: 'activity' },
      ],
    },
  ],
}
