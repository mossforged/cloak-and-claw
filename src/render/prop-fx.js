// Effects for props, items and held weapons (T010), from sim events. Render-only (Math.random is fine here).
// propHit: wood chips + dust; propBreak: debris pieces tumble with gravity and fade, crunch flash + ring + dust;
// eat: heal number, ring pop, rising sparkles; pickup: ring + star glint; weaponBreak: the weapon snaps in two halves
// that spin away and fade, with sparks; a hit whose move has fx.word pops that word (the fish's SLAP!).
// T022 (JUICE.help): heal = green burst (ring, green sparkles) and a rising +N; revive = flash, double ring, 'Up!' word;
// potionPickup = the pickup pop.
import { bus } from '../core/events.js';
import { JUICE } from '../data/juice.js';

export function createPropFx(assets) {
  let list = [];
  const add = (e) => list.push({ t: 0, ...e });
  const chips = (x, y, n, speed) => {
    for (let i = 0; i < n; i++) {
      const a = -Math.PI / 2 + (Math.random() - 0.5) * 2.4, s = speed * (0.4 + Math.random());
      add({ type: 'chip', x, y, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: Math.random() * 6, life: 22 + Math.random() * 10 });
    }
  };
  const dust = (x, y, n, spread) => { for (let i = 0; i < n; i++) add({ type: 'dust', x: x + (Math.random() - 0.5) * spread, y, vx: (Math.random() - 0.5) * 2.4, r: 7 + Math.random() * 9, life: 26 }); };

  bus.on('propHit', ({ prop, x, y, z }) => { chips(x, y - z, JUICE.props.chips, 5); dust(prop.x, prop.y, 3, prop.def.body.w); });
  bus.on('propBreak', ({ prop }) => {
    const S = JUICE.props, A = prop.def.art, cy = prop.def.body.h * 0.5;
    for (const src of [...A.debris, ...A.debris]) {   // each drawing twice: a proper pile of pieces
      const dir = Math.random() < 0.5 ? -1 : 1;
      add({ type: 'debris', img: assets.get(src), px: A.debrisPx * (0.75 + Math.random() * 0.4), x: prop.x + (Math.random() - 0.5) * prop.def.body.w * 0.6,
        ground: prop.y + (Math.random() - 0.4) * 16, z: cy * (0.5 + Math.random()), vx: dir * S.debrisSpeed * (0.4 + Math.random()),
        vz: S.debrisLift * (0.5 + Math.random() * 0.7), rot: Math.random() * 6, spin: dir * (0.15 + Math.random() * 0.25), life: S.debrisLife + Math.random() * 20 });
    }
    chips(prop.x, prop.y - cy, S.chips * 2, 7);
    dust(prop.x, prop.y, 10, prop.def.body.w * 1.4);
    add({ type: 'flash', x: prop.x, y: prop.y - cy, r: S.flashR, life: 8 });
    add({ type: 'ring', x: prop.x, y: prop.y - cy, r: S.flashR * 0.8, life: 14 });
  });
  bus.on('eat', ({ heal, x, y }) => {
    const I = JUICE.items;
    add({ type: 'ring', x, y: y - 20, r: I.ringR, life: 14 });
    add({ type: 'heal', x, y: y - 50, text: `+${heal}`, life: JUICE.numbers.life });
    for (let i = 0; i < I.sparkles; i++) add({ type: 'sparkle', x: x + (Math.random() - 0.5) * 50, y: y - Math.random() * 40, vy: -0.8 - Math.random(), size: 6 + Math.random() * 6, life: 28 + Math.random() * 14 });
  });
  bus.on('heal', ({ f, heal, x, y }) => {
    const H = JUICE.help.heal, cy = f.y - 50;
    add({ type: 'ring', x: f.x, y: cy, r: H.ringR, life: 16, color: '125,255,106' });
    add({ type: 'ring', x: f.x, y: cy, r: H.ringR * 1.6, life: 22, color: '125,255,106' });
    add({ type: 'heal', x: f.x, y: cy - 40, text: `+${heal}`, life: JUICE.numbers.life });
    for (let i = 0; i < H.sparkles; i++) add({ type: 'sparkle', x: f.x + (Math.random() - 0.5) * 60, y: f.y - Math.random() * 90, vy: -0.9 - Math.random(), size: 6 + Math.random() * 7, life: 30 + Math.random() * 14, green: true });
    if (x !== f.x) dust(x, y, 3, 24);   // tossed: a splash where it landed
  });
  bus.on('revive', ({ target }) => {
    const U = JUICE.help.up, cy = target.y - 50;
    add({ type: 'flash', x: target.x, y: cy, r: U.flashR, life: 12 });
    add({ type: 'ring', x: target.x, y: cy, r: U.ringR, life: 14 });
    add({ type: 'ring', x: target.x, y: cy, r: U.ringR * 1.7, life: 22 });
    add({ type: 'word', x: target.x, y: cy - 70, text: U.word, life: 46 });
    for (let i = 0; i < 10; i++) add({ type: 'sparkle', x: target.x + (Math.random() - 0.5) * 70, y: target.y - Math.random() * 100, vy: -1 - Math.random(), size: 7 + Math.random() * 7, life: 30 + Math.random() * 12 });
  });
  bus.on('potionPickup', ({ x, y }) => {
    add({ type: 'ring', x, y: y - 14, r: JUICE.items.ringR, life: 12 });
    add({ type: 'sparkle', x, y: y - 30, vy: -0.6, size: 18, life: 18 });
  });
  bus.on('pickup', ({ x, y }) => {
    add({ type: 'ring', x, y: y - 14, r: JUICE.items.ringR, life: 12 });
    add({ type: 'sparkle', x, y: y - 30, vy: -0.6, size: 18, life: 18 });
  });
  bus.on('itemLand', ({ item }) => dust(item.x, item.y, 3, 30));
  bus.on('weaponBreak', ({ weapon, x, y, z }) => {
    const A = weapon.art, img = assets.get(A.img), B = JUICE.weaponBreak;
    for (const half of [0, 1]) {
      const dir = half ? 1 : -1;
      add({ type: 'half', img, half, px: A.px, x, y: y - z, vx: dir * (2 + Math.random() * 2), vy: -4 - Math.random() * 2, rot: 0, spin: dir * 0.3, life: B.life });
    }
    for (let i = 0; i < 14; i++) { const a = Math.random() * Math.PI * 2, s = 3 + Math.random() * 6; add({ type: 'chip', x, y: y - z, vx: Math.cos(a) * s, vy: Math.sin(a) * s, r: Math.random() * 6, life: 20, light: true }); }
    add({ type: 'ring', x, y: y - z, r: 40, life: 14 });
    add({ type: 'word', x, y: y - z - 34, text: 'CRACK!', life: 40 });
  });
  let lastWord = null;   // one word per swing, however many it hits
  bus.on('hit', ({ attacker, move, x, y, z }) => {
    if (!move.fx?.word || (lastWord?.a === attacker && lastWord.e.t < 10)) return;
    lastWord = { a: attacker, e: { type: 'word', x, y: y - z - 40, text: move.fx.word, life: 40, t: 0 } };
    list.push(lastWord.e);
  });

  return {
    clear() { list = []; },
    update() {
      for (const e of list) {
        e.t++;
        if (e.type === 'debris') {
          if (e.z > 0 || e.vz > 0) {
            e.x += e.vx; e.z += e.vz; e.vz -= 0.55; e.rot += e.spin;
            if (e.z <= 0) { e.z = 0; if (Math.abs(e.vz) > 2.5) { e.vz = -e.vz * 0.35; e.vx *= 0.5; e.spin *= 0.5; } else { e.vz = 0; e.vx = 0; } }
          }
          continue;
        }
        if (e.type === 'half') { e.x += e.vx; e.y += e.vy; e.vy += 0.45; e.rot += e.spin; continue; }
        if (e.vx !== undefined) { e.x += e.vx; e.vx *= e.type === 'chip' ? 0.95 : 0.88; }
        if (e.vy !== undefined) { e.y += e.vy; if (e.type === 'chip') e.vy += 0.5; else e.vy *= 0.92; }
      }
      list = list.filter((e) => e.t < e.life);
    },
    // debris that has landed lies on the floor (drawn before the fighters); flying debris and the rest after them
    drawBack(ctx) { for (const e of list) if (landed(e)) DRAW.debris(ctx, e, e.t / e.life); },
    draw(ctx) { for (const e of list) if (!landed(e)) DRAW[e.type](ctx, e, e.t / e.life); },
  };
}

const landed = (e) => e.type === 'debris' && e.z <= 0 && e.vz === 0;

const DRAW = {
  debris(ctx, e, k) {
    const w = e.img.width * e.px, h = e.img.height * e.px;
    ctx.save(); ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
    ctx.translate(e.x, e.ground - e.z - h * 0.3); ctx.rotate(e.rot); ctx.drawImage(e.img, -w / 2, -h / 2, w, h); ctx.restore();
  },
  half(ctx, e, k) {   // one half of a snapped weapon (left = handle end, right = blade end)
    const iw = e.img.width / 2, w = iw * e.px, h = e.img.height * e.px;
    ctx.save(); ctx.globalAlpha = 1 - k; ctx.translate(e.x, e.y); ctx.rotate(e.rot);
    ctx.drawImage(e.img, e.half * iw, 0, iw, e.img.height, -w / 2, -h / 2, w, h); ctx.restore();
  },
  chip(ctx, e, k) {
    ctx.fillStyle = e.light ? `rgba(255,240,200,${1 - k})` : `rgba(${150 + e.r * 10},${95 + e.r * 6},45,${1 - k})`;
    ctx.save(); ctx.translate(e.x, e.y); ctx.rotate(e.t * 0.4 + e.r); ctx.fillRect(-3, -1.5, 6, 3); ctx.restore();
  },
  dust(ctx, e, k) {
    ctx.fillStyle = `rgba(214,190,150,${0.5 * (1 - k)})`;
    ctx.beginPath(); ctx.arc(e.x, e.y - k * 16, e.r * (0.6 + k), 0, Math.PI * 2); ctx.fill();
  },
  flash(ctx, e, k) {
    const g = ctx.createRadialGradient(e.x, e.y, 0, e.x, e.y, e.r);
    g.addColorStop(0, `rgba(255,250,230,${0.9 * (1 - k)})`); g.addColorStop(1, 'rgba(255,250,230,0)');
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  },
  ring(ctx, e, k) {
    ctx.strokeStyle = `rgba(${e.color ?? '255,255,255'},${1 - k})`; ctx.lineWidth = 4 * (1 - k) + 1;
    ctx.beginPath(); ctx.arc(e.x, e.y, e.r * (0.3 + k), 0, Math.PI * 2); ctx.stroke();
  },
  sparkle(ctx, e, k) {   // four-point star, pops open then shrinks
    const s = e.size * Math.sin(Math.PI * k), w = s * 0.2;
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; ctx.translate(e.x, e.y); ctx.rotate(k);
    ctx.fillStyle = e.green ? 'rgba(150,255,140,0.95)' : 'rgba(255,250,200,0.95)';
    for (const a of [0, Math.PI / 2]) { ctx.save(); ctx.rotate(a); ctx.beginPath(); ctx.moveTo(-s, 0); ctx.lineTo(0, -w); ctx.lineTo(s, 0); ctx.lineTo(0, w); ctx.closePath(); ctx.fill(); ctx.restore(); }
    ctx.restore();
  },
  heal(ctx, e, k) { text(ctx, e, k, '#7dff6a', 1.2); },
  word(ctx, e, k) { text(ctx, e, k, '#ffd23f', 1.5, Math.sin(e.t * 0.9) * 0.08 * (1 - k)); },
};

function text(ctx, e, k, fill, size, rot = 0) {
  const N = JUICE.numbers, pop = k < 0.15 ? 1 + (0.15 - k) * 4 : 1;
  ctx.save();
  ctx.translate(e.x, e.y - e.t * N.rise * 0.8); ctx.rotate(rot); ctx.scale(pop * size, pop * size);
  ctx.globalAlpha = k > 0.7 ? (1 - k) / 0.3 : 1;
  ctx.font = N.font; ctx.textAlign = 'center';
  ctx.lineWidth = 5; ctx.strokeStyle = '#2a1630'; ctx.strokeText(e.text, 0, 0);
  ctx.fillStyle = fill; ctx.fillText(e.text, 0, 0);
  ctx.restore();
}
