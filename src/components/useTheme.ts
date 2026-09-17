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
  const switchTheme = () => setPreference(theme === 'light' ? 'dark' : 'light')
  const isChecked = () => theme === 'dark'

  return { theme, switchTheme, isChecked }
}
