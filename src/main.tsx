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
      .then((registration) => {
        // Check for updates periodically
        setInterval(() => {
          registration.update()
        }, 60000) // Check every minute

        // Listen for updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                // New content is available
                if (confirm('新しいバージョンが利用可能です。ページを更新しますか？')) {
                  window.location.reload()
                }
              }
            })
          }
        })
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
