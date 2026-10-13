// Loads every image path referenced in data. Missing art becomes a labeled silhouette, never a broken image.
export async function loadAssets(paths) {
  const map = new Map();
  await Promise.all([...new Set(paths)].map((p) => new Promise((res) => {
    const img = new Image();
    img.onload = () => { map.set(p, img); res(); };
    img.onerror = () => { console.warn('[assets] missing', p); map.set(p, placeholder(p)); res(); };
    img.src = p;
  })));
  return { get: (p) => map.get(p) };
}

// Walks data objects and collects any string ending in an image extension.
export function collectArtPaths(...roots) {
  const out = [];
  const walk = (v) => {
    if (typeof v === 'string' && /\.(png|webp|jpg)$/i.test(v)) out.push(v);
    else if (v && typeof v === 'object') Object.values(v).forEach(walk);
  };
  roots.forEach(walk);
  return out;
}

function placeholder(label) {
  const c = document.createElement('canvas');
  c.width = 200; c.height = 300;
  const g = c.getContext('2d');
  g.fillStyle = '#6b5a8a';
  g.beginPath(); g.roundRect(30, 20, 140, 270, 60); g.fill();
  g.fillStyle = '#fff'; g.font = '16px sans-serif'; g.textAlign = 'center';
  g.fillText(label.split('/').pop(), 100, 160);
  return c;
}
