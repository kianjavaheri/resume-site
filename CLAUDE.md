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

Card-based editorial design: rounded, borderless cards carried by drop shadows, stacked vertically with breathing room, over a flat page. Floating frosted-glass nav pill.

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
| `--nav-shadow` | — | — | Floating elements (nav pill, scroll button) |
| `--footer-bg` / `--footer-text` | inverted | inverted | Footer |

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
`src/styling/App.css` applies `border-radius: 0 !important` globally — intentional. Anything that needs rounding must use `!important` (`.section-card`, `.sub-card`, `.coursework-block`, `.course-card`, `.contact-card`, `.gallery-frame`, `.nav`, `.scroll-top`, `.skill-icon-wrap`, `.project-wip`, `.tag`, `.pdf-close`).

### Typography
**Plus Jakarta Sans** from Google Fonts. Section card titles are 0.95rem / 500. Normal casing everywhere — no `text-transform: uppercase` on nav links or section headers. Small uppercase letterspaced labels are used only for micro-labels (project tags, skill names, link buttons).

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
    Projects.tsx       # Collapsible, default OPEN. Stacked expandable row sub-cards w/ tags; PDF modal; WIP badge
    Proficiency.tsx    # Collapsible, default OPEN. 25 skills in 4 labelled groups of rounded icon tiles
    useClampedExpand.ts # Clamp-and-expand hook — Experience cards only (Selected Work no longer clamps)
    useTheme.ts        # Shared theme hook (theme-pref) — used by Home AND Paper
    useModalChrome.ts  # Escape / click-outside / scroll lock for PdfModal
    FigureChart.tsx    # Inline SVG line charts for the thesis's Background figures
    SurveyExplorer.tsx # The thesis's survey section: question + dimension pickers, drawn bars
    Tags.tsx           # Tech tag pills, shown below the clamp on Experience + Selected Work
    LinkIcon.tsx       # Inline SVGs for the Selected Work link chips (paper/pdf/library/github/curseforge)
    Contact.tsx        # NOT a section-card; label above, 3 contact-card links
    PdfModal.tsx       # Shared PDF modal (iframe); exports withViewerParams()
    Navbar.tsx         # Floating glass pill; fades past 50% scroll; hamburger ≤768px
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; inverted
    Scroll.tsx         # Back-to-top button; inverted fill, fades in past 400px
    ArrowOut.tsx       # Inline SVG ↗ for outbound links — replaces the emoji-prone U+2197
    CalendarIcon.tsx   # Inline SVG calendar for the Experience date chips; 1em via .cal-icon
    Resume.tsx         # DEAD — not imported anywhere
  pages/
    Home.tsx           # Root; .cards-wrapper; theme via useTheme
    Paper.tsx          # /papers/:slug — full-text reading page (contents list + article)
  content/
    papers.ts          # Paper/Block types + slug registry
    basic-income.ts    # GENERATED from public/pdfs/basic-income/ — regenerate, don't hand-edit
    thesis.ts          # GENERATED from public/pdfs/thesis/ — regenerate, don't hand-edit
    cs-capstone.ts     # GENERATED from public/pdfs/cs-capstone/ by scripts/extract-cs-capstone.py
    tables.ts          # Thesis tables rebuilt as markup, keyed by the PNG they replace
    charts.ts          # Background figures 1-4, derived from tables.ts (never re-typed)
    survey.ts          # All 10 survey questions x 7 subgroups; Q16 derived from tables.ts
  App.tsx              # <Routes>: "/" → Home, "/papers/:slug" → Paper
  index.tsx            # createRoot + <BrowserRouter>
  react-app-env.d.ts   # vite/client types + the *.svg module shim
  util/svgs/           # DEAD — 8 SVGs, referenced nowhere. See below.
  styling/
    App.css            # Reset, tokens, card system, expandable cards + tags, PDF modal, scrollbar
    Education.css      # .edu-main 3-col grid + nested coursework rows
    Experience.css     # .experience-item 200px/1fr grid; .exp-meta logo-left row; TA sub-rows
    pages/Home.css
    pages/Paper.css    # Reading page, survey explorer, charts, tables
    components/
      About.css        # Hero, gallery (4/3, border-radius 75px, two-way slide)
      Contact.css      # 3-col grid of .contact-card
      Courses.css      # .courses-grid + .course-card + .course-card-num — imported by Education.tsx
      Footer.css
      Nav.css          # Floating pill, glass, .nav-collapsed monogram + easings
      Proficiency.css  # .skill-group + label; .skills-grid flex-wrap; 72px .skill-icon-wrap; .skill-monogram
      Projects.css     # Row cards (grid areas meta/body/link); hover re-declares --sub-card-grad
      Scroll.css       # Inverted fill, rounded square, fade in/out
scripts/
  extract-cs-capstone.py  # Poster → src/content/cs-capstone.ts. Needs `pip install pymupdf`
public/
  images/              # img1–3.jpg used by the gallery (array in About.tsx);
                       #   img_dep*.jpg (4) are unreferenced
  svgs/                # 27 files: asu, sandia + 25 skill icons (see Skills)
  pdfs/                # resume.pdf + a folder per paper: cs-capstone/, basic-income/, thesis/
```

### Dead code and assets
Verified unreferenced — safe to delete, and worth knowing about before you go looking for something:

- **`src/components/Resume.tsx`** — not imported anywhere; points at an old Google Doc.
- **`src/util/svgs/`** — 8 SVGs (`asulogo`, `cpp`, `gcp`, `go`, `java`, `js`, `python`, `react`) from before the move to `public/svgs/`. Nothing imports them. This is the trap the *SVGs live in `public/svgs/`* rule exists to avoid: there are two svg directories and only one is live.
- **`public/images/img_dep*.jpg`** — 4 files, not in the gallery array.
- **`.card-toggle-btn`** in `App.css` (plus `--toggle-btn-bg` / `--toggle-btn-bg-hover`, which feed nothing else) — styles for a button that is never rendered; headers toggle on the whole `.card-header` row.

## Sections and defaults

| Section | Collapsible | Default | Notes |
|---|---|---|---|
| About | No | Always open | `card-header-static` |
| Education | Yes | **Open** | ASU sub-card, collapsed; expanding it reveals the two coursework expandables |
| Experience | Yes | **Open** | Three role cards, each collapsed to a 2-line preview |
| Selected Work | Yes | **Open** | Stacked rows, **always expanded** and equal height; type and links centred as a pair in the left column; PDF modals, WIP badges |
| Skills | Yes | **Open** | 23 icon tiles in 4 labelled groups |
| Contact | No (not a card) | Always open | Title outside, 3 link cards |

**Every section starts open. What's collapsed is the detail *inside* the cards.** Hiding whole sections by default made the site feel like it had little in it. The model is Brittany Chiang's portfolio: every entry is visible on arrival, and depth is on demand. Section toggles are kept for now. See *Expandable cards and tags*.

There is **no top-level Courses section** — it lives inside Education (see below). The navbar has **six** links: About, Education, Experience, Work, Skills, Contact.

## Navbar

**Floating glass pill**: `position: fixed; top: 12px; left: 16px`, `width: calc(100% - 32px)`, height 56px, `border-radius: 999px !important`, **no border**, `overflow: hidden`.

`.home` has `padding-top: 80px` so content clears the pill by 12px, matching the section gap.

Mobile (≤768px) swaps the links for a `Menu`/`Close` hamburger; the menu is a rounded glass panel inset under the pill. It uses the **same material** — same fill, blur, saturation and rim — and carries no `border`, since a solid line on glass reads as drawn rather than lit. Its text stays legible because the 24px blur destroys whatever is underneath.

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

- **`.nav` is sized with `width`, not `right`** — the collapse animates width, and `left` + `width` + `right` is over-constrained (`right` gets dropped and the pill sits off-centre). The mobile query must override `width` too, for the same reason. Rendered geometry is identical to the old `right: 16px` version: left 16, width 1244, 16px right gap at a 1280 viewport.
- **The mobile `.nav-collapsed` is restated inside the media query.** It has the same specificity as the `.nav` rule there, so on source order alone the mobile width would win and the pill would never collapse on a phone.
- `overflow: hidden` clips the full name and the links as the pill closes over them. The links keep their layout width while collapsed, so they need an explicit `pointer-events: none`.
- Both labels stay mounted. `.name-full` only goes transparent, which keeps the link's accessible name intact; `.name-mark` is `aria-hidden` and absolutely positioned at `.name`'s left edge, so the monogram lands where the "K" already was.
- The 60px width and its `22px` padding are a pair: "KJ" measures 15.3px at 0.9rem/600, so `22 + 15.3 + 22 ≈ 60` centres it. Retune both together if the mark's type changes.

#### Two easing curves, not one
`--ease-settle` and `--ease-spring` are both sampled from a damped oscillation, `1 − e^(−ct)·cos(ωt)` at `ω = 2.5π`, expressed as CSS `linear()`. They differ only in damping, and **the pair is necessary**:

- The pill's **width** travels ~1184px to reach a 60px destination. Overshoot on a transition is a percentage of the *travel*, so even a 6% overshoot drives the width below zero — the pill would visibly collapse to nothing and pop back. `--ease-settle` (`c = 14`) peaks at ~1.2%, about 14px, which reads as a settle.
- The monogram's **scale** has no such constraint, so `--ease-spring` (`c = 6`) peaks at ~12% and shows two decaying lobes. That is where the oscillation is actually legible.

Retuning one without the other is the trap: raising `--ease-settle`'s amplitude to match the spring breaks the geometry.

`linear()` needs Chrome 113+ / Safari 17.2+ / Firefox 112+. Older engines drop the declaration and fall back to the transition's default easing — the collapse still works, just without the settle.

#### Mobile
The collapse runs on mobile too, at a shorter **0.42s** (desktop is 0.55s), with the monogram's spring matched to the same duration so the two don't desync.

Duration is the only performance lever that doesn't change how the glass looks. `width` is a layout property and the pill carries a `backdrop-filter`, so every frame re-rasterises a 24px blur over a changing area — fewer frames, less work. It is not a *new* class of cost: a fixed blurred element over scrolling content already re-blurs on every scroll frame. The monogram's spring is a `transform` and stays composited either way. If a real device still janks, the next lever is dropping the mobile blur radius (24px → ~16px), which does trade away some of the glass.

**Why not `clip-path` instead of `width`,** which would avoid layout entirely: `clip-path` clips the element's drop shadow, so the pill loses `--nav-shadow` and stops floating. Moving the shadow to a parent as `filter: drop-shadow()` doesn't rescue it either — a `filter` on an ancestor creates a new backdrop root, which kills `backdrop-filter` on the child and takes the glass with it.

**Known gap:** on mobile the hamburger is clipped away while collapsed, so the menu is unreachable past the halfway mark. That was equally true when the whole bar faded out, but the pill is now visible and looks interactive. Making a tap on "KJ" expand the bar again would close it.

## Expandable cards and tags

**`useClampedExpand`** (`src/components/useClampedExpand.ts`) is used by the Experience cards. It used to drive the Selected Work rows too; those are always open now (see *Selected Work*), so the hook has one caller.

- A card starts clamped to **two lines** of its first text block, with the last line faded by a `mask-image`. A `+`/`−` sits beside the title. Clicking anywhere on the card toggles it, and each card is independent.
- **The markup is two boxes.** An outer `.clamp` takes `clampClass` + `style`, around an inner wrapper that takes `innerRef`. The inner wrapper is measured and observed: it keeps its natural height inside the clamped box, so any reflow (a resize, the web font arriving) fires the `ResizeObserver`.
- **The line height comes from the inner wrapper's first child**, so put the text you want previewed first. If that child has no explicit `line-height`, the hook falls back to `1.4 × font-size`.
- Heights go inline as `max-height`, because it can't transition to `auto`. They're **re-measured on click**, since the observer can lag a resize by a frame and a stale height clips the text.
- **No inline `max-height` until the first measurement.** `none` → length doesn't transition, so cards don't visibly animate shut on page load.
- Content that already fits in two lines gets no indicator, fade, hover tint or pointer cursor.
- **The hover tint and the pointer cursor are separate classes** in `App.css`. `.hover-card` is the tint alone; `.expandable-card` adds `cursor: pointer` on top of it. Selected Work's rows take the first because nothing on them is clickable any more, and a pointer on an inert card is a promise it can't keep. Per the hover convention, both re-declare `--sub-card-grad` beneath the tint.

**Tech tags** (`Tags.tsx`; `.tag-list` / `.tag` in `App.css`) sit **below** the clamp, so they stay visible while a card is collapsed. They're chips filled with `--well-bg` and set in `--textcolor`: recessed rather than raised, per *Nesting goes DOWN*, in the site's neutral palette. They're **boxy, not pills**: `border-radius: 6px` on a ~23px chip is the same proportion as `.project-wip`'s 4px on 15px, so the tags and the badge read as one shape at two sizes. Scale the radius with the height if either changes. They're deliberately **normal case**, not the uppercase micro-label, because names like `PostgreSQL` read wrong in caps. Tags are drawn only from what each entry's text states. Don't add a language the copy doesn't mention without checking with Kian.

### Experience
Three cards: Sandia, ASU Junior Researcher and ASU Undergraduate Teaching Assistant.

**The company name and the role are both 0.95rem / 600.** Not a style preference — Experience was the last of the three sub-card sections still setting them at body weight. `.edu-institution` (the name at the head of Education's meta column) is 1rem/600 and `.project-title` is 0.95rem/600, so `.exp-company` matches the first in role and `.exp-role` matches the second exactly. A card's hierarchy is then weight and colour, not colour alone: role and company at 600 `--textcolor`, location and dates at 400 `--muted`.

**Wording:** the **bullets follow Kian's resume** (`~/Library/CloudStorage/Dropbox/resume.pdf`), lightly adapted into sentences. The **paragraphs above them are hand-written**, so keep edits to them minimal and never smooth them into generic resume-speak.

**The paragraph is context, not a second copy of the bullets.** Both descriptions were cut roughly in half (Sandia 76 words in four sentences to 52 in two; the researcher role 50 to 34) because they restated the bullets almost claim for claim — the same tool, the same plugin, the same scraper, the same OCR — which is most of what made the section feel wordy. What survives is what the resume bullets *don't* carry: the feedstock gloss, the user-facing framing, the mentor, the supervising professor. The paragraph is also the collapsed preview's two lines, so it still has to open with what he built. No buzzwords, and no outcome claims the resume doesn't make. (To read the PDF here: `pdftotext` is installed — `pdftotext -layout` is the quickest way in. Python PDF libraries are not; macOS PDFKit via `osascript -l JavaScript` also works.) The two ASU roles used to share one card with a timeline. They were split so each role collapses on its own. Cards use the same `200px 1fr` grid as the Selected Work rows (170px at ≤1024px, stacked at ≤768px), so the two sections line up. The TA card has no summary paragraph, so its preview is the first course row. **CSE 310 is deliberately first**, ahead of the earlier FSE 150. It's the role that matters most to employers, so it's the one visible while the card is collapsed.

**The meta column is two rows: icon and name side by side, then the date chip underneath.** `.exp-meta` is a flex *column*; `.exp-meta-head` is the row inside it, holding a 60px `.exp-logo` tile (`border-radius: 15px !important`, logo inset 6px, `object-fit: contain`) beside `.exp-company`. **Radius scales with the tile at 0.25** — keep 60/15 in step. It's decorative (`alt=""`) — the company name is right next to it. `.exp-meta-head` needs `min-width: 0` or the flex item refuses to shrink below its longest word and pushes the tile out of the column.

**The inset is 10% of the tile, not a sixth.** It was 9px on 56px, which left a 38px mark in a 56px tile and read as stranded — worst on the circular ASU seal, since `object-fit: contain` on a circle wastes the tile's corners and reads smaller still than a square glyph in the same box. 6px on 60px is an app-icon proportion and puts the mark at 48px, 26% bigger. **60px is the ceiling, and the constraint is the name beside it, not the tile**: at the 1024px breakpoint the column is 170px, so the name gets `170 − 60 − 12 = 98px` against "Laboratories" at 93.4px. 64px would leave 0.6px, which one font fallback erases. Measure that word before growing it again.

**There is no location line.** It was the least useful thing in the column — the resume carries it, and nobody reads a portfolio to learn a former employer's city. Dropping it left the column with a name and a date, which is what made a chip worth the space.

**The date is an outlined pill, and every attribute of it is the inverse of `.tag` on purpose.** `.exp-date` is `background: none` + a 1px `--card-border` rim + `border-radius: 999px !important`, against the tags' filled `--well-bg`, no border and boxy 6px. It carries a **calendar glyph** (`CalendarIcon.tsx`), which is why it's `inline-flex` with a 6px gap, and `font-variant-numeric: tabular-nums` lines the three cards' dates up with each other down the column.

It first shipped as a *copy* of the tag treatment — same fill, same boxy radius, same 0.7rem/500 — and that was the mistake: the date and the tech chips looked like two instances of one component that happened to sit at opposite corners of the card, and the calendar glyph alone wasn't enough to separate them. **Three attributes now differ at once (fill, rim, shape), which is what makes the two families read as deliberate rather than as an inconsistency. Don't half-revert one of them.**

The rim uses `--card-border`, the internal-divider token. That's a mild extension of *No card borders* — that rule governs cards, which carry shadows instead, and this is a chip. The text stays at full `--textcolor`: a quiet container around confident type, not a muted caption. The `*` reset sets `border: 0` without `!important`, so a class rule wins on specificity alone; only `border-radius` needs the `!important`.

Measured: the pill is 155px, inside the 170px column at the 1024px breakpoint with 15px to spare, and 25px tall, which keeps the meta column's intrinsic height at 97px against 115–117px of content.

**`CalendarIcon.tsx` is inline SVG, not a file in `public/svgs/`** — same reason as `LinkIcon.tsx`: it sits on a chip whose text is `--textcolor` and has to take its colour from it, which an `<img>` can't. It's stroked at 1.3 on a 14-unit viewBox, matching `ArrowOut`'s weight so the two read as one icon set, and sized `1em` by `.cal-icon` in `App.css` (beside `.arrow-out`, which works the same way) so it tracks its label instead of carrying a px size per caller. **It has no day dots inside the body**: the chip renders it at 11.2px, where a grid of 1px dots is mush. The header rule alone reads as a calendar. **It sits on its own row, and that's what fixed the wrap this section used to log as a known trade.** Beside the tile it had 132px on desktop and 102px in the 769-1024px band against the 117px `May 2023 – Aug 2024` needs, so that string broke onto two lines at every tablet width. On its own row it gets the column's full 200px (170px at the breakpoint); measured at both, the chip is 132px on one line with 38px to spare.

The tile used to sit *above* the name. Moving it beside the text is what finally removed the height overhang this section used to log as a known trade: measured at 1280px, all three cards have `.exp-meta` exactly as tall as `.exp-content` (117/117, 117/117, 115/115), so every card is content-driven. Growing the tile from 48px to 56px cost nothing there — same heights, same line counts.

**The whole constraint is the name's width**, which is whatever the tile and the 12px gap leave: 128px of the 200px column, and 98px at the 1024px breakpoint. Measured against the bold 0.95rem/600 name, the longest unbreakable word is "Laboratories" at 93.4px, so there is 4.6px of headroom at the tightest size. **That number is the budget — check it before growing the tile again.** The date no longer competes for it (see above), so don't widen the meta column past 170px for either — it's paired with the Selected Work rows' left column, and the two sections line up.

**This reverses an earlier decision, deliberately.** The logo used to be half the column's width and revealed only on expand, inside a `.exp-logo-wrap` that used the same `0fr → 1fr` trick as the clamp, because at full size it set each collapsed card's height on its own — about 250px on desktop and 450px on a phone against ~150px of content. Shrinking that *bare* mark to around 56px was tried then and read as an awkward middle size — neither a logo nor an icon.

What changed is the **treatment, not the size**, and that distinction is the whole lesson: the tile is 56px today, the same size that failed as a bare mark. A mark floating loose in a text column has no role and looks stranded at any size; the same mark on a filled, rounded tile is an icon, and reads as deliberate. `.exp-expanded`, `.exp-logo-wrap` and `.exp-logo-inner` are gone with it — the first existed only to gate the second.

**The tile is `--well-bg`, not a fixed fill**, for two reasons. It's the site's step-down convention (*Nesting goes DOWN*), shared with the tags and the Selected Work link tiles. And its lightness in each theme is within a point or two of the sub-card the logos already sat on, so neither mark changes appearance — which matters here, because **the Sandia glyph carries black elements and the ASU seal carries white ones**. Any fixed fill makes one of them lose parts in one of the themes.

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
- It carries `.expandable-card`, so it gets the same pointer and hover tint as Experience and Selected Work.

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

`<Gallery>` in `About.tsx`. Three photos from the `images` array, prev/next arrows and an `n / N` counter. The frame is `aspect-ratio: 4 / 3`, `border-radius: 75px !important`, `overflow: hidden`.

### Both slides animate, not just the incoming one
The transition keeps **two** images mounted: `idx` (incoming) and `outgoing`. They animate in step — the old one exits a full frame width while the new one enters — and the frame's `overflow: hidden` clips both. `outgoing` is cleared in `onAnimationEnd` on the incoming image.

This previously animated only the incoming image, over 40px with a fade, and swapped the old one out instantly via `key={idx}`. That reads as a pop, not a slide.

Details that matter:
- **`.gallery-img` is `position: absolute; inset: 0`** so the two slides stack. The frame keeps its height from `aspect-ratio`, so nothing collapses when both images leave the flow.
- **No enter class on first paint** (`sliding` is false until the first click), or the opening photo slides in on every page load.
- **No fade under the slide.** At a full 100% travel a cross-fade only muddies the midpoint.
- **`prefers-reduced-motion: reduce`** swaps the slide for a 0.2s fade — a full-width move is exactly the motion that setting exists to suppress. The enter still animates, so `onAnimationEnd` still fires and the cleanup path is unchanged.

**Why not a `translateX(-idx * 100%)` track?** Simpler CSS, but wrapping from the last photo back to the first slides the whole strip backwards — the wrong direction. With three images you hit that wrap every third click. The two-layer approach keeps the direction correct on wrap in both directions.

Note when testing: an animation's clock does not advance while `document.visibilityState === 'hidden'`, so in a hidden preview pane the transforms jump straight to their `forwards` fill state and `animationend` never fires. Check `element.getAnimations()` rather than sampled transforms if playback looks broken.

## Selected Work (Projects)

A vertical stack (`.sub-cards-stack`) of **wide, short rows**. It replaced a 3-column grid of tall tiles. Each card carries **both** `sub-card` and `project-card` — `.sub-card` supplies radius, fill, gradient, shadow and padding.

Each row is a CSS grid. The 200px left column holds `meta` (the project type, e.g. "CS Capstone") above the `link` tiles, **centred in the card as a pair**; `body` (title, description, tags) fills the right. At ≤768px the areas restack to `meta → body → link`.

- **How:** three rows, `auto 1fr auto`, with `body` spanning all three and the flexible row in the **middle**. The left column brackets the card exactly as the right one does: the type label pins to the top of the content box beside the title, the tiles pin to the bottom beside the tags, and the slack sits between them. **The label and the tiles are independent** — they used to travel together as a centred pair, and each is now tied to the body row it belongs with.
- **`row-gap` is 0 on desktop.** With the flexible track in the middle, a row gap there is invisible — it just comes out of that track — while still costing the card real height if it ever has to squeeze. The mobile block restates `14px`, where the rows stack and the gap is the thing separating them.
- **The type label is the *promoted* micro-label: 600 on `--textcolor`**, where the quiet version of this type is 500 on `--muted`. It was the quiet one; the section leans on it enough now that it needed to carry weight. **This is not a new decision** — `.skill-group-label` is already this exact declaration (0.65rem, 0.15em, uppercase, 600, `--textcolor`) against `.skill-name`'s 500/`--muted`, and the rule it follows is stated under *Group labels reuse the skill-name micro-label*: **the hierarchy is carried by weight and colour alone.**
  - **The size stays at 0.65rem**, and that is what keeps it off `.project-title`. At 10.4px against the title's 15.2px, uppercase and letterspaced to 0.15em, it reads as a different register however dark it gets, and the two sit 40px apart in separate columns. Enlarging it is the change that would collapse that distance — the same trap the Skills section documents.
  - **`.paper-eyebrow` deliberately did *not* follow**, though it was described here as matching this label. The contexts differ: the eyebrow sits directly *above* a `clamp(1.7rem, 3.2vw, 2.5rem)` paper title in the same column, so promoting it would stack two dark elements with nothing between them, where the card sets the label *beside* its title across a gutter. If they should re-converge, change the eyebrow, not the label's size.
- **`.project-card-meta` takes an 18px `padding-top`: the label centres on the GAP between the title and the description, not on the title.** Level with the title it competed with it for the same line; a step down puts it in the card's own whitespace, where it reads as a caption on the entry rather than as a second heading. Measured, not guessed — the title's box ends 39.8px below the card's top and the description starts at 49.8px, so the gap's centre is 44.8px, and the label's 13.5px box was centred at 28.8px. **This assumes a one-line title**, which holds at 1280 and 1000px (the longest, "Universal Basic Income vs. Targeted Welfare: A Macroeconomic Assessment", still fits the body column on one line). A wrapping title would push its gap down 19.76px and strand the label high; re-measure if the copy or the column widths change.
- **The tiles' bottom edge is flush with the tags'.** Both are anchored to the same line: the grid's last row ends at the content box's bottom, and `.project-body .tag-list` takes `margin-top: auto` so the tags end there too. Measured on all five cards at 1280 and 1000px: flush to 0.0px, and the label's centre on the title/description gap's centre to 0.0px.
  - **The slack goes between the description and the tags**, which is the one gap that can vary without costing anything — it runs 10px on the tallest card to 57px on the shortest. The two things that should line up do; the two that shouldn't are left alone. Putting the slack anywhere else breaks one of them: top-aligning the body strands it under the tags, and centring the body (which is what this replaced) moves the tags' bottom edge per card so nothing can be flush with it.
  - **This is why the card keeps its normal `.sub-card` padding.** It used to be zeroed top/bottom with `padding: 20px 0` moved onto `.project-body`, so the meta pair could centre against the whole card rather than its content box. Nothing is centred any more, so that indirection is gone.
  - The rule is `.project-body .tag-list` (0-2-0) because it has to beat `.tag-list { margin-top: 2px }` in `App.css`. It's scoped to `min-width: 769px`; on a phone the areas restack and the tiles simply follow the tags.
- **Horizontally the pair is centred too**, on desktop: the type and the tiles are each centred in the 200px column, so the label sits over the tiles it belongs to instead of hanging off their left edge, and a one-tile project (Independent Research) stays aligned with the two-tile ones. Measured: every card's label and tile row share a centre at x=169. **At ≤768px both revert to `flex-start`** — the areas restack full-width there, and a centred label would float away from the left-aligned title and description below it.
- **Two things that don't work**, both tried:
  - **Centring the tiles alone** while the type keeps a quarter line. A 72px tile centred in a 152px card runs 40px–112px and overlaps the type's baseline.
  - **Wrapping the pair in one element** and centring that. The body sits *between* them in the markup, so the wrapper swallows it and cards stretch to ~350px with the type stranded at 2%.
- **The card's vertical padding moves onto `.project-body`** on desktop (`@media (min-width: 769px)`: `.sub-card.project-card` gets `padding-top/bottom: 0`, and `.project-body` gets `padding: 20px 0`). The card's own padding sits outside the grid, so without this the pair centres on the content box rather than the card. Phones keep the sub-card's normal padding.
- **Tried and rejected:** moving the tags into the left column to fill it, with a three-line preview to balance the height. It balanced, but Kian didn't like it. The tags stay under the description, as on Experience.

**Projects carry no dates.** They were removed deliberately. Don't reintroduce a `date` field without checking with Kian.

**Rows are always open — no clamp, no `+`/`−`.** They used to share Experience's two-line clamp, but the descriptions are short enough that most cleared it outright, so the section was a column of toggle icons where only some did anything, and the one card that *couldn't* expand also lost the hover tint — which read as a bug rather than as a state. Nothing is hidden now, so `WorkCard` has no state at all, and there's no `stopPropagation` on `.project-links`: the card has no click handler left for them to shield.

**Every row is the same height.** `.sub-cards-stack.work-stack` becomes `display: grid; grid-auto-rows: 1fr` above 769px, so all five rows resolve to the tallest card's content. Measured before: 176 / 224 / 200 / 200 / 200 — a 48px spread that read as almost-but-not-quite aligned. All five are 224px now.

- **It has to be written `.sub-cards-stack.work-stack`.** Both classes are 0-1-0 alone, and `App.css`'s `.sub-cards-stack { display: flex }` loads *after* `Projects.css`, so the single class silently lost and the stack stayed flex. A media query adds no specificity. Qualifying it is enough — no `!important`.
- **Desktop only.** Below 769px a card restacks to one column and a description runs eight to twelve lines: measured at 375px the rows are 493–622px, so equalising would pad the shortest with 129px of dead space.
- Equal heights are what make the flush bottom edge worth anything: see *The tiles' bottom edge is flush with the tags'* above for where each card's slack goes.

Links are **optional and plural**: each project carries a `links` array, and each entry is a `pdfSrc` (opens the PDF modal), an `href` (outbound page), or a `to` (a page on this site, rendered as a react-router `Link` — e.g. Economics Capstone's "Read Paper" → `/papers/basic-income`). A project with no links renders no link row.

**They render as `.project-icon-link` tiles**: 72px squares, icon above a short uppercase label, **side by side** in a row, centred with the type as a pair (see above). Earlier passes went through plain uppercase text links (read as a cramped list), icon-only squares (lost too much meaning) and wide icon+label chips (only one fitted per row, so they stacked down the card).

The arrow sits in the tile's **top-right corner**, absolutely positioned out of the icon/label column, at `opacity: .45`.

Three measurements hold this together:
- **Two tiles plus the 8px gap is 152px**, inside the **170px** column at ≤1024px. Widen the tile and check that sum first.
- **Labels wrap** (`white-space: normal`, centred) inside the 60px the tile leaves after its 6px padding: "ASU Library" and "CurseForge" both take two lines, the rest one. **"CurseForge" is one unbreakable word**, so its `short` carries a **zero-width space (U+200B)** between "Curse" and "Forge" — invisible, gives the line somewhere to break, and doesn't touch the accessible name (that comes from `aria-label`). Without it the label ran 66px wide in a 60px box.
- Nothing pads `.project-links` vertically any more — the centred pair keeps the tiles clear of the card's edges on its own, and rows stay **152px**.

**They are recessed chips, NOT inverted like `.scroll-top`.** `--well-bg` fill, `--textcolor` icon, `--well-shadow`, `--well-hover-tint` on hover — the same treatment as the tech tags, a step *down* from the sub-card per *Nesting goes DOWN*. The inverted version was tried first (black squares on a near-white card, white on the dark one) and read as far too much contrast against the card carrying them. The scroll button keeps its inversion because it floats over arbitrary page content; these sit inside a card.
- Each entry needs an **`icon`**: `paper` (a reading page here), `pdf`, `library`, `github`, `curseforge`. The `works` array is annotated `Array<Omit<WorkProps, 'onOpenPdf'>>` so those names are checked rather than widening to `string`.
- The icons live in **`LinkIcon.tsx` as inline SVG**, not `public/svgs/` like the skill tiles: they sit on a `--textcolor` fill and must take their colour from it, which an `<img>` can't. GitHub and CurseForge are simple-icons paths (CC0).
- **Never reintroduce `a:visited { color: inherit }`** (it used to sit in `App.css`). `a:visited` is 0-1-1 and outranks a component's own class rule at 0-1-0, so a *visited* link silently reverted to the inherited text colour — which on these buttons meant a black icon on a black fill, for the links you'd actually opened. Author styles already beat the browser's purple-visited default, so the plain `a { color: var(--textcolor) }` is enough. `.project-icon-link` also restates its colour for `:visited` as insurance.
  **It cannot be caught from JavaScript**: browsers hide `:visited` styling from `getComputedStyle`, so computed styles and canvas pixel tests both read as correct. Check it on screen, in a browser whose history actually contains the link.
- Each entry carries both a **`label`** (accessible name + tooltip: "View in ASU Library") and a **`short`** (visible text: "ASU Library"). Keep `short` a subset of `label` — a visible label that isn't part of the accessible name breaks *Label in Name* for anyone using voice control. Current set: `Read`, `PDF`, `Poster`, `ASU Library`, `GitHub`, `CurseForge`. Material Boxes carries two: **View CurseForge above View GitHub**, since CurseForge is where the mod is actually downloaded. Two badge types sit **inline at the end of the project title**, not on the type label, so on a wrapping title they follow the last word: a green `.project-release` (the shipped version, e.g. "Version 1.0.0") and then a red `.project-wip`. Material Boxes carries both; Independent Research carries only WIP. They **share one rule** and differ only in fill — `#2e8b57` and `#e03e3e`, fixed colours rather than theme tokens, both at the same ~4.3:1 against white, so neither shouts over the other.

**Month abbreviations never take a trailing period** (`Aug`, not `Aug.`) — site-wide.

## Paper pages

Full-text reading pages for the written work, at **`/papers/:slug`** (`src/pages/Paper.tsx`, `src/styling/pages/Paper.css`). Modelled on OpenAI's incident-report page: title block, sticky contents list on the left, ~700px article column on the right. Three: `basic-income`, `thesis` and `cs-capstone`.

- **Routing.** `App.tsx` has `/` and `/papers/:slug`. A slug with no entry renders a short "doesn't exist" block with a link home, rather than crashing. **`vercel.json` carries an SPA rewrite** (`/(.*)` → `/index.html`); without it a direct hit on `/papers/basic-income` 404s on Vercel, since only `index.html` exists on disk. Vercel checks the filesystem before rewrites, so assets still serve normally.
- **Theme.** `useTheme` (`src/components/useTheme.ts`) is shared by `Home` and `Paper`, so both follow `theme-pref` identically. Home was refactored onto it; don't duplicate that logic in a new page.
- **No navbar.** The nav's links scroll to sections that only exist on the home page. A paper page has a "Kian Javaheri" link back home and its own theme toggle instead.
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

  Verified after: **zero label collisions on all four charts at 375px**, nothing painting outside its svg, and no page scroll. **Desktop is byte-identical to before** — `GEO.wide` carries the old constants. A collision audit there reports two pairs touching by ~1 unit, which is em-box leading and not ink; check it with `getBBox()` rather than `getBoundingClientRect()`, which counts a line box's ascent and descent as part of the label.

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
`public/pdfs/<slug>/` holds the PDF and its images (`figure1.png`, `table1.png`, …) — Kian's layout, adopted for all three papers.

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

## Back-to-top button (`Scroll.tsx`)

Fixed bottom-right, 46px (42px mobile), `border-radius: 14px !important`. Filled with **`var(--textcolor)`** — inverted against the theme — with a `var(--bgcolor)` inline SVG arrow, so it stands off any content. Hover uses `--hover-tint-inverse`.

Appears past `scrollY > 400` by toggling `.scroll-top-visible`, which animates `opacity` + `translateY` + `visibility`. **Visibility must stay a class, never an inline `display`** — `display` cannot be animated, which is why this used to pop in and out. The scroll listener lives in a `useEffect` with cleanup.

## PDF modal (`PdfModal.tsx`)

Shared by `About.tsx` and `Projects.tsx`; CSS lives in `App.css`. Uses an `<iframe>`.

- Exports **`withViewerParams(src)`**, which appends `#pagemode=none&navpanes=0` to request the PDF viewer's thumbnail/outline sidebar start collapsed. Support is browser-dependent; viewers that don't recognise it ignore the fragment. Applied to the iframe **and** to the mobile `window.open` calls so both paths behave the same.
- Desktop opens the modal; **≤768px opens the PDF in a new tab instead** (both About and Projects check `window.innerWidth`).
- Blurred backdrop, click-outside and Escape to close, body scroll locked, viewport meta pinned while open (iOS pinch-zoom fix).
- Close button: desktop `position: fixed` top-right 44px; mobile static in `.pdf-modal-bar`, 36px.

**Do NOT add `react-pdf` / `pdfjs-dist` rendering.** `react-pdf` was once declared but never used, and has been uninstalled; the iframe is the intended approach.

## No emoji glyphs in copy

iOS Safari renders codepoints that carry an *emoji presentation* as color emoji by default. **`↗` (U+2197) is the one that bit us** — the outbound-link arrows on "View Resume", the Selected Work links and the contact cards all showed up as blue emoji on iPhone.

- **`src/components/ArrowOut.tsx`** replaces every `↗`. Inline SVG, `stroke="currentColor"`, sized `1em × 1em` by the shared `.arrow-out` rule in `App.css`, so it tracks the label's font-size and color. Callers (`.resume-link`, `.project-link`) are `inline-flex` with `gap: 0.5em`; `.contact-card-arrow` just sets `font-size` + `color`, since the em sizing does the rest.
- The two remaining emoji-capable codepoints — `→` in the latency figure and `©` in the footer — are followed by **U+FE0E (VARIATION SELECTOR-15)**, which pins them to text presentation. Invisible, zero-width, no layout effect.
- `—` `–` `−` `·` `•` `─` have no emoji presentation and are safe as-is.

**Before adding any new symbol to visible copy**, check whether it is emoji-capable. If it is, draw it as inline SVG or append U+FE0E.

## Responsive breakpoints

`768px` is the main one; the rest are local to a single grid that needed to break earlier or later than the others.

| Query | Where | What |
|---|---|---|
| **≤1100px** | Skills only | Skill groups go from 2×2 back to stacked |
| **≤1024px** | Experience, Education, About, Courses, Projects | Reduced padding; `.edu-main` → `auto 170px 1fr`; courses → 3 columns; experience and project rows' left column → 170px |
| **≤900px** | Paper pages only | The contents list is hidden — no room beside the text |
| **≤768px** | everywhere | Single-column layouts, hamburger nav, gallery below bio, education logo on top, contact cards stack, courses → 2 columns, project rows restack, survey explorer rows stack label-over-bar, nav collapse shortens to 0.42s, PDFs open in a new tab |
| **≤520px** | Courses only | `.course-card-num` watermark drops out |
| **≤480px** | About only | Further font/padding reductions |

There are four **`prefers-reduced-motion: reduce`** blocks: `Nav.css` (drops the collapse's spring overshoot), `About.css` (swaps the gallery's full-width slide for a fade), and two in `Paper.css` (the chart marker's `r` transition and the survey bar's `width` transition). The first two are at the end of their files so they win on source order; the `Paper.css` pair each sit directly beneath the rule they suppress, which is unambiguous because nothing later re-declares those transitions.

## Key technical decisions

- **Vite over CRA** — migrated from react-scripts (incompatible with Node 22). Build is `vite build` only.
- **Case-sensitive paths** — macOS is case-insensitive, Vercel's Linux is not. All imports use lowercase `components/`.
- **SVGs in `public/svgs/`** referenced as `<img src="/svgs/name.svg">`, never Vite imports — avoids module declaration issues and keeps assets swappable.
- **`border-radius: 0 !important`** global reset is intentional; override with `!important`.
- **No card borders** — outer cards, sub-cards and contact cards use drop shadows only. `--card-border` is for internal dividers (timeline lines, TA rows, coursework rows).
- **No toggle button** — collapsible headers have no `<button>`; the whole `.card-header` toggles.
- **Inline SVG for icons** — the back-to-top arrow, gallery chevrons and outbound-link arrow are inline SVG. Unicode arrows render as emoji on some mobile browsers; FontAwesome was removed from the bundle (it cost ~67 kB for one arrow).
- **No emoji-capable codepoints in copy** — see *No emoji glyphs in copy* above.
