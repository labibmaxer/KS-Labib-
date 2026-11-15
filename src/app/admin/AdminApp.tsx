'use client';
import { useCallback, useEffect, useMemo, useState } from 'react';
import type { Session } from '@supabase/supabase-js';
import { browserClient } from '@/lib/supabase';
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS, SECTION_LABELS, SECTION_ORDER } from '@/lib/defaults';
import { merge } from '@/lib/merge';
import JsonEditor, { ImageInput, uploadImage } from './JsonEditor';
import './admin.css';

type Json = any;
type Tab = 'overview' | 'projects' | 'sections' | 'settings' | 'leads';
const sb = browserClient();
const slugify = (s: string) => s.toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60) || 'project';
const fmt = (d?: string) => (d ? new Date(d).toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' }) : '');

export default function AdminApp() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  const [tab, setTab] = useState<Tab>('overview');
  const [toast, setToast] = useState<{ msg: string; err?: boolean } | null>(null);

  const say = useCallback((msg: string, err = false) => { setToast({ msg, err }); setTimeout(() => setToast(null), 3200); }, []);

  useEffect(() => {
    sb.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data: sub } = sb.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session) { setIsAdmin(null); return; }
    sb.rpc('pf_is_admin').then(({ data, error }) => setIsAdmin(error ? false : data === true));
  }, [session]);

  /** refresh the live site cache after a save */
  const publish = useCallback(async (quiet = false) => {
    try {
      const { data } = await sb.auth.getSession();
      const r = await fetch('/api/revalidate', { method: 'POST', headers: { Authorization: `Bearer ${data.session?.access_token}` } });
      if (!r.ok) throw new Error('revalidate ' + r.status);
      if (!quiet) say('Live site refreshed');
    } catch { say('Saved, but could not refresh the live site cache (it updates within a minute anyway).', true); }
  }, [say]);

  if (!ready) return <div className="adm adm-center">Loading…</div>;
  if (!session) return <Login say={say} toast={toast} />;
  if (isAdmin === null) return <div className="adm adm-center">Checking access…</div>;
  if (!isAdmin) {
    return (
      <div className="adm adm-center">
        <div className="login">
          <h1>No admin access</h1>
          <p className="muted">Signed in as <b>{session.user.email}</b>, but this email is not in the <code>pf_admins</code> table. Add it in Supabase → SQL Editor:</p>
          <pre className="code">{`insert into public.pf_admins (email) values ('${session.user.email}') on conflict do nothing;`}</pre>
          <button className="btn-p" onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </div>
    );
  }

  const tabs: [Tab, string][] = [['overview', 'Overview'], ['projects', 'Projects'], ['sections', 'Sections'], ['settings', 'Settings'], ['leads', 'Leads']];
  return (
    <div className="adm">
      <aside className="side">
        <a className="brand" href="/"><span className="logo-cutout" aria-hidden="true" />Admin</a>
        <div className="snav">{tabs.map(([id, label]) => <button key={id} className={tab === id ? 'on' : ''} onClick={() => setTab(id)}>{label}</button>)}</div>
        <div className="side-foot">
          <a href="/" target="_blank" rel="noreferrer">View site ↗</a>
          <button onClick={() => publish()}>Refresh live site</button>
          <span className="muted sm">{session.user.email}</span>
          <button onClick={() => sb.auth.signOut()}>Sign out</button>
        </div>
      </aside>
      <main className="main">
        {tab === 'overview' && <Overview go={setTab} />}
        {tab === 'projects' && <Projects say={say} publish={publish} />}
        {tab === 'sections' && <Sections say={say} publish={publish} />}
        {tab === 'settings' && <Settings say={say} publish={publish} />}
        {tab === 'leads' && <Leads say={say} />}
      </main>
      {toast && <div className={'toast' + (toast.err ? ' err' : '')}>{toast.msg}</div>}
    </div>
  );
}

/* ───────── Login ───────── */
function Login({ say, toast }: { say: (m: string, e?: boolean) => void; toast: { msg: string; err?: boolean } | null }) {
  const [email, setEmail] = useState('');
  const [pw, setPw] = useState('');
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr('');
    const { error } = await sb.auth.signInWithPassword({ email: email.trim(), password: pw });
    if (error) setErr(error.message);
    setBusy(false);
  }
  void say;
  return (
    <div className="adm adm-center">
      <form className="login" onSubmit={submit}>
        <div className="brand big"><span className="logo-cutout" aria-hidden="true" />Admin</div>
        <p className="muted">Sign in to manage your portfolio.</p>
        <label className="lbl">Email</label>
        <input className="in" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <label className="lbl">Password</label>
        <input className="in" type="password" autoComplete="current-password" value={pw} onChange={(e) => setPw(e.target.value)} required />
        {err && <div className="err">{err}</div>}
        <button className="btn-p" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="muted sm" href="/">← Back to site</a>
      </form>
      {toast && <div className={'toast' + (toast.err ? ' err' : '')}>{toast.msg}</div>}
    </div>
  );
}

/* ───────── Overview ───────── */
function Overview({ go }: { go: (t: Tab) => void }) {
  const [n, setN] = useState<Record<string, number | string>>({});
  const [leads, setLeads] = useState<Json[]>([]);
  useEffect(() => {
    (async () => {
      const since = new Date(Date.now() - 30 * 864e5).toISOString();
      const [p, l, v, rl] = await Promise.all([
        sb.from('pf_projects').select('id', { count: 'exact', head: true }),
        sb.from('pf_leads').select('id', { count: 'exact', head: true }),
        sb.from('pf_visits').select('id', { count: 'exact', head: true }).gte('visited_at', since),
        sb.from('pf_leads').select('*').order('created_at', { ascending: false }).limit(5),
      ]);
      setN({ projects: p.count ?? 0, leads: l.count ?? 0, visits: v.count ?? 0 });
      setLeads(rl.data || []);
    })();
  }, []);
  return (
    <div>
      <h1 className="h1">Overview</h1>
      <div className="cards">
        <div className="kpi"><b>{n.projects ?? '…'}</b><span>Projects</span></div>
        <div className="kpi"><b>{n.visits ?? '…'}</b><span>Visits · 30 days</span></div>
        <div className="kpi"><b>{n.leads ?? '…'}</b><span>Leads</span></div>
      </div>
      <div className="row-btns">
        <button className="btn-p" onClick={() => go('projects')}>+ Add project</button>
        <button className="btn-s" onClick={() => go('sections')}>Edit page sections</button>
        <button className="btn-s" onClick={() => go('settings')}>Edit contact &amp; SEO</button>
      </div>
      <h2 className="h2">Latest leads</h2>
      {leads.length ? <div className="list">{leads.map((l) => (
        <div className="li" key={l.id}><div><b>{l.name}</b> <span className="muted">· {l.project_type}</span><div className="muted sm">{l.contact}</div></div><span className="muted sm">{fmt(l.created_at)}</span></div>
      ))}</div> : <p className="muted">No leads yet.</p>}
    </div>
  );
}

/* ───────── Projects ───────── */
const EMPTY_PROJECT: Json = { title: '', slug: '', type: '', year: String(new Date().getFullYear()), client: '', url: '', img: '', description: '', tags: [], status: 'done', gallery: '', challenge: '', approach: '', outcome: '', testimonial: '', testimonial_author: '', featured: false, sort_order: 0 };

function Projects({ say, publish }: { say: (m: string, e?: boolean) => void; publish: (q?: boolean) => Promise<void> }) {
  const [rows, setRows] = useState<Json[] | null>(null);
  const [edit, setEdit] = useState<Json | null>(null);
  const [q, setQ] = useState('');
  const load = useCallback(async () => {
    const { data, error } = await sb.from('pf_projects').select('*').order('sort_order', { ascending: true }).order('created_at', { ascending: false });
    if (error) say(error.message, true);
    setRows(data || []);
  }, [say]);
  useEffect(() => { load(); }, [load]);
  const shown = (rows || []).filter((r) => !q || (r.title + ' ' + (r.type || '') + ' ' + (r.client || '')).toLowerCase().includes(q.toLowerCase()));

  async function remove(r: Json) {
    if (!confirm(`Delete "${r.title}"? This cannot be undone.`)) return;
    const { error } = await sb.from('pf_projects').delete().eq('id', r.id);
    if (error) return say(error.message, true);
    say('Project deleted'); await load(); publish(true);
  }
  return (
    <div>
      <div className="head-row"><h1 className="h1">Projects</h1><button className="btn-p" onClick={() => setEdit({ ...EMPTY_PROJECT })}>+ Add project</button></div>
      <input className="in" placeholder="Search projects…" value={q} onChange={(e) => setQ(e.target.value)} style={{ marginBottom: 14 }} />
      {rows === null ? <p className="muted">Loading…</p> : shown.length ? (
        <div className="list">{shown.map((r) => (
          <div className="li" key={r.id}>
            <div className="li-main">
              {r.img ? <img className="thumb" src={r.img} alt="" /> : <div className="thumb ph">{(r.title || '?')[0]}</div>}
              <div><b>{r.title}</b> {r.featured && <span className="tag">featured</span>}<div className="muted sm">{[r.type, r.client, r.year].filter(Boolean).join(' · ')}</div></div>
            </div>
            <div className="li-act"><a className="btn-s" href={`/projects/${r.slug || r.id}`} target="_blank" rel="noreferrer">View</a><button className="btn-s" onClick={() => setEdit({ ...EMPTY_PROJECT, ...r, tags: r.tags || [] })}>Edit</button><button className="btn-s del" onClick={() => remove(r)}>Delete</button></div>
          </div>
        ))}</div>
      ) : <p className="muted">{rows.length ? 'No match.' : 'No projects yet — add your first one.'}</p>}
      {edit && <ProjectForm init={edit} onClose={() => setEdit(null)} say={say} onSaved={async () => { setEdit(null); await load(); publish(); }} />}
    </div>
  );
}

function ProjectForm({ init, onClose, say, onSaved }: { init: Json; onClose: () => void; say: (m: string, e?: boolean) => void; onSaved: () => void }) {
  const [p, setP] = useState<Json>(init);
  const [tags, setTags] = useState((init.tags || []).join(', '));
  const [busy, setBusy] = useState(false);
  const set = (k: string, v: Json) => setP((x: Json) => ({ ...x, [k]: v }));
  const gallery: string[] = useMemo(() => String(p.gallery || '').split(',').map((s) => s.trim()).filter(Boolean), [p.gallery]);

  async function addGallery(f?: File | null) {
    if (!f) return;
    try { const u = await uploadImage(f); set('gallery', [...gallery, u].join(', ')); } catch (e: any) { say(e.message, true); }
  }
  async function save() {
    if (!p.title.trim()) return say('Title is required', true);
    setBusy(true);
    const row: Json = {
      title: p.title.trim(), type: p.type?.trim() || null, year: p.year || null, client: p.client || null, url: p.url || null, img: p.img || null,
      description: p.description || null, tags: tags.split(',').map((t: string) => t.trim()).filter(Boolean), status: p.status || 'done',
      gallery: p.gallery || null, challenge: p.challenge || null, approach: p.approach || null, outcome: p.outcome || null,
      testimonial: p.testimonial || null, testimonial_author: p.testimonial_author || null, featured: !!p.featured, sort_order: Number(p.sort_order) || 0,
    };
    const base = slugify(p.slug?.trim() || p.title);
    let res;
    if (p.id) {
      res = await sb.from('pf_projects').update({ ...row, slug: base }).eq('id', p.id);
    } else {
      res = await sb.from('pf_projects').insert({ ...row, slug: base });
      if (res.error?.code === '23505') res = await sb.from('pf_projects').insert({ ...row, slug: base + '-' + Math.random().toString(36).slice(2, 6) });
    }
    setBusy(false);
    if (res.error) return say(res.error.message, true);
    say('Project saved'); onSaved();
  }
  const F = (label: string, k: string, ta = false, ph = '') => (
    <div className="fld"><label className="lbl">{label}</label>{ta
      ? <textarea className="in ta" rows={4} placeholder={ph} value={p[k] ?? ''} onChange={(e) => set(k, e.target.value)} />
      : <input className="in" placeholder={ph} value={p[k] ?? ''} onChange={(e) => set(k, e.target.value)} />}</div>
  );
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className="sheet">
        <div className="sheet-h"><h2>{p.id ? 'Edit project' : 'New project'}</h2><button className="ico" onClick={onClose}>✕</button></div>
        <div className="sheet-b">
          {F('Title *', 'title')}
          <div className="two">{F('Type / category', 'type', false, 'e.g. Web Development')}{F('Year', 'year')}</div>
          <div className="two">{F('Client', 'client')}{F('Live URL', 'url', false, 'https://…')}</div>
          <div className="fld"><label className="lbl">Cover image</label><ImageInput value={p.img || ''} onChange={(v) => set('img', v)} /></div>
          {F('Description (first line = lead paragraph, new lines = more paragraphs)', 'description', true)}
          <div className="fld"><label className="lbl">Tags / stack (comma separated)</label><input className="in" value={tags} onChange={(e) => setTags(e.target.value)} placeholder="Next.js, Supabase, Tailwind" /></div>
          <div className="two">
            <div className="fld"><label className="lbl">Status</label><select className="in" value={p.status || 'done'} onChange={(e) => set('status', e.target.value)}><option value="done">Completed</option><option value="in-progress">In progress</option><option value="on-hold">On hold</option></select></div>
            <div className="fld"><label className="lbl">Sort order (lower = first)</label><input className="in" type="number" value={p.sort_order ?? 0} onChange={(e) => set('sort_order', e.target.value)} /></div>
          </div>
          <label className="chk"><input type="checkbox" checked={!!p.featured} onChange={(e) => set('featured', e.target.checked)} /><span>Featured</span></label>
          <details className="more"><summary>More: case-study text, gallery, testimonial, URL slug</summary>
            {F('Challenge', 'challenge', true)}{F('My approach', 'approach', true)}{F('Outcome', 'outcome', true)}
            <div className="fld"><label className="lbl">Gallery images ({gallery.length})</label>
              <div className="gal">{gallery.map((g, i) => <div key={i} className="gal-i"><img src={g} alt="" /><button className="ico del" onClick={() => set('gallery', gallery.filter((_, n) => n !== i).join(', '))}>✕</button></div>)}</div>
              <input type="file" accept="image/*" onChange={(e) => addGallery(e.target.files?.[0])} />
            </div>
            {F('Testimonial', 'testimonial', true)}{F('Testimonial author', 'testimonial_author')}
            {F('URL slug (auto from title if empty)', 'slug', false, 'my-project')}
          </details>
        </div>
        <div className="sheet-f"><button className="btn-s" onClick={onClose}>Cancel</button><button className="btn-p" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save project'}</button></div>
      </div>
    </div>
  );
}

/* ───────── Sections ───────── */
function Sections({ say, publish }: { say: (m: string, e?: boolean) => void; publish: (q?: boolean) => Promise<void> }) {
  const [rows, setRows] = useState<Record<string, { data: Json; visible: boolean }>>({});
  const [loaded, setLoaded] = useState(false);
  const [open, setOpen] = useState<string | null>(null);
  const load = useCallback(async () => {
    const { data, error } = await sb.from('pf_sections').select('id,data,visible');
    if (error) say(error.message, true);
    const m: Record<string, { data: Json; visible: boolean }> = {};
    (data || []).forEach((r: Json) => (m[r.id] = { data: r.data || {}, visible: r.visible !== false }));
    setRows(m); setLoaded(true);
  }, [say]);
  useEffect(() => { load(); }, [load]);

  async function toggle(id: string, visible: boolean) {
    const cur = rows[id]?.data ?? {};
    const { error } = await sb.from('pf_sections').upsert({ id, data: cur, visible, updated_at: new Date().toISOString() });
    if (error) return say(error.message, true);
    say(visible ? 'Section shown' : 'Section hidden'); await load(); publish(true);
  }
  return (
    <div>
      <h1 className="h1">Page sections</h1>
      <p className="muted">Every piece of text, list and number on the homepage is editable here. Hide a section to remove it from the page.</p>
      {!loaded ? <p className="muted">Loading…</p> : (
        <div className="list">{SECTION_ORDER.map((id) => {
          const vis = rows[id]?.visible !== false; const custom = !!rows[id];
          return (
            <div className="li" key={id}>
              <div><b>{SECTION_LABELS[id] || id}</b> {custom ? <span className="tag">customised</span> : <span className="tag dim">default</span>}{!vis && <span className="tag warn">hidden</span>}</div>
              <div className="li-act">
                <label className="sw" title="Show on site"><input type="checkbox" checked={vis} onChange={(e) => toggle(id, e.target.checked)} /><i /></label>
                <button className="btn-s" onClick={() => setOpen(id)}>Edit</button>
              </div>
            </div>
          );
        })}</div>
      )}
      {open && <SectionEditor id={open} saved={rows[open]} onClose={() => setOpen(null)} say={say} onSaved={async () => { await load(); publish(); }} />}
    </div>
  );
}

function SectionEditor({ id, saved, onClose, say, onSaved }: { id: string; saved?: { data: Json; visible: boolean }; onClose: () => void; say: (m: string, e?: boolean) => void; onSaved: () => void }) {
  const initial = useMemo(() => merge(DEFAULT_SECTIONS[id], saved?.data || {}), [id, saved]);
  const [draft, setDraft] = useState<Json>(initial);
  const [raw, setRaw] = useState(false);
  const [rawTxt, setRawTxt] = useState('');
  const [busy, setBusy] = useState(false);
  const [dirty, setDirty] = useState(false);
  const upd = (v: Json) => { setDraft(v); setDirty(true); };

  function toRaw() { setRawTxt(JSON.stringify(draft, null, 2)); setRaw(true); }
  function fromRaw() {
    try { setDraft(JSON.parse(rawTxt)); setRaw(false); setDirty(true); } catch (e: any) { say('Invalid JSON: ' + e.message, true); }
  }
  async function save() {
    let data = draft;
    if (raw) { try { data = JSON.parse(rawTxt); } catch (e: any) { return say('Invalid JSON: ' + e.message, true); } }
    setBusy(true);
    const { error } = await sb.from('pf_sections').upsert({ id, data, visible: saved?.visible !== false, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return say(error.message, true);
    say('Section saved'); onSaved(); setDirty(false); onClose();
  }
  async function reset() {
    if (!confirm('Reset this section to the built-in default text?')) return;
    const { error } = await sb.from('pf_sections').delete().eq('id', id);
    if (error) return say(error.message, true);
    say('Reset to default'); onSaved(); onClose();
  }
  const close = () => { if (!dirty || confirm('Discard unsaved changes?')) onClose(); };
  return (
    <div className="modal" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div className="sheet wide">
        <div className="sheet-h"><h2>{SECTION_LABELS[id] || id}</h2>
          <div className="seg"><button className={!raw ? 'on' : ''} onClick={() => (raw ? fromRaw() : null)}>Form</button><button className={raw ? 'on' : ''} onClick={() => (!raw ? toRaw() : null)}>JSON</button></div>
          <button className="ico" onClick={close}>✕</button></div>
        <div className="sheet-b">
          {raw ? <textarea className="in raw" spellCheck={false} value={rawTxt} onChange={(e) => { setRawTxt(e.target.value); setDirty(true); }} /> : <JsonEditor id={id} value={draft} onChange={upd} />}
        </div>
        <div className="sheet-f"><button className="btn-s del" onClick={reset} disabled={!saved}>Reset to default</button><span style={{ flex: 1 }} /><button className="btn-s" onClick={close}>Cancel</button><button className="btn-p" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save section'}</button></div>
      </div>
    </div>
  );
}

/* ───────── Settings ───────── */
function Settings({ say, publish }: { say: (m: string, e?: boolean) => void; publish: (q?: boolean) => Promise<void> }) {
  const [v, setV] = useState<Json | null>(null);
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    sb.from('pf_settings').select('value').eq('key', 'site').maybeSingle().then(({ data, error }) => {
      if (error) say(error.message, true);
      setV(merge(DEFAULT_SETTINGS, data?.value || {}));
    });
  }, [say]);
  async function save() {
    setBusy(true);
    const { error } = await sb.from('pf_settings').upsert({ key: 'site', value: v, updated_at: new Date().toISOString() });
    setBusy(false);
    if (error) return say(error.message, true);
    say('Settings saved'); publish(true);
  }
  if (!v) return <p className="muted">Loading…</p>;
  return (
    <div>
      <div className="head-row"><h1 className="h1">Settings</h1><button className="btn-p" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save settings'}</button></div>
      <p className="muted">Brand name, contact details, social links, footer text and SEO. Leave a social link empty to hide its icon.</p>
      <JsonEditor id="settings" value={v} onChange={setV} />
      <div className="sheet-f" style={{ border: 0, padding: '18px 0' }}><button className="btn-p" disabled={busy} onClick={save}>{busy ? 'Saving…' : 'Save settings'}</button></div>
    </div>
  );
}

/* ───────── Leads ───────── */
function Leads({ say }: { say: (m: string, e?: boolean) => void }) {
  const [rows, setRows] = useState<Json[] | null>(null);
  const load = useCallback(async () => {
    const { data, error } = await sb.from('pf_leads').select('*').order('created_at', { ascending: false }).limit(300);
    if (error) say(error.message, true);
    setRows(data || []);
  }, [say]);
  useEffect(() => { load(); }, [load]);
  async function del(id: string) {
    if (!confirm('Delete this lead?')) return;
    const { error } = await sb.from('pf_leads').delete().eq('id', id);
    if (error) return say(error.message, true);
    load();
  }
  return (
    <div>
      <h1 className="h1">Leads</h1>
      {rows === null ? <p className="muted">Loading…</p> : rows.length ? (
        <div className="list">{rows.map((l) => {
          const c = String(l.contact || '');
          const mail = /@/.test(c);
          return (
            <div className="lead" key={l.id}>
              <div className="lead-h"><b>{l.name}</b><span className="muted sm">{fmt(l.created_at)}</span></div>
              <div className="muted sm">{l.project_type}{l.budget ? ' · ' + l.budget : ''}</div>
              <p className="lead-m">{l.message}</p>
              <div className="li-act">
                {c && <a className="btn-s" href={mail ? `mailto:${c}` : `https://wa.me/${c.replace(/\D/g, '')}`} target="_blank" rel="noreferrer">{mail ? 'Email' : 'WhatsApp'} · {c}</a>}
                <button className="btn-s del" onClick={() => del(l.id)}>Delete</button>
              </div>
            </div>
          );
        })}</div>
      ) : <p className="muted">No leads yet.</p>}
    </div>
  );
}
