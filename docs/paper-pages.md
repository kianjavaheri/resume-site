# Paper pages

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## Paper pages

Full-text reading pages for the written work, at **`/projects/:slug`** (`src/pages/Paper.tsx`, `src/styling/pages/Paper.css`). Modelled on OpenAI's incident-report page: title block, sticky contents list on the left, a 780px article column on the right. **Six** — one per project: `basic-income`, `thesis` and `cs-capstone` are converted from source PDFs, and `wage-effects`, `rental-prices` and `material-boxes` are hand-written in `project-pages.ts`. The first two open on their abstract with the text behind a button — see *The abstract is the landing view* below.

- **The page's box is `--paper-max` (1320px) and `--paper-gutter` (36px, 20px at ≤768px)**, declared on `.paper` and read by both `.paper-topbar` and `.paper-inner` so the bar and the article beneath it cannot drift apart. It was a flat 1180 in both rules. The layout inside uses about 1050 (210 contents + 60 gap + 780 article), so the old box left the whole page floating mid-screen with the back control stranded 80px in from the edge; at 1280 the content now starts at x 36 rather than 86, and the back button at 30 rather than 80.
- **The title block spans the page.** `.paper-title` carried `max-width: 20ch`, which on the thesis — a 100-character title — held the head to a ~640px column and broke it over FOUR lines while 600px of the page sat empty beside it. Kian's call to remove it. **20ch is the right cap for a paragraph and the wrong one for a display heading**: the measure argument is about tracking back to the start of the *next* line, and two lines of 40px type is not a reading task. The head is still bounded by `.paper-inner`'s `--paper-max`, so this is not unbounded — it just uses what the page already gives it. Measured on the thesis: 4 lines → **2** at 1280, 1500 and 1900, with the title now exactly as wide as the rule under it. The mobile `max-width: none` override went with it, since there is nothing left to override.
- **`.paper-article` is 780px, up from 700.** At 1rem/1.85 that is about 95 characters — the top of a comfortable measure, and roughly where a line starts getting hard to track back from. Past this, widen the gutter instead.
- **The top bar is `position: sticky`**, so the back control stays reachable however far down the reader is. It needs an opaque fill or the article scrolls through it, and the fill is `--page-base` — this is chrome, not a surface, the same call the home page's nav makes when it docks. **Two things have to clear its 76px** (68 on mobile): `.paper-toc`'s sticky `top` (92) and the headings' `scroll-margin-top` (104, 92 on mobile). Measured: a contents jump lands its heading 28px below the bar.
- **Routing.** `App.tsx` has `/`, `/projects/:slug`, a legacy `/papers/:slug` and a catch-all `*`.

  **The reading pages used to live at `/papers/:slug` and moved to `/projects/:slug`.** "Papers" was never quite right — half of the six are software, not writing — and the section, the nav dropdown and the card grid all say Projects. The INTERNAL vocabulary did not move with the URL: `Paper.tsx`, `papers.ts`, `paper-view.ts`, `paperTables`, `paperIntros` and every `.paper-*` class still say paper. That is deliberate — renaming them is several hundred mechanical edits across the CSS and this file for no reader-visible gain, and the risk is all downside. Read "paper" as "a reading page" throughout.

  **Old links keep working, and it is done TWICE on purpose.** `vercel.json` carries a `permanent: true` (308) redirect from `/papers/:slug`, which is the one that matters in production: Vercel runs redirects *before* rewrites, so a crawler and the address bar both end up on the new URL instead of the app silently swapping it underneath. The `LegacyPaperRedirect` route in `App.tsx` is what makes the same link work under `npm start`, where there is no vercel.json at all. It uses `replace`, so the dead URL doesn't sit in history and bounce the back button through the redirect. A slug with no entry and an address that matches nothing render the **same** `NotFound` page — paper chrome, the theme, a footer, and links to all six projects, because the reader was looking for something. Before the catch-all existed, anything outside the two routes matched nothing and React rendered an empty div: a blank white page with no theme and no way out. **`vercel.json` carries an SPA rewrite** (`/(.*)` → `/index.html`); without it a direct hit on a route 404s on Vercel. Vercel checks the filesystem before rewrites, so assets still serve normally — **and that ordering is now load-bearing for more than assets**: the seven prerendered HTML files in `dist/` depend on it, since each one has to win against the rewrite for its own path. See *The build has a second half*.
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

The thesis's own carousel and `ImageLightbox.tsx` are **deleted** along with `buildSlides` and the `.lightbox-*` CSS. `useModalChrome` stays — `PdfModal` still uses it — but nothing passes `pinViewport: false` any more.

**A `FigureCarousel.tsx` exists again, and it is not that one.** The capstone's three design diagrams use it (see *A run of figures can be a carousel* below). The two cases are opposites: those twenty-three charts were *data* that wanted to be queried, and a carousel is the wrong tool for a question a reader arrives with; three architecture diagrams are *pictures* read one after another, which is exactly what a carousel is for. Its controls also sit below the frame — allowed here, because the frame reserves its height, so nothing under it moves.

#### Why two pickers and not seventy slides
- **The dimension is the unit of choice, not the subgroup.** `surveyDimensions` offers Overall / Economics coursework / Gender / Age, and picking one puts *both* halves on the same rows. The thesis's point is always a contrast ("Econ Yes against Econ No"), so flipping between two single-subgroup views is the wrong interaction. It also caps the chart at **two series**, which is exactly how many validated categorical slots the site has — the explorer reuses the Background charts' `--chart-s1`/`--chart-s2` hexes.
- **Both pickers sit above the chart.** Changing a question or a dimension changes how tall the chart is (four options against six, one series against two), so putting the controls above everything that moves means **nothing needs a reserved height**. This is the deliberate opposite of the carousel, whose arrows sat *below* the chart and so had to pin `min-height: 132px` to the longest question. Measured here: the prompt runs 53px at the shortest and 131px at question 11 in a 678px column, and the only thing that moves is the chart the reader is already looking toward. Don't reintroduce the reserve — it's 78px of white under six of the ten questions plus a constant to keep in step with the copy.
- **Horizontal bars on a fixed 0-100% track.** The option labels are full sentences ("Balanced Trade (Imports and exports are even)"), which vertical bars can only take at an angle. The groove is the whole subgroup, never scaled to the row's own maximum, so a 2.4% answer reads as the sliver it is and the ten questions stay comparable with each other.
- **A 0.0% answer draws nothing.** A 2px stub was tried so the row wouldn't look unrendered; several questions have real zero answers and a mark where the value is zero is a lie. The number beside the empty groove carries it.
- The chips are **boxy, not pills** — 8px on a ~30px chip, the same proportion `.tag` carries at 6px on 23px. They sit *on* the `--well-bg` controls panel so they take the raised `--sub-card-grad` (the inverse of the tags, which are recessed *into* a sub-card), and hover re-declares that gradient beneath the tint. **The selected chip inverts** to a `--textcolor` fill like `.scroll-top`, because it has to be unmistakable across ten neighbours and a tint alone doesn't separate from a hover.
- The series name is repeated in a **visually-hidden span** on every value, since a screen reader reading one row at a time gets nothing from the color.

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

### The render layer is shared with the search index

**`src/content/paper-view.ts` is what a reading page actually renders, as data.** `Paper.tsx` used to compute this inline, which was fine while it was the only consumer. The command palette's index is a second one, and it has to agree with the page exactly: an indexed paragraph the page drops is a result that scrolls to nothing, and an indexed subheading whose id the page never renders is a dead deep link. So the three transforms that decide what survives live there, once:

1. `paperEdits` — already applied by the `papers` registry itself.
2. The **survey cut** — everything after the marker heading in a section the explorer supersedes.
3. The table **absorbs** — the paragraphs the rebuilt tables now draw themselves.

`renderedSections(slug)` returns the surviving blocks and is memoised; the registry is a module constant, so the result can't go stale. Verified after the split: 9 sections on the thesis, the survey explorer, 6 tables, 4 drawn charts, **still zero `<img>`**, no stray absorbed text, and cs-capstone's three-slide carousel and dropped EPIC section both unchanged.

**Subheading ids are minted here too**, and injected onto the `h3` block as an optional `id` rather than returned in a map keyed by position — because the render path regroups blocks (a run of figures folds into one carousel) and every index shifts when it does. The id is `<sectionId>-<slugified text>`, scoped so two sections can carry the same subheading, with a counted suffix for a repeat inside one section. Derived from the text rather than counted, so it is stable across builds — these strings end up in URLs.

`linkableIds(slug)` is the set of every id a link can land on. The page uses it to tell one of its own fragments from a stray one: **a nonsense `#100%` must not be read as the reader asking to open a gated paper.**

**Memoising the blocks made one latent bug worth guarding.** `groupFigures()` appends into the last block when it is a carousel — and a `carousel` written by hand comes from the content module itself, so appending would mutate that module in place. It never fired (the only generated section it runs on carries no inline carousel), but with the blocks now held in a cache the mutation would persist. It only folds into carousels it built this pass.

### The colophon

`/projects/colophon` — the site's own reading page, written by hand in `src/content/colophon.ts`. Its own module rather than `project-pages.ts`, because that file is specifically "the projects with no source document" and this is not a project.

**It is in the Projects grid rather than a footer link**, last, where it reads as a footnote to the five real projects rather than competing with them. A footer link would have been the conventional home for a colophon and the wrong one here: the whole reason it exists is the reader who skims the grid and leaves. A side effect is that six cards fill two rows of three at desktop where five left a gap.

**THE FRAME IS DESIGNER AND DIRECTOR, NOT AUTHOR OF THE CODE**, and that is an explicit instruction rather than a hedge chosen for the page. The design decisions are the owner's; Claude writes the implementation. The page states this in its first sentence, on the reasoning that a reader works it out anyway and it lands far better stated plainly.

**The prose is SUPPLIED VERBATIM.** It is not a draft to be improved — don't smooth it, don't lengthen it, and don't add sections. It is one section of three short paragraphs plus the commit strip. The page was four times this length when it described the engineering instead, and reading it felt like homework.

**One sentence was deliberately left out.** The supplied text ended its first paragraph with an incomplete fragment — "The reason this project is listed " — which is omitted rather than finished. Inventing the end of a sentence about *why the project is listed* would be putting words in the author's mouth on the one page whose whole subject is who decided what. Restore it when the rest of it exists.

**The card's tags follow from the same frame.** They are `System Design` / `Agentic Coding`, not a tech stack — the site's rule is that tags credit what the owner did rather than what the project contains, and `React` on this card would claim precisely the thing the page is careful not to.

### Live commit activity

The colophon ends in a 30-day commit calendar for this repository, drawn by `GitHubActivity.tsx` from a `{ type: 'activity' }` block. The block carries **no data**: the numbers change after the build, so baking them into the bundle would guarantee they go stale.

**No token and no third-party service, which is better than the obvious approach.** GitHub's contribution *graph* is GraphQL-only and needs an authenticated request — and a token shipped to a static site is a token you have published. The usual workaround is a third-party proxy, which means trusting someone else's uptime and their idea of what to do with the traffic. None of that is needed for the narrower question: `/repos/:owner/:repo/commits` is public and unauthenticated for a public repo, so the commits to *this* repo — which is what was wanted — come straight from the source. The rate limit is 60/hour **per IP** and the fetch runs in the visitor's browser, so the budget is theirs.

- **It degrades to nothing.** Rate-limited, offline, API down, repo renamed: the component renders `null` and the page reads exactly as written. Verified end to end by pointing it at a nonexistent repo — the block vanished, the three paragraphs and the page chrome were untouched. A portfolio showing a broken widget is worse than one showing no widget.
- **The result is cached at module scope**, because the component remounts on every navigation to a reading page and would otherwise spend another request from the visitor's hourly budget each time.
- **GitHub's layout: weeks are COLUMNS, the seven weekdays are ROWS.** It was a single 30-cell row first, which is a different thing wearing the same colors — a run of cells says "the last thirty days" where a calendar says *which* days, and the weekly rhythm is the part worth seeing. The first week is padded to its weekday offset and the last out to seven, so the rows line up Sunday-through-Saturday. A padded slot renders **nothing**, not an empty cell: a day outside the window is not a day with no commits.
- **GitHub's palette too, both themes, taken as published** — `#ebedf0`/`#9be9a8`/`#40c463`/`#30a14e`/`#216e39` light, `#161b22`/`#0e4429`/`#006d32`/`#26a641`/`#39d353` dark. This is the opposite of the call `.project-live` makes two files over: there a borrowed brand color would have meant nothing, here the recognisability *is* the point, and their empty square is as much a part of that as the greens.
- **Four shading steps with low thresholds** (1–2, 3–5, 6–9, 10+). This is one repo over one month, not a whole account over a year; at GitHub's own thresholds nearly every day would be the palest step and the calendar would say nothing.
- **Month labels key off the week containing the 1st, not each week's first day.** That distinction is not cosmetic: with a Sep 3 – Oct 2 window the last column runs Sep 27 – Oct 3, so its *first* day is in September, the month matched the previous label, and **October was never labelled at all**. Column 0 gets a fallback label when nothing else claims it, since its month began off the left edge.
- **`--gh-cell` and `--gh-gap` drive the squares and the month row**, so labels sit over the right columns by construction rather than from a second set of numbers. The cell is **13px** against GitHub's ~11: thirty days is only five columns, and at their size the whole object is 67px wide and reads as a postage stamp in a 780px column.
- **A real hover tooltip, replacing the native `title`** — GitHub's wording ("6 commits on September 17th.", "No commits on September 3rd."), with *commits* rather than their *contributions*, since this counts one repository and their word would claim a broader number. `title` is removed rather than kept alongside: leaving it gives two tooltips for one cell, the native one arriving about a second late in the OS's styling.
  - **Inverted — `--textcolor` fill, `--bgcolor` ink** — the site's own "unmistakable" idiom, shared with `.palette-row-active` and `.scroll-top`. In light that is a near-black pill with white text, which is what GitHub's looks like anyway; in dark it flips, where GitHub's would stay dark. Following the site wins: a fixed dark pill on the dark page would need a border, and nothing else here is a bordered popover.
  - **It is clamped into the article column, measured in a LAYOUT effect.** The pill is ~208px against an 81px calendar, so centred on the leftmost column it hangs ~104px past the article's left edge — at the mobile gutter that is off the viewport, and an absolutely positioned box outside the article is exactly how this page has opened a sideways scroll before. Verified: hovering column 0 puts the pill's left edge at 310 against the article's 306, with `scrollWidth === clientWidth`.
  - **The caret has its OWN clamp, and leaving it out was visibly wrong on the three leftmost columns.** The pill stops moving at the column edge while the cell keeps going, so the caret ran out past the pill's 7px corner radius and sat on the curve — it read as a torn speech bubble rather than a pointer. It is now held 14px from each end (the radius plus the caret's half-diagonal), measured: 14px on the first column, 21.5px on the second, where it was running off the edge. On the far columns it therefore stops tracking the cell exactly, which is the right trade: a caret pointing approximately at the right area still reads as attached, where one hanging off a rounded corner reads as nothing.
  - Position is resolved in a layout effect and the pill is `visibility: hidden` until it has been measured, so a pre-measurement position can never be seen. `left` is the pill's own left edge, already centred and clamped in JS, so the CSS carries no `translateX` — centring in CSS and correcting in JS would be two sources for one number.
  - It is positioned against `.gh-activity` (the full article width), not against the calendar — clamping to an 81px box would be nonsense.
  - **No transition.** It is repositioned on every cell the pointer crosses, and easing that turns a tooltip into something that slides around the page chasing the cursor.
- **Touch is handled separately from mouse, keyed off `pointerType`** — the same split `FigureChart` makes, for the same reason: a finger has no hover. A tap opens the tooltip, a tap on another cell moves it, a second tap on the same cell closes it, and a tap anywhere else closes it. That last one is a document-level `pointerdown` listener, because a tooltip opened by touch has no `pointerleave` to wait for and iOS does not reliably fire blur on a non-input element when you tap away. The cells' own handler stops propagation so the document listener only sees taps that missed. Mouse `pointerleave` is ignored for touch, since a finger "leaving" is not dismissal.
  - **The cells are 20px on a phone** (13px on desktop), because they become tap targets rather than hover targets. GitHub's ~11px is comfortable to point at and far too small for a thumb; 20px is still unmistakably the same object and is the most five columns can take in a 335px column. Verified at 375px: 20x20 cells, 120px calendar, no sideways scroll.
  - **Verified with synthetic `pointerType: 'touch'` events**, since the pane sends mouse clicks. All five interactions pass (open, move, close on same, reopen, close on outside tap), and the first and last columns both keep the pill inside the column and the viewport (22px to 236px and 22px to 242px against a 375px screen). **That is not a real device.** What it does not cover is a physical finger's contact area, iOS's tap delay behaviour, or scroll-vs-tap disambiguation — the last being the one worth trying by hand, since a drag starting on a cell should scroll the page and not open a tooltip.
- **The calendar is `aria-hidden` and the cells are not focusable**, so the tooltip is pointer-only. That is deliberate: the totals are already in the sentence above, so the tooltip **enhances and never gates** — the same rule the thesis charts' tooltip follows — and making three dozen squares focusable would add that many tab stops to a reading page for a decoration.

**A testing note worth keeping.** Two things made this look broken when it wasn't. React synthesises `onMouseEnter` from `mouseover`, so dispatching a synthetic `mouseenter` does nothing — drive it with a real pointer. And the browser pane's `computer` coordinates are in the **screenshot's** frame (800x600), not the page's CSS pixels (1024x768); hovering at a rect read from `getBoundingClientRect` lands in the wrong place. Multiply page coordinates by `frameWidth / innerWidth`.

**The thumbnail is the site's own ambient figure**, rendered to a still from the same constants `PulseRing.tsx` animates, by a throwaway AppKit script. So the card cannot show a motif the page no longer uses. It is bolder than the live field (alpha x1.7, radius 0.37 of the height rather than fitted to a band) because a 371px card needs more presence than a background does — the one place the still deliberately departs from the running version.

It needed an og card like every other route, or `prerender-meta.mjs` throws. **The og image is keyed by the thumbnail's file STEM, not by the slug** — which is why `shipment-quoting` serves `cs-capstone` — so the two filenames have to agree.

### Prev / next project arrows

`ProjectNav.tsx` — two small chevrons pinned to the viewport's left and right edges, vertically centred, so a reader who has finished one project can reach the next without going back to the grid.

- **The order is `works`, not the `papers` registry.** That is the whole reason it reads from `content/projects.ts`: `works` is the order the Projects grid and the nav dropdown already present, so "next" means the next card. A second order derived here would drift from the grid the moment a project moved. It also means **a project hidden from `works` is skipped for free** — wage-effects is commented out of that list, and the arrows step over it exactly as the grid does, with no second place to remember. Verified by walking the whole cycle: cs-capstone → thesis → basic-income → rental-prices → material-boxes → back to cs-capstone, with wage-effects absent.
- **It wraps.** The last project's Next is the first one. The alternative is hiding an arrow at each end, which makes the control appear and disappear as you move through the set, and both carousels on this site already wrap.
- **Matched on `to`, not on a second slug field.** `works` already carries the exact route string the card links to, so there is nothing to keep in step.
- **The glyph is the About gallery's chevron, exactly** — same viewBox, same path, same 1.5 stroke. Reach for the existing glyph before drawing a new one; that rule is why `.project-go` ended up as `ArrowOut`.
- **Quiet, not a button**: `--muted` ink on no fill, coming up to `--textcolor` on hover with a layered `--hover-tint` behind it. This is `.project-go`'s treatment rather than the recessed `--well-bg` chip the Projects cards and the About contact row use — those sit *inside* a sub-card where a dent reads as depth, and these sit on the bare page where it would read as a hole. 40px target around a 16px mark.
- **Icon-only, so `aria-label` is the link's only name** and doubles as the tooltip — the same contract the Projects cards' icon links use. It names the destination (`Next project: Barrett Honors Thesis`) using `navLabel`, the short name, because the card titles run to 71 characters.
- `a.project-nav:visited` is restated: `a:visited` is 0-1-1 and outranks a bare class, and these *will* be visited.
- Navigating lands at the top of the new page, since a `<Link>` is a PUSH and `useScrollRestore` scrolls a new history entry to 0. Verified from a scrolled position.

#### They are hidden below 1400px, and that threshold is measured

The page is capped at `--paper-max` (1320) and centred, so its content's left edge is `max(36, (vw − 1320) / 2 + 36)`. An arrow inset 24px occupies 24–64, so it **stops touching the content at vw 1376**, with 12px of air at 1400, 32px at 1440 and 112px at 1600. Checked against the live rects at 1024, where the leftmost thing on the page is `.paper-toc` at x=36 and the layout uses the full width — there is no side room at all down there.

**It was guessed at 1150 first**, which would have put both arrows squarely on the contents list at every common laptop width. Don't lower it without re-deriving the formula: the cap is what dominates, not the arrow's size — shrinking the control to 32px only moves the threshold to ~1360.

**The real cost is that a 1280 or 1366 laptop gets no prev/next at all**, which is inherent to a viewport-edge control on a page this wide. The back button, the "Kian Javaheri" link and the command palette still work, so nothing becomes unreachable. If the arrows should reach narrower screens, the fix is a different anchor — a pair in the top bar, or a prev/next footer under the article — not a lower breakpoint.

### Reading progress

A 2px line across the bottom edge of the sticky top bar, driven by `useReadingProgress`. The thesis page is 20,478px and gave no sense of position.

- **It writes `transform` straight to the node**, not through React state: this updates on every scroll frame, and a `setState` there would re-render the whole paper. `scaleX` on a composited transform is cheap enough to run every frame — it is the same trick the nav's docked hairline used before that line was removed.
- **It has no transition**, deliberately — it tracks the scroll exactly, and easing toward the reader's own scrolling would only lag behind it. That also makes it measurable in a hidden preview pane, where the transition clock is frozen.
- **Inset to `--paper-gutter`, not run to the screen's edges.** The bar it hangs from is capped and centred, and a rule overshooting the content it belongs to is what the footer's `::before` exists to avoid. Measured flush with `.paper-title` to 0.00px.
- The page's height is **observed as well as measured** — expanding the abstract gate puts a whole document on the page without firing a resize, the same reason the nav's dock watches `body`.
- A page with nothing to scroll draws no line at all. A full bar on a page that was never scrolled would be claiming something false. Measured: 0 / 0.25 / 0.50 / 1.00 at those scroll fractions.

### Heading anchors

Every `h2` and `h3` carries a `HeadingAnchor` — a chain-link glyph that appears on hover or focus and copies the absolute URL of that heading.

- **It is a real `<a href="#id">`, not a button**, so the browser's own "Copy link address" works and the destination shows on hover. Its click copies instead of jumping, because a reader who wants to point someone at a section is already looking at it.
- **It stays in the tab order.** Hiding it with `display: none` until hover would make the feature mouse-only; `opacity: 0` on a focusable element is the standard way around that, and it is always in flow, so revealing it shifts nothing.
- **The copied state swaps `CheckIcon` into the same 1em box** rather than showing a "Copied" label beside it. A label would either shift the heading or need absolute positioning past the article's right edge — which is how this page last opened a sideways scroll at 375px.
- **`history.replaceState`, not `location.hash`**, which would also scroll. The address bar gets the link either way, so a clipboard that refuses (insecure origin, denied permission) still leaves something to copy by hand — and in that case there is no flash, because nothing was copied.
- **Hidden at ≤768px**: no hover to reveal them with, and no keyboard to focus them from. The ids still work as links.
- The glyph is inline SVG, stroked at 1.3 on a 14-unit viewBox with the rest of the set. That also sidesteps the obvious alternative, a typed `#`: U+0023 carries `Emoji=Yes` and forms keycap sequences.

**Arriving at a heading opens a gated paper.** Someone following a link to "Results" asked for the paper by asking for a part of it. The initialiser matters as much as the effect — the sections have to be in the DOM in the first commit or the layout effect has nothing to scroll to — and the hash scroll is a layout effect declared *after* `useScrollRestore`, for the reason that hook documents. Measured: a palette deep link lands the heading 104px down against a 76px bar, the same 28px clearance a contents jump gets.

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

A page with **no entry** renders in full on arrival, the way they all did before this existed — the three hand-written project pages work that way. So the gate is opt-in per page, twice over: an intro is optional, and gating is optional on top of it.

- **Intros live in `src/content/intros.ts`, not in each paper's own module** — same reason as `tables.ts`, `charts.ts` and `survey.ts`. `thesis.ts`, `basic-income.ts` and `cs-capstone.ts` are generated from the PDFs, so anything hand-written into them is dropped by the next regeneration. (This is also why the capstone's summary lives here rather than being pasted into its generated module.)
- **Only the thesis's abstract is the document's own.** The Economics capstone was submitted without one, so **its abstract was written for the reading page** from the paper's own argument and findings. It is hand-maintained and will not follow a revision of the paper — flagged as such in `intros.ts`. (That is a different thing from Table 1's corrected trade balance, which is still the only place the site alters what its source printed; this one has no source to alter.) If the capstone is ever revised, this is the file to revisit.
- **The reveal is one-way.** Once a reader has asked for the paper, collapsing it back out from under them isn't a state they want, so the button has no toggle and carries **no `aria-expanded`** — a disclosure attribute that can only ever be `false` misdescribes the control. That also means there's nothing to restate on re-render; `expanded` resets on a slug change, alongside the existing scroll-to-top.
- **The heading's id is `intro`, not the section's own title**, so the contents link and the scroll probe don't have to care whether it says Abstract or Summary.
- **The contents list is gated with it**, since its links would otherwise point at sections that aren't in the DOM. While collapsed it shows the intro's entry alone and drops its "Contents" label. **The `<nav>` element itself always renders**, even empty: `.paper-layout` is a `210px minmax(0, 1fr)` grid, and removing the nav would promote the article into the 210px track and jump it sideways on expand.
- **`showFull` is a dependency of the scroll-probe effect.** Expanding puts every heading on the page at once, and without the re-run the probe keeps measuring the collapsed id list until the next scroll event — which on a click that doesn't scroll never comes. `intro` is in the same list because the id array leads with `intro` when there is one.
- The button is filled with `--textcolor` and inverted against the page, the `.scroll-top` treatment rather than the quiet underlined `.paper-link` used for the PDF and library links in the header. It is the only action on a page that is otherwise all reading. Hover is a layered `--hover-tint-inverse`, per the site's hover convention — the page-keyed tint would be invisible on this fill.
- Measured: expanding the thesis yields 9 sections, 6 tables, 4 charts, the survey explorer and **still zero `<img>` elements**; the ToC highlight tracks from the intro through References at max scroll on both gated papers. At 375px the button is 192x42 inside the 335px column and neither state opens a sideways scroll.
- **An intro can carry ONE figure, and only the capstone does.** `figure` on `PaperIntro` renders under the paragraphs as a `.paper-figure.paper-intro-figure`. It is the poster's screenshot of the finished tool, which used to be the last block of Results — so the one picture showing what was actually built sat below everything written about it. It is **not** `loading="lazy"`, because it is above the fold on arrival.
  - **The move is declared at both ends**: the figure is added here and removed from its own section by `dropFigures` in `paperEdits` (below). Neither end can live in `cs-capstone.ts`, which is generated. If a figure ever appears twice on a page, that pair is what's out of step.
  - The `alt` is written here and describes what the screenshot *shows*. The generated figures carry `caption: ""` and so render `alt=""`; that is right for a diagram sitting under a paragraph explaining it, and wrong for the one picture a page opens on.

### Edits to the generated papers are declared, not typed in

`paperEdits` in **`src/content/papers.ts`** is the same idea as `withheldPdfs` beside it, and exists for the same reason: `basic-income.ts`, `cs-capstone.ts` and `thesis.ts` are rebuilt from their PDFs by a script, so an edit made *inside* one of them is dropped by the next regeneration and an edit made here isn't. It carries four fields:

| Field | What it does |
|---|---|
| `dropSections` | Removes a section by id, ToC entry and all |
| `dropFigures` | Removes a figure by src — for one that *moved*, see the intro's `figure` |

Both are applied by `withEdits()` as the registry is built, so everything downstream — the ToC, the scroll probe, the section loop — sees a paper that simply doesn't contain them. (`figureCarousels` sits beside it and is *not* part of this: it is a render-time thing, and it applies to hand-written pages too.)

**Only `cs-capstone` has an entry.** It drops **EPIC and Customer Archetypes**, which is poster apparatus — two one-word EPICs and three customer types, no sentence between them — and reads as filler on a page that is already short. Dropping it and moving the screenshot took the page from **3,862px to 2,866px**.

### The figure carousel

`FigureCarousel.tsx` draws figures one at a time instead of stacked. **There are two ways in, and which one you use depends on whether you can edit the blocks:**

- **A hand-written page writes a `carousel` block** — `{ type: 'carousel', figures: [{ src, width, height, label }] }` — straight into its section. Material Boxes does this with seven screenshots.
- **A generated page can't**, so `figureCarousels` in `content/papers.ts` names the *sections* whose consecutive figures should fold together, plus a `labels` map keyed by figure src. `groupFigures()` in `Paper.tsx` turns each run of two or more into the same `carousel` block, so both routes land in one renderer.

Why bother at all: the capstone's three architecture diagrams stacked ran **1,210px of a 3,862px page**, and seven Material Boxes screenshots would run further. Stacking is still right for the Economics capstone's trailing figures section, which is why neither route is automatic.

- **Grouping (the generated route) is by adjacency, not by a list of srcs**, so a regeneration that adds a fourth diagram picks it up with no further declaration. A lone figure in the same section still renders as a figure.
- **Every slide stays mounted**, so a click never waits on a fetch and there is no preload flag to get stuck — the trap the About gallery documents at length. They carry `loading="lazy"`, because the set can be heavy (Material Boxes' seven screenshots are 561KB) and every carousel so far starts below the fold; the browser fetches the whole set as the block comes into range. Verified: all seven report `complete` once the carousel is scrolled to.
- **The frame reserves its height from the TALLEST slide**, as an inline `aspect-ratio` computed from the figures' own pixel sizes; the others letterbox into it with `object-fit: contain`. Unreserved, changing slides moved everything below by up to 106px — including the arrows being clicked. This is why controls *below* the frame are fine here and were not for the survey explorer. Measured on both pages: frame height and control offset constant across every slide, desktop and mobile.
  - Material Boxes letterboxes **nothing** — all seven screenshots are 854x480. The capstone's three are 1.85/2.03/2.65, so the widest gets 106px of white.
  - The frame is `box-sizing: content-box`, against the global border-box reset, so that ratio applies to the content box rather than to the box plus its 12px white plate.
  - An absolutely positioned **replaced** element does not resolve `auto` width from its insets — it falls back to the image's intrinsic size — so the slides are given an explicit `calc(100% - 24px)` box.
- **Slides are labelled, and the labels are written for the page** — neither the poster nor the Minecraft screenshots carry captions of their own. A carousel whose only caption is "2 / 7" tells the reader nothing about what they're flipping between; the label doubles as the active slide's `alt`, and the inactive slides are `aria-hidden` with an empty one.
- **The arrows are the About gallery's, exactly** — same chevron paths, same bare no-fill treatment — and the dots and corner badge between them are literally the same components. See *The two carousels share their controls*.
- **At ≤768px the bar is `align-items: flex-start`.** The longest labels wrap to two lines there; centred, that pushed the arrows down as you clicked them. Measured at 375px on both pages: the label goes 15px → 29px and the controls stay at the same offset through every slide.
- **It slides now, and it used to crossfade.** The old note here said there was no direction to honour because the pictures aren't a sequence in space. Dots and autoplay made that false — see *The two carousels share their controls*. There IS a `prefers-reduced-motion` block now, falling back to the fade this used to be.

### Block types added for hand-written pages

Four additions to `Block`. The first three came out of the Material Boxes documentation; `table` came out of the rent model. They are general, and the hand-written pages now share them:

- **`list` takes `ordered`**, which draws an `<ol>`. Quick-start steps are numbered because their order is the point. The marker goes on the `li`, not the list — the global `*` reset lands `list-style: none` on the element itself, so setting it on the `<ol>` would only be inherited and lose.
- **`deflist`** is `{ term, href?, detail }[]`, rendered as a `<dl>`. It replaces a two-column markdown table of eight documentation pages. **A real table was the wrong shape twice over:** `.paper-table-scroll` would have sent eight rows of sentence-length text into a sideways scroll on a phone, and table cells are plain strings, so the first column couldn't be a link. Stacked, each detail simply wraps under its term.
  - The term link is **not** `.paper-link` — that is the header's 0.7rem uppercase micro-label, and these terms are sentences. It keeps the `dt`'s own 0.95rem/600 and takes a `--card-border` underline plus `ArrowOut`, the same reason the tech tags aren't uppercased either.
- **`figure` and `carousel` take `plain`**, which drops the white plate the images normally sit on. That plate is there for the papers' figures, which are charts cropped out of a PDF and carry their own white background — without it, a dark page shows a bright slab. A **dark** image wants the exact opposite: on Material Boxes' Minecraft screenshots the plate drew a visible white ring around every one of them. In the carousel the padding and the slides' inset both come off one `--plate` variable, so they can't drift apart.
- **`figure` takes `alt`**, which overrides the caption as alt text. Before this a figure's caption was its alt, so a picture needing a real description had to print that description under itself. Material Boxes' CurseForge screenshot captions as "The mod's page on CurseForge" and describes itself properly to a screen reader.
- **`table`** is `{ type: 'table'; table: PaperTable }` — a table written straight into a section, which **a hand-written page previously had no way to draw at all**. The thesis's six reach `PaperTableBlock` by a *src lookup*: `renderBlock` sees a `figure`, finds `paperTables[b.src]`, and swaps the rebuilt grid in for the cropped image. That route needs an image to key off, which a page with no source document doesn't have. The new block is the direct way into the same renderer, so both paths style identically and the alignment detection, the `.paper-table-scroll` and the `<caption>` all come for free. `absorbs` means nothing here — there is no extracted prose to reclaim.
  - **A column goes right-aligned only if EVERY non-empty cell is a quantity**, and that is worth knowing before writing a "not applicable" cell. The rent model's accuracy table has no feature count for its median baseline; an em dash there fails `QUANTITY` and would drag the whole Features column ragged left while MAPE and MAE stayed right. The cell is left **empty** instead — `isQuantityColumn` filters blanks out before testing — which renders as nothing and keeps the column aligned. Same trap, one level down, as the `Year` column the `c > 0` exception exists for.

### The Material Boxes page

The first of the three hand-written project pages to grow past its stub blurb, and the template the wage-effects page followed. It is **Overview** (two paragraphs of the mod's own documentation, the CurseForge screenshot, the seven-shot carousel), **Quick start** and **Features**, all converted from the mod's README-style docs.

- **Its images live in `public/images/material-boxes/`, not `public/pdfs/<slug>/`.** That layout is for papers converted from a PDF, and holds the figures cropped out of one. This page has no source document.
- They carry the **content hash** the project thumbnails use (`<name>.<first 8 of md5>.webp`), for the reason documented under *Filenames carry a content hash*: `public/` is copied verbatim, so a stable name is a permanently stable URL and a replaced screenshot never reaches anyone who already loaded the page.
- **The seven screenshots are lossless WebP**, like `material-boxes.webp` in the projects grid and for the same reason — Minecraft's pixel text and flat color are exactly what lossy WebP smears. Lossless roughly halved them against the source PNGs (1.27MB → 561KB). Don't "optimise" them to `-q 85` to match the paper figures.
- **The CurseForge screenshot is left exactly as supplied** (2000x1269, already WebP at 126KB). Re-encoding a lossy screenshot of a web page to hit a width target only softens its type.
- **The eight `Features` links point at the repo's real `docs/` files** — `github.com/kianjavaheri/material-boxes/blob/main/docs/<name>.md`. All eight were checked for a 200 before shipping; a docs index of dead links is worse than no links. A **View Documentation** action was added to the page header alongside CurseForge and GitHub.
- **The card blurb is NOT on this page.** It shipped alongside the mod's own documentation for one round and the two said the same thing in two voices, 400px apart; Kian cut the blurb. So Overview opens in documentation voice, and the resume-voice sentence survives only on the project card, which is the one place it belongs. **`wage-effects` and `rental-prices` have since grown the same way** (see below), and each dropped its card blurb on the way for this exact reason.

### The wage-effects page

The second hand-written project page to grow past its stub. Built from the repo's README (`github.com/kianjavaheri/welfare-model`) but **deliberately not a copy of it**: Installation, Usage, Data setup and Project structure are all dropped, because a portfolio page describes a project rather than telling a reader how to run it. What survives is the design, the method, a **Results** section, the three validity threats, and the pivot that produced the current specification.

- **The meta AND the project card's blurb were stale, and both are corrected.** Each described the abandoned CPS specification — the page's meta said `Data: CPS ASEC microdata`, and the card promised "an unconditional $6,000 a year", a policy simulation the current design cannot produce (the treatment is an arm assignment, not a dollar amount). Both now name the Baby's First Years RCT. **This is the trap a pivot leaves behind**: the page was rewritten at the time of the pivot but the two one-line summaries pointing *at* it weren't, and nothing in the build catches a description that has quietly become false. Grep for the old data source after any change of specification.
- Numbers on the page come from the README's own reported output and are quoted exactly: +14.7% (LinearDML, 95% CI −0.5% to +32.3%), +14.9% (CausalForestDML, −4.5% to +38.1%), CATEs spanning 3.7% to 28.3% across n=160, employment −2.1pp. **Don't round them differently in one place than another** — the figures in the carousel print them too.
- The **Results** section uses the `deflist` block, not prose: four estimates, each a term and its value. It is the second caller of that block after Material Boxes' documentation index.
- **The project card's cover art opened this page for one round, and came out.** It is a dressed-up figure 6 — the same CATE histogram that ends the carousel — so the page led with the chart it closed on. The card still carries it; that is the one place it earns its keep, as the tile's picture. **So unlike Material Boxes, this page has no lone `figure` at all**, only the carousel.

#### The six figures are padded to one ratio, and that is the whole trick

The source figures run from **0.442 to 0.828** in height/width — `fig5_ate_comparison` is a wide forest plot, `fig4_employment_rate` a tall two-bar chart. The carousel sizes its frame to the **tallest** slide, so dropped in as-is the frame would have been 541px tall and the forest plot would have drawn at 289px of it: **250px of dead white**, on the one slide carrying the headline result.

So each is padded to a single ratio (`919/1520 ≈ 0.6046`) before encoding, with `sips -p H W --padColor`. **Every one of the six has a uniform `#FCFCFB` on all four edges** — checked by sampling eight points per image, not assumed — so centred padding is seamless and no sampling-per-edge dance was needed (unlike the Projects thumbnails, where one image's bottom edge was mixed). Measured after: all six are 1400x847 and the carousel letterboxes **0px** on every slide.

- **`-q 85`-style lossy, at q90 — NOT lossless.** That is the opposite call from Material Boxes' screenshots, and for a real reason: these are matplotlib output, antialiased vector text and thin strokes, which lossy WebP handles well; Minecraft's pixel text is what it smears. q90 is 39KB against lossless's 72KB on the largest figure. The whole set is 256KB.
- **They keep the white plate** — no `plain` flag. These are exactly the case the plate exists for: charts carrying their own near-white background, which would otherwise show as a bright slab on a dark page. Material Boxes' dark screenshots are the inverse case.
- **The cover is left exactly as supplied** (2000x1250 WebP, 72KB), the same call as Material Boxes' CurseForge shot: re-encoding a lossy WebP to hit a width target only softens it. It is the same artwork as the project card's thumbnail, at a different crop — Kian asked for it at the top of the page, under the overview, with the remaining six in the carousel below.

### The Santa Cruz rent model page

The third hand-written page to grow past its stub, and **the only one of the six whose page carries no picture** — no figure and no carousel. (It still has a card thumbnail; `image` is required on `WorkProps`.) What it has instead is three tables, which is why the `table` block exists (see *Block types added for hand-written pages*). Six sections: Overview, The data, How it works, Accuracy, What it cannot see, and Running it in the browser.

- **It dropped its card blurb**, the same call Material Boxes and wage-effects both made. The two resume-voice paragraphs that were the whole page said what the new lede says, less precisely, and would have sat directly above it.
- **The three tables are three different jobs**, and only one of them is a table in the source sense. The modelling-slice counts and the tech stack are both two-column and could have been `deflist`s; they are tables so the page has **one register** for anything tabular rather than two. The accuracy comparison genuinely needs four columns.
  - The stack table's second column is prose-ish (`GeoPandas, Shapely, proj4 (EPSG:3310)`) and so goes left-aligned by the detection, which is correct — these are lists of names, not quantities.
  - **The baseline's feature count is an empty cell, not an em dash.** See the `table` bullet above; a dash there loses the whole column's alignment.
- **The date range moved into the prose above the counts table**, on purpose. `Feb 2020 – Sep 2026` in a `Count` column is not a count, and one non-quantity cell would have taken the column ragged left.
- **The worst port difference is written out as `$0.00000000000045`, not as 4.5 × 10⁻¹³.** The superscript minus (U+207B) would be the first codepoint on the site outside the glyph audit's range (see *Typography*), and a missing glyph is exactly how a fallback face — or an emoji presentation — sneaks in. The run of zeros also makes the point more vividly than the exponent does.
- **The British spellings are the source's and are kept** (`neighbourhood`, `licence`, `coarsened`), matching the rest of the site's copy.
- Numbers come from the project's own reported output and are quoted exactly: 12.9% deployed / 12.6% analysis / 15.2% baseline MAPE, the 9–17% regional spread, k = 0.211, 81.2% coverage against an 80% target. **The 9–17% spread is stated twice**, once in Accuracy and once in the limits list, as the source write-up states it. Keep the two in step.
- Measured at 1280: **4,793px**, six sections, three tables, none of which overflows its `.paper-table-scroll`. At 375px all three still fit the 335px column with no sideways scroll, so the scroller never engages on this page — it is there for the thesis's wider grids.

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
- One of its seven sections, **EPIC and Customer Archetypes, is not rendered** — dropped by `paperEdits`, not by editing the generated module. It is still in `cs-capstone.ts`, and a regeneration will still produce it.

### Figures 1-4 are drawn, not screenshotted

The four Background figures render as inline SVG line charts (`FigureChart.tsx`, data in `src/content/charts.ts`), keyed by image src in `paperCharts` exactly as the tables are in `paperTables`. **Nothing on the thesis page is a picture any more** — the survey section became an explorer drawn from its own counts, so the page carries zero `<img>` elements.

**Chart data is derived from the tables, not transcribed a second time.** Figures 1 and 2 plot Table 1; Figures 3 and 4 plot Table 2. `column()` parses the table cells (`$115.6 billion` -> 115.6, `~3.19%` -> 3.19), so the chart and the table printed below it on the same page cannot drift apart, and the verification already done against the PDF covers both. Verify a change by inverting the rendered point geometry back to values rather than by eye.

**The one place the site knowingly departs from the thesis.** Table 1 prints the 2016 trade balance as `1.95%`, positive, while Figure 2 plots it at -1.95%. Every other year is negative in both, and a positive value would mean a trade *surplus* with China, so the published table is missing a minus sign. **Kian confirmed the table is wrong, and `tables.ts` now carries `-1.95%`.**

This is the only cell on the site that does not reproduce its source verbatim, which makes it the one exception to the rule that the thesis's own errors are kept as printed (`Satisfication`, the two "Figure 4"s, the en dash in `Age 18–24`). It is marked as such in `tables.ts` — don't "restore" it to match the PDF, and note that a token-by-token diff against the PDF will legitimately flag it.

#### Departures from the originals
The source images are Google Sheets defaults, and three of their habits are anti-patterns:
- **A value on every point.** All nine, on every series. Direct labels only work when sparing, so only the **last point** of each series is labelled; the axis and the tooltip carry the rest.
- **An in-chart title.** The figcaption underneath already names the chart, so repeating it inside is the title twice. For the same reason a single-series chart gets **no legend** — one color, and the caption names it.
- **A white slab.** The PNGs carry their own white background, which is why `.paper-figure img` has to paint one. Inline SVG takes the page's ink and inverts with the theme instead.

#### Color is validated, not chosen
Two categorical slots, stepped per mode: `#2a78d6`/`#eb6834` light, `#3987e5`/`#d95926` dark. Both pairs were run through the palette validator **against this site's actual surfaces — pure `#ffffff` and pure `#000000`**, not a near-white and near-black, and pass the lightness band, chroma floor, CVD separation (worst ΔE 24.7 light / 26.8 dark against a ≥8 target), the normal-vision floor and 3:1 contrast. Re-run it if either hex changes.

Text never wears the series color — ticks, labels and the legend stay on `--muted`, and identity comes from the line key beside them.

#### Two things that bit
- **The marker's surface ring needs `circle.paper-chart-dot`, not `.paper-chart-dot`.** The `.paper-chart-s1`/`s2` rules set `stroke` to the series color for the lines; at equal specificity and later in the file they win, so the ring painted in the series color — invisible, precisely on the overlapping markers it exists to separate. The element-qualified selector outranks them.
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
