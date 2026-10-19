// Drag to pose (T031), browser: the pose page's panel under the rig: start frame, Copy pose / Share / Undo / Reset, the view
// picker (Q S F BQ B), the hand and foot drawing pickers, and the joint readout (red at a limit).
import { clipsFor } from './clips.js';

const VIEWS = ['Q', 'S', 'F', 'BQ', 'B'];
const PICKS = ['hand-near', 'hand-far', 'foot-near', 'foot-far'];
const el = (tag, props = {}, kids = []) => { const e = Object.assign(document.createElement(tag), props); e.append(...kids); return e; };
const btn = (label, on, fn) => el('button', { textContent: label, className: on ? 'on' : '', onclick: fn });
const head = (t) => el('h3', { textContent: t });
const row = (...kids) => el('div', { className: 'row' }, kids.flat());

// api: { P(), set(patch: { swap? }), restart(from), copy(), share(), undo(), reset(), readout() }
export function createPanel(root, api) {
  const out = el('pre', { className: 'line' }), note = el('p', { className: 'note' });
  const joints = () => el('div', { className: 'joints' }, api.readout().map((r) => el('div', { className: `j${r.at ? ' at' : ''}` }, [
    el('span', { textContent: r.name }), el('b', { textContent: r.value == null ? '-' : `${r.value}°` }),
    el('span', { className: 'lim', textContent: `${r.lim != null ? `±${r.lim}` : ''}${r.note ? ` ${r.note}` : ''}` })])));
  function render() {
    const P = api.P(), rig = P.rig, [anim, n] = P.from.split(':');
    const clips = clipsFor(P.id, P.item), pick = el('select', { onchange: (e) => api.restart(`${e.target.value}:0`) },
      clips.map((c) => el('option', { value: c.key, textContent: c.label, selected: c.key === anim })));
    const frame = el('input', { type: 'number', min: 0, value: n, inputMode: 'numeric', onchange: (e) => api.restart(`${anim}:${Math.max(0, +e.target.value || 0)}`) });
    const views = rig.bodyViews?.torso ? VIEWS.filter((v) => v === 'Q' || rig.bodyViews.torso[v]) : [];
    const cur = P.swap['@view.torso'] ?? 'Q';
    const setView = (v) => {
      const sw = { ...P.swap };
      for (const slot of Object.keys(rig.bodyViews ?? {})) {
        delete sw[`@view.${slot}`];
        if (v !== 'Q' && rig.bodyViews[slot][v]) sw[`@view.${slot}`] = v;
      }
      api.set({ swap: sw });
    };
    const swaps = PICKS.filter((p) => rig.parts[p]).map((p) => {
      const names = Object.keys(rig.parts[p].swaps ?? {});
      const s = el('select', { onchange: (e) => { const sw = { ...P.swap }; if (e.target.value) sw[p] = e.target.value; else delete sw[p]; api.set({ swap: sw }); } },
        [el('option', { value: '', textContent: `${p}: as drawn / held` }), ...names.map((k) => el('option', { value: k, textContent: k, selected: P.swap[p] === k }))]);
      return el('label', {}, [s]);
    });
    root.replaceChildren(
      row(btn('Copy pose', false, api.copy), btn('Share', false, api.share), btn('Undo', false, api.undo), btn('Reset', false, api.reset)),
      note, out,
      head('Start from'), row(el('label', {}, [pick]), el('label', { className: 'frame' }, ['frame ', frame])),
      ...(views.length ? [head('View (chest and hips)'), row(views.map((v) => btn(v, cur === v, () => setView(v))))] : []),
      head('Hand and foot drawings'), row(swaps),
      head('Joints (red: at its limit)'), joints());
  }
  return {
    render,
    readout() { const rows = root.querySelector('.joints'); if (rows) rows.replaceWith(joints()); else render(); },
    show(text, msg) { out.textContent = text ?? ''; note.textContent = msg ?? ''; },
  };
}
