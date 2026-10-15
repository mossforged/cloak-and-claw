# T007 - Shield block for Mouse Fighter (code builder)

**Modules:** `src/sim/fighter.js`, `src/sim/combat.js`, `src/data/fighters/mouse-fighter.js`, `src/data/controls.js`, `src/core/input.js`, `src/data/rigs/mouse-fighter-poses.js`, `src/render/effects.js`, `src/render/standee.js`, `src/log/runlog.js`, `src/data/lab-schema.js`. **Read:** `src/sim/CONTRACT.md`, `src/render/CONTRACT.md`, `docs/decisions.md` (defence: block by default, depends on hero).
**Needs:** nothing (T006 independent). **Autonomy:** human-gated (feel).

The user chose a block as the default defence. Mouse Fighter carries a shield, so holding block raises it. Blocking is how a player handles a crowd fairly (Pillar 2) and every block should feel like an impact too (Pillar 1). A timed parry is a possible later layer (not now).

## Do
1. **Control:** hold `L` (gamepad: RB / button 5) to block. The run-log download key moves to the game-over screen only (L there still downloads; anywhere else L blocks). Update the HUD hint.
2. **Sim:** new state `block`, entered from idle/walk while held; leaves when released. While blocking: no attacking, walking at `block.walkSpeed` (data; default 0 = planted, but try ~0.6 for a shuffle), facing locked.
   - A hit from the **front** (attacker on the side the blocker faces) is blocked: `block.chip` damage (default 0), pushback `block.pushback`, a short `block.stun` where the blocker can't act, no knockdown. A hit from behind lands normally.
   - Emit a new event `block` `{ attacker, target, move, x, y, z }`. Document it in MODULES.md and the sim contract.
   - All numbers in the fighter's data (`block: { walkSpeed, chip, pushback, stun, hitstop }`), with lab sliders.
   - Enemies don't block (data-driven: only fighters with a `block` config can).
3. **Look:** rig pose `block` (shield raised forward, sword back, braced, head-neutral); standee lean back with shield side forward. On `block` event: sparks off the shield, a short white flash on the shield side, small hitstop and shake (from data), and a clang-like ring effect. Push the attacker back slightly too, so blocking creates space.
4. **Run log:** count blocks.
5. **Tests:** frontal hit on a blocker does chip damage only, no knockdown; hit from behind lands; blocking can't attack; the existing bot smoke test is unchanged (bot never blocks).

## Acceptance
- Headless: `npm test` passes; the old case (no block pressed) gives exactly the old result.
- Windowed: `docs/screens/T007/`: block pose (rig and standee), a blocked rat swing with sparks.
- Human: does blocking feel solid, and does it make the rats feel fair?

Out of scope: parry, enemy blocking, grab/throw (T008).
