import React from 'react'

function Navbar({switchTheme}:any) {
  return (
    <div>
        <nav className="nav">
            <a href="#" className="name">KJ</a>
            <label className="switch">
              <input type="checkbox" onClick={switchTheme}></input>
              <span className="slider round"></span>
            </label>
        </nav>
    </div>
  )
}

export default Navbar;