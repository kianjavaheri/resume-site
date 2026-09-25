# Kian Javaheri — Resume Site

## Workflow rules
- **Never push to GitHub.** Make commits locally only. The user pushes to remote themselves.

Personal portfolio/resume website for Kian Javaheri, a May 2026 CS & Economics graduate from Barrett, The Honors College at ASU (Summa Cum Laude, 3.93 GPA). He holds **two degrees** — B.S. Computer Science and B.S. Economics — and the site is written to make that read as two credentials, not one. He is based in the Bay Area, CA and looking for full-time Software Engineering and Data Engineering roles.

## Running the project

```bash
npm start        # dev server on localhost:3000
npm run build    # production build
npm run preview  # preview production build
```

Deployed on **Vercel** via git push to `master`. The build command is `vite build` (no `tsc` — esbuild handles TypeScript transpilation).

### Testing in a hidden preview pane

Four things behave differently when the browser pane is hidden, and each one has already been mistaken for a bug in this repo. **Check the environment before concluding the code is broken.**

| Symptom | Cause | Check |
|---|---|---|
| A CSS **transition** never moves — the inline `max-height` says `299px`, the computed value stays at the old one | The transition clock is frozen; `getAnimations()` shows the transition `running` at `currentTime: 0` | `el.getAnimations()`. To measure the real end state, set `transition: none` first |
| An **animation** jumps to its fill state and `animationend` never fires | Same frozen clock | `document.visibilityState` |
| **Focus** handlers never fire, though `document.activeElement` is set | A hidden pane isn't focused, so no `focus`/`focusin`/`blur`/`focusout` is dispatched — on any element, a plain `<button>` included | `document.hasFocus()` |
| `scrollWidth` exceeds `clientWidth`, or a `position: fixed` element sits outside the viewport | The emulated viewport is *scaled*: `innerWidth` and `clientWidth` disagree, and fixed elements anchor to the visual viewport | Compare against an element you didn't touch; if it overflows too, it's the pane |

A fifth, related: **programmatic `window.scrollTo` doesn't reliably fire a `scroll` event** there — dispatch `new Event('scroll')` after scrolling or the readings are stale.

Screenshots also come back blank while the pane is hidden, so verify structurally (`read_page`, computed styles, geometry) instead.

## Tech stack

- **React 18** with TypeScript
- **Vite 8** (rolldown bundler) with `@vitejs/plugin-react@6`
- **react-router-dom v7** (BrowserRouter in index.tsx)
- **use-local-storage** for theme persistence
- No UI or icon libraries are used in `src/`

### The dependency list is deliberately short
`package.json` carries only what `src/` actually imports: `react`, `react-dom`, `react-router-dom` and `use-local-storage`.

It used to also list `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-pdf` and four `@fortawesome/*` packages, none of which were imported anywhere. **They were uninstalled** — they were pulling a `@babel/core` toolchain in behind them and were the source of most of the repo's Dependabot alerts (browserslist, baseline-browser-mapping, `@babel/runtime`), all for code that never reached the bundle. Removing them cleared those alerts outright rather than patching transitive deps of packages nothing used.

Don't reintroduce them: the design has no UI-library dependency, and all icons are inline SVG or files in `public/svgs/`. See *Dependency security* below.

`src/components/Resume.tsx` and `src/util/svgs/` are likewise dead — see *Dead code and assets* under File structure.

### Dependency security

`npm audit` is expected to report **0 vulnerabilities**. If it doesn't, the order of preference is: delete the package if nothing imports it, then bump it, and only then reach for a major upgrade.

**react-router-dom is on v7, not v6, for a security reason.** GHSA-wrjc-x8rr-h8h6 (open redirect via backslash in `<Link>`/`useNavigate`) and GHSA-337j-9hxr-rhxg (constructor injection in SSR `deserializeErrors()`) cover `6.0.0 - 7.17.0`, so **there is no patched 6.x** — `6.30.6` is the last 6 release and is still in range. The fix only exists in 7.17.1+. Don't "downgrade back to v6 for stability": that reopens both advisories.

The migration was a non-event because the router surface here is five imports — `BrowserRouter`, `Routes`, `Route`, `Link`, `useParams` — all unchanged in v7. Neither advisory was actually exploitable on this site (every `to=` is a hardcoded string from the `papers.ts` registry, and there's no SSR), so the upgrade was hygiene, not an incident.

`postcss` and `nanoid` come in under `vite` and are build-time only; they patch with a plain `npm audit fix`.

## Theme

Three-state preference stored in localStorage under the key **`theme-pref`**: `'system'` (default), `'light'`, `'dark'`.

- `Home.tsx` reads `window.matchMedia('(prefers-color-scheme: dark)')` and subscribes to its `change` event, so the site follows the OS theme live with no reload.
- Clicking the nav toggle writes an explicit `'light'`/`'dark'`, which pins the site and stops it following the system.
- The resolved theme is applied as `data-theme` on the `.home` div.
- **`index.html` carries a small inline pre-paint script** that reads `theme-pref` and sets `documentElement` background + `color-scheme` before React mounts. Without it, dark-mode visitors get a white flash on every load. Keep it in sync with `--page-base` if those colors change.

The key is `theme-pref`, **not** `theme`. The old `theme` key was abandoned because `use-local-storage` persists its default on mount, so every prior visitor had `"light"` written to disk and would have been pinned to light forever.

## Design system

Card-based editorial design: rounded, borderless cards carried by drop shadows, stacked vertically with breathing room, over a flat page. Floating frosted-glass nav bar, aligned to the cards and rounded to match them.

### CSS custom properties (in `src/styling/App.css`)

Defined on `[data-theme='light']` / `[data-theme='dark']`:

| Token | Light | Dark | Purpose |
|---|---|---|---|
| `--bgcolor` | `#ffffff` | `#000000` | Base |
| `--textcolor` | `#000000` | `#ffffff` | Body text |
| `--muted` | `#666666` | `#999999` | Secondary text |
| `--page-base` | `#ffffff` | `#000000` | Page background (pure black in dark) |
| `--card-bg` | `#f7f7f7` | `#101012` | Outer section card fill |
| `--card-border` | `rgba(0,0,0,.1)` | `rgba(255,255,255,.1)` | Internal dividers only |
| `--sub-card-fill` | `#ffffff` | `#252525` | Inner card fill (fallback under the gradient) |
| `--sub-card-grad` | `#ffffff → #eff1f8` | `#252525 → #1a1c24` | 145° gradient on inner cards |
| `--well-bg` | `#e6e9f1` | `#15161d` | Recessed well *inside* a sub-card |
| `--well-shadow` | `inset 0 1px 3px rgba(0,0,0,.06)` | **`none`** | Inset shadow on that well |
| `--well-hover-tint` | `rgba(0,0,0,.045)` | `rgba(255,255,255,.05)` | Hover tint for surfaces on `--well-bg` |
| `--hover-tint` | `rgba(0,0,0,.032)` | `rgba(255,255,255,.022)` | Hover tint for page-colored surfaces |
| `--hover-tint-inverse` | `rgba(255,255,255,.16)` | `rgba(0,0,0,.14)` | Hover tint for `--textcolor`-filled surfaces |
| `--card-shadow` | — | — | Outer card elevation |
| `--sub-card-shadow` | — | — | Inner card elevation |
| `--nav-glass` | `rgba(197,203,217,.50)` | `rgba(68,68,78,.50)` | Nav pill fill |
| `--nav-rim` | white `.65`/`.30` insets | white `.14`/`.06` insets | Specular rim on the glass |
| `--nav-shadow` | — | — | Floating elements (nav bar, scroll button) |

`--toggle-btn-bg` / `--toggle-btn-bg-hover` feed only `.card-toggle-btn`, which is never rendered — see *Dead code and assets*.

### Hover is a layered tint, never a replacement fill

**This is the single most important convention here.** Hover is applied as:

```css
background-image: linear-gradient(var(--hover-tint), var(--hover-tint));
```

layered *over* the element's existing `background-color`. It is not a different fill color and never an `opacity` change.

Why it matters:
- A near-white hover fill on a white page composites to white and **disappears**. That bug has been introduced twice.
- On elements that already carry `--sub-card-grad`, a bare `background-image` on hover would **replace the gradient** and flatten the card. Those rules must re-declare it beneath the tint:
  ```css
  background-image:
      linear-gradient(var(--hover-tint), var(--hover-tint)),
      var(--sub-card-grad);
  ```
- On surfaces filled with `--textcolor` (the scroll-to-top button), use `--hover-tint-inverse` — the normal tint is keyed to the page and would be invisible.
- On surfaces filled with `--well-bg` (the coursework headers), use `--well-hover-tint`. `--hover-tint` in dark is only `.022` alpha — deliberately held down for the pure-black page — and on a well it is imperceptible.

### Nesting goes DOWN, not up

A card inside a card does **not** get another raised, lighter fill. Stacking `--sub-card-grad` on `--sub-card-grad` washes the whole stack toward white in light mode and toward grey in dark, and the hierarchy stops reading.

The third level is a **recessed well** — `--well-bg` (darker than the sub-card that contains it) plus the `--well-shadow` inset. Cards placed inside the well keep the normal `--sub-card-grad`, so they read as raised against it. Currently used by `.coursework-block`.

**Dark mode takes a much smaller step down than light.** `--sub-card-grad` already ends near black at `#1a1c24`, so matching light mode's ~9-point drop lands the well on top of `--card-bg` (`#101012`) and it reads as a hole punched through to the page rather than a recess. `#15161d` sits between the two.

**Dark mode has NO inset shadow — `--well-shadow` is `none` there.** An inset darkens the perimeter, and on a fill this close to black the rim composited darker than *both* the well interior and the sub-card outside it. A line darker than both its neighbours reads as a drawn border, and that is precisely what it looked like. The fill step alone carries the recess in dark. Light keeps its `0.06` inset, where the rim is gentle enough to read as depth rather than an edge.

The general rule: **an inset shadow needs enough headroom below the fill to fall into.** Near black there isn't any, so reach for fill contrast instead.

### Global reset
`src/styling/App.css` applies `border-radius: 0 !important` globally — intentional. Anything that needs rounding must use `!important` (`.section-card`, `.sub-card`, `.coursework-block`, `.course-card`, `.contact-card`, `.gallery-frame`, `.nav`, `.scroll-top`, `.skill-icon-wrap`, `.project-wip`, `.tag`, `.pdf-close`, `.paper-expand-btn`). The list isn't exhaustive — grep for `border-radius` before assuming a class is missing one.

### Typography
**Plus Jakarta Sans** from Google Fonts, weights `300;400;500;600;700;800`.

**Exactly two places name a font**, both in `App.css`: the `@import` at the top of the file and the `font-family` on the `*` reset. Nothing else does, so swapping a typeface is a two-line change.

**Roboto was tried and reverted.** Its `@import` is kept in a comment beside the current one. Two things that swap taught, worth keeping:

- **Metrics differ, and several layout constants here are measured against rendered type** — the nav's collapsed monogram, the Experience meta column against "Laboratories", the Projects tag chips fitting two rows. Re-measure those after any swap. Under Roboto all of them still held except the monogram, which is documented where it lives.
- **Weight is not portable either.** Roboto's 700 reads noticeably heavier than this face's, and `.about-hero-name` and `.project-title` both had to drop to 600 to stop shouting; they are back at 700 now. If a future swap makes the display type look heavy, that is the lever — not the size.

Section card titles are 0.95rem / 500. Normal casing everywhere — no `text-transform: uppercase` on nav links or section headers. Small uppercase letterspaced labels are used only for micro-labels (project tags, skill names, link buttons).

### Card layout system

Sections live in `.cards-wrapper` in `Home.tsx`: vertical flex, `gap: 12px`, `padding: 0 36px 44px` (no top padding — content sits directly under the floating nav).

- **`.section-card`** — outer card: `border-radius: 20px !important`, `background: var(--card-bg)`, `box-shadow: var(--card-shadow)`, **no border**, `overflow: hidden`.
- **`.card-header`** — flex row, `.card-title` left + non-clickable `.card-toggle-icon` (`+`/`−`) right. `padding: 18px 28px`. Entire row toggles.
- **`.card-header-static`** — non-collapsible header (About only).
- **`.section-body-wrapper` / `.section-body-inner`** — `grid-template-rows: 0fr → 1fr` expand/collapse (0.35s).
- **`.sub-cards-stack`** — `gap: 8px`, `padding: 10px 22px 22px`.
- **`.sub-card`** — inner card: `border-radius: 14px !important`, `--sub-card-fill` + `--sub-card-grad`, `box-shadow: var(--sub-card-shadow)`, no border, `padding: 20px 26px`.

### Collapse uses a CHILD combinator, not descendant

```css
.section-open > .section-body-wrapper { grid-template-rows: 1fr; }
```

The `>` is **required**. Education contains nested collapsibles that reuse `.section-body-wrapper`; with a descendant selector, an open outer section forces every nested body permanently open and unclosable. The nested rules are `.edu-open > .section-body-wrapper` (the ASU card) and `.coursework-open > .section-body-wrapper` (each coursework tab).

## File structure

```
src/
  components/
    About.tsx          # section-card, card-header-static; hero + bio + photo gallery; "View Resume"
    Education.tsx      # Collapsible, default OPEN. ASU sub-card + course data + nested <Coursework> blocks
    Experience.tsx     # Collapsible, default OPEN. Three expandable role cards (Sandia, ASU RA, ASU TA) w/ tags
    Projects.tsx       # Collapsible, default OPEN. Six uniform tiles, each a <Link> to /papers/:slug
    Proficiency.tsx    # Collapsible, default OPEN. 25 skills in 4 labelled groups of rounded icon tiles
    useClampedExpand.ts # Clamp-and-expand hook — Experience cards only (Projects tiles don't clamp)
    useTheme.ts        # Shared theme hook (theme-pref) — used by Home AND Paper
    useScrollRestore.ts # Per-history-entry scroll save/restore — used by Home AND Paper
    useModalChrome.ts  # Escape / click-outside / scroll lock for PdfModal
    FigureChart.tsx    # Inline SVG line charts for the thesis's Background figures
    SurveyExplorer.tsx # The thesis's survey section: question + dimension pickers, drawn bars
    Tags.tsx           # Tech tag pills — Experience cards and Projects card footers
    LinkIcon.tsx       # Inline SVGs for the Projects icon links (paper/pdf/library/site/github/curseforge)
    Contact.tsx        # NOT a section-card; label above, 3 contact-card links
    PdfModal.tsx       # Shared PDF modal (iframe); exports withViewerParams()
    Navbar.tsx         # Floating glass bar, card-aligned; collapses to "KJ" past 50% scroll; hamburger ≤768px
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; quiet, matches the paper top bar
    Scroll.tsx         # Back-to-top button; inverted fill, fades in past 400px
    ArrowOut.tsx       # Inline SVG ↗ for outbound links — replaces the emoji-prone U+2197
    ArrowBack.tsx      # Inline SVG ← for the paper pages' back button; 1em via .arrow-back
    ArrowBox.tsx       # Inline SVG box-and-arrow — the go mark in each project card's corner
    CalendarIcon.tsx   # Inline SVG calendar for the Experience date chips; 1em via .cal-icon
    Resume.tsx         # DEAD — not imported anywhere
  pages/
    Home.tsx           # Root; .cards-wrapper; theme via useTheme
    Paper.tsx          # /papers/:slug — abstract + "Read the full paper" gate, contents list, article
  content/
    papers.ts          # Paper/Block types + slug registry
    basic-income.ts    # GENERATED from public/pdfs/basic-income/ — regenerate, don't hand-edit
    thesis.ts          # GENERATED from public/pdfs/thesis/ — regenerate, don't hand-edit
    cs-capstone.ts     # GENERATED from public/pdfs/cs-capstone/ by scripts/extract-cs-capstone.py
    tables.ts          # Thesis tables rebuilt as markup, keyed by the PNG they replace
    charts.ts          # Background figures 1-4, derived from tables.ts (never re-typed)
    survey.ts          # All 10 survey questions x 7 subgroups; Q16 derived from tables.ts
    intros.ts          # Intro block by slug (abstract or overview) + the gate flag. Hand-written
    project-pages.ts   # Stub reading pages for the 3 projects with no source document. Hand-written
  App.tsx              # <Routes>: "/" → Home, "/papers/:slug" → Paper
  index.tsx            # createRoot + <BrowserRouter>
  react-app-env.d.ts   # vite/client types + the *.svg module shim
  util/svgs/           # DEAD — 8 SVGs, referenced nowhere. See below.
  styling/
    App.css            # Reset, tokens, card system, expandable cards + tags, PDF modal, scrollbar
    Education.css      # .edu-main 3-col grid + nested coursework rows
    Experience.css     # .experience-item 200px/1fr grid; .exp-meta logo-left row; TA sub-rows
    pages/Home.css
    pages/Paper.css    # Reading page, abstract gate, survey explorer, charts, tables
    components/
      About.css        # Hero, gallery (4/3, border-radius 14px, two-way slide)
      Contact.css      # 3-col grid of .contact-card
      Courses.css      # .courses-grid + .course-card + .course-card-num — imported by Education.tsx
      Footer.css       # Quiet in-flow bar + the two page-context gutter rules
      Nav.css          # Floating pill, glass, .nav-collapsed monogram + easings
      Proficiency.css  # .skill-group + label; .skills-grid flex-wrap; 72px .skill-icon-wrap; .skill-monogram
      Projects.css     # 3-across grid; .project-main link + sibling footer of chips and icons
      Scroll.css       # Inverted fill, rounded square, fade in/out
scripts/
  extract-cs-capstone.py  # Poster → src/content/cs-capstone.ts. Needs `pip install pymupdf`
public/
  images/              # img1–3.jpg used by the gallery (array in About.tsx);
                       #   img_dep*.jpg (4) are unreferenced
    projects/          # One .webp thumbnail per project — see Projects
  svgs/                # 27 files: asu, sandia + 25 skill icons (see Skills)
  pdfs/                # resume.pdf + a folder per paper: cs-capstone/, basic-income/, thesis/
```

### Dead code and assets
Verified unreferenced — safe to delete, and worth knowing about before you go looking for something:

- **`src/components/Resume.tsx`** — not imported anywhere; points at an old Google Doc.
- **`src/util/svgs/`** — 8 SVGs (`asulogo`, `cpp`, `gcp`, `go`, `java`, `js`, `python`, `react`) from before the move to `public/svgs/`. Nothing imports them. This is the trap the *SVGs live in `public/svgs/`* rule exists to avoid: there are two svg directories and only one is live.
- **`public/images/img_dep*.jpg`** — 4 files, not in the gallery array.
- **`.card-toggle-btn`** in `App.css` (plus `--toggle-btn-bg` / `--toggle-btn-bg-hover`, which feed nothing else) — styles for a button that is never rendered; headers toggle on the whole `.card-header` row.
- **`.hover-card`** in `App.css` — the hover tint without the pointer cursor. The Projects tiles took it while they were inert; they are links now and carry their own hover. The rule is annotated in place, because the distinction it encodes (never promise a click you can't honour) is worth keeping even while unused.

## Sections and defaults

| Section | Collapsible | Default | Notes |
|---|---|---|---|
| About | No | Always open | `card-header-static`. **Not hoverable** — see below |
| Education | Yes | **Open** | ASU sub-card, collapsed; expanding it reveals the two coursework expandables |
| Experience | Yes | **Open** | Three role cards, each collapsed to a 2-line preview |
| Projects | Yes | **Open** | A 3-across grid of uniform tiles (2 at ≤1100px, 1 at ≤768px). Each tile is a link to `/papers/:slug`: edge-to-edge visual, flush-right title, short blurb, rule, tag chips and small icon links. No counter, no type label |
| Skills | Yes | **Open** | 25 icon tiles in 4 labelled groups |
| Contact | No (not a card) | Always open | Title outside, 3 link cards |

**About is the one section card with no hover tint.** `.section-card:hover` is written `.section-card:not(.about-section):hover`, because every other section has a header that toggles it and the tint reads as "this responds" — About is `card-header-static` and has nothing to click, where a tint is a promise it can't keep. Same rule that keeps `.hover-card` and `.expandable-card` separate.

**Every section starts open. What's collapsed is the detail *inside* the cards.** Hiding whole sections by default made the site feel like it had little in it. The model is Brittany Chiang's portfolio: every entry is visible on arrival, and depth is on demand. Section toggles are kept for now. See *Expandable cards and tags*.

There is **no top-level Courses section** — it lives inside Education (see below). The navbar has **six** links: About, Education, Experience, Projects, Skills, Contact.

## Navbar

**Floating glass bar**: `position: fixed; top: 12px; left: 36px`, `width: calc(100% - 72px)`, height 56px, `border-radius: 20px !important`, **no border**, `overflow: hidden`.

**It is flush with the section cards, and rounded to the same 20px.** The left/right insets are `.cards-wrapper`'s own gutters — 36px desktop, 16px at ≤768px — so the bar and the About card beneath it share both edges exactly (measured at a 1024px viewport: both run 36 → 984). Change `.cards-wrapper`'s padding and these move with it, or the alignment silently drifts. The radius matches `.section-card`, so the bar reads as part of the same stack rather than as a separate pill floating over it; it was `999px` before. The collapsed monogram inherits it and becomes a 60px rounded square. The mobile menu panel is aligned and rounded to match (`left`/`right: 16px`, 20px).

`.home` has `padding-top: 80px` so content clears the pill by 12px, matching the section gap.

Mobile (≤768px) swaps the links for a `Menu`/`Close` hamburger; the menu is a rounded glass panel directly under the bar, flush with its left and right edges and carrying the same 20px radius. It uses the **same material** — same fill, blur, saturation and rim — and carries no `border`, since a solid line on glass reads as drawn rather than lit. Its text stays legible because the 24px blur destroys whatever is underneath.

### The glass is four things at once

`background: var(--nav-glass)` + `backdrop-filter: blur(24px) saturate(180%)` + `box-shadow: var(--nav-rim), var(--nav-shadow)`. **Tune them together — each one alone fails.**

- **Alpha must stay low** (`.50`). This is the whole effect: at `.80`+ the pill is an opaque slab and nothing reads through it.
- **The fill compensates for the alpha.** It still has to composite to ~`#e2e5ec` over the white page, or the pill dissolves against `--page-base` (`#fff`) and `--card-bg` (`#f7f7f7`). So as alpha drops, the fill gets *darker*, not lighter. Solve `a·F + (1−a)·255 = target` when changing either. Raising the alpha to fix visibility is the mistake that killed the glass the first time.
- **Blur stays at 24px.** 40px averages whatever is behind into one flat tone and you lose the light/dark structure that tells you anything is back there.
- **Saturation is 180%.** Blur alone leaves a grey slab; the boost puts the color back. (This *was* held at 105% when the fill was near-opaque, where saturation only tinted the bar. At `.50` it's what makes the material read as glass.)
- **`--nav-rim` carries the edge over photos**, where the drop shadow is invisible — a bright top inset plus a fainter full ring, standing in for a specular highlight. Dark mode's is much fainter; a bright rim on a dark pill reads as a drawn border. `--nav-shadow` stays two-part: a soft cast for float, a tight `0 1px 3px` for the edge on flat backgrounds.

Contrast holds over the photo: at `.50` over the darkest part of the gallery image the composite is ~`#808486`, ~4.9:1 against the near-black nav text.

### Collapses to a "KJ" monogram past 50% scroll

`.nav-collapsed` shrinks the pill to 60px and crossfades "Kian Javaheri" to "KJ" (it used to fade the whole bar to `opacity: 0`). The scroll handler only reads `scrollY`; page height is remeasured on `resize` **and** via a `ResizeObserver` on `body`, because expanding a section changes document height without firing a resize. It never collapses while the mobile menu is open.

- **`.nav` is sized with `width`, not `right`** — the collapse animates width, and `left` + `width` + `right` is over-constrained (`right` gets dropped and the pill sits off-centre). The mobile query must override `width` too, for the same reason. It resolves against the initial containing block, so `left: 36px` + `calc(100% - 72px)` equals `right: 36px` exactly.
- **The mobile `.nav-collapsed` is restated inside the media query.** It has the same specificity as the `.nav` rule there, so on source order alone the mobile width would win and the pill would never collapse on a phone.
- `overflow: hidden` clips the full name and the links as the pill closes over them. The links keep their layout width while collapsed, so they need an explicit `pointer-events: none`.
- Both labels stay mounted. `.name-full` only goes transparent, which keeps the link's accessible name intact; `.name-mark` is `aria-hidden` and absolutely positioned at `.name`'s left edge, so the monogram lands where the "K" already was.
- The 60px width and its `22px` padding are a pair, and the sum **depends on the typeface**: "KJ" at 0.9rem/600 measures **15.3px in Plus Jakarta Sans**, against a 16px content box (`60 − 22 − 22`), so `22 + 15.3 + 22 ≈ 60` centres it. Measured at **17.2px in Roboto** during that experiment, where it ran 1.2px into the right padding and sat 0.6px off centre — not clipped, but the reason this pair is worth re-measuring after any font change. Retune both together, and note the mobile `.nav-collapsed` restates the width, so both rules move at once.

#### Two easing curves, not one
`--ease-settle` and `--ease-spring` are both sampled from a damped oscillation, `1 − e^(−ct)·cos(ωt)` at `ω = 2.5π`, expressed as CSS `linear()`. They differ only in damping, and **the pair is necessary**:

- The bar's **width** travels ~1148px to reach a 60px destination (it was ~1184px when the bar was inset 16px rather than 36px; the argument is unchanged, and so is the curve). Overshoot on a transition is a percentage of the *travel*, so even a 6% overshoot drives the width below zero — the pill would visibly collapse to nothing and pop back. `--ease-settle` (`c = 14`) peaks at ~1.2%, about 14px, which reads as a settle.
- The monogram's **scale** has no such constraint, so `--ease-spring` (`c = 6`) peaks at ~12% and shows two decaying lobes. That is where the oscillation is actually legible.

Retuning one without the other is the trap: raising `--ease-settle`'s amplitude to match the spring breaks the geometry.

`linear()` needs Chrome 113+ / Safari 17.2+ / Firefox 112+. Older engines drop the declaration and fall back to the transition's default easing — the collapse still works, just without the settle.

#### Mobile
The collapse runs on mobile too, at a shorter **0.42s** (desktop is 0.55s), with the monogram's spring matched to the same duration so the two don't desync.

Duration is the only performance lever that doesn't change how the glass looks. `width` is a layout property and the pill carries a `backdrop-filter`, so every frame re-rasterises a 24px blur over a changing area — fewer frames, less work. It is not a *new* class of cost: a fixed blurred element over scrolling content already re-blurs on every scroll frame. The monogram's spring is a `transform` and stays composited either way. If a real device still janks, the next lever is dropping the mobile blur radius (24px → ~16px), which does trade away some of the glass.

**Why not `clip-path` instead of `width`,** which would avoid layout entirely: `clip-path` clips the element's drop shadow, so the pill loses `--nav-shadow` and stops floating. Moving the shadow to a parent as `filter: drop-shadow()` doesn't rescue it either — a `filter` on an ancestor creates a new backdrop root, which kills `backdrop-filter` on the child and takes the glass with it.

**Known gap:** on mobile the hamburger is clipped away while collapsed, so the menu is unreachable past the halfway mark. That was equally true when the whole bar faded out, but the pill is now visible and looks interactive. Making a tap on "KJ" expand the bar again would close it.

## Expandable cards and tags

**`useClampedExpand`** (`src/components/useClampedExpand.ts`) is used by the Experience cards. It used to drive the Projects rows too; those are always-open grid tiles now (see *Projects*), so the hook has one caller.

- A card starts clamped to **two lines** of its first text block, with the last line faded by a `mask-image`. A `+`/`−` sits beside the title. Clicking anywhere on the card toggles it, and each card is independent.
- **The markup is two boxes.** An outer `.clamp` takes `clampClass` + `style`, around an inner wrapper that takes `innerRef`. The inner wrapper is measured and observed: it keeps its natural height inside the clamped box, so any reflow (a resize, the web font arriving) fires the `ResizeObserver`.
- **The line height comes from the inner wrapper's first child**, so put the text you want previewed first. If that child has no explicit `line-height`, the hook falls back to `1.4 × font-size`.
- Heights go inline as `max-height`, because it can't transition to `auto`. They're **re-measured on click**, since the observer can lag a resize by a frame and a stale height clips the text.
- **No inline `max-height` until the first measurement.** `none` → length doesn't transition, so cards don't visibly animate shut on page load.
- Content that already fits in two lines gets no indicator, fade, hover tint or pointer cursor.
- **The hover tint and the pointer cursor are separate classes** in `App.css`. `.hover-card` is the tint alone; `.expandable-card` adds `cursor: pointer` on top of it. The Projects tiles take the first because nothing on them is clickable, and a pointer on an inert card is a promise it can't keep. Per the hover convention, both re-declare `--sub-card-grad` beneath the tint.

**Tech tags** (`Tags.tsx`; `.tag-list` / `.tag` in `App.css`) sit **below** the clamp, so they stay visible while a card is collapsed. They're chips filled with `--well-bg` and set in `--textcolor`: recessed rather than raised, per *Nesting goes DOWN*, in the site's neutral palette. They're **boxy, not pills**: `border-radius: 6px` on a ~23px chip is the same proportion as `.project-wip`'s 4px on 15px, so the tags and the badge read as one shape at two sizes. Scale the radius with the height if either changes. They're deliberately **normal case**, not the uppercase micro-label, because names like `PostgreSQL` read wrong in caps. Tags are drawn only from what each entry's text states. Don't add a language the copy doesn't mention without checking with Kian.

**Santa Cruz Rental Price Model is the one entry whose tags go past its copy**, and deliberately: `LightGBM` and `Ridge Regression` name the model actually trained and the baseline tried before it, neither of which the description mentions (it says only "gradient-boosted"). Kian supplied both. Its first draft carried `JavaScript` and `RentCast API` from the copy's own wording; those came off because **the tags credit what Kian built, not what the project contains** — the pipeline and the client-side app were largely Claude's, and the modelling was his. That distinction is worth keeping in mind for any future entry: the tag row is an attribution, not an inventory.

### Experience
Three cards: Sandia, ASU Junior Researcher and ASU Undergraduate Teaching Assistant.

**The company name and the role are both 0.95rem / 600.** Not a style preference — Experience was the last of the three sub-card sections still setting them at body weight. `.edu-institution` (the name at the head of Education's meta column) is 1rem/600 and `.project-title` is 0.95rem/600, so `.exp-company` matches the first in role and `.exp-role` matches the second exactly. A card's hierarchy is then weight and colour, not colour alone: role and company at 600 `--textcolor`, location and dates at 400 `--muted`.

**Wording:** the **bullets follow Kian's resume** (`~/Library/CloudStorage/Dropbox/resume.pdf`), lightly adapted into sentences. The **paragraphs above them are hand-written**, so keep edits to them minimal and never smooth them into generic resume-speak.

**The paragraph is context, not a second copy of the bullets.** Both descriptions were cut roughly in half (Sandia 76 words in four sentences to 52 in two; the researcher role 50 to 34) because they restated the bullets almost claim for claim — the same tool, the same plugin, the same scraper, the same OCR — which is most of what made the section feel wordy. What survives is what the resume bullets *don't* carry: the feedstock gloss, the user-facing framing, the mentor, the supervising professor. The paragraph is also the collapsed preview's two lines, so it still has to open with what he built. No buzzwords, and no outcome claims the resume doesn't make. (To read the PDF here: `pdftotext` is installed — `pdftotext -layout` is the quickest way in. Python PDF libraries are not; macOS PDFKit via `osascript -l JavaScript` also works.) The two ASU roles used to share one card with a timeline. They were split so each role collapses on its own. Cards use a `200px 1fr` grid (170px at ≤1024px, stacked at ≤768px). This **used to be paired with the Projects rows**, which carried the same grid so the two sections lined up down the page; Projects is a thumbnail grid now and has no left column, so the width is Experience's own to change. The TA card has no summary paragraph, so its preview is the first course row. **CSE 310 is deliberately first**, ahead of the earlier FSE 150. It's the role that matters most to employers, so it's the one visible while the card is collapsed.

**The meta column is two rows: icon and name side by side, then the date chip underneath.** `.exp-meta` is a flex *column*; `.exp-meta-head` is the row inside it, holding a 60px `.exp-logo` tile (`border-radius: 15px !important`, logo inset 6px, `object-fit: contain`) beside `.exp-company`. **Radius scales with the tile at 0.25** — keep 60/15 in step. It's decorative (`alt=""`) — the company name is right next to it. `.exp-meta-head` needs `min-width: 0` or the flex item refuses to shrink below its longest word and pushes the tile out of the column.

**The inset is 10% of the tile, not a sixth.** It was 9px on 56px, which left a 38px mark in a 56px tile and read as stranded — worst on the circular ASU seal, since `object-fit: contain` on a circle wastes the tile's corners and reads smaller still than a square glyph in the same box. 6px on 60px is an app-icon proportion and puts the mark at 48px, 26% bigger. **60px is the ceiling, and the constraint is the name beside it, not the tile**: at the 1024px breakpoint the column is 170px, so the name gets `170 − 60 − 12 = 98px` against "Laboratories" at 93.4px. 64px would leave 0.6px, which one font fallback erases. Measure that word before growing it again.

**There is no location line.** It was the least useful thing in the column — the resume carries it, and nobody reads a portfolio to learn a former employer's city. Dropping it left the column with a name and a date, which is what made a chip worth the space.

**The date is an outlined pill, and every attribute of it is the inverse of `.tag` on purpose.** `.exp-date` is `background: none` + a 1px `--card-border` rim + `border-radius: 999px !important`, against the tags' filled `--well-bg`, no border and boxy 6px. It carries a **calendar glyph** (`CalendarIcon.tsx`), which is why it's `inline-flex` with a 6px gap, and `font-variant-numeric: tabular-nums` lines the three cards' dates up with each other down the column.

It first shipped as a *copy* of the tag treatment — same fill, same boxy radius, same 0.7rem/500 — and that was the mistake: the date and the tech chips looked like two instances of one component that happened to sit at opposite corners of the card, and the calendar glyph alone wasn't enough to separate them. **Three attributes now differ at once (fill, rim, shape), which is what makes the two families read as deliberate rather than as an inconsistency. Don't half-revert one of them.**

The rim uses `--card-border`, the internal-divider token. That's a mild extension of *No card borders* — that rule governs cards, which carry shadows instead, and this is a chip. The text stays at full `--textcolor`: a quiet container around confident type, not a muted caption. The `*` reset sets `border: 0` without `!important`, so a class rule wins on specificity alone; only `border-radius` needs the `!important`.

Measured: the pill is 155px, inside the 170px column at the 1024px breakpoint with 15px to spare, and 25px tall, which keeps the meta column's intrinsic height at 97px against 115–117px of content.

**`CalendarIcon.tsx` is inline SVG, not a file in `public/svgs/`** — same reason as `LinkIcon.tsx`: it sits on a chip whose text is `--textcolor` and has to take its colour from it, which an `<img>` can't. It's stroked at 1.3 on a 14-unit viewBox, matching `ArrowOut`'s weight so the two read as one icon set, and sized `1em` by `.cal-icon` in `App.css` (beside `.arrow-out`, which works the same way) so it tracks its label instead of carrying a px size per caller. **It has no day dots inside the body**: the chip renders it at 11.2px, where a grid of 1px dots is mush. The header rule alone reads as a calendar. **It sits on its own row, and that's what fixed the wrap this section used to log as a known trade.** Beside the tile it had 132px on desktop and 102px in the 769-1024px band against the 117px `May 2023 – Aug 2024` needs, so that string broke onto two lines at every tablet width. On its own row it gets the column's full 200px (170px at the breakpoint); measured at both, the chip is 132px on one line with 38px to spare.

The tile used to sit *above* the name. Moving it beside the text is what finally removed the height overhang this section used to log as a known trade: measured at 1280px, all three cards have `.exp-meta` exactly as tall as `.exp-content` (117/117, 117/117, 115/115), so every card is content-driven. Growing the tile from 48px to 56px cost nothing there — same heights, same line counts.

**The whole constraint is the name's width**, which is whatever the tile and the 12px gap leave: 128px of the 200px column, and 98px at the 1024px breakpoint. Measured against the bold 0.95rem/600 name, the longest unbreakable word is "Laboratories" at 93.4px, so there is 4.6px of headroom at the tightest size. **That number is the budget — check it before growing the tile again.** The date no longer competes for it (see above). The old reason not to widen the column past 170px — that Projects' left column had to match it — is gone with that layout, so the only constraint left is this one.

**This reverses an earlier decision, deliberately.** The logo used to be half the column's width and revealed only on expand, inside a `.exp-logo-wrap` that used the same `0fr → 1fr` trick as the clamp, because at full size it set each collapsed card's height on its own — about 250px on desktop and 450px on a phone against ~150px of content. Shrinking that *bare* mark to around 56px was tried then and read as an awkward middle size — neither a logo nor an icon.

What changed is the **treatment, not the size**, and that distinction is the whole lesson: the tile is 56px today, the same size that failed as a bare mark. A mark floating loose in a text column has no role and looks stranded at any size; the same mark on a filled, rounded tile is an icon, and reads as deliberate. `.exp-expanded`, `.exp-logo-wrap` and `.exp-logo-inner` are gone with it — the first existed only to gate the second.

**The tile is `--well-bg`, not a fixed fill**, for two reasons. It's the site's step-down convention (*Nesting goes DOWN*), shared with the tags and the Projects thumbnails. And its lightness in each theme is within a point or two of the sub-card the logos already sat on, so neither mark changes appearance — which matters here, because **the Sandia glyph carries black elements and the ASU seal carries white ones**. Any fixed fill makes one of them lose parts in one of the themes.

**The old height problem is now gone outright.** While the tile sat *above* the name it still drove the Sandia card 14px past its own content (185px collapsed against 171px of content), which was logged here as a knowing trade. Moving the tile beside the text ended it: measured at 1280px, all three cards have `.exp-meta` exactly as tall as `.exp-content`, and growing the tile to 56px didn't bring it back. If a card ever runs taller than its content again, the meta column is what to measure first.

## Education section

`.education-item` is a flex **column**:
1. `.edu-main` — 3-col grid `auto 210px 1fr` (logo / meta / content)
2. `.edu-coursework` — the nested coursework rows

The two degrees render as **two separate `B.S.` lines** inside `.edu-degrees` (3px apart, tighter than surrounding lines) so they read as two credentials.

### The card itself collapses
The ASU sub-card starts **collapsed**, showing school, dates, degrees and honors. Clicking it reveals the coursework tabs. It matches the Experience cards, but it is **not** `useClampedExpand`: there's no text to preview, only a whole region to show or hide. So it reuses the sections' `0fr → 1fr` `.section-body-wrapper`, gated on `.edu-open > .section-body-wrapper`. That's a **child combinator**, for the same reason as `.section-open`: the coursework blocks nested inside reuse the wrapper.
- `.edu-coursework` **stops click propagation**, so opening a tab or clicking a course card doesn't also collapse the card.
- The `+`/`−` (`.edu-toggle`) is **absolutely positioned** in the card's top-right corner rather than added as a grid column, so the three-column `.edu-main` and its breakpoints are unchanged.
- It carries `.expandable-card`, so it gets the same pointer and hover tint as the Experience cards.

### Nested coursework
Course data (`cseCourses`, `ecnCourses`) lives in `Education.tsx`. A local `<Coursework>` component renders one collapsible block per degree, **both closed by default**, toggling independently. The header shows the degree name with a muted `Coursework · N courses` subtitle beneath.

Each block is a **rounded recessed well** inset within the education sub-card — `border-radius: 14px !important`, `--well-bg`, `--well-shadow` (which is `none` in dark; see *Nesting goes DOWN, not up* for why). The course cards inside keep `--sub-card-grad`, so they read as raised against the well.

`.coursework-header` carries **its own matching `border-radius: 14px !important`**, and the block has **no `overflow: hidden`**. Both matter:
- The hover tint is then a full pill on all four corners, open or closed, rather than a rect with a square bottom edge.
- Clipping the header to the parent's radius instead left the block's antialiased edge and inset shadow showing as a hairline outline the tint never covered. Letting the header paint its own rounded background removes that seam.

Keep the two radii in step. Nothing needs the block-level clip — `.section-body-inner` already has `overflow: hidden` for the collapse animation.

`.edu-coursework` is a plain flex column, `gap: 8px`, `margin-top: 20px` — the blocks are inset by the card's own padding, so nothing is full-bleed and `.education-item` needs no `overflow: hidden`.

### Course card watermark number
Each `.course-card` is a flex row: a `.course-card-text` column (code above name) and a `.course-card-num` watermark on the right carrying the catalogue number — `310`, `445`, and so on, sliced off the code in `Education.tsx`.

**The treatment is identical on all sixteen cards; only the digits change.** That is the whole point. This started as per-course topic icons (a small shared glyph set — tree, network, layers…) and it was wrong: every card ended up with a different silhouette and the grid stopped reading as one set of things. Uniformity of *form* is what makes a grid of sixteen cards feel deliberate. Don't reintroduce per-card artwork.

- Tinted from `--textcolor` at `opacity: 0.11` (rising to `0.2` on card hover) rather than a fixed grey, so it inverts with the theme and needs no dark-mode rule.
- It duplicates `.course-card-code`, so it is texture rather than information and is **`aria-hidden`** in the markup — a screen reader should not read the number twice. That also means its low contrast is not an accessibility problem: the accessible copy is the full `CSE 310` label above it.
- **Hidden below 520px.** Two columns on a phone leaves ~90px for the course name once the watermark and its gap are taken out, which wraps the longer titles to four lines.

## Skills section

25 skills in `Proficiency.tsx`, in **four labelled groups**: Languages (7), Frameworks & Libraries (7), Developer Tools (6), Data & Research (5). Each group is its own `.skill-group` — a `.skill-group-label` above a `.skills-grid` flex-wrap of `.skill-item`; each icon sits in a 72px `.skill-icon-wrap` (`border-radius: 16px !important`, sub-card gradient + shadow).

**The groups have to be render structure, not just array order.** This was previously one flat array ordered languages → frameworks → tools with blank lines between the runs. `.skills-grid` is `flex-wrap`, so rows reflowed straight across those boundaries and the ordering was invisible — all the maintenance cost, none of the benefit.

**Data & Research is deliberately not folded into Developer Tools.** Stata, QGIS, Qualtrics, MATLAB and JupyterHub are the tooling behind the econometrics and the thesis, and they are the clearest evidence in the site that the Economics degree is a second credential rather than a line item. Filing them under "Developer Tools" both mislabels them (Qualtrics is a survey platform) and buries the point. It also keeps the buckets even — 7/7/6/5 instead of 7/7/11.

`skillGroups` is **explicitly annotated** `{ label: string; skills: Skill[] }[]`. Without the annotation each group's array gets its own narrow element type and `s.invertDark` errors in the groups that have no inverted icon.

### Group labels reuse the skill-name micro-label
`.skill-group-label` is the same 0.65rem uppercase letterspaced type as `.skill-name` — **no new step in the type scale**. The hierarchy is carried by weight and color alone: labels are 600/`--textcolor`, the names under the tiles stay 500/`--muted`. Enlarging the label is what would make this section noisy.

Spacing has to keep a group break louder than a row wrap: `.skills-wrapper` row gap `34px` (28 mobile) against `.skills-grid`'s `24px` row gap (20 mobile), plus the label and its `16px` (14 mobile) offset. Narrow the wrapper gap toward the grid's and the groups stop reading as groups.

### 2×2 above 1100px
`.skills-wrapper` is a grid, `auto auto`. Source order gives Languages | Frameworks & Libraries on top and Developer Tools | Data & Research below. Stacked, the section was twice as tall as it needed to be and left most of the card empty on the right.
- Columns are **`auto`**, so each is only as wide as its longest row of tiles. `justify-content: start` keeps the pair left-aligned rather than spread across the card.
- The **64px column gap** is what separates two groups sitting side by side. It has to stay well clear of `.skills-grid`'s **20px** tile gap, which was cut from 36px so seven Languages tiles fit on one row inside half the card.
- **≤1100px** stacks the groups again, because the two top-row groups no longer fit side by side on one line each.

- Icons are `<img src="/svgs/name.svg">` from `public/svgs/` — **not** Vite imports.
- Most are **simple-icons** glyphs with the brand hex added as a `fill` attribute on the `<svg>` tag (matching how `react.svg` was already built).
- **Skills without an SVG fall back to an `abbr` monogram.** Nothing uses it right now; the mechanism stays for the next skill that has no glyph. To promote one: drop the file in `public/svgs/` and swap `abbr` for `src`.
- **MATLAB is the one non-simple-icons icon.** simple-icons still has no MATLAB glyph (it 404s), so `matlab.svg` is **devicon's** (MIT) — the real membrane mark, and the only multi-colour, gradient-carrying icon in the set. The gradients use `id`s, which is safe only because these are loaded through `<img src>`, where ids stay scoped to the file. Inline it and they'd collide.
- **PySpark wears the Apache Spark mark** (`apachespark.svg`), since simple-icons has no PySpark glyph and it's the same project. PyTorch and PySpark are both filed under Frameworks & Libraries, not Data & Research — that group is specifically the econometrics/thesis tooling (see above), and these are Python libraries.
- `invertDark: true` applies `filter: invert(1) brightness(0.85)` in dark mode. Used by **Flask** and **GitHub** (GitHub's brand hex `#181717` is invisible on black).
- C++ uses the lighter logo blue `#659AD2` rather than `#00599C` for dark-mode legibility.

## About layout

The **title sits at the top of the text column** (`.about-text`), not in a full-width hero row above it. The gallery starts level with the title rather than below it, which removes that row's height from the card. `.about-content-area` is top-aligned (`align-items: flex-start`) and carries the top padding the old `.about-hero` row had at each breakpoint. On mobile the column stacks as title → bio → resume link → gallery, the same order as before.

## About gallery

`<Gallery>` in `About.tsx`. Three photos from the `images` array, prev/next arrows and an `n / N` counter. The frame is `aspect-ratio: 4 / 3`, `border-radius: 14px !important`, `overflow: hidden` — 14px because that is `.sub-card`'s radius and every other panel nested inside a section card uses it. It was 75px, which made the gallery the one element on the site with a radius of its own.

### Both slides animate, not just the incoming one
The transition keeps **two** images mounted: `idx` (incoming) and `outgoing`. They animate in step — the old one exits a full frame width while the new one enters — and the frame's `overflow: hidden` clips both. `outgoing` is cleared in `onAnimationEnd` on the incoming image.

This previously animated only the incoming image, over 40px with a fade, and swapped the old one out instantly via `key={idx}`. That reads as a pop, not a slide.

Details that matter:
- **`.gallery-img` is `position: absolute; inset: 0`** so the two slides stack. The frame keeps its height from `aspect-ratio`, so nothing collapses when both images leave the flow.
- **No enter class on first paint** (`sliding` is false until the first click), or the opening photo slides in on every page load.
- **No fade under the slide.** At a full 100% travel a cross-fade only muddies the midpoint.
- **`prefers-reduced-motion: reduce`** swaps the slide for a 0.2s fade — a full-width move is exactly the motion that setting exists to suppress. The enter still animates, so `onAnimationEnd` still fires and the cleanup path is unchanged.

### A slide never starts on an image that isn't there yet

The arrows used to change `idx` immediately, so clicking to a photo the browser hadn't fetched slid an **empty frame** in and popped the photo in afterwards. Two halves to the fix, in `About.tsx`:

- **Neighbours are warmed in an effect keyed on `idx`**, so by the time you click, the target is usually already decoded and the handler advances synchronously — the click keeps its old instant feel. It runs in an effect rather than at module scope so it starts *after* the first slide mounts and competes with nothing for the initial paint. (With three photos both neighbours are the whole set, so all three are in flight shortly after mount.)
- **A cold target is awaited before anything moves.** `ready` (a `Set` ref) records what's decoded; `busy` (a ref) guards the await window, because without it a second click during a fetch would start a slide from a stale `idx`.

**`preload()` must always settle, and that is the whole trap.** It resolves — never rejects — on `load`, on `error`, on `decode()`, on an already-`complete` image, **and on a 3s timeout**. The timeout is not belt-and-braces: `img.decode()` can stay pending *indefinitely* while `document.visibilityState === 'hidden'`, since the browser defers rasterising a page nobody is looking at. The first version awaited `decode()` alone, and in the hidden preview pane the first click set `busy` and never cleared it — **every arrow click for the rest of the session was silently dropped**. The `await` is also wrapped in `try/finally` so `busy` clears on any path. Falling back to the old un-preloaded slide is always better than an arrow that stops responding.

`load` is the primary signal precisely because it fires regardless of visibility; `decode()` only sharpens it to "ready to paint". `onLoad` on the rendered `<img>` also adds its own index to `ready`, so the first photo counts itself.

This is a case where the hidden-pane rules at the top of this file describe a **real** failure and not an artifact to look past — the stuck flag was genuine. Test the arrows after any change here, and test them *twice*, since the bug only showed from the second click on.

**Why not a `translateX(-idx * 100%)` track?** Simpler CSS, but wrapping from the last photo back to the first slides the whole strip backwards — the wrong direction. With three images you hit that wrap every third click. The two-layer approach keeps the direction correct on wrap in both directions.

Note when testing: an animation's clock does not advance while `document.visibilityState === 'hidden'`, so in a hidden preview pane the transforms jump straight to their `forwards` fill state and `animationend` never fires. Check `element.getAnimations()` rather than sampled transforms if playback looks broken.

## Projects

A grid of **uniform tiles, each one a link to that project's page**. Modelled on the reference portfolio Kian supplied: an edge-to-edge picture, a flush-right title, a short justified blurb, then a rule and a pipe-separated tag line, with the footer bottom-pinned.

**The reference's big corner counter was tried and CUT.** At 2.6rem/700 it was the loudest thing on a card that already leads with a picture, and it numbered the grid without telling the reader anything. Don't reinstate it just to match the reference — `.project-index`, the `index` prop and the count-down computation are all gone with it.

**Its pipe-separated tag footer was tried and cut too** — see *The card, top to bottom*. What survives from the reference is the edge-to-edge picture, the flush-right title, the short justified blurb and the bottom-pinned rule.

**Two things the reference has that this deliberately doesn't:** a **year** under the tags (*Projects carry no dates* — see below), and a hairline **border** around each card instead of a shadow (*No card borders* is a site-wide rule; these carry `--card-shadow` like every other card).

### The whole tile is one `<Link>`
`to` is what the card's old "Read" button pointed at. Every project has a page under `/papers/:slug`, so there is no outbound-link case to handle and `to` is a plain string.

- **There is nothing else inside the card to click** — no nested `<a>`, no buttons — because a link inside a link is invalid and unusable with a keyboard. That is why the **outbound links moved onto each project's page** as `actions` (GitHub, CurseForge, the live site, the PDFs). Nothing was lost: the three papers already carried theirs, and the three new pages were given them.
- The card takes `cursor: pointer` **honestly** now. Under the old layout the tile was inert and only the buttons worked, which is why it took `.hover-card` (tint, no pointer) instead — see *Dead code* for what became of that class.
- Hover is a layered tint plus a 2px lift and a deeper shadow; `:focus-visible` gets an outline, because the global reset clears `outline`. Both are what tell you the tile is clickable at all now that it carries no button.
- The lift is suppressed under `prefers-reduced-motion`; the tint stays and carries the hover on its own.

### The card, top to bottom
A **`<div>`** wrapping two things: a `<Link>` (`.project-main`) over the picture, title and blurb, and a **sibling** `.project-foot` holding the tag chips and the icon links.

**That split is the whole reason for the structure.** The icon links are real `<a>`s, and an `<a>` inside an `<a>` is invalid and unreachable by keyboard — so the card cannot be one big link. Keeping the footer as a sibling is simpler than the alternative (a "stretched link" whose `::after` covers the card while the icons sit above it on `z-index`), and it needs no `:has()` support. The cost is that clicking the tag row doesn't navigate, which is the right behaviour anyway. `.project-main` takes `flex: 1` so it absorbs the card's spare height and the footer stays on the bottom edge.

There is no counter and no type label.
- **The title is left-aligned.** The reference sets its titles flush right and that was tried here, but its titles run to three words where these run to eleven, and four lines of ragged-left text is materially harder to read than one. Kian's call after seeing both. The card's **shortened titles are kept** either way — "Universal Basic Income vs. Targeted Welfare" drops its "A Macroeconomic Assessment" subtitle, and the page carries the full one — because a short label suits a grid tile regardless of alignment.
- **It is 1.15rem/700.** This and `.about-hero-name` both dropped to 600 during the Roboto experiment, because that face's 700 is much heavier at the same nominal weight; both went back to 700 with the typeface. Weight is the lever to reach for if a future face looks heavy — see *Typography*.
- **The blurb is a teaser, not the description** — two or three lines, in the reference's register: what the thing is, and the one fact worth knowing. It is written separately from the page's own text on purpose; a truncated long description reads like a truncated long description. It is **justified**, which gives it a flush rectangular edge, as in the reference.
- **The footer is `.tag` chips plus a row of icon links**, under a hairline rule. The chips were briefly a pipe-separated line in the reference's style; that read as a caption rather than as the same kind of thing Experience lists, so they came back. `.project-foot` takes `margin-top: auto`, so **all of a card's slack goes into the single gap between blurb and footer** — the same gap the reference leaves open — and every card in a row draws its rule on the same line however the title and blurb wrapped.
- **The footer's bottom row is a three-track grid**, `1fr auto 1fr`: outbound icons centred, go-arrow right, an empty cell on the left to balance it. The outer tracks must BOTH be `1fr` — with `auto 1fr auto` the icons would centre on the space the arrow *leaves*, putting them slightly left on every card and further left on the two-icon cards than the one-icon ones. Measured: every card's icon row shares its centre with the card to 0.0px, and the arrow sits flush with the content box's right edge.
- **The icon links are 34px and unlabelled.** They replaced 72px labelled tiles: these are a secondary affordance under a card whose own job is to take you to the project's page, and at the old size they competed with it. `aria-label` is therefore the link's ONLY name, and it doubles as the tooltip. Recessed chips (`--well-bg`, `--well-shadow`, `--well-hover-tint`), the same step down as the tags above them — **not** `.scroll-top`'s inversion, which was tried and fought the card carrying it.
- **`.project-go` is the mark in the bottom-right corner.** `ArrowBox.tsx` — a box with an arrow leaving it, drawn on ArrowOut's 12-unit viewBox at the same 1.4 stroke so the two read as one family. Quiet by design: `--muted`, no fill and no border, unlike the chips beside it, brightening to `--textcolor` with the card's hover. It is a signpost, not a button.
  - It links to the **same place** as `.project-main`, and carries `aria-hidden` **plus `tabIndex={-1}`**. Announcing the same destination twice is noise, and `aria-hidden` on a *focusable* element is itself a violation — the negative tabindex is what makes the pair legitimate. It stays clickable, because an arrow that looks like a control and isn't is worse than a redundant one.
- **`links` is optional, and two cards have none.** That used to misalign the footer — it is bottom-pinned, so a card with no icon row drew its rule lower than its neighbours. The go-arrow is on every card now and holds the row's height on its own (`min-height: 34px`), so the old "every card must carry at least one icon" constraint is gone.
- **Every link is an ordinary outbound `href`**, opened in a new tab. There is no internal `to` (the card already covers that) and no PDF modal, which is why `Projects.tsx` doesn't import `PdfModal`.

**`grid-auto-rows: 1fr`** gives every row one height, and the gap above the footer is what absorbs the difference. Measured at 1280: all six cards **499px**, every visual **381x214**, every rule at the same offset.

**`.project-card .tag-list` reserves TWO rows** (`min-height`, derived from `.tag`'s own metrics in App.css). The footer is bottom-pinned, so a card whose chips wrap to two rows would start them — and draw its rule — ~29px higher than a card whose chips fit on one. Measured: chips run one row on five cards and two on Santa Cruz, and all six rules sit at the same offset. **A three-row card breaks it again — keep tag counts at four.**

**That reservation needs `align-content: flex-start` AND `align-items: flex-start`, and leaving them out is a bug that shipped once.** `.tag-list` is a wrapping flex container, so with spare vertical space the default `normal` resolves to `stretch`: a single row of chips grew to fill the whole reserved box — **51px tall against a natural 23px** — and four of the six cards rendered their tags as tall slabs. `align-content` distributes the flex *lines* and `align-items` sizes the chips *within* a line; one without the other leaves the stretch in place.

### The visual
One frame for every card — a grid of six different silhouettes stops reading as one set of things, the same rule the course cards' identical watermark follows.

- `aspect-ratio: 16 / 9`, `object-fit: cover`, `object-position: center top`. **16/9 is measured, not assumed:** the six sources run 1.65 to 1.90, so 16/9 (1.778) sits in the middle — the worst crop is 6.4% horizontally and 7.1% vertically. `top` takes the loss off the bottom of the taller ones, which on a UI screenshot is the least informative part.
- The box is reserved by `aspect-ratio`, so lazy-loaded images **cannot shift the grid** as they arrive — the same failure the paper pages hit, solved the same way.
- **It bleeds to the card's top, left and right edges**, via negative margins that cancel `.sub-card`'s padding on those three sides. The top bleed came with the counter's removal: with nothing above it, the picture starts at the card's edge instead of floating under a band of empty fill. That is how the picture got bigger *without costing any more crop*: it gains 52px of width and 29px of height (**329x185 → 381x214, +16% in both**) while the frame's ratio, and therefore every number above, is untouched. Widening the ratio instead would only have made it taller by cropping the sides harder.
- **The bleed has to be restated at ≤768px.** `.sub-card`'s padding drops from `20px 26px` to `22px 24px` there, so flat `-20px`/`-26px` values overshoot — clipped by the card's `overflow: hidden`, which means it shows up as *extra crop*, not as a visible bleed. Measured after the fix: the visual's edges sit at 0.0px from the card's at 1280, 1000 and 375.

### The visuals themselves
Files live in **`public/images/projects/`**, one per project, all `.webp`:

| File | Project | Size | Ratio | What the 16/9 crop eats |
|---|---|---|---|---|
| `shipment-quoting.webp` | Revolution Parts Shipment Quoting Microservice | 900x534 | 1.685 | 5.2% off the bottom |
| `thesis-survey.webp` | Barrett Honors Thesis | 900x474 | 1.899 | 6.4% off the sides |
| `basic-income.webp` | Economics Capstone | 900x504 | 1.786 | 0.4% |
| `wage-effects.webp` | Estimating the Wage Effects of a UBI | 900x545 | 1.651 | 7.1% off the bottom |
| `rental-prices.webp` | Santa Cruz Rental Price Model | 900x506 | 1.779 | **0.0% — padded, see below** |
| `material-boxes.webp` | Material Boxes | 854x480 | 1.779 | 0.1% |

**`rental-prices.webp` is padded to exactly 16/9, and that is a fix, not a quirk.** At its native 1.931 the `cover` crop took 4.3% off each side — small as a percentage, but that screenshot carries UI text flush to *both* edges, so the card sliced the title down to "a Cruz Rent Model" on the left and cut the estimate panel mid-number on the right. It read as the picture being zoomed in. The source now has its 5px dark top strip cropped off and white padding added top and bottom (461 → 506), so nothing is cropped horizontally and the app sits ~8% smaller in the frame. The white blends into the screenshot's own white chrome at the top and reads as the window's bottom edge below the map.

**The other five are cropped and that is fine — check what a crop actually eats before "fixing" it.** Rendered at their card crop: the survey screenshot loses only white margin, the shipment UI cuts through a form that visibly continues, and the wage-effects chart loses its x-axis caption while keeping the title, the plot and the tick row. None slices a line of text in half. **A percentage alone doesn't tell you whether a crop matters** — render it and look. Tooling: `cwebp -crop x y w h` does offset crops, which `sips` can't; `sips -p H W --padColor FFFFFF` pads (centred); `dwebp` decodes a WebP so the others can read it.

- **They are re-encoded, not dropped in as supplied.** The originals were ~2000px PNG/WebP for slots that render at ~330px. `cwebp -q 85 -resize 900 0` keeps the whole set near 220KB. 900px is ~2.7x the widest rendered size, which covers retina.
- **`material-boxes.webp` is the exception: `-lossless`, at its native 854px.** It is a Minecraft screenshot — sharp pixel text and flat colour, which is what lossy WebP smears and what lossless WebP compresses well. Don't "optimise" it to match the others.
- `sips` **cannot write WebP**, and resizing PNGs with it made them *bigger*. `cwebp` / `dwebp` (homebrew) are the tools, and a WebP source has to be decoded with `dwebp` first because `cwebp` won't read one.
- `alt` describes what the picture **shows** — not a repeat of the title, which sits beside it and is already read out.

### Breakpoints
Three across, **two at ≤1100px**, one at ≤768px. 1100 rather than the site's usual 1024, because a card here has to hold a 16/9 picture *and* a title that wraps beneath it, so three stop working before the other grids do. It is the same breakpoint Skills uses, for a related reason. **`grid-auto-rows` reverts to `auto` at ≤768px** — one column means every row is its own card, and equalising would only pad the short ones.

### Still true
**Projects carry no dates.** They were removed deliberately. Don't reintroduce a `date` field without checking with Kian.

**Every card must carry a visual.** `image` is **required** on `WorkProps`, not optional — one card without art in a grid of thumbnails reads as a broken tile rather than as a quieter entry, so the type makes it impossible to add a project without one.

**The paper PDFs are withdrawn.** Kian asked that the full-text files for the thesis and the two capstones stop being downloadable. Three things had to happen, and all three matter:

1. The **card links** are gone — which left the capstone poster and the Economics capstone with no outbound link at all (see above).
2. The **page actions** are stripped in `content/papers.ts` by `withoutWithheldPdfs`, **not** by editing the papers' own modules. Those three are generated from the source PDFs and the generated output carries a `View PDF` action, so a hand edit there is dropped by the next regeneration and this isn't. The thesis keeps its ASU Library record, the capstone poster keeps its video, and the Economics capstone is left with no actions at all — `Paper.tsx` already guards an empty list.
3. The **files are deleted** from `public/pdfs/`. Removing the buttons alone would have left them served at a guessable URL, which is not what "no access" means. Only `resume.pdf` remains.

**Two consequences worth knowing.** Those PDFs are the *source* the generated content modules are built from, so a future regeneration needs local copies — they are recoverable from git history (`git log --diff-filter=D -- public/pdfs`), which also means they stay readable there if the repository is public. And `LinkIcon`'s `pdf` glyph now has no caller; it is kept with the rest of the set.

**There is no project type on the card.** "CS Capstone", "Personal Project" and so on moved to the pages, where every one of them was *already* rendered as the `eyebrow` — it was duplicated, and the card had no room for a second label. Verified before removing: all six pages carry a matching eyebrow.

**Every project needs a page.** The cards link to `/papers/:slug` and nothing else, so a project added to `works` without an entry in the `papers` registry is a dead card. There is a note to that effect on the registry itself.

Two badge types sit **inline at the end of the project title**, so on a wrapping title they follow the last word: a green `.project-release` (the shipped version, e.g. "Version 1.1.0") and then a red `.project-wip`. **Material Boxes is the only card carrying either** — it has both. They **share one rule** and differ only in fill — `#2e8b57` and `#e03e3e`, fixed colours rather than theme tokens, both at the same ~4.3:1 against white, so neither shouts over the other.

**Month abbreviations never take a trailing period** (`Aug`, not `Aug.`) — site-wide.


## Paper pages

Full-text reading pages for the written work, at **`/papers/:slug`** (`src/pages/Paper.tsx`, `src/styling/pages/Paper.css`). Modelled on OpenAI's incident-report page: title block, sticky contents list on the left, ~700px article column on the right. Three: `basic-income`, `thesis` and `cs-capstone`. The first two open on their abstract with the text behind a button — see *The abstract is the landing view* below.

- **Routing.** `App.tsx` has `/` and `/papers/:slug`. A slug with no entry renders a short "doesn't exist" block with a link home, rather than crashing. **`vercel.json` carries an SPA rewrite** (`/(.*)` → `/index.html`); without it a direct hit on `/papers/basic-income` 404s on Vercel, since only `index.html` exists on disk. Vercel checks the filesystem before rewrites, so assets still serve normally.
- **Theme.** `useTheme` (`src/components/useTheme.ts`) is shared by `Home` and `Paper`, so both follow `theme-pref` identically. Home was refactored onto it; don't duplicate that logic in a new page.
- **No navbar.** The nav's links scroll to sections that only exist on the home page. A paper page's top bar has a back button and a "Kian Javaheri" link on the left, and its own theme toggle on the right.
- **The back button is icon-only** (`ArrowBack.tsx`, stroked at 1.3 on a 14-unit viewBox to match `ArrowOut`, sized by `.arrow-back` in CSS rather than per caller — the same arrangement as `.arrow-out` and `.cal-icon`). It calls **`navigate(-1)`**, a real history POP, which is what lets scroll restoration put the reader back where they were; `navigate('/')` would be a PUSH and land at the top. **When there is no in-app history behind it** — someone deep-linked or opened the page in a new tab — it goes to `/` instead, because a back button inside the page should never throw the reader off the site. `hasAppHistory()` reads the running `idx` react-router keeps on the history entry; at 0 there is nothing of ours behind us.
- **Contents highlighting is scroll-position based**, not an `IntersectionObserver`: the active section is the last heading past the probe line. An observer watching a band near the top of the viewport left *nothing* highlighted whenever a jump landed between two headings.
- **The probe line slides down as the page runs out of scroll** — 120px normally, easing to the full viewport height at the bottom (from `remaining = scrollHeight - (scrollY + innerHeight)`). At a flat 120px, a section whose heading can never reach that line never lit up at all: on a page ending in short sections the scroll limit arrives first, so the highlight stranded three or four entries early. The capstone poster showed it worst — Value for RP, Lessons Learned and Future Work sit 273/427/581px down at max scroll and were unreachable.
- Testing this in the hidden preview pane is misleading: **programmatic `window.scrollTo` doesn't reliably fire a `scroll` event there**, so the highlight looks stuck. Dispatch `new Event('scroll')` after scrolling, or the readings are stale.
- The same pane swallows focus events entirely, and freezes transitions — see *Testing in a hidden preview pane* near the top.
- Headings carry `scroll-margin-top`, so a jump doesn't tuck them under the top edge. The contents list is **hidden below 900px**.
- **References render the same whether they came from the `references` field or from a section.** `basic-income` and `cs-capstone` use the field, which `Paper.tsx` draws as `.paper-references li`. The thesis's came out of the PDF as an ordinary section instead — it groups its citations under `h3` subheadings ("Public Perception", "Numerical Data"), which a flat `references: string[]` can't express — so its entries are `p` blocks and were rendering as body copy: 1rem, full `--textcolor`, no hanging indent. `Paper.tsx` now adds `.paper-section-references` to any section whose `id` is `references`, and `Paper.css` gives `.paper-references li` and `.paper-section-references .paper-para` one rule. Smaller and muted is right for both: a reference list is apparatus you scan for a name, not prose you read, and at body weight it shouted louder than the argument above it.
- **Body text breaks mid-token (`overflow-wrap: break-word`) on `.paper-para`, `.paper-quote`, `.paper-list li` and `.paper-references li`.** The thesis's references print bare URLs, and a URL is one unbreakable word: at 375px the longest ran 461px in a 331px column and pushed the whole document to a 480px scroll width. Nothing was visibly cut — the page just scrolled sideways, and pinch-zooming out showed the empty band it opened on the right. The rule is confined to the blocks that can carry a URL; tables keep their own `.paper-table-scroll` instead, which is the right answer for a grid and the wrong one for a paragraph.
- **The check is `documentElement.scrollWidth` against `clientWidth`, not a scan of bounding rects** — nothing's border box overflowed, and the two elements that looked like they did were a `position: fixed` button and table cells inside their scroller. Test it in a 375px-wide same-origin `<iframe>`: the preview pane's own emulation reports `innerWidth` and `clientWidth` disagreeing, which makes every number here unreadable (see *Testing in a hidden preview pane*).
- **Every figure carries `width` and `height`** (the PNG's real pixel size, stored in the content). Without them, lazy-loaded images reserve no space: jumping to a late section scrolled to where it was *then*, images below the fold loaded on the way past, the document grew, and the target ended up further down — so it took several clicks to reach References or the Appendix. With intrinsic sizes the height is stable from first paint, and one click lands. Keep the dimensions in step with the images when regenerating. (The thesis page no longer has any images at all — see *The survey section is an explorer* — but `basic-income` and `cs-capstone` still do.)

### The survey section is an explorer, not twenty-three pictures

The thesis's Discussion ends in a run of **twenty-three survey charts** printed one after another under a "Bar Graph Breakdowns" heading. Stacked as images they ran about 10,000px — half the page — and buried the analysis on either side of them.

They were first replaced with a carousel of the same PNGs, which fixed the height but not the reading: those twenty-three charts are a *subset* of ten questions across seven subgroups, picked to make the thesis's argument, so "how did the Econ No group answer question 14" usually wasn't in there at all, and when it was you clicked until you found it.

**Now the images are gone and the numbers are drawn.** `SurveyExplorer.tsx` renders one chart you steer with two pickers — a question (Q7-Q16) and a dimension to break it down by — over the full grid in `content/survey.ts`. The page measures **20,478px** (30,838px stacked, 20,614px as the carousel), and **the thesis page now contains zero images**: every figure is an SVG chart, every table is markup, and the survey is this.

`FigureCarousel.tsx` and `ImageLightbox.tsx` are **deleted** along with their CSS (`.paper-carousel-*`, `.lightbox-*`) and `buildSlides`. `useModalChrome` stays — `PdfModal` still uses it — but nothing passes `pinViewport: false` any more.

#### Why two pickers and not seventy slides
- **The dimension is the unit of choice, not the subgroup.** `surveyDimensions` offers Overall / Economics coursework / Gender / Age, and picking one puts *both* halves on the same rows. The thesis's point is always a contrast ("Econ Yes against Econ No"), so flipping between two single-subgroup views is the wrong interaction. It also caps the chart at **two series**, which is exactly how many validated categorical slots the site has — the explorer reuses the Background charts' `--chart-s1`/`--chart-s2` hexes.
- **Both pickers sit above the chart.** Changing a question or a dimension changes how tall the chart is (four options against six, one series against two), so putting the controls above everything that moves means **nothing needs a reserved height**. This is the deliberate opposite of the carousel, whose arrows sat *below* the chart and so had to pin `min-height: 132px` to the longest question. Measured here: the prompt runs 53px at the shortest and 131px at question 11 in a 678px column, and the only thing that moves is the chart the reader is already looking toward. Don't reintroduce the reserve — it's 78px of white under six of the ten questions plus a constant to keep in step with the copy.
- **Horizontal bars on a fixed 0-100% track.** The option labels are full sentences ("Balanced Trade (Imports and exports are even)"), which vertical bars can only take at an angle. The groove is the whole subgroup, never scaled to the row's own maximum, so a 2.4% answer reads as the sliver it is and the ten questions stay comparable with each other.
- **A 0.0% answer draws nothing.** A 2px stub was tried so the row wouldn't look unrendered; several questions have real zero answers and a mark where the value is zero is a lie. The number beside the empty groove carries it.
- The chips are **boxy, not pills** — 8px on a ~30px chip, the same proportion `.tag` carries at 6px on 23px. They sit *on* the `--well-bg` controls panel so they take the raised `--sub-card-grad` (the inverse of the tags, which are recessed *into* a sub-card), and hover re-declares that gradient beneath the tint. **The selected chip inverts** to a `--textcolor` fill like `.scroll-top`, because it has to be unmistakable across ten neighbours and a tint alone doesn't separate from a hover.
- The series name is repeated in a **visually-hidden span** on every value, since a screen reader reading one row at a time gets nothing from the colour.

#### The data is transcribed once and verified twice
`src/content/survey.ts` holds all ten questions x seven subgroups. It lives there and not in `thesis.ts` for the usual reason: that module is generated from the PDF.

**Nothing here was typed and trusted.** Two independent checks, both passing:
1. Every stated percentage recomputes from its own counts — **294 cells** (9 closed questions x 7 subgroups x their options).
2. **63 further cells** cross-check against **Tables 3 and 4 in `tables.ts`**, which came from a separate pass over the PDF: 42 headline shares (Q7/Q8/Q9's correct-answer rates, Q10's awareness rate, Q11's and Q15's) and 21 weighted means (Q12/Q13/Q14 across all seven subgroups, `mean = Σ count_i × (5 − i) / n`, the 5-point scale from Table 4's notes). Every mean matches exactly; 39 of the 42 shares match, with the 3 documented below.

The three expected divergences are all Table 3's **"Q10: Price Increase Awareness"** — Full Sample, Male and Female — where the thesis adds its own two rounded percentages (42.9 + 54.8 = 97.7) instead of recomputing from counts (82/84 = 97.6). That's the thesis's arithmetic and it's kept — don't "fix" either side. The re-runnable check is in the scratchpad note at the top of `survey.ts`.

- **Question 16 is read from `paperTables`, not transcribed again.** It's already in the repo as Table 5, so `openEnded()` derives its six theme percentages from `table4.png`'s rows — the same rule the Background charts follow with Tables 1 and 2, and it means the chart and the table printed further down the page cannot drift apart. It is also the only question with **no counts** and percentages that don't sum to 100%: free-text answers coded into themes, one answer able to carry several. That's what `note` says on screen.
- **`sliceLabels` keeps the thesis's own inconsistency.** Q13, Q14 and Q16 label the second age slice "Age Other" where the rest say "Age 25+". It's the same partition (both halves sum to that question's full sample), but it's printed differently, so it's rendered differently — same rule as `Satisfication` and the two "Figure 4"s.
- Gender is the one dimension that doesn't sum to the full sample on any question: two respondents didn't state one.
- The generated figure blocks after the cut heading are **dropped from the flow**, not rendered. `surveyExplorers` in `content/papers.ts` names the paper, section and heading to cut at; the heading itself stays visible above the explorer.

### Scroll restoration

`useScrollRestore` (`src/components/useScrollRestore.ts`) is called by **both** `Home` and `Paper`. Going back returns you to where you were; going forward to a new page starts at the top. react-router's own `<ScrollRestoration>` is only available to data routers and `index.tsx` mounts a plain `<BrowserRouter>`, so this does the job by hand.

- **Keyed by `location.key`, not by pathname.** react-router assigns a key per history *entry*, so visiting the same page twice gives two entries with two positions — which is what you want going back through a chain.
- Positions are held in `sessionStorage` with an in-memory `Map` as a fallback, since `sessionStorage` throws in some privacy modes. The map is capped at 50 entries.
- **Restoring happens in a `useLayoutEffect`**, before paint, so a restored position never shows as a jump from the top. It is **re-applied once `document.fonts.ready` resolves**: Plus Jakarta Sans arriving changes line counts and therefore document height, and a position set against the fallback font's metrics lands in the wrong place.

**Two ordering traps, both of which produced the same symptom — back always landing at the top — and both fixed:**

1. **The final write has to be a LAYOUT effect, not a passive one.** React runs passive (`useEffect`) cleanup *after* the browser has painted, which is after the incoming route's layout effect has already scrolled to 0. A final `write(key, window.scrollY)` in the scroll-listener's cleanup therefore saved **0 over the real position, every time**. Layout-effect cleanup for an unmounting component runs in the mutation phase, before any incoming layout effect, where the position is still the one the reader left.
2. **A position must be frozen once its page is left.** Navigating from a tall page to a short one shrinks the document, and the browser clamps the scroll — firing a genuine `scroll` event on the way down to 0. The outgoing page's listener is still attached then (see trap 1), so it faithfully recorded that 0. Measured: Home held 1379.5 while on screen and 0 the instant a one-paragraph project page mounted. **It only reproduced on the short project pages** — the thesis page is tall enough not to clamp — which made it look like a flaky restore rather than the deterministic bug it was. `frozen` blocks writes for a key after its layout cleanup has taken the last honest reading.

Verified: all six cards, via both the in-page button and the browser's own back, from two different scroll positions — restored to the exact pixel in every case, with forward navigation still starting at the top.

### The intro block, and the gate

Every reading page can open with a block of text above its contents. `paperIntros` in **`src/content/intros.ts`** keys it by slug, and `gated` decides which of two things it is:

- An **abstract** stands in for the document: the rest of the page sits behind a **Read the full paper** button, so the page opens on the summary alone. `thesis` and `basic-income`.
- An **overview** is just a lede. Nothing is hidden and no button renders. `cs-capstone`, whose intro is titled **"Summary"** — the poster's own first section is called "Project Overview", and two near-identical headings in the contents list read as a duplicate.

A page with **no entry** renders in full on arrival, the way they all did before this existed — the three stub project pages work that way. So the gate is opt-in per page, twice over: an intro is optional, and gating is optional on top of it.

- **Intros live in `src/content/intros.ts`, not in each paper's own module** — same reason as `tables.ts`, `charts.ts` and `survey.ts`. `thesis.ts`, `basic-income.ts` and `cs-capstone.ts` are generated from the PDFs, so anything hand-written into them is dropped by the next regeneration. (This is also why the capstone's summary lives here rather than being pasted into its generated module.)
- **Only the thesis's abstract is the document's own.** The Economics capstone was submitted without one, so **its abstract was written for the reading page** from the paper's own argument and findings. It is hand-maintained and will not follow a revision of the paper — flagged as such in `intros.ts`. (That is a different thing from Table 1's corrected trade balance, which is still the only place the site alters what its source printed; this one has no source to alter.) If the capstone is ever revised, this is the file to revisit.
- **The reveal is one-way.** Once a reader has asked for the paper, collapsing it back out from under them isn't a state they want, so the button has no toggle and carries **no `aria-expanded`** — a disclosure attribute that can only ever be `false` misdescribes the control. That also means there's nothing to restate on re-render; `expanded` resets on a slug change, alongside the existing scroll-to-top.
- **The heading's id is `intro`, not the section's own title**, so the contents link and the scroll probe don't have to care whether it says Abstract or Summary.
- **The contents list is gated with it**, since its links would otherwise point at sections that aren't in the DOM. While collapsed it shows the intro's entry alone and drops its "Contents" label. **The `<nav>` element itself always renders**, even empty: `.paper-layout` is a `210px minmax(0, 1fr)` grid, and removing the nav would promote the article into the 210px track and jump it sideways on expand.
- **`showFull` is a dependency of the scroll-probe effect.** Expanding puts every heading on the page at once, and without the re-run the probe keeps measuring the collapsed id list until the next scroll event — which on a click that doesn't scroll never comes. `intro` is in the same list because the id array leads with `intro` when there is one.
- The button is filled with `--textcolor` and inverted against the page, the `.scroll-top` treatment rather than the quiet underlined `.paper-link` used for the PDF and library links in the header. It is the only action on a page that is otherwise all reading. Hover is a layered `--hover-tint-inverse`, per the site's hover convention — the page-keyed tint would be invisible on this fill.
- Measured: expanding the thesis yields 9 sections, 6 tables, 4 charts, the survey explorer and **still zero `<img>` elements**; the ToC highlight tracks from the intro through References at max scroll on both gated papers. At 375px the button is 192x42 inside the 335px column and neither state opens a sideways scroll.

### Content is converted from the PDF, not retyped
`src/content/papers.ts` holds the types and the registry; each paper is its own generated module (`basic-income.ts`, `thesis.ts`, `cs-capstone.ts`). Only the capstone's conversion script survives in the repo, as `scripts/extract-cs-capstone.py`; the other two were one-off scripts.

- **Paragraph breaks come from the PDF's own first-line indents.** Body text at x≈72 is a continuation, x≈108 starts a paragraph. Line length is *not* a usable signal — a paragraph's last line can be longer than a mid-paragraph line.
- The **references section inverts it**: entries start at x≈102 with continuations hanging at x≈132.
- Extraction uses **macOS PDFKit via `osascript -l JavaScript`**. (`pdftotext` is also installed now and `pdftotext -layout` is far quicker when you only want text; Python PDF libs still aren't. PDFKit remains the path for figure geometry, which is what the original scripts needed.) Watch one trap: `characterBoundsAtIndex` indexes **skip newlines**, so subtract the number of preceding line breaks or every x is shifted.
- **Figures are cropped out of the PDF**, not screenshotted: each placed image is an object-replacement character whose bounds give the rectangle, so setting that as the page's crop box and rendering it yields the figure alone. They live beside their PDF in `public/pdfs/<slug>/` (see *Assets live beside the paper*). On `basic-income` the figures are collected into their own trailing section, which also keeps their "Figure N" labels out of the conclusion's last paragraph.
- Regenerating is a script, not hand-editing: don't patch the generated file by hand, or the next regeneration drops the change.

### Every PDF converts differently
`basic-income` (Economics capstone), `thesis` (Barrett honors thesis) and `cs-capstone` (the poster — see its own section below). Each needed its own conversion rules, which is the point worth remembering: **inspect the PDF's geometry before converting, don't assume.**

| | basic-income | thesis |
|---|---|---|
| Paragraph breaks | first-line indent (x≈108 vs 72) | **vertical gaps** (≥19pt; within a paragraph it's 13–17) |
| Headings | a known list of titles | **type size** (h≥11 section, h=10 subheading), at the left margin |
| Figures | 3, placed images | 27 placed images + **6 tables cropped as images** |

- The thesis has **two heading levels**, so blocks include `h3`. Its tables were originally **cropped as images** because they extract as scattered positioned fragments. Four of the six have since been rebuilt as real markup — see *Tables are markup, not screenshots* below.
- Thesis text runs **split mid-line on font changes**, so runs on the same baseline (y within 3pt) are merged before anything else.
- Paragraphs are **not broken at page boundaries** — a paragraph usually continues across the page. The cost is that a paragraph ending exactly at a page bottom merges with the next one.

### The capstone is a poster, not a paper
`cs-capstone` converts a single 24x36in conference poster. Its conversion script **is kept in the repo** — `scripts/extract-cs-capstone.py`, which needs `pip install pymupdf`.

- **Most of its 27 placed images are not figures.** The pink heading banners and the bullet text were re-exported as pictures by the slide tool, with the real text layer sitting underneath them. Only **4 are real figures** (architecture, sequence, caching flow, UI screenshot), cropped by image xref.
- **Text is selected by rectangle, not reading order.** The two-column split doesn't hold for the whole page: the last Results bullet sits at x>=800, beside the "Value for RP" heading, so each block names its own box. Lines on the same visual row are **bucketed by y before sorting by x** — otherwise "Customer Satisfication", which sits 1pt higher, jumps ahead of "Financial".
- **Poster bullets need the `list` block** (`items`, plus `nested` for the poster's second-level arrow markers). `.paper-list` sets `list-style` explicitly, because the global `*` reset in `App.css` clears it.
- **A figure can spill past its own image rect**: figure 3's "Front-End Application" box is a separate white drawing hanging below the image, so that crop is the **union** of the two rects. This is the same lesson as the y-flip trap below — it was only visible by opening the PNG.
- PyMuPDF rects are **top-left origin**, so unlike the PDFKit path below they're used as the clip directly, with no y flip.
- The poster has **no caption lines**, so its figures render uncaptioned.
- Its typos are the poster's own ("Satisfication", "loads into in") and are kept **verbatim**.

### Figures 1-4 are drawn, not screenshotted

The four Background figures render as inline SVG line charts (`FigureChart.tsx`, data in `src/content/charts.ts`), keyed by image src in `paperCharts` exactly as the tables are in `paperTables`. **Nothing on the thesis page is a picture any more** — the survey section became an explorer drawn from its own counts, so the page carries zero `<img>` elements.

**Chart data is derived from the tables, not transcribed a second time.** Figures 1 and 2 plot Table 1; Figures 3 and 4 plot Table 2. `column()` parses the table cells (`$115.6 billion` -> 115.6, `~3.19%` -> 3.19), so the chart and the table printed below it on the same page cannot drift apart, and the verification already done against the PDF covers both. Verify a change by inverting the rendered point geometry back to values rather than by eye.

**The one place the site knowingly departs from the thesis.** Table 1 prints the 2016 trade balance as `1.95%`, positive, while Figure 2 plots it at -1.95%. Every other year is negative in both, and a positive value would mean a trade *surplus* with China, so the published table is missing a minus sign. **Kian confirmed the table is wrong, and `tables.ts` now carries `-1.95%`.**

This is the only cell on the site that does not reproduce its source verbatim, which makes it the one exception to the rule that the thesis's own errors are kept as printed (`Satisfication`, the two "Figure 4"s, the en dash in `Age 18–24`). It is marked as such in `tables.ts` — don't "restore" it to match the PDF, and note that a token-by-token diff against the PDF will legitimately flag it.

#### Departures from the originals
The source images are Google Sheets defaults, and three of their habits are anti-patterns:
- **A value on every point.** All nine, on every series. Direct labels only work when sparing, so only the **last point** of each series is labelled; the axis and the tooltip carry the rest.
- **An in-chart title.** The figcaption underneath already names the chart, so repeating it inside is the title twice. For the same reason a single-series chart gets **no legend** — one colour, and the caption names it.
- **A white slab.** The PNGs carry their own white background, which is why `.paper-figure img` has to paint one. Inline SVG takes the page's ink and inverts with the theme instead.

#### Colour is validated, not chosen
Two categorical slots, stepped per mode: `#2a78d6`/`#eb6834` light, `#3987e5`/`#d95926` dark. Both pairs were run through the palette validator **against this site's actual surfaces — pure `#ffffff` and pure `#000000`**, not a near-white and near-black, and pass the lightness band, chroma floor, CVD separation (worst ΔE 24.7 light / 26.8 dark against a ≥8 target), the normal-vision floor and 3:1 contrast. Re-run it if either hex changes.

Text never wears the series colour — ticks, labels and the legend stay on `--muted`, and identity comes from the line key beside them.

#### Two things that bit
- **The marker's surface ring needs `circle.paper-chart-dot`, not `.paper-chart-dot`.** The `.paper-chart-s1`/`s2` rules set `stroke` to the series colour for the lines; at equal specificity and later in the file they win, so the ring painted in the series colour — invisible, precisely on the overlapping markers it exists to separate. The element-qualified selector outranks them.
- **The SVG scales with its container, so the type scales too.** At 335px the 680-unit viewBox draws at 0.49x and 15px axis chrome lands at an unreadable 7.4px. The mobile block sets 23 viewBox units (~11px rendered) and re-anchors the end label to its right edge, since at that size `$438.7B` is wider than the 66-unit right margin.
- **…and because the type does NOT scale with the box, the box needs two sizes.** `GEO.wide` / `GEO.compact` in `FigureChart.tsx`, picked by a `matchMedia('(max-width: 768px)')` hook that matches `Paper.css`'s own breakpoint, so the geometry and the font-size override always switch together. At 23 units the desktop gutters stopped holding the chrome: measured on Figure 4 at 375px, **three pairs of labels overlapped** — the bottom-left y-tick against the first x-tick (6.7px), the y-ticks against the rotated axis title (4.9px), and the x-ticks against "Year" (5.6px). Shrinking the type back is not the fix; ~11px is the floor. The gutters are what grow:

| | wide | compact | why |
|---|---|---|---|
| `left` | 56 | **90** | the rotated y-title reaches x 27, the widest tick (`325`) is 41 units, the tick sits 10 off the axis |
| `bottom` | 46 | **76** | room for the y-tick's descender, then the x-tick row, then `Year` |
| `xTickDy` | 22 | **36** | the y-tick centred on the plot's bottom edge hangs 11.5 units below it; the x-tick's cap top has to clear that |
| `right` | 66 | **28** | the end label is anchored to its right edge there and runs back over the plot, so it needs clearance, not a gutter |
| `H` | 340 | **400** | the taller box keeps the plot from shrinking to pay for the bottom gutter |
| `yTitleX` | 14 | **24** | at 14 the title's ascenders paint ~5px left of the svg's own box, out into the page gutter |

  Verified after: **zero label collisions on all four charts at 375px**, nothing painting outside its svg, and no page scroll. **Desktop is byte-identical to before** — `GEO.wide` carries the old constants. A collision audit there reports two pairs touching by ~1 unit, which is em-box leading and not ink.

  **Audit the two label kinds with different tools, or you will chase ghosts.** `getBBox()` is right for the upright labels — `getBoundingClientRect()` counts a line box's ascent and descent as part of the label and reports near-touches that aren't ink. But `getBBox()` returns the box in the element's OWN coordinate system, *before* its transform, so for the **rotated y-axis title** it is meaningless: audited that way the titles appear to overlap a y-tick by 4.6 units and to paint 46 units outside the svg, on every chart, under any font. Screen rects are the only correct measure for those. Re-audited in screen space during the Roboto experiment: **zero overlaps and nothing outside the svg on all four charts at 375px, under both faces** — the mobile geometry is not font-fragile.

The hover layer is a crosshair plus one tooltip listing every series at that x, with arrow keys doing the same from the keyboard. It enhances and never gates: **every value it shows is also in Tables 1 and 2, in the same section** — that's the table view, already on the page.

#### Touch reads by tapping, not by dragging
A finger has no hover, so the three pointer paths are handled separately in `FigureChart.tsx`, keyed off `e.pointerType` and a `heldByTouch` ref set on `pointerdown`.

- **`pointermove` is ignored for touch.** A touch drag across the chart is the reader scrolling the page past it. Tracking it there fought the scroll (a `setState` per `touchmove`) and then stranded the tooltip, because a finger fires no `pointerleave` the way a mouse does.
- **A tap selects, and a second tap on the same point dismisses.** The handler is `onClick`, not `pointerdown`: a gesture that turns into a scroll never fires `click`, so a tooltip only ever opens on a gesture that was deliberate. Tapping anywhere off the chart also dismisses — via a document `pointerdown` listener, since **iOS does not reliably blur a focused non-input element on an outside tap**, so `onBlur` alone leaves it open.
- **Selection is nearest-by-x, never a hit test on the marker.** At 0.49x a marker draws about 2px wide, which is not a thing a finger can aim at.
- **`onFocus` seeds the last point only when `heldByTouch` is false.** Tabbing in still opens a reading; a tap must not, because the tap focuses the svg *before* its own `click` lands and the seeded value showed for a frame first. It's keyed off the ref rather than `:focus-visible`, whose match depends on a browser heuristic about the last input the page saw.
- `touch-action: manipulation` on the svg drops the double-tap-zoom delay before a tap dispatches as a click. **Not `pan-y`**, which would take pinch-zoom away on exactly the element a reader most wants to zoom into.
- The mobile block bumps the markers to `r: 7` / `r: 11` active. These are SVG **geometry properties**, so the CSS overrides the `r` attribute the component sets.

#### The mobile tooltip is parked, not floated
Below 768px the tooltip pins to the plot edge away from the crosshair (`left: 0`, or `right: 0` with `.paper-chart-tooltip-flip`) instead of sitting 14px off it.

Floating it doesn't fit: the rows are `white-space: nowrap` there — `min-width: 112px` wrapped "Trade-to-GDP ratio" onto three lines and the card grew tall enough to cover the whole plot — and at ~190px it hangs off whichever side it takes when the crosshair is near the middle of a 335px column. That isn't only ugly: it puts an absolutely positioned box outside the article and **re-opens the page's sideways scroll** (measured at 375px: a 375px document going to a 390px scroll width the moment a tooltip opened).

**The crosshair's position goes in as a `--tip-x` custom property, not as an inline `left`.** That's what lets the mobile rule reposition the card at all — an inline style would have needed `!important` to out-specify. Desktop geometry is unchanged: 14px either side, flipping at index 5 of 9.

### Tables are markup, not screenshots

**All six of the thesis's tables** render as real `<table>` markup: Tables 1 and 2 (Background), Tables 3, 4 and 5 (Results) and the appendix Data Dictionary. No table on the site is a picture any more. The Economics capstone and the capstone poster have no tables.

**The PNG filenames do not match the thesis's own table numbers**, which is the first thing to check before touching these:

| File | Thesis label | Section |
|---|---|---|
| `table1.png` | **Actual Effects – Table 1** | Background |
| `table2.png` | **Actual Effects – Table 2** | Background |
| `table3.png` | **Table 3** | Results |
| `table6.png` | **Table 4** | Results |
| `table4.png` | **Table 5 – Question 16** | Results |
| `table5.png` | **Data Dictionary** | Appendix |

**The data lives in `src/content/tables.ts`, keyed by the `src` of the image it replaces**, not in `thesis.ts` — same reason as `charts.ts` and `survey.ts`: that module is generated. `renderBlock` looks each figure's src up in `paperTables` and draws the table instead when it finds one. The PNGs stay on disk and stay referenced by the generated content; only the rendering changes.

#### Half of each cropped table was already on the page as loose text
This is the thing to understand before editing any of it. Several crops cut their table off early, and **the remainder didn't vanish — it was extracted as ordinary paragraphs** and printed as running text beside the picture:

- `table2.png` stops at **2021**; the 2022, 2023 and 2024 rows ran underneath it as three lines of prose.
- `table4.png` (Table 5) stops one row short; `Age 25+ 52.4% 0.0% ...` trailed the image.
- `table6.png` (Table 4) excluded both its **title line and its entire Notes block** — the 5-point scale the four "(Mean)" columns are meaningless without — so "Table 4" printed twice and the scale key appeared as body copy.

So rebuilding a table is two jobs, and doing only the first is what produced a visible duplicate "Table 4": put the content in the grid, **and** remove the orphans. That's what **`absorbs`** is for — a list of exact paragraph texts that the table now draws itself. `Paper.tsx` collects the `absorbs` of every table in a section and filters matching `p` blocks out of the flow. Match is on the exact trimmed string, so if the generated text ever changes, the orphan silently comes back; check the section renders clean after any regeneration.

**Transcribe from `pdftotext -layout`, never from the images** — the images are exactly what's missing the rows. Verify afterwards rather than trusting the typing: every quantity token in the PDF's table region should match the rendered cells in order (195 of them across the five data tables — **with one expected exception**, Table 1's 2016 trade balance, see above), and the Data Dictionary should match word for word. Two things that look like errors but aren't: in `-layout` output a row's cells are interleaved column-wise, so a cell's words are *not* contiguous in the text — compare word multisets, not substrings, and check headers against the PNG instead. And `Gender Female` wraps across two lines, so that exact string never appears.

The thesis's own inconsistencies are kept verbatim, as everywhere else: Table 5 writes `Age 18–24` with an en dash where Tables 3 and 4 use a hyphen.

#### Styling is the site's idiom, not the document's
The source tables are a blue-banded Word grid; these have no vertical rules, no outer box, one 1.5px rule under the header and hairline `--card-border` row separators, with weight on the row labels instead of banding.

**Alignment is detected, not declared**, so a new table needs no alignment array maintained beside it:
- The test is for a **quantity**, not a bare number, because these tables write amounts as `$115.6 billion` and `~3.19%`. Matching digits only would leave those columns ragged left while `1.95%` beside them went right. The pattern still requires a leading digit after any `~`/`$`/sign, which is what keeps the Data Dictionary's `% of U.S. GDP` and `Index Level` as text.
- **Column 0 is never treated as a quantity**, even when it's all years. It renders as `<th scope="row">` and stays left; without the exception, Tables 1 and 2 aligned the "Year" header right over left-aligned body cells.

Each table sits in a focusable `.paper-table-scroll` with `overflow-x: auto`, so on a phone the table keeps its natural column widths and scrolls instead of being crushed. Measured at 375px: Table 5 is 541px in a 335px column, and every table clips at the 20px gutter.

### Assets live beside the paper
`public/pdfs/<slug>/` holds each paper's images (`figure1.png`, `table1.png`, …) — Kian's layout, adopted for all three papers. **The PDFs themselves are no longer there**: they were withdrawn (see *The paper PDFs are withdrawn* under Projects), so these folders now carry images only, and the paths in the generated modules point at images that still exist.

**Captions are text, never pixels.** In both PDFs the "Figure N" label is a separate text line, so cropping at the image's own rectangle yields the graph alone and the label is rendered as a `figcaption`. Kian's hand-made Economics exports had the label inside the image; those were replaced by 3× renders from the PDF, which are sharper and keep the caption selectable.
- **Economics**: captions are `Figure 1`–`3`.
- **Thesis**: captions are the thesis's **own caption lines** ("Figure 2. U.S. Trade-to-GDP ratio…"), matched to the image above them and removed from the body so they don't appear twice. Don't generate numbers here — the thesis's numbering restarts in the survey section (there are two "Figure 4"s), so invented numbers contradict the prose. The last 8 charts (pages 23–26) carry no caption in the thesis either.
- **Tables**: the crop starts above the title row, so the title is in the image and the block has no caption.
- `.paper-figure` renders a `figcaption` only when a caption is present.

### Cropping figures out of a PDF — the trap
Each placed image is an object-replacement character whose `characterBoundsAtIndex` gives its rectangle. Set that as the page's crop box and render.

- **Bounds are PDF space: origin bottom-left.** Do NOT flip the y. Flipping it silently produced crops of the wrong band (a sliver of chart plus white space) — the files existed at plausible sizes, so it only showed up by *looking at a PNG*. After any extraction change, open one image.
- For reading order, sort images by **descending y** (higher y = higher on the page). Ascending numbers them bottom-first on two-figure pages.
- Tables are cropped by band instead: from the title line down to the next heading or table title, full text width.

## Footer

`footer` is the counterpart to the paper pages' top bar and **takes its design**: no fill of its own, `.footer-name` at 0.9rem/600 `--textcolor` left and `.footer-meta` at 0.82rem/500 `--muted` right, `padding: 22px 36px`. Those are `.paper-back`'s and `.paper-theme-toggle`'s declarations exactly — verified equal in both themes — so a reading page is bracketed by two bars in the same register instead of opening quietly and closing on a slab.

It used to be an **inverted full-bleed slab** (0.7rem/400 on both sides). `--footer-bg` / `--footer-text` fed nothing else and **have been deleted from `App.css`**; don't reintroduce them to "restore" the bar.

**The footer renders on both pages, and each gutters differently — so the page context decides where its text sits, not the component.** Both rules live in `Footer.css`, not split across `Home.css` and `Paper.css`, so they stay in step:

- **`.paper footer`** takes `max-width: 1180px; margin: 0 auto`, the same box as `.paper-topbar`, so the name at the foot lands directly under the name at the head.
- **`.home footer`** overrides the horizontal padding to **16px at ≤768px**. The base mobile padding is `18px 20px`, which is `.paper-topbar`'s — but `.cards-wrapper` drops to a 16px gutter where the top bar drops to 20px, so on a phone the footer's text sat 4px inside the card edge above it. Desktop needs no equivalent: both are 36px there.

Measured flush to **0.0px** — footer name against the reference left edge, `©` against the right — on `/`, `/papers/thesis` and `/papers/cs-capstone` at 1280, 1024, 768 and 375px.

Note the scroll-to-top button is still `--textcolor`-filled and now floats over a page-coloured footer rather than an inverted one, which reads better, not worse: it kept its contrast either way, but it no longer briefly matches the slab behind it.

## Back-to-top button (`Scroll.tsx`)

Fixed bottom-right, 46px (42px mobile), `border-radius: 14px !important`. Filled with **`var(--textcolor)`** — inverted against the theme — with a `var(--bgcolor)` inline SVG arrow, so it stands off any content. Hover uses `--hover-tint-inverse`.

Appears past `scrollY > 400` by toggling `.scroll-top-visible`, which animates `opacity` + `translateY` + `visibility`. **Visibility must stay a class, never an inline `display`** — `display` cannot be animated, which is why this used to pop in and out. The scroll listener lives in a `useEffect` with cleanup.

## PDF modal (`PdfModal.tsx`)

Used by `About.tsx` for the resume, which is now **the only PDF the site serves** — the papers' files were withdrawn. CSS lives in `App.css`. Uses an `<iframe>`. (It was shared with `Projects.tsx` until the cards were rebuilt.)

- Exports **`withViewerParams(src)`**, which appends `#pagemode=none&navpanes=0` to request the PDF viewer's thumbnail/outline sidebar start collapsed. Support is browser-dependent; viewers that don't recognise it ignore the fragment. Applied to the iframe **and** to the mobile `window.open` calls so both paths behave the same.
- Desktop opens the modal; **≤768px opens the PDF in a new tab instead** (About checks `window.innerWidth`).
- Blurred backdrop, click-outside and Escape to close, body scroll locked, viewport meta pinned while open (iOS pinch-zoom fix).
- Close button: desktop `position: fixed` top-right 44px; mobile static in `.pdf-modal-bar`, 36px.

**Do NOT add `react-pdf` / `pdfjs-dist` rendering.** `react-pdf` was once declared but never used, and has been uninstalled; the iframe is the intended approach.

## No emoji glyphs in copy

iOS Safari renders codepoints that carry an *emoji presentation* as color emoji by default. **`↗` (U+2197) is the one that bit us** — the outbound-link arrows on "View Resume", the Projects links and the contact cards all showed up as blue emoji on iPhone.

- **`src/components/ArrowOut.tsx`** replaces every `↗`. Inline SVG, `stroke="currentColor"`, sized `1em × 1em` by the shared `.arrow-out` rule in `App.css`, so it tracks the label's font-size and color. Callers (`.resume-link`, `.project-link`) are `inline-flex` with `gap: 0.5em`; `.contact-card-arrow` just sets `font-size` + `color`, since the em sizing does the rest.
- The two remaining emoji-capable codepoints — `→` in the latency figure and `©` in the footer — are followed by **U+FE0E (VARIATION SELECTOR-15)**, which pins them to text presentation. Invisible, zero-width, no layout effect.
- `—` `–` `−` `·` `•` `─` have no emoji presentation and are safe as-is.

**Before adding any new symbol to visible copy**, check whether it is emoji-capable. If it is, draw it as inline SVG or append U+FE0E.

## Responsive breakpoints

`768px` is the main one; the rest are local to a single grid that needed to break earlier or later than the others.

| Query | Where | What |
|---|---|---|
| **≤1100px** | Skills, Projects | Skill groups go from 2×2 back to stacked; project grid 3 columns → 2 |
| **≤1024px** | Experience, Education, About, Courses | Reduced padding; `.edu-main` → `auto 170px 1fr`; courses → 3 columns; Experience's meta column → 170px. Projects left this breakpoint when it became a grid |
| **≤900px** | Paper pages only | The contents list is hidden — no room beside the text |
| **≤768px** | everywhere | Single-column layouts, hamburger nav, gallery below bio, education logo on top, contact cards stack, courses → 2 columns, project grid → 1 column, survey explorer rows stack label-over-bar, nav collapse shortens to 0.42s, PDFs open in a new tab |
| **≤520px** | Courses only | `.course-card-num` watermark drops out |
| **≤480px** | About only | Further font/padding reductions |

There are five **`prefers-reduced-motion: reduce`** blocks: `Nav.css` (drops the collapse's spring overshoot), `About.css` (swaps the gallery's full-width slide for a fade), `Projects.css` (drops the card's hover lift, keeping the tint), and two in `Paper.css` (the chart marker's `r` transition and the survey bar's `width` transition). The first three are at the end of their files so they win on source order; the `Paper.css` pair each sit directly beneath the rule they suppress, which is unambiguous because nothing later re-declares those transitions.

## Key technical decisions

- **Vite over CRA** — migrated from react-scripts (incompatible with Node 22). Build is `vite build` only.
- **Case-sensitive paths** — macOS is case-insensitive, Vercel's Linux is not. All imports use lowercase `components/`.
- **SVGs in `public/svgs/`** referenced as `<img src="/svgs/name.svg">`, never Vite imports — avoids module declaration issues and keeps assets swappable.
- **`border-radius: 0 !important`** global reset is intentional; override with `!important`.
- **No card borders** — outer cards, sub-cards and contact cards use drop shadows only. `--card-border` is for internal dividers (timeline lines, TA rows, coursework rows).
- **No toggle button** — collapsible headers have no `<button>`; the whole `.card-header` toggles.
- **Inline SVG for icons** — the back-to-top arrow, gallery chevrons and outbound-link arrow are inline SVG. Unicode arrows render as emoji on some mobile browsers; FontAwesome was removed from the bundle (it cost ~67 kB for one arrow).
- **No emoji-capable codepoints in copy** — see *No emoji glyphs in copy* above.
