'use client';
import { useRef, useState } from 'react';
import { browserClient } from '@/lib/supabase';

type Json = any;

export const TEMPLATES: Record<string, Json> = {
  'reviews.items': { name: '', role: '', rating: 5, quote: '', photo: '' },
  'skills.groups': { title: '', items: [] },
  'experience.items': { period: '', role: '', org: '', desc: '' },
  'pricing.plans': { type: '', name: '', desc: '', project: 0, retainer: 0, featured: false, badge: '', features: [] },
  'services.items': { id: '', label: '', eyebrow: '', title: '', desc: '', cta: 'Get a quote →', cardTitle: '', list: [] },
  'stats.items': { n: 0, suffix: '', l: '', decimal: false },
  'faq.items': { q: '', a: '' },
  'process.steps': { t: '', d: '' },
  'hero.cards': { n: '', l: '' },
  'about.stats': { n: '', l: '' },
};

const IMG_KEY = /(photo|img|image|avatar)$/i;
const LONG_KEY = /^(bio|desc|sub|a|d|quote|text|message|consent|footnote|footer_note|meta_description|success_text|empty_desc|challenge|approach|outcome|description)$/i;
const human = (k: string) => k.replace(/_/g, ' ').replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());
const isPrim = (x: Json) => x === null || ['string', 'number', 'boolean'].includes(typeof x);

function blankOf(x: Json): Json {
  if (typeof x === 'string') return '';
  if (typeof x === 'number') return 0;
  if (typeof x === 'boolean') return false;
  if (Array.isArray(x)) return [];
  if (x && typeof x === 'object') return Object.fromEntries(Object.entries(x).map(([k, v]) => [k, blankOf(v)]));
  return '';
}

export async function uploadImage(file: File): Promise<string> {
  const sb = browserClient();
  const safe = file.name.toLowerCase().replace(/[^a-z0-9.]+/g, '-').replace(/^-+|-+$/g, '') || 'image';
  const path = `uploads/${Date.now()}-${safe}`;
  const { error } = await sb.storage.from('portfolio').upload(path, file, { cacheControl: '31536000', upsert: false, contentType: file.type });
  if (error) throw error;
  return sb.storage.from('portfolio').getPublicUrl(path).data.publicUrl;
}

export function ImageInput({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  const ref = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function pick(f?: File | null) {
    if (!f) return;
    setBusy(true); setErr('');
    try { onChange(await uploadImage(f)); } catch (e: any) { setErr(e.message || 'Upload failed'); }
    setBusy(false);
    if (ref.current) ref.current.value = '';
  }
  return (
    <div className="img-in">
      <div className="img-in-row">
        <input className="in" value={value || ''} placeholder={placeholder || 'Image URL, /assets/…  or upload →'} onChange={(e) => onChange(e.target.value)} />
        <button type="button" className="btn-s" disabled={busy} onClick={() => ref.current?.click()}>{busy ? 'Uploading…' : 'Upload'}</button>
        <input ref={ref} type="file" accept="image/*" hidden onChange={(e) => pick(e.target.files?.[0])} />
      </div>
      {value ? <img className="img-prev" src={value} alt="" onError={(e) => ((e.target as HTMLImageElement).style.display = 'none')} onLoad={(e) => ((e.target as HTMLImageElement).style.display = 'block')} /> : null}
      {err ? <div className="err">{err}</div> : null}
    </div>
  );
}

function Prim({ k, v, onChange }: { k: string; v: Json; onChange: (v: Json) => void }) {
  if (typeof v === 'boolean') {
    return <label className="chk"><input type="checkbox" checked={v} onChange={(e) => onChange(e.target.checked)} /><span>{human(k)}</span></label>;
  }
  return (
    <div className="fld">
      <label className="lbl">{human(k)}</label>
      {typeof v === 'number' ? (
        <input className="in" type="number" step="any" value={Number.isFinite(v) ? v : 0} onChange={(e) => onChange(e.target.value === '' ? 0 : Number(e.target.value))} />
      ) : IMG_KEY.test(k) ? (
        <ImageInput value={v ?? ''} onChange={onChange} />
      ) : LONG_KEY.test(k) || String(v ?? '').length > 90 || String(v ?? '').includes('\n') ? (
        <textarea className="in ta" rows={Math.min(8, Math.max(3, Math.ceil(String(v ?? '').length / 70)))} value={v ?? ''} onChange={(e) => onChange(e.target.value)} />
      ) : (
        <input className="in" value={v ?? ''} onChange={(e) => onChange(e.target.value)} />
      )}
    </div>
  );
}

function StringList({ k, list, onChange }: { k: string; list: string[]; onChange: (v: string[]) => void }) {
  const set = (i: number, val: string) => onChange(list.map((x, n) => (n === i ? val : x)));
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= list.length) return; const c = [...list]; [c[i], c[j]] = [c[j], c[i]]; onChange(c); };
  return (
    <div className="fld">
      <label className="lbl">{human(k)} <em>({list.length})</em></label>
      <div className="slist">
        {list.map((s, i) => (
          <div className="srow" key={i}>
            <input className="in" value={s} onChange={(e) => set(i, e.target.value)} />
            <button type="button" className="ico" title="Up" onClick={() => move(i, -1)}>↑</button>
            <button type="button" className="ico" title="Down" onClick={() => move(i, 1)}>↓</button>
            <button type="button" className="ico del" title="Remove" onClick={() => onChange(list.filter((_, n) => n !== i))}>✕</button>
          </div>
        ))}
        <button type="button" className="btn-s" onClick={() => onChange([...list, ''])}>+ Add</button>
      </div>
    </div>
  );
}

function itemTitle(it: Json, i: number) {
  for (const k of ['name', 'title', 'role', 'q', 't', 'label', 'period', 'type', 'id']) if (typeof it?.[k] === 'string' && it[k]) return String(it[k]).replace(/\n/g, ' ');
  return `Item ${i + 1}`;
}

function ObjList({ k, list, onChange, tpl, tplKey }: { k: string; list: Json[]; onChange: (v: Json[]) => void; tpl: Json; tplKey: string }) {
  const [open, setOpen] = useState<Record<number, boolean>>({});
  const move = (i: number, d: number) => { const j = i + d; if (j < 0 || j >= list.length) return; const c = [...list]; [c[i], c[j]] = [c[j], c[i]]; onChange(c); };
  const add = () => {
    const base = JSON.parse(JSON.stringify(tpl));
    if (tplKey === 'services.items') base.id = 'svc-' + Date.now().toString(36);
    onChange([...list, base]); setOpen({ ...open, [list.length]: true });
  };
  return (
    <div className="fld">
      <label className="lbl">{human(k)} <em>({list.length})</em></label>
      <div className="olist">
        {list.map((it, i) => (
          <div className={'ocard' + (open[i] ? ' open' : '')} key={i}>
            <div className="ohead">
              <button type="button" className="otoggle" onClick={() => setOpen({ ...open, [i]: !open[i] })}><span>{open[i] ? '▾' : '▸'}</span> {itemTitle(it, i)}</button>
              <button type="button" className="ico" onClick={() => move(i, -1)}>↑</button>
              <button type="button" className="ico" onClick={() => move(i, 1)}>↓</button>
              <button type="button" className="ico del" onClick={() => { if (confirm('Remove this item?')) onChange(list.filter((_, n) => n !== i)); }}>✕</button>
            </div>
            {open[i] ? <div className="obody"><Node v={it} k="" tplKey={tplKey} onChange={(nv) => onChange(list.map((x, n) => (n === i ? nv : x)))} /></div> : null}
          </div>
        ))}
        <button type="button" className="btn-s" onClick={add}>+ Add {human(k).replace(/s$/i, '').toLowerCase()}</button>
      </div>
    </div>
  );
}

export function Node({ v, k, onChange, tplKey }: { v: Json; k: string; onChange: (v: Json) => void; tplKey: string }) {
  if (Array.isArray(v)) {
    const tpl = TEMPLATES[tplKey] ?? (v.length && !isPrim(v[0]) ? blankOf(v[0]) : null);
    if (!tpl) return <StringList k={k} list={v.map(String)} onChange={onChange} />;
    return <ObjList k={k} list={v} onChange={onChange} tpl={tpl} tplKey={tplKey} />;
  }
  if (v && typeof v === 'object') {
    return (
      <div className={k ? 'fset' : 'fset root'}>
        {k ? <div className="fset-t">{human(k)}</div> : null}
        {Object.keys(v).map((key) => (
          <Node key={key} k={key} v={v[key]} tplKey={tplKey ? tplKey + '.' + key : key} onChange={(nv) => onChange({ ...v, [key]: nv })} />
        ))}
      </div>
    );
  }
  return <Prim k={k} v={v} onChange={onChange} />;
}

/** Form editor for one section (key = section id so list templates resolve). */
export default function JsonEditor({ id, value, onChange }: { id: string; value: Json; onChange: (v: Json) => void }) {
  return (
    <div className="jed">
      {Object.keys(value).map((key) => (
        <Node key={key} k={key} v={value[key]} tplKey={id + '.' + key} onChange={(nv) => onChange({ ...value, [key]: nv })} />
      ))}
    </div>
  );
}
