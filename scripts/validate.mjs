#!/usr/bin/env node
/**
 * Static validation gates (PLAN §5.1 / §6). Run after `next build`.
 * Usage: node scripts/validate.mjs
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const catalog = JSON.parse(fs.readFileSync(path.join(root, 'data', 'catalog.json'), 'utf8'));
const products = catalog.products;
const SUPPORTED = catalog.supportedSizes;
const EXPECTED_PRICES = { L: 24.99, XL: 24.99, '2XL': 24.99, '3XL': 24.99, '4XL': 26.99, '5XL': 26.99 };

let failures = 0;
function gate(name, ok, detail = '') {
  console.log(`${ok ? 'PASS' : 'FAIL'}  ${name}${detail ? ` — ${detail}` : ''}`);
  if (!ok) failures++;
}

// (a) product count (53 original + 26 imported 2026-11)
gate('a: 79 products (53 original + 26 imported)', products.length === 79, `got ${products.length}`);

// (b) every primary + gallery image file exists
let missing = [];
for (const p of products) {
  if (!p.primaryImage) missing.push(`${p.handle}:no-primary`);
  else if (!fs.existsSync(path.join(root, 'public', p.primaryImage.url))) missing.push(`${p.handle}:primary-missing:${p.primaryImage.url}`);
  for (const g of p.gallery) {
    if (!fs.existsSync(path.join(root, 'public', g.url))) missing.push(`${p.handle}:${g.url}`);
  }
}
gate('b: all image files exist', missing.length === 0, missing.slice(0, 5).join(', '));

// (c) no duplicate (size,color) within knownCombos
let dups = [];
for (const p of products) {
  const seen = new Set();
  for (const c of p.knownCombos) {
    if (!c.size && !c.color) continue;
    const key = `${c.size}|${c.color}`;
    if (seen.has(key)) dups.push(`${p.handle}:${key}`);
    seen.add(key);
  }
}
gate('c: no duplicate known combos', dups.length === 0, dups.join(', '));

// (d) selectionMode invariants
let modeBad = [];
for (const p of products) {
  const hasSupported = p.knownCombos.some(c => SUPPORTED.includes(c.size));
  if ((p.selectionMode === 'strict') !== hasSupported) modeBad.push(p.handle);
}
gate('d: selectionMode invariants', modeBad.length === 0, modeBad.join(', '));

// (e) prices follow config
const pricesOk = SUPPORTED.every(s => catalog.standardPrices[s] === EXPECTED_PRICES[s]) && catalog.fromPrice === 24.99;
gate('e: standard prices match config', pricesOk);

// (f) no Shopify CDN references in app code or data
function walkText(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walkText(p, out);
    else if (/\.(ts|tsx|json|css|mjs)$/.test(e.name)) out.push(p);
  }
  return out;
}
let cdnHits = [];
for (const dir of ['app', 'components', 'lib', 'data']) {
  for (const f of walkText(path.join(root, dir))) {
    if (fs.readFileSync(f, 'utf8').includes('cdn.shopify.com')) cdnHits.push(path.relative(root, f));
  }
}
gate('f: zero cdn.shopify.com in app/data', cdnHits.length === 0, cdnHits.join(', '));

// (g) 53 prerendered product pages
const prerenderDir = path.join(root, '.next', 'server', 'app', 'products');
let htmlCount = 0;
try { htmlCount = fs.readdirSync(prerenderDir).filter(f => f.endsWith('.html')).length; } catch { /* not built */ }
gate('g: prerendered product pages match catalog', htmlCount === products.length, `got ${htmlCount} / ${products.length}`);

// (h) sitemap source covers products (runtime check done via curl in 5.2)
const sitemapSrc = fs.readFileSync(path.join(root, 'app', 'sitemap.ts'), 'utf8');
gate('h: sitemap generated from catalog', sitemapSrc.includes('getProducts()'));

console.log(failures ? `\n${failures} gate(s) FAILED` : '\nAll static gates passed');
process.exit(failures ? 1 : 0);
