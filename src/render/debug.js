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

  for (const p of world.props) {   // T010: prop footprint (blocks movement) and hp
    const B = p.def.body; ctx.strokeStyle = 'rgba(255,170,60,0.95)'; ctx.lineWidth = 1.5;
    ctx.strokeRect(p.x - B.w / 2, p.y - B.d / 2, B.w, B.d); ctx.strokeRect(p.x - B.w / 2, p.y - B.h, B.w, B.h);
    ctx.fillStyle = '#ffb040'; ctx.fillText(`${p.def.id} hp${p.hp}`, p.x - B.w / 2, p.y - B.h - 4);
  }
  const P = world.player.def.pickup;
  for (const it of world.items) {   // pickup zone (feet must be inside) and state
    ctx.strokeStyle = 'rgba(255,240,120,0.9)';
    if (P) ctx.strokeRect(it.x - P.range, it.y - P.depth, P.range * 2, P.depth * 2);
    ctx.fillStyle = '#fff07a'; ctx.fillText(`${it.def.id} ${it.state}${it.def.kind === 'weapon' ? ' x' + it.uses : ''}`, it.x - 30, it.y + 26);
  }
  for (const s of world.shots) {   // arrow (T011): its hit lane (depth) and height
    ctx.fillStyle = 'rgba(255,60,60,0.5)'; ctx.fillRect(s.x - 12, s.y - s.def.depth, 24, s.def.depth * 2);
    ctx.strokeStyle = 'rgba(255,60,60,1)'; ctx.strokeRect(s.x - 12, s.y - s.z - 2, 24, 4);
  }
  const box = (b, color) => { ctx.strokeStyle = color; ctx.strokeRect(b.x0, b.y - b.z1, b.x1 - b.x0, b.z1 - b.z0); };
  for (const f of world.fighters) {
    ctx.lineWidth = 1.5;
    box(hurtboxOf(f), 'rgba(90,255,120,0.9)');
    const hb = hitboxOf(f);
    if (hb) { box(hb, 'rgba(255,60,60,1)'); ctx.fillStyle = 'rgba(255,60,60,0.5)'; ctx.fillRect(hb.x0, hb.y - hb.depth, hb.x1 - hb.x0, hb.depth * 2); }
    ctx.strokeStyle = '#fff'; ctx.beginPath(); ctx.moveTo(f.x - 6, f.y); ctx.lineTo(f.x + 6, f.y); ctx.moveTo(f.x, f.y - 6); ctx.lineTo(f.x, f.y + 6); ctx.stroke();
    const label = `${f.state}${f.move ? ':' + f.moveKey + '@' + f.mf : ''}${f.weapon ? ' [' + f.weapon.def.id + ' x' + f.weapon.uses + ']' : ''} hp${f.hp}${f.ai ? ' ' + f.ai.mode + (f.ai.token ? '*' : '') : ''}`;
    ctx.fillStyle = '#000'; ctx.fillRect(f.x - 4, f.y + 6, label.length * 7.3, 14);
    ctx.fillStyle = '#fff'; ctx.fillText(label, f.x - 2, f.y + 17);
  }
  ctx.fillStyle = '#000'; ctx.fillRect(8, 500, 460, 32);
  ctx.fillStyle = '#ff0';
  ctx.fillText(`frame ${world.frame}  wave ${world.wave}  fighters ${world.fighters.length}  attackers ${world.fighters.filter((f) => f.ai?.token).length}/${RULES.maxAttackers}`, 14, 514);
  ctx.fillText(`hitstop ${juice.freeze}  shake ${juice.shake.toFixed(1)}   (* = has attack token)`, 14, 528);
  ctx.restore();
}
