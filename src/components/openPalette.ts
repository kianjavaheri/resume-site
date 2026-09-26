// The command palette's outside handles, kept OUT of CommandPalette.tsx.
//
// A module that exports both a React component and plain functions can't be
// Fast Refreshed — Vite invalidates the whole module on every edit and says so
// in the console ("openPalette export is incompatible"). Splitting the two
// non-component exports out costs one file and restores hot reloading.
//
// The trigger is an event rather than a context because there is exactly one
// thing to say — "open" — and no state for a provider to hold. The chips in
// the nav bar and the paper top bar both dispatch it.
export const PALETTE_EVENT = 'kj:palette'

export const openPalette = () => window.dispatchEvent(new Event(PALETTE_EVENT))

// The label on the trigger chips' tooltips. U+2318 is not emoji-capable — it
// sits outside every range in emoji-data.txt, unlike ⌨ U+2328 two codepoints
// along — so it is safe as typed copy (see CLAUDE.md, "No emoji glyphs").
export const shortcutLabel = () =>
  /Mac|iPhone|iPad/i.test(navigator.platform || navigator.userAgent) ? '⌘K' : 'Ctrl K'
