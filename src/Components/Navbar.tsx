import React from 'react'
import useLocalStorage from 'use-local-storage';

function Navbar({switchTheme}:any, props:any) {
  return (
    <div>
        <nav className="nav">
            <a href="" className="name">KJ</a>
            <label className="switch">
                <input type="checkbox" onClick={switchTheme} checked={props.checke} ></input>
              <span className="slider round"></span>
            </label>
        </nav>
    </div>
  )
}

export default Navbar;