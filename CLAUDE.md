# Kian Javaheri — Resume Site

Portfolio for Kian Javaheri: May 2026 ASU/Barrett grad, **two degrees** (B.S. CS, B.S. Economics), seeking SWE/Data roles. React 18 + TS + Vite, react-router v7, Vercel.

## Rules

- **Never push to GitHub.** Commit locally only; Kian pushes.
- **`npm run build` is `vite build` plus `scripts/prerender-meta.mjs`** (per-route meta + sitemap). `npm run preview` is the only way to test it.
- **Hover is a layered `linear-gradient(var(--hover-tint), var(--hover-tint))` over the existing fill** — never a replacement color, never `opacity`. Re-declare `--sub-card-grad` beneath it where present; pick the tint matching the surface.
- **Nesting goes down.** A card inside a card gets the recessed `--well-bg`, never a raised fill.
- **`border-radius: 0 !important` is a global reset** — anything rounded needs `!important`.
- **No card borders.** Cards carry shadows; `--card-border` is for internal dividers.
- **No emoji-capable codepoints in copy.** Use inline SVG or append U+FE0E.
- **Icons are `<img src>` from `public/svgs/`**, never Vite imports. `src/util/svgs/` and `Resume.tsx` are dead; **`DotGrid.tsx` is not** — retained unrendered as `PulseRing`'s alternative.
- **Generated modules are rebuilt from PDFs** (`basic-income.ts`, `thesis.ts`, `cs-capstone.ts`). Never hand-edit; declare changes in `papers.ts`, `intros.ts`, `tables.ts` or `survey.ts`.
- **Shared measurements are tokens, not literals** (`--page-max`, `--paper-max`, `--card-gap`). Two copies of a number drift.
- **`App.css` is imported first in `App.tsx`** — Vite emits CSS in import order.
- **Measure, and look at the render.** Ask Kian before changing what a project *claims to do*; these notes aren't evidence.
- **A hidden browser pane reports `visibilityState: 'hidden'`, freezes transitions and swallows focus events.** Check the environment before concluding the code is broken.

## Notes

Rationale lives in `docs/`. Read the relevant file before changing that area.

| File | Covers |
|---|---|
| `build.md` | Build's second half, OG images, pane testing |
| `stack.md` | Dependencies, security, key decisions |
| `design-system.md` | Theme, tokens, typography, breakpoints |
| `file-structure.md` | Directory map, section defaults |
| `components.md` | Nav, palette, cards, About, pulse ring, carousels, Projects |
| `paper-pages.md` | `/projects/:slug` pages, charts, tables, PDF conversion |
