import React from 'react'
import './../styling/components/Nav.css'

function Navbar({ switchTheme, isChecked }: any) {
  return (
    <nav className="nav">
      <a href="/" className="name">Kian Javaheri</a>
      <div className="nav-links">
        <a href="#about">About</a>
        <a href="#experience">Experience</a>
        <a href="#projects">Work</a>
        <a href="#skills">Skills</a>
        <a href="#courses">Courses</a>
        <a href="#contact">Contact</a>
        <span className="theme-toggle" onClick={switchTheme}>
          {isChecked() ? 'Light' : 'Dark'}
        </span>
      </div>
    </nav>
  )
}

export default Navbar;
