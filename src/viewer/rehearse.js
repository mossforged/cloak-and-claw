// Rehearsal sheet (T028, rig standard 9c: the check before art for every new body): viewer.html?rehearse=<body> lays
// out every move of data/rehearsal/<body>.js as a contact sheet of its keys at game size, phone first. Each key: the rig
// as it draws today in the key's stand-in pose, chest and hip views and the drawings it names (rehearse-frames.js);
// a drawing that isn't game-ready yet is a labelled red box at its part's place, and is listed in red under the key.
// Browser only; the game itself is never loaded or changed.
import { loadAssets, collectArtPaths } from '../core/assets.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { RIGS } from '../data/rigs/index.js';
import { ITEMS } from '../data/items/index.js';
import { PROPS } from '../data/props/index.js';
import { REHEARSALS } from '../data/rehearsal/index.js';
import { BUILD } from '../config.js';
import { keyFrame } from './rehearse-frames.js';

const W = 96, H = 140, FEET = 124, Z = 0.8;   // cell px; feet line; game size x Z (the rat is ~136 px tall: 3 keys a row on a phone)
const NAMES = { Q: 'three-quarter', S: 'side', F: 'toward camera', BQ: 'turned away', B: 'back', H: 'hunched', LB: 'leaning back' };
const id = new URLSearchParams(location.search).get('rehearse') || 'rat-raider', sheet = REHEARSALS[id];
document.body.className = 'rehearse';
document.body.innerHTML = '<div class="rh" id="rh"></div>';
const root = document.getElementById('rh'), el = (tag, cls, html) => { const e = document.createElement(tag); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
if (!sheet) { root.append(el('p', null, `No rehearsal named "${id}" (have: ${Object.keys(REHEARSALS).join(', ')}).`)); throw new Error('no rehearsal'); }
document.title = `Rehearsal: ${sheet.title}`;
root.append(el('h1', null, sheet.title));
root.append(el('p', 'legend', `<span>Every move's keys at about game size. Moving and Attacking: each key is the posed frame as the game draws it (T029); tap a move's ▶ to play it in the viewer. The other sections are stand-in poses until rounds 2 and 3.</span> `
  + `<span class="view">Blue: chest / hip view.</span> <span class="miss">Red: a drawing not game-ready yet (box = where it goes).</span> `
  + `<span>Views: ${Object.entries(NAMES).map(([k, v]) => `${k} ${v}`).join(', ')}.</span> <span>Build ${BUILD}.</span>`));
const assets = await loadAssets(collectArtPaths(FIGHTERS, RIGS, ITEMS, PROPS));

function drawKey(canvas, r) {
  const dpr = devicePixelRatio || 1, g = canvas.getContext('2d');
  canvas.width = W * dpr; canvas.height = H * dpr;
  g.setTransform(dpr, 0, 0, dpr, 0, 0);
  g.strokeStyle = '#8e8e96'; g.beginPath(); g.moveTo(6, FEET + 0.5); g.lineTo(W - 6, FEET + 0.5); g.stroke();
  const { p, k } = r, c = Math.cos(p.rot), s = Math.sin(p.rot);
  const V = [p.sx * k * c * Z, p.sx * k * s * Z, -p.sy * k * s * Z, p.sy * k * c * Z, W * 0.42 + p.dx * Z, FEET + p.dy * Z];   // a little left of centre: strikes lunge forward
  for (const e of r.L) {
    if (!e.m) continue;
    g.setTransform(dpr, 0, 0, dpr, 0, 0); g.transform(...V); g.transform(...e.m);
    const im = assets.get(e.img);
    if (im) g.drawImage(im, 0, 0);
  }
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.transform(...V);
  for (const { name, box } of r.missing) {
    if (!box) continue;
    const [x0, y0, x1, y1] = box;
    g.fillStyle = 'rgba(255, 40, 40, 0.18)'; g.strokeStyle = '#ff3b30'; g.lineWidth = 1.2;
    g.fillRect(x0, y0, x1 - x0, y1 - y0); g.strokeRect(x0, y0, x1 - x0, y1 - y0);
  }
  g.setTransform(dpr, 0, 0, dpr, 0, 0); g.font = 'bold 8px system-ui'; g.textBaseline = 'top';
  const used = [];
  for (const { name, box } of r.missing) {   // labels upright, inside the cell, on the box's top left, never on each other
    if (!box) continue;
    const [x, y] = [V[0] * box[0] + V[2] * box[1] + V[4], V[1] * box[0] + V[3] * box[1] + V[5]];
    const tx = Math.max(1, Math.min(W - g.measureText(name).width - 2, x));
    let ty = Math.max(1, Math.min(H - 10, y));
    while (used.some((u) => Math.abs(u - ty) < 10) && ty < H - 10) ty += 10;
    used.push(ty);
    g.fillStyle = 'rgba(40, 0, 0, 0.7)'; g.fillRect(tx - 1, ty - 1, g.measureText(name).width + 2, 10);
    g.fillStyle = '#ffb3ad'; g.fillText(name, tx, ty);
  }
}

for (const sec of sheet.sections) {
  root.append(el('h2', null, sec.title));
  for (const mv of sec.moves) {
    const box = el('div', 'move'), keys = el('div', 'keys');
    // T029: each posed move links to its clip in the viewer (slow, zoomed)
    const fid = mv.f ?? sheet.fighter, links = (mv.clips ?? (mv.clip ? [mv.clip] : [])).map((c) => `<a class="play" href="viewer.html?f=${fid}&anim=${encodeURIComponent(c)}&speed=0.5&zoom=2">▶ ${c}</a>`).join(' ');
    box.append(el('h3', null, `${mv.name} <span class="ok">(${mv.keys.length} key${mv.keys.length > 1 ? 's' : ''})</span> ${links}`), keys);
    root.append(box);
    for (const key of mv.keys) {
      const r = keyFrame(sheet, key), card = el('div', 'key'), cv = el('canvas');
      drawKey(cv, r);
      const stand = r.missing.filter((m) => !key.draw.includes(m.name)).map((m) => m.name);
      card.append(cv, el('b', null, key.key), el('div', 'view', `chest ${r.views.torso} / hips ${r.views.pelvis}`),
        el('div', null, [...r.ready.map((n) => `<span class="ok">${n}</span>`), ...key.draw.filter((n) => !r.ready.includes(n)).map((n) => `<span class="miss">${n}</span>`),
          ...stand.map((n) => `<span class="miss">${n} (view)</span>`)].join(', ') || '<span class="ok">base drawings</span>'));
      if (r.off.length) card.append(el('div', 'miss', `not in the pose: ${r.off.join(', ')}`));   // T029: the rehearsal names it, the posed frame lacks it
      if (key.note) card.append(el('div', 'ok', key.note));
      if (key.f) card.append(el('div', 'ok', `rig: ${key.f}`));
      keys.append(card);
    }
  }
}
window.rehearsal = { sheet, keyFrame };
