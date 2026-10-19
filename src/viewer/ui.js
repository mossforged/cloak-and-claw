// Model viewer (T027) controls: the tabbed bottom sheet (big touch buttons, nothing hover-only) built from the model
// list, its clips, holdable items and look options. ui.set(patch) asks main.js to apply a state change. Browser only.
import { FIGHTERS } from '../data/fighters/index.js';
import { MODELS, SIZES, itemsFor, rigOf, itemLabel, versionsOf, looksFor, randomLook, STEPS } from './models.js';
import { clipsFor, GROUPS } from './clips.js';
import { OVERLAYS, BGS } from './state.js';
import { modesFor } from '../data/grip-modes.js';

const TABS = ['Character', 'Moves', 'Hold', 'Look', 'View', 'Compare'];
const OVERLAY_LABELS = { floor: 'Floor lines', pivots: 'Joint pivots', sockets: 'Sockets', seams: 'Stretch flags', hitbox: 'Hit boxes', ghost: 'Rest ghost' };
const el = (tag, props = {}, kids = []) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
const name = (id) => FIGHTERS[id]?.name ?? id;

export function createUI(api) {
  const tabs = document.getElementById('tabs'), panel = document.getElementById('panel');
  let tab = 'Moves';
  try { tab = localStorage.getItem('viewer.tab') || tab; } catch {}

  const btn = (label, on, click, extra = {}) => el('button', { textContent: label, className: on ? 'on' : '', onclick: click, ...extra });
  const row = (...kids) => el('div', { className: 'row' }, kids.flat());
  const head = (t) => el('h3', { textContent: t });

  function character(S) {
    const out = [head('Character'), row(MODELS.map((id) => btn(name(id), S.f === id, () => api.set({ f: id, anim: S.anim, item: 'own', grip: '', v: 'current', detail: '', tint: {}, fur: 0, lsize: 0, gear: null }))))];
    const vs = versionsOf(S.f);
    if (vs.length > 1) out.push(head('Version'), row(vs.map((v) => btn(v === 'current' ? 'Current' : v, S.v === v, () => api.set({ v })))));
    out.push(head('Facing'), row(btn('Flip', S.flip, () => api.set({ flip: !S.flip }))));
    out.push(head('Size (x game size)'), row(SIZES.map((z) => btn(`${z}x`, S.size === z, () => api.set({ size: z }, false)))));
    const zoom = el('input', { type: 'range', min: -2, max: 2, step: 0.05, value: Math.log2(S.zoom), oninput: (e) => api.set({ zoom: 2 ** +e.target.value }, false) });
    out.push(head('Zoom (or pinch)'), row(el('label', {}, [zoom]), btn('Reset', false, () => api.set({ zoom: 1 }, false))));
    return out;
  }

  function moves(S) {
    const clips = clipsFor(S.f, S.item), out = [];
    for (const g of GROUPS) {
      const list = clips.filter((c) => c.group === g);
      if (list.length) out.push(head(g), row(list.map((c) => btn(c.label, S.anim === c.key, () => api.set({ anim: c.key, t: 0, paused: false })))));
    }
    return out;
  }

  function hold(S) {
    return [head('Held item'), row(itemsFor(S.f).map((id) => btn(itemLabel(id), S.item === id, () => api.set({ item: id })))),
      head('Grip mode'), row(btn('Default', !S.grip, () => api.set({ grip: '' })), modesFor(rigOf(S.f)).map((g) => btn(g, S.grip === g, () => api.set({ grip: g })))),
      el('p', { className: 'note', textContent: 'Attacks use the held item\'s own moves when it has them (Moves tab).' })];
  }

  function look(S) {
    const L = looksFor(S.f);
    if (!L) return [el('p', { className: 'note', textContent: `${name(S.f)} has no look variety.` })];
    const out = [row(btn('Randomise', false, () => { const r = randomLook(S.f); api.set({ detail: r.detail, tint: r.tint, fur: r.fur, lsize: r.size }); }),
      btn('Reset', false, () => api.set({ detail: '', tint: {}, fur: 0, lsize: 0, gear: null })))];
    out.push(head('Face detail'), row(L.details.map((d) => btn(d.replace('detail-', ''), (S.detail || 'none') === d, () => api.set({ detail: d === 'none' ? '' : d })))));
    for (const [ch, list] of Object.entries(L.tints)) {
      out.push(head(ch), row(list.map((c, i) => btn('', (S.tint[ch] ?? 0) === i, () => api.set({ tint: { ...S.tint, [ch]: i } }),
        { className: `swatch${(S.tint[ch] ?? 0) === i ? ' on' : ''}`, style: `background:${c}`, ariaLabel: `${ch} ${c}` }))));
    }
    out.push(head('Fur'), row(STEPS.map((v) => btn(String(v), S.fur === v, () => api.set({ fur: v })))));
    out.push(head('Size variant'), row(STEPS.map((v) => btn(String(v), S.lsize === v, () => api.set({ lsize: v })))));
    const gear = S.gear ?? L.defaultGear;
    out.push(head('Gear'), row(L.gear.map((g) => btn(g.replace('gear-', ''), gear.includes(g),
      () => api.set({ gear: gear.includes(g) ? gear.filter((x) => x !== g) : [...gear, g] }))), btn('Own loadout', !S.gear, () => api.set({ gear: null }))));
    return out;
  }

  function view(S) {
    return [head('Overlays'), row(OVERLAYS.map((o) => btn(OVERLAY_LABELS[o], S.ov.includes(o), () => api.set({ ov: S.ov.includes(o) ? S.ov.filter((x) => x !== o) : [...S.ov, o] }, false)))),
      head('Background'), row(BGS.map((b) => btn(b === 'grey' ? 'Grey' : 'Harbor Market', S.bg === b, () => api.set({ bg: b }, false)))),
      head('Target'), row(btn('Something to hit', S.target, () => api.set({ target: !S.target }))),
      el('p', { className: 'note', textContent: 'Without a target, attacks still pause for their hit-stop as if they landed.' }),
      head('Share'), row(btn('Screenshot', false, () => api.screenshot()), btn('Copy link', false, () => api.share())),
      head('Pose'), row(btn('Pose this frame (drag to pose)', false, () => api.pose()))];
  }

  function compare(S) {
    const out = [head('Second character'), row(btn('Off', !S.f2, () => api.set({ f2: '' })), MODELS.map((id) => btn(name(id), S.f2 === id, () => api.set({ f2: id, v2: 'current', item2: 'own' }))))];
    if (!S.f2) return out;
    const vs = versionsOf(S.f2);
    if (vs.length > 1) out.push(head('Its version'), row(vs.map((v) => btn(v === 'current' ? 'Current' : v, S.v2 === v, () => api.set({ v2: v })))));
    out.push(head('It holds'), row(itemsFor(S.f2).map((id) => btn(itemLabel(id), S.item2 === id, () => api.set({ item2: id })))));
    out.push(el('p', { className: 'note', textContent: 'Both play the same animation when the second one has it (else idle).' }));
    return out;
  }

  const PANELS = { Character: character, Moves: moves, Hold: hold, Look: look, View: view, Compare: compare };
  function render(S) {
    tabs.replaceChildren(...TABS.map((t) => btn(t, tab === t, () => { tab = t; try { localStorage.setItem('viewer.tab', t); } catch {} render(S); })));
    const top = panel.scrollTop;
    panel.replaceChildren(...PANELS[tab](S));
    panel.scrollTop = top;
  }
  return { render };
}
