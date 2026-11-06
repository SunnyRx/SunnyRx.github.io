const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');

const root = path.resolve(__dirname, '..');
const workerSource = fs.readFileSync(path.join(root, 'sw.js'), 'utf8');
const registrationSource = fs.readFileSync(path.join(root, 'js/sw-registration.js'), 'utf8');
const origin = 'https://blog.example';

function deferred() {
  let resolve, reject;
  const promise = new Promise((yes, no) => { resolve = yes; reject = no; });
  return { promise, resolve, reject };
}

function fixture(url) {
  const pathname = new URL(url).pathname;
  let type = 'text/html', body = `<html>${pathname}</html>`;
  if (pathname.endsWith('.css')) { type = 'text/css'; body = 'body { color: white; }'; }
  if (pathname.endsWith('.js')) { type = 'text/javascript'; body = '// script'; }
  if (pathname.endsWith('.json')) { type = 'application/json'; body = '[{"title":"Offline article"}]'; }
  if (/\.(webp|png|ico)$/.test(pathname)) { type = 'image/webp'; body = 'image'; }
  return new Response(body, { headers: { 'content-type': type } });
}

// Execute the actual scripts against Web API objects and an in-memory CacheStorage.
// Only browser dispatch, storage and network are replaced; routing is production code.
function worker(scopePath = '/') {
  const scope = origin + scopePath;
  const listeners = {}, stores = new Map(), messages = [], calls = [];
  let offline = false, skipWaiting = 0, claims = 0, precacheGate;
  let network = request => fixture(request.url);
  let putHook = async () => {};
  const requestOf = value => value instanceof Request ? value : new Request(new URL(value, scope));
  const fetcher = async (input, options) => {
    const request = requestOf(input);
    calls.push({ request, options });
    if (offline) throw new TypeError('offline');
    return network(request, options);
  };
  const caches = {
    async open(name) {
      if (!stores.has(name)) {
        const entries = new Map();
        stores.set(name, {
          async match(input) { return entries.get(requestOf(input).url)?.response.clone(); },
          async put(input, response) {
            const request = requestOf(input);
            assert.equal(request.method, 'GET');
            await putHook(name, request);
            entries.set(request.url, { request, response: response.clone() });
          },
          async keys() { return [...entries.values()].map(entry => entry.request); },
          async addAll(inputs) {
            if (precacheGate) await precacheGate;
            const responses = await Promise.all(inputs.map(input => fetcher(input)));
            if (responses.some(response => !response.ok)) throw new TypeError('Precache failed');
            await Promise.all(inputs.map((input, i) => this.put(input, responses[i])));
          }
        });
      }
      return stores.get(name);
    },
    async keys() { return [...stores.keys()]; },
    async delete(name) { return stores.delete(name); },
    async match(input) {
      for (const cache of stores.values()) {
        const response = await cache.match(input);
        if (response) return response;
      }
    }
  };
  const client = { url: scope + 'article/', postMessage: message => messages.push(message) };
  const self = {
    location: new URL('sw.js', scope), registration: { scope },
    addEventListener(type, listener) { listeners[type] = listener; },
    async skipWaiting() { skipWaiting++; },
    clients: {
      async claim() { claims++; },
      async matchAll() { return [client]; },
      async get() { return client; }
    }
  };
  vm.runInNewContext(workerSource, {
    self, caches, fetch: fetcher, URL, Request, Response, Headers,
    console: { log() {}, warn() {}, error() {} }, setTimeout
  }, { filename: 'sw.js' });
  function dispatch(type, extra = {}) {
    const lifetimes = [];
    let response;
    listeners[type]({
      ...extra,
      waitUntil(promise) { lifetimes.push(Promise.resolve(promise)); },
      respondWith(value) { response = Promise.resolve(value); }
    });
    return { response, done: Promise.all(lifetimes) };
  }
  return {
    scope, caches, calls, messages, client, dispatch,
    get skips() { return skipWaiting; }, get claims() { return claims; },
    offline(value = true) { offline = value; },
    network(handler) { network = handler; },
    blockPrecache(promise) { precacheGate = promise; },
    onPut(handler) { putHook = handler; },
    async start() { await dispatch('install').done; await dispatch('activate').done; },
    fetch(url, { navigation = false, ...init } = {}) {
      const request = new Request(new URL(url, scope), { headers: { accept: '*/*' }, ...init });
      if (navigation) Object.defineProperty(request, 'mode', { value: 'navigate' });
      return dispatch('fetch', { request, clientId: 'current', resultingClientId: 'next' });
    }
  };
}

async function responseOf(event) {
  const response = await event.response;
  await event.done;
  return response;
}

test('first controlled visit can load the complete offline theme and search shell', async () => {
  const sw = worker();
  sw.network(request => {
    const pathname = new URL(request.url).pathname;
    assert.ok(fs.existsSync(path.join(root, pathname === '/' ? 'index.html' : pathname)), pathname);
    return fixture(request.url);
  });
  await sw.start();
  sw.offline();
  const page = await responseOf(sw.fetch('never-visited/', { navigation: true }));
  assert.match(await page.text(), /offline\.html/);
  for (const [url, type] of [
    ['css/bootstrap.min.css', 'text/css'], ['css/hux-blog.min.css', 'text/css'],
    ['css/theme.css', 'text/css'], ['js/jquery.min.js', 'text/javascript'],
    ['js/hux-blog.min.js', 'text/javascript'], ['js/theme-toggle.js', 'text/javascript'],
    ['js/search.js', 'text/javascript'], ['js/simple-jekyll-search.min.js', 'text/javascript'],
    ['js/snackbar.js', 'text/javascript'], ['js/sw-registration.js', 'text/javascript'],
    ['search.json', 'application/json']
  ]) {
    const response = await responseOf(sw.fetch(url));
    assert.equal(response.status, 200, url);
    assert.equal(response.headers.get('content-type'), type, url);
  }
});

test('uncached static failures never return a successful offline HTML document', async () => {
  const sw = worker();
  await sw.start();
  sw.offline();
  for (const url of ['missing.css', 'missing.js', 'missing.json', 'missing.png']) {
    const response = await responseOf(sw.fetch(url));
    assert.equal(response.ok, false, url);
    assert.notEqual(response.headers.get('content-type'), 'text/html', url);
  }
});

test('install waits for all precaching before skipWaiting and rejects a failed shell', async () => {
  const sw = worker(), gate = deferred();
  sw.blockPrecache(gate.promise);
  const installing = sw.dispatch('install');
  await Promise.resolve();
  assert.equal(sw.skips, 0);
  gate.resolve();
  await installing.done;
  assert.equal(sw.skips, 1);
  const failed = worker();
  failed.network(() => new Response('missing', { status: 404 }));
  await assert.rejects(failed.dispatch('install').done);
  assert.equal(failed.skips, 0);
});

test('only same-origin scoped GET requests are intercepted without URL cache busting', async () => {
  const sw = worker('/blog/');
  await sw.start();
  for (const [url, init] of [
    ['search.json', { method: 'POST', body: 'payload' }],
    ['search.json', { method: 'HEAD' }],
    ['https://cdnjs.cloudflare.com/file.js', {}],
    ['http://blog.example/file.js', {}],
    ['https://blog.example:444/file.js', {}],
    ['/another-app/file.js', {}]
  ]) assert.equal(sw.fetch(url, init).response, undefined, url);
  const url = sw.scope + 'asset.js?version=2';
  await responseOf(sw.fetch(url));
  const call = sw.calls.at(-1);
  assert.equal(call.request.url, url);
  assert.notEqual(call.options?.cache, 'no-store');
  assert.notEqual(call.options?.credentials, 'omit');
});

test('scope-relative precaching also supports first-visit offline navigation under baseurl', async () => {
  const sw = worker('/blog/');
  await sw.start();
  assert.ok(sw.calls.every(({ request }) => request.url.startsWith(sw.scope)));
  sw.offline();
  const css = await responseOf(sw.fetch('css/theme.css'));
  assert.equal(css.headers.get('content-type'), 'text/css');
  const fallback = await responseOf(sw.fetch('new/', { navigation: true }));
  assert.match(await fallback.text(), /\/blog\/offline\.html/);
});

test('activation migrates old articles and their assets before deleting only owned caches', async () => {
  const sw = worker();
  const legacy = await sw.caches.open('main-precache-then-runtime');
  await legacy.put(origin + '/article/', new Response('saved article', { headers: { 'content-type': 'text/html' } }));
  await legacy.put(origin + '/img/article.png', fixture(origin + '/img/article.png'));
  await legacy.put(origin + '/css/theme.css', new Response('stale theme'));
  await legacy.put(origin + '/bad.js', new Response('old offline HTML', { headers: { 'content-type': 'text/html' } }));
  await legacy.put('https://cdn.example/old.js', new Response('third party'));
  const older = await sw.caches.open('main-%2F-runtime-v1');
  await older.put(origin + '/older/', new Response('older article', { headers: { 'content-type': 'text/html' } }));
  const unrelated = ['runtime', 'precache-v1', 'main-other-app', 'main-%2Fother%2F-runtime-v1'];
  for (const name of unrelated) await sw.caches.open(name);
  const foreign = await sw.caches.open('other-application');
  await foreign.put(origin + '/foreign/', new Response('not our content'));
  await sw.dispatch('install').done;

  const blocked = deferred(), entered = deferred();
  sw.onPut(async (name, request) => {
    if (request.url === origin + '/article/') { entered.resolve(); await blocked.promise; }
  });
  const activation = sw.dispatch('activate');
  await entered.promise;
  assert.equal(sw.claims, 0);
  assert.ok((await sw.caches.keys()).includes('main-precache-then-runtime'));
  blocked.resolve();
  await activation.done;
  assert.equal(sw.claims, 1);
  const names = await sw.caches.keys();
  assert.ok(!names.includes('main-precache-then-runtime'));
  assert.ok(!names.includes('main-%2F-runtime-v1'));
  for (const name of unrelated) assert.ok(names.includes(name), name);

  sw.offline();
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'saved article');
  assert.equal(await (await responseOf(sw.fetch('older/', { navigation: true }))).text(), 'older article');
  assert.equal((await responseOf(sw.fetch('img/article.png'))).status, 200);
  assert.equal((await responseOf(sw.fetch('css/theme.css'))).headers.get('content-type'), 'text/css');
  assert.equal((await responseOf(sw.fetch('bad.js'))).ok, false);
  assert.match(await (await responseOf(sw.fetch('foreign/', { navigation: true }))).text(), /offline\.html/);
});

test('a failed migration retains the source and keeps old articles accessible offline', async () => {
  const sw = worker();
  const legacy = await sw.caches.open('main-precache-then-runtime');
  await legacy.put(origin + '/article/', new Response('saved'));
  await sw.dispatch('install').done;
  sw.onPut(async () => { throw new Error('quota exceeded'); });
  await sw.dispatch('activate').done;
  assert.equal(sw.claims, 1);
  assert.equal(await (await legacy.match(origin + '/article/')).text(), 'saved');
  assert.ok((await sw.caches.keys()).includes('main-precache-then-runtime'));
  sw.offline();
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'saved');
});

test('a baseurl app copies its legacy articles while retaining the shared legacy cache', async () => {
  const sw = worker('/blog/');
  const legacy = await sw.caches.open('main-precache-then-runtime');
  await legacy.put(origin + '/blog/article/', new Response('blog article'));
  await legacy.put(origin + '/other/article/', new Response('other article'));
  await sw.start();
  assert.ok((await sw.caches.keys()).includes('main-precache-then-runtime'));
  sw.offline();
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'blog article');
  assert.equal(await (await legacy.match(origin + '/other/article/')).text(), 'other article');
});

test('navigation revalidates online, caches for offline, and preserves HTTP error semantics', async () => {
  const sw = worker();
  await sw.start();
  sw.network(() => new Response('article version 1', { headers: { 'content-type': 'text/html' } }));
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'article version 1');
  assert.equal(sw.calls.at(-1).options.cache, 'no-cache');
  sw.network(() => new Response('article version 2', { headers: { 'content-type': 'text/html' } }));
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'article version 2');
  sw.offline();
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'article version 2');
  sw.offline(false);
  sw.network(() => new Response('unavailable', { status: 503 }));
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'article version 2');
  assert.match(await (await responseOf(sw.fetch('unknown/', { navigation: true }))).text(), /offline\.html/);
  sw.network(() => new Response('not found', { status: 404 }));
  assert.equal((await responseOf(sw.fetch('article/', { navigation: true }))).status, 404);
  sw.offline();
  assert.equal(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), 'article version 2');
});

test('search index refreshes online and survives offline; static assets revalidate in the background', async () => {
  const sw = worker();
  await sw.start();
  sw.network(request => request.url.endsWith('search.json')
    ? new Response('[{"title":"New article"}]', { headers: { 'content-type': 'application/json' } })
    : new Response('body { color: black; }', { headers: { 'content-type': 'text/css' } }));
  assert.match(await (await responseOf(sw.fetch('search.json'))).text(), /New article/);
  const css = await responseOf(sw.fetch('css/theme.css'));
  assert.equal(await css.text(), 'body { color: white; }');
  sw.offline();
  assert.match(await (await responseOf(sw.fetch('search.json'))).text(), /New article/);
  assert.equal(await (await responseOf(sw.fetch('css/theme.css'))).text(), 'body { color: black; }');
});

test('runtime cache writes stay alive after the network response is consumed', async () => {
  const sw = worker();
  await sw.start();
  const blocked = deferred(), entered = deferred();
  sw.onPut(async () => { entered.resolve(); await blocked.promise; });
  const event = sw.fetch('article/', { navigation: true });
  const response = await event.response;
  assert.match(await response.text(), /article/);
  await entered.promise;
  let finished = false;
  event.done.then(() => { finished = true; });
  await Promise.resolve();
  assert.equal(finished, false);
  blocked.resolve();
  await event.done;
  sw.offline();
  assert.match(await (await responseOf(sw.fetch('article/', { navigation: true }))).text(), /article/);
});

test('changed article bodies notify open readers; rebuild timestamps alone do not', async () => {
  const sw = worker();
  await sw.start();
  await responseOf(sw.fetch('article/', { navigation: true }));
  assert.equal(sw.messages.length, 0);
  sw.network(() => new Response('<html>/article/</html>', {
    headers: { 'content-type': 'text/html', 'last-modified': 'Wed, 01 Jan 2025 00:00:00 GMT' }
  }));
  await responseOf(sw.fetch('article/', { navigation: true }));
  assert.equal(sw.messages.length, 0);
  sw.network(() => new Response('new article body', { headers: { 'content-type': 'text/html' } }));
  await responseOf(sw.fetch('article/', { navigation: true }));
  assert.equal(sw.messages.length, 1);
  assert.equal(sw.messages[0].command, 'UPDATE_FOUND');
  assert.equal(sw.messages[0].url, origin + '/article/');
  sw.client.url = origin + '/unrelated/';
  sw.network(() => new Response('another body', { headers: { 'content-type': 'text/html' } }));
  await responseOf(sw.fetch('article/', { navigation: true }));
  assert.equal(sw.messages.length, 1);
});

function eventTarget(properties = {}) {
  const listeners = new Map();
  return Object.assign(properties, {
    addEventListener(type, listener) {
      if (!listeners.has(type)) listeners.set(type, new Set());
      listeners.get(type).add(listener);
    },
    removeEventListener(type, listener) { listeners.get(type)?.delete(listener); },
    emit(type, event = {}) { for (const listener of [...(listeners.get(type) || [])]) listener(event); }
  });
}

function registration({ controlled = false, installing = null } = {}) {
  const ready = deferred(), notifications = [], registered = [];
  let reloads = 0;
  const record = eventTarget({ installing });
  const serviceWorker = eventTarget({
    controller: controlled ? {} : null, ready: ready.promise,
    async register(url) { registered.push(url); return record; }
  });
  const context = {
    navigator: { serviceWorker }, document: { currentScript: { src: origin + '/blog/js/sw-registration.js' } },
    location: { href: origin + '/blog/article/#part', reload() { reloads++; } },
    URL, console: { log() {} }, createSnackbar(config) { notifications.push(config); }
  };
  vm.runInNewContext(registrationSource, context, { filename: 'sw-registration.js' });
  return { ready, notifications, registered, serviceWorker, record, get reloads() { return reloads; } };
}

test('registration resolves the baseurl and announces first offline readiness only after control', async () => {
  const page = registration();
  await Promise.resolve();
  assert.deepEqual(page.registered, [origin + '/blog/sw.js']);
  page.ready.resolve(page.record);
  await Promise.resolve();
  assert.equal(page.notifications.length, 0);
  page.serviceWorker.controller = {};
  page.serviceWorker.emit('controllerchange');
  assert.equal(page.notifications.length, 1);
  assert.match(page.notifications[0].message, /offline/);
  page.serviceWorker.emit('controllerchange');
  assert.equal(page.notifications.length, 1);
});

test('registration handles messages without a global event and retains refresh actions', async () => {
  const page = registration({ controlled: true });
  await Promise.resolve();
  page.serviceWorker.emit('message', { data: null });
  page.serviceWorker.emit('message', { data: { command: 'UPDATE_FOUND', url: origin + '/unrelated/' } });
  assert.equal(page.notifications.length, 0);
  page.serviceWorker.emit('message', { data: { command: 'UPDATE_FOUND', url: origin + '/blog/article/' } });
  assert.equal(page.notifications.length, 1);
  assert.equal(page.notifications[0].message, 'Content updated.');
  page.notifications[0].action();
  assert.equal(page.reloads, 1);
});

test('registration observes already-installing workers and waits for activation to offer refresh', async () => {
  const installing = eventTarget({ state: 'installing' });
  const page = registration({ controlled: true, installing });
  await Promise.resolve();
  installing.state = 'installed';
  installing.emit('statechange');
  assert.equal(page.notifications.length, 0);
  installing.state = 'activated';
  installing.emit('statechange');
  assert.equal(page.notifications.length, 1);
  page.notifications[0].action();
  assert.equal(page.reloads, 1);
  page.record.installing = null;
  assert.doesNotThrow(() => page.record.emit('updatefound'));
});
