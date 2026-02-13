const CACHE_NAME = 'humansys-v1.0.0';
const urlsToCache = [
  '/',
  '/dashboard',
  '/collaborators',
  '/onboarding',
  '/training',
  '/goals',
  '/feedback',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json'
];

// Instalar Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Cache opened');
        return cache.addAll(urlsToCache);
      })
  );
});

// Buscar recursos
self.addEventListener('fetch', (event) => {
  try {
    // Não interceptar requisições para recursos estáticos
    if (event.request.url.includes('/assets/') || 
        event.request.url.includes('chrome-extension://') ||
        event.request.method !== 'GET') {
      return;
    }

    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          return response || fetch(event.request);
        })
        .catch(() => {
          return fetch(event.request);
        })
    );
  } catch (error) {
    console.log('SW fetch error:', error);
  }
});

// Ativar Service Worker
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});