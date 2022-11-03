import React from 'react'
import useLocalStorage from 'use-local-storage';
import Navbar from '../Navbar';
import './css/GCSP.css'

import GCAbout from './GCAbout'

function GCSP() {
    const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'light' : 'dark');
    const switchTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
    }
    const isChecked = () => {
      if (theme === 'light') return false
      return true
    }
  // theme stuff
  
    return (
      <div>
        <Navbar switchTheme={switchTheme} isChecked={isChecked}/>
        <GCAbout />
      </div>
    );
}

export default GCSP;
