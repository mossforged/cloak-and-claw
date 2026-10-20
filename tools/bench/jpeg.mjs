// T036: minimal baseline JPEG encoder (4:4:4, standard Huffman tables), so Node tools can write phone-sized JPGs without
// Python or a browser. encodeJpeg(w, h, rgb: Uint8Array w*h*3, quality 1..100) -> Buffer.
const ZZ = [0, 1, 8, 16, 9, 2, 3, 10, 17, 24, 32, 25, 18, 11, 4, 5, 12, 19, 26, 33, 40, 48, 41, 34, 27, 20, 13, 6, 7, 14, 21, 28,
  35, 42, 49, 56, 57, 50, 43, 36, 29, 22, 15, 23, 30, 37, 44, 51, 58, 59, 52, 45, 38, 31, 39, 46, 53, 60, 61, 54, 47, 55, 62, 63];
const QY = [16, 11, 10, 16, 24, 40, 51, 61, 12, 12, 14, 19, 26, 58, 60, 55, 14, 13, 16, 24, 40, 57, 69, 56, 14, 17, 22, 29, 51, 87, 80, 62,
  18, 22, 37, 56, 68, 109, 103, 77, 24, 35, 55, 64, 81, 104, 113, 92, 49, 64, 78, 87, 103, 121, 120, 101, 72, 92, 95, 98, 112, 100, 103, 99];
const QC = [17, 18, 24, 47, 99, 99, 99, 99, 18, 21, 26, 66, 99, 99, 99, 99, 24, 26, 56, 99, 99, 99, 99, 99, 47, 66, 99, 99, 99, 99, 99, 99,
  ...Array(32).fill(99)];
// standard tables (JPEG Annex K): code counts per length 1..16, then the values
const DC_Y = [[0, 1, 5, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]];
const DC_C = [[0, 3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 0, 0, 0, 0, 0], [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]];
const AC_Y = [[0, 2, 1, 3, 3, 2, 4, 3, 5, 5, 4, 4, 0, 0, 1, 0x7d], hex('01020300041105122131410613516107227114328191a1082342b1c11552d1f02433627282090a161718191a25262728292a3435363738393a434445464748494a535455565758595a636465666768696a737475767778797a838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae1e2e3e4e5e6e7e8e9eaf1f2f3f4f5f6f7f8f9fa')];
const AC_C = [[0, 2, 1, 2, 4, 4, 3, 4, 7, 5, 4, 4, 0, 1, 2, 0x77], hex('000102031104052131061241510761711322328108144291a1b1c109233352f0156272d10a162434e125f11718191a262728292a35363738393a434445464748494a535455565758595a636465666768696a737475767778797a82838485868788898a92939495969798999aa2a3a4a5a6a7a8a9aab2b3b4b5b6b7b8b9bac2c3c4c5c6c7c8c9cad2d3d4d5d6d7d8d9dae2e3e4e5e6e7e8e9eaf2f3f4f5f6f7f8f9fa')];
function hex(s) { return s.match(/../g).map((b) => parseInt(b, 16)); }
function codes([counts, vals]) {
  const out = {}; let code = 0, k = 0;
  for (let len = 1; len <= 16; len++) { for (let i = 0; i < counts[len - 1]; i++) out[vals[k++]] = [code++, len]; code <<= 1; }
  return out;
}
const scaleQ = (t, q) => { const s = q < 50 ? 5000 / q : 200 - 2 * q; return t.map((v) => Math.min(255, Math.max(1, Math.floor((v * s + 50) / 100)))); };
const COS = Array.from({ length: 64 }, (_, i) => { const x = i >> 3, u = i & 7; return Math.cos(((2 * x + 1) * u * Math.PI) / 16); });

export function encodeJpeg(w, h, rgb, quality = 80) {
  const qy = scaleQ(QY, quality), qc = scaleQ(QC, quality), hdc = [codes(DC_Y), codes(DC_C)], hac = [codes(AC_Y), codes(AC_C)];
  const bytes = [], put = (...b) => bytes.push(...b), word = (v) => put(v >> 8, v & 255);
  put(0xff, 0xd8, 0xff, 0xe0); word(16); put(0x4a, 0x46, 0x49, 0x46, 0, 1, 1, 0); word(1); word(1); put(0, 0);
  put(0xff, 0xdb); word(132); put(0); for (const i of ZZ) put(qy[i]); put(1); for (const i of ZZ) put(qc[i]);
  put(0xff, 0xc0); word(17); put(8); word(h); word(w); put(3, 1, 0x11, 0, 2, 0x11, 1, 3, 0x11, 1);
  for (const [cls, id, t] of [[0, 0, DC_Y], [1, 0, AC_Y], [0, 1, DC_C], [1, 1, AC_C]]) { put(0xff, 0xc4); word(3 + 16 + t[1].length); put((cls << 4) | id, ...t[0], ...t[1]); }
  put(0xff, 0xda); word(12); put(3, 1, 0, 2, 0x11, 3, 0x11, 0, 63, 0);
  let acc = 0, nbits = 0;
  const bits = (code, len) => {
    for (let i = len - 1; i >= 0; i--) {
      acc = (acc << 1) | ((code >> i) & 1); nbits++;
      if (nbits === 8) { bytes.push(acc); if (acc === 0xff) bytes.push(0); acc = 0; nbits = 0; }
    }
  };
  const cat = (v) => { let a = Math.abs(v), n = 0; while (a) { n++; a >>= 1; } return n; };
  const valBits = (v, n) => bits(v < 0 ? v + (1 << n) - 1 : v, n);
  const pred = [0, 0, 0], blk = new Float64Array(64), co = new Float64Array(64);
  for (let by = 0; by < h; by += 8) for (let bx = 0; bx < w; bx += 8) for (let c = 0; c < 3; c++) {
    for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) {
      const i = (Math.min(h - 1, by + y) * w + Math.min(w - 1, bx + x)) * 3, r = rgb[i], g = rgb[i + 1], b = rgb[i + 2];
      blk[y * 8 + x] = (c === 0 ? 0.299 * r + 0.587 * g + 0.114 * b : c === 1 ? -0.1687 * r - 0.3313 * g + 0.5 * b + 128 : 0.5 * r - 0.4187 * g - 0.0813 * b + 128) - 128;
    }
    const q = c ? qc : qy, t = c ? 1 : 0;
    for (let v = 0; v < 8; v++) for (let u = 0; u < 8; u++) {
      let s = 0;
      for (let y = 0; y < 8; y++) for (let x = 0; x < 8; x++) s += blk[y * 8 + x] * COS[x * 8 + u] * COS[y * 8 + v];
      co[v * 8 + u] = Math.round((0.25 * (u ? 1 : Math.SQRT1_2) * (v ? 1 : Math.SQRT1_2) * s) / q[v * 8 + u]);
    }
    const dc = co[0] - pred[c]; pred[c] = co[0];
    const dn = cat(dc); bits(...hdc[t][dn]); if (dn) valBits(dc, dn);
    let run = 0;
    for (let k = 1; k < 64; k++) {
      const a = co[ZZ[k]];
      if (!a) { run++; continue; }
      while (run > 15) { bits(...hac[t][0xf0]); run -= 16; }
      const n = cat(a); bits(...hac[t][(run << 4) | n]); valBits(a, n); run = 0;
    }
    if (run) bits(...hac[t][0]);
  }
  if (nbits) bits(0x7f, 8 - nbits);
  put(0xff, 0xd9);
  return Buffer.from(bytes);
}
