// Minimal PNG reader for headless tests (T024 stretch test): 8-bit, non-interlaced; RGBA, RGB, grey(+alpha) and palette.
// readAlpha -> { w, h, alpha: Uint8Array(w * h) }; readRGBA -> { w, h, rgba: Uint8Array(w * h * 4) }. Node only (zlib).
import { readFileSync } from 'node:fs';
import { inflateSync } from 'node:zlib';

const cache = new Map();
export function readAlpha(path) { return readPng(path); }
export function readRGBA(path) { return readPng(path); }
function readPng(path) {
  if (cache.has(path)) return cache.get(path);
  const b = readFileSync(path);
  let o = 8, w, h, depth, type, inter, trns = null, palette = null;
  const idat = [];
  while (o < b.length) {
    const n = b.readUInt32BE(o), t = b.toString('latin1', o + 4, o + 8), d = b.subarray(o + 8, o + 8 + n);
    if (t === 'IHDR') { w = d.readUInt32BE(0); h = d.readUInt32BE(4); depth = d[8]; type = d[9]; inter = d[12]; }
    else if (t === 'tRNS') trns = d;
    else if (t === 'PLTE') palette = d;
    else if (t === 'IDAT') idat.push(d);
    else if (t === 'IEND') break;
    o += 12 + n;
  }
  if (depth !== 8 || inter) throw new Error(`${path}: only 8-bit non-interlaced PNGs (depth ${depth}, interlace ${inter})`);
  const bpp = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 }[type], raw = inflateSync(Buffer.concat(idat)), stride = w * bpp;
  const px = new Uint8Array(stride * h);
  for (let y = 0; y < h; y++) {
    const f = raw[y * (stride + 1)], src = y * (stride + 1) + 1, row = y * stride;
    for (let x = 0; x < stride; x++) {
      const a = x >= bpp ? px[row + x - bpp] : 0, up = y ? px[row - stride + x] : 0, c = y && x >= bpp ? px[row - stride + x - bpp] : 0;
      let v = raw[src + x];
      if (f === 1) v += a; else if (f === 2) v += up; else if (f === 3) v += (a + up) >> 1;
      else if (f === 4) { const p = a + up - c, pa = Math.abs(p - a), pb = Math.abs(p - up), pc = Math.abs(p - c); v += pa <= pb && pa <= pc ? a : pb <= pc ? up : c; }
      px[row + x] = v;
    }
  }
  const alpha = new Uint8Array(w * h), rgba = new Uint8Array(w * h * 4);
  for (let i = 0; i < w * h; i++) {
    alpha[i] = type === 6 ? px[i * 4 + 3] : type === 4 ? px[i * 2 + 1] : type === 3 ? (trns && px[i] < trns.length ? trns[px[i]] : 255) : 255;
    const c = type === 6 || type === 2 ? [px[i * bpp], px[i * bpp + 1], px[i * bpp + 2]] : type === 3 ? [palette[px[i] * 3], palette[px[i] * 3 + 1], palette[px[i] * 3 + 2]] : [px[i * bpp], px[i * bpp], px[i * bpp]];
    rgba.set([...c, alpha[i]], i * 4);
  }
  const out = { w, h, alpha, rgba };
  cache.set(path, out);
  return out;
}

// T026 r2: minimal PNG writer (8-bit RGBA, filter 0) for headless maps (tools/paint-map.mjs).
import { deflateSync } from 'node:zlib';
const CRC = Array.from({ length: 256 }, (_, n) => { let c = n; for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1; return c >>> 0; });
const crc = (b) => { let c = 0xffffffff; for (const x of b) c = CRC[(c ^ x) & 255] ^ (c >>> 8); return (c ^ 0xffffffff) >>> 0; };
const chunk = (t, d) => { const h = Buffer.alloc(8), c = Buffer.alloc(4); h.writeUInt32BE(d.length); h.write(t, 4, 'latin1'); c.writeUInt32BE(crc(Buffer.concat([h.subarray(4), d]))); return Buffer.concat([h, d, c]); };
export function encodePng(w, h, rgba) {
  const raw = Buffer.alloc((w * 4 + 1) * h);
  for (let y = 0; y < h; y++) Buffer.from(rgba.buffer, rgba.byteOffset + y * w * 4, w * 4).copy(raw, y * (w * 4 + 1) + 1);
  const ihdr = Buffer.alloc(13); ihdr.writeUInt32BE(w); ihdr.writeUInt32BE(h, 4); ihdr[8] = 8; ihdr[9] = 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk('IHDR', ihdr), chunk('IDAT', deflateSync(raw)), chunk('IEND', Buffer.alloc(0))]);
}
