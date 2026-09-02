import React, { useEffect, useState } from 'react'
import useLocalStorage from 'use-local-storage';
import './../styling/pages/Home.css'

import About from '../components/About';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Proficiency from '../components/Proficiency';
import ScrollButton from '../components/Scroll';
import Projects from '../components/Projects';
import Courses from '../components/Courses';
import Footer from '../components/Footer';

const query = () => window.matchMedia('(prefers-color-scheme: dark)');

function Home() {
  // 'system' follows the OS setting; 'light'/'dark' are explicit user overrides.
  const [preference, setPreference] = useLocalStorage('theme-pref', 'system');
  const [systemTheme, setSystemTheme] = useState(() => query().matches ? 'dark' : 'light');

  useEffect(() => {
    const mq = query();
    const onChange = (e: MediaQueryListEvent) => setSystemTheme(e.matches ? 'dark' : 'light');
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  const theme = preference === 'system' ? systemTheme : preference;

  const switchTheme = () => {
    setPreference(theme === 'light' ? 'dark' : 'light');
  }
  const isChecked = () => theme === 'dark';

  return (
    <div className="home" data-theme={theme}>
      <Navbar switchTheme={switchTheme} isChecked={isChecked} />
      <div className="cards-wrapper">
        <About />
        <Education />
        <Experience />
        <Projects />
        <Proficiency />
        <Courses />
        <Contact />
      </div>
      <Footer />
      <ScrollButton />
    </div>
  );
}

export default Home;
