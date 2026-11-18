/* HTML templates for every public section. Content is escaped; markup/classes match the original theme CSS. */
import type { Json } from './defaults';

export const esc = (v: any): string =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;');
/** escape + convert newlines to <br> */
export const nl = (v: any): string => esc(v).replace(/\r?\n/g, '<br>');
const pad2 = (n: number) => String(n).padStart(2, '0');
const safeHref = (h: any): string => {
  const s = String(h ?? '').trim();
  if (!s) return '#';
  if (/^(https?:|mailto:|tel:|\/|#)/i.test(s)) return esc(s);
  return esc('https://' + s);
};
const isExternal = (h: string) => /^https?:/i.test(h);

const ARROW = '<svg viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>';
const CHECK = '<svg viewBox="0 0 24 24" width="14" height="14" stroke="currentColor" fill="none" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>';
const PLUS = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>';
const STAT_ICONS = [
  '<svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>',
  '<svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>',
  '<svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="2"/><path d="M8 12l4-4 4 4"/><path d="M12 8v8"/></svg>',
  '<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>',
];
const PROC_ICONS = [
  '<svg viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>',
  '<svg viewBox="0 0 24 24"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',
  '<svg viewBox="0 0 24 24"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>',
  '<svg viewBox="0 0 24 24"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>',
];
const SOCIAL: Record<string, { label: string; svg: string }> = {
  instagram: { label: 'Instagram', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>' },
  twitter: { label: 'X', svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.742l7.736-8.859L1.254 2.25H8.08l4.259 5.631 5.905-5.631zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>' },
  facebook: { label: 'Facebook', svg: '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M24 12.073C24 5.404 18.627 0 12 0S0 5.404 0 12.073C0 18.1 4.388 23.094 10.125 24v-8.437H7.078v-3.49h3.047V9.41c0-3.025 1.792-4.697 4.533-4.697 1.312 0 2.686.235 2.686.235v2.97h-1.513c-1.491 0-1.956.93-1.956 1.886v2.27h3.328l-.532 3.49h-2.796V24C19.612 23.094 24 18.1 24 12.073z"/></svg>' },
  github: { label: 'GitHub', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>' },
  linkedin: { label: 'LinkedIn', svg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect x="2" y="9" width="4" height="12"/><circle cx="4" cy="4" r="2"/></svg>' },
};
const MAIL_ICON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>';

const DELAYS = ['', 'd1', 'd2', 'd3'];
const initials = (n: string) => (String(n || '?').split(/\s+/).map((w) => w[0]).join('').slice(0, 2) || '?').toUpperCase();
const heading = (cls: string) => `font-family:var(--fd);font-size:clamp(28px,4vw,48px);font-weight:700;letter-spacing:-.03em`;
void heading;

export type Visible = (id: string) => boolean;

/* ───────── LOADER / NAV ───────── */
export function loaderHTML(s: Json): string {
  return `<div id="loader" role="status" aria-label="Loading ${esc(s.brand_name)}">
  <div class="ld-stack">
    <div class="ld-tetris-wrap"><canvas id="tetris-canvas" aria-hidden="true"></canvas></div>
    <div class="ld-meta">
      <div class="ld-tagline" id="ld-tagline">Getting things ready…</div>
      <div class="ld-track"><div class="ld-fill" id="ldf"></div></div>
      <div class="ld-n" id="ldn">0%</div>
    </div>
  </div>
  <div class="ld-corner-logo"><span class="logo-cutout" aria-hidden="true"></span>${esc(s.logo_text)}</div>
  <div class="ld-corner-mark" aria-hidden="true"><span class="logo-cutout"></span></div>
</div>`;
}

export function navHTML(s: Json, vis: Visible, base = ''): string {
  const links: [string, string, string][] = [
    ['about', 'About', 'about'],
    ['projects', 'Work', 'projects'],
    ['skills', 'Skills', 'skills'],
    ['services', 'Services', 'services'],
    ['pricing', 'Pricing', 'pricing'],
    ['contact', 'Contact', 'contact'],
  ];
  const shown = links.filter(([, , sec]) => vis(sec));
  const li = shown.map(([id, label]) => `<li><a href="${base}#${id}">${label}</a></li>`).join('');
  const mli = shown.map(([id, label]) => `<a href="${base}#${id}">${label}</a>`).join('');
  return `<div class="mnav" id="mnav" role="dialog" aria-label="Mobile navigation" aria-hidden="true">${mli}</div>
<nav id="nav" aria-label="Main navigation">
  <div class="nav-i">
    <a href="${base || '/'}#hero" class="nav-logo" aria-label="${esc(s.brand_name)} — Home"><span class="logo-cutout" aria-hidden="true"></span><span>${esc(s.logo_text)}</span></a>
    <ul class="nav-links" role="list">${li}</ul>
    <div class="nav-r">
      <button id="tbtn" title="Switch theme" aria-label="Toggle light and dark mode">
        <svg id="tmoon" viewBox="0 0 24 24" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
        <svg id="tsun" viewBox="0 0 24 24" style="display:none" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      </button>
      <a href="${base}#contact" class="btn btn-ghost" style="padding:9px 20px;font-size:10px">Get in touch</a>
      <div class="hbg" id="hbg" role="button" tabindex="0" aria-expanded="false" aria-controls="mnav" aria-label="Open menu"><span></span><span></span><span></span></div>
    </div>
  </div>
</nav>`;
}

/* ───────── HERO / MARQUEE ───────── */
export function heroHTML(h: Json): string {
  const words: string[] = h.words?.length ? h.words : ['fast.'];
  const c1 = h.cta1 || {}, c2 = h.cta2 || {};
  const cards = (h.cards || []).slice(0, 3);
  const cls = ['h3d-card-a', 'h3d-card-b', 'h3d-card-c'];
  return `<section class="hero" id="hero" aria-labelledby="hero-heading">
  <div class="wrap" style="width:100%">
    <div class="hero-inner">
      <div id="main-content">
        <div class="hero-tag"><span class="eyebrow">${esc(h.eyebrow)}</span></div>
        <h1 class="hero-h1" id="hero-heading">${nl(h.line1)}<br>${nl(h.line2)}<br><span class="hero-swap" id="hw">${esc(words[0])}</span></h1>
        <p class="hero-sub">${nl(h.sub)}</p>
        <div class="hero-acts">
          <a href="${safeHref(c1.href)}" class="btn btn-fill btn-lg">${esc(c1.text)}</a>
          <a href="${safeHref(c2.href)}" class="btn btn-ghost btn-lg">${esc(c2.text)}</a>
        </div>
        <p class="hero-note">${esc(h.note)}</p>
        <div style="display:flex;align-items:center;gap:3px;margin-top:28px;opacity:.18">
          <div style="height:18px;width:12px;background:var(--text);border-radius:1px"></div><div style="height:18px;width:2px"></div>
          <div style="height:18px;width:12px;background:var(--text);border-radius:1px"></div><div style="height:18px;width:2px"></div>
          <div style="height:18px;width:12px;background:var(--text);border-radius:1px"></div><div style="height:18px;width:2px"></div>
          <div style="height:18px;width:12px;background:var(--text);border-radius:1px"></div>
          <div style="height:18px;width:80px;background:var(--text);border-radius:1px"></div><div style="height:18px;width:2px"></div>
          <div style="height:18px;width:12px;background:var(--text);border-radius:1px"></div>
        </div>
      </div>
      <div class="hero-3d-col" aria-hidden="true">
        <div class="pc" id="pc">
          <div class="pc-tilt" id="pc-tilt">
            <div class="pc-ring" aria-hidden="true"></div>
            <div class="pc-frame">
              ${h.photo
                ? `<img src="${esc(h.photo)}" alt="${esc(h.photo_caption)}" draggable="false" onerror="this.style.display='none'">`
                : `<div class="pc-ph">${esc(initials(h.photo_caption || 'KS Labib'))}</div>`}
              <div class="pc-shade" aria-hidden="true"></div>
              <div class="pc-glare" aria-hidden="true"></div>
              <div class="pc-chip">
                <div class="pc-who"><b>${esc(h.photo_caption)}</b><span>${esc(h.photo_sub)}</span></div>
                ${h.status ? `<span class="pc-status"><i></i>${esc(h.status)}</span>` : ''}
              </div>
            </div>
          </div>
        </div>
        ${cards.map((c: Json, i: number) => `<div class="h3d-card ${cls[i]}"><div class="h3d-card-n">${esc(c.n)}</div><div class="h3d-card-l">${esc(c.l)}</div></div>`).join('')}
        <div class="hero-3d-hint"><span class="hero-3d-dot"></span>${esc(h.hint)}</div>
      </div>
    </div>
  </div>
</section>`;
}

export function marqueeHTML(m: Json): string {
  const items: string[] = m.items || [];
  const set = (hide: boolean) => items.map((t) => `<div class="tech-mq-item"${hide ? ' aria-hidden="true"' : ''}><span class="tech-mq-pill">${esc(t)}</span></div>`).join('');
  return `<div class="tech-mq" aria-label="Tools I use"><div class="tech-mq-t">${set(false)}${set(true)}</div></div>`;
}

/* ───────── ABOUT ───────── */
const DECO = '<svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="20" y="28" width="160" height="120" rx="8" stroke="currentColor" stroke-width="1.5"/><line x1="20" y1="52" x2="180" y2="52" stroke="currentColor" stroke-width="1.5"/><circle cx="38" cy="40" r="5" stroke="currentColor" stroke-width="1.5"/><circle cx="56" cy="40" r="5" stroke="currentColor" stroke-width="1.5"/><circle cx="74" cy="40" r="5" stroke="currentColor" stroke-width="1.5"/><line x1="40" y1="76" x2="96" y2="76" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="40" y1="90" x2="140" y2="90" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/><line x1="40" y1="104" x2="116" y2="104" stroke="currentColor" stroke-width="1.2" stroke-dasharray="4 3"/></svg>';

export function aboutHTML(a: Json): string {
  const link = a.link || {};
  return `<section id="about" class="team-section" aria-labelledby="about-heading">
  <div class="wrap">
    <div class="team-eyebrow reveal"><span class="eyebrow">${esc(a.eyebrow)}</span></div>
    <h2 class="team-title reveal d1" id="about-heading">${nl(a.title)}</h2>
  </div>
  <div class="team-grid" style="grid-template-columns:1fr">
    <div class="tm-card tm-left reveal" style="border-right:none;padding-left:max(40px,calc((100% - 1200px)/2 + 40px));padding-right:max(40px,calc((100% - 1200px)/2 + 40px))" aria-labelledby="about-name">
      <div class="tm-num" aria-hidden="true">${esc(a.num)}</div>
      <div class="tm-inner">
        <div class="tm-name-row">
          <div class="tm-portrait">${a.photo
            ? `<img src="${esc(a.photo)}" alt="${esc(a.name)}" onerror="this.style.display='none'">`
            : `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-family:var(--fd);font-weight:700;font-size:28px;color:var(--text3)">${esc(initials(a.name))}</div>`}</div>
          <div class="tm-name-text"><div class="tm-role-tag">${esc(a.role)}</div><div class="tm-name" id="about-name">${esc(a.name)}<span>.</span></div></div>
        </div>
        <p class="tm-bio" style="max-width:720px">${nl(a.bio)}</p>
        <div class="tm-stats" aria-label="Stats">${(a.stats || []).map((s: Json) => `<div class="tm-stat"><span class="tm-stat-n">${esc(s.n)}</span><span class="tm-stat-l">${esc(s.l)}</span></div>`).join('')}</div>
        <div class="tm-tools" aria-label="Main tools">${(a.tools || []).map((t: string) => `<span class="tm-tool">${esc(t)}</span>`).join('')}</div>
        ${link.href ? `<a class="btn btn-ghost tm-portfolio" href="${safeHref(link.href)}" target="_blank" rel="noopener" style="display:inline-flex">${esc(link.text || 'Link ↗')}</a>` : ''}
      </div>
      <div class="tm-deco" aria-hidden="true">${DECO}</div>
    </div>
  </div>
</section>`;
}

/* ───────── SERVICES ───────── */
export function servicesHTML(sv: Json): string {
  const items: Json[] = sv.items || [];
  const tabs = items.map((it, i) => `<button class="svc-tab${i === 0 ? ' active' : ''}" data-svc="${esc(it.id || 's' + i)}" role="tab" aria-selected="${i === 0}" aria-controls="svc-panel-${esc(it.id || 's' + i)}">
        <span class="svc-tab-num">${pad2(i + 1)}</span><span class="svc-tab-label">${nl(it.label)}</span><span class="svc-tab-arrow">↗</span><div class="svc-tab-bar"></div></button>`).join('');
  const panels = items.map((it, i) => {
    const id = esc(it.id || 's' + i);
    const list: string[] = it.list || [];
    return `<div class="svc-panel${i === 0 ? ' active' : ''}" id="svc-panel-${id}" role="tabpanel" data-panel="${id}">
      <div class="wrap"><div class="svc-inner">
        <div class="svc-text">
          <div class="svc-eyebrow"><span class="eyebrow">${esc(it.eyebrow)}</span></div>
          <h2 class="svc-title"${i === 0 ? ' id="svc-switch-heading"' : ''}>${nl(it.title)}</h2>
          <p class="svc-desc">${nl(it.desc)}</p>
          <a href="#contact" class="btn btn-ghost">${esc(it.cta || 'Get a quote →')}</a>
        </div>
        <div class="svc-card">
          <div class="svc-card-header"><span class="eyebrow">${esc(it.cardTitle)}</span><span class="svc-card-count">${pad2(list.length)} Deliverables</span></div>
          <ul class="svc-list" aria-label="${esc(it.cardTitle)}">${list.map((t, k) => `<li><span class="svc-item-num">${pad2(k + 1)}</span><span class="svc-item-text">${esc(t)}</span><span class="svc-item-check" aria-hidden="true">${CHECK}</span></li>`).join('')}</ul>
        </div>
      </div></div>
    </div>`;
  }).join('');
  return `<section id="services" class="svc-switcher" aria-labelledby="svc-switch-heading">
  <div class="svc-tabs-wrap"><div class="svc-tabs" role="tablist" aria-label="Service categories">${tabs}</div></div>
  <div class="svc-panels">${panels}</div>
</section>`;
}

/* ───────── PROJECTS ───────── */
export interface Project {
  id: string; slug: string; title: string; type?: string; year?: string; client?: string; url?: string; img?: string;
  description?: string; tags?: string[]; status?: string; gallery?: string; challenge?: string; approach?: string;
  outcome?: string; testimonial?: string; testimonial_author?: string; featured?: boolean; sort_order?: number; created_at?: string;
}

export function projectCardHTML(p: Project): string {
  const href = `/projects/${encodeURIComponent(p.slug || p.id)}`;
  const letter = esc((p.title || '?')[0].toUpperCase());
  return `<a href="${href}" class="proj-card reveal in" data-type="${esc(p.type || '')}">
    <div class="proj-card-thumb">${p.img ? `<img src="${esc(p.img)}" alt="${esc(p.title)}" class="proj-card-thumb-img" loading="lazy">` : `<div class="proj-card-letter">${letter}</div>`}
      <div class="proj-card-badge"><span>${esc(p.type || '')}</span></div></div>
    <div class="proj-card-body">
      <div class="proj-card-title">${esc(p.title)}</div>
      ${p.description ? `<div class="proj-card-desc">${esc(p.description.split('\n')[0])}</div>` : ''}
      <div class="proj-card-foot"><div class="proj-card-tags">${(p.tags || []).slice(0, 3).map((t) => `<span class="proj-card-tag">${esc(t)}</span>`).join('')}</div><span class="proj-card-link">View Project →</span></div>
      ${p.client ? `<div class="proj-card-client">${esc(p.client)}${p.year ? ' · ' + esc(p.year) : ''}</div>` : ''}
    </div></a>`;
}

export function projectsHTML(pc: Json, projects: Project[], limit: number): string {
  const shown = projects.slice(0, limit);
  const types = Array.from(new Set(shown.map((p) => p.type).filter(Boolean))) as string[];
  const remaining = Math.max(0, projects.length - shown.length);
  return `<section id="projects" class="proj-section" aria-labelledby="proj-heading">
  <div class="wrap">
    <div class="proj-hd">
      <div>
        <div class="eyebrow reveal" style="margin-bottom:12px">${esc(pc.eyebrow)}</div>
        <h2 class="reveal d1" style="font-family:var(--fd);font-size:clamp(28px,4vw,48px);font-weight:700;letter-spacing:-.03em" id="proj-heading">${nl(pc.title)}</h2>
      </div>
      ${types.length > 1 ? `<div class="proj-filters reveal d2" role="group" aria-label="Filter by type"><button class="pf on" data-f="all" aria-pressed="true">All</button>${types.map((t) => `<button class="pf" data-f="${esc(t)}" aria-pressed="false">${esc(t)}</button>`).join('')}</div>` : ''}
    </div>
    <div class="proj-grid" id="pgrid">${shown.length ? shown.map(projectCardHTML).join('') : `<div class="proj-empty reveal in">${esc(pc.empty)}</div>`}</div>
    ${projects.length ? `<div style="display:flex;align-items:center;justify-content:space-between;margin-top:48px;padding-top:32px;border-top:1px solid var(--border);gap:20px;flex-wrap:wrap;">
      <div><p style="font-family:var(--fd);font-size:clamp(18px,2.5vw,26px);font-weight:700;letter-spacing:-.02em;color:var(--text);margin-bottom:4px;">${esc(pc.footer_title)}</p>
      ${remaining ? `<p style="font-size:12px;color:var(--text3);letter-spacing:.04em;">${remaining} more project${remaining > 1 ? 's' : ''} in the full archive</p>` : ''}</div>
      <a href="/projects" class="btn btn-fill" style="white-space:nowrap;">${esc(pc.footer_btn)}<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></a>
    </div>` : ''}
  </div>
</section>`;
}

/* ───────── STATS / SKILLS / EXPERIENCE / PROCESS ───────── */
export function statsHTML(s: Json): string {
  return `<section class="stats" aria-label="Statistics"><div class="stats-shimmer" aria-hidden="true"></div><div class="stats-grid">
${(s.items || []).map((it: Json, i: number) => `<div class="stat" data-target="${esc(it.n)}" data-suffix="${esc(it.suffix)}"${it.decimal ? ' data-decimal="true"' : ''}>
  <div class="stat-icon" aria-hidden="true">${STAT_ICONS[i % 4]}</div>
  <span class="stat-n"><span class="stat-num">0</span><sup>${esc(it.suffix)}</sup></span><span class="stat-l">${esc(it.l)}</span></div>`).join('')}
</div></section>`;
}

export function skillsHTML(k: Json): string {
  return `<section id="skills" class="sk-section" aria-labelledby="sk-heading"><div class="wrap">
  <div class="eyebrow reveal" style="margin-bottom:12px">${esc(k.eyebrow)}</div>
  <h2 class="reveal d1 sec-h" id="sk-heading">${nl(k.title)}</h2>
  <div class="sk-grid">${(k.groups || []).map((g: Json, i: number) => `<div class="sk-card reveal ${DELAYS[i % 4]}"><div class="sk-card-t"><span>${pad2(i + 1)}</span>${esc(g.title)}</div><div class="tm-tools">${(g.items || []).map((t: string) => `<span class="tm-tool">${esc(t)}</span>`).join('')}</div></div>`).join('')}</div>
</div></section>`;
}

export function experienceHTML(x: Json): string {
  return `<section id="experience" class="xp-section" aria-labelledby="xp-heading"><div class="wrap">
  <div class="eyebrow reveal" style="margin-bottom:12px">${esc(x.eyebrow)}</div>
  <h2 class="reveal d1 sec-h" id="xp-heading">${nl(x.title)}</h2>
  <div class="xp-list">${(x.items || []).map((it: Json, i: number) => `<div class="xp-item reveal ${DELAYS[i % 3]}"><div class="xp-period">${esc(it.period)}</div><div class="xp-dot" aria-hidden="true"></div><div class="xp-body"><h3 class="xp-role">${esc(it.role)}</h3>${it.org ? `<div class="xp-org">${esc(it.org)}</div>` : ''}${it.desc ? `<p class="xp-desc">${nl(it.desc)}</p>` : ''}</div></div>`).join('')}</div>
</div></section>`;
}

export function processHTML(p: Json): string {
  const steps: Json[] = p.steps || [];
  return `<section id="process" class="proc" aria-labelledby="proc-heading"><div class="wrap">
  <div class="eyebrow reveal" style="margin-bottom:12px">${esc(p.eyebrow)}</div>
  <h2 class="reveal d1 sec-h" id="proc-heading">${nl(p.title)}</h2>
  <div class="proc-grid">${steps.map((s, i) => `<div class="proc-step reveal ${DELAYS[i % 4]}">${i < steps.length - 1 ? '<div class="proc-connector" aria-hidden="true"></div>' : ''}<div class="proc-icon" aria-hidden="true">${PROC_ICONS[i % 4]}</div><div class="proc-n" aria-hidden="true">${pad2(i + 1)}</div><h3 class="proc-t">${esc(s.t)}</h3><p class="proc-d">${nl(s.d)}</p></div>`).join('')}</div>
</div></section>`;
}

/* ───────── REVIEWS / FAQ / PRICING ───────── */
const star = (on: boolean) => `<svg viewBox="0 0 24 24" class="rv-star${on ? ' on' : ''}" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

export function reviewsHTML(r: Json): string {
  const items: Json[] = r.items || [];
  const cta = r.cta || {};
  if (!items.length) {
    return `<section class="testi" id="reviews" aria-labelledby="testi-heading">
  <div class="wrap" style="padding:0 10px;text-align:center;max-width:640px;margin:0 auto">
    <div class="eyebrow reveal" style="justify-content:center;margin-bottom:20px">${esc(r.eyebrow)}</div>
    <h2 class="reveal d1" style="font-family:var(--fd);font-size:clamp(28px,4vw,48px);font-weight:700;letter-spacing:-.03em;color:var(--text);margin-bottom:20px" id="testi-heading">${nl(r.empty_title)}</h2>
    <p class="reveal d2" style="font-size:15px;color:var(--text2);line-height:1.9;margin-bottom:36px">${nl(r.empty_desc)}</p>
    <a href="${safeHref(cta.href)}" class="btn btn-ghost reveal d2" style="margin:0 auto">${esc(cta.text)}</a>
  </div></section>`;
  }
  return `<section class="testi" id="reviews" aria-labelledby="testi-heading"><div class="wrap">
  <div class="eyebrow reveal" style="margin-bottom:12px">${esc(r.eyebrow)}</div>
  <h2 class="reveal d1 sec-h" id="testi-heading">${nl(r.title)}</h2>
  <div class="rv-grid">${items.map((it, i) => {
    const rating = Math.max(0, Math.min(5, Number(it.rating ?? 5)));
    return `<figure class="rv-card reveal ${DELAYS[i % 3]}">
      <div class="rv-stars" aria-label="${rating} out of 5 stars">${[1, 2, 3, 4, 5].map((n) => star(n <= rating)).join('')}</div>
      <blockquote class="rv-quote">${nl(it.quote)}</blockquote>
      <figcaption class="rv-by"><span class="rv-avatar">${it.photo ? `<img src="${esc(it.photo)}" alt="${esc(it.name)}" loading="lazy" onerror="this.style.display='none'">` : esc(initials(it.name))}</span><span class="rv-who"><b>${esc(it.name)}</b>${it.role ? `<i>${esc(it.role)}</i>` : ''}</span></figcaption>
    </figure>`;
  }).join('')}</div>
  <div style="text-align:center;margin-top:36px"><a href="${safeHref(cta.href)}" class="btn btn-ghost reveal">${esc(cta.text)}</a></div>
</div></section>`;
}

export function faqHTML(f: Json): string {
  return `<section id="faq" class="faq-section" aria-labelledby="faq-heading"><div class="wrap">
  <div class="faq-head"><div class="eyebrow reveal" style="margin-bottom:12px">${esc(f.eyebrow)}</div><h2 class="reveal d1" id="faq-heading">${nl(f.title)}</h2></div>
  <div class="faq-grid" id="faq-grid">${(f.items || []).map((it: Json, i: number) => `<div class="faq-item reveal ${DELAYS[i % 3 === 0 ? 0 : i % 3]}"><button class="faq-q" aria-expanded="false"><span>${esc(it.q)}</span><div class="faq-icon">${PLUS}</div></button><div class="faq-a"><div class="faq-a-inner">${nl(it.a)}</div></div></div>`).join('')}</div>
</div></section>`;
}

export function pricingHTML(p: Json): string {
  const plans: Json[] = p.plans || [];
  return `<section id="pricing" class="pricing-section" aria-labelledby="pricing-heading"><div class="wrap pr-wrap">
  <div class="pr-head">
    <div class="pr-head-left"><div class="eyebrow reveal" style="margin-bottom:14px">${esc(p.eyebrow)}</div><h2 class="reveal d1" id="pricing-heading">${nl(p.title)}</h2><p class="reveal d2">${nl(p.desc)}</p></div>
    <div class="pr-toggle-wrap reveal d1">
      <div class="pr-toggle" role="group" aria-label="Billing type"><button class="pr-toggle-btn on" data-billing="project">${esc(p.toggle_project)}</button><button class="pr-toggle-btn" data-billing="retainer">${esc(p.toggle_monthly)}</button></div>
      <div class="pr-toggle-note">${esc(p.toggle_note)} <span>${esc(p.toggle_save)}</span></div>
    </div>
  </div>
  <div class="pr-grid reveal" data-note-project="${esc(p.note_project)}" data-note-retainer="${esc(p.note_monthly)}">${plans.map((pl, i) => `
    <div class="pr-card${pl.featured ? ' featured' : ''}">
      <div class="pr-card-top">${pl.featured ? `<div class="pr-featured-badge">${esc(pl.badge || 'Most Popular')}</div>` : ''}<div class="pr-type">${esc(pl.type)}</div><div class="pr-name">${esc(pl.name)}</div><p class="pr-desc">${nl(pl.desc)}</p></div>
      <div class="pr-price-wrap"><div class="pr-price" id="price-${i}"><sup>$</sup><span data-project="${esc(pl.project)}" data-retainer="${esc(pl.retainer ?? pl.project)}">${esc(pl.project)}</span></div><div class="pr-price-note" id="note-${i}">${esc(p.note_project)}</div></div>
      <ul class="pr-features">${(pl.features || []).map((f: string) => `<li>${esc(f)}</li>`).join('')}</ul>
      <a href="#contact" class="pr-cta ${pl.featured ? 'pr-cta-fill' : 'pr-cta-ghost'}">${esc(p.cta)}${ARROW}</a>
    </div>`).join('')}
  </div>
  <div class="pr-footnote reveal">${esc(p.footnote)}</div>
</div></section>`;
}

/* ───────── CONTACT / TICKER / FOOTER ───────── */
const slugify = (s: string) => String(s).toLowerCase().replace(/&/g, 'and').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export function contactHTML(c: Json, s: Json): string {
  const wa = String(s.whatsapp || '').replace(/\D/g, '');
  return `<section id="contact" class="cta" aria-labelledby="cta-heading">
  <div class="cta-glow" aria-hidden="true"></div>
  <div class="cta-bg" aria-hidden="true">${esc(String(s.brand_name || '').toUpperCase())}</div>
  <div class="cta-inner wrap">
    <div class="cta-brand reveal" aria-hidden="true"><span class="logo-cutout"></span><span>${esc(s.logo_text)}</span></div>
    <div class="eyebrow reveal" style="justify-content:center;margin-bottom:16px">${esc(c.eyebrow)}</div>
    <h2 class="cta-h reveal" id="cta-heading">${nl(c.title)}</h2>
    <p class="cta-sub reveal d1">${nl(c.sub)}</p>
    <div class="cta-form-wrap reveal d1">
      <div id="cf-form-state">
        <form class="cta-form" id="cta-form" novalidate>
          <div class="cf-row">
            <div class="cf-field"><label class="cf-label" for="cf-name">Your Name *</label><input class="cf-input" id="cf-name" type="text" placeholder="e.g. Rahim Ahmed" required autocomplete="name"></div>
            <div class="cf-field"><label class="cf-label" for="cf-type">Project Type *</label><select class="cf-select" id="cf-type" required><option value="">Select a service…</option>${(c.types || []).map((t: string) => `<option value="${esc(slugify(t))}">${esc(t)}</option>`).join('')}</select></div>
          </div>
          <div class="cf-field"><label class="cf-label" for="cf-contact">Your Email or WhatsApp *</label><input class="cf-input" id="cf-contact" type="text" placeholder="you@example.com or +8801XXXXXXXXX" required autocomplete="email"></div>
          <div class="cf-field"><label class="cf-label" for="cf-budget">Budget Range</label><select class="cf-select" id="cf-budget"><option value="">Select a range…</option>${(c.budgets || []).map((b: string) => `<option value="${esc(b)}">${esc(b)}</option>`).join('')}</select></div>
          <div class="cf-field"><label class="cf-label" for="cf-msg">Tell me about your project *</label><textarea class="cf-textarea" id="cf-msg" placeholder="A rough idea is enough — what are you trying to achieve?" required></textarea></div>
          <input type="text" id="cf-hp" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
          <div class="cf-field" style="flex-direction:row;align-items:flex-start;gap:12px">
            <input type="checkbox" id="cf-consent" required style="width:16px;height:16px;margin-top:3px;flex-shrink:0;accent-color:var(--inv);cursor:pointer">
            <label for="cf-consent" style="font-size:12px;color:rgba(255,255,255,.4);line-height:1.7;cursor:pointer;text-transform:none;letter-spacing:0">${esc(c.consent)} <a href="/privacy" style="color:rgba(255,255,255,.6);text-decoration:underline;text-underline-offset:3px">Privacy policy →</a></label>
          </div>
          <div id="cf-error" role="alert" style="display:none;margin-bottom:12px;padding:10px 14px;border:1px solid rgba(255,107,107,.5);border-radius:8px;font-size:13px;color:#ff8a8a;line-height:1.6"></div>
          <button class="cf-submit" id="cf-submit" type="submit"><span id="cf-btn-label">Send Message</span><svg id="cf-btn-icon" viewBox="0 0 24 24"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg></button>
        </form>
      </div>
      <div class="cf-success" id="cf-success"><div class="cf-success-icon"><svg viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg></div><h3>${esc(c.success_title)}</h3><p>${nl(c.success_text)}</p></div>
      <div class="cta-divider"><div class="cta-divider-line"></div><span>or reach out directly</span><div class="cta-divider-line"></div></div>
      <div class="cta-alt-links">
        <a href="mailto:${esc(s.email)}" class="cta-alt-link"><svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg><span>${esc(s.email)}</span></a>
        ${wa ? `<a href="https://wa.me/${wa}" class="cta-alt-link" target="_blank" rel="noopener noreferrer"><svg viewBox="0 0 24 24"><path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/></svg>WhatsApp</a>` : ''}
      </div>
    </div>
  </div>
</section>`;
}

export function tickerHTML(t: Json): string {
  const items: string[] = t.items || [];
  const set = (hide: boolean) => items.map((x) => `<div class="mq-i"${hide ? ' aria-hidden="true"' : ''}><span class="mq-dot"></span>${esc(x)}</div>`).join('');
  return `<div class="mq" aria-label="Capabilities"><div class="mq-t">${set(false)}${set(true)}</div></div>`;
}

export function footerHTML(s: Json, services: Json, vis: Visible): string {
  const wa = String(s.whatsapp || '').replace(/\D/g, '');
  const social = Object.keys(SOCIAL).filter((k) => s[k]).map((k) => `<a href="${safeHref(s[k])}" target="_blank" rel="noopener noreferrer" class="f-soc" aria-label="${esc(s.brand_name)} on ${SOCIAL[k].label}">${SOCIAL[k].svg}</a>`).join('');
  const svcLinks = (services?.items || []).map((it: Json) => `<li><a href="#services">${esc(String(it.label || '').replace(/\n/g, ' '))}</a></li>`).join('');
  return `<footer><div class="wrap">
    <div class="f-top">
      <div class="f-brand-col">
        <a href="#hero" class="f-logo"><span class="logo-cutout" aria-hidden="true"></span><span>${esc(s.logo_text)}</span></a>
        <div class="f-tag">${nl(s.footer_note)}</div>
        <div class="f-status"><span class="f-status-dot" aria-hidden="true"></span><span>${esc(s.availability)}</span></div>
      </div>
      <div class="f-social-col"><div class="f-social-label">Find me online</div>
        <div class="f-social-icons">${social}<a href="mailto:${esc(s.email)}" class="f-soc" aria-label="Email ${esc(s.brand_name)}">${MAIL_ICON}</a></div></div>
    </div>
    <div class="fg">
      <div><div class="fct">Services</div><ul class="fl" role="list">${svcLinks}</ul></div>
      <div><div class="fct">Portfolio</div><ul class="fl" role="list">${vis('projects') ? '<li><a href="#projects">My Work</a></li>' : ''}${vis('about') ? '<li><a href="#about">About Me</a></li>' : ''}${vis('pricing') ? '<li><a href="#pricing">Pricing</a></li>' : ''}<li><a href="#contact">Hire Me</a></li></ul></div>
      <div><div class="fct">Legal</div><ul class="fl" role="list"><li><a href="/privacy">Privacy Policy</a></li></ul></div>
      <div><div class="fct">Contact</div><ul class="fl" role="list"><li><a href="mailto:${esc(s.email)}"><span>${esc(s.email)}</span></a></li>${wa ? `<li><a href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer">WhatsApp</a></li>` : ''}${s.phone ? `<li><a href="tel:${esc(s.phone)}">${esc(s.phone)}</a></li>` : ''}</ul></div>
    </div>
    <div class="fbot">
      <div style="display:flex;align-items:center;gap:18px;flex-wrap:wrap">
        <span>© <span id="footer-yr">${new Date().getFullYear()}</span> ${esc(s.brand_name)}. All rights reserved.</span>
        <a href="/admin" class="f-admin-link" aria-label="Admin" title="Admin"><svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg></a>
      </div>
      <div class="fbot-r"><span class="fbot-tagline">${esc(s.footer_tagline)}</span></div>
    </div>
  </div></footer>`;
}

export function floatingHTML(s: Json): string {
  const wa = String(s.whatsapp || '').replace(/\D/g, '');
  return `<nav id="side-dots" aria-label="Quick navigation" aria-hidden="true"></nav>
${wa ? `<a id="wa-btn" href="https://wa.me/${wa}" target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp" style="position:fixed;bottom:138px;right:26px;z-index:700;width:40px;height:40px;border-radius:50%;background:#25D366;display:flex;align-items:center;justify-content:center;box-shadow:0 4px 20px rgba(37,211,102,.4);opacity:0;transform:translateY(12px);transition:opacity .3s,transform .3s"><svg viewBox="0 0 24 24" style="width:20px;height:20px;fill:#fff" xmlns="http://www.w3.org/2000/svg"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg></a>` : ''}
<a id="fab" href="#contact" aria-label="Hire me">${ARROW}<span>Hire me</span></a>
<button id="btt" aria-label="Back to top"><svg viewBox="0 0 24 24" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg></button>
<div id="toast" role="status" aria-live="polite"></div>`;
}
