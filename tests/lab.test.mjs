// Tuning lab: the schema only names fields that exist in the data, sliders cover the defaults,
// and the tweak model writes live, lists changes and resets exactly.
import { LAB_SCHEMA, ROOTS } from '../src/data/lab-schema.js';
import { allFields, createTweaks, getPath } from '../src/lab/tweaks.js';
import { MOUSE_SWORD } from '../src/data/moves/mouse-sword.js';
import { RULES } from '../src/data/rules.js';

let fails = 0;
const check = (ok, msg) => { if (!ok) { fails++; console.error('FAIL:', msg); } };
const before = JSON.stringify(ROOTS);

// Schema -> data
for (const s of LAB_SCHEMA) check(ROOTS[s.file], `section '${s.title}': file ${s.file} is in ROOTS`);
const fields = allFields(LAB_SCHEMA, ROOTS);
for (const f of fields) {
  check(ROOTS[f.file], `${f.path}: file ${f.file} is in ROOTS`);
  check(f.min < f.max && f.step > 0, `${f.file} ${f.path}: min < max, step > 0`);
  const v = getPath(ROOTS[f.file], f.path);
  if (v === undefined) {
    // Absent is only allowed in pick sections (a move may not use a field), and the field must exist on some key.
    const label = f.label;
    const sec = LAB_SCHEMA.find((s) => s.pick && s.file === f.file);
    check(sec && Object.values(ROOTS[f.file]).some((item) => typeof getPath(item, label) === 'number') || f.fallback !== undefined,
      `${f.file} ${f.path}: field exists in the data`);
  } else {
    check(typeof v === 'number', `${f.file} ${f.path}: is a number (got ${typeof v})`);
    check(v >= f.min && v <= f.max, `${f.file} ${f.path}: default ${v} inside slider ${f.min}..${f.max}`);
  }
}
// A field outside a pick section must exist outright.
const pickFiles = new Set(LAB_SCHEMA.filter((s) => s.pick).map((s) => s.file));
for (const f of fields) if (!pickFiles.has(f.file)) check(typeof getPath(ROOTS[f.file], f.path) === 'number', `${f.file} ${f.path}: exists`);

// Tweak model
const t = createTweaks(LAB_SCHEMA, ROOTS);
check(t.format() === '', 'no changes at start');
const hs = t.fields.get('src/data/moves/mouse-sword.js|slash3.hitstop');
t.set(hs, 20);
check(MOUSE_SWORD.slash3.hitstop === 20, 'set writes into the live data object');
const g = t.fields.get('src/data/rules.js|gravity');
t.set(g, 0.4 + 0.2);   // float noise is rounded to the step
check(RULES.gravity === 0.6, `rounded to step (got ${RULES.gravity})`);
const dx = t.fields.get('src/data/moves/mouse-sword.js|jumpSlash.pose.windup.dx');
check(t.editable(dx) && t.shown(dx) === 0, 'absent field with fallback is editable and shows the fallback');
t.set(dx, 4);
const lunge = t.fields.get('src/data/moves/mouse-sword.js|jumpSlash.lunge');
check(!t.editable(lunge), 'absent field without fallback is not editable');
const text = t.format();
check(text.includes('src/data/moves/mouse-sword.js -> slash3.hitstop: 9 -> 20'), 'format line for hitstop');
check(text.includes('src/data/rules.js -> gravity: 0.55 -> 0.6'), 'format line for gravity');
check(text.includes('jumpSlash.pose.windup.dx: (unset) -> 4'), 'format line for an added field');
check(text.split('\n').length === 3, 'only changed values are listed');

const saved = t.save();
t.reset();
check(JSON.stringify(ROOTS) === before, 'reset restores the data exactly');
t.load({ ...saved, 'src/data/rules.js|nope': 3, 'src/data/rules.js|gravity': 'x' });
check(MOUSE_SWORD.slash3.hitstop === 20 && t.changes().length === 2, 'load applies saved values, ignores unknown/bad ones');
t.reset();
check(JSON.stringify(ROOTS) === before, 'reset after load restores the data');

console.log(`${fields.length} lab fields`);
console.log(fails ? `${fails} failures` : 'ALL OK');
process.exit(fails ? 1 : 0);
