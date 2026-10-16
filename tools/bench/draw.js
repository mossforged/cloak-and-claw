// Rig bench (T016), drawing: the built rig in a strip pose (via render/rig.js layoutRig), the fighter's standee, and the
// exported strip image. Browser canvas only; the maths is in source.js.
import { layoutRig } from '../../src/render/rig.js';
import { BIPED_PARENTS } from '../../src/data/rigs/biped-poses.js';
import { rigJointsOf, swapsOf, bodyMatrix, stripFrames, stripAt } from './source.js';

const mul = (m, n) => [m[0] * n[0] + m[2] * n[1], m[1] * n[0] + m[3] * n[1], m[0] * n[2] + m[2] * n[3],
  m[1] * n[2] + m[3] * n[3], m[0] * n[4] + m[2] * n[5] + m[4], m[1] * n[4] + m[3] * n[5] + m[5]];

// bench = { src, rig, imgs: path -> keyed canvas }. s = stripAt(...). Feet at (x, y) on g, zoom = canvas px per screen px.
export function drawFigure(g, bench, s, x, y, zoom = 1) {
  const { src, rig, imgs } = bench;
  // dx/dy move the figure on screen after the body turn (so a fall's turn doesn't swing the offset round with it)
  const entries = layoutRig(rig, { ...rigJointsOf(src, s.joints), dx: 0, dy: 0 }, swapsOf(src, s.swap));
  const dx = (s.joints.dx ?? 0) * zoom, dy = (s.joints.dy ?? 0) * zoom;
  const B = bodyMatrix(s.joints.body ?? 0);
  // Lying poses (ground): the lowest drawn pixel of the body (standard parts but the tail; weapons and cloth may sink
  // into the floor) rests on the floor. Every other pose that isn't airborne:
  // the legs never sink below it (the swing of a limb can dip a foot; the bench shows the walk, not that artefact).
  let lift = 0;
  if (s.ground) lift = (lowest(entries, B, imgs, (n) => n in BIPED_PARENTS && n !== 'tail') + (s.joints.dy ?? 0)) * s.ground;
  else if (!s.air) lift = Math.max(0, lowest(entries, B, imgs, (n) => n.startsWith('leg-') || n.startsWith('foot-')) + (s.joints.dy ?? 0));
  for (const e of entries) {
    g.setTransform(zoom, 0, 0, zoom, x + dx, y + dy - lift * zoom);
    g.transform(...B); g.transform(...e.m);
    g.drawImage(imgs[e.img], 0, 0);
  }
  g.setTransform(1, 0, 0, 1, 0, 0);
}

// Opaque sample points of a keyed image (every 6 px), cached: for finding a pose's lowest drawn pixel.
const samples = new WeakMap();
function pointsOf(img) {
  if (samples.has(img)) return samples.get(img);
  const d = img.getContext('2d').getImageData(0, 0, img.width, img.height).data, pts = [];
  for (let y = 0; y < img.height; y += 6) for (let x = 0; x < img.width; x += 6) if (d[(y * img.width + x) * 4 + 3] > 127) pts.push(x, y);
  samples.set(img, pts);
  return pts;
}
function lowest(entries, B, imgs, keep = () => true) {
  let low = -Infinity;
  for (const e of entries) {
    if (!keep(e.name)) continue;
    const m = mul(B, e.m), pts = pointsOf(imgs[e.img]);
    for (let i = 0; i < pts.length; i += 2) low = Math.max(low, m[1] * pts[i] + m[3] * pts[i + 1] + m[5]);
  }
  return low === -Infinity ? 0 : low;
}

// The fighter's standee (art.idle), feet at (x, y).
export function drawStandee(g, art, img, x, y, zoom = 1) {
  if (!img) return;
  const h = art.height * zoom, w = h * img.width / img.height;
  g.drawImage(img, x - w * art.anchorX, y - h, w, h);
}

// The motion strip as one image for reviews: standee first (if the delivery names a fighter), then each labelled frame.
export function renderStrip(bench, standee, { zoom = 2, title = '' } = {}) {
  const frames = stripFrames(), CW = 160, CH = 180, FEET = 150, cols = Math.min(7, frames.length + 1);
  const c = document.createElement('canvas');
  c.width = cols * CW * zoom; c.height = (Math.ceil((frames.length + 1) / cols) * CH + 22) * zoom;
  const g = c.getContext('2d');
  g.fillStyle = '#6e6e76'; g.fillRect(0, 0, c.width, c.height);
  g.fillStyle = '#fff'; g.font = `bold ${12 * zoom}px sans-serif`; g.fillText(title, 6 * zoom, 15 * zoom);
  g.font = `${10 * zoom}px sans-serif`;
  const cells = [{ label: 'standee' }, ...frames];
  cells.forEach((f, i) => {
    const ox = (i % cols) * CW * zoom, oy = (Math.floor(i / cols) * CH + 22) * zoom;
    g.fillStyle = '#ffffff30'; g.fillRect(ox + 8 * zoom, oy + FEET * zoom, (CW - 16) * zoom, zoom);
    g.fillStyle = '#fff'; g.fillText(f.label, ox + 6 * zoom, oy + 12 * zoom);
    const x = ox + CW / 2 * zoom, y = oy + FEET * zoom;
    if (f.t === undefined) { if (standee) drawStandee(g, standee.art, standee.img, x, y, zoom); }
    else drawFigure(g, bench, stripAt(f.t), x, y, zoom);
  });
  return c;
}
