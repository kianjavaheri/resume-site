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

The aesthetic is inspired by **Acne Studios** — editorial, minimal, white background, black text, nothing rounded (except the photo gallery which intentionally uses `border-radius: 75px !important` to override the global reset).

### CSS custom properties (in `src/styling/App.css`)
- `--bgcolor` / `--textcolor` / `--border` / `--muted` / `--footer-bg` / `--footer-text`
- Light theme: white bg, black text/borders, `#666` muted
- Dark theme: `#0a0a0a` bg, white text/borders, `#999` muted
- Theme toggled via `data-theme` attribute on the `.home` div, persisted in localStorage

### Global reset
`src/styling/App.css` applies `border-radius: 0 !important` globally — this is intentional. Any element that needs rounding must use `!important` to override it (e.g., `.gallery-frame`).

### Typography
**Space Grotesk** loaded from Google Fonts. Section labels are 0.7rem, 500 weight, uppercase, letter-spacing 0.15em.

### Layout patterns
- **`.section-inner`**: 2-column grid (`160px 1fr`) used only in the About section's sidebar label. Collapses to 1 column at 768px.
- **`.section-header`**: Full-width collapsible row with label left + `+`/`−` icon right. Has `border-top` always. Gets `border-bottom` when the parent has `.section-open` class.
- **`.section-body-wrapper` / `.section-body-inner`**: CSS `grid-template-rows: 0fr → 1fr` animation for smooth expand/collapse (0.35s ease).
- **`.section-body`**: Padded content container inside the animation wrapper.

## File structure

```
src/
  components/
    About.tsx          # Hero name + static "About" header + bio + photo gallery + PDF modal for resume
    Education.tsx      # Collapsible, default OPEN — ASU Barrett, CS & Econ, 3.93 GPA
    Experience.tsx     # Collapsible, default OPEN — Sandia, ASU Research, ASU TA
    Projects.tsx       # Collapsible, default CLOSED — 3 works; CS Capstone + Economics Capstone open PDF modals; Barrett Thesis opens external link
    Proficiency.tsx    # Collapsible, default CLOSED — skill icons grid
    Courses.tsx        # Collapsible, default CLOSED — CSE and ECN course lists
    Contact.tsx        # Always open (static header) — LinkedIn, GitHub, YouTube
    Navbar.tsx         # Fixed top nav; hamburger menu on mobile (≤768px)
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; black/white inverted footer
    Scroll.tsx         # Scroll-to-top button
  pages/
    Home.tsx           # Root page; assembles all components; manages theme state
  styling/
    App.css            # Global reset, CSS vars, .section-header/.section-body, PDF modal, scrollbar
    Education.css
    Experience.css
    pages/Home.css
    components/
      About.css        # Hero, photo gallery (aspect-ratio 4/3, border-radius 75px !important, slide animations)
      Contact.css
      Courses.css
      Footer.css
      Nav.css          # Fixed nav, hamburger, mobile full-screen overlay menu
      Proficiency.css
      Projects.css
      Scroll.css
  util/svgs/           # SVG icons for skills (Python, Java, JS, React, Go, C++, GCP)
  index.tsx            # React 18 createRoot entry point
  react-app-env.d.ts   # Vite client types + SVG module declaration
public/
  images/              # Photo gallery images: img1.jpg, img2.jpg (add more and update About.tsx array)
  pdfs/                # PDF files served statically:
                       #   resume.pdf       → "View Resume" button in About
                       #   cs-capstone.pdf  → "View Poster" button in Selected Work
                       #   basic-income.pdf → "Read Paper" button in Selected Work (Economics Capstone)
  favicon.ico
```

## Sections and defaults

| Section      | Collapsible | Default  | Notes |
|-------------|-------------|----------|-------|
| About       | No          | Always open | Static `.section-header-static` header; no toggle |
| Education   | Yes         | **Open** | ASU Barrett entry |
| Experience  | Yes         | **Open** | Sandia, ASU Research, ASU TA |
| Selected Work | Yes       | Closed   | PDF modal for CS Capstone + Economics Capstone |
| Skills      | Yes         | Closed   | Icon grid |
| Courses     | Yes         | Closed   | CSE (11 courses) + ECN (5 courses) |
| Contact     | No          | Always open | Static header; LinkedIn, GitHub, YouTube |

## PDF modal

Shared component used in both `About.tsx` and `Projects.tsx`. CSS lives in `src/styling/App.css` (global so both can use it). Features:
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

## Responsive breakpoints

- **≤1024px (tablet)**: Narrower grid columns, reduced padding
- **≤768px (mobile)**: Single-column layouts, hamburger nav, gallery stacks below bio
- **≤480px**: Further font/padding reductions

## Navbar

- Fixed top, height ~52px, `z-index: 100`
- Desktop: "KIAN JAVAHERI" left + nav links right (About, Education, Experience, Work, Skills, Courses, Contact, Dark/Light toggle)
- Mobile: Logo left + "MENU"/"CLOSE" button right; clicking opens a full-screen overlay with all links separated by 1px borders
- Theme toggle label shows "Dark" when in light mode, "Light" when in dark mode

## Key technical decisions

- **Vite over CRA**: Migrated from react-scripts (incompatible with Node 22) to Vite 8. Build script is just `vite build` — no separate `tsc` step since esbuild handles TS transpilation.
- **Case-sensitive paths**: macOS is case-insensitive but Vercel's Linux is not. All imports use lowercase `components/` (not `Components/`). Fixed via two-step `git mv` to force git to track the rename.
- **SVG imports**: Declared as `string` modules in `react-app-env.d.ts` (`declare module '*.svg'`).
- **`border-radius: 0 !important`** in global reset: intentional design choice. Use `!important` on any element that legitimately needs rounding.
- **`use-local-storage`** for theme: persists `'light'` or `'dark'` across sessions. Default is `'light'`.
