const CACHE = 'mywebpages-v2';
const OFFLINE_URLS = ['/'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE).then((c) => c.addAll(OFFLINE_URLS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET') return;
  if (!req.url.startsWith('http')) return;

  const url = new URL(req.url);

  // Never cache auth, API, server actions, Next.js internals or RSC payloads
  if (
    url.pathname.startsWith('/auth/') ||
    url.pathname.startsWith('/api/') ||
    url.pathname.startsWith('/_next/data/') ||
    url.searchParams.has('_rsc') ||
    req.headers.get('next-action')
  ) {
    return;
  }

  // Network-first for navigations and HTML, cache static assets
  e.respondWith(
    fetch(req)
      .then((res) => {
        if (res.ok && (req.destination === 'image' || req.destination === 'style' || req.destination === 'script' || req.destination === 'font')) {
          const clone = res.clone();
          caches.open(CACHE).then((c) => c.put(req, clone));
        }
        return res;
      })
      .catch(() => caches.match(req).then((r) => r || caches.match('/') || new Response('Offline', { status: 503 })))
  );
});
