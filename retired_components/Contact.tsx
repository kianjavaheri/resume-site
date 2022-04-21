import React from 'react'
import lilogo from '../svgs/linkedin.svg'
import iglogo from '../svgs/instagram.svg'
import twlogo from '../svgs/twitter.svg'

function Contact() {
  return (
    <div>
        <h1 className="contact-header">Get in Contact!</h1>
        <section className="contact-container">
            <div>
                <a href="https://www.gmail.com" target="_blank">kianjavaheri911@gmail.com</a>
                <div className="media-container">
                  <a href="https://www.linkedin.com/in/kian-javaheri-abb134227/" target="_blank"><img src={lilogo}></img></a>
                  <a href="https://www.instagram.com/kian_javaheri911/" target="_blank"><img src={iglogo}></img></a>
                  <a href="https://twitter.com/kaewjae5" target="_blank"><img src={twlogo}></img></a>
                </div>
            </div>
        </section>
    </div>
  )
}

export default Contact;
