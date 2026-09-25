import React from 'react'
import ArrowOut from './ArrowOut'
import LinkIcon from './LinkIcon'
import './../styling/components/Contact.css'

// `icon` names come from LinkIcon's set, the same one the Projects cards draw
// from. The email card replaced a YouTube one.
const links: Array<{ label: string; href: string; icon: string }> = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kian-javaheri-abb134227/', icon: 'linkedin' },
  { label: 'GitHub', href: 'https://github.com/kianjavaheri', icon: 'github' },
  { label: 'Email', href: 'mailto:kianjavaheri911@gmail.com', icon: 'mail' },
]

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <p className="card-title contact-section-title">Contact</p>
      <div className="contact-cards">
        {links.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(l.href.startsWith('mailto:')
              ? {}
              : { target: '_blank', rel: 'noopener noreferrer' })}
            className="contact-card"
          >
            <span className="contact-card-main">
              <span className="contact-card-icon" aria-hidden="true">
                <LinkIcon kind={l.icon} />
              </span>
              <span className="contact-card-label">{l.label}</span>
            </span>
            <ArrowOut className="contact-card-arrow" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Contact;
