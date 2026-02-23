const CACHE_VERSION = 'quran-app-v3';
const STATIC_CACHE = `${CACHE_VERSION}-static`;
const PAGES_CACHE = `${CACHE_VERSION}-pages`;
const DATA_CACHE = `${CACHE_VERSION}-data`;

// Core assets to pre-cache on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/icons/icon-192x192.png',
  '/icons/icon-512x512.png',
  '/fonts/taha.ttf',
  '/quran-data.json'
];

// Install: pre-cache core assets and the quran data
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Pre-caching core assets');
      return cache.addAll(PRECACHE_ASSETS);
    }).then(() => {
      // Activate immediately without waiting
      return self.skipWaiting();
    })
  );
});

// Activate: clean old caches and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          // Delete any cache that doesn't match our current version
          if (!name.startsWith(CACHE_VERSION)) {
            console.log('[SW] Deleting old cache:', name);
            return caches.delete(name);
          }
        })
      );
    }).then(() => {
      // Take control of all clients immediately
      return self.clients.claim();
    }).then(() => {
      // Start background pre-caching of all pages
      return preloadAllPages();
    })
  );
});

// Background pre-cache all 604 Quran pages
async function preloadAllPages() {
  const pagesCache = await caches.open(PAGES_CACHE);
  
  // Check if pages are already cached
  const testUrl = '/page/1';
  const existing = await pagesCache.match(testUrl);
  if (existing) {
    console.log('[SW] Pages already cached, skipping pre-load');
    return;
  }

  console.log('[SW] Starting background pre-cache of all 604 pages...');
  
  // Cache pages in batches to avoid overwhelming the browser
  const BATCH_SIZE = 20;
  for (let i = 1; i <= 604; i += BATCH_SIZE) {
    const batch = [];
    for (let j = i; j < Math.min(i + BATCH_SIZE, 605); j++) {
      batch.push(`/page/${j}`);
    }
    
    try {
      await pagesCache.addAll(batch);
      if (i % 100 === 1) {
        console.log(`[SW] Cached pages ${i}-${Math.min(i + BATCH_SIZE - 1, 604)}/604`);
      }
    } catch (err) {
      console.warn(`[SW] Failed to cache batch starting at page ${i}:`, err);
    }
  }
  
  console.log('[SW] ✓ All 604 pages pre-cached for offline use');
}

// Fetch strategy
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Only handle same-origin requests
  if (url.origin !== self.location.origin) {
    // For external resources (Google Fonts, etc.), try network first, fall back to cache
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          // Cache external fonts/resources for offline
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        }).catch(() => {
          // If both fail, return nothing (fonts will degrade gracefully)
          return new Response('', { status: 408, statusText: 'Offline' });
        });
      })
    );
    return;
  }

  // For quran-data.json — cache first (it's large and rarely changes)
  if (url.pathname === '/quran-data.json') {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          const clone = response.clone();
          caches.open(DATA_CACHE).then((cache) => cache.put(request, clone));
          return response;
        });
      })
    );
    return;
  }

  // For page routes (/page/N) — cache first, network fallback
  if (url.pathname.startsWith('/page/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        
        return fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        }).catch(() => {
          // Offline fallback: return the homepage
          return caches.match('/');
        });
      })
    );
    return;
  }

  // For Next.js static assets (_next/static/) — cache first
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        return cached || fetch(request).then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        });
      })
    );
    return;
  }

  // Default: network first, cache fallback (for HTML pages, API, etc.)
  event.respondWith(
    fetch(request).then((response) => {
      if (response.ok) {
        const clone = response.clone();
        caches.open(STATIC_CACHE).then((cache) => cache.put(request, clone));
      }
      return response;
    }).catch(() => {
      return caches.match(request).then((cached) => {
        return cached || caches.match('/');
      });
    })
  );
});

// Listen for messages from the app
self.addEventListener('message', (event) => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data === 'PRELOAD_ALL_PAGES') {
    preloadAllPages();
  }
});
