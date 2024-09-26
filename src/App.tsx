import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './pages/Home'
import './styling/App.css'



function App() {

  return (
    <div>
      <Routes>
        <Route path="/" element={ <Home/> }/>
      </Routes>
    </div>
  );
}

export default App;
