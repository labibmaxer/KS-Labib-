import type { Metadata } from 'next';
import { getSite } from '@/lib/content';
import Html from '@/components/Html';
import LegacyInit from '@/components/LegacyInit';
import * as T from '@/lib/templates';
import '../archive.css';

export const revalidate = 60;
export const metadata: Metadata = { title: 'All Work', description: 'Every project in the archive.' };

export default async function Archive() {
  const { settings: s, hidden, sections, projects } = await getSite();
  const vis: T.Visible = (id) => !hidden[id];
  const types = Array.from(new Set(projects.map((p) => p.type).filter(Boolean))) as string[];
  const html = `<div class="page-trans show" id="page-trans"></div><div id="prog"></div>${T.navHTML(s, vis, '/')}
<header class="page-header"><div class="wrap">
  <a href="/#projects" class="back-link"><svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"/></svg>Back to home</a>
  <div class="page-header-eyebrow">Full archive</div><h1>All my work.</h1>
  <p class="page-header-sub">Every project I've shipped — web applications, custom e-commerce stores and digital experiences. Filter by type or browse the full archive.</p>
  <div class="page-header-meta"><div class="page-header-count"><span id="total-count">${projects.length}</span> projects total</div></div>
</div></header>
<section class="proj-archive"><div class="wrap">
  ${types.length > 1 ? `<div class="proj-archive-top" role="group" aria-label="Filter projects"><button class="pf on" data-f="all" aria-pressed="true">All</button>${types.map((t) => `<button class="pf" data-f="${T.esc(t)}" aria-pressed="false">${T.esc(t)}</button>`).join('')}</div>` : ''}
  <div class="proj-grid" id="pgrid">${projects.length ? projects.map(T.projectCardHTML).join('') : `<div class="proj-empty">${T.esc(sections.projects.empty)}</div>`}</div>
</div></section>
${T.footerHTML(s, sections.services, vis)}`;
  return (<><Html html={html} /><LegacyInit mode="sub" /></>);
}
