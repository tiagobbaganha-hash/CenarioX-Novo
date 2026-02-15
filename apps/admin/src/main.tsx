import React from 'react';
import ReactDOM from 'react-dom/client';
import { AdminApp } from './modules/AdminApp';
import './styles.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AdminApp />
  </React.StrictMode>,
);
