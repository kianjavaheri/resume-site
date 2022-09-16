import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { HashRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    <HashRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={ <App/>}/>
      </Routes>
    </HashRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
