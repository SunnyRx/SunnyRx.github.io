import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

function decodeEntities(value) {
  const named = { amp: '&', quot: '"', apos: "'", lt: '<', gt: '>', nbsp: '\u00a0' };
  return value.replace(/&(#x[\da-f]+|#\d+|amp|quot|apos|lt|gt|nbsp);/gi, (match, entity) => {
    if (entity[0] !== '#') return named[entity.toLowerCase()] || match;
    const point = parseInt(entity.slice(entity[1].toLowerCase() === 'x' ? 2 : 1), entity[1].toLowerCase() === 'x' ? 16 : 10);
    return point <= 0x10ffff ? String.fromCodePoint(point) : match;
  });
}

function readDocument(file) {
  const text = fs.readFileSync(file, 'utf8').replace(/<!--[\s\S]*?-->|<script\b[^>]*>[\s\S]*?<\/script\s*>|<style\b[^>]*>[\s\S]*?<\/style\s*>/gi, '');
  const ids = new Set(), references = [];
  let canonical;
  for (const match of text.matchAll(/<([a-z][\w:-]*)\b((?:[^>"']|"[^"]*"|'[^']*')*)>/gi)) {
    const tag = match[1].toLowerCase(), attributes = {};
    for (const attribute of match[2].matchAll(/([^\s=/'"<>]+)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s>]+))/g)) {
      attributes[attribute[1].toLowerCase()] = decodeEntities(attribute[2] ?? attribute[3] ?? attribute[4]);
    }
    if (attributes.id) ids.add(attributes.id);
    if (tag === 'a' && attributes.name) ids.add(attributes.name);
    if (tag === 'link' && attributes.rel === 'canonical') canonical = attributes.href;
    for (const attribute of ['href', 'src', 'poster']) {
      if (attributes[attribute]) references.push({ tag, attribute, value: attributes[attribute] });
    }
  }
  return { ids, references, canonical };
}

function htmlFiles(directory) {
  return fs.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const file = path.join(directory, entry.name);
    return entry.isDirectory() ? htmlFiles(file) : entry.name.endsWith('.html') ? [file] : [];
  });
}

export function checkSite(directory) {
  const root = path.resolve(directory);
  if (!fs.existsSync(path.join(root, 'index.html'))) throw new Error(`No built homepage in ${root}. Run Jekyll first.`);
  const documents = new Map(htmlFiles(root).map(file => [file, readDocument(file)]));
  const home = documents.get(path.join(root, 'index.html'));
  const site = new URL(home.canonical || 'https://site.invalid/');
  const basePath = site.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
  const errors = [];
  let links = 0;

  for (const [file, document] of documents) {
    const relative = path.relative(root, file).split(path.sep).join('/');
    const source = new URL(relative.replace(/index\.html$/, ''), site);
    for (const reference of document.references) {
      const raw = reference.value.trim();
      if (!raw || raw === '#' || /^(?:javascript|mailto|tel|data|blob):/i.test(raw)) continue;
      let target;
      try { target = new URL(raw, source); }
      catch { errors.push({ source: relative, target: raw, reason: 'Invalid URL' }); continue; }
      if (!['http:', 'https:'].includes(target.protocol)) continue;
      if (target.hostname !== site.hostname && target.hostname !== `www.${site.hostname}`) continue;
      // A site hosted below /blog/ may intentionally link to other applications at the domain root.
      if (!target.pathname.startsWith(basePath)) continue;
      links++;
      let decodedPath, fragment;
      try {
        decodedPath = decodeURIComponent(target.pathname.slice(basePath.length));
        fragment = decodeURIComponent(target.hash.slice(1).split(':~:text=')[0]);
      } catch { errors.push({ source: relative, target: raw, reason: 'Invalid percent encoding' }); continue; }
      let destination = path.resolve(root, decodedPath);
      if (path.relative(root, destination).startsWith('..')) {
        errors.push({ source: relative, target: raw, reason: 'Path escapes the built site' }); continue;
      }
      if (fs.existsSync(destination) && fs.statSync(destination).isDirectory()) destination = path.join(destination, 'index.html');
      if (!fs.existsSync(destination)) {
        errors.push({ source: relative, target: raw, reason: 'Missing target' }); continue;
      }
      if (reference.tag === 'a' && reference.attribute === 'href' && fragment && documents.has(destination) && !documents.get(destination).ids.has(fragment)) {
        errors.push({ source: relative, target: raw, reason: `Missing anchor: ${fragment}` });
      }
    }
  }
  return { pages: documents.size, links, errors };
}

if (process.argv[1] && import.meta.url === pathToFileURL(path.resolve(process.argv[1])).href) {
  try {
    const result = checkSite(process.argv[2] || process.env.BLOG_SITE_DIR || '_site');
    console.log(`Checked ${result.pages} pages and ${result.links} internal references.`);
    for (const error of result.errors) console.error(`${error.source}: ${error.reason}\n  ${error.target}`);
    console.log(`${result.errors.length} broken internal references.`);
    if (result.errors.length) process.exitCode = 1;
  } catch (error) { console.error(error.message); process.exitCode = 1; }
}
