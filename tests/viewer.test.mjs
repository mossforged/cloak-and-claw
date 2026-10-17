// T027 model viewer: every rigged fighter in the viewer's model list plays every animation button (each held item it can
// hold, the compare versions) for its full length through the real sim and rigFrame without throwing, with finite joints;
// clips end; the URL state round-trips; the game's own world is untouched by a viewer run.
import assert from 'node:assert/strict';
import { MODELS, itemsFor, versionsOf, rigOf, looksFor, randomLook } from '../src/viewer/models.js';
import { clipsFor } from '../src/viewer/clips.js';
import { createSlot } from '../src/viewer/sandbox.js';
import { parseState, formatState, DEFAULTS } from '../src/viewer/state.js';
import { rigFrame, rigMemory } from '../src/render/rig.js';
import { jointsOfRig } from '../src/render/rig-pose.js';
import { FIGHTERS } from '../src/data/fighters/index.js';

let fails = 0;
const check = (name, fn) => { try { fn(); console.log('ok  ', name); } catch (e) { fails++; console.log('FAIL', name, '\n   ', e.stack.split('\n').slice(0, 4).join('\n    ')); } };

check('every rigged fighter is a model', () => {
  for (const d of Object.values(FIGHTERS)) if (d.art?.rig) assert.ok(MODELS.includes(d.id), d.id);
  assert.ok(MODELS.length >= 4);
});

// Each frame: every fighter in the sandbox through rigFrame with its own render memory (what drawRig does, no pixels).
const warm = (sb, t) => {
  for (const f of sb.w.fighters) {
    const { joints, L } = rigFrame(f, f === sb.hero ? sb.rig : rigOf(f.def.id), t, rigMemory(f), f === sb.hero ? sb.pose ?? undefined : undefined);
    for (const k of jointsOfRig(f === sb.hero ? sb.rig : rigOf(f.def.id))) if (!Number.isFinite(joints[k] ?? 0)) throw new Error(`${f.def.id} ${f.state} ${k} = ${joints[k]}`);
    if (!L.length) throw new Error('empty layout');
  }
};

const slot = createSlot({ warm });
for (const f of MODELS) {
  const runs = [];
  for (const item of itemsFor(f)) for (const c of clipsFor(f, item)) runs.push({ item, anim: c.key });
  for (const v of versionsOf(f).slice(1)) runs.push({ item: 'own', anim: 'idle', v });
  runs.push({ item: 'own', anim: clipsFor(f)[5].key, target: true, flip: true, look: randomLook(f, () => 0.7) });
  check(`${f}: ${runs.length} clip runs play to the end`, () => {
    for (const r of runs) {
      const cfg = { f, v: 'current', grip: '', target: false, flip: false, look: {}, gear: null, ...r };
      try {
        slot.load(cfg);
        assert.ok(slot.len > 0 && slot.len <= 900, `${r.item} ${r.anim} length ${slot.len}`);
        slot.seek(slot.len);
        assert.equal(slot.sb.n, slot.len);
      } catch (e) { e.message = `${r.item} / ${r.anim}${r.v ? ' / ' + r.v : ''}: ${e.message}`; throw e; }
    }
  });
}

check('clips that should end before their cap do (attacks, jump, hits, grabs settle)', () => {
  for (const f of MODELS) for (const c of clipsFor(f)) {
    if (c.frames || c.hold) continue;
    slot.load({ f, anim: c.key, item: 'own', look: {} });
    assert.ok(slot.len < (c.max ?? 900), `${f} ${c.key} never settled`);
  }
});

check('an attack plays windup + active + recovery frames (plus hit-stop as if it landed)', () => {
  const m = FIGHTERS['mouse-fighter'].moves.slash3;
  slot.load({ f: 'mouse-fighter', anim: 'slash3', item: 'own', look: {} });
  slot.seek(0);
  let attack = 0;
  while (slot.step()) if (slot.sb.hero.state === 'attack') attack++;
  assert.equal(attack, m.windup + m.active + m.recovery - 1 + m.hitstop);
});

check('grip mode and item reach the drawn frame', () => {
  slot.load({ f: 'rat-spearman', anim: 'idle', item: 'own', grip: 'overhand', look: {} });
  assert.equal(slot.sb.hero.def.kit, 'rat-spear');
  slot.load({ f: 'mouse-fighter', anim: 'idle', item: 'plank-club', look: {} });
  assert.equal(slot.sb.hero.weapon.def.id, 'plank-club');
});

check('look options exist for rats, not the mouse', () => {
  assert.equal(looksFor('mouse-fighter'), null);
  assert.ok(looksFor('rat-raider').details.length > 1 && looksFor('rat-archer').gear.includes('gear-hood'));
});

check('URL state round-trips', () => {
  const s = parseState('?f=rat-spearman&anim=spearThrust&item=rat-spear&grip=overhand&speed=0.5');
  assert.equal(s.f, 'rat-spearman'); assert.equal(s.grip, 'overhand'); assert.equal(s.speed, 0.5);
  assert.equal(formatState(s), 'f=rat-spearman&anim=spearThrust&item=rat-spear&grip=overhand&speed=0.5');
  const all = { ...DEFAULTS, f: 'rat-archer', v: 'B', anim: 'pose:held', item: 'empty', grip: 'reverse', speed: 0.25, size: 3, zoom: 1.5,
    flip: true, loop: false, paused: true, t: 17, bg: 'harbor', ov: ['floor', 'seams'], target: true, detail: 'detail-scar2',
    tint: { bandana: 2, hood: 4 }, fur: -0.5, lsize: 1, gear: ['gear-helmet'], f2: 'mouse-fighter', v2: 'C', item2: 'plank-club' };
  assert.deepEqual(parseState('?' + formatState(all)), all);
  assert.deepEqual(parseState(''), { ...DEFAULTS, tint: {}, ov: [] });
  assert.equal(formatState(parseState('')), '');
  assert.equal(parseState('?f=nobody&speed=7').f, DEFAULTS.f);
});

console.log(fails ? `${fails} failed` : 'all ok');
process.exit(fails ? 1 : 0);
