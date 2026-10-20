// What a hulls.js change moves in play (T037): every game state and move frame of the rats (and the mouse) drawn as the
// game draws them (render/rig.js rigFrame) once with an old hulls file and once with the current one; per frame, the
// part that moved most (game px, its drawing's hull points on screen) and how far each boot sits from its floor line.
// Usage: node tools/hull-moves.mjs <old hulls.js> [--min 0.05]   (e.g. git show main:src/data/rigs/hulls.js > /tmp/old.js)
import { spawnSync } from 'node:child_process';
import { pathToFileURL } from 'node:url';
import { resolve } from 'node:path';
import HULLS from '../src/data/rigs/hulls.js';
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { floorLine } from '../src/data/rigs/biped-floor.js';
import { grounded } from '../src/render/floor.js';

const IDS = ['rat-raider', 'rat-spearman', 'rat-archer', 'mouse-fighter'];
const apply = (m, [x, y]) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];

// one run: every frame's drawn parts as screen points (the current hulls' points, so both runs place the same points)
const REF = JSON.parse(JSON.stringify(HULLS));
async function dump(hullsFile) {
  if (hullsFile) { const H = (await import(pathToFileURL(resolve(hullsFile)))).default; for (const k of Object.keys(HULLS)) delete HULLS[k]; Object.assign(HULLS, H); }
  const out = {};
  for (const id of IDS) {
    const def = Object.values(FIGHTERS).find((d) => d.art?.rig === id), rig = RIGS[id];
    const base = { def, t: 0, mf: 0, move: null, z: 0, vz: 0, facing: 1, id: 1, stun: 10, x: 0, y: 0, grab: { knee: -1 } };
    const frames = [];
    for (let i = 0; i < 24; i++) frames.push([`idle ${i}`, { state: 'idle' }, i * 0.11], [`walk ${i}`, { state: 'walk', t: i * 2.5 }, 0]);
    const states = ['hurt', 'jumpStart', ...(def.toss ? ['block', 'grabbing', 'toss', 'pickup', 'revive'] : []), ...(rig.poses.downed ? ['downed'] : [])];
    for (const st of states) for (const t of [0, 3, 8, 20]) frames.push([`${st} ${t}`, { state: st, t }, 0]);
    for (const [st, t, z] of [['down', 0, 0], ['down', 30, 0], ['dead', 5, 0], ['knockdown', 3, 20], ['knockdown', 14, 0], ['getup', 6, 0], ['getup', 20, 0]]) frames.push([`${st} ${t}${z ? ` z${z}` : ''}`, { state: st, t, z }, 0]);
    for (const [key, m] of Object.entries({ ...def.rehearsal, ...def.moves })) for (let mf = 0; mf < m.windup + m.active + m.recovery; mf += 2) frames.push([`${key} ${mf}`, { state: m.air ? 'jump' : 'attack', move: m, moveKey: key, mf, t: mf, z: m.air ? 20 : 0 }, 0]);
    for (const [name, P] of Object.entries(rig.poses)) if (P && typeof P === 'object' && !Array.isArray(P)) frames.push([`=${name}`, { state: 'idle' }, 0, name]);   // the viewer's Poses group
    // in motion (the tail and scarf springs keep their memory): walking across, then the fighter's moves, at 60 fps
    const seq = [];
    for (let n = 0; n < 120; n++) seq.push({ state: 'walk', t: n, x: n * 2.5 });
    for (const [key, m] of Object.entries(def.moves)) for (let mf = 0; mf < m.windup + m.active + m.recovery; mf++) seq.push({ state: m.air ? 'jump' : 'attack', move: m, moveKey: key, mf, t: mf, x: 300, z: m.air ? 20 : 0, label: key });
    const mem0 = {};
    seq.forEach((o, n) => frames.push([`in motion @${n} ${o.label ?? 'walk'}`, o, n / 60, undefined, mem0]));
    out[id] = frames.map(([label, o, time, pose, shared]) => {
      const f = { ...base, ...o }, mem = shared ?? {};
      if (!shared) rigFrame(f, rig, time - 1, mem, pose);
      const fr = rigFrame(f, rig, time, mem, pose), p = fr.p, k = fr.k;
      const a = Math.sin(p.rot) * p.sx * k, b = Math.cos(p.rot) * p.sy * k, c = Math.cos(p.rot) * p.sx * k, s = Math.sin(p.rot) * p.sy * k;
      const scr = ([x, y]) => [(p.dx ?? 0) + c * x - s * y, p.dy + a * x + b * y];
      const parts = {}, soles = {};
      for (const e of fr.L) if (e.m && e.name) {
        parts[e.name] = (REF[e.img] ?? []).map((q) => scr(apply(e.m, q)));
        const pts = (HULLS[e.img] ?? []).map((q) => scr(apply(e.m, q)));   // this run's own outline: where its sole is
        if (/^foot-/.test(e.name) && pts.length && grounded(f) && !mem.swap?.['@aloft']) soles[e.name] = Math.max(...pts.map((q) => q[1])) - (floorLine(rig, e.name) - Math.max(0, fr.joints[`${e.name}.lift`] ?? 0));
      }
      return { label, parts, soles };
    });
    out[`${id}:lines`] =Object.fromEntries(['foot-near', 'foot-far'].map((n) => [n, +floorLine(rig, n).toFixed(2)]));
  }
  return out;
}

if (process.argv.includes('--dump')) {
  const i = process.argv.indexOf('--dump'), f = process.argv[i + 1];
  process.stdout.write(JSON.stringify(await dump(f === '-' ? null : f)));
} else {
  const [oldFile] = process.argv.slice(2), min = +(process.argv[process.argv.indexOf('--min') + 1] ?? 0.05) || 0.05;
  if (!oldFile) { console.log('usage: node tools/hull-moves.mjs <old hulls.js> [--min px]'); process.exit(1); }
  const run = (f) => JSON.parse(spawnSync(process.execPath, [process.argv[1], '--dump', f], { maxBuffer: 1 << 28, encoding: 'utf8' }).stdout);
  const A = run(oldFile), B = run('-');
  for (const id of IDS) {
    let worst = 0, n = 0;
    console.log(`\n## ${id}\nfloor lines (px from the feet line): ${Object.keys(B[`${id}:lines`]).map((n) => `${n} ${A[`${id}:lines`][n]} -> ${B[`${id}:lines`][n]}`).join(', ')}`);
    A[id].forEach((fa, i) => {
      const fb = B[id][i];
      let best = [0, ''];
      for (const [name, pa] of Object.entries(fa.parts)) {
        const pb = fb.parts[name] ?? [];
        for (let j = 0; j < Math.min(pa.length, pb.length); j++) { const d = Math.hypot(pb[j][0] - pa[j][0], pb[j][1] - pa[j][1]); if (d > best[0]) best = [d, name]; }
      }
      const sole = Object.entries(fb.soles).filter(([, v]) => Math.abs(v) > 0.5).map(([k, v]) => `${k} ${v.toFixed(1)} off`).join(', ');
      if (best[0] >= min || sole) { n++; console.log(`- ${fa.label}: ${best[1] || '-'} ${best[0].toFixed(2)} px${sole ? ` (now ${sole})` : ''}`); }
      worst = Math.max(worst, best[0]);
    });
    console.log(`${n} of ${A[id].length} frames move >= ${min} px; worst ${worst.toFixed(2)} px`);
  }
}
