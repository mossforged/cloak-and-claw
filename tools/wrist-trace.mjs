// T029 r3: what the wrist solve (render/wrist.js) did on one move frame, as JSON (WRISTS.trace).
// node tools/wrist-trace.mjs <fighter> <move> <frame | key name>
import { FIGHTERS } from '../src/data/fighters/index.js';
import { RIGS } from '../src/data/rigs/index.js';
import { rigFrame } from '../src/render/rig.js';
import { keyMf } from '../src/viewer/rehearse-frames.js';
import { ITEMS } from '../src/data/items/index.js';
import { WRISTS } from '../src/data/wrists.js';

const [id, a, b0] = process.argv.slice(2), def = FIGHTERS[id], rig = RIGS[def.art.rig], m = def.moves[a] ?? def.rehearsal?.[a];
const b = isNaN(+b0) ? keyMf(rig, m, a, b0) : +b0;
const f = { def, state: m.air ? 'jump' : 'attack', t: b, mf: b, move: m, moveKey: a, z: 0, vz: 0, facing: 1, id: 1, x: 0, y: 0, stun: 10, grab: { knee: -1 },
  ...(m.item && { weapon: { def: ITEMS[m.item], uses: 999, hit: false, broken: false } }) };
const mem = {};
rigFrame(f, rig, -1, mem);
WRISTS.trace = [];
rigFrame(f, rig, 0, mem);
console.log(JSON.stringify(WRISTS.trace));
WRISTS.trace = null;
