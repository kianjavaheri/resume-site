import React, { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useModalChrome } from './useModalChrome'
import SearchIcon from './SearchIcon'
import { PALETTE_EVENT } from './openPalette'
import { excerpt, search } from '../content/search'
import type { SearchEntry, SearchKind } from '../content/search'
import './../styling/components/Palette.css'

// The palette is mounted once, in App.tsx, so it works on the home page and on
// a reading page alike. Its two trigger chips — one in the nav bar, one in the
// paper top bar — reach it through the event in ./openPalette, which is a
// separate module so this one stays Fast-Refreshable.

const KIND_LABEL: Record<SearchKind, string> = {
  section: 'Section',
  project: 'Project',
  course: 'Course',
  skill: 'Skill',
  heading: 'Heading',
  text: 'In text',
}

function isTyping(target: EventTarget | null) {
  const el = target as HTMLElement | null
  if (!el || !el.tagName) return false
  return (
    el.tagName === 'INPUT' ||
    el.tagName === 'TEXTAREA' ||
    el.tagName === 'SELECT' ||
    el.isContentEditable
  )
}

// Every occurrence of every term, merged where they overlap, so a two-word
// query doesn't nest one <mark> inside another.
function highlight(text: string, query: string): React.ReactNode {
  const terms = query.trim().toLowerCase().split(/\s+/).filter(Boolean)
  if (!terms.length) return text
  const lower = text.toLowerCase()

  const spans: [number, number][] = []
  for (const term of terms) {
    let i = lower.indexOf(term)
    while (i !== -1) {
      spans.push([i, i + term.length])
      i = lower.indexOf(term, i + term.length)
    }
  }
  if (!spans.length) return text
  spans.sort((a, b) => a[0] - b[0])

  const merged: [number, number][] = []
  for (const span of spans) {
    const last = merged[merged.length - 1]
    if (last && span[0] <= last[1]) last[1] = Math.max(last[1], span[1])
    else merged.push([span[0], span[1]])
  }

  const out: React.ReactNode[] = []
  let at = 0
  merged.forEach(([from, to], k) => {
    if (from > at) out.push(text.slice(at, from))
    out.push(
      <mark key={k} className="palette-mark">
        {text.slice(from, to)}
      </mark>
    )
    at = to
  })
  if (at < text.length) out.push(text.slice(at))
  return out
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const [query, setQuery] = useState('')
  const [sel, setSel] = useState(0)
  const navigate = useNavigate()
  const location = useLocation()
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)

  // Body scroll lock and Escape, shared with the PDF modal.
  useModalChrome(onClose)

  const results = useMemo(() => search(query), [query])

  useEffect(() => setSel(0), [query])

  // Focus in on open, and hand focus back to whatever opened it on close.
  useEffect(() => {
    const previous = document.activeElement as HTMLElement | null
    inputRef.current?.focus()
    return () => previous?.focus?.()
  }, [])

  // Arrow keys move a highlight rather than focus (the aria-activedescendant
  // pattern), so the input keeps focus and keeps taking keystrokes.
  useEffect(() => {
    listRef.current
      ?.querySelector('[data-active="true"]')
      ?.scrollIntoView({ block: 'nearest' })
  }, [sel, results])

  const run = (entry: SearchEntry) => {
    onClose()
    // After the overlay is actually gone: useModalChrome restores the body's
    // scrolling in a passive effect cleanup, which runs after this handler
    // returns. Scrolling before that fights a locked page.
    requestAnimationFrame(() => {
      if (entry.path.startsWith('/papers/')) {
        navigate(entry.hash ? `${entry.path}#${entry.hash}` : entry.path)
        return
      }
      // Already home: scroll, rather than pushing a second history entry for
      // the page the reader is already on.
      if (location.pathname === '/') {
        if (entry.focus) {
          document.getElementById(entry.focus)?.scrollIntoView({ behavior: 'smooth' })
        }
        return
      }
      navigate('/', { state: entry.focus ? { focus: entry.focus } : null })
    })
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (!results.length) return
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSel((s) => (s + 1) % results.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSel((s) => (s - 1 + results.length) % results.length)
    } else if (e.key === 'Enter') {
      e.preventDefault()
      run(results[sel])
    }
  }

  return (
    <div
      className="palette-overlay"
      // mousedown, not click: a drag that starts inside the panel and ends on
      // the backdrop shouldn't close it.
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose()
      }}
    >
      <div className="palette" role="dialog" aria-modal="true" aria-label="Search this site">
        <div className="palette-field">
          <SearchIcon />
          <input
            ref={inputRef}
            className="palette-input"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Search sections, projects and the papers"
            role="combobox"
            aria-expanded="true"
            aria-controls="palette-results"
            aria-autocomplete="list"
            aria-activedescendant={results[sel] ? `palette-opt-${sel}` : undefined}
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="palette-key">Esc</kbd>
        </div>

        <div
          className="palette-results"
          id="palette-results"
          role="listbox"
          aria-label="Results"
          ref={listRef}
        >
          {results.length === 0 ? (
            <p className="palette-empty">Nothing matches “{query.trim()}”.</p>
          ) : (
            results.map((entry, i) => (
              <div
                key={`${entry.path}${entry.hash ?? ''}-${entry.kind}-${i}`}
                id={`palette-opt-${i}`}
                role="option"
                aria-selected={i === sel}
                data-active={i === sel}
                className={`palette-row${i === sel ? ' palette-row-active' : ''}`}
                onMouseMove={() => setSel(i)}
                onClick={() => run(entry)}
              >
                <span className="palette-row-main">
                  <span className="palette-row-title">
                    {highlight(entry.title, query)}
                    {entry.subtitle ? (
                      <span className="palette-row-sub"> · {entry.subtitle}</span>
                    ) : null}
                  </span>
                  {entry.kind === 'text' && entry.body ? (
                    <span className="palette-row-snippet">
                      {highlight(excerpt(entry.body, query), query)}
                    </span>
                  ) : null}
                </span>
                <span className="palette-row-kind">{KIND_LABEL[entry.kind]}</span>
              </div>
            ))
          )}
        </div>

        <div className="palette-foot" aria-hidden="true">
          <span>↑↓ navigate</span>
          <span>Enter open</span>
          <span>Esc close</span>
        </div>

        <span className="visually-hidden" aria-live="polite">
          {results.length} result{results.length === 1 ? '' : 's'}
        </span>
      </div>
    </div>
  )
}

function CommandPalette() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onOpen = () => setOpen(true)
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && !e.altKey && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setOpen((v) => !v)
        return
      }
      // A bare "/" is the other convention for this. It costs nothing as long
      // as it can never fire while the reader is typing into something.
      if (e.key === '/' && !e.metaKey && !e.ctrlKey && !e.altKey && !isTyping(e.target)) {
        e.preventDefault()
        setOpen(true)
      }
    }
    window.addEventListener(PALETTE_EVENT, onOpen)
    window.addEventListener('keydown', onKey)
    return () => {
      window.removeEventListener(PALETTE_EVENT, onOpen)
      window.removeEventListener('keydown', onKey)
    }
  }, [])

  if (!open) return null
  return <PaletteDialog onClose={() => setOpen(false)} />
}

export default CommandPalette
