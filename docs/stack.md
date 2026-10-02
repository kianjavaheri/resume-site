# Tech stack and dependencies

*Split out of CLAUDE.md. Long-form notes and rationale; CLAUDE.md keeps the invariants.*

## Tech stack

- **React 18** with TypeScript
- **Vite 8** (rolldown bundler) with `@vitejs/plugin-react@6`
- **react-router-dom v7** (BrowserRouter in index.tsx)
- **use-local-storage** for theme persistence
- No UI or icon libraries are used in `src/`

### The dependency list is deliberately short
`package.json` carries only what `src/` actually imports: `react`, `react-dom`, `react-router-dom`, `use-local-storage` and `@vercel/analytics`.

**`@vercel/analytics` is the one dependency imported for instrumentation rather than for output**, and it earns its place: no transitive dependencies of its own, `npm audit` stays at 0, and it no-ops off Vercel — in `npm start` it logs that it is in development mode and sends nothing, so there is no dev traffic to filter out later. `<Analytics />` is mounted in `App.tsx` **outside the routes**, or a route change would unmount and remount it. Verified that it reports SPA navigations, not just the first load.

**It forced a Vite config change, and that is worth knowing before anyone removes it.** `@vercel/analytics/react` is a second entry point, and Vite's dependency optimizer pre-bundled it with its OWN copy of React — the browser loaded `react.js?v=12d294d1` for it while react-dom came from `?v=b2114662`. Two copies means two dispatchers, so its first `useEffect` threw `Cannot read properties of null`, React logged `Invalid hook call`, and the subtree crashed on every page. It survived a full `rm -rf node_modules/.vite` and a server restart, so it was **not** a stale-cache artifact. `resolve.dedupe: ['react', 'react-dom']` plus `optimizeDeps.include` fixes it, verified afterwards by the loaded module list, where React and the analytics entry share one `?v=` hash.

**A trap while diagnosing that**: the browser pane's console buffer persists across server restarts, so the old crash kept appearing in it after the fix. The `?v=` hashes in a stale error match no currently-loaded module — compare them against `performance.getEntriesByType('resource')` rather than trusting the console.

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
- **`App.css` is imported FIRST in `App.tsx`**, before any component that ships its own stylesheet. Vite emits CSS in import order, so while that line sat last, every rule in App.css won each specificity *tie* against a component sheet — and which one applied depended on nothing a reader of either file could see. If a component's own color or spacing is mysteriously not applying, check this before adding `!important`.
