 import { getSite } from '@/lib/content';
import Html from '@/components/Html';
import LegacyInit from '@/components/LegacyInit';
import * as T from '@/lib/templates';

export const revalidate = 60;

export default async function Home() {
  const { settings: s, sections: sec, hidden, projects } = await getSite();
  const vis: T.Visible = (id) => !hidden[id];
  const limit = Math.max(1, Number(s.projects_limit) || 6);
  const person = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: s.brand_name,
    jobTitle: 'Full-Stack Developer',
    url: s.site_url,
    email: s.email,
    sameAs: ['instagram', 'twitter', 'facebook', 'github', 'linkedin'].map((k) => s[k]).filter(Boolean),
  };
  const parts: [string, () => string][] = [
    ['hero', () => T.heroHTML(sec.hero)],
    ['marquee', () => T.marqueeHTML(sec.marquee)],
    ['about', () => T.aboutHTML(sec.about)],
    ['projects', () => T.projectsHTML(sec.projects, projects, limit)],
    ['services', () => T.servicesHTML(sec.services)],
    ['stats', () => T.statsHTML(sec.stats)],
    ['skills', () => T.skillsHTML(sec.skills)],
    ['experience', () => T.experienceHTML(sec.experience)],
    ['process', () => T.processHTML(sec.process)],
    ['reviews', () => T.reviewsHTML(sec.reviews)],
    ['faq', () => T.faqHTML(sec.faq)],
    ['pricing', () => T.pricingHTML(sec.pricing)],
    ['contact', () => T.contactHTML(sec.contact, s)],
    ['ticker', () => T.tickerHTML(sec.ticker)],
  ];
  const body = parts.filter(([id]) => vis(id)).map(([, f]) => f()).join('\n');
  const html = [
    '<div class="page-trans" id="page-trans"></div>',
    '<div class="cur cur-dot" id="cur-dot" style="display:none"></div><div class="cur cur-ring" id="cur-ring" style="display:none"></div>',
    '<div id="theme-flash" aria-hidden="true"></div>',
    T.loaderHTML(s),
    '<div id="prog" role="progressbar" aria-label="Page scroll progress" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>',
    T.navHTML(s, vis),
    body,
    T.footerHTML(s, sec.services, vis),
    T.floatingHTML(s),
  ].join('\n');
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(person) }} />
      <Html html={html} />
      <LegacyInit mode="home" words={sec.hero.words || []} />
    </>
  );
}
