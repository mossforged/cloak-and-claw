// Cached solid-color silhouettes of images (for hit flashes and tints).
const cache = new Map();
export function silhouette(img, color) {
  const key = (img.src ?? img) + color;
  if (cache.has(key)) return cache.get(key);
  const c = document.createElement('canvas');
  c.width = img.width; c.height = img.height;
  const g = c.getContext('2d');
  g.drawImage(img, 0, 0);
  g.globalCompositeOperation = 'source-in';
  g.fillStyle = color;
  g.fillRect(0, 0, c.width, c.height);
  cache.set(key, c);
  return c;
}
