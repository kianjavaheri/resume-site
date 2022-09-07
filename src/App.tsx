import React from 'react';
import { Routes, Route } from "react-router-dom";
import useLocalStorage from 'use-local-storage';
import './App.css';

import About from './Components/Home/About';
import Contact from './Components/Home/Contact';
import Navbar from './Components/Home/Navbar';
import Proficiency from './Components/Home/Proficiency';
import ScrollButton from './Components/Home/Scroll';
import Projects from './Components/Home/Projects';
import Resume from './Components/Home/Resume';


const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

function HomePage() {
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
        <Resume/>
        <hr className="divider"/>
        <Projects/>
        <hr className="divider"/>
        <Proficiency/>
        <hr className="divider"/>
        <Contact />
        <ScrollButton/>
    </div>
  );
}

function App() {
  const theme = useLocalStorage('theme', defaultDark ? 'light' : 'dark'); // loads default

  return (
    <div className="App" data-theme={theme}>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
    </div>
  );
}

export default App;
