// Camera and walkable bounds (T013). Pure: the renderer only reads w.cam.
// w.bounds = the belt fighters, items and arrows are kept inside. An arena stage (no `camera`) uses stage.floor itself,
// so it gives exactly the old result. A scrolling stage narrows the floor to the screen: `edge` px inside the camera's
// view. The camera follows the player once he passes `follow` px from the screen's left edge, only forward, never past
// the stage's length, and stops at a zone's lock point (sim/zones.js sets cam.locked). It moves at most `catchUp`
// px per frame, so after a zone unlocks with the player far right it glides over instead of snapping.
// Several heroes (T021): it follows the living heroes' centre, but never so far that the hindmost leaves the screen
// (cam.x <= his x - `keep`, default `edge`): when they spread, the leading hero is held at the right edge (Golden Axe).
// One hero: centre = his x and follow > keep, so it moves exactly as before.
import { VIEW } from '../config.js';
import { heroesUp } from './heroes.js';

export function createCamera(stage) {
  if (!stage.camera) return { cam: null, bounds: stage.floor };
  const fl = stage.floor;
  return { cam: { x: 0, locked: false }, bounds: { left: fl.left, right: fl.right, top: fl.top, bottom: fl.bottom } };
}

export const lockX = (zone) => zone.x - VIEW.w / 2;
export const maxCamX = (stage) => stage.camera.length - VIEW.w;

export function stepCamera(w) {
  const cam = w.cam, C = w.stage.camera;
  if (!cam) return;
  if (!cam.locked) {
    const next = w.stage.zones[w.run.zone];
    const stop = Math.min(maxCamX(w.stage), next ? lockX(next) : Infinity);
    const up = heroesUp(w), xs = (up.length ? up : w.heroes).map((h) => h.x);
    const centre = xs.reduce((a, b) => a + b, 0) / xs.length;
    const want = Math.min(centre - C.follow, Math.min(...xs) - (C.keep ?? C.edge));
    if (want > cam.x) cam.x = Math.min(want, stop, cam.x + C.catchUp);
  }
  fitBounds(w);
}

export function fitBounds(w) {
  const fl = w.stage.floor, C = w.stage.camera, b = w.bounds, x = w.cam.x;
  b.left = Math.max(fl.left, x + C.edge);
  b.right = Math.min(fl.right, x + VIEW.w - C.edge);
  b.top = fl.top; b.bottom = fl.bottom;
}
