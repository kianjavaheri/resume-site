# File structure and sections

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## File structure

```
src/
  components/
    About.tsx          # section-card, card-header-static; hero + bio + photo gallery;
                       #   "View Resume" + the contact icon row at the card's foot
    Education.tsx      # Collapsible, default OPEN. ASU sub-card + course data + nested <Coursework> blocks
    Experience.tsx     # Collapsible, default OPEN. Three expandable role cards (Sandia, ASU RA, ASU TA) w/ tags
    Projects.tsx       # Collapsible, default OPEN. Six uniform tiles, each a <Link> to
                       #   /projects/:slug. Entries live in content/projects.ts
    Proficiency.tsx    # Collapsible, default OPEN. 27 skills in 4 labelled groups of rounded icon
                       #   tiles. On mobile the tiles are BUTTONS and the names are tap-to-reveal
    Awards.tsx         # Collapsible, default OPEN. 3 honors on a horizontal rail, ASU seal
    useClampedExpand.ts # Clamp-and-expand hook — Experience cards only (Projects tiles don't clamp)
    useTheme.ts        # Shared theme hook (theme-pref) — used by Home AND Paper
    CommandPalette.tsx # ⌘K palette over content/search.ts. Mounted once, in App.tsx
    openPalette.ts     # Its event + the ⌘/Ctrl label. Split out to keep Fast Refresh
    HeadingAnchor.tsx  # The copy-link control beside every paper heading
    useReadingProgress.ts # The line across the paper top bar's bottom edge
    useScrollRestore.ts # Per-history-entry scroll save/restore — used by Home AND Paper
    useModalChrome.ts  # Escape / click-outside / scroll lock for PdfModal
    FigureChart.tsx    # Inline SVG line charts for the thesis's Background figures
    FigureCarousel.tsx # Consecutive figures shown one at a time — the capstone's design diagrams
    SurveyExplorer.tsx # The thesis's survey section: question + dimension pickers, drawn bars
    Tags.tsx           # Tech tag pills — Experience cards and Projects card footers
    LinkIcon.tsx       # Shared inline icon set — Projects links AND Contact cards
    Contact.tsx        # NOT a section-card; label above, 3 contact-card links w/ icons
    PdfModal.tsx       # Shared PDF modal (iframe); exports withViewerParams()
    Navbar.tsx         # Floating glass bar, card-aligned; docks flat to the top once
                       #   the About card scrolls past; Projects dropdown; hamburger ≤768px
    Footer.tsx         # "Kian Javaheri" left, "© 2026" right; quiet, matches the paper top bar
    Scroll.tsx         # Back-to-top button; inverted fill, fades in past 400px
    ArrowOut.tsx       # Inline SVG ↗ for outbound links — replaces the emoji-prone U+2197
    ArrowBack.tsx      # Inline SVG ← for the paper pages' back button; 1em via .arrow-back
    AnchorIcon.tsx     # Inline SVG chain-link for HeadingAnchor; 1em via .anchor-icon
    CheckIcon.tsx      # Its copied state — swaps into the same box, so nothing shifts
    SearchIcon.tsx     # Inline SVG magnifier for the two palette triggers
    CalendarIcon.tsx   # Inline SVG calendar for the Experience date chips; 1em via .cal-icon
    PulseRing.tsx      # The distorted pulsing ring behind the About card; ambient, no pointer
    DotGrid.tsx        # The canvas dot field it replaced. RETAINED, not rendered — see components.md
    Resume.tsx         # DEAD — not imported anywhere
  pages/
    Home.tsx           # Root; .cards-wrapper; theme via useTheme
    Paper.tsx          # /projects/:slug — abstract + "Read the full paper" gate, contents list, article
    NotFound.tsx       # The catch-all route AND the unknown-slug case. Paper chrome
  content/
    papers.ts          # Paper/Block types, slug registry, and the paperEdits layer
    paper-view.ts      # What a reading page ACTUALLY renders, as data. Read by
                       #   Paper.tsx AND search.ts — see Paper pages
    search.ts          # The command palette's index, BUILT from the other modules
    courses.ts         # The 16 courses — read by Education.tsx AND search.ts
    skills.ts          # The 27 skills in 4 groups — read by Proficiency.tsx AND search.ts
    projects.ts        # The Projects grid's entries + types — read by Projects.tsx AND Navbar
    contact-links.ts   # LinkedIn / GitHub / Email + isMailto() — read by Contact AND About
    basic-income.ts    # GENERATED from public/pdfs/basic-income/ — regenerate, don't hand-edit
    thesis.ts          # GENERATED from public/pdfs/thesis/ — regenerate, don't hand-edit
    cs-capstone.ts     # GENERATED from public/pdfs/cs-capstone/ by scripts/extract-cs-capstone.py
    tables.ts          # Thesis tables rebuilt as markup, keyed by the PNG they replace
    charts.ts          # Background figures 1-4, derived from tables.ts (never re-typed)
    survey.ts          # All 10 survey questions x 7 subgroups; Q16 derived from tables.ts
    intros.ts          # Intro block by slug (abstract or overview), the gate flag and the
                       #   capstone's lead figure. Hand-written
    project-pages.ts   # Reading pages for the 3 projects with no source document. Hand-written.
                       #   All three have now grown past their stubs
  App.tsx              # <Routes>: "/" → Home, "/projects/:slug" → Paper,
                       #   "/papers/:slug" → legacy redirect, "*" → NotFound;
                       #   mounts <CommandPalette /> outside the routes
  index.tsx            # createRoot + <BrowserRouter>
  react-app-env.d.ts   # vite/client types + the *.svg module shim
  util/svgs/           # DEAD — 8 SVGs, referenced nowhere. See below.
  styling/
    App.css            # Reset, tokens, card system, expandable cards + tags, PDF modal, scrollbar
    Education.css      # .edu-main 3-col grid + nested coursework rows
    Experience.css     # .experience-item 200px/1fr grid; .exp-meta logo-left row; TA sub-rows
    pages/Home.css   # .home + the --page-max / --page-gutter tokens the cap reads
    pages/Paper.css    # Reading page, abstract gate, survey explorer, charts, tables
    components/
      About.css        # Hero, contact row, gallery (1/1, border-radius 24px, two-way slide)
      Contact.css      # 3-col grid of .contact-card; icon + label left, arrow right
      PulseRing.css    # The ring canvas's inset/stacking and the `color` it reads its ink from
      DotGrid.css      # The same for the dot grid, plus the content-lift rules that serve BOTH
      Courses.css      # .courses-grid + .course-card + .course-card-num — imported by Education.tsx
      Footer.css       # Quiet in-flow bar + the two page-context gutter rules
      Nav.css          # Floating pill, glass, .nav-docked, the Projects dropdown + its caret
      Palette.css      # The ⌘K panel: nav material, inverted selected row
      Awards.css       # .award-card — .exp-logo copy + .award-track dot rail
      Proficiency.css  # .skill-group + label; .skills-grid flex-wrap; 64px .skill-icon-wrap; .skill-monogram
      Projects.css     # 3-across grid; .project-main link + sibling footer of chips and icons
      Scroll.css       # Inverted fill, rounded square, fade in/out
scripts/
  extract-cs-capstone.py  # Poster → src/content/cs-capstone.ts. Needs `pip install pymupdf`
  prerender-meta.mjs      # RUNS ON EVERY BUILD. Per-route meta + sitemap.xml,
                          #   reading the registries through Vite's ssrLoadModule
  make-og-images.sh       # Regenerates public/og/. Manual — the outputs are
                          #   committed and content-hashed
public/
  images/              # img1–4.jpg used by the gallery, IN THAT ORDER (array in About.tsx);
                       #   img_dep*.jpg (4) are unreferenced
    projects/          # One .webp thumbnail per project — see Projects
    material-boxes/    # 8 content-hashed .webp for that project's reading page
    wage-effects/      # 7 content-hashed .webp — cover + 6 figures padded to one ratio
  og/                  # 7 content-hashed 1200x630 JPEGs — the link-preview cards
  svgs/                # 31 files: asu, sandia + 27 skill icons, plus two with no caller —
                       #   apachespark.svg (PySpark's) and matplotlib.svg (commented out),
                       #   PySpark left behind when it came off the list (see Skills)
  pdfs/                # resume.pdf + a folder per paper: cs-capstone/, basic-income/, thesis/
  robots.txt           # Allows everything, and points at /sitemap.xml
README.md              # Short, for GitHub. CLAUDE.md is the long version
vercel.json            # The /papers/:slug redirect, then the SPA rewrite
```

### Dead code and assets
Verified unreferenced — safe to delete, and worth knowing about before you go looking for something:

- **`src/components/Resume.tsx`** — not imported anywhere; points at an old Google Doc.
- **`src/util/svgs/`** — 8 SVGs (`asulogo`, `cpp`, `gcp`, `go`, `java`, `js`, `python`, `react`) from before the move to `public/svgs/`. Nothing imports them. This is the trap the *SVGs live in `public/svgs/`* rule exists to avoid: there are two svg directories and only one is live.
- **`public/images/img_dep.jpg`, `img_dep1.jpg`, `img_dep3.jpg`** — 3 files, not in the gallery array. There was a fourth: `img_dep2.jpg` was promoted into the gallery and is now **`img4.jpg`** (see *About gallery*).
- **`.card-toggle-btn`** in `App.css` (plus `--toggle-btn-bg` / `--toggle-btn-bg-hover`, which feed nothing else) — styles for a button that is never rendered; headers toggle on the whole `.card-header` row.
- **`.hover-card`** in `App.css` — the hover tint without the pointer cursor. The Projects tiles took it while they were inert; they are links now and carry their own hover. The rule is annotated in place, because the distinction it encodes (never promise a click you can't honour) is worth keeping even while unused.

## Sections and defaults

| Section | Collapsible | Default | Notes |
|---|---|---|---|
| About | No | Always open | `card-header-static`. **Not hoverable** — see below |
| Education | Yes | **Open** | ASU sub-card, collapsed; expanding it reveals the two coursework expandables |
| Experience | Yes | **Open** | Three role cards, each collapsed to a 2-line preview |
| Projects | Yes | **Open** | A 3-across grid of uniform tiles (2 at ≤1100px, 1 at ≤768px). Each tile is a link to `/projects/:slug`: edge-to-edge visual, flush-right title, short blurb, rule, tag chips and small icon links. No counter, no type label |
| Skills | Yes | **Open** | 25 icon tiles in 4 labelled groups |
| Awards | Yes | **Open** | One sub-card: ASU seal + a horizontal timeline of 3 honors. **Not in the nav** |
| Contact | No (not a card) | Always open | Title outside, 3 link cards |

**About is the one section card with no hover tint.** `.section-card:hover` is written `.section-card:not(.about-section):hover`, because every other section has a header that toggles it and the tint reads as "this responds" — About is `card-header-static`, so clicking the card itself does nothing and a tint is a promise it can't keep. (It does contain controls — the resume button, the gallery arrows, the contact row — but those carry their own hover; it is the *card* that isn't clickable.) Same rule that keeps `.hover-card` and `.expandable-card` separate.

**Every section starts open. What's collapsed is the detail *inside* the cards.** Hiding whole sections by default made the site feel like it had little in it. The model is Brittany Chiang's portfolio: every entry is visible on arrival, and depth is on demand. Section toggles are kept for now. See *Expandable cards and tags*.

There is **no top-level Courses section** — it lives inside Education (see below). The navbar has **six** links: About, Education, Experience, Projects, Skills, Contact. **Awards is a seventh section with no nav link** — Kian's call, for now; adding one is a line in `Navbar.tsx` and a line in the mobile menu. Projects also carries a hover dropdown — see *The Projects dropdown*.
