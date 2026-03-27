const CACHE_NAME = 'mycarecoach-coach-v4'
const STATIC_ASSETS = [
  '/app',
  '/favicon.svg',
  '/icons/coach-192.png',
  '/icons/coach-512.png',
  '/offline-coach.html'
]

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS))
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => key !== CACHE_NAME)
          .map(key => caches.delete(key))
      )
    )
  )
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = event.request.url

  // Ne pas intercepter les requêtes non-GET
  if (event.request.method !== 'GET') return

  // Network First pour les APIs Supabase
  if (url.includes('supabase.co') || url.includes('/rest/v1/') || url.includes('/api/')) {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          // Mettre en cache la réponse API réussie
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Stale While Revalidate pour les pages /app
  if (url.includes('/app')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          }).catch(() => cached || caches.match('/offline-coach.html'))
          return cached || networkFetch
        })
      )
    )
    return
  }

  // Cache First pour les assets statiques (JS, CSS, images)
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached
      return fetch(event.request).then(response => {
        // Mettre en cache les assets statiques valides
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      }).catch(() => caches.match('/offline-coach.html'))
    })
  )
})

// Notifications push
self.addEventListener('push', (event) => {
  const data = event.data?.json() || {}
  event.waitUntil(
    self.registration.showNotification(
      data.title || 'MyCareCoach',
      {
        body: data.body || '',
        icon: '/icon-192x192.png',
        badge: '/icon-192x192.png',
        vibrate: [200, 100, 200],
        data: { url: data.url || '/app' }
      }
    )
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    clients.openWindow(event.notification.data.url)
  )
})
