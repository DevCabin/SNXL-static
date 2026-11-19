#!/usr/bin/env node
/**
 * One-time image optimization for Vercel Hobby static-upload cap (100MB/deployment).
 * Copies originals to image-masters/ (gitignored), re-encodes in place (<=1600px,
 * JPEG q72 mozjpeg / PNG max compression). Idempotent via report CSV.
 * Run: node scripts/optimize-images.mjs
 */
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const pubDir = path.join(root, 'public', 'products');
const masterDir = path.join(root, 'image-masters');
const reportPath = path.join(root, 'reports', 'image-optimization-report.csv');
function numArg(name, fallback) {
  const f = process.argv.find(a => a.startsWith(`--${name}=`));
  return f ? Number(f.split('=')[1]) : fallback;
}
const MAX_EDGE = numArg('max', 1600);
const JPEG_Q = numArg('q', 72);
const PNG_Q = numArg('pq', 80);
const PNG_TO_WEBP = process.argv.includes('--png-webp');

async function walk(dir, out = []) {
  for (const entry of await fs.readdir(dir, { withFileTypes: true })) {
    const p = path.join(dir, entry.name);
    if (entry.isDirectory()) await walk(p, out);
    else if (/\.(jpe?g|png|webp)$/i.test(entry.name)) out.push(p);
  }
  return out;
}

function parseReport(text) {
  const done = new Set();
  for (const line of text.split('\n').slice(1)) {
    const m = line.match(/^"([^"]+)","(\d+)","(\d+)"/);
    if (m && Number(m[3]) > 0) done.add(m[1]);
  }
  return done;
}

async function resolveMaster(rel, pubFile) {
  const candidates = [
    rel,
    rel.replace(/\.webp$/i, '.jpg'),
    rel.replace(/\.webp$/i, '.jpeg'),
    rel.replace(/\.webp$/i, '.png'),
  ];
  for (const c of candidates) {
    const p = path.join(masterDir, c);
    try { await fs.access(p); return p; } catch { /* next */ }
  }
  const fallback = path.join(masterDir, rel);
  await fs.mkdir(path.dirname(fallback), { recursive: true });
  await fs.copyFile(pubFile, fallback);
  return fallback;
}

async function main() {
  const force = process.argv.includes('--force');
  const files = (await walk(pubDir)).sort();
  let done = new Set();
  let report = 'path,before_bytes,after_bytes\n';
  try {
    const existing = await fs.readFile(reportPath, 'utf8');
    if (!force) {
      done = parseReport(existing);
      report = existing.endsWith('\n') ? existing : existing + '\n';
    }
  } catch { /* first run */ }

  let beforeTotal = 0, afterTotal = 0, processed = 0, skipped = 0;
  const rows = [];
  const queue = [...files];
  async function worker() {
    while (queue.length) {
      const file = queue.shift();
      const rel = path.relative(pubDir, file).split(path.sep).join('/');
      if (done.has(rel)) { skipped++; continue; }
      const master = await resolveMaster(rel, file);
      const before = (await fs.stat(master)).size;
      const img = sharp(master).resize({ width: MAX_EDGE, height: MAX_EDGE, fit: 'inside', withoutEnlargement: true });
      const meta = await sharp(master).metadata();
      const outExt = meta.format === 'png' && !PNG_TO_WEBP ? '.png' : '.webp';
      let target = file.replace(/\.(jpe?g|png|webp)$/i, outExt);
      const buf = outExt === '.png'
        ? await img.png({ compressionLevel: 9 }).toBuffer()
        : await img.webp({ quality: meta.format === 'png' ? PNG_Q : JPEG_Q }).toBuffer();
      const after = buf.length;
      if (after < before) {
        await fs.writeFile(target, buf);
        if (target !== file) await fs.rm(file, { force: true });
      } else {
        target = file;
      }
      const targetRel = path.relative(pubDir, target).split(path.sep).join('/');
      rows.push([targetRel, before, Math.min(after, before)]);
      beforeTotal += before; afterTotal += Math.min(after, before); processed++;
      if (processed % 50 === 0) console.log(`${processed} optimized...`);
    }
  }
  await Promise.all(Array.from({ length: 4 }, worker));

  for (const [rel, b, a] of rows) report += `"${rel}","${b}","${a}"\n`;
  await fs.mkdir(path.dirname(reportPath), { recursive: true });
  await fs.writeFile(reportPath, report);
  console.log(`optimized ${processed}, skipped ${skipped}, ${(beforeTotal / 1e6).toFixed(1)}MB -> ${(afterTotal / 1e6).toFixed(1)}MB (of processed)`);
}

main().catch(err => { console.error(err); process.exit(1); });
