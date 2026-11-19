#!/usr/bin/env node
/**
 * ShirtNerdXL Image Rescue — Node 20+; no npm packages required.
 * Run: node scripts/download-images.mjs
 * Optional: node scripts/download-images.mjs --dry-run
 *         node scripts/download-images.mjs --concurrency=4 --retries=4
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
function numberArg(name, fallback, min, max) {
  const flag = args.find(x => x.startsWith(`--${name}=`));
  if (!flag) return fallback;
  const val = Number(flag.split('=')[1]);
  if (!Number.isInteger(val) || val < min || val > max) throw new Error(`--${name} must be ${min}-${max}`);
  return val;
}
const concurrency = numberArg('concurrency', 5, 1, 12);
const retries = numberArg('retries', 4, 0, 10);
const maxBytes = numberArg('max-mb', 40, 1, 200) * 1024 * 1024;
const root = path.resolve(here, '..');
const inputPath = path.join(root, 'products.json');
const outputPath = path.join(root, 'products.local.json');
const publicDir = path.join(root, 'public', 'products');
const reportDir = path.join(root, 'reports');
const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
const hash = value => crypto.createHash('sha256').update(value).digest('hex').slice(0, 14);
const safeSlug = value => String(value || 'unnamed').toLowerCase().replace(/[^a-z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').slice(0, 110) || 'unnamed';
const escapeCsv = value => `"${String(value ?? '').replaceAll('"', '""')}"`;
const csv = rows => rows.map(row => row.map(escapeCsv).join(',')).join('\n') + '\n';

// Validate actual bytes, not file extension or Content-Type alone.
function imageInfo(buffer) {
  if (buffer.length < 100) return null;
  if (buffer.subarray(0, 3).equals(Buffer.from([0xff, 0xd8, 0xff]))) return { ext: '.jpg', mime: 'image/jpeg' };
  if (buffer.subarray(0, 8).equals(Buffer.from([137,80,78,71,13,10,26,10]))) return { ext: '.png', mime: 'image/png' };
  if (buffer.subarray(0, 4).toString('ascii') === 'GIF8') return { ext: '.gif', mime: 'image/gif' };
  if (buffer.subarray(0, 4).toString('ascii') === 'RIFF' && buffer.subarray(8, 12).toString('ascii') === 'WEBP') return { ext: '.webp', mime: 'image/webp' };
  if (buffer.subarray(4, 8).toString('ascii') === 'ftyp' && ['avif','avis'].includes(buffer.subarray(8, 12).toString('ascii'))) return { ext: '.avif', mime: 'image/avif' };
  return null;
}
function checkedUrl(str) {
  const url = new URL(str);
  if (url.protocol !== 'https:' || url.hostname !== 'cdn.shopify.com') throw new Error('URL is not an HTTPS cdn.shopify.com image');
  return url.href;
}
async function loadExisting(targetBase) {
  for (const ext of ['.jpg','.jpeg','.png','.gif','.webp','.avif']) {
    const pathname = targetBase + ext;
    try {
      const data = await fs.readFile(pathname);
      const info = imageInfo(data);
      if (info && (ext === info.ext || (ext === '.jpeg' && info.ext === '.jpg'))) return { file: pathname, bytes: data.length, info };
    } catch (e) { if (e.code !== 'ENOENT') throw e; }
  }
  return null;
}
async function getImage(url) {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 30000);
    try {
      const response = await fetch(url, { signal: controller.signal, headers: { 'User-Agent': 'ShirtNerdXL-image-backup/1.0', 'Accept': 'image/*' } });
      // Don't follow an unexpected redirect to another domain without validation.
      checkedUrl(response.url);
      if (!response.ok) {
        const err = new Error(`HTTP ${response.status}`);
        if (response.status >= 400 && response.status < 500 && response.status !== 408 && response.status !== 429) throw Object.assign(err, { permanent: true });
        throw err;
      }
      const length = Number(response.headers.get('content-length'));
      if (length > maxBytes) throw Object.assign(new Error('Image exceeds max size'), { permanent: true });
      const chunks = [];
      let total = 0;
      for await (const chunk of response.body) {
        total += chunk.length;
        if (total > maxBytes) throw Object.assign(new Error('Image exceeds max size'), { permanent: true });
        chunks.push(chunk);
      }
      const data = Buffer.concat(chunks);
      const info = imageInfo(data);
      if (!info) throw Object.assign(new Error('Response is not a recognized image'), { permanent: true });
      return { data, info };
    } catch (error) {
      lastError = error;
      if (error.permanent || attempt === retries) break;
      const delay = Math.min(12000, 650 * (2 ** attempt)) + Math.floor(Math.random() * 300);
      await sleep(delay);
    } finally { clearTimeout(timer); }
  }
  throw lastError;
}
async function main() {
  const products = JSON.parse(await fs.readFile(inputPath, 'utf8'));
  if (!Array.isArray(products)) throw new Error('products.json must contain a product array');
  const jobs = new Map();
  const usedSlugs = new Set();
  for (const product of products) {
    if (!product.handle || !Array.isArray(product.images)) throw new Error('Invalid product structure');
    const slug = safeSlug(product.handle);
    if (usedSlugs.has(slug)) throw new Error(`Duplicate product handle: ${slug}`);
    usedSlugs.add(slug);
    const urls = [...product.images.map(i => i.url), ...(product.variants || []).map(v => v.imageUrl)].filter(Boolean);
    for (const inputUrl of urls) {
      let url;
      try { url = checkedUrl(inputUrl); }
      catch (e) { throw new Error(`Bad URL for ${slug}: ${inputUrl}: ${e.message}`); }
      const key = `${slug}\0${url}`;
      if (!jobs.has(key)) {
        const basename = safeSlug(path.basename(new URL(url).pathname).replace(/\.[^.]+$/, '')).slice(0, 55);
        jobs.set(key, { slug, url, key, base: path.join(publicDir, slug, `${basename}-${hash(url)}`) });
      }
    }
  }
  const queue = [...jobs.values()];
  console.log(`${products.length} products, ${queue.length} product-scoped unique image downloads`);
  console.log(`Output: ${publicDir}`);
  if (dryRun) {
    console.log('Dry run: no images or files were written.');
    return;
  }
  await fs.mkdir(publicDir, { recursive: true });
  await fs.mkdir(reportDir, { recursive: true });
  let index = 0, completed = 0;
  const results = new Map();
  async function worker() {
    while (true) {
      const i = index++;
      if (i >= queue.length) return;
      const job = queue[i];
      try {
        const existing = await loadExisting(job.base);
        let pathname, bytes, status;
        if (existing) { pathname = existing.file; bytes = existing.bytes; status = 'reused'; }
        else {
          const { data, info } = await getImage(job.url);
          await fs.mkdir(path.dirname(job.base), { recursive: true });
          pathname = job.base + info.ext;
          const tmp = `${pathname}.partial-${process.pid}`;
          await fs.writeFile(tmp, data);
          await fs.rename(tmp, pathname);
          bytes = data.length;
          status = 'downloaded';
        }
        results.set(job.key, { status, path: `/products/${job.slug}/${path.basename(pathname)}`, bytes, error: '' });
      } catch (e) { results.set(job.key, { status: 'failed', path: '', bytes: 0, error: e.message }); }
      completed++;
      if (completed % 25 === 0 || completed === queue.length) console.log(`${completed}/${queue.length} processed`);
    }
  }
  await Promise.all(Array.from({ length: Math.min(concurrency, queue.length) }, worker));
  const lookup = (slug, url) => results.get(`${slug}\0${checkedUrl(url)}`);
  const localProducts = products.map(product => {
    const slug = safeSlug(product.handle);
    return {
      ...product,
      images: product.images.map(im => {
        const result = lookup(slug, im.url);
        return { ...im, sourceUrl: im.url, url: result?.path || null, downloadStatus: result?.status || 'failed' };
      }),
      variants: (product.variants || []).map(v => {
        if (!v.imageUrl) return v;
        const result = lookup(slug, v.imageUrl);
        return { ...v, sourceImageUrl: v.imageUrl, imageUrl: result?.path || null };
      })
    };
  });
  const reportRows = [['handle','source_url','local_path','status','bytes','error']];
  for (const job of queue) {
    const result = results.get(job.key);
    reportRows.push([job.slug,job.url,result.path,result.status,result.bytes,result.error]);
  }
  await fs.writeFile(path.join(reportDir, 'image-download-report.csv'), csv(reportRows));
  const failures = [...results.values()].filter(r => r.status === 'failed').length;
  const missingProducts = localProducts.filter(p => !p.images.some(im => im.url)).map(p => p.handle);
  const summary = {
    products: products.length,
    imageJobs: queue.length,
    downloaded: [...results.values()].filter(r => r.status === 'downloaded').length,
    reused: [...results.values()].filter(r => r.status === 'reused').length,
    failed: failures,
    productsWithoutAnyLocalImage: missingProducts,
    totalSavedBytes: [...results.values()].reduce((sum, r) => sum + r.bytes, 0)
  };
  await fs.writeFile(path.join(reportDir, 'summary.json'), JSON.stringify(summary, null, 2) + '\n');
  await fs.writeFile(outputPath, JSON.stringify(localProducts, null, 2) + '\n');
  console.log('\n' + JSON.stringify(summary, null, 2));
  console.log(`Local catalog: ${outputPath}`);
  console.log(`Report: ${path.join(reportDir, 'image-download-report.csv')}`);
  if (failures || missingProducts.length) {
    console.error('Some images failed. Re-run the script; successful files are reused.');
    process.exitCode = 1;
  } else console.log('Success: All referenced images are saved locally.');
}
main().catch(e => { console.error('Fatal:', e.message); process.exitCode = 1; });
