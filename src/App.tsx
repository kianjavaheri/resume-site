import React from 'react';
import './App.css';

import About from './Components/About';
import Contact from './Components/Contact';
import Navbar from './Components/Navbar';
import Proficiency from './Components/Proficiency';
import ScrollButton from './Components/Scroll';
import Projects from './Components/Projects';

import useLocalStorage from 'use-local-storage';


function App() {
  const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const [theme, setTheme] = useLocalStorage('theme', defaultDark ? 'light' : 'dark');
  var check = false
  const switchTheme = () => {
  const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    check = !check
  }
  console.log(check)
  
  return (
    <div className="App" data-theme={theme}>
        <Navbar switchTheme={switchTheme} checked={check}/>
        <About/>
        <hr className="divider"/>
        <Projects/>
        <hr className="divider"/>
        <Proficiency/>
        <hr className="divider"/>
        <Contact/>
        <ScrollButton/>
    </div>
  );
}

export default App;
