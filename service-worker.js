// Service Worker for School Management System PWA
const CACHE_NAME = 'school-management-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Install event - cache resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        // Cache resources individually to handle failures gracefully
        return Promise.all(
          urlsToCache.map(url => 
            cache.add(url).catch(err => {
              console.warn(`Failed to cache ${url}:`, err);
              // Return a resolved promise so other URLs continue caching
              return Promise.resolve();
            })
          )
        ).then(() => {
          console.log('Service worker installation complete');
        });
      })
      .catch(err => {
        console.error('Cache install error:', err);
      })
  );
  self.skipWaiting();
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if valid response
          // - For normal responses (basic/cors): check status is 2xx (200-299)
          // - For opaque responses (no-cors cross-origin): cache despite status 0
          //   Note: Opaque responses always have status 0, we cannot verify if they succeeded.
          //   We'll cache opaque responses to support external CDN resources that don't send CORS headers
          const isValidResponse = response && (
            (response.status >= 200 && response.status < 300) || 
            response.type === 'opaque' // Cache opaque responses (typically external resources)
          );
          
          if (!isValidResponse) {
            return response;
          }
          
          // Clone the response
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              cache.put(event.request, responseToCache);
            });
          
          return response;
        }).catch(err => {
          console.log('Fetch error:', err);
          // Return a custom offline page if available
          return caches.match('/index.html');
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (!cacheWhitelist.includes(cacheName)) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  return self.clients.claim();
});

// Handle messages from the client
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
