// Rat Archer rig (T026): the A018 rat holding the bow kit (items/rat-bow.js): bow upright in the far grip fist, held out
// in front; the near (pinch) hand rests by the string, draws it to his jaw over the windup (IK + string,
// render/rig-grip.js) and lets go on the shot. T028 r2: A023's far grip (slot axis 90, bow end -90) stands the bow up square.
// A019's raised-back far arm (fist at the jaw) is not used: with the bow out in front the near arm can't reach past
// that fist (near shoulder + arm ends ~5 px behind it), so the string arm stays the near one (report T026).
import rat from './rat-raider.js';
import raider, { P, CROUCH } from './rat-raider-poses.js';

const { run: _run, ...base } = raider;   // T029: the raider's run holds a cutlass guard

// T028 r4: the user's lines: the far grip's handle runs up the fist and the bow's runs forward (across the bow), so the
// far fist turns by the difference to keep the bow upright (UPRIGHT); the near hand holds nothing until the string, so its
// dirs keep the pinch at its round 3 screen angle (NEAR: the side grip's line moved from -90, A023's, to the user's)
const ang = (l) => Math.atan2(l.gripEnd[1] - l.grip[1], l.gripEnd[0] - l.grip[0]) * 180 / Math.PI;
const UPRIGHT = ang(rat.itemLines['rat-bow']) - rat.axes.bow, NEAR = rat.hands['hand-near-grip'].axis + 90;
// the bow kept where round 3 drew it: round 3's far grip (A023 slot 62.8, 72.8 and the 66.82, 87.01 reference, hand px;
// bow grip 63, 182.25 bow px) vs the user's (the fist turned UPRIGHT, the bow held at its line's a): `off` moves by the
// difference, so bow, string and arrow stay put and the fist sits where the user drew it
const turn = (v, d) => { const c = Math.cos(d * Math.PI / 180), s = Math.sin(d * Math.PI / 180); return [c * v[0] - s * v[1], s * v[0] + c * v[1]]; };
const R3 = [62.8 - 66.82, 72.8 - 87.01], NOW = turn([rat.hands['hand-far-grip'].at[0] - rat.shieldRef.at[0], rat.hands['hand-far-grip'].at[1] - rat.shieldRef.at[1]], UPRIGHT);
const B = rat.itemLines['rat-bow'].grip, bowPx = 0.25;   // items/rat-bow.js art.px
const SHIFT = [(R3[0] - NOW[0]) * rat.scale + (B[0] - 63) * bowPx, (R3[1] - NOW[1]) * rat.scale + (B[1] - 182.25) * bowPx];
const BOW = (off, extra = {}) => ({ shield: { off: [off[0] + SHIFT[0], off[1] + SHIFT[1]], turn: UPRIGHT }, ...extra });
// T026 r2: hand dirs are measured on the side-grip slot (A022: -16, was -45) and A022's pinch is drawn turned 55 deg: every
// dir here +84 from round 1 keeps the pinch drawing at its old screen angle (the pinch then reaches the string mid-draw)
const DRAW = { 'hand-near.order': 818 };   // the string hand over string (805) and arrow (810), still under its bracer (820; T026 r2)
// T029 (rehearsal: bow draw / aim / release, S or Q): three-quarter; the bow stays at arm's length in the far grip (T028
// r5, the user's line), not the raised-back far arm (its fist can't reach past the string arm, T026); open hand on the loose
const { swap: _s, ...STANCE } = P({ ...CROUCH, torso: 4, head: -6, hand: { off: [10, 16], dir: 24 + NEAR }, ...BOW([16, 14]) });
const keep = (S, ...ks) => Object.fromEntries(ks.map((k) => [k, S[k]]));
const ARMS = ['arm-near-upper', 'arm-near-lower', 'hand-near', 'arm-far-upper', 'arm-far-lower', 'hand-far'];
export default {
  ...rat, id: 'rat-archer',
  poses: {
    ...base,
    stance: STANCE,
    idle: { ...base.idle, torso: [4, 1.5, 0], head: [-6, 2, 0.15], ...keep(STANCE, ...ARMS) },   // bow arm held steady
    walk: { ...base.walk, swap: {}, ...keep(STANCE, ...ARMS), 'arm-far-upper': [STANCE['arm-far-upper'], 4, 0] },
    // T028 r2 (hand table): the raised near arm turns the bow grip's IK off, so the cast names the far grip drawing itself
    cast: { ...base.cast, swap: { ...base.cast.swap, 'hand-far': 'hand-far-grip' } },
    hurt: { ...base.hurt, ...keep(P({ ...CROUCH, torso: -14, head: -14, hand: { off: [-6, 18], dir: -36 + NEAR }, ...BOW([18, 10]) }), ...ARMS) },
    moves: {
      bowShot: {   // windup = the draw (string to the jaw), bow arm locked out; strike = the loose, string hand flicks back
        // T028 r5 (user's bow line along the bow): the bow at arm's length in front, not at his face. The far arm is already
        // straight at full reach (~31 px), which ends at the snout tip, so he stands up and leans back (torso -10, was 0)
        // with the chin up (head -12, was -2) and the bow fist at shoulder height (BOW [35, 0], was [33, -6]); the string
        // still comes to the jaw anchor (1.9 px). Full draw: bow grip 9 px in front of the nose, no bow pixel over the head
        // (was ~150 px²). T029: kept three-quarter (the rehearsal allows S or Q): on the side chest the near arm in front
        // showed the torso's hidden paint (52 px²) and the head sat 7 px above the string
        windup: { ...P({ ...CROUCH, swap: { head: 'head-effort' }, torso: -10, head: -12, dx: -2, hand: { off: [14, -2], dir: 144 + NEAR }, ...BOW([35, 0]) }), ...DRAW },
        strike: { ...P({ ...CROUCH, swap: { head: 'head-attack', 'hand-near': 'hand-near-open' }, torso: -10, head: -14, dx: 1, hand: { off: [-4, -4], dir: -6 + NEAR }, ...BOW([35, 0]) }), ...DRAW },
      },
    },
  },
};
