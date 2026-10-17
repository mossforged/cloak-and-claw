// Move rehearsal of the Rat Raider body (T028): docs/design/rigs/rat-raider-rehearsal.md transcribed key by key, for the
// rehearsal sheet (viewer.html?rehearse=rat-raider, src/viewer/rehearse.js): every move's keys as one contact sheet.
// A key: { key: name, view: 'Q' | 'BQ' | 'F/Q' (chest view / hip view; one code = both, a hip view the rig lacks = Q),
//   pose: what the rig shows today (a rig pose name, 'idle:<s>' / 'walk:<0..1>' at a time, or '<move>:windup|through|
//   strike|recover'), f: the fighter whose rig it uses (default the sheet's), draw: the drawings the key needs (rig swap
//   names, A023 names for the ones still coming), note: effects or anything else the key needs, carry: a prop at the
//   carry socket }.
// View codes: Q three-quarter, S side, F toward the camera, BQ turned away, B back; H hunched and LB leaning back are
// three-quarter torso drawings with their own joint points (rig standard 4). Poses are stand-ins until T029 poses every
// move: the sheet checks the drawings, views and depth, not the motion.
const k = (key, view, pose, draw = '', note = '', f) => ({ key, view, pose, draw: draw.split(' ').filter(Boolean), note, ...(f && { f }) });
const SPEAR = 'rat-spearman', BOW = 'rat-archer';

export default {
  id: 'rat-raider', fighter: 'rat-raider', title: 'Rat Raider: move rehearsal (complete kit)',
  source: 'docs/design/rigs/rat-raider-rehearsal.md',
  sections: [
    { title: 'Moving', moves: [
      { name: 'Menace idle + fidget', keys: [k('idle a', 'Q', 'idle:0', 'hand-near-grip hand-far-fist'), k('idle b', 'Q', 'idle:0.8', 'hand-near-grip hand-far-fist'),
        k('fidget a', 'Q', 'idle:0.4', 'head-shout'), k('fidget b', 'Q', 'idle:1.2', 'head-shout')] },
      { name: 'Walk, approach, circle, back-walk', keys: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => k(`walk ${i + 1}/9`, 'Q', `walk:${(i / 9).toFixed(3)}`,
        i === 0 || i === 4 ? 'foot-near-heel' : i === 3 ? 'foot-far-toe' : i === 7 ? 'foot-near-toe' : '')) },
      { name: 'Run (chase, flee)', keys: [k('contact', 'H', 'walk:0', 'torso-hunched foot-near-heel'), k('push-off', 'H', 'walk:0.3', 'torso-hunched foot-far-toe'),
        k('both feet up', 'H', 'jump', 'torso-hunched'), k('push-off 2', 'H', 'walk:0.8', 'torso-hunched foot-near-toe')] },
      { name: 'Skid stop', keys: [k('brace', 'LB', 'hurt', 'torso-lean-back foot-near-out', 'dust fx'), k('settle', 'LB', 'jumpSquat', 'torso-lean-back foot-near-out', 'dust fx')] },
      { name: 'Turn-around', keys: [k('narrowing', 'Q', 'idle:0'), k('mid (2 frames)', 'F', 'idle:0', 'torso-front pelvis-front head-front', 'scale crosses zero'), k('widening (flipped)', 'Q', 'idle:0')] },
      { name: 'Jump squat / land', keys: [k('squat', 'Q', 'jumpSquat', 'leg-far-folded'), k('land', 'Q', 'jumpSquat', 'leg-far-folded'), k('land settle', 'Q', 'jumpSquat', 'leg-far-folded')] },
      { name: 'Jump rise / apex / fall', keys: [k('rise', 'Q', 'jump', 'leg-near-kneeup leg-far-folded head-effort'), k('apex', 'Q', 'jump', 'leg-near-kneeup leg-far-folded'), k('fall', 'Q', 'jump', 'leg-far-folded')] },
      { name: 'Dodge hop', keys: [k('crouch', 'H', 'jumpSquat', 'torso-hunched leg-far-folded'), k('hop', 'H', 'jump', 'torso-hunched leg-near-kneeup leg-far-folded'), k('land', 'H', 'jumpSquat', 'torso-hunched leg-far-folded')] },
      { name: 'Dodge roll', keys: [k('tuck', 'Q', 'jumpSquat', 'leg-near-kneeup leg-far-folded'), k('roll (back)', 'B', 'jump', 'torso-back head-back pelvis-back shoulder-far leg-near-kneeup leg-far-folded'),
        k('roll (back) 2', 'B', 'jump', 'torso-back head-back pelvis-back shoulder-far'), k('up', 'Q', 'getup', 'leg-near-kneeling')] },
    ] },
    { title: 'Attacking', moves: [
      { name: 'Telegraph (held wind-up)', keys: [k('held wind-up', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked head-effort')] },
      { name: 'Slash 1 (forehand cut)', keys: [k('wind', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked head-effort'),
        k('over the shoulder (depth switch)', 'F/Q', 'ratSlash:through', 'torso-front shoulder-near head-attack'),
        k('strike', 'F/Q', 'ratSlash:strike', 'torso-front shoulder-near head-attack foot-near-toe arm-near-smear-h'), k('follow', 'F/Q', 'ratSlash:strike', 'torso-front shoulder-near head-attack'),
        k('recover', 'Q', 'ratSlash:recover', '')] },
      { name: 'Slash 2 (backhand)', keys: [k('in front', 'F', 'ratSlash:strike', 'torso-front shoulder-near'), k('mid-swing (depth switch)', 'S', 'cast', 'torso-side shoulder-near'), k('behind', 'BQ', 'ratSlash:windup', 'torso-away')] },
      { name: 'Slash 3 spin (finisher)', keys: [k('start', 'Q', 'ratSlash:windup', 'arm-near-cocked'), k('side', 'S', 'ratSlash:through', 'torso-side pelvis-side shoulder-near'),
        k('back (mid-spin)', 'B', 'ratSlash:strike', 'torso-back head-back pelvis-back arm-near-smear-h shoulder-far'), k('front', 'F', 'ratSlash:strike', 'torso-front pelvis-front head-front shoulder-near'), k('end', 'Q', 'idle:0')] },
      { name: 'Overhead chop (club, axe)', keys: [k('wind (lean back)', 'LB', 'cast', 'torso-lean-back arm-near-raised'), k('strike', 'F', 'ratSlash:strike', 'torso-front torso-hunched shoulder-near arm-near-smear-o'),
        k('follow (two-hand)', 'F', 'ratSlash:strike', 'torso-hunched hand-near-grip-overhand hand-far-grip-overhand arm-far-raised')] },
      { name: 'Spear thrust', keys: [k('draw back', 'S/S', 'spearThrust:windup', 'torso-side pelvis-side hand-near-grip-overhand hand-far-grip-overhand', '', SPEAR),
        k('lunge', 'S/S', 'spearThrust:strike', 'torso-side pelvis-side foot-near-toe foot-near-out', 'far fist over the shaft (overlay band)', SPEAR), k('recover', 'S/S', 'spearThrust:recover', 'torso-side pelvis-side', '', SPEAR)] },
      { name: 'Dagger stab', keys: [k('draw back', 'S/S', 'ratSlash:windup', 'torso-side pelvis-side hand-near-grip-overhand', 'reverse grip'), k('stab', 'S/S', 'ratSlash:strike', 'torso-side pelvis-side shoulder-near'), k('recover', 'S/S', 'ratSlash:recover', 'torso-side pelvis-side')] },
      { name: 'Dagger throw', keys: [k('cock', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked'), k('release', 'F', 'ratSlash:strike', 'torso-front shoulder-near hand-near-open'), k('follow', 'F', 'ratSlash:recover', 'torso-front hand-near-open')] },
      { name: 'Jump attack', keys: [k('rise', 'Q', 'jump', 'arm-near-cocked leg-near-kneeup leg-far-folded'), k('top', 'BQ', 'jump', 'torso-away arm-near-cocked'),
        k('chop', 'F', 'ratSlash:strike', 'torso-front shoulder-near leg-near-kneeup leg-far-folded arm-near-smear-o'), k('land', 'Q', 'jumpSquat', 'leg-far-folded')] },
      { name: 'Dash attack', keys: [k('dash', 'H', 'ratSlash:through', 'torso-hunched foot-near-toe'), k('hit', 'H', 'ratSlash:strike', 'torso-hunched foot-near-toe')] },
      { name: 'Kick (unarmed)', keys: [k('chamber', 'LB', 'jump', 'torso-lean-back leg-near-kneeup foot-far-toe'), k('extend', 'LB', 'jump', 'torso-lean-back foot-far-toe', 'near leg rigid, extended'), k('recover', 'Q', 'idle:0')] },
      { name: 'Block (shield)', keys: [k('guard loop', 'H', 'idle:0', 'torso-hunched arm-far-guard shoulder-far hand-far-shield head-effort foot-near-out', 'guard arm in front of the chest (pose band)'),
        k('hit', 'H', 'hurt', 'torso-hunched arm-far-guard shoulder-far hand-far-shield head-effort')] },
      { name: 'Shield bash', keys: [k('draw back', 'S/S', 'idle:0', 'torso-side pelvis-side arm-far-guard'), k('bash', 'S/S', 'ratSlash:strike', 'torso-side pelvis-side arm-far-guard foot-near-toe'), k('recover', 'S/S', 'idle:0', 'torso-side pelvis-side')] },
      { name: 'Bow draw / aim / release', keys: [k('draw', 'S', 'bowShot:windup', 'torso-side arm-far-raised-back hand-near-pinch', '', BOW), k('aim', 'S', 'bowShot:windup', 'torso-side hand-near-pinch hand-far-grip', '', BOW),
        k('release', 'S', 'bowShot:strike', 'torso-side hand-near-open', '', BOW)] },
      { name: 'Staff two-hand swing / overhead', keys: [k('wind', 'BQ', 'cast', 'torso-away hand-near-grip-overhand hand-far-grip-overhand arm-far-raised'), k('swing', 'F', 'ratSlash:strike', 'torso-front shoulder-near hand-near-grip-overhand hand-far-grip-overhand'),
        k('overhead wind', 'LB', 'cast', 'torso-lean-back arm-near-raised arm-far-raised'), k('overhead strike', 'H', 'ratSlash:strike', 'torso-hunched shoulder-near')] },
      { name: 'Captain rally (shout)', keys: [k('raise', 'Q', 'cast', 'head-shout arm-near-raised'), k('shout', 'Q', 'cast', 'head-shout arm-near-raised')] },
    ] },
    { title: 'Grabs, hurt, down', moves: [
      { name: 'Grab reach / hold (rat grabs)', keys: [k('reach', 'Q', 'idle:0', 'hand-near-palm hand-far-palm'), k('hold', 'Q', 'idle:0', 'hand-near-fist hand-far-fist')] },
      { name: 'Grabbed hold / hurt (victim)', keys: [k('held', 'Q', 'held', 'head-hurt'), k('hurt', 'Q', 'held', 'head-hurt')] },
      { name: 'Forward throw (rat throws)', keys: [k('grab', 'Q', 'idle:0', 'hand-near-fist hand-far-fist'), k('turn', 'F', 'ratSlash:through', 'torso-front pelvis-front shoulder-near'), k('heave', 'F', 'ratSlash:strike', 'torso-front pelvis-front shoulder-near')] },
      { name: 'Thrown (victim)', keys: [k('lift', 'Q', 'held', 'head-hurt'), k('over', 'Q', 'knockdown', 'head-hurt'), k('mid-spin (back)', 'B', 'knockdown', 'torso-back head-back pelvis-back'), k('land', 'Q', 'down', 'head-ko')] },
      { name: 'Hurt light (front)', keys: [k('snap back', 'LB', 'hurt', 'head-hurt torso-lean-back')] },
      { name: 'Hurt from behind', keys: [k('pitched forward', 'H', 'hurt', 'head-hurt torso-hunched')] },
      { name: 'Stagger (heavy)', keys: [k('reel', 'LB', 'hurt', 'torso-lean-back head-hurt'), k('knee', 'LB', 'getup', 'torso-lean-back leg-near-kneeling head-hurt')] },
      { name: 'Knockdown, bounce, lying face-up, death', keys: [k('fall', 'Q', 'knockdown', 'head-ko'), k('bounce', 'Q', 'knockdown', 'head-ko leg-far-folded'), k('lying', 'Q', 'down', 'head-ko leg-far-folded'), k('death', 'Q', 'down', 'head-ko leg-far-folded')] },
      { name: 'Lying face-down', keys: [k('face-down', 'B', 'down', 'torso-back head-back pelvis-back')] },
      { name: 'Get-up', keys: [k('push up', 'H', 'getup', 'leg-near-kneeling torso-hunched'), k('kneel', 'H', 'getup', 'leg-near-kneeling torso-hunched'), k('stand', 'Q', 'idle:0')] },
      { name: 'Stun / dizzy', keys: [k('dizzy', 'Q', 'getup', 'head-ko leg-near-kneeling', 'stars fx')] },
      { name: 'Weapon drop / pickup', keys: [k('drop', 'Q', 'hurt', 'hand-near-open'), k('drop 2', 'Q', 'hurt', 'hand-near-open'), k('squat', 'Q', 'jumpSquat', 'leg-far-folded hand-near-open'),
        k('grip', 'Q', 'jumpSquat', 'leg-far-folded hand-near-grip'), k('rise', 'Q', 'idle:0', 'hand-near-grip')] },
      { name: 'Cower', keys: [k('cower loop', 'H', 'cast', 'torso-hunched arm-near-raised arm-far-raised hand-near-palm hand-far-palm head-hurt')] },
      { name: 'Victory / taunt', keys: [k('raise', 'Q', 'cast', 'head-shout arm-near-raised'), k('taunt', 'Q', 'cast', 'head-shout arm-near-raised')] },
      { name: 'Weapon thrust in the air (victory, rally)', keys: [k('lift', 'Q', 'cast', 'arm-near-raised head-shout hand-far-fist'), k('thrust up', 'F', 'cast', 'torso-front arm-near-raised head-shout shoulder-near hand-far-fist')] },
    ] },
    { title: 'Lifting, throwing, drinking', moves: [
      { name: 'Throw the hero over the shoulder (back throw)', keys: [k('grab', 'Q', 'idle:0', 'hand-near-fist hand-far-fist', 'hero at the carry socket'), k('lift', 'LB', 'cast', 'torso-lean-back', 'hero at the carry socket'),
        k('arch', 'LB', 'cast', 'torso-lean-back arm-far-raised'), k('release', 'B', 'knockdown', 'torso-back head-back pelvis-back shoulder-far')] },
      { name: 'Throw the hero forward (hip toss)', keys: [k('grab', 'Q', 'idle:0', 'hand-near-fist hand-far-fist', 'hero at the carry socket'), k('turn', 'F', 'ratSlash:through', 'torso-front pelvis-front shoulder-near'), k('heave', 'F', 'ratSlash:strike', 'torso-front pelvis-front shoulder-near')] },
      { name: 'Lift the hero overhead and hurl', keys: [k('squat', 'Q', 'jumpSquat', 'leg-far-folded hand-near-palm hand-far-palm'), k('lift', 'LB', 'cast', 'torso-lean-back arm-near-raised arm-far-raised hand-near-palm hand-far-palm'),
        k('hold', 'LB', 'cast', 'torso-lean-back arm-near-raised arm-far-raised'), k('hurl', 'F', 'ratSlash:strike', 'torso-front shoulder-near')] },
      { name: 'Pick up and carry an object (crate, barrel)', keys: [k('squat', 'Q', 'jumpSquat', 'leg-far-folded hand-near-palm hand-far-palm', 'crate at the carry socket (carry band)'),
        k('lift', 'Q', 'idle:0', 'hand-near-palm hand-far-palm', 'crate between the torso and the near arm'), k('carry loop', 'Q', 'walk:0.25', 'hand-near-palm hand-far-palm', 'crate between the torso and the near arm')]
        .map((x) => ({ ...x, carry: 'crate' })) },
      { name: 'Throw an object two-handed (overhead)', keys: [k('wind', 'LB', 'cast', 'torso-lean-back arm-near-raised arm-far-raised'), k('release', 'H', 'ratSlash:strike', 'torso-hunched shoulder-near')] },
      { name: 'Throw a small object one-handed (bottle, fish)', keys: [k('cock', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked'), k('release', 'F', 'ratSlash:strike', 'torso-front shoulder-near hand-near-open')] },
      { name: 'Drink (potion, flask)', keys: [k('raise', 'Q', 'idle:0', 'arm-near-mouth'), k('drink', 'LB', 'idle:0', 'arm-near-mouth head-drink torso-lean-back'), k('lower', 'Q', 'idle:0', 'hand-near-grip'), k('wipe', 'Q', 'idle:0', 'arm-near-mouth')] },
    ] },
    { title: 'Magic: generic spell poses', moves: [
      { name: 'Charge (gather)', keys: [k('charge loop', 'H', 'idle:0', 'hand-near-cup hand-far-cup head-effort torso-hunched')] },
      { name: 'Push (palm blast)', keys: [k('release', 'F', 'ratSlash:strike', 'torso-front shoulder-near hand-near-palm')] },
      { name: 'Two-hand beam', keys: [k('beam loop', 'F', 'ratSlash:strike', 'torso-front shoulder-near shoulder-far hand-near-palm hand-far-palm', 'both arms in front (pose band)'), k('release', 'F', 'ratSlash:strike', 'torso-front hand-near-palm hand-far-palm')] },
      { name: 'Hold an orb / flame in hand', keys: [k('hold loop', 'Q', 'idle:0', 'hand-near-cup')] },
      { name: 'Call down (overhead)', keys: [k('wind', 'LB', 'cast', 'torso-lean-back arm-near-raised arm-far-raised hand-near-palm hand-far-palm'), k('release', 'H', 'ratSlash:strike', 'torso-hunched hand-near-palm hand-far-palm')] },
      { name: 'Ground strike', keys: [k('strike', 'H', 'getup', 'torso-hunched leg-near-kneeling hand-near-fist')] },
      { name: 'Point / command', keys: [k('point', 'S', 'ratSlash:strike', 'torso-side hand-near-point head-shout shoulder-near')] },
      { name: 'Self-buff / roar', keys: [k('gather', 'LB', 'idle:0', 'torso-lean-back hand-near-fist hand-far-fist head-shout', 'aura at socket chest'), k('roar', 'LB', 'idle:0', 'torso-lean-back head-shout', 'aura at socket chest')] },
      { name: 'Staff cast', keys: [k('wind', 'LB', 'cast', 'torso-lean-back hand-near-grip-overhand arm-near-raised'), k('release', 'F', 'ratSlash:strike', 'torso-front shoulder-near hand-near-grip-overhand')] },
    ] },
  ],
};
