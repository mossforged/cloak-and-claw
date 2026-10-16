// Rat Archer rig (T018): the A010 Rat Raider rig holding the bow kit (items/rat-bow.js): bow upright through the far grip
// hand's hole, held out in front; the near hand (pinch) rests on the string, draws it to his cheek over the windup (IK +
// string, render/rig-grip.js) and lets go on the shot. Near arm angles here only pick the elbow's bend.
import rat from './rat-raider.js';
import base from './rat-raider-poses.js';

const arms = (a, b, c, d) => ({ 'arm-front-upper': a, 'arm-front-lower': b, 'arm-back-upper': c, 'arm-back-lower': d });
const DRAW = { 'arm-front-upper.order': 815, 'hand-front.order': 845 };   // the string arm in front of the body
export default {
  ...rat, id: 'rat-archer',
  poses: {
    ...base,
    stance: { ...base.stance, torso: 0, head: -2, ...arms(-60, -40, -20, 0), 'hand-back': 0 },
    idle: { ...base.idle, torso: [0, 1.5, 0], head: [-2, 2, 0.15], 'arm-front-upper': -60, 'arm-back-upper': [-20, 2, 0.1], 'hand-back': 0 },
    walk: { ...base.walk, 'arm-front-upper': -60, 'arm-back-upper': [-20, 4, 0], swap: {} },
    hurt: { ...base.hurt, ...arms(30, 20, -10, 20) },
    moves: {
      bowShot: {   // windup = the draw (string to the cheek), bow arm locked out; strike = the loose, string hand flicks back
        windup: { swap: { head: 'head-effort' }, head: -2, dx: -2, ...arms(-90, -60, -22, 0), ...DRAW },
        strike: { swap: { head: 'head-attack' }, head: -4, dx: 1, ...arms(-70, -100, -20, 0), ...DRAW },
      },
    },
  },
};
