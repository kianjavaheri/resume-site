import React from 'react'
import { useTheme } from '../components/useTheme';
import { useScrollRestore } from '../components/useScrollRestore';
import './../styling/pages/Home.css'

import About from '../components/About';
import Education from '../components/Education';
import Experience from '../components/Experience';
import Contact from '../components/Contact';
import Navbar from '../components/Navbar';
import Proficiency from '../components/Proficiency';
import Awards from '../components/Awards';
import ScrollButton from '../components/Scroll';
import Projects from '../components/Projects';
import Footer from '../components/Footer';

function Home() {
  const { theme, switchTheme, isChecked } = useTheme();
  // Returning from a project page lands back at the card you left from.
  useScrollRestore();

  return (
    <div className="home" data-theme={theme}>
      <Navbar switchTheme={switchTheme} isChecked={isChecked} />
      <div className="cards-wrapper">
        <About />
        <Education />
        <Experience />
        <Projects />
        <Proficiency />
        {/* Last card in the stack, below Skills. Not in the nav yet. */}
        <Awards />
        <Contact />
      </div>
      <Footer />
      <ScrollButton />
    </div>
  );
}

export default Home;
