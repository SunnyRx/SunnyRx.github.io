/* ===========================================================
 * sw.js
 * ===========================================================
 * Copyright 2016 @huxpro
 * Licensed under Apache 2.0
 * service worker scripting
 * ========================================================== */

const SCOPE = new URL(self.registration.scope);
// CacheStorage is origin-wide. Include the scope so sibling apps stay isolated.
const CACHE_NAMESPACE = 'main-' + encodeURIComponent(SCOPE.pathname) + '-';
// Bump when changing the offline shell. Runtime entries migrate before cleanup.
const CACHE_VERSION = 'v2';
const PRECACHE = CACHE_NAMESPACE + 'precache-' + CACHE_VERSION;
const RUNTIME = CACHE_NAMESPACE + 'runtime-' + CACHE_VERSION;
const LEGACY_CACHES = ['main-precache-then-runtime', 'main-precache-v1', 'main-runtime'];
const PRECACHE_URLS = [
  './',
  './offline.html',
  './css/bootstrap.min.css',
  './css/hux-blog.min.css',
  './css/theme.css',
  './css/media.css',
  './js/jquery.min.js',
  './js/hux-blog.min.js',
  './js/theme-toggle.js',
  './js/search.js',
  './js/simple-jekyll-search.min.js',
  './js/jquery.nav.js',
  './js/snackbar.js',
  './js/sw-registration.js',
  './search.json',
  './img/icon_wechat.png',
  './img/avatar-rx.webp',
  './img/home-bg.webp',
  './img/404-bg.webp'
].map(path => new URL(path, SCOPE).href);
const OFFLINE_URL = new URL('./offline.html', SCOPE).href;
const SEARCH_URL = new URL('./search.json', SCOPE).href;

function isScopedGet(request) {
  const url = new URL(request.url);
  return request.method === 'GET' && url.origin === SCOPE.origin &&
    url.pathname.startsWith(SCOPE.pathname);
}

function isHTML(response) {
  return /\btext\/html\b/i.test(response.headers.get('content-type') || '');
}

function canCache(request, response) {
  if (!response || !response.ok || response.status === 206 || !isScopedGet(request)) return false;
  // Do not inherit old HTML fallbacks stored under a script/style/data URL.
  const pathname = new URL(request.url).pathname;
  return !isHTML(response) || !/\.[^/]+$/.test(pathname) || /\.html?$/i.test(pathname);
}

function isOldCache(name) {
  return name !== PRECACHE && name !== RUNTIME &&
    (name.startsWith(CACHE_NAMESPACE) || LEGACY_CACHES.includes(name));
}

self.addEventListener('install', event => {
  // All dependencies are local. A failed shell must leave the old worker active.
  event.waitUntil(
    caches.open(PRECACHE)
      .then(cache => cache.addAll(PRECACHE_URLS.map(url => new Request(url, { cache: 'reload' }))))
      .then(() => self.skipWaiting())
  );
});

async function migrateCaches() {
  const names = await caches.keys();
  const oldNames = names.filter(isOldCache);
  const runtime = await caches.open(RUNTIME);
  // Newest cached articles win. Never overwrite the freshly installed shell.
  for (const name of oldNames.reverse()) {
    const old = await caches.open(name);
    for (const request of await old.keys()) {
      if (!isScopedGet(request) || PRECACHE_URLS.includes(request.url) || await runtime.match(request)) continue;
      const response = await old.match(request);
      if (canCache(request, response)) await runtime.put(request, response);
    }
  }
  // Copy everything before any deletion; a failed migration keeps its sources.
  // Legacy names were shared by all scopes: only the historical root app deletes them.
  await Promise.all(oldNames.filter(name => name.startsWith(CACHE_NAMESPACE) || SCOPE.pathname === '/')
    .map(name => caches.delete(name)));
}

self.addEventListener('activate', event => {
  event.waitUntil(migrateCaches()
    .catch(error => console.warn('Cache migration deferred; retaining old offline pages.', error))
    .then(() => self.clients.claim()));
});

async function matchCurrent(request) {
  const runtime = await caches.open(RUNTIME);
  const precache = await caches.open(PRECACHE);
  const current = await runtime.match(request) || await precache.match(request);
  if (current) return current;
  // A quota/storage failure during migration must not strand the retained articles.
  for (const name of (await caches.keys()).filter(isOldCache).reverse()) {
    const old = await caches.open(name);
    const response = await old.match(request);
    if (canCache(request, response)) return response;
  }
}

async function notifyContentUpdate(request, cached, response) {
  if (!cached || !isHTML(cached) || !isHTML(response)) return;
  // A Pages rebuild changes Last-Modified even when the article did not change.
  if (await cached.text() === await response.text()) return;
  const clients = await self.clients.matchAll({ type: 'window' });
  for (const client of clients) {
    const url = new URL(client.url);
    url.hash = '';
    if (url.href === request.url) client.postMessage({ command: 'UPDATE_FOUND', url: request.url });
  }
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (!isScopedGet(request)) return;

  const navigation = request.mode === 'navigate';
  const search = new URL(request.url).pathname === new URL(SEARCH_URL).pathname;
  const cached = matchCurrent(request).catch(() => undefined);
  // Revalidate documents/index with HTTP validators, keeping the URL and credentials.
  // Assets use normal HTTP caching, then refresh their offline copy in the background.
  const fetched = fetch(request, navigation || search ? { cache: 'no-cache' } : undefined);
  event.waitUntil(fetched.then(async response => {
    if (!canCache(request, response)) return;
    // Clone before yielding: respondWith may already be consuming the original.
    const stored = response.clone();
    const copy = navigation ? response.clone() : null;
    const previous = await cached;
    const cache = await caches.open(RUNTIME);
    await cache.put(request, stored);
    if (navigation) await notifyContentUpdate(request, previous, copy);
  }).catch(() => { /* Network/quota failures must not break a cached response. */ }));

  event.respondWith((async () => {
    if (navigation || search) {
      try {
        const response = await fetched;
        // Preserve real HTTP 4xx responses; use offline copies for transient 5xx.
        if (response.status < 500) return response;
        const previous = await cached;
        if (previous) return previous;
        if (!navigation) return response;
      } catch (_) { /* Offline: try this URL before the offline document. */ }
      const previous = await cached;
      if (previous) return previous;
      if (navigation) {
        const shell = await caches.open(PRECACHE);
        const offline = await shell.match(OFFLINE_URL);
        if (offline) return offline;
      }
      return Response.error();
    }
    // Only document navigations may fall back to HTML. Missing assets fail normally.
    return await cached || await fetched;
  })().catch(() => Response.error()));
});
