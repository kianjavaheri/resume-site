import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTwitter, faLinkedin, faGithub, faYoutube } from '@fortawesome/free-brands-svg-icons';

function Contact() {
  return (
    <div>
        <section className="contact-container">
            <ul className="wrapper">
                
                <a href="https://twitter.com/kaewjae5" target="_blank" rel="noopener noreferrer">
                    <li className="icon twitter">
                        <span className="tooltip">Twitter</span>
                        <FontAwesomeIcon icon={faTwitter} />
                    </li>
                </a>

                <a href="https://www.linkedin.com/in/kian-javaheri-abb134227/" target="_blank" rel="noopener noreferrer">
                    <li className="icon linkedin">
                        <span className="tooltip">LinkedIn</span>
                        <FontAwesomeIcon icon={faLinkedin} />
                    </li>
                </a>

                <a href="https://github.com/kianjavaheri" target="_blank" rel="noopener noreferrer">
                    <li className="icon github">
                        <span className="tooltip">Github</span>
                        <FontAwesomeIcon icon={faGithub} />
                    </li>
                </a>

                <a href="https://www.youtube.com/channel/UC7diTWt3gPyKM8nIQpQAvZw" target="_blank" rel="noopener noreferrer">
                    <li className="icon youtube">
                        <span className="tooltip">Youtube</span>
                        <FontAwesomeIcon icon={faYoutube} />
                    </li>
                </a>

            </ul>
        </section>
    </div>
  )
}

export default Contact;