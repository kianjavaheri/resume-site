# kianjavaheri.com

My personal site - an interactive résumé and a set of reading pages for the
projects and papers behind it.

**Live at [kianjavaheri.com](https://kianjavaheri.com)**

## Stack

React 18 + TypeScript, built with Vite, routed with react-router. No UI or icon
library — the design system is hand-rolled CSS custom properties and every icon
is inline SVG. Deployed on Vercel.

The dependency list is deliberately four packages long.

## Running it

```bash
npm install
npm start      # dev server on localhost:3000
npm run build  # production build into dist/
npm run preview
```

`npm run build` also runs `scripts/prerender-meta.mjs`, which writes per-route
`<meta>`/Open Graph tags and a `sitemap.xml` so the project pages get real link
previews. `npm run og-images` regenerates the share images in `public/og/`;
it's a manual step, not part of the build.

## Layout

```
src/
  components/   UI, one file per piece; hooks live here too
  content/      All copy and data as typed modules — no CMS
  pages/        Home, the project reading pages, 404
  styling/      One stylesheet per component, tokens in App.css
scripts/        Build-time and one-off generation scripts
public/         Images, SVGs, PDFs — copied verbatim
```

A few things worth knowing:

- **`src/content/` is the source of truth.** The projects grid, the nav
  dropdown, the search index and the sitemap all read the same registries, so
  they can't disagree with each other.
- **Some content modules are generated** from source PDFs and say so at the
  top. Don't hand-edit those — the edits are declared separately in
  `content/papers.ts` so a regeneration can't drop them.
- **Image filenames carry a content hash.** `public/` is copied verbatim, so a
  stable name is a permanently cached URL; the hash is what busts it.

