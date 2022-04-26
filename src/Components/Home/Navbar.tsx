import React from 'react'

function Navbar({switchTheme, isChecked}:any) {
  return (
    <div>
        <nav className="nav"> 
            <a href="" className="name">KJ</a>
            <label className="switch">
                <input type="checkbox" onClick={switchTheme} checked={isChecked()} ></input>
              <span className="slider round"></span>
            </label>
        </nav>
    </div>
  )
}

export default Navbar;