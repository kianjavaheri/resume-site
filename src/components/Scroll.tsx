import React, { useEffect, useState } from 'react'
import './../styling/components/Scroll.css'

function ScrollButton() {
  const [visible, setVisible] = useState(false)

  // Registered once. Previously this ran in the render body, so every render
  // attached another listener and none were ever removed.
  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

  // Visibility is a class, not an inline `display` — display can't be animated,
  // which is why this used to pop in and out.
  return (
    <button
      type="button"
      className={`scroll-top ${visible ? 'scroll-top-visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Back to top"
      aria-hidden={!visible}
      tabIndex={visible ? 0 : -1}
    >
      <svg
        className="arrow"
        viewBox="0 0 24 24"
        width="18"
        height="18"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  )
}

export default ScrollButton;
