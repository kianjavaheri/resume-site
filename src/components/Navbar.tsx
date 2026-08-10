import React, { useState } from 'react'
import './../styling/components/Nav.css'

function Navbar({ switchTheme, isChecked }: any) {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '/')
    close()
  }

  return (
    <>
      <nav className="nav">
        <a href="/" className="name" onClick={close}>Kian Javaheri</a>

        <div className="nav-links">
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#education" onClick={scrollTo('education')}>Education</a>
          <a href="#experience" onClick={scrollTo('experience')}>Experience</a>
          <a href="#projects" onClick={scrollTo('projects')}>Work</a>
          <a href="#skills" onClick={scrollTo('skills')}>Skills</a>
          <a href="#courses" onClick={scrollTo('courses')}>Courses</a>
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
          <a href="#courses" onClick={scrollTo('courses')}>Courses</a>
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
