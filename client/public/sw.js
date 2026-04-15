const CACHE_NAME = 'humansys-v4.0.1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/Humansys.png',
  '/icon-192x192.png',
  '/icon-512x512.png'
];

// Install event - cache only what actually exists so a single missing asset
// cannot break the whole service worker installation.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(async (cache) => {
        console.log('🔄 SW v4.0.1: Cache opened');
        const results = await Promise.allSettled(
          urlsToCache.map(async (url) => {
            try {
              const response = await fetch(url, { cache: 'no-cache' });
              if (response.ok) {
                await cache.put(url, response.clone());
                return true;
              }
              console.warn('⚠️ SW skipped non-200 asset:', url, response.status);
              return false;
            } catch (error) {
              console.warn('⚠️ SW skipped missing asset:', url, error);
              return false;
            }
          })
        );
        const cachedCount = results.filter(result => result.status === 'fulfilled' && result.value === true).length;
        console.log(`✅ SW v4.0.1: Cached ${cachedCount}/${urlsToCache.length} assets`);
        return self.skipWaiting();
      })
  );
});

// Activate event - CLEAR ALL OLD CACHES
self.addEventListener('activate', (event) => {
  console.log('🧹 SW v4.0.1: Cleaning old caches...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      console.log('📋 Found caches:', cacheNames);
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete ALL old caches (not just non-matching)
          if (cacheName !== CACHE_NAME) {
            console.log('❌ Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => {
      console.log('✅ SW v4.0.1: Old caches cleared, claiming all clients');
      // Take control of all pages
      return self.clients.claim();
    })
  );
});

// Fetch event
self.addEventListener('fetch', (event) => {
  // Skip non-http requests and chrome-extension requests
  if (!event.request.url.startsWith('http') || event.request.url.includes('chrome-extension://')) {
    return;
  }

  // Skip API calls for caching (let them go through normally)
  if (event.request.url.includes('/api/')) {
    return;
  }

  // Skip JavaScript and CSS files - let browser handle versioning
  if (event.request.url.includes('/assets/') && (event.request.url.endsWith('.js') || event.request.url.endsWith('.css'))) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              })
              .catch((error) => {
                console.log('Cache put error:', error);
              });

            return response;
          }
        ).catch((error) => {
          console.log('Fetch error:', error);
          // Return cached response if fetch fails
          return caches.match(event.request);
        });
      })
      .catch((error) => {
        console.log('Cache match error:', error);
        // Fallback to network
        return fetch(event.request);
      })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync());
  }
});

function doBackgroundSync() {
  return new Promise((resolve) => {
    // Sync offline data when back online
    console.log('Background sync triggered');
    resolve();
  });
}

// Push notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data ? event.data.text() : 'Nova atualização disponível!',
    icon: '/icon-192x192.png',
    badge: '/icon-192x192.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    }
  };

  event.waitUntil(
    self.registration.showNotification('HumanSys', options)
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  
  event.waitUntil(
    clients.openWindow('/')
  );
});
