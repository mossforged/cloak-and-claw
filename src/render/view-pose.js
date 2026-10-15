// View-only test poses on the hero's rig (C = `cast`): play once for rig timing.castHold seconds,
// only from idle; leaving idle (walk, attack, block, hurt...) drops it at once. Never touches the fighter.
import { FPS } from '../config.js';

// view: { pose, left } render-only memory; returns the pose name to draw this step (or null).
export function stepViewPose(view, hero, pressed, rig, name = 'cast') {
  const idle = hero.state === 'idle' && !hero.move;
  if (pressed && idle && !view.pose && rig?.poses[name]) { view.pose = name; view.left = Math.round(rig.poses.timing.castHold * FPS); }
  else if (view.pose && (!idle || --view.left <= 0)) view.pose = null;
  return view.pose;
}
