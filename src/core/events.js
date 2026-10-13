// Tiny pub/sub bus. Sim emits, render/juice listen. See docs/MODULES.md for the event list.
const handlers = new Map();
export const bus = {
  on(type, fn) {
    if (!handlers.has(type)) handlers.set(type, []);
    handlers.get(type).push(fn);
  },
  emit(type, data) {
    for (const fn of handlers.get(type) ?? []) fn(data);
  },
};
