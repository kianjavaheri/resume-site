import React from 'react'
import Tooltip from '@mui/material/Tooltip'
import './css/Nav.css'

function Navbar({switchTheme, isChecked}:any) {
  return (
    <div>
        <nav className="nav"> 
            <a href="" className="name">KJ</a>
            <Tooltip title="Theme">
              <label className="switch">
                <input type="checkbox" onClick={switchTheme} checked={isChecked()} ></input>
                <span className="slider round"></span>
              </label>
            </Tooltip>
        </nav>
    </div>
  )
}

export default Navbar;