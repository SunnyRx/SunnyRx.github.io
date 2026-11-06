import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { checkSite } from '../scripts/check-site.mjs';

function fixture(t, files) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'blog-links-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  for (const [name, content] of Object.entries(files)) {
    fs.mkdirSync(path.dirname(path.join(root, name)), { recursive: true });
    fs.writeFileSync(path.join(root, name), content);
  }
  return root;
}

test('resolves pretty URLs, Chinese anchors, query entities and browser-normalized image paths', t => {
  const root = fixture(t, {
    'index.html': '<link rel="canonical" href="https://example.test/"><a href="/post?x=1&amp;y=2#%E7%BB%93%E8%AE%BA">post</a><a href="#">toggle</a><img src="\\img\\a.png"><a href="https://other.test/missing">external</a>',
    'post/index.html': '<h2 id="结论">Conclusion</h2><a href="../space%20file.html#named">relative</a>',
    'space file.html': '<a name="named"></a>',
    'img/a.png': '',
  });
  assert.deepEqual(checkSite(root).errors, []);
});

test('reports missing pages and anchors with the originating file', t => {
  const root = fixture(t, {
    'index.html': '<link rel="canonical" href="https://example.test/"><a href="/old-post/">missing</a><a href="/#wrong">bad anchor</a><script>const example="<a href=\"/not-a-link\">";</script>',
  });
  const errors = checkSite(root).errors;
  assert.equal(errors.length, 2);
  assert.ok(errors.every(error => error.source === 'index.html'));
  assert.equal(errors[0].reason, 'Missing target');
  assert.equal(errors[1].reason, 'Missing anchor: wrong');
});

test('handles deployment below a baseurl and text fragments', t => {
  const root = fixture(t, {
    'index.html': '<link rel="canonical" href="https://example.test/blog/"><a href="/blog/post/#:~:text=hello">text</a><a href="/other-app/">another app</a>',
    'post/index.html': '<p>hello</p>',
  });
  assert.deepEqual(checkSite(root).errors, []);
});
