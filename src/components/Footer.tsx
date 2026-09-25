import React from 'react'
import './../styling/components/Footer.css'

function Footer() {
  return (
    <footer>
      <p className="footer-name">Kian Javaheri</p>
      <p className="footer-meta">©︎ {new Date().getFullYear()}</p>
    </footer>
  )
}

export default Footer
