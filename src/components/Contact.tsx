import React from 'react'
import ArrowOut from './ArrowOut'
import './../styling/components/Contact.css'

const links = [
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/kian-javaheri-abb134227/' },
  { label: 'GitHub', href: 'https://github.com/kianjavaheri' },
  { label: 'YouTube', href: 'https://www.youtube.com/channel/UC7diTWt3gPyKM8nIQpQAvZw' },
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
            target="_blank"
            rel="noopener noreferrer"
            className="contact-card"
          >
            <span className="contact-card-label">{l.label}</span>
            <ArrowOut className="contact-card-arrow" />
          </a>
        ))}
      </div>
    </section>
  )
}

export default Contact;
