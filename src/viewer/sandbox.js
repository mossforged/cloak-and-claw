// Model viewer (T027): one viewer slot plays a clip in its own private world with the game's real sim (createWorld /
// stepWorld: real move timing, jumps, knockdown and get-up, grabs, items, arrows) and the game's hit-stop (render/juice.js).
// The game's own world is never touched (the viewer is its own page). Pure: no DOM; Node tests run every clip through it.
// Timeline: frame n = n display ticks from the clip's start (time n/60 s). A tick is a sim step, or a frozen tick while
// hit-stop lasts (as in game.js). seek(n) replays from frame 0, so stepping back and scrubbing show exactly what plays.
import { bus } from '../core/events.js';
import { createWorld, stepWorld } from '../sim/world.js';
import { createFighter } from '../sim/fighter.js';
import { createJuice } from '../render/juice.js';
import { stepViewPose } from '../render/view-pose.js';
import { forceGrip } from '../render/rig.js';
import { FIGHTERS } from '../data/fighters/index.js';
import { ITEMS } from '../data/items/index.js';
import { FPS } from '../config.js';
import { defFor, rigOf, lookOf, partnerOf } from './models.js';
import { clipsFor } from './clips.js';

// Bus listeners made inside scoped(owner, ...) only hear events while that owner steps its world (two slots on one page,
// each with its own hit-stop and effects). quiet: a dry run (the clip's length) feeds hit-stop but no effects.
let active = null;
export function scoped(owner, make, always = false) {
  const on = bus.on;
  bus.on = (type, fn) => on.call(bus, type, (d) => active === owner && (always || !owner.quiet) && fn(d));
  try { return make(); } finally { bus.on = on; }
}

const NEUTRAL = { mx: 0, my: 0, attack: false, jump: false, block: false, grab: false, grabHeld: false, use: false };
const STAGE = 'harbor-market', Y = 432, X = 480;

// cfg: { f, v, item, grip, anim, flip, target, look: {detail, tint, fur, size}, gear }. hooks.fx(): effects to tick
// (browser), hooks.warm(sb, time): replay one frame's render memory without pixels (seek).
export function createSlot(hooks = {}) {
  const slot = { quiet: false };
  slot.juice = scoped(slot, createJuice, true);
  slot.fx = hooks.fx ? scoped(slot, hooks.fx) : null;
  scoped(slot, () => bus.on('swing', ({ f, move }) => {   // no target to land on: hit-stop as if the swing landed
    if (slot.sb?.fakeStop && f === slot.sb.hero) slot.juice.freeze = Math.max(slot.juice.freeze, move.hitstop ?? 0);
  }), true);

  function build(cfg) {
    const def = defFor(cfg.f, { gear: cfg.gear, item: cfg.item }), rig = rigOf(cfg.f, cfg.v);
    const clips = clipsFor(cfg.f, cfg.item), clip = clips.find((c) => c.key === cfg.anim) ?? clips[0];
    const dir = cfg.flip ? -1 : 1, x0 = clip.startX ? clip.startX(dir) : X;
    const w = createWorld({ stage: STAGE, heroes: clip.heroes === 2 ? [cfg.f, cfg.f] : [cfg.f], seed: 1 });
    w.props = []; w.waveTimer = Infinity;   // no crates, no waves: just the model
    const hero = w.heroes[0];
    Object.assign(hero, { def, x: x0, y: Y, facing: dir });
    hero.look = lookOf(cfg.f, cfg.look);
    // T029 r2: with his own item, a rehearsal move's own (the dagger stab's dagger) and its strap (the shield)
    const own = cfg.item === 'own' || !cfg.item, it = ITEMS[cfg.item] ?? (own ? ITEMS[clip.item] : undefined);
    if (own && clip.strap) hero.strap = { def: ITEMS[clip.strap] };
    if (it?.kind === 'potion') hero.potion = it;
    else if (it) hero.weapon = { def: it, uses: 999, hit: false, broken: false };
    if (cfg.grip) forceGrip(hero, { grip: cfg.grip, grip2: cfg.grip });
    const sb = { cfg, def, rig, clip, clips, w, hero, x0, dir, k: 0, n: 0, view: { pose: null, left: 0 }, pose: null };
    const P = clip.partner?.(cfg.f, cfg.target) ?? (cfg.target && clip.kind === 'attack' ? partnerOf(cfg.f) : null);
    if (P) {
      const p = clip.heroes === 2 ? w.heroes[1] : createFighter(FIGHTERS[P], 0, Y, { facing: -dir });
      Object.assign(p, { x: x0 + dir * (clip.gap?.(sb) ?? p.def.ai?.range ?? 70), y: Y, facing: -dir, hp: 9999, maxHp: 9999 });
      if (clip.heroes !== 2) w.fighters.push(p);
      p.look = lookOf(p.def.id, {});
      sb.partner = p;
    }
    // T029 r2: fighters numbered from 1 in each clip (ids come from a global counter, and the idle breathing's phase is
    // the id: render/standee.js), so a clip plays the same whatever was loaded before it (the pass bar's archer frames)
    [...new Set([...w.heroes, ...w.fighters])].forEach((f, i) => { f.id = i + 1; });
    sb.cx0 = sb.partner && Math.abs(sb.partner.x - x0) < 320 ? (x0 + sb.partner.x) / 2 : x0 + dir * 24;   // fixed camera: model (a little toward his reach) and partner
    sb.fakeStop = clip.kind === 'attack' && !sb.partner;
    clip.setup?.(sb);
    sb.hold = clip.hold ?? null;
    return sb;
  }

  // One display tick (as game.js update): hit-stop freezes the sim; inputs follow sim frames, so a freeze never shifts them.
  function tick(sb) {
    slot.juice.tick();
    sb.n++;
    if (slot.juice.freeze > 0) { slot.juice.freeze--; return; }
    const c = { ...NEUTRAL, ...sb.clip.input?.(sb, sb.k) };
    if (sb.partner && sb.clip.partnerInput) Object.assign(sb.partner.control, NEUTRAL, sb.clip.partnerInput(sb, sb.k));
    sb.clip.act?.(sb, sb.k);
    stepWorld(sb.w, [c, NEUTRAL]);
    sb.clip.after?.(sb, sb.k);
    sb.pose = sb.hold ?? (sb.clip.viewPose ? stepViewPose(sb.view, sb.hero, sb.k === sb.clip.viewPose.at, sb.rig, sb.clip.viewPose.name) : null);
    sb.k++;
    slot.fx?.update?.();
  }

  // The clip's length in frames: run until it says it is done, plus its tail (capped).
  function lengthOf(cfg) {
    slot.quiet = true; active = slot; slot.juice.reset();
    const sb = build(cfg), max = sb.clip.max ?? 900;
    let n = 0;
    try {
      while (n < max && !(sb.clip.frames ? n >= sb.clip.frames : sb.k > 2 && sb.clip.done(sb))) { tick(sb); n++; }
    } finally { slot.quiet = false; active = null; }
    return Math.min(max, sb.clip.frames ?? n + (sb.clip.tail ?? 24));
  }

  slot.load = (cfg) => { slot.cfg = cfg; slot.len = lengthOf(cfg); return slot.seek(0); };
  // Replays to frame n (render memory warmed frame by frame through hooks.warm).
  slot.seek = (n) => {
    n = Math.max(0, Math.min(n, slot.len));
    slot.juice.reset(); slot.fx?.clear?.();
    const sb = (slot.sb = build(slot.cfg));
    active = slot;
    try {
      hooks.warm?.(sb, 0);
      for (let i = 1; i <= n; i++) { tick(sb); if (i < n) hooks.warm?.(sb, i / FPS); }
    } finally { active = null; }
    return sb;
  };
  slot.step = () => {   // forward one frame (playback); wraps to 0 at the end when looping is the caller's call
    if (slot.sb.n >= slot.len) return false;
    active = slot;
    try { tick(slot.sb); } finally { active = null; }
    return true;
  };
  slot.time = () => slot.sb.n / FPS;
  return slot;
}
