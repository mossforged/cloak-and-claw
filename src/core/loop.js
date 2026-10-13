// Fixed-timestep loop: update() runs exactly FPS times per second, render() once per display frame.
import { FPS } from '../config.js';
export function startLoop(update, render) {
  const step = 1 / FPS;
  let last = performance.now(), acc = 0;
  function frame(now) {
    acc += Math.min(0.25, (now - last) / 1000);
    last = now;
    while (acc >= step) { update(); acc -= step; }
    render(now / 1000);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
}
