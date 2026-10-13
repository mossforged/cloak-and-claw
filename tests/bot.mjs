// Simple scripted player: walks to the nearest enemy and attacks. Used by headless tests.
export function botControl(w) {
  const p = w.player;
  const foes = w.fighters.filter((f) => f.team === 'enemy' && !f.entering && f.state !== 'dead');
  if (!foes.length) return { mx: 0, my: 0, attack: false, jump: false };
  const e = foes.reduce((a, b) => (Math.abs(a.x - p.x) < Math.abs(b.x - p.x) ? a : b));
  const dx = e.x - p.x, dy = e.y - p.y;
  const inRange = Math.abs(dx) < 75 && Math.abs(dy) < 10;
  return {
    mx: inRange ? (Math.sign(dx) !== p.facing ? Math.sign(dx) : 0) : Math.abs(dx) > 55 ? Math.sign(dx) : 0,
    my: Math.abs(dy) > 4 ? Math.sign(dy) : 0,
    attack: inRange && w.frame % 6 === 0,
    jump: false,
  };
}
