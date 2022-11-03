import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home/Home'
import GCSP from './Components/GCSP/GCSP'
import './App.css'



function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={ <Home/> }/>
          <Route path="gcsp" element={ <GCSP/> }/>
        </Routes>
      </BrowserRouter> 
    </div>
  );
}

export default App;
