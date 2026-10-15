// Browser side of the run log: keeps the last runs in localStorage and downloads them as JSON.
const KEY = 'cloak-and-claw.runs';
const KEEP = 20;

export function loadRuns() {
  try { return JSON.parse(localStorage.getItem(KEY)) ?? []; } catch { return []; }
}

export function saveRun(summary) {
  const runs = [...loadRuns(), { ...summary, at: new Date().toISOString() }].slice(-KEEP);
  try { localStorage.setItem(KEY, JSON.stringify(runs)); } catch { /* storage blocked: keep playing */ }
  return runs;
}

export function downloadRuns() {
  const blob = new Blob([JSON.stringify(loadRuns(), null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `runs-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}
