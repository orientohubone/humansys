import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import './index.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

// Clean up invalid user data on startup
const cleanupInvalidUserData = () => {
  const userData = localStorage.getItem('user');
  if (userData) {
    try {
      const parsedUser = JSON.parse(userData);
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
      
      if (!parsedUser.id || !uuidRegex.test(parsedUser.id)) {
        console.log('🔄 Cleaning up invalid user data');
        localStorage.removeItem('user');
        localStorage.clear();
        sessionStorage.clear();
      }
    } catch (error) {
      console.log('🔄 Error parsing user data, clearing storage');
      localStorage.removeItem('user');
      localStorage.clear();
      sessionStorage.clear();
    }
  }
};

// Clean up on startup
cleanupInvalidUserData();

// Register Service Worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' })
      .then((registration) => {
        console.log('SW registered: ', registration);
        registration.update();
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
