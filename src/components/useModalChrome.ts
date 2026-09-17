import { useEffect } from 'react'

/**
 * The bits every overlay on the site needs: the page behind it stops
 * scrolling, and Escape closes it. Shared by PdfModal and ImageLightbox so the
 * two can't drift apart.
 *
 * `pinViewport` freezes the viewport meta while open, which stops iOS Safari
 * pinch-zooming the *page* when the gesture was meant for the content. The PDF
 * viewer wants that, because the iframe handles its own gestures. The image
 * lightbox does not: pinching to zoom a chart is the whole point of opening it.
 */
export function useModalChrome(onClose: () => void, pinViewport = false) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement | null
    const prevContent = viewport ? viewport.content : null
    if (pinViewport && viewport) {
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    }

    return () => {
      document.body.style.overflow = ''
      if (pinViewport && viewport && prevContent !== null) viewport.content = prevContent
    }
  }, [pinViewport])

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [onClose])
}
