import React from 'react';
import { Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import Paper from './pages/Paper'
import './styling/App.css'



function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home/> }/>
        <Route path="/papers/:slug" element={ <Paper/> }/>
      </Routes>
    </div>
  );
}

export default App;
