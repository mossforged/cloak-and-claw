// The bodies the stretch test runs on (T024): each body's rig with its variants (variants only add held items) and the
// floor weapons it can pick up. Shared by tests/stretch.test.mjs, tools/stretch-strip.mjs and the rig bench.
import { RIGS } from '../../src/data/rigs/index.js';
import { FIGHTERS } from '../../src/data/fighters/index.js';
import { ITEMS } from '../../src/data/items/index.js';

const defOf = (id) => Object.values(FIGHTERS).find((d) => d.art?.rig === id);
const pair = (id) => [RIGS[id], defOf(id)];
export const FAMILIES = {
  mouse: { title: 'Mouse Fighter (A013 + A016)', family: [pair('mouse-fighter')],
    items: Object.values(ITEMS).filter((k) => k.grip === 'one-hand' && k.kind === 'weapon') },
  rat: { title: 'Rat Raider family (A018 + A019; spearman, archer)', family: ['rat-raider', 'rat-spearman', 'rat-archer'].map(pair), items: [] },
};
// rig id -> body name (for ?rig= / ?src= on the bench)
export const bodyOf = (rigId) => Object.keys(FAMILIES).find((b) => FAMILIES[b].family.some(([r]) => r.id === rigId));
