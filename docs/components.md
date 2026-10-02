# Components

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## Navbar

**Floating glass bar**: `position: fixed; top: 12px; left: 36px`, `width: calc(100% - 72px)`, height 56px, `border-radius: 20px !important`, **no border**, `overflow: hidden`.

**It is flush with the section cards, and rounded to the same 20px.** Both read `--page-gutter` and `--page-max` (see *The page is capped* above), so the bar and the About card beneath it share both edges exactly at every width — verified 0.0px at 375, 1280 and 1900. They can no longer drift, because there is nothing to keep in step by hand. The radius matches `.section-card`, so the bar reads as part of the same stack rather than as a separate pill floating over it; it was `999px` before. **It animates to 0 when the bar docks**, since a rounded corner against the screen's edge reads as a mistake. The mobile menu panel is aligned and rounded to match (`left`/`right: 16px`, 20px).

`.home` has `padding-top: 80px` so content clears the pill by 12px, matching the section gap.

**The bar's three hover chips are 4px, not pills.** The links, the theme toggle and the hamburger all carried `border-radius: 999px`, which on a 27.5px chip renders as a ~13.75px corner; Kian asked for 10px less, which lands at 4. **They move together** — they are the same control at the same size in the same row, and a pill beside a rounded square on hover reads as an oversight. (The dropdown's rows are 6px, a hair softer, because they sit inside a 10px panel rather than on the open bar.)

Mobile (≤768px) swaps the links for a `Menu`/`Close` hamburger; the menu is a rounded glass panel directly under the bar, flush with its left and right edges and carrying the same 20px radius. It uses the **same material** — same fill, blur, saturation and rim — and carries no `border`, since a solid line on glass reads as drawn rather than lit. Its text stays legible because the 24px blur destroys whatever is underneath.

### The Projects dropdown

Hovering "Projects" drops a panel listing the projects, each linking straight to its `/projects/:slug` page. Clicking "Projects" itself still scrolls to the grid, as it always did. **The link carries a caret** (`CaretDown.tsx`) marking it as the one that expands.

**The panel is the bar's surface CONTINUING DOWNWARD, not an island floating under it.** Kian's call, after OpenAI's nav. It used to hang 10px below the pill as its own rounded box with a full rim and a four-sided shadow, which read as a second, separate thing. Three changes carry the join, and none of them works alone:

- **It is flush, and its top corners are SQUARE.** `padding-top` on `.nav-dropdown` went 10px → 0, so the panel starts exactly at the bar's bottom edge; measured, the gap is 0.00px in all four states. The bar's own corners are 20px, but the Projects link sits nowhere near one and a pill's bottom edge is straight everywhere in between, so a square-topped box hung off it merges into it. The bottom corners stay rounded at **8px**, because that edge really is an edge — and the old reason for that radius (look deliberately smaller than the 20px pill, so as not to read as a second pill) is gone, leaving only the rule that a container's corner stays looser than its contents' 6px rows.
- **There is no rim.** `--nav-rim`'s bright `inset 0 1px 0` is a specular highlight along a *top edge*, and the panel no longer has one to light. Drawn anyway, it was a bright line straight across the seam.
- **The shadow is `--nav-drop-shadow`, which casts only downward.** `--nav-shadow`'s second `0 1px 3px` component rings all four sides and the top of that ring landed on the join.

**And `.nav-dropdown`'s `z-index` went 99 → 101, ABOVE the bar's 100.** This is the non-obvious one: the bar casts its shadow downward onto whatever is beneath it, so underneath it the panel's top edge was painted over and the two read as two surfaces with a dark seam between them. They do not overlap — the panel begins exactly where the bar ends — so nothing is hidden by raising it.

Verified in all four states (floating/docked × light/dark): `gapToBar` 0.00px, panel fill identical to the bar's fill, top corners square, `z-index` 101 over 100.

**The caret is driven by the panel's OWN state, not by `:hover`.** `.nav-menu-open .nav-caret` rotates 180° and comes up from `--muted` to `--textcolor`. It has to be state-driven because the pointer *leaves the link* the moment it moves down onto the panel — a `:hover` flip would snap the caret back down while the menu it describes was still open. It is inline SVG at 1em on the shared 14-unit/1.3-stroke geometry, and not a typed character, for the usual reason: the arrow codepoints carry an emoji presentation. Under `prefers-reduced-motion` the rotation is dropped and only the color change remains — the direction still reads, because it is a flip and not a journey.

**The panel is a SIBLING of `<nav>`, not a child of the link, and it has to be.** `.nav` carries `overflow: hidden` — it clips the name and links as the pill resizes — so anything inside it that hangs below it is cut off. `position: fixed` does **not** escape that either: the pill's own `backdrop-filter` makes it the containing block for fixed descendants. There is no arrangement that keeps the panel inside the bar. `.mobile-menu` already worked this way, so the pattern was there.

`left` is set inline from the link's measured `getBoundingClientRect().left`; everything else is in `Nav.css`.

**It is a pointer affordance, and deliberately not a menu widget.** Sitting outside the bar, the panel can't be reached by `:focus-within` and isn't in the link's tab order, so it carries **no `aria-haspopup` / `aria-expanded`** — announcing a popup a keyboard user can't open would be a lie. Building a real menu (roving focus, arrow keys, Escape) would be the alternative, and it isn't worth it here because **nothing is only reachable this way**: the Projects grid is six links to the same six pages, and the nav's own Projects link goes there. Same rule as the chart tooltip — it enhances and never gates.

- **There is no dead gap to fall through — and now there is no gap at all.** `.nav-dropdown` used to carry a `padding-top: 10px` as a transparent bridge across the space between bar and panel. The panel is flush now, so there is nothing to bridge: the pointer's only journey is across the bar's own bottom padding (~14px below the link), which the 120ms close delay covers.
- **Both coordinates are measured, not hard-coded.** `left` comes from the Projects link's rect and `top` from the nav's own `getBoundingClientRect().bottom`, because **the bar sits at two heights**: 68px floating (12 + 56) and 56px docked. A literal would be right in one state and 12px wrong in the other.
- **It closes whenever the bar docks or undocks, and on resize.** The bar moves out from under it either way, and a resize would leave it pointing at a link that has moved.
- **Hidden at ≤768px**, where there is no pointer to hover with and the hamburger menu already carries a plain Projects link.
- **Same material as the bar, and there is no longer a second state to match.** The bar keeps its glass when it docks, so the panel does too — by simply not being overridden, which is the point of it taking the bar's material rather than declaring its own. The `.nav-docked ~ .nav-dropdown .nav-dropdown-panel` rule that flattened it is **gone**; a general sibling selector was the only way to reach it, since the panel is a sibling of `<nav>` rather than a child. It keeps `--nav-shadow` where the docked bar gives its up: the bar is pinned to the screen's edge and isn't floating over anything any more, but the panel still is, and a solid menu with no shadow reads as a hole punched in the page. The items take the nav links' own type and `--hover-tint` throughout.
  - The panel's fill is declared as `background-color`, not the `background` shorthand, for the same reason the bar's is — a shorthand can't be transitioned, and both are animating between two materials.

**`works` moved to `src/content/projects.ts`** when this was added, because the grid and the nav both need it and a second list would drift. `navLabel` is an optional SHORT name for the menu row: the card titles run to 71 characters and would wrap to three lines in a 242px panel. Four of the six carry one, and it falls back to `title`. That makes three lengths the same project is written at — the page's full title, the card's shortened one, and this — which is a real maintenance cost and the reason `navLabel` is optional rather than required.

**The panel's rows are 400 where the bar's links are 500** — a menu of destinations is a list you scan, not more things that look as clickable as the nav itself. Their 6px radius stays inside the panel's own 8px, since an inner corner rounder than its container's reads as a mistake.

Measured at 1280: the panel is 244px wide, and every label fits on one line.

### The glass is four things at once

`background: var(--nav-glass)` + `backdrop-filter: blur(24px) saturate(180%)` + `box-shadow: var(--nav-rim), var(--nav-shadow)`. **Tune them together — each one alone fails.**

- **Alpha must stay low** (`.50`). This is the whole effect: at `.80`+ the pill is an opaque slab and nothing reads through it.
- **The fill compensates for the alpha.** It still has to composite to ~`#e2e5ec` over the white page, or the pill dissolves against `--page-base` (`#fff`) and `--card-bg` (`#f7f7f7`). So as alpha drops, the fill gets *darker*, not lighter. Solve `a·F + (1−a)·255 = target` when changing either. Raising the alpha to fix visibility is the mistake that killed the glass the first time.
- **Blur stays at 24px.** 40px averages whatever is behind into one flat tone and you lose the light/dark structure that tells you anything is back there.
- **Saturation is 180%.** Blur alone leaves a grey slab; the boost puts the color back. (This *was* held at 105% when the fill was near-opaque, where saturation only tinted the bar. At `.50` it's what makes the material read as glass.)
- **`--nav-rim` IS NOW ZERO IN BOTH THEMES.** It was a bright top inset plus a fainter full ring, standing in for a specular highlight, and it carried the pill's edge over photos where the drop shadow is lost. Kian cut it: on a 56px bar that ring read as a drawn border, most obviously in dark against the pure-black page. The token survives at zero alpha because `box-shadow` does not interpolate to `none` and the dock animates it. The mobile menu panel shares it and goes bare with the bar, deliberately — it hangs off the bar's bottom edge and reads as part of it. `--nav-shadow` stays two-part: a soft cast for float, a tight `0 1px 3px` for the edge on flat backgrounds.
  - **The command palette does NOT follow, and that split cost a regression to find.** All three surfaces shared one token, so cutting the bar's border silently cut the palette's — and the palette is a modal floating over whatever the page happens to show, including the About gallery's photograph. Without a rim it washed out into its own backdrop with nothing drawing its edge. It reads **`--glass-rim`** now, which holds the original values. The lesson is the one this file keeps relearning from the other direction: a shared token is right when the two surfaces must not drift, and wrong when they are actually different things — chrome pinned to the page edge versus a panel floating over content.

Contrast holds over the photo: at `.50` over the darkest part of the gallery image the composite is ~`#808486`, ~4.9:1 against the near-black nav text.

### Docks to the top of the screen once the About card has scrolled past

`.nav-docked` attaches the bar to the top edge of the viewport and grows it to full width. **It keeps the glass** — docking is a pure GEOMETRY change (top, width, max-width, radius, padding) and the material is untouched. The scroll handler only reads `scrollY`; the threshold is remeasured on `resize` **and** via a `ResizeObserver` on `body`, because expanding a section changes the document without firing a resize.

**The trigger is the About card's bottom edge, less the bar's own 68px footprint (top 12 + height 56)**, so the bar docks exactly as the card goes under it. It was "past 50% of the page", which had two problems. The halfway point **moved every time a section was expanded or collapsed**, so the same scroll position docked or didn't depending on what the reader had open — a threshold that depends on unrelated state. And on a long page it left the bar floating well past the point where it had stopped being a header: measured at 1280, the old rule fired at y 1390 and the new one at y 553, 2.5x earlier.

**About is the right anchor precisely because it never collapses** (`card-header-static`), so its height is fixed and the threshold is stable no matter what is opened below it. Measured: not docked at y 0 or 533, docked at 573 and beyond. It never docks while the mobile menu is open — that panel hangs from the bar's floating position, and docking would move the bar out from under it.

**This replaces a collapse to a 60px "KJ" monogram.** That version shrank the pill toward the left edge and crossfaded the full name to a mark. `.name-mark`, `.name-full`, `.nav-collapsed`, the monogram's tuned 60px/22px pair and both `linear()` easing curves are **gone with it** — don't look for them, and don't reinstate the monogram without reading *Two easing curves* in the git history first, because its geometry was load-bearing.

- **Nothing is hidden any more.** The old collapse clipped the links and the hamburger away (they kept their layout width, so they needed an explicit `pointer-events: none`). Docked, all six links, the theme toggle and the hamburger stay visible and clickable. **That closes the known gap this section used to log** — on mobile the hamburger was clipped past the halfway mark, so the menu was unreachable for the bottom half of the page.
- **The chrome expands to the screen; the contents do NOT move.** Floating, the name starts at 36 (the `.cards-wrapper` gutter) + 26 (the pill's padding) = 62px. Docked, the bar is at `left: 0` and the padding is 62px — the same number. The right side works the same way: 36 + 14 = 50. Mobile is 16 + 18 = 34 and 16 + 8 = 24. **Both halves of each sum have to move together**, so changing `.cards-wrapper`'s gutter or the pill's padding means retuning the docked padding too, or the name visibly slides sideways on the way up.
- **`.nav` is still sized with `width`, not `right`** — the dock animates width from `calc(100% - 72px)` to `100%`, and `left` + `width` + `right` is over-constrained (`right` gets dropped and the bar sits off-centre). The mobile query must override `width` too, for the same reason.
- **The mobile `.nav-docked` restates `top`, `left`, `width` and `padding`.** Same specificity as the `.nav` rule in that query, so on source order alone the mobile inset would win and the bar would never reach the screen's edges on a phone. (This is the same trap the old `.nav-collapsed` had, and the reason it is called out twice.)

#### The docked bar has NO hairline, and the one it had is gone for good

There used to be a `.nav::after` here: a 1px `--card-border` rule pinned to the bar's bottom edge at `transform: scaleX(0)`, scaling to `scaleX(1)` as the bar docked, delayed 0.12s so it drew out from the centre *after* the bar had travelled — and retracting first on the way back, so the pair had a direction.

**Kian cut it.** On the solid docked bar it read as a stray grey line across the top of the page rather than as a divider: the bar already separates itself from the content by being opaque and flush to the screen's edge, so the rule was drawing a boundary that was there anyway.

Gone with it: `.nav-docked::after`, the mobile duration match (0.36s) and the reduced-motion fade. **Don't reinstate a line without reading this first** — the draw-out was tuned against the dock's own 0.45s curve, and the delay asymmetry was the whole point of it. A plain `border-bottom` is not the same thing and can't be drawn from the middle outward.

#### One curve, and deliberately no overshoot

`--ease-dock` is `cubic-bezier(0.32, 0.72, 0, 1)` — fast out, long settle, no overshoot. The old pair of sampled damped oscillations existed because the collapse travelled ~1148px down to a 60px pill, where the hard question was settling without crossing zero.

**The dock's geometry inverts that problem.** Its travel is 72px of *growth* to exactly `100%` width, so an overshoot of even 1% would put the bar ~13px past the viewport and open a horizontal scrollbar — the exact failure the responsive checks in this file keep looking for. A spring is the wrong instrument for a value whose destination is the edge of the screen. Verified through a full dock: width tops out at the client width exactly, `scrollWidth === clientWidth` throughout.

**The glass used to dissolve alongside, and no longer does.** `backdrop-filter` animated to `blur(0px) saturate(100%)` (rather than `none`, which is not interpolable) and the fill went to `--nav-solid`, with the rim and float going to `--nav-rim-off` / `--nav-shadow-off` — zero-alpha structural twins, because `box-shadow` does not interpolate to `none` either.

Kian's call to keep the glass docked. The old reasoning was that a bar pinned to the screen's edge is not floating over anything any more, so a material implying depth is a lie — but it **is** still over the page, with content scrolling under it, which is exactly what the blur is for.

**Three tokens died with it**: `--nav-solid`, `--nav-rim-off` and `--nav-shadow-off`, which had no other consumers. They are named in a comment at their old site in `App.css` so a search lands somewhere. `.nav`'s transition still lists `background-color`, `box-shadow` and `backdrop-filter`, and those legs are **not** dead — `--nav-glass` and `--nav-shadow` differ per theme, so they are what make a theme toggle fade rather than snap.

#### Mobile
The dock runs on mobile too, at a shorter **0.36s** (desktop is 0.45s), with the line's transition matched to the same duration so the two don't desync.

Duration is the only performance lever that doesn't change how the bar looks. `width` is a layout property and the bar carries a `backdrop-filter`, so every frame re-rasterises a blur over a changing area — fewer frames, less work. It is not a *new* class of cost: a fixed blurred element over scrolling content already re-blurs on every scroll frame. The dock is in fact cheaper than the collapse was, because the blur radius is on its way to 0 the whole time — the back half of the animation is progressively less work. If a real device still janks, the next lever is dropping the mobile blur radius (24px → ~16px), which trades away some of the glass in the floating state.

**Why not `clip-path` instead of `width`,** which would avoid layout entirely: `clip-path` clips the element's drop shadow, so the pill loses `--nav-shadow` and stops floating. Moving the shadow to a parent as `filter: drop-shadow()` doesn't rescue it either — a `filter` on an ancestor creates a new backdrop root, which kills `backdrop-filter` on the child and takes the glass with it.

## Command palette and site search

`⌘K` / `Ctrl K`, a bare `/`, the magnifier chip at the right end of the nav bar, the one in a paper page's top bar, or the `Search` row in the mobile menu. `CommandPalette.tsx` is mounted once in `App.tsx`, outside the routes, so it works on every page.

**Nothing in the index is a second copy of any content.** It is BUILT from the modules the pages already render — `works`, `courseGroups`, `skillGroups`, the `papers` registry and `renderedSections()` — so a project, a course or a paragraph cannot be searchable and absent, or present and unsearchable. That invariant is the entire reason `content/paper-view.ts` exists; see *The render layer is shared with the search index* under Paper pages.

It indexes 7 sections, the projects, 16 courses, 27 skills, every section heading and subheading, and the full prose of every paper in the registry (see *One project is hidden* under Projects — the counts here are written for the full set). Verified: **all 47 linkable hashes across all six papers resolve to a real element** on the rendered page.

- **Built LAZILY, on the first search, then held.** Walking ~120KB of paper text costs a couple of milliseconds — nothing on a keystroke, and worth not paying on first paint.
- **Scoring is substring, not fuzzy subsequence.** On an index this size a subsequence matcher finds a path through almost every long paragraph and the results stop meaning anything. A hit at a word boundary beats one inside a word, an early hit beats a late one, and **every term must land somewhere** or a two-word query matches anything containing either half.
- **Navigation outranks prose** at equal match quality (`KIND_WEIGHT`), so typing "projects" gives the section, not the six paragraphs that mention it. **An exact title match outranks a prefix**: without that bonus `r` put the heading "References" above the skill R, and `git` put GitHub above Git — both match a word boundary at position 0 and the kind weight broke the tie the wrong way.
- **No one paper may take more than 3 prose rows**, or a query the thesis happens to use a lot fills the list with one document. 12 results total.
- **The highlighted row INVERTS** — `--textcolor` fill, `--bgcolor` ink, 21:1 in both themes — rather than taking a tint. Same call, for the same reason, as the survey explorer's selected chip: it has to be unmistakable against a dozen neighbours, and `--hover-tint` is 0.022 alpha in dark, held down deliberately for the pure-black page. Pointer and keyboard drive the same state, so there is no second hover style to keep in step.
- The panel takes the **nav bar's material** (`--nav-glass`, blur 24 + saturate 180%, rim and shadow) at the bar's own 20px corner. It renders outside `.home`/`.paper`, so it reads its tokens off `<html>` — which is only possible because `useTheme` mirrors `data-theme` there for the scrollbar. Verified resolving in both themes.
- **Arrow keys move a highlight, not focus** (`aria-activedescendant`), so the input keeps taking keystrokes. A live region announces the result count.
- **Results run in a `requestAnimationFrame` after the palette closes.** `useModalChrome` restores the body's scrolling in a *passive* effect cleanup, which runs after the click handler returns; scrolling before that fights a locked page.
- **A jump to a section of the page you are already on does not push a history entry** — it scrolls. Cross-page, it navigates with the section id in `location.state`, which `Home` reads in a layout effect declared *after* `useScrollRestore` (that hook scrolls a new entry to the top in a layout effect of its own, and effects run in hook-call order). Re-applied on `document.fonts.ready`, the same trap `useScrollRestore` documents.
- **`openPalette` and `shortcutLabel` live in `openPalette.ts`, not in the component.** A module exporting both a React component and plain functions can't be Fast Refreshed — Vite invalidates it on every edit and says so in the console. The trigger is an event rather than a context because there is one thing to say and no state to hold.
- **It reads `data-past-about` on `<nav>`, NOT the `.nav-docked` class, and that is a bug fix rather than a preference.** On a phone the palette is opened from the mobile menu's `Search` row, which calls `close()` and `openPalette()` in the same click — and an open menu forces the bar **undocked** (`docked = pastAbout && !menuOpen`, because the menu panel hangs from the bar's floating position). Both state updates batch into one render, so this initialiser ran while `.nav-docked` was still absent: **the palette took the glass and then sat over a bar that re-docked flat behind it.** That is exactly the symptom — "the search bar is in the liquid glass even when scrolled down on mobile". `data-past-about` tracks the scroll position alone and ignores the menu. Verified at 375px in both themes: scrolled, `nav-docked` is absent while the menu is open but the attribute stays `"true"`, and the palette opens solid over a re-docked bar; at the top it correctly takes the glass.
- **`.palette-input` is `font-size: 16px` at ≤768px, and 16 is a threshold rather than a taste.** iOS Safari zooms the whole page in when a focused input's text is under 16px, and does not zoom back out on blur — which is the other half of "it comes slightly zoomed in". This is the site's only `<input>` and the palette focuses it the instant it opens, so every search left the page enlarged. **`text-size-adjust: 100%` does not cover this** (that governs Safari's inflation of wide text blocks, a different behaviour with a different trigger) and neither does the viewport meta, which is already correct. The fix is **not** `maximum-scale`, which would take away the reader's own pinch-zoom. 0.95rem is 15.2px, so this is a 0.8px step nobody will notice.
- **The panel declares its own `color`, and that is not redundant.** Every other surface sits inside `.home` or `.paper`, which set `color`; the palette renders outside both, so without `.palette { color: var(--textcolor) }` its text falls back to the UA default — governed by `color-scheme` on `<html>`, not by any token here. That is how a stale `color-scheme` was able to invert the rows after a theme switch; the root cause is fixed in `useTheme` (see `design-system.md`), and this makes the panel independent of it either way.
- **The panel is ALWAYS glass** — on every page, at any scroll position. It used to take the bar's material in both of the bar's states and to go flat `--nav-solid` on a reading page, which has no bar at all. Kian dropped the flat variant everywhere, including on the bar itself, so there is nothing left to match and no state to read.
  - **What went with it is worth knowing before anyone reintroduces a flat state**: a `solid` flag read once on open, which had to read the nav's `data-past-about` attribute rather than its `.nav-docked` class. On a phone the palette opens from the mobile menu's `Search` row, which closes the menu and opens the palette in one click — and an open menu forces the bar **undocked**, because its panel hangs from the floating position. Both updates batch into one render, so an initialiser reading the class saw it still absent, took the glass, and then sat over a bar that re-docked flat behind it. That was the "the search bar is in the liquid glass even when scrolled down on mobile" bug. The attribute tracks scroll alone and ignores the menu.
  - It reads **`--glass-rim`**, not `--nav-rim` — the bar dropped its rim and the palette must not follow, since it floats over arbitrary content where the drop shadow is invisible.
- **The `<mark>` on a match is picked out by INK STRENGTH, not by a fill** — full `--textcolor` where the text around it is `--muted`. It was `color: inherit` plus weight, and that was a bug: inside a snippet the mark inherited `--muted`, came out the same color as its surroundings, and read as an arbitrary bold word rather than as the thing that matched. Weight alone will not carry a highlight.
  - That is also why the inverted row's secondary text is a `color-mix` toward the fill and **not `opacity`**. Opacity applies to the whole subtree, so a `<mark>` inside a dimmed snippet could never come back to full strength. Measured 7.85:1 light and 6.2:1 dark for the dimmed text against the inverted fill.
- **The nav chip is icon-only and hidden ≤900px.** See *Palette trigger* in `Nav.css` — the bar clips what it can't fit, and the measured fit is much tighter than it looks.

**Two known limits, both deliberate.** A course result scrolls to Education without opening the coursework block — revealing it needs a channel through three components and isn't worth it for 16 entries, so the subtitle names the list instead. And **About's and Experience's prose isn't indexed**, because it lives in JSX rather than in `content/`; the Experience section entry carries the three employer names as a hand-written `body` so "Sandia" finds it, flagged in `search.ts` as something to delete when that data moves.

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

**Santa Cruz Rental Price Model's tags used to go past its copy, and one of them was simply WRONG.** They read `LightGBM` and `Ridge Regression`, and this file defended that as deliberate — "the model actually trained and the baseline tried before it". Kian corrected it: **Ridge was an intermediate step that never reached the final model, and the baseline was medians, not Ridge.** The tag is now `Linear Regression`, and the page's meta line went from `LightGBM, with a Ridge baseline` to `LightGBM over a linear market trend`.

**The real architecture is two models, and the page now says so**: a LightGBM model predicts how far above or below the market a given unit sits — its premium or discount as a percentage — and a **linear regression predicts where the market itself is**, which is what lets the app quote a year beyond its training data. That second half was missing from every description of this project.

**This is the same trap the wage-effects page documents, and it bit harder here.** There the stale summaries at least pointed at a page that was right; here the error was in the page, the card's tags *and* in this file's own justification for them — so a future session checking "is that tag correct?" would have found a paragraph saying yes. **A confident note in CLAUDE.md is not evidence.** When a claim is about what a project actually does, the repo is not the source of truth; Kian is.

Its first draft carried `JavaScript` and `RentCast API` from the copy's own wording; those came off because **the tags credit what Kian built, not what the project contains** — the pipeline and the client-side app were largely Claude's, and the modelling was his. That distinction is worth keeping in mind for any future entry: the tag row is an attribution, not an inventory.

### Experience
Three cards: Sandia, ASU Junior Researcher and ASU Undergraduate Teaching Assistant.

**The company name and the role are both 0.95rem / 500**, matching `.project-title`'s weight and `.card-title` exactly. They were 600, raised from body weight to match `.edu-institution`; that pairing was dropped in the weight pass (see *The headings separate by size, not weight*) because a card carrying a name AND a role stacked in a 185px column reads as two competing headings at 600. **The hierarchy inside a card is color, not weight**: role and company at 500 `--textcolor`, location and dates at 400 `--muted`. The TA course rows (`.exp-ta-course`) moved to 500 with them.

**Wording:** the **bullets follow Kian's resume** (`~/Library/CloudStorage/Dropbox/resume.pdf`), lightly adapted into sentences. The **paragraphs above them are hand-written**, so keep edits to them minimal and never smooth them into generic resume-speak.

**The paragraph is context, not a second copy of the bullets.** Both descriptions were cut roughly in half (Sandia 76 words in four sentences to 52 in two; the researcher role 50 to 34) because they restated the bullets almost claim for claim — the same tool, the same plugin, the same scraper, the same OCR — which is most of what made the section feel wordy. What survives is what the resume bullets *don't* carry: the feedstock gloss, the user-facing framing, the mentor, the supervising professor. The paragraph is also the collapsed preview's two lines, so it still has to open with what he built. No buzzwords, and no outcome claims the resume doesn't make. (To read the PDF here: `pdftotext` is installed — `pdftotext -layout` is the quickest way in. Python PDF libraries are not; macOS PDFKit via `osascript -l JavaScript` also works.) The two ASU roles used to share one card with a timeline. They were split so each role collapses on its own. Cards use a `200px 1fr` grid (**185px** at ≤1024px, stacked at ≤768px). This **used to be paired with the Projects rows**, which carried the same grid so the two sections lined up down the page; Projects is a thumbnail grid now and has no left column, so the width is Experience's own to change. The TA card has no summary paragraph, so its preview is the first course row. **CSE 310 is deliberately first**, ahead of the earlier FSE 150. It's the role that matters most to employers, so it's the one visible while the card is collapsed.

**The TA course rows carry NO dates.** Each used to print its own term (`Jan – May 2024`, `Aug – Dec 2023`) opposite the course name, which is why `.exp-ta-meta` existed as a `space-between` row — that wrapper and `.exp-ta-date` are both gone, and the course name is now a direct child of `.exp-ta-row`. The card's own `.exp-date` chip already says `Aug 2023 – May 2024`, and the two terms inside that span were a second, finer date scale that no reader needed. If dates come back, the chip is the thing to question first, not the rows.

**The meta column is two rows: icon and name side by side, then the date chip underneath.** `.exp-meta` is a flex *column*; `.exp-meta-head` is the row inside it, holding a 60px `.exp-logo` tile (`border-radius: 15px !important`, logo inset 6px, `object-fit: contain`) beside `.exp-company`. **Radius scales with the tile at 0.25** — keep 60/15 in step. It's decorative (`alt=""`) — the company name is right next to it. `.exp-meta-head` needs `min-width: 0` or the flex item refuses to shrink below its longest word and pushes the tile out of the column.

**The inset is 10% of the tile, not a sixth.** It was 9px on 56px, which left a 38px mark in a 56px tile and read as stranded — worst on the circular ASU seal, since `object-fit: contain` on a circle wastes the tile's corners and reads smaller still than a square glyph in the same box. 6px on 60px is an app-icon proportion and puts the mark at 48px, 26% bigger. **60px is the ceiling, and the constraint is the name beside it, not the tile**: at the 1024px breakpoint the column is **185px**, so the name gets `185 − 60 − 12 = 113px` against "Laboratories" at 95.8px. Measure that word before growing it again.

**That column was 170px until the Google Sans Flex swap, and both of its budgets had run out at once.** The date chip went 155px → 173.2px and no longer fit the column at all, overhanging it by 3.2px into the 28px gutter; "Laboratories" went 92.1px → 95.8px against the 98px the name got there, leaving 2.2px. The old reason the column couldn't grow — that the Projects rows carried the same grid and had to line up down the page — went away when Projects became a thumbnail grid, so 185 was available. It buys 17.2px of headroom on the name and 11.8px on the chip, which is margin a future face can survive.

**There is no location line.** It was the least useful thing in the column — the resume carries it, and nobody reads a portfolio to learn a former employer's city. Dropping it left the column with a name and a date, which is what made a chip worth the space.

**The date is an outlined pill, and every attribute of it is the inverse of `.tag` on purpose.** `.exp-date` is `background: none` + a 1px `--card-border` rim + `border-radius: 999px !important`, against the tags' filled `--well-bg`, no border and boxy 6px. It carries a **calendar glyph** (`CalendarIcon.tsx`), which is why it's `inline-flex` with a 6px gap, and `font-variant-numeric: tabular-nums` lines the three cards' dates up with each other down the column.

It first shipped as a *copy* of the tag treatment — same fill, same boxy radius, same 0.7rem/500 — and that was the mistake: the date and the tech chips looked like two instances of one component that happened to sit at opposite corners of the card, and the calendar glyph alone wasn't enough to separate them. **Three attributes now differ at once (fill, rim, shape), which is what makes the two families read as deliberate rather than as an inconsistency. Don't half-revert one of them.**

The rim uses `--card-border`, the internal-divider token. That's a mild extension of *No card borders* — that rule governs cards, which carry shadows instead, and this is a chip. The text stays at full `--textcolor`: a quiet container around confident type, not a muted caption. The `*` reset sets `border: 0` without `!important`, so a class rule wins on specificity alone; only `border-radius` needs the `!important`.

Measured under Google Sans Flex: the pill is 173.2px, inside the 185px column at the 1024px breakpoint with 11.8px to spare, and 25px tall. All three cards' meta columns are exactly as tall as their content (117/117, 117/117, 115/115 at 1280; 322/322, 253/253, 321/321 at 1024 with every card expanded).

**`CalendarIcon.tsx` is inline SVG, not a file in `public/svgs/`** — same reason as `LinkIcon.tsx`: it sits on a chip whose text is `--textcolor` and has to take its color from it, which an `<img>` can't. It's stroked at 1.3 on a 14-unit viewBox, matching `ArrowOut`'s weight so the two read as one icon set, and sized `1em` by `.cal-icon` in `App.css` (beside `.arrow-out`, which works the same way) so it tracks its label instead of carrying a px size per caller. **It has no day dots inside the body**: the chip renders it at 11.2px, where a grid of 1px dots is mush. The header rule alone reads as a calendar. **It sits on its own row, and that's what fixed the wrap this section used to log as a known trade.** Beside the tile it had 132px on desktop and 102px in the 769-1024px band against the 117px `May 2023 – Aug 2024` needs, so that string broke onto two lines at every tablet width. On its own row it gets the column's full 200px (170px at the breakpoint); measured at both, the chip is 132px on one line with 38px to spare.

The tile used to sit *above* the name. Moving it beside the text is what finally removed the height overhang this section used to log as a known trade: measured at 1280px, all three cards have `.exp-meta` exactly as tall as `.exp-content` (117/117, 117/117, 115/115), so every card is content-driven. Growing the tile from 48px to 56px cost nothing there — same heights, same line counts.

**The whole constraint is the name's width**, which is whatever the tile and the 12px gap leave: 128px of the 200px column, and 113px at the 1024px breakpoint. Measured against the 0.95rem/500 name in Google Sans Flex, the longest unbreakable word is "Laboratories" at 93.1px, so there is 19.9px of headroom at the tightest size. **That number is the budget — check it before growing the tile again.** The date no longer competes for it (see above). The old reason not to widen the column past 170px — that Projects' left column had to match it — is gone with that layout, so the only constraint left is this one.

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
Course data (`cseCourses`, `ecnCourses`) lives in **`src/content/courses.ts`**, not in this component — the course grid and the command palette's index both read it, and two copies of sixteen course codes would drift. A local `<Coursework>` component renders one collapsible block per degree, **both closed by default**, toggling independently. The header shows the degree name with a muted `Coursework · N courses` subtitle beneath.

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

27 skills in **`src/content/skills.ts`** (moved out of `Proficiency.tsx` for the reason the courses were — the grid and the search index both read the list), in **four labelled groups**: Languages (7), Frameworks & Libraries (8), Developer Tools (7), Data & Research (5). Each group is its own `.skill-group` — a `.skill-group-label` above a `.skills-grid` flex-wrap of `.skill-item`; each icon sits in a **64px** `.skill-icon-wrap` (`border-radius: 16px !important`, sub-card gradient + shadow), with a 34px glyph inside it.

**The tile went 72px → 64px (56px on mobile), and the glyph with it at the same ratio** — 38/72 and 34/64 are both ~0.53, so the icons keep their proportion inside the tile rather than growing relative to it. The 16px radius is unchanged and needs no note: at 0.25 of the tile it would be 16 at either size. The section carries twenty-seven tiles now and was the loudest block on the page; a step down quiets it without touching the type scale.

**The groups have to be render structure, not just array order.** This was previously one flat array ordered languages → frameworks → tools with blank lines between the runs. `.skills-grid` is `flex-wrap`, so rows reflowed straight across those boundaries and the ordering was invisible — all the maintenance cost, none of the benefit.

**Data & Research is deliberately not folded into Developer Tools.** Stata, QGIS, Qualtrics, MATLAB and JupyterHub are the tooling behind the econometrics and the thesis, and they are the clearest evidence in the site that the Economics degree is a second credential rather than a line item. Filing them under "Developer Tools" both mislabels them (Qualtrics is a survey platform) and buries the point. It also keeps the buckets from collapsing into one — 7/8/7/5 instead of 7/8/12.

`skillGroups` is **explicitly annotated** `{ label: string; skills: Skill[] }[]`. Without the annotation each group's array gets its own narrow element type and `s.invertDark` errors in the groups that have no inverted icon.

### Group labels reuse the skill-name micro-label
`.skill-group-label` is the same 0.65rem uppercase letterspaced type as `.skill-name` — **no new step in the type scale**. The hierarchy is carried by weight and color alone: labels are 600/`--textcolor`, the names under the tiles stay 500/`--muted`. Enlarging the label is what would make this section noisy.

Spacing has to keep a group break louder than a row wrap: `.skills-wrapper` row gap `34px` (28 mobile) against `.skills-grid`'s `24px` row gap (20 mobile), plus the label and its `16px` (14 mobile) offset. Narrow the wrapper gap toward the grid's and the groups stop reading as groups.

### 2×2 above 1100px
`.skills-wrapper` is a grid, `auto auto`. Source order gives Languages | Frameworks & Libraries on top and Developer Tools | Data & Research below. Stacked, the section was twice as tall as it needed to be and left most of the card empty on the right.
- Columns are **`auto`**, so each is only as wide as its longest row of tiles. `justify-content: start` keeps the pair left-aligned rather than spread across the card.
- The **64px column gap** is what separates two groups sitting side by side. It has to stay well clear of `.skills-grid`'s **20px** tile gap, which was cut from 36px so seven Languages tiles fit on one row inside half the card. The binding case is now the **eight**-tile Frameworks group, which fits on one row from 1500px up only because the tile came down to 64px.
- **≤1100px** stacks the groups again, because the two top-row groups no longer fit side by side on one line each.

**"Seven Languages tiles on one row" is true from about 1500px of viewport up, not at every width.** Below that the two columns share whatever the viewport gives them, and at 1101–1280 the seven-tile groups wrap to two rows — under Inter as well as under Google Sans Flex, verified by A/B. Don't treat that wrap as a regression; the thing to check after a font swap is the wide case.

- Icons are `<img src="/svgs/name.svg">` from `public/svgs/` — **not** Vite imports.
- Most are **simple-icons** glyphs with the brand hex added as a `fill` attribute on the `<svg>` tag (matching how `react.svg` was already built).
- **Skills without an SVG fall back to an `abbr` monogram.** Nothing uses it right now; the mechanism stays for the next skill that has no glyph. To promote one: drop the file in `public/svgs/` and swap `abbr` for `src`.
- **Two icons in the live set are not simple-icons': MATLAB and LightGBM**, which has no glyph there (both 404). `matlab.svg` is **devicon's** (MIT) — the real membrane mark, and the only gradient-carrying icon in the set. Its gradients use `id`s, which is safe only because these load through `<img src>`, where ids stay scoped to the file. Inline it and they'd collide.
- **Matplotlib is built and COMMENTED OUT.** `matplotlib.svg` is on disk (devicon's polar-histogram mark, square, taken exactly as supplied) and its entry sits commented in `skills.ts` — uncomment the one line to restore it. The file is the second unreferenced svg in `public/svgs/`, alongside the one PySpark left behind.
- **scikit-learn is an ordinary simple-icons glyph** with the brand hex `#F7931E` added as a `fill`, like most of the set.
- **PySpark is gone, LightGBM took its slot, and Selenium joined Developer Tools.** Kian's call. `apachespark.svg` is left in `public/svgs/` with nothing pointing at it.
- **LightGBM is the second non-simple-icons icon**, after MATLAB, and it is built differently from every other file here. simple-icons has no LightGBM glyph, and the project's only official artwork is a **wordmark** — `microsoft/LightGBM`, `docs/logo/LightGBM_logo_black_text.svg`, 4645x1052, which in a square tile would draw the whole word at about 15px tall. So `lightgbm.svg` is the **mark lifted out of it**: the four colored triangles (`#EF4927`, `#76B644`, `#1B9AD7`, `#FCB518`), with the grey text paths and the `fill:none` bounding rect dropped, on the mark's own tight `viewBox="0 0 630 1048"`.
  - **That viewBox is portrait (0.60), and deliberately not padded to square.** It is the mark's real extent; `object-fit: contain` letterboxes it to 34x56 in a 64px tile. It reads noticeably narrower than the square brand glyphs beside it, which is the honest rendering of a portrait mark — **that is what `contain` is there for**, and the alternative is stretching a logo.
  - Rebuild it from the source logo rather than by hand if it ever needs redoing, and **render it and look** before shipping: `qlmanage -t -s 300 -o /tmp icon.svg`. Cropping the wrong paths out of a wordmark is exactly the kind of error that is invisible in the markup.
- **Selenium is an ordinary simple-icons glyph** with the brand hex `#43B02A` added as a `fill` on the `<svg>`, like most of the set.
- PyTorch is filed under Frameworks & Libraries, not Data & Research — that group is specifically the econometrics/thesis tooling (see above), and PyTorch is a Python library.
- `invertDark: true` applies `filter: invert(1) brightness(0.85)` in dark mode. Used by **Flask** and **GitHub** (GitHub's brand hex `#181717` is invisible on black).
- C++ uses the lighter logo blue `#659AD2` rather than `#00599C` for dark-mode legibility.

### On mobile the names are hidden, and the tiles become real buttons

Below 768px `.skill-name` is `display: none` and one name at a time is revealed by tapping its tile. Twenty-seven tiles wrapping two or three to a row put twenty-seven lines of uppercase micro-type through the section, which read as noise around the marks rather than as labels on them.

- **`Proficiency.tsx` branches in JS, not CSS**, via `useIsMobile()` — because what changes is not styling but *what the element is*. On mobile each tile renders as a `<button type="button">` with `aria-expanded`; on desktop it stays a `<div>`. **A button on desktop would be a control that does nothing**, since the name is already printed under every tile — the same rule that keeps `.hover-card` and `.expandable-card` apart.
- **`display: none`, not a visually-hidden clip.** The tile's `<img>` already carries `alt={title}`, so the skill is still announced; a hidden-but-present label would have it read out twice.
- **The revealed name is absolutely positioned**, so showing it cannot change the tile's height and reflow the grid under the finger that just tapped it. Measured: the grid is 208px tall with a name shown and 208px with none. It sits in the 20px row gap below, `width: max-content` capped at 92px so `PostgreSQL` (83px) stays on one line instead of wrapping into its neighbour's column.
- The tile keeps a `--hover-tint` on its icon wrap while revealed, because the name appears *outside* the tile and the tap would otherwise have no feedback on the thing that was tapped.
- `.skill-item` restates `background`, `padding`, `font`, `color` and `text-align`, since it is a `<button>` at that width and would otherwise inherit the UA's own.

**`useIsMobile` (`src/components/useIsMobile.ts`) is shared with `FigureChart`**, which owned the logic first as `useCompactGeometry`'s body. Two components now change behaviour rather than styling at 768px, so the breakpoint lives in one place and cannot drift from `Nav.css`, `Paper.css` and `Proficiency.css`.

## Awards section

**Three** academic honors in one sub-card: the ASU seal on the left, then a horizontal timeline — a dot per honor with a rule running between them, LinkedIn's entry rail turned on its side. Last section card in the stack, below Skills and above Contact, collapsible and open by default.

- **The New American University Scholarship was here and Kian cut it.** Three honors is what the card is laid out for; a fourth column makes the labels too narrow to hold `Barrett, The Honors College` on two lines.
- **The seal is the only thing naming the school**, which is why the entries don't repeat it. That also means it is **not decorative**: `alt="Arizona State University"`, unlike the Experience tiles, which are `alt=""` because the company name sits right beside them.
- **`.award-logo` is a copy of `.exp-logo`** — 60px, 6px inset, `border-radius: 15px` (the radius scales with the tile at 0.25, so keep 60/15 in step), `--well-bg` + `--well-shadow`. The `--well-bg` fill is what keeps the seal's white elements from dropping out in light mode. **Keep the two rules in step.**
- **Only Dean's List carries a second line** (`All eight semesters`). `GPA 3.93` is not on Summa Cum Laude — Education prints it a few hundred pixels up, and here it would be the loudest thing in the card.
- **Summa Cum Laude and Barrett also appear in Education**, against the degrees. Kian asked for them here anyway: this section is the list of honors, and a reader skimming it shouldn't have to have read the Education card. Don't "de-duplicate" it later without asking.

### The rail is a grid with no column gap, and that is load-bearing

`.award-track` is `grid-template-columns: repeat(3, 1fr)` with **no `column-gap`**, so each column's right edge *is* the next dot's left edge. That's what lets the connector be `left: 15px; right: 0` on every step with no arithmetic and no magic numbers — it reaches the next dot exactly, at any card width. `space-between` would have made each rule a different length.

- The connector is **`::before` on each step except the last**. A rule running off the right end of the last column reads as a cut-off list.
- Measured at 1280: dots at x 164 / 507 / 849 on one line, the first rule running 179 → 507, which is dot 2's left edge to the pixel, with a 6px breath after dot 1.
- `--card-border` for the rule, `--muted` for the dots — the internal-divider token and the secondary-text token, which is what each of them is.

**At ≤768px the rail stands back up and is simply LinkedIn's again**: one column, dots down the left, the connector vertical (`left: 4px; top: 14px; bottom: 0`, `width: 1px`). Three columns in a 335px card leaves ~100px each, which wraps `Barrett, The Honors College` to four lines. Measured: 3 rows, dots aligned, no sideways scroll.

**The step padding there is 26px, up from 14, and the card gap 18 from 16.** Kian's read was that the stacked card looked squished, and the measurement says why: at 14px the gap *between* two honors was barely larger than the 2px gap *inside* Dean's List (its "All eight semesters" second line), so six lines read as one block rather than as three entries. Now it is 26px between entries against 2px within one, and the connector rule finally has a run longer than the dot it starts from. The card goes 164px → 189px at 375.

Measured: the card is 100px in a 186px section at 1280; 164px in a 256px section at 375.

## About layout

The **title sits at the top of the text column** (`.about-text`), not in a full-width hero row above it. The gallery starts level with the title rather than below it, which removes that row's height from the card. `.about-content-area` is top-aligned (`align-items: flex-start`) and carries the top padding the old `.about-hero` row had at each breakpoint. On mobile the column stacks as title → bio → resume link → gallery, the same order as before.

### The contact row at the foot of the card

The same three links the Contact section carries — LinkedIn, GitHub, Email — as icon-only circles under both columns, which is the shape a reader looks for at the end of an intro.

- **One list, in `src/content/contact-links.ts`.** Two components draw it now, so a second copy would drift; `isMailto()` travels with it, because both consumers have to render the mail link **without** `target="_blank"`/`rel` (a mail client is not a browsing context, and saying it is would mislead assistive tech).
- **Centred on the TEXT column, not on the card.** The card's own centre falls in the gap between the bio and the gallery, which lands the icons under nothing; centred on the text they read as a sign-off under the bio. Measured at 1280, 1024 and 375: the band's inner zone matches `.about-text`'s left and right edges to **0.00px** at every one.
- **The band re-creates the content row's columns rather than sharing them**, because it sits outside `.about-content-area`: an inner div stands in for the text column and an empty `::after` for the gallery. Putting the row *inside* the text column would centre it for free, but on mobile that column stacks above the gallery — the icons would land in the middle of the card instead of at its foot.
  - **Both rows read the same tokens**, declared on `.about-section`: `--about-text-col`, `--about-gallery-col`, `--about-col-gap` and `--about-gutter`. That is the whole point of them. Literals in two rules is exactly the drift `.cards-wrapper`'s gutters and the nav bar are documented for, and here it would be invisible until someone changed the 3/2 ratio. The breakpoints override the tokens, not the rules.
  - At ≤768px the `::after` is `display: none` — one column, so the band's own centre *is* the text's centre.
- **They ARE the Projects cards' icon buttons.** `.about-social-link` is a copy of `.project-icon-link` — 40px, `border-radius: 8px`, a recessed `--well-bg` chip carrying `--well-shadow`, `--textcolor` mark at 19px, `--well-hover-tint` on hover, 8px apart. **Keep the two in step**: if one is retuned, retune the other. Verified with `getComputedStyle`: every property identical in both themes.
  - It carries the **`a.about-social-link:visited` restatement** for the reason `.project-icon-link` documents — `a:visited` is 0-1-1 and outranks a bare class, and these are outbound links, so they *will* be visited.
- **Two earlier treatments were tried and dropped**, which is worth knowing before a third: 46px outlined **circles** (Kian's original reference), then 46px outlined rounded squares at `.scroll-top`'s 14px radius. The reasoning against the well was that it reads as a dent when it sits alone on a flat card rather than inset into a sub-card — true, but **two icon-button treatments on one page was the worse problem**, and Kian's call was to match. Note also that nothing else on the site is a circle: 20px section cards, 14px sub-cards, 6px tags, and **`.exp-date` is the only fully round thing left** — the nav's hover chips came off their pill too. The carousel's `n/N` badge is the near exception at 10px on a 24px box, and it is copying Instagram deliberately (see *The two carousels share their controls*).
- Icon-only, so **`aria-label` is the link's only name** and doubles as the tooltip — the same contract the Projects cards' icon links use. `:focus-visible` is restated because the global reset clears `outline`.
- `.about-content-area`'s own bottom padding is what spaces the row from the bio above it.

## The pulsing ring behind the About card

`PulseRing.tsx` — a closed loop whose radius is modulated by five angular harmonics, drawn 64 times over at successively earlier moments so the recent past of the path is still on screen. **That overlap is the whole effect**: where the loop moves fast the copies fan out into a translucent sheet, where it is nearly still they stack into one dark line. It breathes between almost-a-circle and a lobed, folded tangle on a 17s cycle.

It took the dot grid's slot in the About card and is **ambient only — it does not track the pointer**, which is Kian's call and matches the reference recording. That also sidesteps the argument the dot grid had to make about the About card having no hover affordance.

### The loop has to close, which constrains the harmonics

The radius is `1 + Σ a·sin(m·θ + w·t + p)`. At `θ = 2π` every term must land where it was at `θ = 0`, and `sin(m·2π + x) === sin(x)` **only when `m` is a whole number** — a fractional `m` leaves a visible notch at the seam where the path fails to meet itself, which reads as a rendering bug rather than a design.

The `m` values also share no common factor (2/3/5/7/11). With 2/4/6 the lobes line up every half turn and the figure looks mirrored. The drift rates `w` **alternate in sign** on purpose: harmonics all turning the same way slide across each other as one moiré, where counter-rotating ones fold into and out of each other.

The path closes by repeating `θ = 0` as its last sample rather than calling `closePath()`, so the join at the seam renders identically to every other join.

### The trail is computed, not recorded

Two obvious implementations were rejected:

- **A ring buffer of past paths** ties the trail's length *in time* to the frame rate, so the figure would look different at 120Hz than at 60Hz — the same bug the dot grid's frame-rate-independent easing exists to avoid.
- **Fading the canvas with a translucent fill each frame** never reaches zero. The residue floors at the rounding of 8-bit alpha and leaves a permanent grey smear, and it tints the whole card rather than only where the path went.

Sampling the path's own function at `t − k·TRAIL_DT` has neither problem: it is a pure function of time, identical at any frame rate, correct on the very first frame instead of building up over a second, and it costs no state.

Copies are drawn **oldest first** so the newest lands on top and reads as the leading edge.

### Three tuning passes, and what each one was actually fixing

The first version was a thick opaque black band, not a ribbon. Worth knowing, because two of the three causes are not what they look like:

- **Too large.** `RADIUS_FRAC` 0.42 of a 682px card put the ring at 286px radius before distortion, which at peak reached ~380px and swamped the card. Fractions of the card were the wrong idea entirely — see *It is fitted to the gap* below.
- **The copies were not fanning out.** The trail spanned 2.2s but the harmonics drifted at ~0.2 rad/s, so all 40 copies nearly coincided and stacked into one line. **The fan is a function of how far the path travels inside the trail window, not of the trail's length** — the drift rates went up roughly 3x and `SPIN` from 0.055 to 0.16 rad/s.
- **The alpha was compounding to opaque.** This is the arithmetic worth keeping: N copies at per-copy alpha `a` composite to `1 − Π(1 − a)`, so the sum of the alphas is what matters, not any one of them. At `HEAD_A` 0.5 with `FALLOFF` 2.6 over 40 copies the sum is ≈ 4.6, i.e. `1 − e^(−4.6)` ≈ **0.99 — fully opaque**. `HEAD_A` is **0.13** now, which lands the densest overlap near 0.85 and lets the internal structure show. **Lower `HEAD_A` before reaching for fewer copies**, since the copies are what make the sheets smooth rather than ribbed.

`TRAIL` is 64 at `TRAIL_DT` 0.06 (a 3.8s window). Measured at 1024px with a 1904x1364 backing store: **median frame 16.7ms, p95 16.8ms, max 17.7ms** — 60fps with no dropped frames, under the nav's `backdrop-filter`.

### It is fitted to the gap, and the gap is measured from the drawn content

The figure sits in the open band between the copy and the contact icons, **on the text column's axis**. `above`, `below` and `centreOn` are **selectors, not numbers** — the component stays general and knows nothing about About's class names, the same call DotGrid's `shelter` prop makes.

**`centreOn` is the text column, not the card.** The card's own centre falls in the gap between the bio and the gallery, which is the identical reason `.about-social` centres its icons on the text column rather than on itself — see *The contact row at the foot of the card*. The ring and the icons now share one vertical axis and read as a stack down the card's left half. It was centred on the card for one round and sat visibly right of where it belonged.

**That is also why the gallery is not in `above`.** It is the right-hand column and the figure never reaches it — measured, 176px of horizontal clearance — so letting it set the band's top edge only robbed height for nothing. Dropping it took the base radius from 72px to **82px** at 1024x768.

**Fractions of the card cannot work here, and that is structural.** The band runs from the bottom of the content to the top of the contact row, and its height is content-driven where the card's height is a viewport: measured, it is **191px at 1024x768 and 559px on a 1050px-tall card**. Any constant is correct at exactly one window size.

**`above` and `below` may each match several elements** — `above` takes the lowest bottom edge, `below` the highest top edge. That is not generality for its own sake. Passing the wrappers (`.about-content-area`, `.about-social`) was wrong at *both* ends at once: the content area's bottom sits **36px below the last thing drawn inside it**, so that room was thrown away, while the contact row's top is **exactly** the icons' top with no padding at all, so room was claimed that did not exist and the peak overran the icons by 5px.

**SIZE AGAINST THE PEAK, NOT AGAINST A FRAME YOU HAPPENED TO LOOK AT.** `PEAK_FACTOR` is derived from the constants — `1 + ENERGY_MAX · Σa` — so changing a harmonic's amplitude or the energy ceiling cannot silently make the figure outgrow its band. Judging it by eye instead put the base radius at 0.9 of the band's half-height, which looked right in the screenshot and reached **137px against the 102px available** at peak, on a 17s cycle slow enough that a casual look never caught it. The same trap the dot grid's idle pulse documents, one level up.

Verified analytically rather than by sampling: at 1024x768 the base radius is **82px**, centred at x 286 on the text column, and the all-aligned worst case spans y 360–596 against the copy ending at 350 and the icons starting at 606 — clear by exactly `BAND_INSET` (10px) at both ends, and 176px clear of the gallery sideways. On a tall card `MAX_RADIUS_FRAC` binds instead of the band.

### The energy never reaches zero

`ENERGY_MIN` is 0.72, not 0. A perfect circle sitting in the middle of the cycle looks like the animation has stalled, and a viewer arriving at that moment has no way to tell that it hasn't. The envelope is a slow cosine rather than anything noisier — the variety already comes from the harmonics drifting against each other, and a second irregular signal on top reads as jitter.

**The range is narrow for a SIZE reason, not a motion one.** Because the figure is fitted so its loudest moment clears the band, a wide range spends most of the available room on a peak that is rarely on screen and leaves the quiet end drawing a small plain circle in a large gap — which is exactly what 0.3–2.2 did. At **0.72–1.6** the quiet end is still visibly lobed and the base radius is about 20% larger.

`SPIN` is applied to the **position angle only**, not to the harmonics' own argument. Rotating both just re-phases the shape in place and nothing appears to turn.

### Measure the host, not the canvas — and relayout on `document.fonts.ready`

`layout()` gives the canvas an explicit inline `width`/`height`, so from that moment its own bounding rect reports whatever was last written to it — measuring itself is circular and it **latches at the 300x150 a canvas defaults to**. That shipped for one round and rendered the ring into a 300x150 box in the card's top-left. The parent is what has a meaningful size, and it is also what the `ResizeObserver` has to watch, since the canvas's own box never changes.

`readPaint()` is called from `layout()` and not only on mount, which is the lesson the dot grid's alpha scale taught — see below.

The band is measured between two blocks of text, so the **web font arriving moves it**. The `ResizeObserver` catches the card's own height changing but not the content area's, which is inside it, so `document.fonts.ready` triggers a relayout — the same trap `useScrollRestore` documents.

### The gates, and reduced motion

The same three as the dot grid's pulse, for the same reason — this animates with nothing asked of it, so an ungated rAF is a battery draw on a tab someone has left open: `prefers-reduced-motion` (watched, not read once), an `IntersectionObserver` at `threshold: 0` (higher would never fire for a card a viewport tall), and `visibilitychange`.

Under reduced motion the figure still **renders**, once, at a fixed `staticAt` — a static drawing is not motion, and suppressing it outright takes away more than the setting asks for. Any repaint that happens while the loop is suspended uses that same fixed time, so the off-screen and hidden-tab cases never show a blank card.

**Testing it in a hidden preview pane needs the documented workaround.** The pane reports `visibilityState: 'hidden'`, so the third gate correctly suspends everything and two screenshots taken seconds apart come back **identical** — which looks exactly like a dead animation. Redefine `visibilityState` and dispatch `visibilitychange` to let it run. Screenshots themselves do work in the pane.

## The dot grid behind the About card — RETAINED, NOT RENDERED

**Kian moved away from this look, not from the code.** `DotGrid.tsx`, `DotGrid.css`, the `SHELTERED` list in `About.tsx` and the `--dot-grid-alpha-scale` token are all intact and working. Reinstating it is one line in `About.tsx` plus the import; it reads the same `--about-ink` token the ring does. **Don't delete it as dead code**, and read this section before putting it back — the shelter taper, the two-weight bloom and the pulse's activity gate each took a round of tuning that is not obvious from the outside.

Everything below describes it as it was when it was live, and still is when rendered.

`DotGrid.tsx` — a canvas of dots on a 24px pitch filling the About card. Dots within 130px of the pointer swell (1px → 3.4px) and brighten (alpha .11 → .5), falling off with distance; everything else is quiet texture. **Purely for fun** — Kian asked for it, nothing depends on it, and the card renders exactly as before if the canvas fails to get a 2D context.

**It is not rendered at all below 769px.** `About.tsx` gates it on `useIsMobile()`. There is no pointer to track, the card is already taller than the viewport there, and this is the one thing on the page that exists purely for fun — it should not cost a phone a canvas, two observers and a per-dot field build. Rendering nothing beats hiding it in CSS, which would do all that work and then paint it to no one.

### The dots keep out of the copy's way, and the taper is the whole point

The first version ran the field across the entire card and the dots sat behind the bio. **The fix Kian asked for is a taper, not a crop** — "I don't want just a clean rectangle cut off ... the dots just taper off and become less responsive to hovers". He was right to reject the rectangle: a hard edge where the effect stops is far more obvious than a gradient where it thins out.

So every dot carries a **weight** from its distance to the nearest box of real content, and that weight scales **both** its resting alpha **and** how far it can swell. A dot is dark until `SHELTER_DEAD` (10px) from the nearest box and reaches full strength `SHELTER_RAMP` (140px) after that.

**The ramp is LINEAR, not smoothstepped, and the boundary is JITTERED.** Both came out of a second round: the first version used `smoothstep(d / 88)` and Kian still saw "a hard rectangle border". Two separate causes, and fixing only one would not have done it:

- **Smoothstep is flat at both ends**, so it crammed the whole visible transition into the middle two rows of a 24px grid — the eye reads two rows going 0.19 → 0.57 as an edge. Linear over a longer distance spreads it across about six rows instead. Measured below the resume button: the ramp went from 3 rows with a biggest step of 0.048 to **5 rows with a biggest step of 0.031**, and the first row is fainter (0.038 against 0.065) so the onset is softer too.
- **The real culprit was that the boundary was an iso-contour.** However long the ramp, every dot at the same distance got the *same* weight — so the field's edge traced a rounded rectangle, which is precisely what "a hard rectangle border" describes. `SHELTER_JITTER` (0.26) adds a deterministic per-dot offset, so the edge dissolves into noise instead of drawing itself. The hash is `sin`-based and keyed on the grid index, so the same cell always gets the same value and the field does not shimmer when it is rebuilt on a resize.

**The jitter is applied in `buildField`, not in `weightAt`.** `weightAt` stays smooth because it is also what the *pointer* is weighed against, and a noisy pointer response would feel like the effect was stuttering.

- **Distance is to the RECTANGLE, not its centre.** `Math.max(q.l - x, 0, x - q.r)` per axis is 0 while the point is inside that axis's span, so the taper follows the shape of a wide paragraph instead of ballooning out of its middle.
- **`About.tsx` passes the selector list as the `shelter` prop**, so `DotGrid` stays general and knows nothing about About's class names.
- **It lists the TEXT ELEMENTS, not their wrappers.** `.about-text` would shelter the entire left column including the open space under the resume button — which is exactly where the field should be liveliest.
- **`.about-social-inner` is deliberately NOT sheltered.** The contact chips are opaque `--well-bg` tiles with their own shadow, so they just sit on top of the field. Kian's call: "the buttons should just sit above the grid and the block shouldn't be treated differently." Sheltering them punched a hole in the one area of the card the dots have all to themselves. Measured after: mean alpha left of, right of and below the chips is 0.19–0.20, against 0.16 mid-card.

**TWO weights damp the bloom, and it needs both.** The dot's own weight was not enough on its own, and the reason is geometric: `INFLUENCE` (130px) reaches further than `SHELTER` (88px), so a pointer parked just under the resume button still caught a crowd of full-weight dots below it and bloomed almost normally. The fix is a second weight measured **at the cursor itself** (`weightAt(px, py)`), scaling the whole effect — so a hover in a sheltered spot is quiet wherever the dots around it happen to fall.

`POINTER_FLOOR` (0.15) keeps a sheltered hover from doing *literally* nothing, which would read as broken rather than as damped. Measured at 1440x900: just under the resume button the local ink goes 6,820 → 11,176 and peak alpha 28 → 54; in the middle of the open field it goes 23,808 → **118,903** with peak alpha 28 → **95**. The bloom is **10.6x stronger in the open**. Before the pointer weight it was 25.5x against 18.5x — a difference Kian correctly called "not noticeable enough".

**The field is inset from the card's LEFT AND RIGHT edges** (`EDGE_INSET` 24, then a 120px ramp — lengthened with the shelter ramp, and jittered by the same per-dot offset). It was creeping up both sides in the gutter beside the copy, which read as the grid escaping the card rather than sitting in it. Measured: both gutters are now exactly 0 against 0.161 mid-card.

**Top and bottom are deliberately NOT inset.** The header and the copy already shelter the top, and fading the bottom would strip the dots from around the contact icons — the one place they were just asked for. The bottom edge strip measures 0.165, i.e. full strength.
- The base grid can no longer be one path and one fill, since every dot has its own alpha. That is fine: `paintBase` runs on layout and on a theme change, never per frame.
- `document.fonts.ready` triggers a relayout, because the copy reflowing moves the very boxes the field is measured from.

Measured at 1440x900: mean alpha over the bio, the title and the gallery is **exactly 0**. Walking down from under the resume button in 24px steps the field rises **0.038 → 0.069 → 0.083 → 0.100 → 0.125 → 0.142** and then plateaus. (For the hover response, which needed a second weight to become noticeable, see below.)

### The card fills the first screen

`min-height: calc(100dvh - 80px)` on `.about-section` above 769px, with a `100vh` line before it as the fallback. `.home` clears the floating pill with `padding-top: 80px`, so the card's top edge is at y=80.

**The card's bottom edge sits FLUSH with the bottom of the screen.** It used to subtract `var(--card-gap) / 2` as well, so the fold landed on half the stack gap below the card and left a 6px sliver of page showing — the reasoning then being that a sliver says "this continues" where a flush edge says "this is the whole screen". **Kian reversed that call** after the gallery went square and made the card taller. Measured at 1024x768: card top 80, bottom 768, gap below the fold **0px**.

`--card-gap` is still a token and still read by `.cards-wrapper`; this rule simply no longer subtracts it.

**`--card-gap` is a token for this**, declared on `.home` beside `--page-max` and read by `.cards-wrapper` as its `gap` and by this `min-height`. It was a literal `12px` in `.cards-wrapper`; two literals would have drifted the moment the stack's rhythm changed — the same rule every other shared measurement here follows. The ≤768px block overrides the **token** (10px) rather than the `gap`, so anything reading it follows.

**`min-height`, not `height`**: on a short viewport the content still wins and the card grows past the fold rather than clipping.

**The extra height is what makes the field worth having** — at content size the card has almost no open space, and a field that only lives in the margins is not worth the code. The card becomes a flex column and `.about-social` takes `margin-top: auto`, so the height it gains opens up BETWEEN the content and the icons — one large clear area — rather than stranding the icons mid-card with dead space beneath them.

**It responds to the pointer, and that does NOT contradict "About has no hover tint".** That rule exists because a tint on a card whose header does nothing reads as *click me* — a promise the card can't keep. This is ambient motion *under* the content: it follows the cursor anywhere on the card, dead space included, so it never points at a control. The distinction is the same one that keeps `.hover-card` and `.expandable-card` apart.

- **A canvas, not elements.** At a 24px pitch the card holds well over a thousand dots once it is a viewport tall. That many nodes, each transforming, is a layout and compositing cost for decoration — and this sits directly under a `backdrop-filter` nav bar that already re-rasterises on every scroll frame.
- **The resting grid is drawn ONCE to an offscreen canvas and blitted each frame.** A frame then only draws the ~100 dots actually inside the pointer's reach, found by *index arithmetic* on the grid rather than by distance-testing every dot. Without it, every frame costs the whole grid whether anything moved or not.
- **The falloff is smoothstepped** (`u*u*(3-2u)`), not linear. A linear falloff leaves a visible circular rim at the edge of the influence radius.
- **Easing is frame-rate independent** — `1 - Math.exp(-dt / tau)`, not a fixed per-frame fraction, which would move twice as fast on a 120Hz display. The pointer is eased too (`tau` 55ms), so the field glides between move events instead of snapping.
- **The eased position is seeded on entry.** Without it the field swoops in from wherever the pointer last left, usually the far corner.
- **The rAF loop stops itself.** When the pointer leaves, `strength` eases to 0, the grid settles exactly back to rest and the loop cancels. Measured: the ink mass under the pointer goes 22,176 → 325,328 (14.7x) and back to exactly 22,176; a point 500px away is byte-identical throughout.
- **There IS an `IntersectionObserver` now**, which there deliberately was not before the idle pulse — see *Three gates* below for why that reasoning expired.
- **Touch is ignored** (`e.pointerType === 'touch'`), the same call `FigureChart` makes: a drag across the card is the reader scrolling the page past it, and there is no hover to track on a finger. This is belt-and-braces now that the grid doesn't render below 769px at all — a touch-capable laptop still hits it.
- **`prefers-reduced-motion: reduce` renders the grid but nothing in it moves** — no pointer listeners, no pulse, no loop. Texture is not motion; a field chasing the cursor, or breathing on its own, is exactly what the setting is asking us not to do.

### The idle pulse

A band of brightness sweeps down the card on a **`PULSE_CYCLE`** (5s at the time of writing — Kian has been tuning it), of which it travels for 62% and rests for the remainder. He asked whether it was a good idea; it is, but only at this scale and only gated.

- **It is much shallower than the hover** — 1.9px / .24 alpha against the pointer's 3.4 / .5. What makes the hover feel responsive is that everything else is still, and a loud pulse spends exactly that.
- **The rest phase is the difference between a pulse and an animation.** A band that never stops is something animating at you; one that arrives, passes and leaves is a breath. The rest is also free: a frame with no band and no pointer does *no canvas work at all* — `restPainted` short-circuits the clear-and-blit once the grid has settled.
- **The band enters above the card and leaves below it** (`-PULSE_BAND` to `h + PULSE_BAND`), so the sweep has no visible start or end.
- **Phase comes from absolute time** (`now % PULSE_CYCLE`), not an accumulator, so after a scroll or a tab switch the band resumes mid-sweep instead of snapping back to the top.
- **It is scaled by the dot's shelter weight like everything else**, so the band does not light up behind the copy as it passes over it.
#### It yields to pointer MOTION, not to presence — and that distinction was a bug

This started as `1 - strength`, and `strength` stays pinned at 1 for as long as the cursor is anywhere over the card. So **parking the mouse on the grid and letting go suppressed the pulse indefinitely.** Kian found it and described the symptom exactly: "if I hover around the grid and then stop, the pulse won't go, but if I toggle the theme off and on, then stop, then it works" — toggling the theme means moving the pointer up to the nav, which *leaves* the card and releases `strength`.

The fix is a separate `activity` value, and it is **held then eased**, not decayed from each event:

- `lastMoveAt` is stamped on every `pointermove`, and `activity` eases toward 1 while `now - lastMoveAt < ACTIVITY_HOLD` (450ms), toward 0 after.
- **A pure per-event decay was tried first and sagged between events.** At a 600ms time constant a slowly dragged mouse (pointermove every ~120ms) let `activity` fall to ~0.82 in the gaps, so the band flickered back in at up to a third strength while the reader was still moving. Measured 0.31, then 0.155 with a longer constant. The hold takes it to **0**.
- The bloom under a parked cursor still stays put — `strength` is untouched. It is only the pulse that stops caring.

Measured at 1280x800: with the cursor **parked and still** on the card, the band swings 103,161 — the pulse runs, which is the bug fixed. With the cursor **continuously moving**, a strip far outside `INFLUENCE` swings **exactly 0** — it still yields completely. Roughly 1.5s from the last move to the band returning.

**Give `activity` time to saturate before measuring the moving case.** A window opened 700ms into the movement catches it still ramping and reports a 16,020 leak that is not there in steady state; that mistake was made once while testing this.

#### Three gates, and this reverses an earlier decision

The pointer effect could rely on "no cursor here means nothing to do". **The pulse cannot** — an ungated idle animation is a rAF held open for as long as the tab exists, which is a battery draw on a page someone has left open. So it runs only when all three hold:

1. **`live`** — not `prefers-reduced-motion`. The grid still *renders*, because texture is not motion, but neither the pulse nor the pointer moves. **Watched rather than read once**, unlike before: someone turning the setting on should stop an animation that is already running.
2. **`onScreen`** — an `IntersectionObserver` at `threshold: 0`, the same call `useCarouselAutoplay` makes. A higher threshold would never fire for a card that is a viewport tall.
3. **`tabVisible`** — a background tab gets no frames on most engines anyway, but this makes the stop explicit and keeps the band from lurching on return.

**This file used to say there was deliberately no `IntersectionObserver` here**, on the sound reasoning that a card off screen cannot have the pointer over it. That stopped being true the moment something moved without being asked to.

Verified over a **full cycle** at each condition, because a shorter window can land entirely inside the rest phase and make a running pulse look stopped — that mistake was made once while testing this. At the current 5s cycle: on screen and foreground, total ink swings 193,948 → 685,278; scrolled past, range **exactly 0**; tab hidden, range **exactly 0**.

**Testing it in the hidden preview pane needs the same workaround as the carousel autoplay**, and for the same reason — the pane reports `visibilityState: 'hidden'`, so gate 3 correctly suspends everything and nothing ever moves. Redefine `visibilityState` on the document and dispatch `visibilitychange`, and put the test iframe on screen so gate 2 passes too.

### Two things it has to be told, because a canvas cannot read CSS

- **The ink.** A 2D context can't resolve a custom property, so `DotGrid.css` sets `color: var(--dot-grid-ink)` on the canvas and the component takes `getComputedStyle(canvas).color`, varying the alpha itself. That is what lets the dots follow the theme without the component knowing any token names. A `MutationObserver` on `<html>`'s `data-theme` repaints on a theme change — verified live, with no reload.

  **The field is BLUE in light and plain white in dark**, Kian's call, which is why it reads `--about-ink` rather than `--textcolor` — the two now disagree. The light hex is `rgb(3,111,252)`; it was `#2a78d6` (the thesis charts' first series) for one round. **It is not a reference to `--chart-s1`**, which is declared in `Paper.css` and scoped to `.paper`, so it does not resolve on the home page at all.
- **The alpha, which is a second token and was a real bug.** `--dot-grid-alpha-scale` multiplies the three constants in `DotGrid.tsx` — `BASE_A` (rest), `PULSE_A`, `PEAK_A` — and is **`9` in light, `2.2` in dark**.

  **Light is deliberately SATURATED**: `0.11 x 9` clamps to 1, so the resting dot is solid `rgb(3,111,252)` rather than a transparent wash. Kian's call, after seeing it at 1.

  **What solid costs, because it is not obvious from the number.** At rest = 1 there is no brightness headroom left above it, so the hover and the pulse clamp to the same 1 and their alpha lift becomes a no-op — both now read by **radius alone** (1px to 3.4px on hover, to 1.9px on the pulse). Measured, the hover still moves **4.5x** the ink in its window, so the response survives; but if the field should breathe in brightness again, this is the number to bring down, and about `7` leaves the rest at 0.77 with the lift still working.

  **THE TOKEN IS ONLY READ WHERE THE CANVAS REPAINTS, and that read used to be too narrow.** `readPaint()` ran on mount and on a `data-theme` change only. So changing the scale and letting Vite hot-swap the stylesheet looked like it did *nothing*: the token resolved to its new value, the canvas kept the alphas it had read at mount, and the next relayout faithfully repainted with the old ones. `layout()` now re-reads before `paintBase()`, which costs one `getComputedStyle` per layout and never per frame. **A stylesheet swap still triggers no repaint of any kind, so after editing this token, reload the page** — there is no observer that would catch a CSS-only change.

  **Dark's ink was already `#ffffff` and the dots still rendered grey**, which is exactly how it was reported. `.11` of white over the card's `rgb(16,16,18)` composites to `rgb(44,44,46)`; the hue was never wrong, the opacity was. At `2.2` the resting dot lands at `rgb(74,74,76)` and the hover peak saturates to white. Measured in both themes after the change: light unchanged at alpha 28 and `rgb(3,111,252)` ink, dark at alpha 62.

  **One multiplier rather than three tokens, deliberately.** Rest, pulse and peak were tuned *against each other* — the pulse is much shallower than the hover, which is the whole reason the hover reads as a response — so they have to move together. Each is clamped at 1 individually, so a large scale flattens the top of the range before the bottom.

  Dark stays pure white deliberately. A blue at `.11` alpha over a near-black card composites to a muddy grey rather than to anything recognisably blue, so the tint would cost legibility and buy nothing. Measured: light paints `rgb(44,121,216)` dots, dark `rgb(255,255,255)`, with the same 792 lit samples in the sample window either way — so only the hue moved, not the field.
- **Its size.** A `ResizeObserver` on the card relays out, rebuilds the shelter field and repaints the base grid. The card's height is now the viewport's, so this fires on every window resize — 688px at 1024x768, 1120px at 1800x1200 — and the canvas matches it exactly. The backing store is `devicePixelRatio` capped at **2**: past that it grows faster than anyone can see on a field of 1px dots.

### The stacking is the one part that bites

A positioned element with `z-index: 0` paints **above** non-positioned block content in the same stacking context, so the canvas would sit on top of the bio rather than behind it. Three things make it work, and all three are required:

1. `.about-section` takes `position: relative`, so `inset: 0` resolves against the card. Safe to add — the only other absolutely positioned thing in there is `.gallery-img`, which resolves against `.gallery-frame`.
2. The card's own three content blocks are lifted to `z-index: 1` explicitly.
3. The canvas is `pointer-events: none`, so a click aimed at the resume button or a contact link never lands on it. Verified with `elementFromPoint` over the resume button: it returns `.resume-link`, not the canvas.

It needs **no radius of its own** — `.section-card` is `overflow: hidden` at 20px, so the canvas is clipped to the card's corner for free.

## About gallery

`<Gallery>` in `About.tsx`. **Four** photos from the `images` array, prev/next arrows with clickable dots between them, an `n / N` badge in the picture's own corner, and a six-second autoplay.

**img2 and img3 are pre-cropped SQUARE, so the frame crops nothing.** Both were landscape (1206x904 and 2160x1743) and the square frame's centred crop left Kian at about 41% across in each — visibly left of centre. They are now 904x904 and 1200x1200, cut with an offset chosen so he lands at 50%: `x0 = 73` on img2 (face-centred) and `x0 = 54` on img3. Measured after: **0.0% cropped** by CSS on both, so what the page shows IS the file.

`sips` cannot do this — it only crops CENTRED, which is exactly the thing being corrected, and there is no PIL or ImageMagick on this machine. The offset crop was done with a small AppKit script (`NSImage` → `CGImage.cropping(to:)` → JPEG), the same Swift path the repo already uses for PDF figure geometry. **img1 is untouched** — Kian's call, it was already well composed, and it is the one source the frame still crops (to 78% of its width).

**The filenames ARE the running order, because the files were renamed to match it.** Kian reordered the gallery (it was `img3`, `img1`, `img_dep2`, `img2`) and the four files on disk were then renamed so `img1`–`img4` really are the gallery's 1st–4th. **That is the right fix and the one to repeat**: renaming beats leaving an out-of-sequence array with a comment explaining itself. `img4` is the old `img_dep2`, promoted out of the dead pile.

**`img4` is the one PORTRAIT source** — 992x1119 (0.887) against the others' ~1.3 landscape — **and it is why the frame is square.** In the old 4/3 frame `object-fit: cover` could only show a 992x744 window of it, the top **66.5%**, which cut Kian off at the hip and read as a mistake rather than as a crop. Kian reported it as the file being broken; the file is fine and holds the whole photo head to shoe. **No edit to the image fixes it** — a 4/3 box cannot contain a portrait subject without adding width to it or changing the box.

At 1/1 it shows **88.7%** of its height, down to about the knee, still anchored `center top` so the crop comes off the bottom where the path is. Measured after the change.

**The three landscape sources pay for it, in width instead of height**: img1 shows 78%, img3 81%, img2 75%. That is the better trade because they are scenery, where a tighter crop loses margin, while the portrait is a photo of a person, where the crop was losing the person. All four were checked by rendering them.

**Padding the portrait to 4/3 was the alternative and was rejected on this repo's own rule**: a photograph with a subject is cropped, never padded, because bars either side read as a mistake. The OG images note in `build.md` makes exactly that call for the home card.

It was **re-compressed from 1.5MB to 391KB** at its native size (`sips -s formatOptions 82`), because the gallery warms both neighbours on mount and four photos at that weight is most of a megabyte before anyone clicks. **Note `sips -Z 1400` UPSCALED it** to 1241x1400 on the first attempt — the same trap the project thumbnails document ("sources narrower than that are left alone rather than upscaled"). Re-compress at native size; don't pass a dimension. The original is in git history.

The frame is `aspect-ratio: 1 / 1`, `border-radius: 24px !important`, `overflow: hidden`. It was 4/3 — see above for why it is square. The radius went 75px (a shape nothing else on the site used) to 14px (matching `.sub-card`) to **24px** — Kian asked for about 10px more than the sub-card radius. Softer than the panels around it without going back to a shape of its own.

### Both slides animate, not just the incoming one
The transition keeps **two** images mounted: `idx` (incoming) and `outgoing`. They animate in step — the old one exits a full frame width while the new one enters — and the frame's `overflow: hidden` clips both. `outgoing` is cleared in `onAnimationEnd` on the incoming image.

This previously animated only the incoming image, over 40px with a fade, and swapped the old one out instantly via `key={idx}`. That reads as a pop, not a slide.

Details that matter:
- **`.gallery-img` is `position: absolute; inset: 0`** so the two slides stack. The frame keeps its height from `aspect-ratio`, so nothing collapses when both images leave the flow.
- **No enter class on first paint** (`sliding` is false until the first click), or the opening photo slides in on every page load.
- **No fade under the slide.** At a full 100% travel a cross-fade only muddies the midpoint.
- **The curve is `--ease-in-out-cubic`** (`cubic-bezier(0.645, 0.045, 0.355, 1)`), at Kian's request and shared with `FigureCarousel` so the two sliders cannot drift. It was Material's `cubic-bezier(0.4, 0, 0.2, 1)`, an *emphasised decelerate*: that curve leaves fast and coasts in, so the two slides spent most of the 0.45s nearly still. A symmetric curve reads as one continuous push, which is what a slide where both layers travel together wants. The token is on `:root` in `App.css`, not per theme.
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

## The two carousels share their controls

The About gallery and the paper pages' `FigureCarousel` are different components with different slide mechanics, but everything **around** the pictures is one implementation, because the site should have one slider register rather than two that drift. Both control rows are `[prev arrow] [dots] [next arrow]`, with the count in the picture's corner.

- **`CarouselDots.tsx`** draws the dots, and owns the rule about when there are any: **ten or fewer** slides get dots you can click to jump; more falls back to no dots at all, with the corner badge carrying the position on its own. Eleven dots in a ~210px row sit ~10px apart, which is under any usable touch target and reads as a texture rather than a set of controls. Every current caller is well inside the limit (4 photos, 3 diagrams, 7 screenshots), so in practice everything on the site has dots today. Each dot is a real `<button>` with `aria-current`; the **mark is an inner span**, so the button stays a ~19x24 target while the dot it draws stays 7px.
  - Not a `tablist`: that role promises roving focus and arrow-key navigation, which this does not implement. Same rule as the Projects dropdown declining `aria-haspopup`.
- **`CarouselCounter`** (exported from the same file) is the `n/N` badge, **in the picture's top-right corner** rather than in the control row. It started beside the dots and came out: the dots were already saying the same thing 20px away.

  **It is Instagram's badge, copied on purpose** — Kian asked for it by name and supplied a reference shot, including its corner radius. The first attempt used the site's own chip idiom and read wrong in three ways at once, all of which are worth knowing because each one alone looked fine:
  - **`1/4`, not `1 / 4`.** The two spaces around the slash were half of what made it look "spaced out".
  - **No tracking, and 12px/600.** It was 0.62rem/500 at `0.08em` — the site's uppercase micro-label, which is right for a caption and wrong for a number. The tracking was the other half. Closed up, the badge went 44x18 to **41x24**: narrower *and* taller, which is the reference's proportion.
  - **10px radius, not `.tag`'s 6px.** On a 24px badge that leaves ~2px of flat edge down each side — very round, but not the stadium `999px` would give, which is what the reference shows. It makes this the site's roundest thing after `.exp-date`, and that is the accepted trade for matching the reference.

  **The glass is real now**: `blur(16px) saturate(180%)` with a `inset 0 1px 0` specular rim, where it was a flat `blur(4px)` scrim. `saturate` is the nav glass's own trick — blur alone averages a photo to grey mush and the boost puts the color back, so the badge reads as a lens over the picture rather than a sticker on it.

  **KEEP THE FILL AT `rgba(0,0,0,.55)` OR DARKER.** The blur averages the backdrop, so the worst case is a blown-out sky: `0.45 x 255` ≈ 115 grey, and white on that is **4.76:1**, just over AA. Lightening it to match the reference shot more literally — its backdrop is mid-tone, so its badge reads grey — drops the text under 4.5:1 over a bright photo. Fixed colors in BOTH themes, which is the one place on the site that is right: this sits on a photograph, not a themed surface, so no token describes what is behind it. `tabular-nums`, so it cannot jitter as the number changes. Its parent must be `position: relative`; both frames already are, since their slides are absolutely positioned.
- **`useCarouselAutoplay.ts`** advances either carousel every **6 seconds** — long enough to read a figure's label, short enough that a four-photo gallery gets round itself. One value for both.

  **Autoplay is content that moves without being asked, so it stops in five situations and every one matters:**

  1. **`prefers-reduced-motion: reduce`** — off entirely.
  2. **The reader took over.** One click on an arrow or a dot and the timer never runs again for that carousel. This is also the pause mechanism WCAG 2.2.2 asks for, without adding a control to the bar. Verified: after a dot click the slide does not move again across a 7s wait.
  3. **Pointer or keyboard focus is inside it** (`onFocus`/`onBlur` on the root, so focus landing on a dot counts).
  4. **It is off screen**, via an `IntersectionObserver` at `threshold: 0` — a higher threshold would never fire for a carousel taller than the viewport. Every paper carousel starts below the fold.
  5. **The tab is hidden**, or the interval queues advances to fire in a burst on return.

  A single slide never animates at all. `advance` is held in a ref so the interval keeps its phase instead of restarting on every slide change.

  **Testing it in the hidden preview pane needs a workaround**, and the pane is doing the right thing: `document.visibilityState` is `'hidden'` there, so condition 5 correctly suspends the timer and nothing ever moves. Redefine `visibilityState` on the iframe's document and dispatch `visibilitychange` to let it run — and put the test iframe ON screen, since condition 4 is geometric and an off-screen iframe never intersects.

**Both now SLIDE, with `--ease-in-out-cubic`.** The gallery always did. `FigureCarousel` used to crossfade, on the documented reasoning that a set of diagrams is not a sequence in space and so has no direction to honour — **that reasoning expired** when the carousel gained dots (jumping 1 → 5 is a direction) and autoplay (always forward). Its slides are parked off-frame and given **three** states, not two: `.paper-carousel-img-on` at 0, `.paper-carousel-img-before` at `-100%` for everything already passed, and the default `+100%` for everything still ahead. With a single "on" class every inactive slide would park on the same side and going back would look identical to going forward. `visibility` rides the transform with a `0s` delay on each side, so a parked slide is out of the accessibility tree and not hit-testable — `opacity` alone would leave seven slides stacked and clickable.


## Projects

A grid of **uniform tiles, each one a link to that project's page**. Modelled on the reference portfolio Kian supplied: an edge-to-edge picture, a flush-right title, a short justified blurb, then a rule and a pipe-separated tag line, with the footer bottom-pinned.

**The reference's big corner counter was tried and CUT.** At 2.6rem/700 it was the loudest thing on a card that already leads with a picture, and it numbered the grid without telling the reader anything. Don't reinstate it just to match the reference — `.project-index`, the `index` prop and the count-down computation are all gone with it.

**Its pipe-separated tag footer was tried and cut too** — see *The card, top to bottom*. What survives from the reference is the edge-to-edge picture, the flush-right title, the short justified blurb and the bottom-pinned rule.

**Two things the reference has that this deliberately doesn't:** a **year** under the tags (*Projects carry no dates* — see below), and a hairline **border** around each card instead of a shadow (*No card borders* is a site-wide rule; these carry `--card-shadow` like every other card).

### The whole tile is one `<Link>`
`to` is what the card's old "Read" button pointed at. Every project has a page under `/projects/:slug`, so there is no outbound-link case to handle and `to` is a plain string.

- **There is nothing else inside the card to click** — no nested `<a>`, no buttons — because a link inside a link is invalid and unusable with a keyboard. That is why the **outbound links moved onto each project's page** as `actions` (GitHub, CurseForge, the live site, the PDFs). Nothing was lost: the three papers already carried theirs, and the three new pages were given them.
- The card takes `cursor: pointer` **honestly** now. Under the old layout the tile was inert and only the buttons worked, which is why it took `.hover-card` (tint, no pointer) instead — see *Dead code* for what became of that class.
- Hover is a layered tint plus a 2px lift and a deeper shadow; `:focus-visible` gets an outline, because the global reset clears `outline`. Both are what tell you the tile is clickable at all now that it carries no button.
- The lift is suppressed under `prefers-reduced-motion`; the tint stays and carries the hover on its own.

### The card, top to bottom
A **`<div>`** wrapping two things: a `<Link>` (`.project-main`) over the picture, title and blurb, and a **sibling** `.project-foot` holding the tag chips and the icon links.

**That split is the whole reason for the structure.** The icon links are real `<a>`s, and an `<a>` inside an `<a>` is invalid and unreachable by keyboard — so the card cannot be one big link. Keeping the footer as a sibling is simpler than the alternative (a "stretched link" whose `::after` covers the card while the icons sit above it on `z-index`), and it needs no `:has()` support. The cost is that clicking the tag row doesn't navigate, which is the right behaviour anyway. `.project-main` takes `flex: 1` so it absorbs the card's spare height and the footer stays on the bottom edge.

There is no counter and no type label.
- **The title is left-aligned.** The reference sets its titles flush right and that was tried here, but its titles run to three words where these run to eleven, and four lines of ragged-left text is materially harder to read than one. Kian's call after seeing both. The card's **shortened titles are kept** either way — "Universal Basic Income vs. Targeted Welfare" drops its "A Macroeconomic Assessment" subtitle, and the page carries the full one — because a short label suits a grid tile regardless of alignment.
- **It is 1.15rem/500.** At this size, across a 371px card, the title is the largest type on the tile, and the weight came down in two steps: 700 shouted over the picture above it, and 600 still read heavy once Google Sans Flex went in. It sits with `.exp-role` and `.exp-company` at 500, which is **the site's normal heading weight** — 600 is left to `.about-hero-name`, the one place that should be loudest.
  - Both this and the hero briefly dropped to 600 during the Roboto experiment for a different reason: that face's 700 is much heavier at the same nominal weight. The hero went back to 700 with the typeface; this one landed at 600 on its own merits. Weight is still the first lever to reach for if a future face looks heavy — see *Typography*.
- **The blurb is a teaser, not the description** — two or three lines, in the reference's register: what the thing is, and the one fact worth knowing. It is written separately from the page's own text on purpose; a truncated long description reads like a truncated long description. It is **justified**, which gives it a flush rectangular edge, as in the reference.
- **The footer is `.tag` chips plus a row of icon links**, under a hairline rule. The chips were briefly a pipe-separated line in the reference's style; that read as a caption rather than as the same kind of thing Experience lists, so they came back. `.project-foot` takes `margin-top: auto`, so **all of a card's slack goes into the single gap between blurb and footer** — the same gap the reference leaves open — and every card in a row draws its rule on the same line however the title and blurb wrapped.
- **The footer's bottom row is `display: flex; justify-content: space-between`** with exactly TWO children: the icon list in the left corner, the go-arrow in the right. It was briefly a `1fr auto 1fr` grid with the icons centred; when they moved back to the corner the grid's empty spacer `<span>` was left in the markup, and `space-between` then pushed the icons to the *middle* of the row — measured 127px from the left edge instead of 0. **Two children, no spacer.** Its `min-height` is the icon tile's own height, which keeps the footer the same height on the two cards that carry no icons, and so keeps the rules aligned across a row.
- **The icon links are 40px and unlabelled.** At 34px they read as decoration rather than as controls; 40 is still well short of the 72px labelled tiles they replaced, which competed with the card's own link. `aria-label` is therefore the link's ONLY name, and it doubles as the tooltip. Recessed chips (`--well-bg`, `--well-shadow`, `--well-hover-tint`), the same step down as the tags above them — **not** `.scroll-top`'s inversion, which was tried and fought the card carrying it.
- **`.project-go` is the mark in the bottom-right corner**, and it is **`ArrowOut`** — the same arrow as "View Resume" and the contact cards. A bespoke box-and-arrow glyph (`ArrowBox.tsx`) was drawn for this slot and went through two revisions before being **deleted**: at 24px it never read as well as the arrow the site already had. Reach for the existing glyph before drawing a new one.
  - It carries no px size. `.project-go` sets `font-size: 22px` and `ArrowOut` sizes itself at `1em`, which is the contract `.resume-link`, `.contact-card-arrow` and `.cal-icon` all use — the glyph tracks its context instead of every caller hard-coding dimensions.
  - Quiet by design: `--muted`, no fill and no border unlike the chips beside it, brightening to `--textcolor` with the card's hover. It is a signpost, not a button.
  - Check icon geometry by *looking* at it: `qlmanage -t -s 320 -o . icon.svg` renders an SVG to a PNG on macOS, which is the quickest way to see a glyph without a browser screenshot.
  - It links to the **same place** as `.project-main`, and carries `aria-hidden` **plus `tabIndex={-1}`**. Announcing the same destination twice is noise, and `aria-hidden` on a *focusable* element is itself a violation — the negative tabindex is what makes the pair legitimate. It stays clickable, because an arrow that looks like a control and isn't is worse than a redundant one.
- **`links` is optional, and two cards have none.** That used to misalign the footer — it is bottom-pinned, so a card with no icon row drew its rule lower than its neighbours. The go-arrow is on every card now and holds the row's height on its own (`min-height: 40px`, the icon tile's own height), so the old "every card must carry at least one icon" constraint is gone.
- **Every link is an ordinary outbound `href`**, opened in a new tab. There is no internal `to` (the card already covers that) and no PDF modal, which is why `Projects.tsx` doesn't import `PdfModal`.

**`grid-auto-rows: 1fr`** gives every row one height, and the gap above the footer is what absorbs the difference.

**The grid's own `gap` is 24px**, against `.sub-cards-stack`'s 8px — the wider gutter is the point, and the cards narrow only as a consequence (381px to 371px at 1280, about 2.5%). The double class `.sub-cards-stack.work-grid` already outranks App.css, so this needs no `!important` either.

Measured at 1280: cards **371px wide and 535px tall**, all six identical, visual **371x208**, footer row a constant 40px, every rule at the same offset.

**`.project-card .tag-list` reserves TWO rows** (`min-height`, derived from `.tag`'s own metrics in App.css). The footer is bottom-pinned, so a card whose chips wrap to two rows would start them — and draw its rule — ~29px higher than a card whose chips fit on one. Measured: chips run one row on five cards and two on Santa Cruz, and all six rules sit at the same offset. **A three-row card breaks it again — keep tag counts at four.** (At ≤768px Santa Cruz's four long tags *do* reach three rows under Google Sans Flex, where they reached two under Inter. That is harmless and not the failure this rule guards: the grid is one column there with `grid-auto-rows: auto`, so each card is its own row and there is nothing for its rule to line up with. The reservation is a minimum, not a cap.)

**That reservation needs `align-content: flex-start` AND `align-items: flex-start`, and leaving them out is a bug that shipped once.** `.tag-list` is a wrapping flex container, so with spare vertical space the default `normal` resolves to `stretch`: a single row of chips grew to fill the whole reserved box — **51px tall against a natural 23px** — and four of the six cards rendered their tags as tall slabs. `align-content` distributes the flex *lines* and `align-items` sizes the chips *within* a line; one without the other leaves the stretch in place.

### The visual
One frame for every card — a grid of six different silhouettes stops reading as one set of things, the same rule the course cards' identical watermark follows.

- `aspect-ratio: 16 / 9`, `object-fit: cover`, `object-position: center top`. **16/9 is measured, not assumed:** once the two outliers are padded the sources run 1.685 to 1.923, so 16/9 (1.778) sits among them and the worst crop is 7.6%. `top` takes the loss off the bottom of the taller ones, which on a UI panel is the least informative part.
- The box is reserved by `aspect-ratio`, so lazy-loaded images **cannot shift the grid** as they arrive — the same failure the paper pages hit, solved the same way.
- **It bleeds to the card's top, left and right edges**, via negative margins that cancel `.sub-card`'s padding on those three sides. The top bleed came with the counter's removal: with nothing above it, the picture starts at the card's edge instead of floating under a band of empty fill. Bleeding sideways is also how the picture was enlarged once *without costing any more crop* — it gains the card's horizontal padding on both sides while the frame's ratio, and every crop number above, is untouched. Widening the ratio instead would only have made it taller by cropping the sides harder.
- **The bleed has to be restated at ≤768px.** `.sub-card`'s padding drops from `20px 26px` to `22px 24px` there, so flat `-20px`/`-26px` values overshoot — clipped by the card's `overflow: hidden`, which means it shows up as *extra crop*, not as a visible bleed. Measured after the fix: the visual's edges sit at 0.0px from the card's at 1280, 1000 and 375.

### The visuals themselves
Files live in **`public/images/projects/`**, one per project, all `.webp`:

| File | Project | Size | Ratio | What the 16/9 crop eats |
|---|---|---|---|---|
| `shipment-quoting.18712804.webp` | Revolution Parts Shipment Quoting Microservice | 900x534 | 1.685 | 5.2% off the bottom |
| `thesis-survey.bd86e9f6.webp` | Barrett Honors Thesis | 900x506 | 1.779 | **0.0% — padded** |
| `basic-income.9eabe994.webp` | Economics Capstone | 700x394 | 1.777 | **0.0% — pre-cropped** |
| `wage-effects.120b1d50.webp` | Estimating the Wage Effects of a UBI | 1001x563 | 1.778 | **0.0% — padded** |
| `rental-prices.3ab58f9d.webp` | Santa Cruz Rental Price Model | 900x506 | 1.779 | **0.0% — padded** |
| `material-boxes.fbf45ff3.webp` | Material Boxes | 854x480 | 1.779 | 0.1% |

### Filenames carry a content hash, and that is not decoration
`<slug>.<first 8 of md5>.webp`. **Replacing an image while keeping its filename does not reach anyone who has already loaded the page.** That happened: a full set of new art was installed correctly, served correctly (`cache-control: no-cache` + ETag, verified fresh and cached fetches returning identical new bytes), and still showed as the old pictures in a browser that had the previous files at those exact URLs — which then read as "the images didn't get done".

Vite copies `public/` **verbatim**, with no hashing of its own, so a stable name is a permanently stable URL. Renaming is the fix, and a content hash is the version of it you cannot forget to bump: recompute it in the same step that re-encodes the file.

```bash
h=$(md5 -q "$n.webp" | cut -c1-8); mv "$n.webp" "$n.$h.webp"
```

Then update the `src` in `Projects.tsx`. If a picture ever looks stale again, check the served bytes before re-cutting the art — the file on disk is usually right.

**A PORTRAIT set was tried and reverted.** Kian supplied taller, narrower art and the frame moved to 4/5 for it; the cards came out **790px tall**, too much for a three-up grid, so both the art and the frame went back to landscape. If portrait is ever revisited, that height is the thing to solve first — those ratios ran 0.582 to 1.080, a spread no single frame serves well.

**Three of the six need no crop at all, by construction:**

- **`rental-prices`, `wage-effects` and `thesis-survey` are padded to exactly 16/9**, each with **its own background color sampled from the source's edges** (`#FFFFFF`, `#FCFBFC`, `#FFFFFF`). Sample before padding — white is only right if the image is actually white at the edge. Without it the rent app sliced its title to "a Cruz Rent Model" and cut the estimate panel mid-number, the wage chart sliced its x-axis caption in half, and the survey (2.148 — 17.2% off the sides) cut "Survey" down to "rvey" and clipped the question text.
  - **The survey's padding is all at the TOP, not centred**, and that distinction matters: its top edge is pure white across the full width, but its bottom edge is mixed (`#F7F7F7` at the sides where the page background shows, white in the middle where the survey card sits). Centred padding would have left a visible seam along the bottom. **Sample the edge you intend to pad, not just a corner.**
  - `sips -p H W --padColor` only pads *centred*. One-sided padding needs a raw-pixel step: `dwebp -ppm`, prepend rows in Python, then `cwebp` reads the PPM back.
- **`basic-income` is pre-cropped to a 16/9 band** rather than fitted by CSS. It is an engraving of a hand holding banknotes ringed by line drawings of what a basic income buys — housing, groceries, a car, healthcare. The source is 700x420 (1.667), so `cover` would take 26px off the bottom, and the bottom is where the car sits with almost no margin under it. The band is **y=26, 700x394**: the whole 26px comes off the TOP, which is where the spare margin actually is, and every icon survives intact.
  - It replaced a UBI mural photograph that was cropped the same way (a 672x867 portrait, banded at y=340 to catch the hand and the "PLANT THE SEED" banners). The rule that outlived it: **don't let CSS choose the slice on a picture with a subject.** Look at the source, find where the spare margin is, and take the crop from there — re-crop from the original if the frame ever changes.

**The other three crop into margin, or into content that visibly continues**, checked by rendering each crop and looking at it. That check is the point: **the worst percentage is not always the worst crop.** Santa Cruz once had the second-*smallest* crop in its set and was the only broken one.

- **They are re-encoded, not dropped in as supplied.** `cwebp -q 85 -resize 900 0` keeps the whole set near 210KB, at roughly 2.4x the rendered width. Sources narrower than that are left alone rather than upscaled.
- **`cwebp`'s flags cannot be passed through a shell variable.** `R="-resize 700 0"; cwebp $R ...` fails with *Unknown option '-resize 700 0'* — the whole string arrives as one argument. Four files silently kept their previous contents that way. Write the flags out per call.
- **`material-boxes.webp` is the exception: `-lossless`, at its native 854px.** It is a Minecraft screenshot — sharp pixel text and flat color, which is what lossy WebP smears and what lossless WebP compresses well. Don't "optimise" it to match the others.
- `sips` **cannot write WebP**, and resizing PNGs with it made them *bigger*. `cwebp` / `dwebp` (homebrew) are the tools, and a WebP source has to be decoded with `dwebp` first because `cwebp` won't read one.
- `alt` describes what the picture **shows** — not a repeat of the title, which sits beside it and is already read out.

### Breakpoints
Three across, **two at ≤1100px**, one at ≤768px. 1100 rather than the site's usual 1024, because a card here has to hold a picture *and* a title that wraps beneath it, so three stop working before the other grids do. It is the same breakpoint Skills uses, for a related reason. **`grid-auto-rows` reverts to `auto` at ≤768px** — one column means every row is its own card, and equalising would only pad the short ones.

### One project is HIDDEN, not deleted

**Estimating the Wage Effects of a UBI is commented out**, Sep 2026 — Kian's call: he wants to understand the project better before it represents him. Everything it needs is still in the repo: the page in `project-pages.ts`, its seven images under `public/images/wage-effects/`, its thumbnail, its `og/` card.

**Two comment blocks bring it back, and they move as a PAIR**: the `works` entry in `content/projects.ts` and the matching line in the `papers` registry in `content/papers.ts` (plus the `wageEffects` import above it, also commented). Uncommenting one alone breaks: a work with no page **fails the build** (`prerender-meta.mjs` throws `project "…" has no page in the papers registry`), and a page with no work would be a live URL with nothing linking to it and a search index that disagrees with the grid. The card, the nav dropdown row, the search entries, the sitemap and its prerendered HTML all follow from those two lines.

Verified while hidden: the build writes **6** routes and a 6-URL sitemap, `/projects/wage-effects` renders the ordinary `NotFound` page with full chrome in both themes, and the bundle drops ~10kB as the page's content tree-shakes out.

**Counts elsewhere in this file are written for the full set of six.** Where you read "six projects" or "all six papers", the sixth is this one.

### Still true
**Projects carry no dates.** They were removed deliberately. Don't reintroduce a `date` field without checking with Kian.

**Every card must carry a visual.** `image` is **required** on `WorkProps`, not optional — one card without art in a grid of thumbnails reads as a broken tile rather than as a quieter entry, so the type makes it impossible to add a project without one.

**The paper PDFs are withdrawn.** Kian asked that the full-text files for the thesis and the two capstones stop being downloadable. Three things had to happen, and all three matter:

1. The **card links** are gone — which left the capstone poster and the Economics capstone with no outbound link at all (see above).
2. The **page actions** are stripped in `content/papers.ts` by `withoutWithheldPdfs`, **not** by editing the papers' own modules. Those three are generated from the source PDFs and the generated output carries a `View PDF` action, so a hand edit there is dropped by the next regeneration and this isn't. The thesis keeps its ASU Library record, the capstone poster keeps its video, and the Economics capstone is left with no actions at all — `Paper.tsx` already guards an empty list.
3. The **files are deleted** from `public/pdfs/`. Removing the buttons alone would have left them served at a guessable URL, which is not what "no access" means. Only `resume.pdf` remains.

**Two consequences worth knowing.** Those PDFs are the *source* the generated content modules are built from, so a future regeneration needs local copies — they are recoverable from git history (`git log --diff-filter=D -- public/pdfs`), which also means they stay readable there if the repository is public. And `LinkIcon`'s `pdf` glyph now has no caller; it is kept with the rest of the set.

**There is no project type on the card.** "CS Capstone", "Personal Project" and so on moved to the pages, where every one of them was *already* rendered as the `eyebrow` — it was duplicated, and the card had no room for a second label. Verified before removing: all six pages carry a matching eyebrow.

**Every project needs a page.** The cards link to `/projects/:slug` and nothing else, so a project added to `works` without an entry in the `papers` registry is a dead card. There is a note to that effect on the registry itself.

Three badge types sit **inline at the end of the project title**, so on a wrapping title they follow the last word: a green `.project-release` (the shipped version, e.g. "Version 1.1.0") and then a red `.project-wip`. **Material Boxes is the only card carrying either** — it has both. A third, **`.project-live`**, comes first in the row — it is the one that says "you can click this and use it right now", so it is the most useful thing a skimming visitor can see. It is **derived, not a flag**: a card earns it by carrying a link whose icon is `site`, which is already what that icon means. A separate `live?: boolean` would be a second copy of the same fact and could disagree with the links below it. GitHub, CurseForge and a PDF are deliberately not live — source you have to build, a mod you have to install, a document you read. Only the rent model qualifies today.

Its fill is the site's own accent `rgb(3,111,252)`, written as a literal rather than as `--about-ink` for two reasons: these badges are fixed colors in both themes (a badge that changed color with the theme would read as changing meaning), and that token is pure white in dark, which would lose the badge's white text. Measured **4.48:1** against white, against 4.26 and 4.25 for the other two — the same band, so no badge shouts over another. A first attempt at `#1a63d6` measured 5.53:1, which broke exactly that rule.

All three **share one rule** and differ only in fill — `#2e8b57` and `#e03e3e`, fixed colors rather than theme tokens, both at the same ~4.3:1 against white, so neither shouts over the other.

**Month abbreviations never take a trailing period** (`Aug`, not `Aug.`) — site-wide.


## Contact

Three `.contact-card` links in a 3-column grid (one column at ≤768px), outside any section card, under a plain `.card-title` label.

**Each card is icon + label on the left and `ArrowOut` on the right**, which is what the card's `space-between` separates — `.contact-card-main` groups the first two so they travel together. The icons come from **`LinkIcon`, the same set the Projects cards use**, at 18px (20px on mobile). They are `--muted` and **brighten to `--textcolor` with the card's hover**, so the label stays the card's only full-strength element and the marks read as quiet wayfinding rather than as three competing logos.

**The third card is Email, not YouTube.** Its `href` is a `mailto:`, and it is the one card rendered **without `target="_blank"`/`rel`** — a mail client is not a browsing context, and saying it is would mislead assistive tech. The branch is `isMailto()` rather than a flag on the entry, so a future mail link gets it for free.

**The three links live in `src/content/contact-links.ts`**, not in this component: About's contact row draws the same list, and two copies of three URLs would drift.

`mail` is the only Contact icon with no brand behind it, which is why it is **stroked** like `paper`/`pdf`/`library` instead of filled like the `linkedin` and `github` marks beside it.

## Footer

`footer` is the counterpart to the paper pages' top bar and **takes its design**: no fill of its own, `.footer-name` at 0.9rem/600 `--textcolor` left and `.footer-meta` at 0.82rem/500 `--muted` right. Those are `.paper-back`'s and `.paper-theme-toggle`'s declarations exactly — verified equal in both themes — so a reading page is bracketed by two bars in the same register instead of opening quietly and closing on a slab.

It used to be an **inverted full-bleed slab** (0.7rem/400 on both sides). `--footer-bg` / `--footer-text` fed nothing else and **have been deleted from `App.css`**; don't reintroduce them to "restore" the bar.

**A hairline separates the footer from the page above it**, in `--card-border` — the internal-divider token, which is exactly what this is.

**It is a `::before` inset by the gutter, NOT a `border-top`.** The footer is full-bleed on the home page, so a border would run the whole viewport width while everything above it — the cards, the nav, the footer's own text — stops at the gutter. Insetting lines the rule up with the content it separates.

**That is why the gutter is a variable.** `--footer-gutter` drives the padding *and* the rule's `left`/`right`, so the two cannot drift apart at a breakpoint.

**The footer renders on both pages, and each gutters differently — so the page context decides where its text sits, not the component.** Both rules live in `Footer.css`, not split across `Home.css` and `Paper.css`, so they stay in step:

- **`.paper footer`** takes `max-width: var(--paper-max); margin: 0 auto`, the same box as `.paper-topbar` and `.paper-inner`, so the name at the foot sits on the same left edge as the content above it.
  - **It hard-coded `1180px` until that was caught by a pass over this file.** The literal was correct while `--paper-max` was also 1180, and silently wrong the moment that token went to 1320: measured, the footer's name drifted **10px right of the content at 1280 and 30px at 1500+**, with its right edge 106px inside the article's, while this document still claimed the two were flush. It is the token now. **Don't put a number back** — this is exactly the drift every other shared measurement here is a variable to prevent.
- **Gutters are 36px everywhere on desktop.** At ≤768px the base drops to 20px (matching `.paper-topbar`) and **`.home footer` overrides `--footer-gutter` to 16px**, because `.cards-wrapper` drops to 16px there and at 20px the footer's text sat 4px inside the card edge above it. Setting the variable moves the padding and the rule together.

Measured flush to **0.00px** — footer name against the content's left edge, `©` against its right — on a reading page at 375, 768, 1024, 1280, 1500 and 1900, and on `/` against the About card at 1280 and 1900.

Note the scroll-to-top button is still `--textcolor`-filled and now floats over a page-colored footer rather than an inverted one, which reads better, not worse: it kept its contrast either way, but it no longer briefly matches the slab behind it.

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
