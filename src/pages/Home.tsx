import React from 'react'
import useLocalStorage from 'use-local-storage';
import './../styling/pages/Home.css'

import About from '../components/About';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Proficiency from '../components/Proficiency';
import ScrollButton from '../components/Scroll';
import Projects from '../components/Projects';
import Resume from '../components/Resume';
import Courses from '../components/Courses';
import Footer from '../components/Footer';


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
