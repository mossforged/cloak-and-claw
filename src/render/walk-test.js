// TEMPORARY (T018 round 2): V cycles the rat walk variants (data/rigs/rat-raider-walks.js) on every rat rig, with a
// label in the corner, so the user can pick one in motion. Removed with the variants once the pick is in. View only.
import { RIGS } from '../data/rigs/index.js';
import { WALKS, WALK_DEFAULT, walkOf } from '../data/rigs/rat-raider-walks.js';

const RATS = ['rat-raider', 'rat-spearman', 'rat-archer'];

export function setupWalkTest() {
  let key = WALK_DEFAULT;
  const tag = document.createElement('div');
  tag.style.cssText = 'position:fixed;left:8px;bottom:8px;padding:4px 8px;background:#000a;color:#ffd23f;font:14px sans-serif;border-radius:4px;z-index:9';
  const show = () => { tag.textContent = `rat walk: ${WALKS[key].label}   (V to switch)`; };
  addEventListener('keydown', (e) => {
    if (e.code !== 'KeyV' || e.repeat) return;
    const keys = Object.keys(WALKS);
    key = keys[(keys.indexOf(key) + 1) % keys.length];
    for (const id of RATS) Object.assign(RIGS[id].poses.walk, walkOf(key));
    show();
  });
  show();
  document.body.append(tag);
}
