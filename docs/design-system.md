# Design system

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## Theme

Three-state preference stored in localStorage under the key **`theme-pref`**: `'system'` (default), `'light'`, `'dark'`.

- `Home.tsx` reads `window.matchMedia('(prefers-color-scheme: dark)')` and subscribes to its `change` event, so the site follows the OS theme live with no reload.
- Clicking the nav toggle writes an explicit `'light'`/`'dark'`, which pins the site and stops it following the system.
- The resolved theme is applied as `data-theme` on the `.home` div.
- **`index.html` carries a small inline pre-paint script** that reads `theme-pref` and sets three things on `documentElement` before React mounts: `data-theme`, `color-scheme` and an inline `background`. Without it, dark-mode visitors get a white flash on every load. It carries literal hexes because it runs before any stylesheet; keep them in sync with `--page-base`.
- **`useTheme` must re-write ALL THREE on every change, not just `data-theme`.** It only did the attribute for a long time, so after a runtime theme switch the root kept its **load-time** `color-scheme` forever.
  - **The symptom was nowhere near the cause.** The command palette's text came out inverted — black rows on a dark panel, or white on a light one — and only sometimes, because whether it looked wrong depended on which theme the page was *loaded* in. `.palette-row-title` sets no `color` of its own, so it inherits; and the palette renders **outside** `.home`/`.paper`, the only thing on the site that does, so what it inherits is the UA's default text color — which is exactly what `color-scheme` governs. Everything inside a themed div was unaffected, which is what made it look like a palette bug.
  - The scrollbar and the root's overscroll background were stale for the same reason, silently.
  - `useTheme` reads the background from `--page-base` rather than repeating a hex: by the time React runs, App.css is loaded and the token is the source of truth.

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
| `--nav-hover-tint` | `rgba(0,0,0,.06)` | `rgba(255,255,255,.10)` | Hover tint for the nav bar's chips, in BOTH of its states |
| `--nav-drop-shadow` | `0 10px 24px rgba(0,0,0,.12)` | `0 10px 28px rgba(0,0,0,.65)` | The Projects panel's downward-only cast |
| `--about-ink` | `rgb(3,111,252)` | `#ffffff` | The ink for the About card's ambient figure — the pulsing ring today, the dot field before it. **One token for both**, so the two treatments of one slot can't drift to different colors |
| `--ring-alpha-scale` | `1` | `1.3` | Multiplies the ring's per-copy stroke alpha. Dark needs a smaller correction than the dots did — a 1px stroke holds up better on the near-black card than a field of discs |
| `--dot-grid-alpha-scale` | `9` | `2.2` | Multiplies the DOT FIELD's three alphas (retained; the field is not currently rendered) (rest/pulse/peak). Light saturates to a solid dot; dark needs its own value because white at `.11` over the card composites to grey. **Reload after changing it** — a stylesheet swap repaints nothing |
| `--ease-in-out-cubic` | `cubic-bezier(.645,.045,.355,1)` | same | The carousels' slide curve (on `:root`, not per theme) |
| `--card-shadow` | — | — | Outer card elevation |
| `--sub-card-shadow` | — | — | Inner card elevation |
| `--nav-glass` | `rgba(197,203,217,.50)` | `rgba(68,68,78,.50)` | Nav pill fill |
| `--glass-rim` | white `.65`/`.30` insets | white `.14`/`.06` insets | The specular rim on glass. **The command palette only** — it floats over arbitrary content, including the gallery photo, where the drop shadow is invisible and this is the only thing drawing its edge |
| `--nav-rim` | **all zero** | **all zero** | The same geometry, off. The bar's rim was **cut** — on a 56px pill it read as a drawn border. Kept at zero alpha so the dock still has something to interpolate; the mobile menu shares it and is bare with the bar |
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
- **On the nav bar's chips — the links, the theme toggle, the hamburger, the palette chip and the dropdown's rows — use `--nav-hover-tint`.** Same reasoning one step further: the bar is chrome, not a page-colored surface. **This was a real bug in dark mode**, back when docking swapped the glass for a flat fill: that fill was pure `#000`, and `.022` white on pure black composites to `rgb(6,6,6)` — a 6-point step, invisible, so the hover simply did not exist on the docked bar. At `.10` it lands on `rgb(26,26,26)`, a 26-point step. Measured across all four cases at the time (docked/floating × light/dark) the old tint gave steps of 6, 5, 8 and 8; the new one gives 26, 22, 15 and 14. **The docked-flat case is gone now** — the bar keeps its glass — but the tint stays: it was the better value in the floating cases too (15 and 14 against 8 and 8).

### Nesting goes DOWN, not up

A card inside a card does **not** get another raised, lighter fill. Stacking `--sub-card-grad` on `--sub-card-grad` washes the whole stack toward white in light mode and toward grey in dark, and the hierarchy stops reading.

The third level is a **recessed well** — `--well-bg` (darker than the sub-card that contains it) plus the `--well-shadow` inset. Cards placed inside the well keep the normal `--sub-card-grad`, so they read as raised against it. Currently used by `.coursework-block`.

**Dark mode takes a much smaller step down than light.** `--sub-card-grad` already ends near black at `#1a1c24`, so matching light mode's ~9-point drop lands the well on top of `--card-bg` (`#101012`) and it reads as a hole punched through to the page rather than a recess. `#15161d` sits between the two.

**Dark mode has NO inset shadow — `--well-shadow` is `none` there.** An inset darkens the perimeter, and on a fill this close to black the rim composited darker than *both* the well interior and the sub-card outside it. A line darker than both its neighbours reads as a drawn border, and that is precisely what it looked like. The fill step alone carries the recess in dark. Light keeps its `0.06` inset, where the rim is gentle enough to read as depth rather than an edge.

The general rule: **an inset shadow needs enough headroom below the fill to fall into.** Near black there isn't any, so reach for fill contrast instead.

### Global reset
`src/styling/App.css` applies `border-radius: 0 !important` globally — intentional. Anything that needs rounding must use `!important` (`.section-card`, `.sub-card`, `.coursework-block`, `.course-card`, `.contact-card`, `.gallery-frame`, `.nav`, `.scroll-top`, `.skill-icon-wrap`, `.project-wip`, `.tag`, `.pdf-close`, `.paper-expand-btn`). The list isn't exhaustive — grep for `border-radius` before assuming a class is missing one.

### Typography
**Google Sans Flex** from Google Fonts, weight axis requested as the range `300..800`.

**Exactly two places name a font**, both in `App.css`: the `@import` at the top of the file and the `font-family` on the `*` reset. Nothing else does, so swapping a typeface is a two-line change.

**It is the first VARIABLE font here**, which changes two things. The weight is a range rather than a list of six static cuts — one file. And it carries an **optical-size axis** (`opsz` 6–144), which is requested in the URL and then left to the browser's default `font-optical-sizing: auto`: the 0.6rem micro-labels get an instance drawn for small sizes and the 2.5rem page titles one drawn for display. No previous face here had one. The range stays `300..800` to match what the static imports declared, although only 400/500/600/700 are actually used.

**Glyph coverage was checked against every non-ASCII codepoint in `src/` before the swap**, and nothing falls through to a system fallback. The `latin` subset carries U+2212 (the cards' `−`), U+2191/U+2193 (the palette's arrow hints), the dashes, the curly quotes and U+00B7; `math` carries Greek and the relational operators; `symbols` carries the remaining arrows. Note there is **no `greek` subset** — Greek arrives via `math`. Re-run that audit for any future face, because a missing glyph is exactly how an emoji presentation sneaks back in (see *No emoji glyphs in copy*).

**Kian is trying faces out.** Inter, Plus Jakarta Sans and Roboto have all been in here; all three `@import` URLs are kept in a comment beside the current one, so going back is a one-line change. Three things those swaps taught, worth keeping:

- **Metrics differ, and several layout constants here are measured against rendered type** — the Experience meta column against "Laboratories", the Projects tag chips fitting two rows, the Projects dropdown's `min-width` against its longest `navLabel`, the four charts' mobile geometry. Re-measure those after any swap. (The nav used to be the worst of these, because its collapsed "KJ" monogram had a width tuned to one typeface. It docks instead of collapsing now, and nothing in the bar is measured against type any more — but the bar's own slack still is; see below.)
- **Weight is not portable either, and weight is the lever — not size.** Roboto's 700 read noticeably heavier than Plus Jakarta Sans's, and `.about-hero-name` and `.project-title` both had to drop a step under it. Google Sans Flex prompted the same move again, further: see *The headings separate by size, not weight* below.
- **A wider face spends margin you cannot see.** Google Sans Flex runs about 4% wider than Inter on lowercase text and ~9% on the tabular date strings.

#### What the Google Sans Flex swap actually broke, and what it only looked like

Two real breaks, both fixed, and three false alarms. The false alarms are the useful part: **A/B the old face in the page before changing a number**, by appending an Inter stylesheet and a `* { font-family: 'Inter' !important }` override to the loaded document and re-measuring. Half of what looks like a regression after a swap was already there.

Broke, and fixed:

- **The Experience date chip stopped fitting its column.** `.exp-date` went 155px → 173.2px and overhung the 170px meta column by 3.2px at the ≤1024 breakpoint, into the 28px gutter. The column is now **185px** there — see *Experience*.
- **The last x-tick on the mobile charts crossed the svg's edge.** `2024` is centred on the final data point, which sits on the plot's right edge, so half of it hangs into the right gutter; at `GEO.compact.right: 28` that half went 0.8px past the svg box on all four charts. It opened no page scroll, but "nothing paints outside its svg" is the standard the mobile geometry is held to. `right` is **32** now.

Looked broken, wasn't:

- **The Languages group wrapping to two rows at 1280.** It does — and it did under Inter too. The claim that seven tiles fit on one row holds at **≥1500px**, which is where it was measured. Verified 1 row under both faces at 1500/1700/1900, 2 rows under both at 1101/1280. (Re-measured after the tile came down to 64px and Frameworks grew to eight: **all three of the 7/8/7 groups** are 1 row at 1500/1800/1900 and 2 rows at 1101/1280. The shrink bought exactly enough for the wider group, so the ≥1500 rule is unchanged.)
- **Desktop chart end labels painting outside the svg.** Pre-existing, and *better* now: under Inter two charts overhung (+7.3px, +1.9px), under Google Sans Flex one does (+9.1px). The wide geometry has always let the end label run into its gutter; it adds no page scroll.
- **Two collision pairs per chart on desktop.** Already documented below as em-box leading, not ink. Unchanged.

One genuine cosmetic difference was left alone: at exactly 1280, Developer Tools (6 tiles) wraps to two rows where it fit on one under Inter, **missing by 0.7px**. Languages and Frameworks already wrap at that width, so three groups wrapping reads more consistently than two of three, and chasing 0.7px with the grid gap would not fix Languages anyway.

#### The headings separate by size, not weight

One pass, after the Google Sans Flex swap, took most of the site's headings down a step. The result is that **hierarchy here is carried by size and color, with weight nearly flat** — 500 for almost everything, 600 reserved for the two places that should be loudest.

| | was | now |
|---|---|---|
| `.about-hero-name` | 700 | **600** |
| `.paper-title` (a reading page's own title) | 700 | **500** |
| `.project-title` | 600 | **500** |
| `.exp-company` | 600 | **500** |
| `.exp-role` | 600 | **500** |
| `.exp-ta-course` (the CSE 310 / FSE 150 rows) | 600 | **500** |

Three consequences worth knowing before "fixing" any of them:

- **`.paper-title` is now lighter than its own `.paper-section-title`s**, which stayed at 1.1rem/600. That is a size-led hierarchy on purpose — the title outsizes them more than twice over (40px against 17.6px). If the two ever look inverted, `.paper-section-title` is the one to bring down, not the title back up.
- **`.exp-company` is now the same 0.95rem/500 as `.card-title`**, the section header above it. The company name and the word "Experience" match.
- **`.edu-institution` stayed at 1rem/600** and was not part of this pass, so Education's institution name is now heavier than Experience's company name. It was previously the reason `.exp-company` was 600 at all.

The lighter name also bought back layout budget: "Laboratories" went 95.8px at 600 to **93.1px** at 500, so the Experience meta column's tightest measurement has 19.9px of headroom rather than 2.2px.

Section card titles are 0.95rem / 500. Normal casing everywhere — no `text-transform: uppercase` on nav links or section headers. Small uppercase letterspaced labels are used only for micro-labels (project tags, skill names, link buttons).

### The page is capped, and that is what makes images scale on zoom-out

`--page-max` (**1800px**) and `--page-gutter` (36px, 16px at ≤768px) are declared on `.home` in `Home.css`. It was 1500 until a 2560px monitor made the site read as a narrow strip with 530px of dead page down each side; at 1800 that is 416px, the cards go 1428px → 1728px wide, and the project tiles 372px → 545px. Nothing needed retuning with it — all three rules read the token, and the docked bar's padding is a `max()` against it, so the bar's contents stay put above the cap by construction (verified: the name sits at x 62/62 at 1280 and 442/442 at 2560, floating and docked). **Three rules read them and all three centre the same way** — `.cards-wrapper`, `.nav` and `.home footer`. One number, so they cannot drift. A **side effect worth knowing**: at the wider cap the skill groups stop wrapping, because each column finally gets its full width.

**The cap exists for a reason that isn't obvious.** Uncapped, the layout was fluid all the way out, so the About gallery photo and the project thumbnails kept their apparent size on screen as the viewport grew — zoom out and the type shrank while the pictures didn't, because their containers widened in step with the zoom. Capped, the whole page scales together, which is what zooming out is supposed to do.

- **`.nav` is now centred, not pinned.** `left: 0; right: 0; margin: 0 auto` plus `width: calc(100% - gutter*2)` and `max-width: calc(var(--page-max) - gutter*2)`. With the old bare `left: 36px`, a binding `max-width` truncates the RIGHT edge instead of centring, and the bar would sit left of the cards on a wide screen. Verified flush to **0.0px on both edges** against the About card at 375, 1280 and 1900.
- **The docked bar's padding is a `max()`, and that is what keeps "the contents don't move" true above the cap.** Docked it is full-bleed, but floating its contents sit inside a *centred* box — so 62px from the screen's edge is only right below the cap. `max(62px, calc(50% - var(--page-max) / 2 + 62px))` is the cap's own left edge plus the same 62. **`50%`, not `100vw`**: a fixed element's percentage resolves against the initial containing block, which excludes the scrollbar, and `100vw` does not — that would misalign by the scrollbar's width. Below the cap the calc goes negative and `max()` returns the flat number, which is the old behaviour exactly. Measured: the name sits at x 62 / 62 at 1280 and x 260 / 260 at 1900, floating and docked.
- `max-width` joins `width` in the dock transition, so the bar grows smoothly past the cap rather than snapping.

### Card layout system

Sections live in `.cards-wrapper` in `Home.tsx`: vertical flex, `gap: 12px`, `padding: 0 var(--page-gutter) 44px` (no top padding — content sits directly under the floating nav), capped at `--page-max` and centred.

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


## No emoji glyphs in copy

iOS Safari renders codepoints that carry an *emoji presentation* as color emoji by default. **`↗` (U+2197) is the one that bit us** — the outbound-link arrows on "View Resume", the Projects links and the contact cards all showed up as blue emoji on iPhone.

- **`src/components/ArrowOut.tsx`** replaces every `↗`. Inline SVG, `stroke="currentColor"`, sized `1em × 1em` by the shared `.arrow-out` rule in `App.css`, so it tracks the label's font-size and color. Callers (`.resume-link`, `.project-link`) are `inline-flex` with `gap: 0.5em`; `.contact-card-arrow` just sets `font-size` + `color`, since the em sizing does the rest.
- The two remaining emoji-capable codepoints — `→` in the latency figure and `©` in the footer — are followed by **U+FE0E (VARIATION SELECTOR-15)**, which pins them to text presentation. Invisible, zero-width, no layout effect.
- `—` `–` `−` `·` `•` `─` have no emoji presentation and are safe as-is.

**Before adding any new symbol to visible copy**, check whether it is emoji-capable. If it is, draw it as inline SVG or append U+FE0E.

## Scrollbar

A floating pill, not a groove: no track, a 12px gutter with a 6px mark inside it. **The inset comes from a transparent border plus `background-clip: padding-box`**, which is the only way to pad a scrollbar thumb — it has no padding of its own. `border-radius` needs the usual `!important` to beat the global reset. Firefox gets `scrollbar-width: thin` + `scrollbar-color`, which is the whole API there.

**`data-theme` is now mirrored onto `<html>`**, by `index.html`'s pre-paint script and again by `useTheme` on every change. That is what makes this work at all: the page scrollbar is painted by the ROOT element, so a custom property it reads has to be defined there, and the tokens live on `[data-theme='…']`, which until now only matched the `.home`/`.paper` div. A useful side effect is that **every** theme token now resolves at the root. `color-scheme` on the root still matters — it is what themes the scrollbar on engines that ignore these rules.

`--scrollbar-thumb` is its own token rather than `--card-border`: that one is a hairline at `.1` alpha, which on a 6px pill is barely visible.

**On macOS, scrollbars are overlay by default** and only appear while scrolling, unless *Always show scrollbars* is set — so this shows up far more on Windows and Linux than on Kian's own machine.

## Responsive breakpoints

`768px` is the main one; the rest are local to a single grid that needed to break earlier or later than the others.

| Query | Where | What |
|---|---|---|
| **≤1100px** | Skills, Projects | Skill groups go from 2×2 back to stacked; project grid 3 columns → 2 |
| **≤1024px** | Experience, Education, About, Courses | Reduced padding; `.edu-main` → `auto 210px 1fr` becomes `auto 170px 1fr`; courses → 3 columns; Experience's meta column → **185px** (was 170 until Google Sans Flex). Projects left this breakpoint when it became a grid |
| **≤900px** | Paper pages, Navbar | The contents list is hidden — no room beside the text. The nav's palette chip goes too: the bar clips what it can't fit, and the fit there is tighter than it looks (see *Palette trigger* in `Nav.css`) |
| **≤768px** | everywhere | Single-column layouts, hamburger nav, **the About card drops its full-viewport `min-height` and the dot grid is not rendered at all**, gallery below bio, education logo on top, contact cards stack, courses → 2 columns, project grid → 1 column, survey explorer rows stack label-over-bar, the awards rail turns vertical and its steps loosen to 26px, **skill names hide and become tap-to-reveal (and the tiles become `<button>`s)**, **the palette input goes to 16px**, nav dock shortens to 0.36s, `--page-gutter` → 16 and `--paper-gutter` → 20, PDFs open in a new tab |
| **≤520px** | Courses only | `.course-card-num` watermark drops out |
| **≤480px** | About only | Further font/padding reductions |

There are **eight** `prefers-reduced-motion: reduce` CSS blocks (plus one JS check, in `DotGrid.tsx` — the dot field can't be suppressed from a stylesheet, since what has to stop is a rAF loop) — `Nav.css` 2 (the dock; the Projects caret's rotation), `Paper.css` 3 (the chart marker's `r`; the survey bar's `width`; the figure carousel's slide), and one each in `About.css` (the gallery slide), `Projects.css` (the card's hover lift) and `App.css` (the carousel dots' transition). `Nav.css`'s dock block cuts the travel to a 0.15s cross-fade (it used to also fade the hairline out — that line is gone, see *The docked bar has NO hairline*). `About.css` swaps the gallery's full-width slide for a fade. `Projects.css` drops the card's hover lift and keeps the tint.

Those three sit at the END of their files, so they win on source order. The `Paper.css` blocks and the caret's each sit directly beneath the rule they suppress, which is unambiguous because nothing later re-declares those transitions.
