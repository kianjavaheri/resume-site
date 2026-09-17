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
    Proficiency.tsx    # Collapsible, default OPEN. 23 skills in 4 labelled groups of rounded icon tiles
    useClampedExpand.ts # Shared clamp-and-expand hook for Experience cards + Selected Work rows
    useTheme.ts        # Shared theme hook (theme-pref) — used by Home AND Paper
    Tags.tsx           # Tech tag pills, shown below the clamp on Experience + Selected Work
    LinkIcon.tsx       # Inline SVGs for the Selected Work link chips (paper/pdf/library/github/curseforge)
    Contact.tsx        # NOT a section-card; label above, 3 contact-card links
    PdfModal.tsx       # Shared PDF modal (iframe); exports withViewerParams()
    Navbar.tsx         # Floating glass pill; fades past 50% scroll; hamburger ≤768px
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; inverted
    Scroll.tsx         # Back-to-top button; inverted fill, fades in past 400px
    ArrowOut.tsx       # Inline SVG ↗ for outbound links — replaces the emoji-prone U+2197
    Resume.tsx         # DEAD — not imported anywhere
  pages/
    Home.tsx           # Root; .cards-wrapper; theme via useTheme
    Paper.tsx          # /papers/:slug — full-text reading page (contents list + article)
  content/
    papers.ts          # Paper/Block types + slug registry
    basic-income.ts    # GENERATED from public/pdfs/basic-income/ — regenerate, don't hand-edit
    thesis.ts          # GENERATED from public/pdfs/thesis/ — regenerate, don't hand-edit
    cs-capstone.ts     # GENERATED from public/pdfs/cs-capstone/ by scripts/extract-cs-capstone.py
  App.tsx              # <Routes> with the single "/" route → Home
  index.tsx            # createRoot + <BrowserRouter>
  react-app-env.d.ts   # vite/client types + the *.svg module shim
  util/svgs/           # DEAD — 8 SVGs, referenced nowhere. See below.
  styling/
    App.css            # Reset, tokens, card system, expandable cards + tags, PDF modal, scrollbar
    Education.css      # .edu-main 3-col grid + nested coursework rows
    Experience.css     # .experience-item 200px/1fr grid; TA sub-rows
    pages/Home.css
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
  svgs/                # 24 files: asu, sandia + 22 skill icons (see Skills)
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
| Selected Work | Yes | **Open** | Stacked rows collapsed to a 2-line preview, type and link on the card's 1/4 and 3/4 lines, PDF modals, WIP badges |
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

Experience cards and Selected Work rows share one hook, **`useClampedExpand`** (`src/components/useClampedExpand.ts`).

- A card starts clamped to **two lines** of its first text block, with the last line faded by a `mask-image`. A `+`/`−` sits beside the title. Clicking anywhere on the card toggles it, and each card is independent.
- **The markup is two boxes.** An outer `.clamp` takes `clampClass` + `style`, around an inner wrapper that takes `innerRef`. The inner wrapper is measured and observed: it keeps its natural height inside the clamped box, so any reflow (a resize, the web font arriving) fires the `ResizeObserver`.
- **The line height comes from the inner wrapper's first child**, so put the text you want previewed first. If that child has no explicit `line-height`, the hook falls back to `1.4 × font-size`.
- Heights go inline as `max-height`, because it can't transition to `auto`. They're **re-measured on click**, since the observer can lag a resize by a frame and a stale height clips the text.
- **No inline `max-height` until the first measurement.** `none` → length doesn't transition, so cards don't visibly animate shut on page load.
- Content that already fits in two lines gets no indicator, fade, hover tint or pointer cursor.
- `.expandable-card` (`App.css`) carries the pointer and the hover tint. Per the hover convention, the tint re-declares `--sub-card-grad` beneath it.

**Tech tags** (`Tags.tsx`; `.tag-list` / `.tag` in `App.css`) sit **below** the clamp, so they stay visible while a card is collapsed. They're chips filled with `--well-bg` and set in `--textcolor`: recessed rather than raised, per *Nesting goes DOWN*, in the site's neutral palette. They're **boxy, not pills**: `border-radius: 6px` on a ~23px chip is the same proportion as `.project-wip`'s 4px on 15px, so the tags and the badge read as one shape at two sizes. Scale the radius with the height if either changes. They're deliberately **normal case**, not the uppercase micro-label, because names like `PostgreSQL` read wrong in caps. Tags are drawn only from what each entry's text states. Don't add a language the copy doesn't mention without checking with Kian.

### Experience
Three cards: Sandia, ASU Junior Researcher and ASU Undergraduate Teaching Assistant.

**Wording:** the **bullets follow Kian's resume** (`~/Library/CloudStorage/Dropbox/resume.pdf`), lightly adapted into sentences. The **paragraphs above them are hand-written**, so keep edits to them minimal and never smooth them into generic resume-speak. No buzzwords, and no outcome claims the resume doesn't make. (To read the PDF here: `pdftotext` and Python PDF libraries aren't installed, but macOS PDFKit via `osascript -l JavaScript` works.) The two ASU roles used to share one card with a timeline. They were split so each role collapses on its own. Cards use the same `200px 1fr` grid as the Selected Work rows (170px at ≤1024px, stacked at ≤768px), so the two sections line up. The TA card has no summary paragraph, so its preview is the first course row. **CSE 310 is deliberately first**, ahead of the earlier FSE 150. It's the role that matters most to employers, so it's the one visible while the card is collapsed.

**Logos appear only when a card is expanded.** At full size (50% of the column) the logo alone set each collapsed card's height: about 250px on desktop and 450px on a phone, against about 150px of content. Shrinking it to 56px was tried and read as an awkward middle size. So the logo sits in `.exp-logo-wrap`, which uses the same `0fr → 1fr` row trick and 0.35s timing as the clamp, gated on `.exp-expanded`. It's decorative (`alt=""`), because the company name sits right above it. A card that could never expand would never show its logo; none currently can't.

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

23 skills in `Proficiency.tsx`, in **four labelled groups**: Languages (7), Frameworks & Libraries (5), Developer Tools (6), Data & Research (5). Each group is its own `.skill-group` — a `.skill-group-label` above a `.skills-grid` flex-wrap of `.skill-item`; each icon sits in a 72px `.skill-icon-wrap` (`border-radius: 16px !important`, sub-card gradient + shadow).

**The groups have to be render structure, not just array order.** This was previously one flat array ordered languages → frameworks → tools with blank lines between the runs. `.skills-grid` is `flex-wrap`, so rows reflowed straight across those boundaries and the ordering was invisible — all the maintenance cost, none of the benefit.

**Data & Research is deliberately not folded into Developer Tools.** Stata, QGIS, Qualtrics, MATLAB and JupyterHub are the tooling behind the econometrics and the thesis, and they are the clearest evidence in the site that the Economics degree is a second credential rather than a line item. Filing them under "Developer Tools" both mislabels them (Qualtrics is a survey platform) and buries the point. It also keeps the buckets even — 7/5/6/5 instead of 7/5/11.

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
- **Skills without an SVG fall back to an `abbr` monogram.** Currently only **MATLAB** (`ML`) — simple-icons has no MATLAB glyph. To promote one: drop the file in `public/svgs/` and swap `abbr` for `src`.
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

- **How:** four rows, `1fr auto auto 1fr`, with `body` spanning all four. The two equal flexible rows pin the pair to the middle; `row-gap: 14px` is also the gap between the type and the tiles. Measured: pair centred at 50%, type at 22%, tiles at 59%, rows a uniform 152px.
- **Horizontally the pair is centred too**, on desktop: the type and the tiles are each centred in the 200px column, so the label sits over the tiles it belongs to instead of hanging off their left edge, and a one-tile project (Independent Research) stays aligned with the two-tile ones. Measured: every card's label and tile row share a centre at x=169. **At ≤768px both revert to `flex-start`** — the areas restack full-width there, and a centred label would float away from the left-aligned title and description below it.
- **Two things that don't work**, both tried:
  - **Centring the tiles alone** while the type keeps a quarter line. A 72px tile centred in a 152px card runs 40px–112px and overlaps the type's baseline.
  - **Wrapping the pair in one element** and centring that. The body sits *between* them in the markup, so the wrapper swallows it and cards stretch to ~350px with the type stranded at 2%.
- **The card's vertical padding moves onto `.project-body`** on desktop (`@media (min-width: 769px)`: `.sub-card.project-card` gets `padding-top/bottom: 0`, and `.project-body` gets `padding: 20px 0`). The card's own padding sits outside the grid, so without this the pair centres on the content box rather than the card. Phones keep the sub-card's normal padding.
- **Tried and rejected:** moving the tags into the left column to fill it, with a three-line preview to balance the height. It balanced, but Kian didn't like it. The tags stay under the description, as on Experience.

**Projects carry no dates.** They were removed deliberately. Don't reintroduce a `date` field without checking with Kian.

Rows start collapsed to a two-line preview and expand in place, with tags below. See *Expandable cards and tags*. `.project-links` stops click propagation, so opening a PDF or GitHub link doesn't also toggle the row.

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
- Headings carry `scroll-margin-top`, so a jump doesn't tuck them under the top edge. The contents list is **hidden below 900px**.
- **Every figure carries `width` and `height`** (the PNG's real pixel size, stored in the content). Without them, lazy-loaded images reserve no space: jumping to a late section scrolled to where it was *then*, images below the fold loaded on the way past, the document grew, and the target ended up further down — so it took several clicks to reach References or the Appendix. With intrinsic sizes the height is stable from first paint (the thesis page measured 30,838px before and after scrolling through), and one click lands. Keep the dimensions in step with the images when regenerating.

### Content is converted from the PDF, not retyped
`src/content/papers.ts` holds the types and the registry; each paper is its own generated module (`basic-income.ts`, `thesis.ts`, `cs-capstone.ts`). Only the capstone's conversion script survives in the repo, as `scripts/extract-cs-capstone.py`; the other two were one-off scripts.

- **Paragraph breaks come from the PDF's own first-line indents.** Body text at x≈72 is a continuation, x≈108 starts a paragraph. Line length is *not* a usable signal — a paragraph's last line can be longer than a mid-paragraph line.
- The **references section inverts it**: entries start at x≈102 with continuations hanging at x≈132.
- Extraction uses **macOS PDFKit via `osascript -l JavaScript`** (`pdftotext` and Python PDF libs aren't installed here). Watch one trap: `characterBoundsAtIndex` indexes **skip newlines**, so subtract the number of preceding line breaks or every x is shifted.
- **Figures are cropped out of the PDF**, not screenshotted: each placed image is an object-replacement character whose bounds give the rectangle, so setting that as the page's crop box and rendering it yields the figure alone. They live beside their PDF in `public/pdfs/<slug>/` (see *Assets live beside the paper*). On `basic-income` the figures are collected into their own trailing section, which also keeps their "Figure N" labels out of the conclusion's last paragraph.
- Regenerating is a script, not hand-editing: don't patch the generated file by hand, or the next regeneration drops the change.

### Every PDF converts differently
`basic-income` (Economics capstone), `thesis` (Barrett honors thesis) and `cs-capstone` (the poster — see its own section below). Each needed its own conversion rules, which is the point worth remembering: **inspect the PDF's geometry before converting, don't assume.**

| | basic-income | thesis |
|---|---|---|
| Paragraph breaks | first-line indent (x≈108 vs 72) | **vertical gaps** (≥19pt; within a paragraph it's 13–17) |
| Headings | a known list of titles | **type size** (h≥11 section, h=10 subheading), at the left margin |
| Figures | 3, placed images | 27 placed images + **6 tables cropped as images** |

- The thesis has **two heading levels**, so blocks include `h3`. Its tables extract as scattered positioned fragments (headers split across lines), so they're **cropped as images** rather than rebuilt as HTML — faithful now, convertible later. They are therefore not selectable text.
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
| **≤768px** | everywhere | Single-column layouts, hamburger nav, gallery below bio, education logo on top, contact cards stack, courses → 2 columns, project rows restack, nav collapse shortens to 0.42s, PDFs open in a new tab |
| **≤520px** | Courses only | `.course-card-num` watermark drops out |
| **≤480px** | About only | Further font/padding reductions |

There are also two **`prefers-reduced-motion: reduce`** blocks — `Nav.css` (drops the collapse's spring overshoot) and `About.css` (swaps the gallery's full-width slide for a fade). Both are at the end of their files so they win on source order.

## Key technical decisions

- **Vite over CRA** — migrated from react-scripts (incompatible with Node 22). Build is `vite build` only.
- **Case-sensitive paths** — macOS is case-insensitive, Vercel's Linux is not. All imports use lowercase `components/`.
- **SVGs in `public/svgs/`** referenced as `<img src="/svgs/name.svg">`, never Vite imports — avoids module declaration issues and keeps assets swappable.
- **`border-radius: 0 !important`** global reset is intentional; override with `!important`.
- **No card borders** — outer cards, sub-cards and contact cards use drop shadows only. `--card-border` is for internal dividers (timeline lines, TA rows, coursework rows).
- **No toggle button** — collapsible headers have no `<button>`; the whole `.card-header` toggles.
- **Inline SVG for icons** — the back-to-top arrow, gallery chevrons and outbound-link arrow are inline SVG. Unicode arrows render as emoji on some mobile browsers; FontAwesome was removed from the bundle (it cost ~67 kB for one arrow).
- **No emoji-capable codepoints in copy** — see *No emoji glyphs in copy* above.
