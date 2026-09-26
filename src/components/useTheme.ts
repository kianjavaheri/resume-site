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

  // Mirrored onto <html> so the theme tokens resolve at the root as well as on
  // the page div. The scrollbar needs that: it is painted by the root element,
  // so a custom property it reads must be defined there. index.html's pre-paint
  // script sets the same attribute before React mounts; this keeps it current.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])
  const switchTheme = () => setPreference(theme === 'light' ? 'dark' : 'light')
  const isChecked = () => theme === 'dark'

  return { theme, switchTheme, isChecked }
}
