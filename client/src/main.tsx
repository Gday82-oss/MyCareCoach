import React from 'react';
import ReactDOM from 'react-dom/client';

// Enregistrement du Service Worker coach (PWA /app/*)
if ('serviceWorker' in navigator && window.location.pathname.startsWith('/app')) {
  window.addEventListener('load', async () => {
    try {
      const reg = await navigator.serviceWorker.register('/sw-coach.js')
      console.log('[PWA Coach] Service Worker enregistré:', reg.scope)
    } catch (err) {
      console.error('[PWA Coach] Erreur SW:', err)
    }
  })
}
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from './contexts/ThemeContext';
import App from './App';
import './index.css';

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </ThemeProvider>
    </BrowserRouter>
  </React.StrictMode>
);