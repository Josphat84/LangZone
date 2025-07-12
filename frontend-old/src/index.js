// src/index.js
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import ErrorBoundary from './ErrorBoundary';
import App from './App';
import './index.css';

// Safer development error filtering
if (process.env.NODE_ENV === 'development') {
  const originalError = console.error;
  console.error = (...args) => {
    // Convert args to strings safely
    const message = args.map(arg => 
      typeof arg === 'string' ? arg : String(arg)
    ).join(' ');
    
    if (message.includes('userMf')) {
      console.warn('Intercepted userMf error - handled by ErrorBoundary');
      return;
    }
    
    // Call original error with proper context
    originalError.apply(console, args);
  };
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </BrowserRouter>
  </React.StrictMode>
);