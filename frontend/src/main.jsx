import { StrictMode } from 'react';
import React from "react";
import { createRoot } from 'react-dom/client';
import { DataProvider } from './context/DataContext';
import { BrowserRouter } from "react-router-dom";
 import App from './App.jsx';
 import './index.css';

 createRoot(document.getElementById('root')).render(
   <StrictMode>
    <BrowserRouter>
       <DataProvider>
          <App />
      </DataProvider>
    </BrowserRouter>
   </StrictMode>
 );