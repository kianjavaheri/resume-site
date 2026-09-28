import React, { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { works } from '../content/projects'
import SearchIcon from './SearchIcon'
import CaretDown from './CaretDown'
import { openPalette, shortcutLabel } from './openPalette'
import './../styling/components/Nav.css'

function Navbar({ switchTheme, isChecked }: any) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [pastAbout, setPastAbout] = useState(false)

  // Dock the pill to the top of the screen once the About card has scrolled
  // past — i.e. as soon as the reader leaves the intro and starts on the
  // content. This replaces a "past 50% of the page" rule, which had two
  // problems: the halfway point MOVED every time a section was expanded or
  // collapsed, so the same scroll position docked or didn't depending on what
  // was open; and on a long page it left the bar floating far past the point
  // where it had stopped being a header.
  //
  // About is the right anchor because it is the one card that never collapses
  // (`card-header-static`), so its own height is fixed and the threshold is
  // stable no matter what the reader opens below it.
  //
  // The scroll handler still only reads scrollY — no layout. The threshold is
  // measured on resize AND via a ResizeObserver on body, because expanding a
  // section changes the document without firing a resize.
  useEffect(() => {
    let threshold = 0
    const check = () => setPastAbout(threshold > 0 && window.scrollY > threshold)
    const measure = () => {
      const about = document.getElementById('about')
      // The card's bottom edge, less the floating bar's own footprint
      // (top 12 + height 56), so the bar docks exactly as the card goes under
      // it rather than a bar's height later.
      threshold = about
        ? about.getBoundingClientRect().top + window.scrollY + about.offsetHeight - 68
        : 0
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

  // Never dock while the mobile menu is open: the menu panel hangs from the
  // bar's floating position, and docking would move the bar out from under it.
  //
  // `docked` is therefore the bar's CURRENT LOOK, which the open menu
  // suppresses, while `pastAbout` is the durable "the header has scrolled
  // away" fact. The command palette needs the second one, not the first --
  // see the data attribute on <nav> below.
  const docked = pastAbout && !menuOpen

  const close = () => setMenuOpen(false)

  // ---- Projects dropdown -------------------------------------------------
  // A POINTER affordance, not a menu widget, and the panel is a sibling of
  // <nav> rather than a child of the link. Both of those are forced by one
  // thing: `.nav` has `overflow: hidden` (it clips the name and the links as
  // the pill collapses), and `position: fixed` does NOT escape it either,
  // because the pill's own `backdrop-filter` makes it the containing block for
  // fixed descendants. So a panel inside the bar is clipped, full stop.
  //
  // Out here it can't be in the link's tab order or reached by `:focus-within`,
  // so it isn't announced as a popup and doesn't claim to be one. It only ever
  // enhances: clicking "Projects" still scrolls to the grid, where all six are
  // links, and the mobile menu keeps its plain Projects entry.
  const [projectsOpen, setProjectsOpen] = useState(false)
  const [drop, setDrop] = useState({ left: 0, top: 0 })
  const navRef = useRef<HTMLElement>(null)
  const projectsRef = useRef<HTMLAnchorElement>(null)
  const closeTimer = useRef<number>()

  // Both coordinates are measured rather than hard-coded, because the bar sits
  // at two heights now: floating at top 12 and docked at top 0.
  const openProjects = () => {
    window.clearTimeout(closeTimer.current)
    const link = projectsRef.current
    const nav = navRef.current
    if (link && nav) {
      setDrop({ left: link.getBoundingClientRect().left, top: nav.getBoundingClientRect().bottom })
    }
    setProjectsOpen(true)
  }

  // A short delay, so a pointer that clips a corner on the way from the link to
  // the panel doesn't drop the menu. The gap between the two is bridged by the
  // panel's own transparent top padding, so this only covers the diagonal.
  const closeProjects = () => {
    window.clearTimeout(closeTimer.current)
    closeTimer.current = window.setTimeout(() => setProjectsOpen(false), 120)
  }

  // The bar moves out from under the panel on the way to the top, and after a
  // resize the panel would be left pointing at nothing.
  useEffect(() => {
    setProjectsOpen(false)
  }, [docked])

  useEffect(() => {
    if (!projectsOpen) return
    const onResize = () => setProjectsOpen(false)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [projectsOpen])

  useEffect(() => () => window.clearTimeout(closeTimer.current), [])

  const scrollTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    history.replaceState(null, '', '/')
    close()
  }

  return (
    <>
      {/* `data-past-about` is NOT the same thing as `.nav-docked`, and the
          difference is the whole point of it. The mobile menu forces the bar
          undocked, and the menu's Search row closes the menu and opens the
          palette in one click -- so a palette reading `.nav-docked` sees the
          class the menu had just suppressed, takes the glass, and then sits
          over a bar that re-docks flat behind it. This attribute ignores the
          menu, so the palette matches the bar it will actually be covering. */}
      <nav
        ref={navRef}
        className={`nav ${docked ? 'nav-docked' : ''}`}
        data-past-about={pastAbout ? 'true' : 'false'}
      >
        <a href="/" className="name" onClick={close}>
          Kian Javaheri
        </a>

        <div className="nav-links">
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#education" onClick={scrollTo('education')}>Education</a>
          <a href="#experience" onClick={scrollTo('experience')}>Experience</a>
          {/* The one link that expands, and the caret is what says so. It
              flips to point UP from `projectsOpen` rather than from a CSS
              :hover, because the pointer leaves the link the moment it moves
              down onto the panel -- a :hover flip would snap the caret back
              down while the menu it describes was still open. */}
          <a
            href="#projects"
            ref={projectsRef}
            className={`nav-has-menu${projectsOpen ? ' nav-menu-open' : ''}`}
            onClick={scrollTo('projects')}
            onMouseEnter={openProjects}
            onMouseLeave={closeProjects}
          >
            Projects
            <CaretDown />
          </a>
          <a href="#skills" onClick={scrollTo('skills')}>Skills</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
          {/* Icon only, and deliberately so: the bar's links already run to
              509px of a 657px row at the 769px breakpoint, and a chip carrying
              the shortcut as text would overflow a bar that clips what it can't
              fit. The shortcut lives in the tooltip instead. */}
          <button
            type="button"
            className="nav-search"
            onClick={openPalette}
            aria-label="Search"
            title={`Search (${shortcutLabel()})`}
          >
            <SearchIcon />
          </button>
          <span className="theme-toggle" onClick={switchTheme}>
            {isChecked() ? 'Light' : 'Dark'}
          </span>
        </div>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle menu">
          {menuOpen ? 'Close' : 'Menu'}
        </button>
      </nav>

      {projectsOpen && (
        <div
          className="nav-dropdown"
          style={{ left: drop.left, top: drop.top }}
          onMouseEnter={openProjects}
          onMouseLeave={closeProjects}
        >
          {/* The outer div starts at the bar's bottom edge and no longer
              carries a top padding: the panel is FLUSH with the bar now, so
              there is no gap to bridge in the first place. The pointer's only
              journey is across the bar's own bottom padding, which the 120ms
              close delay covers. */}
          <div className="nav-dropdown-panel">
            {works.map((w) => (
              <Link key={w.to} to={w.to} onClick={() => setProjectsOpen(false)}>
                {w.navLabel ?? w.title}
              </Link>
            ))}
          </div>
        </div>
      )}

      {menuOpen && (
        <div className="mobile-menu">
          <a href="#about" onClick={scrollTo('about')}>About</a>
          <a href="#education" onClick={scrollTo('education')}>Education</a>
          <a href="#experience" onClick={scrollTo('experience')}>Experience</a>
          <a href="#projects" onClick={scrollTo('projects')}>Projects</a>
          <a href="#skills" onClick={scrollTo('skills')}>Skills</a>
          <a href="#contact" onClick={scrollTo('contact')}>Contact</a>
          <span
            className="mobile-menu-action"
            onClick={() => { close(); openPalette(); }}
          >
            Search
          </span>
          <span className="mobile-theme-toggle" onClick={() => { switchTheme(); close(); }}>
            {isChecked() ? 'Light' : 'Dark'}
          </span>
        </div>
      )}
    </>
  )
}

export default Navbar;
