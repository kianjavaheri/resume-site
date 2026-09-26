import React, { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Footer from '../components/Footer'
import ArrowBack from '../components/ArrowBack'
import { hasAppHistory } from '../components/useScrollRestore'
import { useTheme } from '../components/useTheme'
import { works } from '../content/projects'
import './../styling/pages/Paper.css'

/**
 * The catch-all route, and the unknown-slug case on a reading page.
 *
 * Both used to fall through to nothing: App.tsx matched only `/` and
 * `/papers/:slug`, so a typo or a stale link rendered an empty div — a blank
 * white page with no theme, no chrome and no way out.
 *
 * It wears the reading pages' chrome rather than the home page's, because the
 * nav bar's six links scroll to sections that only exist on the home page.
 * The project list is here for the same reason it is a good 404 anywhere: the
 * reader was looking for something, and these are the six things to look at.
 */
function NotFound({
  eyebrow = '404',
  title = 'Page not found',
  message = "That address doesn't lead anywhere on this site — it may have been mistyped, or a link to it may be out of date.",
}: {
  eyebrow?: string
  title?: string
  message?: string
}) {
  const { theme, switchTheme, isChecked } = useTheme()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = `${title} — Kian Javaheri`
    return () => {
      document.title = 'Kian Javaheri'
    }
  }, [title])

  return (
    <div className="paper" data-theme={theme}>
      <div className="paper-topbar">
        <div className="paper-topbar-left">
          {/* Only when there is something of ours behind us. Landing here from
              outside the site, "back" would throw the reader off it. */}
          {hasAppHistory() ? (
            <button
              type="button"
              className="paper-back-btn"
              onClick={() => navigate(-1)}
              aria-label="Go back"
              title="Go back"
            >
              <ArrowBack />
            </button>
          ) : null}
          <Link to="/" className="paper-back">Kian Javaheri</Link>
        </div>
        <span className="paper-theme-toggle" onClick={switchTheme}>
          {isChecked() ? 'Light' : 'Dark'}
        </span>
      </div>

      <div className="paper-inner">
        <header className="paper-head">
          <p className="paper-eyebrow">{eyebrow}</p>
          <h1 className="paper-title">{title}</h1>
        </header>

        <div className="notfound-body">
          <p className="paper-para">{message}</p>

          <p className="notfound-label">Somewhere to go instead</p>
          <nav className="notfound-links" aria-label="Elsewhere on this site">
            <Link to="/">The home page</Link>
            {works.map((w) => (
              <Link key={w.to} to={w.to}>
                {w.navLabel ?? w.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <Footer />
    </div>
  )
}

export default NotFound
