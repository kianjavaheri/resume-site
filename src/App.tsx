import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Paper from './pages/Paper'
import NotFound from './pages/NotFound'
import CommandPalette from './components/CommandPalette'
import './styling/App.css'



function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/papers/:slug" element={ <Paper/> }/>
        {/* Anything else. Without this, a typo matched no route and React
            rendered nothing at all — a blank white page. */}
        <Route path="*" element={ <NotFound/> }/>
      </Routes>
      {/* Mounted outside the routes so ⌘K works on every page. It reads the
          theme tokens off <html>, which useTheme mirrors them onto. */}
      <CommandPalette />
    </div>
  );
}

export default App;
