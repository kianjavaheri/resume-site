import React, { useEffect, useRef, useState } from 'react'
import AnchorIcon from './AnchorIcon'
import CheckIcon from './CheckIcon'

/**
 * The copy-link control that appears beside a heading on hover or focus.
 *
 * It is a real `<a href="#id">`, not a button, so the browser's own "Copy link
 * address" still works and the destination is visible on hover — but its click
 * copies the ABSOLUTE url rather than jumping, because a reader who wants to
 * point someone at a section wants the link, and is already looking at it.
 *
 * It stays in the tab order. Hiding it with `display: none` until hover would
 * make the whole feature mouse-only, and `opacity: 0` on a focusable element is
 * the standard way around that — it reveals itself on `:focus-visible`.
 */
function HeadingAnchor({ id }: { id: string }) {
  const [copied, setCopied] = useState(false)
  const timer = useRef<number>()

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const copy = async (e: React.MouseEvent) => {
    e.preventDefault()
    const url = `${window.location.origin}${window.location.pathname}#${id}`
    // The address bar gets the link either way, so a clipboard that refuses —
    // an insecure origin, a denied permission — still leaves the reader
    // something they can copy by hand. `replaceState` rather than setting
    // `location.hash`, which would also scroll.
    window.history.replaceState(null, '', `#${id}`)
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 1600)
    } catch {
      // No flash: nothing was copied, and claiming otherwise would be a lie.
    }
  }

  return (
    <a
      href={`#${id}`}
      className="paper-anchor"
      onClick={copy}
      aria-label={copied ? 'Link copied' : 'Copy link to this heading'}
      title={copied ? 'Link copied' : 'Copy link'}
    >
      {copied ? <CheckIcon /> : <AnchorIcon />}
      {/* The label above changes on an element that already has focus, which is
          not reliably re-announced. This region is. */}
      <span className="visually-hidden" aria-live="polite">
        {copied ? 'Link copied' : ''}
      </span>
    </a>
  )
}

export default HeadingAnchor
