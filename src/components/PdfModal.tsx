import React, { useEffect, useCallback } from 'react'

interface PdfModalProps {
  src: string
  onClose: () => void
}

function PdfModal({ src, onClose }: PdfModalProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = '' }
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
        <button type="button" className="pdf-close" onClick={onClose} aria-label="Close">×</button>
        <iframe src={src} className="pdf-frame" title="Document viewer" />
      </div>
    </div>
  )
}

export default PdfModal
