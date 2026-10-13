// Debug overlay (toggle with `): floor belt, hurtboxes (green), live hitboxes (red), feet anchors, state labels.
import { hitboxOf, hurtboxOf } from '../sim/combat.js';
import { RULES } from '../data/rules.js';

export function drawDebug(ctx, world, juice) {
  const fl = world.stage.floor;
  ctx.save();
  ctx.strokeStyle = 'rgba(80,200,255,0.9)'; ctx.setLineDash([6, 4]); ctx.lineWidth = 1.5;
  ctx.strokeRect(fl.left, fl.top, fl.right - fl.left, fl.bottom - fl.top);
  ctx.setLineDash([]);
  ctx.font = '12px monospace'; ctx.textAlign = 'left'; ctx.fillStyle = '#9fe2ff';
  ctx.fillText(`floor top ${fl.top} bottom ${fl.bottom} left ${fl.left} right ${fl.right}`, fl.left + 4, fl.top - 6);

  const box = (b, color) => { ctx.strokeStyle = color; ctx.strokeRect(b.x0, b.y - b.z1, b.x1 - b.x0, b.z1 - b.z0); };
  for (const f of world.fighters) {
    ctx.lineWidth = 1.5;
    box(hurtboxOf(f), 'rgba(90,255,120,0.9)');
    const hb = hitboxOf(f);
    if (hb) { box(hb, 'rgba(255,60,60,1)'); ctx.fillStyle = 'rgba(255,60,60,0.5)'; ctx.fillRect(hb.x0, hb.y - hb.depth, hb.x1 - hb.x0, hb.depth * 2); }
    ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(f.x - 6, f.y); ctx.lineTo(f.x + 6, f.y); ctx.moveTo(f.x, f.y - 6); ctx.lineTo(f.x, f.y + 6); ctx.stroke();
    const label = `${f.state}${f.move ? ':' + Object.keys(f.def.moves).find((k) => f.def.moves[k] === f.move) + '@' + f.mf : ''} hp${f.hp}${f.ai ? ' ' + f.ai.mode + (f.ai.token ? '*' : '') : ''}`;
    ctx.fillStyle = '#000'; ctx.fillRect(f.x - 4, f.y + 6, label.length * 7.3, 14);
    ctx.fillStyle = '#fff'; ctx.fillText(label, f.x - 2, f.y + 17);
  }
  ctx.fillStyle = '#000'; ctx.fillRect(8, 500, 460, 32);
  ctx.fillStyle = '#ff0';
  ctx.fillText(`frame ${world.frame}  wave ${world.wave}  fighters ${world.fighters.length}  attackers ${world.fighters.filter((f) => f.ai?.token).length}/${RULES.maxAttackers}`, 14, 514);
  ctx.fillText(`hitstop ${juice.freeze}  shake ${juice.shake.toFixed(1)}   (* = has attack token)`, 14, 528);
  ctx.restore();
}
