// Move rehearsal of the Rat Raider body (T028): docs/design/rigs/rat-raider-rehearsal.md transcribed key by key, for the
// rehearsal sheet (viewer.html?rehearse=rat-raider, src/viewer/rehearse.js): every move's keys as one contact sheet.
// A key: { key: name, view: 'Q' | 'BQ' | 'F/Q' (chest view / hip view; one code = both, a hip view the rig lacks = Q),
//   pose: what the rig shows today (a rig pose name, 'idle:<s>' / 'walk:<0..1>' at a time, or '<move>:windup|through|
//   strike|recover'), f: the fighter whose rig it uses (default the sheet's), draw: the drawings the key needs (rig swap
//   names, A023 names for the ones still coming), note: effects or anything else the key needs, carry: a prop at the
//   carry socket }.
// View codes: Q three-quarter, S side, F toward the camera, BQ turned away, B back; H hunched and LB leaning back are
// three-quarter torso drawings with their own joint points (rig standard 4). T029: Moving and Attacking are posed: a key's
// pose names the move's own key ('<move>:windup|through[.i]|strike|recover|<frame>', '<cycle pose>:<share>', '@<clip>:<frame>'
// = a viewer clip's frame) and the sheet shows that frame as the game draws it; `clip` = the move's viewer animation
// (`clips`: several). The other sections stay stand-ins until rounds 2 and 3.
const k = (key, view, pose, draw = '', note = '', f) => ({ key, view, pose, draw: draw.split(' ').filter(Boolean), note, ...(f && { f }) });
const SPEAR = 'rat-spearman', BOW = 'rat-archer';

const SHEET = {
  id: 'rat-raider', fighter: 'rat-raider', title: 'Rat Raider: move rehearsal (complete kit)',
  source: 'docs/design/rigs/rat-raider-rehearsal.md',
  sections: [
    { title: 'Moving', posed: true, moves: [
      { name: 'Menace idle + fidget', clip: 'idle', keys: [k('idle a', 'Q', 'idle:0', 'hand-near-grip hand-far-fist'), k('idle b', 'Q', 'idle:0.8', 'hand-near-grip hand-far-fist'),
        k('fidget a', 'Q', 'fidget:windup', 'head-shout'), k('fidget b', 'Q', 'fidget:strike', 'head-shout')], clips: ['idle', 'fidget'] },
      { name: 'Walk, approach, circle, back-walk', clip: 'walk', keys: [0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => k(`walk ${i + 1}/9`, 'Q', `walk:${(i / 9).toFixed(3)}`,
        i === 0 ? 'foot-near-heel foot-far-toe' : i === 4 ? 'foot-far-heel foot-near-toe' : '')) },
      { name: 'Run (chase, flee)', clip: 'pose:run', keys: [k('contact', 'H', 'run:0', 'torso-hunched foot-near-heel'), k('push-off', 'H', 'run:0.33', 'torso-hunched foot-near-toe'),
        k('both feet up', 'H', 'run:0.42', 'torso-hunched'), k('push-off 2', 'H', 'run:0.83', 'torso-hunched foot-far-toe')] },
      { name: 'Skid stop', clip: 'skidStop', keys: [k('brace', 'LB', 'skidStop:windup', 'torso-lean-back foot-near-out', 'dust fx'), k('settle', 'LB', 'skidStop:strike', 'torso-lean-back foot-near-out', 'dust fx')] },
      { name: 'Turn-around', clip: 'turn', keys: [k('narrowing', 'Q', '@turn:21'), k('mid (2 frames)', 'F/F', '@turn:22', 'torso-front pelvis-front head-front', 'scale crosses zero'), k('widening (flipped)', 'Q', '@turn:24')] },
      { name: 'Jump squat / land', clip: 'jumpUp', keys: [k('squat', 'H', 'jumpUp:windup', 'torso-hunched leg-far-folded'), k('land', 'H', 'jumpUp:recover', 'torso-hunched leg-far-folded'), k('land settle', 'Q', 'jumpUp:56', '')] },
      { name: 'Jump rise / apex / fall', clip: 'jumpUp', keys: [k('rise', 'Q', 'jumpUp:through.0', 'leg-near-kneeup leg-far-folded head-effort'), k('apex', 'Q', 'jumpUp:through.1', 'leg-near-kneeup leg-far-folded'), k('fall', 'Q', 'jumpUp:strike', '')] },
      { name: 'Dodge hop', clip: 'dodgeHop', keys: [k('crouch', 'H', 'dodgeHop:windup', 'torso-hunched leg-far-folded'), k('hop', 'H', 'dodgeHop:strike', 'torso-hunched leg-near-kneeup leg-far-folded'), k('land', 'H', 'dodgeHop:recover', 'torso-hunched leg-far-folded')] },
      { name: 'Dodge roll', clip: 'dodgeRoll', keys: [k('tuck', 'H', 'dodgeRoll:windup', 'leg-near-kneeup leg-far-folded'), k('roll (back)', 'B', 'dodgeRoll:through.0', 'torso-back head-back pelvis-back shoulder-far leg-near-kneeup leg-far-folded'),
        k('roll (back) 2', 'B', 'dodgeRoll:through.1', 'torso-back head-back pelvis-back shoulder-far'), k('up', 'Q', 'dodgeRoll:strike', 'leg-near-kneeling')] },
    ] },
    { title: 'Attacking', posed: true, moves: [
      { name: 'Telegraph (held wind-up)', clip: 'ratSlash', keys: [k('held wind-up', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked head-effort')] },
      { name: 'Slash 1 (forehand cut)', clip: 'ratSlash', keys: [k('wind', 'BQ', 'ratSlash:windup', 'torso-away arm-near-cocked head-effort'),
        k('over the shoulder (depth switch)', 'F/Q', 'ratSlash:through.0', 'torso-front shoulder-near head-attack'),
        k('strike', 'F/Q', 'ratSlash:through.1', 'torso-front head-attack foot-near-toe arm-near-smear-h'), k('follow', 'F/Q', 'ratSlash:strike', 'torso-front shoulder-near head-attack'),
        k('recover', 'Q', 'ratSlash:recover', '')] },
      { name: 'Slash 2 (backhand)', clip: 'backhand', keys: [k('in front', 'F/Q', 'backhand:windup', 'torso-front shoulder-near'), k('mid-swing (depth switch)', 'S/Q', 'backhand:through', 'torso-side shoulder-near'), k('behind', 'BQ', 'backhand:strike', 'torso-away')] },
      { name: 'Slash 3 spin (finisher)', clip: 'spin', keys: [k('start', 'Q', 'spin:windup', 'arm-near-cocked'), k('side', 'S/S', 'spin:through.0', 'torso-side pelvis-side shoulder-near'),
        k('back (mid-spin)', 'B/B', 'spin:through.1', 'torso-back head-back pelvis-back arm-near-smear-h shoulder-far'), k('front', 'F/F', 'spin:strike', 'torso-front pelvis-front head-front shoulder-near'), k('end', 'Q', 'spin:recover')] },
      { name: 'Overhead chop (club, axe)', clip: 'overheadChop', keys: [k('wind (lean back)', 'LB', 'overheadChop:windup', 'torso-lean-back arm-near-raised'), k('strike', 'H', 'overheadChop:through', 'torso-hunched arm-near-smear-o', 'hunched chest toward the camera (one torso drawing per key)'),
        k('follow', 'H', 'overheadChop:strike', 'torso-hunched', 'one-handed with the hand axe (A021); the two-hand version (overhand grips, far raised arm): the staff overhead')] },
      { name: 'Spear thrust', clip: 'spearThrust', f: SPEAR, keys: [k('draw back', 'S/S', 'spearThrust:windup', 'torso-side pelvis-side hand-near-grip-overhand hand-far-grip-overhand', '', SPEAR),
        k('lunge', 'S/S', 'spearThrust:strike', 'torso-side pelvis-side foot-near-out', 'far fist over the shaft (overlay band); out-turned rear foot (one near-foot drawing per key)', SPEAR), k('recover', 'S/S', 'spearThrust:recover', 'torso-side pelvis-side', '', SPEAR)] },
      { name: 'Dagger stab', clip: 'daggerStab', keys: [k('draw back', 'S/S', 'daggerStab:windup', 'torso-side pelvis-side hand-near-grip-overhand', 'reverse grip on the dagger (A021)'), k('stab', 'S/S', 'daggerStab:strike', 'torso-side pelvis-side shoulder-near'), k('recover', 'S/S', 'daggerStab:recover', 'torso-side pelvis-side')] },
      { name: 'Dagger throw', clip: 'daggerThrow', keys: [k('cock', 'BQ', 'daggerThrow:windup', 'torso-away arm-near-cocked'), k('release', 'F/Q', 'daggerThrow:strike', 'torso-front shoulder-near hand-near-open', 'the dagger leaves the hand and flies, turning over (a shot)'), k('follow', 'F/Q', 'daggerThrow:recover', 'torso-front hand-near-open')] },
      { name: 'Jump attack', clip: 'jumpAttack', keys: [k('rise', 'Q', 'jumpAttack:windup', 'arm-near-cocked leg-near-kneeup leg-far-folded'), k('top', 'BQ', 'jumpAttack:through', 'torso-away arm-near-cocked'),
        k('chop', 'F/Q', 'jumpAttack:strike', 'torso-front leg-near-kneeup leg-far-folded arm-near-smear-o'), k('land', 'H', 'jumpAttack:recover', 'leg-far-folded')] },
      { name: 'Dash attack', clip: 'dashAttack', keys: [k('dash', 'H', 'dashAttack:windup', 'torso-hunched foot-near-toe'), k('hit', 'H', 'dashAttack:strike', 'torso-hunched foot-near-toe')] },
      { name: 'Kick (unarmed)', clip: 'kick', keys: [k('chamber', 'LB', 'kick:windup', 'torso-lean-back leg-near-kneeup foot-far-toe'), k('extend', 'LB', 'kick:strike', 'torso-lean-back foot-far-toe', 'near leg rigid, extended'), k('recover', 'Q', 'kick:30')] },
      { name: 'Block (shield)', clip: 'guard', keys: [k('guard loop', 'H', 'guard:windup', 'torso-hunched arm-far-guard shoulder-far head-effort foot-near-out', 'guard arm in front of the chest (pose band), the round shield (A021) on its strap'),
        k('hit', 'H', 'guard:strike', 'torso-hunched arm-far-guard shoulder-far head-effort')] },
      { name: 'Shield bash', clip: 'shieldBash', keys: [k('draw back', 'S/S', 'shieldBash:windup', 'torso-side pelvis-side arm-far-guard', 'the round shield (A021) on the guard arm\'s strap'), k('bash', 'S/S', 'shieldBash:strike', 'torso-side pelvis-side arm-far-guard foot-near-toe'), k('recover', 'S/S', 'shieldBash:recover', 'torso-side pelvis-side')] },
      { name: 'Bow draw / aim / release', clip: 'bowShot', f: BOW, keys: [k('draw', 'Q', 'bowShot:20', 'hand-near-pinch', 'three-quarter (rehearsal: S or Q); bow at arm\'s length (the user\'s bow line, T028 r5), not the raised-back far arm', BOW), k('aim', 'Q', 'bowShot:windup', 'hand-near-pinch hand-far-grip', '', BOW),
        k('release', 'Q', 'bowShot:strike', 'hand-near-open', '', BOW)] },
      { name: 'Staff two-hand swing / overhead', clip: 'staffSwing', f: SPEAR, keys: [k('wind', 'BQ', 'staffSwing:windup', 'torso-away hand-near-grip-overhand hand-far-grip-overhand', 'the staff (A021), overhand both hands', SPEAR), k('swing', 'F/Q', 'staffSwing:strike', 'torso-front shoulder-near hand-near-grip-overhand hand-far-grip-overhand', '', SPEAR),
        k('overhead wind', 'LB', 'staffOverhead:windup', 'torso-lean-back hand-near-grip-overhand hand-far-grip-overhand', 'staff raised behind the head, both fists on it (T029 r3: the jointed far arm, not the rigid raised one: wrists inside their limits)', SPEAR), k('overhead strike', 'H', 'staffOverhead:strike', 'torso-hunched', '', SPEAR)], clips: ['staffSwing', 'staffOverhead'] },
      { name: 'Captain rally (shout)', clip: 'rally', keys: [k('raise', 'Q', 'rally:windup', 'head-shout arm-near-raised'), k('shout', 'Q', 'rally:strike', 'head-shout arm-near-raised')] },
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
// T029: every key of a posed section is drawn as posed (viewer/rehearse-frames.js keyFrame)
for (const sec of SHEET.sections) if (sec.posed) for (const mv of sec.moves) for (const key of mv.keys) key.posed = true;
export default SHEET;
