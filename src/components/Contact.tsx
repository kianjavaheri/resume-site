import React from 'react'
import ArrowOut from './ArrowOut'
import LinkIcon from './LinkIcon'
import { contactLinks, isMailto } from '../content/contact-links'
import './../styling/components/Contact.css'

function Contact() {
  return (
    <section id="contact" className="contact-section">
      <p className="card-title contact-section-title">Contact</p>
      <div className="contact-cards">
        {contactLinks.map((l) => (
          <a
            key={l.label}
            href={l.href}
            {...(isMailto(l.href) ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
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
