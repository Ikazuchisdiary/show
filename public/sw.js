const CACHE_NAME = 'sukushou-v2-cache-v3'
const urlsToCache = ['/show/', '/show/index.html', '/show/manifest.json']

self.addEventListener('install', (event) => {
  // Force the waiting service worker to become the active service worker
  self.skipWaiting()
  
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache)
    }),
  )
})

self.addEventListener('fetch', (event) => {
  // Ignore chrome-extension and other non-http(s) requests
  if (!event.request.url.startsWith('http')) {
    return
  }

  // Network first strategy for HTML and JS files
  if (event.request.url.includes('.html') || 
      event.request.url.includes('.js') || 
      event.request.url.includes('.css') ||
      event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          // Clone the response before caching
          const responseToCache = response.clone()
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache)
          })
          return response
        })
        .catch(() => {
          // If network fails, try cache
          return caches.match(event.request)
        })
    )
    return
  }

  // Cache first strategy for other assets
  event.respondWith(
    caches.match(event.request).then((response) => {
      // Cache hit - return response
      if (response) {
        return response
      }

      return fetch(event.request).then((response) => {
        // Check if we received a valid response
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response
        }

        // Clone the response
        const responseToCache = response.clone()

        caches.open(CACHE_NAME).then((cache) => {
          // Only cache http(s) requests
          if (event.request.url.startsWith('http')) {
            cache.put(event.request, responseToCache)
          }
        })

        return response
      })
    }),
  )
})

self.addEventListener('activate', (event) => {
  // Take control of all pages immediately
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete all old caches
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        }),
      )
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim()
    })
  )
})
