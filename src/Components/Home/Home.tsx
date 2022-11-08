import React from 'react'
import useLocalStorage from 'use-local-storage';
import './css/Home.css';

import About from './About';
import Contact from './Contact';
import Navbar from '../Navbar';
import Proficiency from './Proficiency';
import ScrollButton from './Scroll';
import Projects from './Projects';
import Resume from './Resume';
import Courses from './Courses';
import Footer from './Footer';


function Home() {
  // const defaultDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const defaultDark = 'dark';
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
        <div className="home" data-theme={theme}>
            <Navbar switchTheme={switchTheme} isChecked={isChecked}/>
            <About/>
            <Resume/>
            <hr className="divider"/>
            <Projects/>
            <hr className="divider"/>
            <Proficiency/>
            <hr className="divider"/>
            <Courses/>
            <hr className="divider"/>
            <Contact />
            <Footer />
            <ScrollButton/>
        </div>
  );
}

export default Home;
