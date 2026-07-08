import React, { useState } from 'react'
import './../styling/components/Nav.css'

function Navbar({ switchTheme, isChecked }: any) {
  const [menuOpen, setMenuOpen] = useState(false)

  const close = () => setMenuOpen(false)

  return (
    <>
      <nav className="nav">
        <a href="/" className="name" onClick={close}>Kian Javaheri</a>

        <div className="nav-links">
          <a href="#about">About</a>
          <a href="#education">Education</a>
          <a href="#experience">Experience</a>
          <a href="#projects">Work</a>
          <a href="#skills">Skills</a>
          <a href="#courses">Courses</a>
          <a href="#contact">Contact</a>
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
          <a href="#about" onClick={close}>About</a>
          <a href="#education" onClick={close}>Education</a>
          <a href="#experience" onClick={close}>Experience</a>
          <a href="#projects" onClick={close}>Work</a>
          <a href="#skills" onClick={close}>Skills</a>
          <a href="#courses" onClick={close}>Courses</a>
          <a href="#contact" onClick={close}>Contact</a>
          <span className="mobile-theme-toggle" onClick={() => { switchTheme(); close(); }}>
            {isChecked() ? 'Light' : 'Dark'}
          </span>
        </div>
      )}
    </>
  )
}

export default Navbar;
