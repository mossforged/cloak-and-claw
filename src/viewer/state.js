// Model viewer (T027): the view's state <-> URL query, so a link opens exactly the same view (the lead sends the user
// straight to the thing to look at, also on a branch preview). Pure. Defaults are left out of the URL.
// ?f=rat-spearman&anim=spearThrust&item=rat-spear&grip=overhand&speed=0.5
import { MODELS, SIZES, SPEEDS, GRIPS } from './models.js';

export const OVERLAYS = ['floor', 'pivots', 'sockets', 'seams', 'hitbox', 'ghost'];
export const BGS = ['grey', 'harbor'];
export const DEFAULTS = {
  f: MODELS[0], v: 'current', anim: 'idle', item: 'own', grip: '', speed: 1, size: 2, zoom: 1, flip: false, loop: true,
  paused: false, t: 0, bg: 'grey', ov: [], target: false,
  detail: '', tint: {}, fur: 0, lsize: 0, gear: null,   // gear null = the fighter's own loadout
  f2: '', v2: 'current', item2: 'own',                  // compare slot ('' = off)
};

const num = (v, ok, d) => (v != null && ok.includes(+v) ? +v : d);
const bool = (v, d) => (v == null ? d : v === '1' || v === 'true');
const list = (v) => (v ? v.split(',').filter(Boolean) : []);

export function parseState(search) {
  const q = new URLSearchParams(search), D = DEFAULTS, s = { ...D, tint: {}, ov: [] };
  const model = (v, d) => (MODELS.includes(v) ? v : d);
  s.f = model(q.get('f'), D.f);
  s.f2 = q.get('f2') ? model(q.get('f2'), '') : '';
  for (const k of ['v', 'anim', 'item', 'v2', 'item2', 'detail']) if (q.get(k)) s[k] = q.get(k);
  if (GRIPS.includes(q.get('grip'))) s.grip = q.get('grip');
  s.speed = num(q.get('speed'), SPEEDS, D.speed);
  s.size = num(q.get('size'), SIZES, D.size);
  s.zoom = Math.min(4, Math.max(0.25, +q.get('zoom') || D.zoom));
  s.flip = bool(q.get('flip'), D.flip); s.loop = bool(q.get('loop'), D.loop);
  s.paused = bool(q.get('paused'), D.paused); s.target = bool(q.get('target'), D.target);
  s.t = Math.max(0, Math.round(+q.get('t') || 0));
  s.bg = BGS.includes(q.get('bg')) ? q.get('bg') : D.bg;
  s.ov = list(q.get('ov')).filter((o) => OVERLAYS.includes(o));
  for (const pair of list(q.get('tint'))) { const [ch, i] = pair.split(':'); if (ch && Number.isInteger(+i)) s.tint[ch] = +i; }
  s.fur = +q.get('fur') || 0; s.lsize = +q.get('lsize') || 0;
  s.gear = q.has('gear') ? list(q.get('gear')) : null;
  return s;
}

export function formatState(s) {
  const q = new URLSearchParams(), D = DEFAULTS;
  const put = (k, v) => { if (v !== D[k]) q.set(k, typeof v === 'boolean' ? (v ? '1' : '0') : String(v)); };
  for (const k of ['f', 'v', 'anim', 'item', 'grip', 'speed', 'size', 'flip', 'loop', 'paused', 'bg', 'target', 'detail', 'fur', 'lsize', 'f2', 'v2', 'item2']) put(k, s[k]);
  if (s.zoom !== D.zoom) q.set('zoom', String(+s.zoom.toFixed(2)));
  if (s.paused && s.t) q.set('t', String(s.t));
  if (s.ov.length) q.set('ov', s.ov.join(','));
  const tint = Object.entries(s.tint).map(([ch, i]) => `${ch}:${i}`).join(',');
  if (tint) q.set('tint', tint);
  if (s.gear) q.set('gear', s.gear.join(','));
  return q.toString().replace(/%2C/g, ',').replace(/%3A/g, ':');
}
