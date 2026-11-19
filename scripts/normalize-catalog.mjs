#!/usr/bin/env node
/**
 * Normalize products.local.json → data/catalog.json + data/review-flags.json + reports/variant-review.md
 * Rules: PLAN.md D1 (hybrid variants), D2 (pricing), D4 (alts), D5 (tags).
 * Run: node scripts/normalize-catalog.mjs   (re-run anytime; outputs are generated)
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sanitizeHtml from 'sanitize-html';
import { readDims } from './image-dims.mjs';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pubDir = path.join(root, 'public');
const src = JSON.parse(fs.readFileSync(path.join(root, 'products.local.json'), 'utf8'));

const SUPPORTED = ['L', 'XL', '2XL', '3XL', '4XL', '5XL'];
const STANDARD = { L: 24.99, XL: 24.99, '2XL': 24.99, '3XL': 24.99, '4XL': 26.99, '5XL': 26.99 };
const FROM_PRICE = Math.min(...Object.values(STANDARD));
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

function resolveLocal(url) {
  if (!url || !url.startsWith('/products/')) return null;
  const candidates = [url, url.replace(/\.(jpe?g|png)$/i, '.webp')];
  for (const c of candidates) if (fs.existsSync(path.join(pubDir, c))) return c;
  return null;
}
function parseTags(raw) {
  let list = raw;
  if (typeof raw === 'string') {
    try { list = JSON.parse(raw.replace(/'/g, '"')); } catch { list = raw.split(','); }
  }
  return (Array.isArray(list) ? list : [])
    .map(t => String(t).trim())
    .filter(Boolean)
    .map(t => (t.toLowerCase() === 'sci fi' ? 'sci-fi' : t));
}
function clean(html, title) {
  return sanitizeHtml(html || '', {
    allowedTags: ['p', 'br', 'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'a', 'h2', 'h3', 'h4', 'blockquote', 'span'],
    allowedAttributes: { a: ['href', 'title'] },
    allowedSchemes: ['https', 'mailto'],
  }).trim() || `<p>${sanitizeHtml(title)}</p>`;
}
const products = [];
const flags = [];
let missingFiles = 0;
const modeCounts = { strict: 0, preference: 0 };

for (const p of src) {
  const title = String(p.title || p.handle);
  const gallery = [];
  for (const im of p.images || []) {
    const url = resolveLocal(im.url);
    if (!url) { missingFiles++; continue; }
    const dims = readDims(path.join(pubDir, url)) || { width: 1200, height: 1200 };
    const rawAlt = String(im.alt || '').trim();
    gallery.push({ url, alt: !rawAlt || UUID_RE.test(rawAlt) ? title : rawAlt, width: dims.width, height: dims.height });
  }
  const variants = [];
  for (const v of p.variants || []) {
    const o = v.options || {};
    variants.push({
      sku: v.sku,
      originalPrice: Number(v.price),
      size: String(o.Size || '').trim(),
      color: String(o.Color || '').trim(),
      imageUrl: resolveLocal(v.imageUrl),
    });
  }
  const knownCombos = variants.filter(v => v.size || v.color);
  const unknownVariants = variants.filter(v => !v.size && !v.color);
  const colorsKnown = [...new Set(variants.map(v => v.color).filter(Boolean))];
  const sizesKnown = [...new Set(variants.map(v => v.size).filter(Boolean))];
  const selectionMode = knownCombos.some(c => SUPPORTED.includes(c.size)) ? 'strict' : 'preference';
  modeCounts[selectionMode]++;
  products.push({
    handle: p.handle,
    title,
    urlPath: p.urlPath || `/products/${p.handle}`,
    tags: parseTags(p.tags),
    descriptionHtmlSafe: clean(p.descriptionHtml, title),
    gallery,
    primaryImage: gallery[0] || null,
    knownCombos,
    unknownVariantCount: unknownVariants.length,
    colorsKnown,
    sizesKnown,
    selectionMode,
    fromPrice: FROM_PRICE,
    standardPrices: STANDARD,
    gelatoProductId: p.gelato?.productId || null,
  });
  flags.push({
    handle: p.handle,
    selectionMode,
    knownCombos: knownCombos.length,
    unknownVariants: unknownVariants.length,
    hiddenSizes: sizesKnown.filter(s => !SUPPORTED.includes(s)),
    colorsKnown,
  });
}

const dupGroups = [
  ['sunset-stroll-mechanical-marvels-branded-graphic-tee-for-big-guys-up-to-5xl', 'sunset-stroll-mechanical-marvels-graphic-tee-for-big-guys-up-to-5xl'],
  ['twilight-trek-mechanical-marvels-branded-graphic-tee-up-to-5xl', 'twilight-trek-mechanical-marvels-graphic-tee-up-to-5xl'],
  ['wrangler-hair-don-t-care', 'wrangler-hair-don-t-care-black'],
  ['fairly-introverted-but-willing-to-talk-about-my-jeep', 'fairly-introverted-but-willing-to-talk-about-my-jeep-on-dark'],
  ['be-nice-to-everyone-they-may-win-the-lotto-one-day-funny-graphic-tee-for-big-men-up-to-5xl', 'be-nice-to-everyone-they-may-win-the-lotto-one-day-branded-funny-graphic-tee-for-big-men-up-to-5xl'],
  ['listen-to-more-weezer', 'listen-to-more-weezer-nerd-rock-4ever'],
];

fs.mkdirSync(path.join(root, 'data'), { recursive: true });
fs.writeFileSync(path.join(root, 'data', 'catalog.json'), JSON.stringify({ generatedAt: new Date().toISOString(), supportedSizes: SUPPORTED, standardPrices: STANDARD, fromPrice: FROM_PRICE, products }, null, 1));
fs.writeFileSync(path.join(root, 'data', 'review-flags.json'), JSON.stringify({ generatedAt: new Date().toISOString(), supportedSizes: SUPPORTED, duplicateHandleGroups: dupGroups, products: flags }, null, 1));

const md = ['# Variant review report', '', `Supported sizes: ${SUPPORTED.join(', ')} (others hidden per pricing rule).`, `Modes: strict=${modeCounts.strict}, preference=${modeCounts.preference}.`, '', '| handle | mode | known combos | unknown variants | hidden sizes |', '|---|---|---|---|---|'];
for (const f of flags) md.push(`| ${f.handle} | ${f.selectionMode} | ${f.knownCombos} | ${f.unknownVariants} | ${f.hiddenSizes.join('; ') || '-'} |`);
md.push('', '## Near-duplicate handle pairs (distinct products, keep both)');
for (const g of dupGroups) md.push(`- ${g[0]}  vs  ${g[1]}`);
fs.writeFileSync(path.join(root, 'reports', 'variant-review.md'), md.join('\n') + '\n');

console.log(`products=${products.length} missingFiles=${missingFiles} strict=${modeCounts.strict} preference=${modeCounts.preference}`);
