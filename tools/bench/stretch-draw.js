// Rig bench stretch view (T024, ?stretch): the stretch test's cells (bench/stretch.js) drawn in the browser like the
// exported strip (tools/stretch_render.py): floor lines in floor cells, flags in red with a ring where each one is.
import { stretchCells, flagsOf, drawList, floorLines } from './stretch.js';

const load = (src) => new Promise((res) => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = '../' + src; });
export async function stretchCanvas(F, title, Z = 2) {
  const cells = stretchCells(F.family, F.items), imgs = {}, alpha = {};
  const paths = new Set(cells.flatMap((c) => c.L.filter((e) => e.m).map((e) => e.img)));
  await Promise.all([...paths].map(async (p) => {
    const im = await load(p);
    if (!im) return;
    imgs[p] = im;
    const c = document.createElement('canvas'); c.width = im.naturalWidth; c.height = im.naturalHeight;
    const g = c.getContext('2d', { willReadFrequently: true }); g.drawImage(im, 0, 0);
    const d = g.getImageData(0, 0, c.width, c.height).data, a = new Uint8Array(c.width * c.height);
    for (let i = 0; i < a.length; i++) a[i] = d[i * 4 + 3];
    alpha[p] = { w: c.width, h: c.height, alpha: a };
  }));
  const CW = 190, CH = 252, FEET = 210, COLS = 8, rows = Math.ceil(cells.length / COLS);
  const cv = document.createElement('canvas'); cv.width = COLS * CW * Z; cv.height = (rows * CH + 24) * Z;
  const g = cv.getContext('2d');
  g.fillStyle = '#6e6e76'; g.fillRect(0, 0, cv.width, cv.height);
  g.fillStyle = '#fff'; g.font = `${13 * Z}px sans-serif`; g.fillText(title, 6 * Z, 16 * Z);
  let flagged = 0;
  cells.forEach((c, i) => {
    const flags = flagsOf(c, (p) => alpha[p]), ox = (i % COLS) * CW * Z, oy = (Math.floor(i / COLS) * CH + 24) * Z;
    const fx = ox + (c.lying ? CW - 28 : CW / 2) * Z, fy = oy + FEET * Z;
    g.save(); g.beginPath(); g.rect(ox, oy, CW * Z, CH * Z); g.clip();
    for (const ln of c.floor || c.lying ? floorLines(c) : [{ foot: 'foot-near', y: 0 }]) {
      g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = ln.foot === 'foot-far' ? '#9fd8ff' : '#ffe08a'; g.setLineDash(ln.foot === 'foot-far' ? [4 * Z, 3 * Z] : []);
      g.beginPath(); g.moveTo(ox + 10 * Z, fy + ln.y * Z); g.lineTo(ox + (CW - 10) * Z, fy + ln.y * Z); g.stroke();
    }
    g.setLineDash([]);
    for (const p of drawList(c)) { g.setTransform(Z, 0, 0, Z, fx, fy); g.transform(...p.m); if (imgs[p.img]) g.drawImage(imgs[p.img], 0, 0); }
    g.setTransform(1, 0, 0, 1, 0, 0); g.strokeStyle = '#ff3c32'; g.lineWidth = Z;
    for (const [x, y] of c.marks ?? []) { g.beginPath(); g.arc(fx + x * Z, fy + y * Z, 6 * Z, 0, 7); g.stroke(); }
    g.fillStyle = '#5a5a62'; g.fillRect(ox, oy, CW * Z, 18 * Z);
    g.fillStyle = '#fff'; g.font = `${10 * Z}px sans-serif`; g.fillText(c.label, ox + 5 * Z, oy + 13 * Z);
    g.fillStyle = '#ff786e'; flags.slice(0, 3).forEach((f, k) => g.fillText(f, ox + 5 * Z, oy + (CH - 6 - 11 * k) * Z));
    if (flags.length) { flagged++; g.strokeStyle = '#ff5a50'; g.strokeRect(ox + Z, oy + Z, CW * Z - 2 * Z, CH * Z - 2 * Z); }
    g.restore();
  });
  return { canvas: cv, cells: cells.length, flagged };
}
