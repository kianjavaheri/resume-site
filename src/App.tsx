import React from 'react';
import { Navigate, Routes, Route, useParams } from "react-router-dom";
// App.css FIRST, before any component that ships its own stylesheet. Vite
// emits CSS in import order, so with this line last every rule in App.css won
// each specificity TIE against a component sheet — `.palette-row-title` and
// `a { color: var(--textcolor) }` are the same 0-0-1/0-1-0 order of magnitude,
// and which one applied depended on nothing a reader of either file could see.
import './styling/App.css'
import Home from './pages/Home'
import Paper from './pages/Paper'
import NotFound from './pages/NotFound'
import CommandPalette from './components/CommandPalette'
import { Analytics } from '@vercel/analytics/react'


// The reading pages moved from /papers/:slug to /projects/:slug. Anything
// already shared at the old address — a DM, a LinkedIn post, a bookmark — has
// to keep working, so the old path stays mounted and forwards.
//
// `vercel.json` also carries a 308 for this, and that is the one that matters
// in production: it redirects before the SPA rewrite, so a crawler and the
// address bar both see the new URL rather than the app silently swapping it.
// This route is what makes the same link work in `npm start`, where there is
// no vercel.json at all.
//
// `replace`, so the dead URL doesn't sit in history and send the back button
// straight back into the redirect.
function LegacyPaperRedirect() {
  const { slug } = useParams()
  return <Navigate to={`/projects/${slug}`} replace />
}

function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/projects/:slug" element={ <Paper/> }/>
        <Route path="/papers/:slug" element={ <LegacyPaperRedirect/> }/>
        {/* Anything else. Without this, a typo matched no route and React
            rendered nothing at all — a blank white page. */}
        <Route path="*" element={ <NotFound/> }/>
      </Routes>
      {/* Mounted outside the routes so ⌘K works on every page. It reads the
          theme tokens off <html>, which useTheme mirrors them onto. */}
      <CommandPalette />
      {/* Vercel's own page-view counter. It renders nothing, and it NO-OPS off
          Vercel — in `npm start` it logs that it is in development mode and
          sends nothing, so there is no dev traffic to filter out later.

          It is the one dependency here that `src/` imports purely for
          instrumentation rather than for the bundle's output, which is worth
          knowing against the "the dependency list is deliberately short" rule:
          it is tiny and has no transitive deps of its own (`npm audit` stays
          at 0). It also has to live outside the routes, or a route change
          would unmount and remount it. */}
      <Analytics />
    </div>
  );
}

export default App;
