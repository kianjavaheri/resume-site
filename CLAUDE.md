# Kian Javaheri — Resume Site

Personal portfolio/resume website for Kian Javaheri, a May 2026 CS & Economics graduate from Barrett, The Honors College at ASU (Summa Cum Laude, 3.93 GPA). He is based in the Bay Area, CA and looking for full-time Software Engineering and Data Engineering roles.

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
- No UI libraries (MUI removed, FontAwesome removed)

## Design system

The aesthetic is a **card-based editorial design** inspired by Google's Antigravity site — each section is a rounded rectangle card stacked vertically with breathing room between them. The overall palette is minimal (white/black), with subtle gray card fills and drop shadows (no visible borders on cards).

### CSS custom properties (in `src/styling/App.css`)
- `--bgcolor` / `--textcolor` / `--border` / `--muted` / `--footer-bg` / `--footer-text`
- `--card-bg`: fill for outer section cards (`#f1f1f1` light / `#141414` dark)
- `--card-bg-hover`: hover state for outer cards (`#ebebeb` light / `#181818` dark)
- `--card-border`: used for timeline lines and TA row dividers only — NOT for card borders (`rgba(0,0,0,0.1)` light / `rgba(255,255,255,0.1)` dark)
- `--card-shadow`: drop shadow for outer section cards
- `--sub-card-fill`: fill for inner item cards (`#ffffff` light / `#252525` dark)
- `--sub-card-shadow`: drop shadow for inner sub-cards and course cards
- `--toggle-btn-bg`: (kept in CSS but button no longer rendered) circle fill on hover (`rgba(0,0,0,0.09)` light / `rgba(255,255,255,0.12)` dark)
- Light theme: white bg, black text, `#666` muted
- Dark theme: `#0a0a0a` bg, white text, `#999` muted
- Theme toggled via `data-theme` attribute on the `.home` div, persisted in localStorage

### Global reset
`src/styling/App.css` applies `border-radius: 0 !important` globally — this is intentional. Any element that needs rounding must use `!important` to override it (e.g., `.section-card`, `.sub-card`, `.gallery-frame`, `.contact-card`).

### Typography
**Plus Jakarta Sans** loaded from Google Fonts. Card titles are 0.95rem, 500 weight, normal casing, no letter-spacing. All nav links and section headers use normal casing (no `text-transform: uppercase`).

### Card layout system (in `src/styling/App.css`)

All sections live inside `.cards-wrapper` in `Home.tsx`, which is a vertical flex column with `gap: 10px` and `padding: 56px 36px 44px`.

- **`.section-card`**: Outer card — `border-radius: 20px !important`, no border, `box-shadow: var(--card-shadow)`, `background: var(--card-bg)`. Hover transitions to `var(--card-bg-hover)`.
- **`.card-title`**: Section label in the top-left of each card (0.95rem, 500 weight, normal casing).
- **`.card-header`**: `<div>` flex row for the section header — contains only `.card-title` (no toggle button). `padding: 18px 28px`. Always `cursor: pointer` — clicking anywhere toggles open/close.
- **`.card-header-static`**: `<div>` for non-collapsible section headers (About). `padding: 18px 28px 0`.
- **`.section-body-wrapper` / `.section-body-inner`**: CSS `grid-template-rows: 0fr → 1fr` animation for smooth expand/collapse (0.35s ease). Always in DOM.
- **`.sub-cards-stack`**: Container for inner item cards. `padding: 10px 22px 22px`, `gap: 8px`.
- **`.sub-card`**: Inner item card — `border-radius: 14px !important`, no border, `box-shadow: var(--sub-card-shadow)`, `background: var(--sub-card-fill)`, `padding: 20px 26px`.
- **`.section-open`**: Class added to the section element when expanded. Triggers `grid-template-rows: 1fr` on `.section-body-wrapper`.

### Collapsible section interaction pattern
- **Clicking `.card-header` always toggles** open/close — no separate +/− button.
- The `onClick` on `.card-header` calls `setOpen(!open)` (toggles unconditionally).
- No visible indicator for open/closed state — only the cursor changes to pointer.
- `.card-toggle-btn` CSS class still exists in App.css but is **not rendered** in any component.

## File structure

```
src/
  components/
    About.tsx          # section-card with card-header-static; hero name + bio + photo gallery; "View Resume" opens PdfModal
    Education.tsx      # Collapsible section-card, default OPEN; edu-item as sub-card with ASU logo
    Experience.tsx     # Collapsible section-card, default OPEN; Sandia sub-card + combined ASU sub-card with LinkedIn-style timeline
    Projects.tsx       # Collapsible section-card, default CLOSED; 3-column sub-card grid; each card has tag, date, title, desc, link; WIP badge on Independent Research
    Proficiency.tsx    # Collapsible section-card, default CLOSED; skill icons grid (9 skills) each with dark rounded-square background
    Courses.tsx        # Collapsible section-card, default CLOSED; CSE and ECN course tag grids
    Contact.tsx        # NOT a section-card; "Contact" label above, each link (LinkedIn/GitHub/YouTube) is its own contact-card (no border)
    PdfModal.tsx       # Shared PDF modal component (iframe-based); used by About.tsx and Projects.tsx
    Navbar.tsx         # Fixed top nav; hamburger menu on mobile (≤768px)
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; black/white inverted footer
    Scroll.tsx         # Scroll-to-top button
  pages/
    Home.tsx           # Root page; wraps all sections in .cards-wrapper; manages theme state
  styling/
    App.css            # Global reset, CSS vars, card system (.section-card, .sub-card, etc.), PDF modal, scrollbar
    Education.css      # .education-item: 3-column grid (logo / meta / content); mobile stacks logo on top centered
    Experience.css     # .experience-item: 2-column grid (20% / 60%); timeline CSS for combined ASU card; logos left-aligned at 50% of meta column width
    pages/Home.css
    components/
      About.css        # Hero, photo gallery (aspect-ratio 4/3, border-radius 75px !important, slide animations)
      Contact.css      # .contact-section: title above, .contact-cards 3-col grid of .contact-card links (no border)
      Courses.css      # .courses-grid: 5-col grid of compact tag-like .course-card (no aspect-ratio, small padding)
      Footer.css
      Nav.css          # Fixed nav, normal-casing links, pill hover effect, hamburger mobile overlay
      Proficiency.css  # .skills-grid: flex-wrap of .skill-item; each icon inside .skill-icon-wrap (72px dark rounded square, background #1e1e1e)
      Projects.css     # .projects-grid: 3-col sub-card grid; .project-card-meta row (tag left, date right); .project-wip red badge
      Scroll.css
  index.tsx            # React 18 createRoot entry point
  react-app-env.d.ts   # Vite client types + SVG module declaration
public/
  images/              # Photo gallery images: img1.jpg, img2.jpg (add more and update About.tsx array)
  svgs/                # All SVG assets served statically (NOT imported via Vite):
                       #   asu.svg         → Education section logo
                       #   sandia.svg      → Experience section (Sandia card)
                       #   python.svg, java.svg, js.svg, react.svg  → Skills
                       #   stata.svg, sql.svg, postgresql.svg, flask.svg, pandas.svg → Skills
  pdfs/                # PDF files served statically:
                       #   resume.pdf       → "View Resume" button in About
                       #   cs-capstone.pdf  → "View Poster" button in Selected Work
                       #   basic-income.pdf → "Read Paper" button in Selected Work (Economics Capstone)
  favicon.ico
```

## Sections and defaults

| Section      | Collapsible | Default  | Notes |
|-------------|-------------|----------|-------|
| About       | No          | Always open | `card-header-static`; no toggle |
| Education   | Yes         | **Open** | ASU Barrett sub-card with ASU logo |
| Experience  | Yes         | **Open** | Sandia sub-card + combined ASU sub-card with timeline |
| Selected Work | Yes       | Closed   | 3-col sub-card grid; PDF modal for CS Capstone + Economics Capstone; dates top-right of each card; red WIP badge on Independent Research |
| Skills      | Yes         | Closed   | 9 skill icons each in a dark rounded-square bg |
| Courses     | Yes         | Closed   | CSE (11 courses) + ECN (5 courses) as compact tag-like card grids |
| Contact     | No (not a card) | Always open | Title outside card; LinkedIn/GitHub/YouTube each a contact-card (no border) |

## Selected Work (Projects) section

Each card in the 3-column grid has:
- **`.project-card-meta`**: flex row — tag (left) and date (right)
- **`.project-wip`**: red badge (`#e03e3e`) inline after the tag text — only on Independent Research
- Dates: CS Capstone Aug. 2025–May 2026 · Barrett Honors Thesis Aug. 2025–May 2026 · Economics Capstone Aug.–Dec. 2025 · Independent Research Jun. 2026–Current

## Experience section

- **Layout**: `grid-template-columns: 20% 60%` — left meta column 20%, right content 60%, remaining 20% is natural whitespace
- **Sandia sub-card**: left meta column (company name, location, date, `sandia.svg` logo) + right content column (role, bullet points)
- **ASU sub-card**: same meta column (ASU logo) + right side uses `.exp-timeline` — a LinkedIn-style vertical timeline with two `.exp-timeline-item`s (Research Assistant on top, Teaching Assistant below, with TA sub-rows per course)
- **Logos**: `width: 50%` of the meta column, left-aligned (`margin: 16px 0 0`), height auto
- **Company name and role**: `font-weight: 400` (not bold)
- Logos reference `public/svgs/` via `<img src="/svgs/name.svg">` — not Vite imports
- Bullet points use `•` (not `—`), styled via `.exp-bullets li::before`

## Skills section

- 9 skills in a flex-wrap grid: Python, Java, JavaScript, React, Stata, SQL, PostgreSQL, Flask, Pandas
- All icons are `<img src="/svgs/name.svg">` from `public/svgs/` — no Vite SVG imports
- Each icon wrapped in `.skill-icon-wrap`: 72×72px, `border-radius: 16px !important`, `background: #1e1e1e` (same in light and dark mode)
- Flask icon has `invertDark: true` → gets `filter: invert(1) brightness(0.85)` in dark mode via `.skill-icon-invert`
- Icon images are 38px square inside the wrapper

## Courses section

- Two labeled groups: **Computer Science** (11 courses) and **Economics** (5 courses)
- Each course is a compact `.course-card`: `border-radius: 8px !important`, `padding: 7px 11px`, no aspect-ratio
- Grid: `repeat(5, 1fr)` on desktop → 4 cols on tablet → 2 cols on mobile
- Course code (e.g. `CSE 310`) in `--textcolor` at 0.68rem, course name in `--muted` at 0.65rem

## PDF modal (`src/components/PdfModal.tsx`)

Shared component imported by `About.tsx` and `Projects.tsx`. CSS lives in `src/styling/App.css`. Uses `<iframe>` for PDF rendering. Features:
- Blurred backdrop (`backdrop-filter: blur(10px)`)
- Centered modal up to 860px wide, 88vh tall
- `×` close button top-right, outside the modal box
- Click backdrop to close, Escape key to close
- Body scroll locked while open (`document.body.style.overflow = 'hidden'`)
- On mobile (≤768px): slides up from bottom as a sheet (92vh)

## Photo gallery (About section)

- Images live in `public/images/` — update the `images` array in `About.tsx` to add/remove photos
- Currently: `img1.jpg`, `img2.jpg`
- Aspect ratio: `4/3`, `object-fit: cover`, `object-position: center top`
- `border-radius: 75px !important` (needs `!important` to override the global `border-radius: 0` reset)
- Slide animation: tracks direction (`'left'` | `'right'`), applies `@keyframes gallery-slide-right/left` via `key={idx}` remount trick
- Arrow buttons use `type="button"` + `e.preventDefault()` + `e.stopPropagation()` to prevent page scroll

## Education section layout

The education item uses a 3-column grid: `auto 180px 1fr` (logo | meta | content).
- **Logo**: `public/svgs/asu.svg` displayed at `max-height: 80px`
- **Mobile (≤768px)**: single column, logo centered on top at `max-height: 150px`
- **Tablet (≤1024px)**: `auto 140px 1fr`, logo `max-height: 70px`

## Contact section

Unlike other sections, Contact is NOT wrapped in `.section-card`. Instead:
- `card-title` label floats above the link cards
- `.contact-cards` is a 3-column grid of `.contact-card` elements
- Each `.contact-card` is a rounded rectangle (`border-radius: 14px !important`), **no border**, styled like a sub-card, with the platform name left and `↗` arrow right, vertically centered
- Mobile: stacks to 1 column

## Navbar

- Fixed top, height ~56px, `padding: 0 32px`, `z-index: 100`
- Bottom border uses `var(--card-border)` (subtle rgba) — intentionally thin/light
- Desktop: "Kian Javaheri" left (0.9rem, 600 weight) + nav links right (0.82rem, pill hover at `border-radius: 20px !important`)
- All text is normal casing (no uppercase transforms)
- Mobile: Logo left + "MENU"/"CLOSE" button right; clicking opens a full-screen overlay with all links separated by 1px borders
- Theme toggle label shows "Dark" when in light mode, "Light" when in dark mode

## Responsive breakpoints

- **≤1024px (tablet)**: Reduced padding, narrower education grid column, 4-col course grid
- **≤768px (mobile)**: Single-column layouts, hamburger nav, gallery stacks below bio, education logo on top, contact cards stack vertically, 2-col course grid
- **≤480px**: Further font/padding reductions

## Key technical decisions

- **Vite over CRA**: Migrated from react-scripts (incompatible with Node 22) to Vite 8. Build script is just `vite build` — no separate `tsc` step since esbuild handles TS transpilation.
- **Case-sensitive paths**: macOS is case-insensitive but Vercel's Linux is not. All imports use lowercase `components/` (not `Components/`). Fixed via two-step `git mv` to force git to track the rename.
- **SVG assets in `public/svgs/`**: All icons/logos are referenced as `<img src="/svgs/name.svg">` — NOT imported via Vite. This avoids module declaration issues and keeps assets easy to swap.
- **`border-radius: 0 !important`** in global reset: intentional design choice. Use `!important` on any element that legitimately needs rounding (`.section-card`, `.sub-card`, `.gallery-frame`, `.contact-card`, etc.).
- **`use-local-storage`** for theme: persists `'light'` or `'dark'` across sessions. Default is `'light'`.
- **PdfModal** is a standalone component (`src/components/PdfModal.tsx`) — do NOT add `react-pdf` or `pdfjs-dist`; those packages are not installed. The modal uses a simple `<iframe>` which works fine for the PDFs served from `public/pdfs/`.
- **No card borders**: Section cards, sub-cards, and contact cards use drop shadows only (no `border`). `--card-border` is only used for internal dividers (timeline lines, TA row separators).
- **No toggle button**: Collapsible sections have no +/− button. The entire `.card-header` is clickable and always toggles open/close via `onClick={() => setOpen(!open)}`.
- **Old section-header system removed**: The previous `.section-header`, `.section-label`, `.section-toggle-icon`, `.section-inner`, `.section-body` classes no longer exist. The card system (`.card-header`, `.card-title`, etc.) fully replaces them.
