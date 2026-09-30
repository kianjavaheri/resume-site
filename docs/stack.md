# Tech stack and dependencies

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

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


## Key technical decisions

- **Vite over CRA** — migrated from react-scripts (incompatible with Node 22). Build is `vite build` only.
- **Case-sensitive paths** — macOS is case-insensitive, Vercel's Linux is not. All imports use lowercase `components/`.
- **SVGs in `public/svgs/`** referenced as `<img src="/svgs/name.svg">`, never Vite imports — avoids module declaration issues and keeps assets swappable.
- **`border-radius: 0 !important`** global reset is intentional; override with `!important`.
- **No card borders** — outer cards, sub-cards and contact cards use drop shadows only. `--card-border` is for internal dividers (timeline lines, TA rows, coursework rows).
- **No toggle button** — collapsible headers have no `<button>`; the whole `.card-header` toggles.
- **Inline SVG for icons** — the back-to-top arrow, gallery chevrons and outbound-link arrow are inline SVG. Unicode arrows render as emoji on some mobile browsers; FontAwesome was removed from the bundle (it cost ~67 kB for one arrow).
- **No emoji-capable codepoints in copy** — see *No emoji glyphs in copy* above.
- **`text-size-adjust: 100%` on `html`.** iOS Safari inflates text in blocks it judges wide relative to the viewport **even with a correct `width=device-width, initial-scale=1`** — Chrome on Android turns the behaviour off when that meta is present, Safari does not. The symptom is a page that "comes in a little zoomed in" on an iPhone and nowhere else, with rows of inline type wider than they were authored. `100%`, **not `none`**: `none` also disables the reader's own pinch-zoom text scaling, which is a real accessibility setting.
- **`App.css` is imported FIRST in `App.tsx`**, before any component that ships its own stylesheet. Vite emits CSS in import order, so while that line sat last, every rule in App.css won each specificity *tie* against a component sheet — and which one applied depended on nothing a reader of either file could see. If a component's own colour or spacing is mysteriously not applying, check this before adding `!important`.
