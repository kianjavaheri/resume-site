import React from 'react'
import { useModalChrome } from './useModalChrome'

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
  // Pins the viewport: the iframe's PDF viewer handles its own touch gestures,
  // so page-level pinch-zoom on iOS Safari is never what was meant.
  useModalChrome(onClose, true)

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
