import React, { useLayoutEffect } from 'react'
import { useLocation } from 'react-router-dom';
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
  const location = useLocation();
  // Returning from a project page lands back at the card you left from.
  useScrollRestore();

  // The command palette can send the reader to a section of this page from a
  // reading page, which it does by naming one in the navigation's state.
  //
  // It has to be a LAYOUT effect, and it has to be declared after
  // useScrollRestore: that hook scrolls a new history entry to the top in a
  // layout effect of its own, and effects run in the order their hooks were
  // called. Before paint, so the top never flashes on the way past.
  useLayoutEffect(() => {
    const focus = (location.state as { focus?: string } | null)?.focus
    if (!focus) return
    const jump = () => document.getElementById(focus)?.scrollIntoView()
    jump()
    // The web font arriving changes line counts and so document height, which
    // moves the target — the same reason useScrollRestore re-applies here.
    let cancelled = false
    const fonts = (document as Document & { fonts?: FontFaceSet }).fonts
    fonts?.ready.then(() => { if (!cancelled) jump() })
    return () => { cancelled = true }
  }, [location.key, location.state]);

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
