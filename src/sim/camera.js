// Camera and walkable bounds (T013). Pure: the renderer only reads w.cam.
// w.bounds = the belt fighters, items and arrows are kept inside. An arena stage (no `camera`) uses stage.floor itself,
// so it gives exactly the old result. A scrolling stage narrows the floor to the screen: `edge` px inside the camera's
// view. The camera follows the player once he passes `follow` px from the screen's left edge, only forward, never past
// the stage's length, and stops at a zone's lock point (sim/zones.js sets cam.locked).
import { VIEW } from '../config.js';

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
    const want = w.player.x - C.follow;
    if (want > cam.x) cam.x = Math.min(want, stop);
  }
  fitBounds(w);
}

export function fitBounds(w) {
  const fl = w.stage.floor, C = w.stage.camera, b = w.bounds, x = w.cam.x;
  b.left = Math.max(fl.left, x + C.edge);
  b.right = Math.min(fl.right, x + VIEW.w - C.edge);
  b.top = fl.top; b.bottom = fl.bottom;
}
