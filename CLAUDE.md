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
- **react-router-dom v6** (BrowserRouter in index.tsx)
- **use-local-storage** for theme persistence
- No UI or icon libraries are used in `src/`

### Unused dependencies (declared but never imported)
`package.json` still lists `@mui/material`, `@emotion/react`, `@emotion/styled`, `react-pdf`, and four `@fortawesome/*` packages. **None are imported anywhere in `src/`** — verify with a grep before assuming otherwise. They are safe to uninstall; they only bloat `node_modules`. Do not start using them without a deliberate decision: the design has no UI-library dependency, and all icons are inline SVG or files in `public/svgs/`.

`src/components/Resume.tsx` is likewise **dead** — it is not imported by anything and points at an old Google Doc.

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
| `--well-bg` | `#e6e9f1` | `#121216` | Recessed well *inside* a sub-card |
| `--well-shadow` | — | — | Inset shadow on that well |
| `--well-hover-tint` | `rgba(0,0,0,.045)` | `rgba(255,255,255,.05)` | Hover tint for surfaces on `--well-bg` |
| `--hover-tint` | `rgba(0,0,0,.032)` | `rgba(255,255,255,.038)` | Hover tint for page-colored surfaces |
| `--hover-tint-inverse` | `rgba(255,255,255,.16)` | `rgba(0,0,0,.14)` | Hover tint for `--textcolor`-filled surfaces |
| `--card-shadow` | — | — | Outer card elevation |
| `--sub-card-shadow` | — | — | Inner card elevation |
| `--nav-glass` | `rgba(197,203,217,.50)` | `rgba(68,68,78,.50)` | Nav pill fill |
| `--nav-rim` | white `.65`/`.30` insets | white `.14`/`.06` insets | Specular rim on the glass |
| `--nav-shadow` | — | — | Floating elements (nav pill, scroll button) |
| `--footer-bg` / `--footer-text` | inverted | inverted | Footer |

`--toggle-btn-bg` / `--toggle-btn-bg-hover` exist but only feed `.card-toggle-btn`, which is **not rendered** anywhere.

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

**Dark mode takes a much smaller step down than light.** `--sub-card-grad` already ends near black at `#1a1c24`, so matching light mode's ~9-point drop lands the well on top of `--card-bg` and it reads as a hole punched through to the page rather than a recess. `#17181f` is only a few points under, and `--well-shadow` carries the rest.

### Global reset
`src/styling/App.css` applies `border-radius: 0 !important` globally — intentional. Anything that needs rounding must use `!important` (`.section-card`, `.sub-card`, `.coursework-block`, `.course-card`, `.contact-card`, `.gallery-frame`, `.nav`, `.scroll-top`, `.skill-icon-wrap`, `.project-wip`, `.pdf-close`).

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

The `>` is **required**. Education contains nested collapsibles that reuse `.section-body-wrapper`; with a descendant selector, an open outer section forces every nested body permanently open and unclosable. The nested rule is `.coursework-open > .section-body-wrapper`.

## File structure

```
src/
  components/
    About.tsx          # section-card, card-header-static; hero + bio + photo gallery; "View Resume"
    Education.tsx      # Collapsible, default OPEN. ASU sub-card + course data + nested <Coursework> blocks
    Experience.tsx     # Collapsible, default OPEN. Sandia sub-card + combined ASU sub-card w/ timeline
    Projects.tsx       # Collapsible, default CLOSED. 3-col sub-card grid; PDF modal; WIP badge
    Proficiency.tsx    # Collapsible, default CLOSED. 23 skills in 4 labelled groups of rounded icon tiles
    Contact.tsx        # NOT a section-card; label above, 3 contact-card links
    PdfModal.tsx       # Shared PDF modal (iframe); exports withViewerParams()
    Navbar.tsx         # Floating glass pill; fades past 50% scroll; hamburger ≤768px
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; inverted
    Scroll.tsx         # Back-to-top button; inverted fill, fades in past 400px
    ArrowOut.tsx       # Inline SVG ↗ for outbound links — replaces the emoji-prone U+2197
    Resume.tsx         # DEAD — not imported anywhere
  pages/
    Home.tsx           # Root; .cards-wrapper; owns theme state (system-following)
  styling/
    App.css            # Reset, tokens, card system, PDF modal, scrollbar
    Education.css      # .edu-main 3-col grid + nested coursework rows
    Experience.css     # .experience-item 2-col grid; ASU timeline
    pages/Home.css
    components/
      About.css        # Hero, gallery (4/3, border-radius 75px, slide animations)
      Contact.css      # 3-col grid of .contact-card
      Courses.css      # .courses-grid + .course-card — imported by Education.tsx
      Footer.css
      Nav.css          # Floating pill, glass, .nav-hidden fade
      Proficiency.css  # .skill-group + label; .skills-grid flex-wrap; 72px .skill-icon-wrap; .skill-monogram
      Projects.css     # 3-col grid; hover re-declares --sub-card-grad
      Scroll.css       # Inverted fill, rounded square, fade in/out
  index.tsx
public/
  images/              # Gallery: img1.jpg … (array lives in About.tsx)
  svgs/                # asu, sandia + 22 skill icons (see Skills)
  pdfs/                # resume.pdf, cs-capstone.pdf, basic-income.pdf
```

## Sections and defaults

| Section | Collapsible | Default | Notes |
|---|---|---|---|
| About | No | Always open | `card-header-static` |
| Education | Yes | **Open** | ASU sub-card + two nested coursework expandables |
| Experience | Yes | **Open** | Sandia + combined ASU timeline |
| Selected Work | Yes | Closed | 3-col grid, PDF modals, WIP badge |
| Skills | Yes | Closed | 23 icon tiles in 4 labelled groups |
| Contact | No (not a card) | Always open | Title outside, 3 link cards |

There is **no top-level Courses section** — it lives inside Education (see below). The navbar has **six** links: About, Education, Experience, Work, Skills, Contact.

## Navbar

- **Floating glass pill**: `position: fixed; top: 12px; left/right: 16px`, height 56px, `border-radius: 999px !important`, **no border**, `box-shadow: var(--nav-shadow)`.
### The glass is four things at once

`background: var(--nav-glass)` + `backdrop-filter: blur(24px) saturate(180%)` + `box-shadow: var(--nav-rim), var(--nav-shadow)`. **Tune them together — each one alone fails.**

- **Alpha must stay low** (`.50`). This is the whole effect: at `.80`+ the pill is an opaque slab and nothing reads through it.
- **The fill compensates for the alpha.** It still has to composite to ~`#e2e5ec` over the white page, or the pill dissolves against `--page-base` (`#fff`) and `--card-bg` (`#f7f7f7`). So as alpha drops, the fill gets *darker*, not lighter. Solve `a·F + (1−a)·255 = target` when changing either. Raising the alpha to fix visibility is the mistake that killed the glass the first time.
- **Blur stays at 24px.** 40px averages whatever is behind into one flat tone and you lose the light/dark structure that tells you anything is back there.
- **Saturation is 180%.** Blur alone leaves a grey slab; the boost puts the color back. (This *was* held at 105% when the fill was near-opaque, where saturation only tinted the bar. At `.50` it's what makes the material read as glass.)
- **`--nav-rim` carries the edge over photos**, where the drop shadow is invisible — a bright top inset plus a fainter full ring, standing in for a specular highlight. Dark mode's is much fainter; a bright rim on a dark pill reads as a drawn border. `--nav-shadow` stays two-part: a soft cast for float, a tight `0 1px 3px` for the edge on flat backgrounds.

Contrast holds over the photo: at `.50` over the darkest part of the gallery image the composite is ~`#808486`, ~4.9:1 against the near-black nav text.
- `.home` has `padding-top: 80px` so content clears the pill by 12px (matching the section gap).
- **Fades out past 50% of scrollable height** (`.nav-hidden`: `opacity: 0` + `pointer-events: none`, 0.35s). The scroll handler only reads `scrollY`; page height is remeasured on `resize` **and** via a `ResizeObserver` on `body`, because expanding a section changes document height without firing a resize. It never fades while the mobile menu is open.
- Mobile (≤768px): logo + Menu/Close; the menu is a rounded glass panel inset under the pill. It uses the **same material** — same fill, blur, saturation and rim. It carries no `border`; the rim replaced it, since a solid line on glass reads as drawn rather than lit. Menu text stays legible because the 24px blur destroys whatever is underneath.

## Education section

`.education-item` is a flex **column**:
1. `.edu-main` — 3-col grid `auto 210px 1fr` (logo / meta / content)
2. `.edu-coursework` — the nested coursework rows

The two degrees render as **two separate `B.S.` lines** inside `.edu-degrees` (3px apart, tighter than surrounding lines) so they read as two credentials.

### Nested coursework
Course data (`cseCourses`, `ecnCourses`) lives in `Education.tsx`. A local `<Coursework>` component renders one collapsible block per degree, **both closed by default**, toggling independently. The header shows the degree name with a muted `Coursework · N courses` subtitle beneath.

Each block is a **rounded recessed well** inset within the education sub-card — `border-radius: 14px !important`, `--well-bg`, `--well-shadow`. The course cards inside keep `--sub-card-grad`, so they read as raised against the well. See *Nesting goes DOWN, not up*.

`.coursework-header` carries **its own matching `border-radius: 14px !important`**, and the block has **no `overflow: hidden`**. Both matter:
- The hover tint is then a full pill on all four corners, open or closed, rather than a rect with a square bottom edge.
- Clipping the header to the parent's radius instead left the block's antialiased edge and inset shadow showing as a hairline outline the tint never covered. Letting the header paint its own rounded background removes that seam.

Keep the two radii in step. Nothing needs the block-level clip — `.section-body-inner` already has `overflow: hidden` for the collapse animation.

`.edu-coursework` is a plain flex column, `gap: 8px`, `margin-top: 20px` — the blocks are inset by the card's own padding, so nothing is full-bleed and `.education-item` needs no `overflow: hidden`.

**This used to be square full-bleed rows** (negative margins `20px -26px -20px` plus `border-top` dividers) — the only hard corners left on the site, and the course cards sat only 2px below the header. Don't reintroduce that.

## Skills section

23 skills in `Proficiency.tsx`, in **four labelled groups**: Languages (7), Frameworks & Libraries (5), Developer Tools (6), Data & Research (5). Each group is its own `.skill-group` — a `.skill-group-label` above a `.skills-grid` flex-wrap of `.skill-item`; each icon sits in a 72px `.skill-icon-wrap` (`border-radius: 16px !important`, sub-card gradient + shadow).

**The groups have to be render structure, not just array order.** This was previously one flat array ordered languages → frameworks → tools with blank lines between the runs. `.skills-grid` is `flex-wrap`, so rows reflowed straight across those boundaries and the ordering was invisible — all the maintenance cost, none of the benefit.

**Data & Research is deliberately not folded into Developer Tools.** Stata, QGIS, Qualtrics, MATLAB and JupyterHub are the tooling behind the econometrics and the thesis, and they are the clearest evidence in the site that the Economics degree is a second credential rather than a line item. Filing them under "Developer Tools" both mislabels them (Qualtrics is a survey platform) and buries the point. It also keeps the buckets even — 7/5/6/5 instead of 7/5/11.

`skillGroups` is **explicitly annotated** `{ label: string; skills: Skill[] }[]`. Without the annotation each group's array gets its own narrow element type and `s.invertDark` errors in the groups that have no inverted icon.

### Group labels reuse the skill-name micro-label
`.skill-group-label` is the same 0.65rem uppercase letterspaced type as `.skill-name` — **no new step in the type scale**. The hierarchy is carried by weight and color alone: labels are 600/`--textcolor`, the names under the tiles stay 500/`--muted`. Enlarging the label is what would make this section noisy.

Spacing has to keep a group break louder than a row wrap: `.skills-wrapper` gap `34px` (28 mobile) against `.skills-grid`'s `24px` row gap (20 mobile), plus the label and its `16px` (14 mobile) offset. Narrow the wrapper gap toward the grid's and the groups stop reading as groups.

- Icons are `<img src="/svgs/name.svg">` from `public/svgs/` — **not** Vite imports.
- Most are **simple-icons** glyphs with the brand hex added as a `fill` attribute on the `<svg>` tag (matching how `react.svg` was already built).
- **Skills without an SVG fall back to an `abbr` monogram.** Currently only **MATLAB** (`ML`) — simple-icons has no MATLAB glyph. To promote one: drop the file in `public/svgs/` and swap `abbr` for `src`.
- `invertDark: true` applies `filter: invert(1) brightness(0.85)` in dark mode. Used by **Flask** and **GitHub** (GitHub's brand hex `#181717` is invisible on black).
- C++ uses the lighter logo blue `#659AD2` rather than `#00599C` for dark-mode legibility.

## Selected Work (Projects)

3-column grid of cards that carry **both** `sub-card` and `project-card` classes — `.sub-card` supplies radius, fill, gradient, shadow and padding. Each card has `.project-card-meta` (tag left, date right), title, description, link. Red `.project-wip` badge on Independent Research only.

**Month abbreviations never take a trailing period** (`Aug`, not `Aug.`) — site-wide.

## Back-to-top button (`Scroll.tsx`)

Fixed bottom-right, 46px (42px mobile), `border-radius: 14px !important`. Filled with **`var(--textcolor)`** — inverted against the theme — with a `var(--bgcolor)` inline SVG arrow, so it stands off any content. Hover uses `--hover-tint-inverse`.

Appears past `scrollY > 400` by toggling `.scroll-top-visible`, which animates `opacity` + `translateY` + `visibility`. **Visibility must stay a class, never an inline `display`** — `display` cannot be animated, which is why this used to pop in and out. The scroll listener lives in a `useEffect` with cleanup.

## PDF modal (`PdfModal.tsx`)

Shared by `About.tsx` and `Projects.tsx`; CSS lives in `App.css`. Uses an `<iframe>`.

- Exports **`withViewerParams(src)`**, which appends `#pagemode=none&navpanes=0` to request the PDF viewer's thumbnail/outline sidebar start collapsed. Support is browser-dependent; viewers that don't recognise it ignore the fragment. Applied to the iframe **and** to the mobile `window.open` calls so both paths behave the same.
- Desktop opens the modal; **≤768px opens the PDF in a new tab instead** (both About and Projects check `window.innerWidth`).
- Blurred backdrop, click-outside and Escape to close, body scroll locked, viewport meta pinned while open (iOS pinch-zoom fix).
- Close button: desktop `position: fixed` top-right 44px; mobile static in `.pdf-modal-bar`, 36px.

**Do NOT add `react-pdf` / `pdfjs-dist` rendering.** `react-pdf` is in `package.json` but unused; the iframe is the intended approach.

## No emoji glyphs in copy

iOS Safari renders codepoints that carry an *emoji presentation* as color emoji by default. **`↗` (U+2197) is the one that bit us** — the outbound-link arrows on "View Resume", the Selected Work links and the contact cards all showed up as blue emoji on iPhone.

- **`src/components/ArrowOut.tsx`** replaces every `↗`. Inline SVG, `stroke="currentColor"`, sized `1em × 1em` by the shared `.arrow-out` rule in `App.css`, so it tracks the label's font-size and color. Callers (`.resume-link`, `.project-link`) are `inline-flex` with `gap: 0.5em`; `.contact-card-arrow` just sets `font-size` + `color`, since the em sizing does the rest.
- The two remaining emoji-capable codepoints — `→` in the latency figure and `©` in the footer — are followed by **U+FE0E (VARIATION SELECTOR-15)**, which pins them to text presentation. Invisible, zero-width, no layout effect.
- `—` `–` `−` `·` `•` `─` have no emoji presentation and are safe as-is.

**Before adding any new symbol to visible copy**, check whether it is emoji-capable. If it is, draw it as inline SVG or append U+FE0E.

## Responsive breakpoints

- **≤1024px** — reduced padding, `.edu-main` at `auto 170px 1fr`
- **≤768px** — single-column layouts, hamburger nav, gallery below bio, education logo on top, contact cards stack, PDFs open in a new tab
- **≤480px** — further font/padding reductions

## Key technical decisions

- **Vite over CRA** — migrated from react-scripts (incompatible with Node 22). Build is `vite build` only.
- **Case-sensitive paths** — macOS is case-insensitive, Vercel's Linux is not. All imports use lowercase `components/`.
- **SVGs in `public/svgs/`** referenced as `<img src="/svgs/name.svg">`, never Vite imports — avoids module declaration issues and keeps assets swappable.
- **`border-radius: 0 !important`** global reset is intentional; override with `!important`.
- **No card borders** — outer cards, sub-cards and contact cards use drop shadows only. `--card-border` is for internal dividers (timeline lines, TA rows, coursework rows).
- **No toggle button** — collapsible headers have no `<button>`; the whole `.card-header` toggles.
- **Inline SVG for icons** — the back-to-top arrow, gallery chevrons and outbound-link arrow are inline SVG. Unicode arrows render as emoji on some mobile browsers; FontAwesome was removed from the bundle (it cost ~67 kB for one arrow).
- **No emoji-capable codepoints in copy** — see below.
