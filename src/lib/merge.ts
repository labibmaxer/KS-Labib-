import type { Json } from './defaults';

/** Deep-merge saved content over defaults. Arrays from saved content replace default arrays. */
export function merge(def: Json, over: Json): Json {
  if (over === undefined || over === null) return def;
  if (Array.isArray(def) || Array.isArray(over)) return over;
  if (typeof def === 'object' && def && typeof over === 'object') {
    const out: Json = { ...def };
    for (const k of Object.keys(over)) out[k] = merge(def[k], over[k]);
    return out;
  }
  return over;
}
