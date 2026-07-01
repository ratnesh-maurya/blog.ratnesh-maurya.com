/*
 * Service worker: offline support for recently visited pages.
 * - Static assets (/_next/static, /og, fonts, images): cache-first
 * - Pages: network-first with cache fallback, so visited posts read offline
 * - Never caches /api, /analytics, or cross-origin requests
 */
const VERSION = 'v1';
const STATIC_CACHE = `static-${VERSION}`;
const PAGES_CACHE = `pages-${VERSION}`;
const MAX_PAGE_ENTRIES = 40;

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(PAGES_CACHE));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== STATIC_CACHE && k !== PAGES_CACHE)
          .map((k) => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length > maxEntries) {
    await cache.delete(keys[0]);
    await trimCache(cacheName, maxEntries);
  }
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/analytics')) return;

  const isStatic =
    url.pathname.startsWith('/_next/static/') ||
    url.pathname.startsWith('/og/') ||
    /\.(png|jpg|jpeg|webp|avif|svg|ico|woff2?|ttf)$/.test(url.pathname);

  if (isStatic) {
    // Cache-first: immutable hashed assets and images
    event.respondWith(
      caches.open(STATIC_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        if (cached) return cached;
        const response = await fetch(request);
        if (response.ok) cache.put(request, response.clone());
        return response;
      })
    );
    return;
  }

  if (request.mode === 'navigate' || request.headers.get('accept')?.includes('text/html')) {
    // Network-first: pages stay fresh, fall back to cache offline
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGES_CACHE).then((cache) => {
              cache.put(request, clone);
              trimCache(PAGES_CACHE, MAX_PAGE_ENTRIES);
            });
          }
          return response;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          if (cached) return cached;
          return new Response(
            '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Offline — Ratn Labs</title><style>body{font-family:system-ui,sans-serif;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#FAFAF8;color:#1C1C1A}main{text-align:center;padding:2rem}h1{font-size:1.5rem}p{color:#6A6A64}</style></head><body><main><h1>You’re offline</h1><p>Pages you’ve read before are available — try going back.</p></main></body></html>',
            { status: 503, headers: { 'Content-Type': 'text/html' } }
          );
        })
    );
  }
});
