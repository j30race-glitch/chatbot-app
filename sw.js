/* Character Chat service worker. Registered by index.html only when served over http(s) (never on file://).
   Precaches the app shell on install. The page itself (index.html / navigations) is network-first, so the first open
   after an update already shows the new build (cached copy only when offline or the network is too slow); icons and
   the manifest are served cache-first.
   It only ever touches same-origin GET requests: calls to the AI API (a different origin, POST) are never
   intercepted or cached, so chats and the API key never end up in the cache.
   Bump CACHE_VERSION whenever index.html, manifest.json or the icons change so the phone picks up the new version. */
const CACHE_VERSION = 'chatbot-v12';
const APP_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
  './icons/icon-maskable-512.png',
  './icons/apple-touch-icon-180.png'
];
const SHELL = new Set(APP_FILES.map(f => new URL(f, self.location).href));

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(APP_FILES.map(f => new Request(f, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k.startsWith('chatbot-') && k !== CACHE_VERSION).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // API calls and anything off-site: untouched
  url.search = ''; url.hash = '';
  const INDEX = new URL('./index.html', self.location).href, ROOT_URL = new URL('./', self.location).href;
  if (req.mode === 'navigate' || url.href === INDEX || url.href === ROOT_URL) {
    // the page: network first (revalidated, so GitHub Pages' 10-minute HTTP cache can't hand back the old build),
    // refresh the cached copy, and fall back to the cache when offline or after 6 s without an answer
    event.respondWith(networkFirstPage(req, url.href));
  } else if (SHELL.has(url.href)) {
    // icons / manifest: cache first, network fallback
    event.respondWith(caches.open(CACHE_VERSION).then(c => c.match(url.href)).then(hit => hit || fetch(req)));
  }
  // everything else goes straight to the network and is never cached
});

function networkFirstPage(req, key) {
  const fromCache = () => caches.open(CACHE_VERSION).then(c => c.match(key).then(hit => hit || c.match(new URL('./index.html', self.location).href)));
  const net = fetch(req.url, { cache: 'no-cache', credentials: 'same-origin' }).then(res => {
    if (res && res.ok && SHELL.has(key)) { const copy = res.clone(); caches.open(CACHE_VERSION).then(c => c.put(key, copy)).catch(() => {}); }
    return res;
  });
  const slow = new Promise(r => setTimeout(r, 6000)).then(fromCache).then(hit => hit || net);
  return Promise.race([net.catch(() => fromCache().then(hit => hit || Promise.reject(new Error('offline')))), slow])
    .then(res => res || fromCache());
}
