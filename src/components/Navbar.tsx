import React, { useEffect, useState } from 'react'
import './../styling/components/Nav.css'

function Navbar({ switchTheme, isChecked }: any) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pastHalfway, setPastHalfway] = useState(false)

  // Fade the pill out past the halfway mark of the page. The scroll handler
  // only reads scrollY (no layout); page height is remeasured on resize and
  // whenever a section expands or collapses, which a resize event won't catch.
  useEffect(() => {
    let scrollable = 0
    const check = () => setPastHalfway(scrollable > 0 && window.scrollY > scrollable * 0.5)
    const measure = () => {
      scrollable = document.documentElement.scrollHeight - window.innerHeight
      check()
    }
    measure()
    window.addEventListener('scroll', check, { passive: true })
    window.addEventListener('resize', measure)
    const ro = new ResizeObserver(measure)
    ro.observe(document.body)
    return () => {
      window.removeEventListener('scroll', check)
      window.removeEventListener('resize', measure)
      ro.disconnect()
    }
  }, [])

  // Never fade while the mobile menu is open — its close button lives in the bar.
  const navHidden = pastHalfway && !menuOpen

  const close = () => setMenuOpen(false)

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '/')
    close()
  }

  return (
    <>
      <nav className={`nav ${navHidden ? 'nav-hidden' : ''}`}>
        <a href="/" className="name" onClick={close}>Kian Javaheri</a>

        <div className="nav-links">
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#education" onClick={scrollTo('education')}>Education</a>
          <a href="#experience" onClick={scrollTo('experience')}>Experience</a>
          <a href="#projects" onClick={scrollTo('projects')}>Work</a>
          <a href="#skills" onClick={scrollTo('skills')}>Skills</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
          <span className="theme-toggle" onClick={switchTheme}>
            {isChecked() ? 'Light' : 'Dark'}
          </span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#education" onClick={scrollTo('education')}>Education</a>
          <a href="#experience" onClick={scrollTo('experience')}>Experience</a>
          <a href="#projects" onClick={scrollTo('projects')}>Work</a>
          <a href="#skills" onClick={scrollTo('skills')}>Skills</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
          <span className="mobile-theme-toggle" onClick={() => { switchTheme(); close(); }}>
            {isChecked() ? 'Light' : 'Dark'}
          </span>
        </div>
      )}
    </>
  )
}

export default Navbar;
