// Static checks on the production build in dist/. Browser behaviour and
// accessibility are covered by the Playwright tests in tests/e2e.
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('dist');
const required = [
  'index.html', '404.html', 'privacy/index.html',
  'auto-insurance/index.html', 'home-insurance/index.html', 'commercial-insurance/index.html',
  'robots.txt', 'sitemap.xml', 'favicon.ico', 'favicon-32.png', 'apple-touch-icon.png',
  'assets/hero.webp', 'assets/hero-768.webp', 'assets/hero-1152.webp',
  'assets/logo.webp', 'assets/shield.webp', 'assets/og-image.jpg',
];
for (const file of required) assert.ok(fs.existsSync(path.join(root, file)), `Missing build artifact: ${file}`);

const htmlFiles = fs.readdirSync(root, { recursive: true }).filter(file => String(file).endsWith('.html')).map(String);
for (const file of htmlFiles) {
  const html = fs.readFileSync(path.join(root, file), 'utf8');
  const where = `(${file})`;
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `Page must have exactly one h1 ${where}`);
  assert.ok(html.includes('Content-Security-Policy'), `Production CSP missing ${where}`);
  assert.ok(!/fonts\.(googleapis|gstatic)\.com/.test(html), `Fonts must be self-hosted ${where}`);
  assert.ok(html.includes('tel:+16479172693') && html.includes('mailto:aayush.khatri@unibrokers.ca'), `Contact details missing ${where}`);

  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
  assert.equal(new Set(ids).size, ids.length, `Duplicate element IDs ${where}`);

  for (const [, value] of html.matchAll(/\b(?:src|href)="([^"]+)"/g)) {
    if (value.startsWith('#') && value.length > 1) assert.ok(ids.includes(value.slice(1)), `Broken section link ${value} ${where}`);
    else if (value.startsWith('/') && !value.startsWith('//')) {
      const [target, hash] = value.split('#');
      const local = path.join(root, target.split('?')[0]);
      const exists = fs.existsSync(local) && (!fs.statSync(local).isDirectory() || fs.existsSync(path.join(local, 'index.html')));
      assert.ok(exists, `Missing local page or asset ${value} ${where}`);
      if (hash && target === '/') assert.ok(fs.readFileSync(path.join(root, 'index.html'), 'utf8').includes(`id="${hash}"`), `Broken home link ${value} ${where}`);
    }
  }
  for (const [, srcset] of html.matchAll(/\bsrcset="([^"]+)"/g)) {
    for (const candidate of srcset.split(',')) assert.ok(fs.existsSync(path.join(root, candidate.trim().split(/\s+/)[0])), `Missing srcset image ${candidate} ${where}`);
  }
  for (const [, target] of html.matchAll(/\baria-(?:controls|labelledby)="([^"]+)"/g)) {
    for (const id of target.split(' ')) assert.ok(ids.includes(id), `Missing ARIA target ${id} ${where}`);
  }
  // Only external scripts or non-executable JSON-LD are allowed under the CSP.
  for (const [, attributes, body] of html.matchAll(/<script([^>]*)>([\s\S]*?)<\/script>/g)) {
    const isData = /type="application\/ld\+json"/.test(attributes);
    assert.ok(/\bsrc=/.test(attributes) || isData || !body.trim(), `Inline script conflicts with production CSP ${where}`);
    if (isData) JSON.parse(body);
  }
}

const home = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
assert.ok(home.includes('Dheeraz Vasireddy') && home.includes('Aayush Khatri'), 'Core team content missing.');
assert.ok(home.includes('og:image') && home.includes('application/ld+json'), 'Social preview or structured data missing.');
assert.ok(!fs.readFileSync(path.join(root, '404.html'), 'utf8').includes('application/ld+json'), '404 page should not carry structured data.');
const sitemap = fs.readFileSync(path.join(root, 'sitemap.xml'), 'utf8');
for (const page of ['/auto-insurance/', '/home-insurance/', '/commercial-insurance/', '/privacy/']) assert.ok(sitemap.includes(page), `Sitemap missing ${page}`);

console.log(`Production output (${htmlFiles.length} pages): assets, links, headings, ARIA references, contact details, structured data and CSP compatibility passed.`);
