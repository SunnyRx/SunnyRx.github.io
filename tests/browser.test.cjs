const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');
const { test, before, after } = require('node:test');
const { chromium } = require(process.env.BLOG_PLAYWRIGHT_MODULE || 'playwright');

const root = path.resolve(process.env.BLOG_SITE_DIR || '_site');
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.xml': 'application/xml', '.webp': 'image/webp', '.png': 'image/png', '.gif': 'image/gif', '.mp4': 'video/mp4', '.webm': 'video/webm', '.woff2': 'font/woff2', '.woff': 'font/woff' };
let server, browser, origin;

before(async () => {
  assert.ok(fs.existsSync(path.join(root, 'index.html')), 'Build Jekyll before running browser checks');
  server = http.createServer((req, res) => {
    const pathname = decodeURIComponent(new URL(req.url, 'http://localhost').pathname);
    let file = path.join(root, pathname);
    if (path.relative(root, file).startsWith('..')) { res.writeHead(403); res.end(); return; }
    if (fs.existsSync(file) && fs.statSync(file).isDirectory()) file = path.join(file, 'index.html');
    if (!fs.existsSync(file)) { res.writeHead(404, { 'Content-Type': 'text/html' }); res.end('Not found'); return; }
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream', 'Last-Modified': fs.statSync(file).mtime.toUTCString() });
    fs.createReadStream(file).pipe(res);
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  origin = `http://127.0.0.1:${server.address().port}`;
  browser = await chromium.launch({ headless: true, channel: process.env.BLOG_BROWSER_CHANNEL });
});
after(async () => { if (browser) await browser.close(); if (server) await new Promise(resolve => server.close(resolve)); });

async function context(options = {}) {
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, serviceWorkers: 'block', ...options });
  await ctx.route('**/*', route => route.request().url().startsWith(origin) ? route.continue() : route.abort());
  return ctx;
}

test('rapidly closing search does not leave the page locked', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    await page.goto(origin, { waitUntil: 'load' });
    await page.evaluate(async () => {
      const open = document.querySelector('.search-icon a, .search-icon button');
      const close = document.querySelector('.search-icon-close');
      for (let i = 0; i < 10; i++) { open.click(); close.click(); }
      await new Promise(resolve => setTimeout(resolve, 500));
    });
    assert.equal(await page.locator('.search-page').evaluate(el => el.classList.contains('search-active')), false);
    assert.notEqual(await page.locator('body').evaluate(el => getComputedStyle(el).overflow), 'hidden');
  } finally { await ctx.close(); }
});

test('search supports Escape and restores focus', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    await page.goto(origin, { waitUntil: 'load' });
    const open = page.locator('.search-icon a, .search-icon button');
    await open.focus();
    await page.keyboard.press('Enter');
    await page.locator('#search-input').pressSequentially('OpenClaw');
    await page.waitForFunction(() => document.querySelector('#search-results').textContent.includes('OpenClaw'));
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('.search-page').evaluate(el => el.classList.contains('search-active')), false);
    assert.equal(await open.evaluate(el => document.activeElement === el), true);
  } finally { await ctx.close(); }
});

test('embedded store cards fit the mobile article', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    for (const width of [320, 390, 768]) {
      await page.setViewportSize({ width, height: 844 });
      await page.goto(origin + '/2025/12/31/review-2025/', { waitUntil: 'load' });
      const sizes = await page.locator('iframe[src*="/widget/"]').evaluate(el => {
        const container = el.closest('.post-container'), style = getComputedStyle(container);
        return { width: el.getBoundingClientRect().width, available: container.clientWidth - parseFloat(style.paddingLeft) - parseFloat(style.paddingRight), title: el.title };
      });
      assert.ok(sizes.width <= sizes.available + 1, `${width}px viewport: ${JSON.stringify(sizes)}`);
      assert.ok(sizes.title.trim(), 'Embedded content needs an accessible name');
    }
  } finally { await ctx.close(); }
});

test('articles have distinct descriptions and correct page language', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    const descriptions = [];
    for (const route of ['/2025/12/31/review-2025/', '/2024/12/31/review-2024/']) {
      await page.goto(origin + route, { waitUntil: 'load' });
      const metadata = await page.evaluate(() => ({ lang: document.documentElement.lang, description: document.querySelector('meta[name="description"]').content, published: document.querySelector('meta[property="article:published_time"]').content }));
      assert.match(metadata.lang, /^zh(?:-|$)/i);
      assert.ok(metadata.description.length > 20);
      assert.equal(metadata.published, metadata.published.trim());
      assert.ok(!Number.isNaN(Date.parse(metadata.published)));
      descriptions.push(metadata.description);
    }
    assert.notEqual(descriptions[0], descriptions[1]);
    await page.goto(origin + '/about/?lang=en', { waitUntil: 'load' });
    assert.match(await page.locator('html').getAttribute('lang'), /^en(?:-|$)/i);
  } finally { await ctx.close(); }
});

test('sitemap lists articles and omits error pages', async () => {
  const response = await fetch(origin + '/sitemap.xml');
  assert.equal(response.status, 200);
  const sitemap = await response.text();
  assert.match(sitemap, /<urlset\b/);
  assert.match(sitemap, /\/2025\/12\/31\/review-2025\//);
  assert.doesNotMatch(sitemap, /<loc>[^<]*(?:404\.html|offline\.html|search\.json|package-lock\.json)/);
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    assert.equal(await page.evaluate(xml => new DOMParser().parseFromString(xml, 'application/xml').querySelectorAll('parsererror').length, sitemap), 0);
  } finally { await ctx.close(); }
});

test('first-visit offline fallback has real CSS and cached article navigation works', async () => {
  const ctx = await context({ serviceWorkers: 'allow' });
  try {
    const page = await ctx.newPage();
    await page.goto(origin, { waitUntil: 'load' });
    await page.evaluate(() => navigator.serviceWorker.ready);
    await page.waitForFunction(() => navigator.serviceWorker.controller);
    await ctx.setOffline(true);
    await page.goto(origin + '/never-visited/', { waitUntil: 'load' });
    assert.match(await page.title(), /offline/i);
    const css = await page.evaluate(async () => { const r = await fetch('/css/theme.css'); return { status: r.status, type: r.headers.get('content-type'), text: await r.text() }; });
    assert.equal(css.status, 200);
    assert.match(css.type, /text\/css/);
    assert.doesNotMatch(css.text, /<!doctype html/i);
    const absent = await page.evaluate(async () => { try { const r = await fetch('/missing-script.js'); return { ok: r.ok, type: r.headers.get('content-type') }; } catch { return { ok: false, type: null }; } });
    assert.equal(absent.ok, false);
    await ctx.setOffline(false);
    await page.goto(origin + '/2025/12/31/review-2025/', { waitUntil: 'load' });
    await page.waitForFunction(async () => !!(await caches.match(location.href)));
    await ctx.setOffline(true);
    await page.goto(origin + '/2025/12/31/review-2025/', { waitUntil: 'load' });
    assert.match(await page.title(), /2025/);
  } finally { await ctx.close(); }
});

test('archive filters show posts with the selected tag', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/archive/?tag=AI', { waitUntil: 'load' });
    assert.equal(await page.locator('.js-result .post-preview:visible').count(), 5);
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});

test('normal and hovered summary text has adequate light-theme contrast', async () => {
  const ctx = await context({ colorScheme: 'light' });
  function luminance(rgb) {
    const channels = rgb.match(/[\d.]+/g).slice(0, 3).map(Number).map(value => value / 255).map(value => value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4);
    return channels[0] * 0.2126 + channels[1] * 0.7152 + channels[2] * 0.0722;
  }
  function contrast(a, b) { const [low, high] = [luminance(a), luminance(b)].sort((x, y) => x - y); return (high + 0.05) / (low + 0.05); }
  try {
    const page = await ctx.newPage();
    await page.goto(origin, { waitUntil: 'load' });
    const sample = page.locator('.post-content-preview').first();
    const normal = await sample.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(document.body).backgroundColor, style: getComputedStyle(el).fontStyle }));
    assert.ok(contrast(normal.color, normal.background) >= 4.5, JSON.stringify(normal));
    assert.equal(normal.style, 'normal');
    await sample.hover();
    const hovered = await sample.evaluate(el => ({ color: getComputedStyle(el).color, background: getComputedStyle(document.body).backgroundColor }));
    assert.ok(contrast(hovered.color, hovered.background) >= 4.5, JSON.stringify(hovered));
    await page.setViewportSize({ width: 390, height: 844 });
    assert.ok(await sample.evaluate(el => parseFloat(getComputedStyle(el).fontSize)) >= 15);
  } finally { await ctx.close(); }
});

test('ads load once and analytics uses the configured target', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    await page.goto(origin, { waitUntil: 'load' });
    const state = await page.evaluate(() => ({
      ads: [...document.scripts].filter(script => script.src.includes('/pagead/js/adsbygoogle.js')).length,
      ga: [...document.scripts].find(script => script.src.includes('googletagmanager.com/gtag/js'))?.src,
      configs: (window.dataLayer || []).map(entry => Array.from(entry)).filter(entry => entry[0] === 'config'),
      oldScripts: [...document.scripts].filter(script => /\/(?:bootstrap(?:\.min)?|fastclick(?:\.min)?)\.js(?:\?|$)/.test(script.src)).map(script => script.src),
      jquery: window.jQuery.fn.jquery,
    }));
    assert.equal(state.ads, 1);
    assert.equal(state.configs.length, 1);
    assert.equal(new URL(state.ga).searchParams.get('id'), state.configs[0][1]);
    assert.equal(state.configs[0][1], 'UA-71624738-3');
    assert.deepEqual(state.oldScripts, []);
    assert.ok(parseInt(state.jquery, 10) >= 4);
  } finally { await ctx.close(); }
});

test('article media reserves dimensions and retains the original GIF', async () => {
  const ctx = await context();
  try {
    const page = await ctx.newPage();
    await page.goto(origin + '/2021/10/10/game-design-talk-about-fragments-of-memory/', { waitUntil: 'load' });
    const images = await page.locator('.post-container img').evaluateAll(elements => elements.map(el => ({ src: el.getAttribute('src'), width: Number(el.getAttribute('width')), height: Number(el.getAttribute('height')), loading: el.loading })));
    assert.ok(images.length > 3);
    assert.ok(images.every(image => image.width > 0 && image.height > 0), JSON.stringify(images));
    assert.ok(images.some(image => image.loading === 'lazy'));
    assert.ok(images.some(image => image.src.endsWith('/08.gif')), 'Keep the original animation with unverified damaged tail');
    const video = page.locator('video').first();
    assert.equal(await video.count(), 1);
    assert.equal(await video.evaluate(el => el.controls && el.playsInline && !el.autoplay && el.preload === 'none'), true);
    const metadata = await video.evaluate(el => new Promise((resolve, reject) => {
      const deadline = setTimeout(() => reject(new Error('Video metadata did not load')), 10000);
      el.addEventListener('loadedmetadata', () => { clearTimeout(deadline); resolve({ duration: el.duration, width: el.videoWidth, height: el.videoHeight }); }, { once: true });
      el.addEventListener('error', () => { clearTimeout(deadline); reject(new Error('Video decode failed')); }, { once: true });
      el.load();
    }));
    assert.ok(Math.abs(metadata.duration - 6.9) < 0.1, JSON.stringify(metadata));
    assert.ok(metadata.width > 0 && metadata.height > 0);
  } finally { await ctx.close(); }
});

test('catalog, languages, theme cycle and mobile navigation remain usable', async () => {
  const ctx = await context({ colorScheme: 'light' });
  try {
    const page = await ctx.newPage(), errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(origin + '/2016/10/21/simple-to-use-frp/', { waitUntil: 'load' });
    const catalog = page.locator('.catalog-body a').last();
    assert.ok(await catalog.count());
    await catalog.click();
    await page.waitForFunction(() => scrollY > 0);
    await page.goto(origin + '/about/?lang=en', { waitUntil: 'load' });
    assert.equal(await page.locator('.en.post-container').isVisible(), true);
    assert.equal(await page.locator('.zh.post-container').isVisible(), false);
    await page.goto(origin, { waitUntil: 'load' });
    for (const expected of ['light', 'dark', null]) {
      await page.locator('#theme-toggle').click();
      assert.equal(await page.locator('html').getAttribute('data-theme'), expected);
    }
    await page.setViewportSize({ width: 390, height: 844 });
    await page.locator('.navbar-toggle').click();
    assert.ok(await page.locator('#huxblog_navbar').evaluate(el => el.classList.contains('in')));
    assert.deepEqual(errors, []);
  } finally { await ctx.close(); }
});
