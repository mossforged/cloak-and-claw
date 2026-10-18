// Rat Archer rig (T026): the A018 rat holding the bow kit (items/rat-bow.js): bow upright in the far grip fist, held out
// in front; the near (pinch) hand rests by the string, draws it to his jaw over the windup (IK + string,
// render/rig-grip.js) and lets go on the shot. Far fist turned 5 so A022's slot axis (-95, bow end) stands the bow up.
// A019's raised-back far arm (fist at the jaw) is not used: with the bow out in front the near arm can't reach past
// that fist (near shoulder + arm ends ~5 px behind it), so the string arm stays the near one (report T026).
import rat from './rat-raider.js';
import base, { P, CROUCH } from './rat-raider-poses.js';

const BOW = (off, extra = {}) => ({ shield: { off, turn: 5 }, ...extra });   // T026 r2: A022's far grip slot at -95: the bow upright with the fist turned 5
// T026 r2: hand dirs are measured on the side-grip slot (A022: -16, was -45) and A022's pinch is drawn turned 55 deg: every
// dir here +84 from round 1 keeps the pinch drawing at its old screen angle (the pinch then reaches the string mid-draw)
const DRAW = { 'hand-near.order': 818 };   // the string hand over string (805) and arrow (810), still under its bracer (820; T026 r2)
const { swap: _s, ...STANCE } = P({ ...CROUCH, torso: 4, head: -6, hand: { off: [10, 16], dir: 24 }, ...BOW([24, 2]) });
const keep = (S, ...ks) => Object.fromEntries(ks.map((k) => [k, S[k]]));
const ARMS = ['arm-near-upper', 'arm-near-lower', 'hand-near', 'arm-far-upper', 'arm-far-lower', 'hand-far'];
export default {
  ...rat, id: 'rat-archer',
  poses: {
    ...base,
    stance: STANCE,
    idle: { ...base.idle, torso: [4, 1.5, 0], head: [-6, 2, 0.15], ...keep(STANCE, ...ARMS) },   // bow arm held steady
    walk: { ...base.walk, swap: {}, ...keep(STANCE, ...ARMS), 'arm-far-upper': [STANCE['arm-far-upper'], 4, 0] },
    hurt: { ...base.hurt, ...keep(P({ ...CROUCH, torso: -14, head: -14, hand: { off: [-6, 18], dir: -36 }, ...BOW([18, 10]) }), ...ARMS) },
    moves: {
      bowShot: {   // windup = the draw (string to the jaw), bow arm locked out; strike = the loose, string hand flicks back
        windup: { ...P({ ...CROUCH, swap: { head: 'head-effort' }, torso: 0, head: -2, dx: -2, hand: { off: [14, -4], dir: 144 }, ...BOW([33, -6]) }), ...DRAW },
        strike: { ...P({ ...CROUCH, swap: { head: 'head-attack', 'hand-near': 'hand-near-open' }, torso: 0, head: -4, dx: 1, hand: { off: [-4, -6], dir: -6 }, ...BOW([33, -6]) }), ...DRAW },
      },
    },
  },
};
