#!/usr/bin/env node
/**
 * Dependency-free image dimension reader (JPEG/PNG/GIF/WebP).
 * Usage: import { readDims } from './image-dims.mjs'  — or run: node scripts/image-dims.mjs <file>
 */
import fs from 'node:fs';

export function readDims(absPath) {
  const b = fs.readFileSync(absPath);
  if (b.length < 24) return null;
  // PNG
  if (b[0] === 0x89 && b[1] === 0x50 && b[2] === 0x4e && b[3] === 0x47) {
    return { width: b.readUInt32BE(16), height: b.readUInt32BE(20) };
  }
  // GIF
  if (b.subarray(0, 4).toString('ascii') === 'GIF8') {
    return { width: b.readUInt16LE(6), height: b.readUInt16LE(8) };
  }
  // WebP
  if (b.subarray(0, 4).toString('ascii') === 'RIFF' && b.subarray(8, 12).toString('ascii') === 'WEBP') {
    const chunk = b.subarray(12, 16).toString('ascii');
    if (chunk === 'VP8 ') return { width: b.readUInt16LE(26) & 0x3fff, height: b.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = b.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { width: 1 + b.readUIntLE(24, 3), height: 1 + b.readUIntLE(27, 3) };
    return null;
  }
  // JPEG: walk markers until SOF0/1/2/3/5/6/7/9/10/11/13/14/15
  if (b[0] === 0xff && b[1] === 0xd8) {
    let o = 2;
    while (o + 9 < b.length) {
      if (b[o] !== 0xff) { o++; continue; }
      const marker = b[o + 1];
      if (marker === 0xd8 || (marker >= 0x01 && marker <= 0x0f) || marker === 0x01) { o += 2; continue; }
      if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
        return { height: b.readUInt16BE(o + 5), width: b.readUInt16BE(o + 7) };
      }
      const len = b.readUInt16BE(o + 2);
      o += 2 + len;
    }
    return null;
  }
  return null;
}

if (process.argv[2]) {
  console.log(JSON.stringify(readDims(process.argv[2])));
}
