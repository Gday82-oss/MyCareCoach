const CACHE_NAME = 'mycarecoach-client-v1'
const STATIC_ASSETS = [
  '/client',
  '/client/dashboard',
  '/favicon.svg',
  '/icons/client-192.png',
  '/icons/client-512.png'
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
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
          return response
        })
        .catch(() => caches.match(event.request))
    )
    return
  }

  // Stale While Revalidate pour les pages /client
  if (url.includes('/client')) {
    event.respondWith(
      caches.open(CACHE_NAME).then(cache =>
        cache.match(event.request).then(cached => {
          const networkFetch = fetch(event.request).then(response => {
            cache.put(event.request, response.clone())
            return response
          }).catch(() => cached)
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
        if (response.status === 200) {
          const clone = response.clone()
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
        }
        return response
      })
    })
  )
})
