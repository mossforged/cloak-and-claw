// Rat Archer rig (T011): the Rat Raider rig + A008 hood and quiver, holding the bow kit (items/rat-bow.js): bow upright in
// the far fist held out in front; the near hand rests on the string, draws it to his cheek over the windup (IK + string,
// render/rig-grip.js) and lets go on the shot. Near arm angles here only pick the elbow's bend.
import rat, { GEAR } from './rat-raider.js';
import base from './rat-raider-poses.js';

const arms = (a, b, c, d) => ({ 'arm-front-upper': a, 'arm-front-lower': b, 'arm-back-upper': c, 'arm-back-lower': d });
export default {
  ...rat, id: 'rat-archer',
  parts: { ...rat.parts, hood: GEAR.hood, quiver: GEAR.quiver },
  poses: {
    ...base,
    stance: { ...base.stance, torso: 12, head: -8, 'leg-back-upper': -56, 'leg-back-lower': 61, 'leg-front-upper': 43, 'leg-front-lower': -40, ...arms(-60, -30, -45, -80) },
    idle: { ...base.idle, torso: [12, 2, 0], head: [-8, 3, 0.15], 'arm-front-upper': -60, 'arm-back-upper': [-45, 3, 0.1], 'arm-back-lower': -80 },
    walk: { ...base.walk, dy: [-5.5, 2, 0.75, 2], torso: [16, 2, 0, 2], head: [-10, 2, 0.1, 2], 'arm-front-upper': -60, 'arm-back-upper': [-45, 6, 0] },
    hurt: { ...base.hurt, ...arms(30, -100, -40, -40) },
    moves: {
      bowShot: {   // windup = the draw (string to the cheek), bow arm locked out; strike = the loose, string hand flicks back; legs stay planted
        windup: { head: -4, dx: -2, ...arms(-50, -60, -45, -76) },
        strike: { head: -6, dx: 1, ...arms(-40, -120, -43, -78) },
      },
    },
  },
};
