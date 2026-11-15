import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProject, getProjects, getSite } from '@/lib/content';
import Html from '@/components/Html';
import LegacyInit from '@/components/LegacyInit';
import * as T from '@/lib/templates';
import '../detail.css';

export const revalidate = 60;
type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = await getProject(decodeURIComponent(slug));
  if (!p) return { title: 'Project not found' };
  const d = (p.description || '').split('\n')[0].slice(0, 160);
  return { title: p.title, description: d, openGraph: { title: p.title, description: d, images: p.img ? [p.img] : undefined } };
}

const cap = (s?: string) => (s ? s.charAt(0).toUpperCase() + s.slice(1) : '');
const EXT = '<svg viewBox="0 0 24 24" style="width:12px;height:12px;stroke:currentColor;fill:none;stroke-width:2;stroke-linecap:round;stroke-linejoin:round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>';
const cell = (t: string, h: string, last = false) => `<div style="padding:28px 28px 32px;${last ? '' : 'border-right:1px solid var(--border);'}"><div style="font-family:var(--fm);font-size:9px;font-weight:700;letter-spacing:.16em;text-transform:uppercase;color:var(--text3);margin-bottom:12px;display:flex;align-items:center;gap:6px"><span style="opacity:.4">//</span> ${t}</div><p style="font-size:14px;color:var(--text2);line-height:1.9">${T.nl(h)}</p></div>`;

export default async function ProjectPage({ params }: Props) {
  const { slug } = await params;
  const p = await getProject(decodeURIComponent(slug));
  if (!p) notFound();
  const { settings: s, hidden, sections } = await getSite();
  const vis: T.Visible = (id) => !hidden[id];
  const all = await getProjects();
  const related = all.filter((x) => x.id !== p.id && p.type && x.type === p.type).slice(0, 3);
  const lines = (p.description || '').split('\n').filter(Boolean);
  const lead = lines[0] || '';
  const body = lines.slice(1).map((l) => `<p>${T.esc(l)}</p>`).join('');
  const tags = p.tags || [];
  const gallery = (p.gallery || '').split(',').map((x) => x.trim()).filter(Boolean);
  const letter = T.esc((p.title || '?')[0].toUpperCase());
  const stMap: Record<string, [string, string]> = { done: ['#4ade80', 'Completed'], 'in-progress': ['#fb923c', 'In Progress'], 'on-hold': ['#707070', 'On Hold'] };
  const [sc, sl] = stMap[p.status || 'done'] || ['#707070', p.status || '—'];
  const cells = [
    { l: 'Category', v: T.esc(cap(p.type || '—')) },
    ...(p.client ? [{ l: 'Client', v: T.esc(p.client) }] : []),
    ...(p.year ? [{ l: 'Year', v: T.esc(p.year) }] : []),
    { l: 'Status', v: `<span class="ph-status-dot" style="background:${sc}"></span>${T.esc(sl)}` },
  ];
  const liveBtn = (cls: string, label: string) => p.url ? `<a href="${T.esc(p.url)}" target="_blank" rel="noopener noreferrer" class="${cls}">${label}${EXT}</a>` : '';
  const html = `<div class="page-trans show" id="page-trans"></div><div id="prog"></div>${T.navHTML(s, vis, '/')}
<section class="proj-hero" id="proj-hero"><div class="wrap ph-inner">
  <a href="/projects" class="ph-back"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>All work</a>
  <div class="ph-split">
    <div class="ph-left">
      <div class="ph-meta"><span class="ph-badge">${T.esc(cap(p.type || 'Project'))}</span>${p.year ? `<span class="ph-year">${T.esc(p.year)}</span>` : ''}</div>
      <h1 class="ph-title" style="margin-bottom:12px">${T.esc(p.title)}</h1>
      ${p.client ? `<div class="ph-client">${T.esc(p.client)}</div>` : ''}
      <div class="ph-actions">${liveBtn('btn btn-fill" style="padding:12px 26px;font-size:11px', 'View Live ')}<a href="/#projects" class="btn btn-ghost" style="padding:12px 26px;font-size:11px">← All Projects</a></div>
    </div>
    <div class="ph-right"><div class="ph-deco-num">${letter}</div><div class="ph-img-frame">${p.img ? `<img src="${T.esc(p.img)}" alt="${T.esc(p.title)}">` : `<div class="ph-img-letter">${letter}</div>`}</div></div>
  </div>
</div></section>
<section class="proj-content"><div class="wrap">
  <div class="ph-meta-strip">${cells.map((c) => `<div class="ph-meta-cell"><div class="ph-meta-cell-label">${c.l}</div><div class="ph-meta-cell-val">${c.v}</div></div>`).join('')}</div>
  ${(p.challenge || p.approach || p.outcome) ? `<div style="display:grid;grid-template-columns:repeat(3,1fr);gap:0;border:1px solid var(--border);border-radius:12px;overflow:hidden;margin-bottom:52px">${p.challenge ? cell('The Challenge', p.challenge, !p.approach && !p.outcome) : ''}${p.approach ? cell('My Approach', p.approach, !p.outcome) : ''}${p.outcome ? cell('The Outcome', p.outcome, true) : ''}</div>` : ''}
  ${lead ? `<div class="ph-desc-wrap"><div class="ph-desc-lead">${T.esc(lead)}</div>${body ? `<div class="ph-desc-body">${body}</div>` : ''}</div>` : ''}
  ${gallery.length ? `<div style="display:grid;grid-template-columns:repeat(${gallery.length === 1 ? 1 : 2},1fr);gap:12px;margin-bottom:52px">${gallery.map((g, i) => `<div style="border-radius:10px;overflow:hidden;border:1px solid var(--border);aspect-ratio:16/9"><img src="${T.esc(g)}" alt="Project image ${i + 1}" style="width:100%;height:100%;object-fit:cover;display:block" loading="lazy"></div>`).join('')}</div>` : ''}
  ${p.testimonial ? `<div style="background:var(--bg2);border:1px solid var(--border2);border-radius:12px;padding:36px 40px;margin-bottom:52px"><div style="font-family:var(--fd);font-size:clamp(16px,2vw,22px);font-style:italic;color:var(--text);line-height:1.7;margin-bottom:20px;letter-spacing:-.02em">"${T.esc(p.testimonial)}"</div>${p.testimonial_author ? `<div style="font-family:var(--fm);font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:var(--text3)">— ${T.esc(p.testimonial_author)}</div>` : ''}</div>` : ''}
  ${tags.length ? `<div class="ph-tags-wrap"><div class="ph-tags-eyebrow">Stack &amp; Tags</div><div class="ph-tags-grid">${tags.map((t) => `<span class="ph-big-tag">${T.esc(t)}</span>`).join('')}</div></div>` : ''}
  ${p.url ? `<div class="ph-live-card"><div><h3>See it live</h3><p>This project is published and ready to explore.</p></div>${liveBtn('btn btn-fill" style="padding:13px 26px;flex-shrink:0', 'Visit Project ')}</div>` : ''}
</div></section>
<section class="proj-cta"><div class="wrap"><div class="proj-cta-eyebrow">work with me</div><h2>Want something<br>like this?</h2><p>I'm taking on new projects. Let's talk about what you need.</p>
<div class="proj-cta-btns"><a href="/#contact" class="btn btn-fill btn-lg">Start a Project</a><a href="/projects" class="btn btn-ghost btn-lg">Browse All Work</a></div></div></section>
${related.length ? `<section class="related-section"><div class="wrap"><div class="related-title">More projects like this</div><div class="related-grid">${related.map(T.projectCardHTML).join('')}</div></div></section>` : ''}
${T.footerHTML(s, sections.services, vis)}`;
  return (<><Html html={html} /><LegacyInit mode="sub" /></>);
}
