import { useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage'

const query = () => window.matchMedia('(prefers-color-scheme: dark)')

// Shared by every page. 'system' follows the OS setting and stays live;
// 'light'/'dark' are explicit overrides that pin it. See the Theme section of
// CLAUDE.md — the key is 'theme-pref', never 'theme'.
export function useTheme() {
  const [preference, setPreference] = useLocalStorage('theme-pref', 'system')
  const [systemTheme, setSystemTheme] = useState(() => (query().matches ? 'dark' : 'light'))

  useEffect(() => {
    const mq = query()
    const onChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  const theme = preference === 'system' ? systemTheme : preference

  /* Mirrored onto <html> so the theme tokens resolve at the root as well as on
   * the page div. The scrollbar needs that: it is painted by the root element,
   * so a custom property it reads must be defined there.
   *
   * ALL THREE OF THESE ARE WHAT index.html's PRE-PAINT SCRIPT SETS, and all
   * three have to be kept current — not just the attribute. That script runs
   * once, before React mounts, and writes `data-theme`, `color-scheme` and an
   * inline background; this effect used to re-write only the first of them, so
   * after a runtime theme switch the root kept its LOAD-TIME `color-scheme`
   * forever.
   *
   * That was a real, reported bug and the symptom was nowhere near the cause:
   * the command palette's text came out inverted. `.palette-row-title` sets no
   * `color` of its own, so it inherits — and the palette renders outside
   * `.home`/`.paper`, which means it inherits the UA's DEFAULT text color,
   * which is exactly what `color-scheme` controls. Load light, switch to dark,
   * and the rows stayed black on a dark panel; load dark and switch to light
   * and they stayed white. Whether it looked wrong depended on which theme the
   * page was loaded in, which is why it read as intermittent.
   *
   * The background is read from `--page-base` rather than repeated as a hex,
   * because by the time React runs App.css is loaded and the token is the
   * source of truth. The pre-paint script still carries literals — it runs
   * before any stylesheet — and its own comment says to keep them in step.
   */
  useEffect(() => {
    const root = document.documentElement
    root.setAttribute('data-theme', theme)
    root.style.colorScheme = theme
    const base = getComputedStyle(root).getPropertyValue('--page-base').trim()
    if (base) root.style.background = base
  }, [theme])
  const switchTheme = () => setPreference(theme === 'light' ? 'dark' : 'light')
  const isChecked = () => theme === 'dark'

  return { theme, switchTheme, isChecked }
}
