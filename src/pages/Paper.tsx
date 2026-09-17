import React, { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Footer from '../components/Footer'
import ScrollButton from '../components/Scroll'
import ArrowOut from '../components/ArrowOut'
import { useTheme } from '../components/useTheme'
import { papers } from '../content/papers'
import './../styling/pages/Paper.css'

function Paper() {
  const { slug } = useParams()
  const paper = slug ? papers[slug] : undefined
  const { theme, switchTheme, isChecked } = useTheme()
  const [activeId, setActiveId] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [slug])

  useEffect(() => {
    if (!paper) return
    document.title = `${paper.title} — Kian Javaheri`
    return () => { document.title = 'Kian Javaheri' }
  }, [paper])

  // Highlights the section you're reading. Deterministic on purpose: the
  // active one is the last heading scrolled past. An IntersectionObserver
  // watching a band near the top of the viewport left nothing highlighted
  // whenever a jump landed between two headings.
  useEffect(() => {
    if (!paper) return
    const ids = [...paper.sections.map((s) => s.id), ...(paper.references?.length ? ['references'] : [])]
    const update = () => {
      let current = ids[0] ?? ''
      for (const id of ids) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= 120) current = id
      }
      setActiveId(current)
    }
    update()
    window.addEventListener('scroll', update, { passive: true })
    window.addEventListener('resize', update)
    return () => {
      window.removeEventListener('scroll', update)
      window.removeEventListener('resize', update)
    }
  }, [paper])

  const jumpTo = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault()
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setActiveId(id)
  }

  if (!paper) {
    return (
      <div className="paper" data-theme={theme}>
        <div className="paper-inner paper-missing">
          <p className="paper-missing-text">That paper doesn't exist.</p>
          <Link to="/" className="paper-back">Back to the site</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="paper" data-theme={theme}>
      <div className="paper-topbar">
        <Link to="/" className="paper-back">Kian Javaheri</Link>
        <span className="paper-theme-toggle" onClick={switchTheme}>
          {isChecked() ? 'Light' : 'Dark'}
        </span>
      </div>

      <div className="paper-inner">
        <header className="paper-head">
          <p className="paper-eyebrow">{paper.eyebrow}</p>
          <h1 className="paper-title">{paper.title}</h1>
          <div className="paper-meta">
            {paper.meta.map((m) => (
              <span key={m.label} className="paper-meta-item">
                <span className="paper-meta-label">{m.label}</span>
                {m.value}
              </span>
            ))}
          </div>
          {paper.actions.length > 0 && (
            <div className="paper-actions">
              {paper.actions.map((a) => (
                <a
                  key={a.label}
                  href={a.pdfSrc ?? a.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="paper-link"
                >
                  {a.label}<ArrowOut />
                </a>
              ))}
            </div>
          )}
        </header>

        <div className="paper-layout">
          {/* Hidden below 900px, where there's no room beside the text. */}
          <nav className="paper-toc" aria-label="Contents">
            <p className="paper-toc-label">Contents</p>
            {paper.sections.map((s) => (
              <a
                key={s.id}
                href={`#${s.id}`}
                onClick={jumpTo(s.id)}
                className={`paper-toc-link ${activeId === s.id ? 'paper-toc-active' : ''}`}
              >
                {s.title}
              </a>
            ))}
            {paper.references?.length ? (
              <a
                href="#references"
                onClick={jumpTo('references')}
                className={`paper-toc-link ${activeId === 'references' ? 'paper-toc-active' : ''}`}
              >
                References
              </a>
            ) : null}
          </nav>

          <article className="paper-article">
            {paper.sections.map((s) => (
              <section key={s.id} className="paper-section">
                <h2 id={s.id} className="paper-section-title">{s.title}</h2>
                {s.blocks.map((b, i) => {
                  if (b.type === 'figure') {
                    return (
                      <figure key={i} className="paper-figure">
                        <img
                          src={b.src}
                          alt={b.caption || ''}
                          width={b.width}
                          height={b.height}
                          loading="lazy"
                        />
                        {b.caption ? <figcaption>{b.caption}</figcaption> : null}
                      </figure>
                    )
                  }
                  if (b.type === 'h3') {
                    return <h3 key={i} className="paper-subheading">{b.text}</h3>
                  }
                  if (b.type === 'quote') {
                    return <blockquote key={i} className="paper-quote">{b.text}</blockquote>
                  }
                  return <p key={i} className="paper-para">{b.text}</p>
                })}
              </section>
            ))}

            {paper.references?.length ? (
              <section className="paper-section">
                <h2 id="references" className="paper-section-title">References</h2>
                <ul className="paper-references">
                  {paper.references.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </section>
            ) : null}
          </article>
        </div>
      </div>

      <Footer />
      <ScrollButton />
    </div>
  )
}

export default Paper;
