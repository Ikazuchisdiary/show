import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'
import { ErrorBoundary } from './components/ErrorBoundary'
import { initGoogleAnalytics } from './analytics'

// Initialize Google Analytics
initGoogleAnalytics()

// Register service worker for PWA
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Use the base path from vite config
    const base = import.meta.env.BASE_URL
    navigator.serviceWorker
      .register(`${base}sw.js`)
      .then(() => {
        // ServiceWorker registration successful
      })
      .catch((err) => {
        console.error('ServiceWorker registration failed:', err)
      })
  })
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
