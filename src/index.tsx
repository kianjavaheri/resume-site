import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';

ReactDOM.render(
  <React.StrictMode>
    {/* <HashRouter basename={process.env.PUBLIC_URL}>
      <Routes>
        <Route path="/" element={ <App/>}/>
      </Routes>
    </HashRouter> */}
    <BrowserRouter>
      <Routes>
          <Route path="/" element={ <App/>}/>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);
