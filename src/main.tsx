import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { ContextProvider } from './context/index.tsx';
import Router from './router/index.tsx';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ContextProvider>
      <BrowserRouter>
        <Router />
      </BrowserRouter>
    </ContextProvider>
  </React.StrictMode>,
);
