# Build and deploy

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## Running the project

```bash
npm start        # dev server on localhost:3000
npm run build    # vite build, then scripts/prerender-meta.mjs
npm run preview  # serve dist/ — the only way to test the prerendered output
npm run og-images  # regenerate public/og/*.jpg. NOT part of the build
```

Deployed on **Vercel** via git push to `master`. `vite build` runs without `tsc` — esbuild handles the TypeScript transpilation.

### The build has a second half: per-route meta and a sitemap

`scripts/prerender-meta.mjs` runs after `vite build` and writes seven HTML files — one per route — each carrying its own `<title>`, description, canonical link, Open Graph and Twitter card tags, plus `dist/sitemap.xml`.

**Why it exists.** The site is one `index.html`. `Paper.tsx` sets `document.title` per project, but that runs in JavaScript, and the things that build link previews — LinkedIn's unfurler, Slack's, iMessage's, Discord's — fetch the raw HTML and read `<meta>` only. Without this every URL unfurled identically with no image, and search engines saw seven pages that looked like one.

**Why it works without SSR.** A static host resolving a request checks the filesystem before it applies a rewrite. `vercel.json` rewrites `/(.*)` to `/index.html`, but once `dist/projects/thesis.html` exists on disk the filesystem check matches first and the rewrite never fires for that path. A crawler gets real tags; a human gets the same file and React boots from it exactly as before, because the file is the shell with a different head.

**It reads the registries through Vite, not by parsing them.** `papers.ts` and `projects.ts` are TypeScript with extensionless imports, which plain Node cannot resolve. The script spins up a Vite server in middleware mode and calls `ssrLoadModule`, so it sees exactly what the app sees — the same invariant `paper-view.ts` holds for the search index. A registry change reaches the tags and the sitemap with no second list to maintain.

Four decisions inside it that are not arbitrary:

- **Every project page is written TWICE**, as `projects/<slug>.html` and `projects/<slug>/index.html`. A host resolving an extensionless request tries the path, then `.html` appended, then `/index.html` — and which of the last two it reaches first is the host's business. This is the one thing here that cannot be verified without deploying, so both forms exist and whichever is checked finds a real file. It costs about 2KB each. **It also caught a real bug**: `vite preview` falls through to the SPA on the extensionless path unless the sibling `.html` is there, which is how the gap was found in the first place.
- **The tab title and the share title differ, deliberately.** `<title>` is the paper's full title, matching what `Paper.tsx` sets once React takes over — otherwise the tab visibly changes on hydration. `og:title` is the card's short `navLabel`, because an unfurler truncates around 60–90 characters and the thesis's full title is 100. That is the same split `navLabel` already existed for.
- **`og:image` is absolute.** A relative one is simply dropped by most unfurlers.
- **`og:image:alt` describes the PICTURE**, not the page — `works` already carries exactly that string for every thumbnail, so it is reused rather than rewritten.

### The share images are JPEG, and that is not a preference

`scripts/make-og-images.sh` regenerates `public/og/*.jpg`. Run it by hand after changing a thumbnail or the hero photo; it is **not** part of `npm run build`, because these are committed assets with content hashes in their names and a build that rewrote them every time would defeat the hash.

- **JPEG, not WebP.** The whole point is the LinkedIn unfurler, and LinkedIn does not reliably render a WebP `og:image`. The source thumbnails *are* WebP, so each is decoded with `dwebp` first.
- **1200x630** (1.905), the size every unfurler crops toward. The thumbnails are 16/9 (1.778), so they are **fitted by height and padded at the sides** rather than cropped — losing nothing, the same call the thumbnails themselves make.
- **The pad colour is sampled from each image's own edge**, by reading the decoded PPM and taking the most common pixel down the left and right columns. That is not ceremony: the six sampled to `#FFFFFF`, `#FCFBFC`, `#F7F7F7`, `#F5F8F7`, **`#C7BA7E`** (the basic-income engraving's tan paper) and **`#151713`** (the Material Boxes Minecraft screenshot). Two of the six are nowhere near white, and a white bar on either would have been obvious.
- **The home card is CROPPED, not padded**, because it is a photograph with a subject — bars either side read as a mistake on a photo where they read as deliberate on a UI screenshot. The crop is offset upward (60px of the 270 removed comes off the top) to keep headroom above the face; a centred crop leaves it 11px from the edge. Swap the source in the script to change it.
- Both were checked by **rendering them and looking**, per the rule the project thumbnails already follow.

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

**The transition row has bitten twice now, and the second time looked exactly like a CSS bug.** While checking the nav's dock, `classList` said `nav-docked` and the CSSOM showed the rule present, correct and later in the file — yet every computed value was the FLOATING one: `top: 12px`, the glass fill, the old padding. Nothing about that reads as "frozen clock"; it reads as a specificity problem, and chasing it that way wastes real time. `getAnimations()` returned `[]`, which is not the reassurance it looks like. **The test that settles it is the one in the table**: inject `transition: none`, re-read, and you get the true end state. It was correct all along.
