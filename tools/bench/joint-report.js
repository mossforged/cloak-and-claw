// T036, pure: the joint checker's results (tools/bench/joint-check.js) as the report: pass / fail per joint and kind, the
// worst sample, every flagged angle; each PNG's islands; console lines.
export const KINDS = ['gap', 'fragment', 'seam'];

export function summarize(results, islands = [], notes = []) {
  const joints = {}, lines = [];
  for (const r of results) {
    const kinds = {};
    for (const kind of KINDS) {
      const hits = r.samples.map((s) => ({ deg: s.deg, f: s.found.filter((f) => f.kind === kind) })).filter((h) => h.f.length);
      const worst = hits.map((h) => { const f = h.f.reduce((a, b) => (b.px > a.px ? b : a)); return { deg: h.deg, px: f.px, total: h.f.reduce((n, x) => n + x.px, 0), box: f.box }; })
        .reduce((a, b) => (!a || b.px > a.px ? b : a), null);
      // peak: the sample nearest the limit (share of it, >= 1 flags), so a pass shows its margin
      const peak = r.samples.reduce((a, s) => ((s.score?.[kind] ?? 0) > a.share ? { deg: s.deg, share: +(s.score[kind]).toFixed(2) } : a), { deg: null, share: 0 });
      kinds[kind] = { pass: !hits.length, flagged: hits.map((h) => h.deg), worst, peak };
    }
    const pass = KINDS.every((k) => kinds[k].pass);
    joints[r.joint] = { pass, part: r.part, point: r.point, limits: r.limits, angles: r.angles, window: r.R, ...kinds };
    lines.push(`${pass ? 'pass' : 'FAIL'}  ${r.joint.padEnd(14)} ${r.limits.join('..').padEnd(10)} ` +
      KINDS.map((k) => (kinds[k].pass ? `${k} ok ${kinds[k].peak.share}` :`${k} ${kinds[k].worst.px}px @${kinds[k].worst.deg} (${kinds[k].flagged.join(' ')})`)).join(' | '));
  }
  for (const i of islands) lines.push(`FAIL  island in ${i.part}: ${i.px}px at ${i.box.join(',')}`);
  for (const n of notes) lines.push(`note  ${n}`);
  const pass = Object.values(joints).every((j) => j.pass) && !islands.length;
  return { report: { pass, joints, islands: islands.map(({ mask, ...i }) => i), notes }, lines };
}
