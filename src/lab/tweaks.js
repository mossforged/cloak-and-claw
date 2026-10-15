// Tuning lab model (pure, runs in Node): expands LAB_SCHEMA into fields, writes values straight into
// the live data objects, remembers the defaults, and lists what changed.
// A field's key is "file|path", e.g. "src/data/moves/mouse-sword.js|slash3.hitstop".

export const getPath = (obj, path) => path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);

export function setPath(obj, path, v) {
  const ks = path.split('.'), last = ks.pop();
  const parent = ks.reduce((o, k) => (o[k] ??= {}), obj);
  if (v === undefined) delete parent[last]; else parent[last] = v;
}

const norm = (f, file) => (Array.isArray(f)
  ? { path: f[0], min: f[1], max: f[2], step: f[3], fallback: f[4], file }
  : { file, ...f });

// Fields of one section; for a pick section, paths are prefixed with the picked key.
export function fieldsOf(section, pickKey) {
  return section.fields.map((f) => {
    const n = norm(f, section.file);
    return { ...n, label: n.path, path: section.pick ? `${pickKey}.${n.path}` : n.path };
  });
}

// Every field the schema can show (all pick keys expanded).
export function allFields(schema, roots) {
  return schema.flatMap((s) => (s.pick ? Object.keys(roots[s.file]).flatMap((k) => fieldsOf(s, k)) : fieldsOf(s)));
}

const decimals = (step) => (String(step).split('.')[1] ?? '').length;
export const roundTo = (v, step) => Number(Number(v).toFixed(decimals(step)));

export function createTweaks(schema, roots) {
  const fields = new Map(allFields(schema, roots).map((f) => [`${f.file}|${f.path}`, f]));
  const defaults = new Map([...fields].map(([key, f]) => [key, getPath(roots[f.file], f.path)]));
  const keyOf = (f) => `${f.file}|${f.path}`;

  const t = {
    fields,
    rootOf: (file) => roots[file],
    defaultOf: (f) => defaults.get(keyOf(f)),
    get: (f) => getPath(roots[f.file], f.path),
    isSet: (f) => t.get(f) !== undefined,
    // Absent field with no fallback = the data doesn't use it here; the lab won't invent it.
    editable: (f) => t.isSet(f) || f.fallback !== undefined,
    shown: (f) => t.get(f) ?? f.fallback,
    set(f, v) { setPath(roots[f.file], f.path, roundTo(v, f.step)); },
    resetField(f) { setPath(roots[f.file], f.path, defaults.get(keyOf(f))); },
    reset() { for (const f of fields.values()) t.resetField(f); },
    changes() {
      const out = [];
      for (const [key, f] of fields) {
        const old = defaults.get(key), now = t.get(f);
        if (old !== now) out.push({ file: f.file, path: f.path, old, now, key });
      }
      return out;
    },
    format() {
      return t.changes().map((c) => `${c.file} -> ${c.path}: ${c.old ?? '(unset)'} -> ${c.now ?? '(unset)'}`).join('\n');
    },
    save: () => Object.fromEntries(t.changes().map((c) => [c.key, c.now])),
    // Applies saved values; ignores keys the schema no longer has and non-numbers.
    load(saved) {
      for (const [key, v] of Object.entries(saved ?? {})) {
        const f = fields.get(key);
        if (f && typeof v === 'number' && Number.isFinite(v) && t.editable(f)) t.set(f, v);
      }
    },
  };
  return t;
}
