
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';
import { StrictMode } from 'react';

// Get the root element
const rootElement = document.getElementById('root');

// Ensure the root element exists
if (!rootElement) {
  throw new Error('Root element not found');
}

// Create and render the root
const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <App />
  </StrictMode>
);
