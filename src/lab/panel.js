// Lab side panel: tools, copy/reset, and one slider row per schema field. Built from LAB_SCHEMA, not hand-written.
import { fieldsOf } from './tweaks.js';

const STORE = 'cloak-and-claw.lab.changes';
const el = (tag, props = {}, ...kids) => {
  const e = Object.assign(document.createElement(tag), props);
  e.append(...kids);
  return e;
};

export function loadSaved(tweaks) {
  try { tweaks.load(JSON.parse(localStorage.getItem(STORE) ?? '{}')); } catch { /* storage blocked: start from defaults */ }
}

export function buildPanel(root, schema, tweaks, tools, opts) {
  const refreshers = [];
  const out = el('textarea', { readOnly: true, rows: 5, placeholder: 'Changed values appear here.' });
  const count = el('span', { className: 'count' });

  const changed = () => {
    try { localStorage.setItem(STORE, JSON.stringify(tweaks.save())); } catch { /* not saved; still works */ }
    const n = tweaks.changes().length;
    count.textContent = n ? `${n} changed` : 'no changes';
    out.value = tweaks.format();
  };
  const refreshAll = () => { refreshers.forEach((r) => r()); changed(); };

  // --- header + collapse
  const toggle = el('button', { className: 'collapse', title: 'Hide / show panel', textContent: '⟩' });
  toggle.onclick = () => {
    root.classList.toggle('collapsed');
    toggle.textContent = root.classList.contains('collapsed') ? '⟨' : '⟩';
  };
  if (matchMedia('(max-width: 900px)').matches) { root.classList.add('collapsed'); toggle.textContent = '⟨'; }
  const body = el('div', { className: 'body' });
  root.append(toggle, el('h1', { textContent: 'Tuning lab' }), body);

  // --- tools
  const speeds = el('div', { className: 'seg' });
  for (const v of [1, 0.5, 0.25]) {
    const b = el('button', { textContent: `${v}x` });
    b.onclick = () => { tools.setSpeed(v); [...speeds.children].forEach((c) => c.classList.toggle('on', c === b)); };
    if (v === 1) b.classList.add('on');
    speeds.append(b);
  }
  const check = (label, on, set) => {
    const box = el('input', { type: 'checkbox', checked: on });
    box.onchange = () => set(box.checked);
    return [box, el('label', { className: 'check' }, box, ` ${label}`)];
  };
  const [, passive] = check("Rats don't attack", false, tools.setPassive);
  const [dbgBox, debug] = check('Debug overlay (` key)', opts.debug, (v) => { opts.debug = v; });
  setInterval(() => { dbgBox.checked = opts.debug; }, 250);   // the ` key can toggle it too
  const respawn = el('button', { textContent: 'Respawn wave' });
  respawn.onclick = tools.respawnWave;
  body.append(el('section', { className: 'tools' }, el('div', { className: 'row' }, el('span', { textContent: 'Speed' }), speeds),
    passive, debug, respawn));

  // --- changes
  const copy = el('button', { textContent: 'Copy changes', className: 'primary' });
  copy.onclick = async () => {
    out.value = tweaks.format();
    out.select();
    try { await navigator.clipboard.writeText(out.value); copy.textContent = 'Copied!'; }
    catch { copy.textContent = 'Select + copy below'; }
    setTimeout(() => { copy.textContent = 'Copy changes'; }, 1500);
  };
  const reset = el('button', { textContent: 'Reset all' });
  reset.onclick = () => { tweaks.reset(); refreshAll(); };
  body.append(el('section', { className: 'changes' }, el('div', { className: 'row' }, copy, reset, count), out));

  // --- schema sections
  schema.forEach((s, i) => {
    const rows = el('div', { className: 'rows' });
    const det = el('details', { open: i === 0 }, el('summary', { textContent: s.title }));
    let pick;
    if (s.pick) {
      const keys = Object.keys(tweaks.rootOf(s.file));
      const sel = el('select', {}, ...keys.map((k) => el('option', { value: k, textContent: k })));
      pick = keys[0];
      sel.onchange = () => { pick = sel.value; draw(); };
      det.append(sel);
    }
    det.append(rows);
    const draw = () => { rows.replaceChildren(...fieldsOf(s, pick).map((f) => fieldRow(f, tweaks, changed, refreshers))); };
    draw();
    body.append(det);
  });
  changed();
}

function fieldRow(f, tweaks, changed, refreshers) {
  const range = el('input', { type: 'range', min: f.min, max: f.max, step: f.step });
  const num = el('input', { type: 'number', step: f.step });
  const name = el('span', { className: 'name', textContent: f.label, title: `${f.file} -> ${f.path}\nClick to reset this value` });
  const row = el('div', { className: 'field' }, name, range, num);

  const refresh = () => {
    const ok = tweaks.editable(f), v = tweaks.shown(f);
    range.disabled = num.disabled = !ok;
    range.value = ok ? v : f.min;
    num.value = ok ? v : '';
    num.placeholder = ok ? '' : 'not set';
    row.classList.toggle('changed', tweaks.get(f) !== tweaks.defaultOf(f));
    row.classList.toggle('unset', !ok);
  };
  const set = (v) => { if (v === '' || !Number.isFinite(+v)) return refresh(); tweaks.set(f, +v); refresh(); changed(); };
  range.oninput = () => set(range.value);
  num.onchange = () => set(num.value);
  name.onclick = () => { tweaks.resetField(f); refresh(); changed(); };
  refreshers.push(refresh);   // rows of a re-picked move stay in the list; refreshing a detached row is harmless
  refresh();
  return row;
}
