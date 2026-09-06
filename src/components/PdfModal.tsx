import React, { useEffect, useCallback } from 'react'

// PDF open parameters: `pagemode=none` asks for neither the outline nor the
// thumbnail panel; `navpanes=0` is Adobe's equivalent. Viewers that don't
// recognise them ignore the fragment, so this degrades harmlessly.
export const withViewerParams = (src: string) =>
  `${src.split('#')[0]}#pagemode=none&navpanes=0`

interface PdfModalProps {
  src: string
  onClose: () => void
}

function PdfModal({ src, onClose }: PdfModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'

    // Prevent page-level pinch-zoom while modal is open (iOS Safari).
    // The iframe's PDF viewer still handles its own touch gestures.
    const viewport = document.querySelector('meta[name=viewport]') as HTMLMetaElement | null
    const prevContent = viewport ? viewport.content : null
    if (viewport) {
      viewport.content = 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
    }

    return () => {
      document.body.style.overflow = ''
      if (viewport && prevContent !== null) viewport.content = prevContent
    }
  }, [])

  const handleKey = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
  }, [onClose])

  useEffect(() => {
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [handleKey])

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={e => e.stopPropagation()}>
        <div className="pdf-modal-bar">
          <button type="button" className="pdf-close" onClick={onClose} aria-label="Close">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
            </svg>
          </button>
        </div>
        <iframe src={withViewerParams(src)} className="pdf-frame" title="Document viewer" />
      </div>
    </div>
  )
}

export default PdfModal
