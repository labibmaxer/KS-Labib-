import type { Metadata } from 'next';
import { getSite } from '@/lib/content';
import Html from '@/components/Html';
import LegacyInit from '@/components/LegacyInit';
import * as T from '@/lib/templates';
import '../archive.css';

export const revalidate = 60;
export const metadata: Metadata = { title: 'Privacy Policy' };

export default async function Privacy() {
  const { settings: s, hidden, sections } = await getSite();
  const vis: T.Visible = (id) => !hidden[id];
  const html = `<div class="page-trans show" id="page-trans"></div><div id="prog"></div>${T.navHTML(s, vis, '/')}
<header class="page-header"><div class="wrap"><div class="page-header-eyebrow">Legal</div><h1>Privacy Policy</h1><p class="page-header-sub">How ${T.esc(s.brand_name)} handles the details you share through this website.</p></div></header>
<section class="proj-archive"><div class="wrap" style="max-width:760px"><div class="ph-desc-body" style="font-size:15px;line-height:1.95;color:var(--text2)">
<p><b style="color:var(--text)">What I collect.</b> When you use the contact form I store your name, project type, budget, contact detail and message so I can reply. The site also records anonymous page-visit data (page, referrer and browser type) once per session.</p>
<p><b style="color:var(--text)">How it's used.</b> Only to respond to your enquiry and to understand how the site is used. Your details are never sold or shared with third parties, apart from the infrastructure providers that run this site (hosting, database and email delivery).</p>
<p><b style="color:var(--text)">Retention &amp; deletion.</b> Enquiries are kept only as long as needed to handle the conversation. To have your details removed, email <a href="mailto:${T.esc(s.email)}" style="color:var(--text);text-decoration:underline">${T.esc(s.email)}</a>.</p>
<p><b style="color:var(--text)">Cookies.</b> No tracking cookies are used. Your light/dark theme choice is stored locally in your browser.</p>
</div></div></section>
${T.footerHTML(s, sections.services, vis)}`;
  return (<><Html html={html} /><LegacyInit mode="sub" track={false} /></>);
}
