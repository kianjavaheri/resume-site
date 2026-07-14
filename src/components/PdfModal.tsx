import React, { useState, useEffect, useCallback, useRef } from 'react'
import { Document, Page, pdfjs } from 'react-pdf'
import workerSrc from 'pdfjs-dist/build/pdf.worker.min.mjs?url'
import 'react-pdf/dist/Page/TextLayer.css'

pdfjs.GlobalWorkerOptions.workerSrc = workerSrc

interface PdfModalProps {
  src: string
  onClose: () => void
}

function PdfModal({ src, onClose }: PdfModalProps) {
  const [numPages, setNumPages] = useState(0)
  const [pageWidth, setPageWidth] = useState(0)
  const pagesRef = useRef<HTMLDivElement>(null)

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

  useEffect(() => {
    const el = pagesRef.current
    if (!el) return
    const update = () => setPageWidth(el.clientWidth)
    update()
    const observer = new ResizeObserver(update)
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <div className="pdf-overlay" onClick={onClose}>
      <div className="pdf-modal" onClick={e => e.stopPropagation()}>
        <button type="button" className="pdf-close" onClick={onClose} aria-label="Close">×</button>
        <div className="pdf-pages" ref={pagesRef}>
          <Document
            file={src}
            loading={<div className="pdf-status">Loading document…</div>}
            error={<div className="pdf-status">Failed to load document.</div>}
            onLoadSuccess={({ numPages }) => setNumPages(numPages)}
          >
            {pageWidth > 0 && Array.from({ length: numPages }, (_, i) => (
              <Page
                key={i}
                pageNumber={i + 1}
                width={pageWidth}
                className="pdf-page"
                renderAnnotationLayer={false}
              />
            ))}
          </Document>
        </div>
      </div>
    </div>
  )
}

export default PdfModal
