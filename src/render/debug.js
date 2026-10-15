// Debug overlay (toggle with `): floor belt (scrolling stage, T013: walkable bounds, zone lock screens + markers, back
// segment joins, camera), hurtboxes (green), live hitboxes (red), feet anchors, state labels.
import { hitboxOf, hurtboxOf } from '../sim/combat.js';
import { RULES } from '../data/rules.js';
import { joinsOf } from './layers.js';

export function drawDebug(ctx, world, juice, camX = 0) {
  const fl = world.bounds;
  ctx.save();
  ctx.translate(-camX, 0);
  if (world.stage.layers) drawScroll(ctx, world);
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
  ctx.translate(camX, 0);
  ctx.fillStyle = '#000'; ctx.fillRect(8, 500, 460, 32);
  ctx.fillStyle = '#ff0';
  ctx.fillText(`frame ${world.frame}  wave ${world.wave}  fighters ${world.fighters.length}  attackers ${world.fighters.filter((f) => f.ai?.token).length}/${RULES.maxAttackers}`, 14, 514);
  ctx.fillText(`hitstop ${juice.freeze}  shake ${juice.shake.toFixed(1)}   (* = has attack token)`, 14, 528);
  ctx.restore();
}

// Scrolling stage: joins (magenta), zone lock screens (orange; solid = locked) with their centre x, the stage end.
function drawScroll(ctx, world) {
  const s = world.stage, fl = s.floor;
  ctx.lineWidth = 2; ctx.font = '12px monospace';
  for (const j of joinsOf(s)) {
    ctx.strokeStyle = 'rgba(255,60,255,0.9)'; ctx.beginPath(); ctx.moveTo(j, 0); ctx.lineTo(j, fl.bottom); ctx.stroke();
    ctx.fillStyle = '#ff7cff'; ctx.fillText(`join ${j}`, j + 4, 14);
  }
  s.zones.forEach((z, i) => {
    const on = world.run.locked && world.run.zone === i;
    ctx.strokeStyle = on ? 'rgba(255,150,40,1)' : 'rgba(255,150,40,0.6)'; ctx.setLineDash(on ? [] : [10, 6]);
    ctx.strokeRect(z.x - 480 + 3, 30, 954, fl.bottom - 30);
    ctx.setLineDash([]);
    ctx.beginPath(); ctx.moveTo(z.x, fl.top - 20); ctx.lineTo(z.x, fl.bottom + 20); ctx.stroke();
    ctx.fillStyle = '#ffa040'; ctx.fillText(`zone ${i + 1} x${z.x} ${z.enemies.length} rats${i < world.run.zone ? ' (clear)' : ''}`, z.x - 70, fl.top - 26);
  });
  ctx.strokeStyle = '#7cff7c'; ctx.beginPath(); ctx.moveTo(s.end, fl.top); ctx.lineTo(s.end, fl.bottom); ctx.stroke();
  ctx.fillStyle = '#7cff7c'; ctx.fillText('end (loop)', s.end - 30, fl.bottom + 14);
  ctx.fillStyle = '#9fe2ff';
  ctx.fillText(`camera x ${world.cam.x.toFixed(0)}${world.cam.locked ? ' LOCKED' : ''}  loop ${world.run.loop}  queue ${world.run.queue.length}`, world.cam.x + 14, 488);
}
