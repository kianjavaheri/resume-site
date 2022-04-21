import React from 'react';
import './App.css';

import About from './Components/About';
import Contactt from './Components/Contact';
import Navbar from './Components/Navbar';
import Proficiency from './Components/Proficiency';
import ScrollButton from './Components/Scroll';
import Projects from './Components/Projects';

import useLocalStorage from 'use-local-storage';


function App() {
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
    <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} isChecked={isChecked}/>
        <About/>
        <hr className="divider"/>
        <Projects/>
        <hr className="divider"/>
        <Proficiency/>
        <hr className="divider"/>
        <Contactt />
        <ScrollButton/>
    </div>
  );
}

export default App;
