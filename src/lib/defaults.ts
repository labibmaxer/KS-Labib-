/* Default content. Anything saved in the database (admin panel) overrides these. */

export type Json = any;

export const SECTION_ORDER = [
  'hero', 'marquee', 'about', 'services', 'projects', 'stats', 'skills',
  'experience', 'process', 'reviews', 'faq', 'pricing', 'contact', 'ticker',
] as const;

export const SECTION_LABELS: Record<string, string> = {
  hero: 'Hero',
  marquee: 'Tech strip (scrolling pills)',
  about: 'About me',
  services: 'Services',
  projects: 'Projects heading',
  stats: 'Stats counters',
  skills: 'Skills & tools',
  experience: 'Experience & education',
  process: 'How I work',
  reviews: 'Reviews',
  faq: 'FAQ',
  pricing: 'Pricing',
  contact: 'Contact',
  ticker: 'Capabilities ticker',
};

export const DEFAULT_SETTINGS: Json = {
  brand_name: 'KS Labib',
  logo_text: 'KS Labib',
  site_url: 'https://kslabib.vercel.app',
  email: 'mdkhalidshaifullah54@gmail.com',
  phone: '+8801553826344',
  whatsapp: '8801553826344',
  instagram: '',
  twitter: '',
  facebook: '',
  github: '',
  linkedin: '',
  location: 'Bangladesh · Remote worldwide',
  availability: 'Available for new projects',
  footer_note:
    'Full-Stack Developer building fast, accessible websites, web apps and online stores for clients worldwide.',
  footer_tagline: 'Craft. Motion. Code.',
  meta_title: 'KS Labib — Full-Stack Developer | Portfolio',
  meta_description:
    'KS Labib is a Full-Stack Developer building fast websites, web apps and online stores with Next.js, React, TypeScript and Supabase. Available for freelance projects worldwide.',
  og_image: '',
  projects_limit: 6,
};

export const DEFAULT_SECTIONS: Record<string, Json> = {
  hero: {
    eyebrow: 'KS Labib — Full-Stack Developer',
    line1: 'Full-Stack',
    line2: 'Developer for',
    words: ['web apps.', 'startups.', 'stores.', 'brands.', 'clients.'],
    sub: "I'm KS Labib — I design and build fast, accessible websites, web apps and online stores, from database to deployment. Based in Bangladesh, working with clients worldwide.",
    cta1: { text: 'See My Work', href: '#projects' },
    cta2: { text: 'Hire Me →', href: '#contact' },
    note: '// Next.js · React · TypeScript · Supabase · Remote',
    hint: 'drag the card',
    photo: '',
    photo_caption: 'KS Labib',
    photo_sub: 'Full-Stack Developer',
    card_label: 'DEV PASS',
    card_id: 'KSL-001',
    cards: [
      { n: '99+', l: 'Lighthouse score' },
      { n: '7d', l: 'Avg MVP delivery' },
      { n: '100%', l: 'Clean custom code' },
    ],
  },

  marquee: {
    items: ['Next.js', 'React', 'TypeScript', 'Tailwind CSS', 'Node.js', 'PostgreSQL', 'Supabase', 'Vercel', 'GraphQL', 'Figma'],
  },

  about: {
    eyebrow: 'about me',
    title: 'One developer.\nEnd-to-end delivery.',
    num: '01',
    role: 'Full-Stack Developer',
    name: 'KS Labib',
    photo: '',
    bio: "I'm a Full-Stack Developer who designs, builds and ships complete web products on my own — from the database and API to the pixels on screen. I care about clean code, fast load times and interfaces people actually enjoy using. When you hire me, you talk to the person writing the code.",
    stats: [
      { n: '3+', l: 'yrs coding' },
      { n: '12+', l: 'projects shipped' },
      { n: '99+', l: 'lighthouse avg' },
    ],
    tools: ['TypeScript', 'Next.js', 'React', 'PostgreSQL', 'Node.js', 'Vercel'],
    link: { text: 'Download CV ↗', href: '' },
  },

  services: {
    items: [
      {
        id: 'design', label: 'Web\nDesign', eyebrow: '01 — web design',
        title: 'Interfaces that\nlook the part.',
        desc: 'Clean, modern layouts designed around your goals — responsive on every screen, accessible, and built to turn visitors into customers.',
        cta: 'Get a quote →', cardTitle: 'Web Design Scope',
        list: ['Custom UI/UX design in Figma', 'Responsive layouts for every device', 'Design systems and style guides', 'Landing pages that convert', 'Accessibility-first design'],
      },
      {
        id: 'dev', label: 'Web\nDevelopment', eyebrow: '02 — web development',
        title: 'Fast sites built\nto scale.',
        desc: 'Clean, typed code on a modern stack. From marketing sites to full web apps with logins, databases and dashboards — built to load fast and easy to grow.',
        cta: 'Get a quote →', cardTitle: 'Web Development Scope',
        list: ['Custom full-stack web applications', 'Next.js, React and TypeScript front ends', 'Supabase / PostgreSQL back ends and APIs', 'Admin dashboards you can edit yourself', 'Third-party API integrations'],
      },
      {
        id: 'ecom', label: 'E-commerce', eyebrow: '03 — e-commerce',
        title: 'Stores that\nsell more.',
        desc: 'Fast, mobile-first online stores with smooth checkout, inventory management and payments — so selling online feels effortless.',
        cta: 'Get a quote →', cardTitle: 'E-commerce Scope',
        list: ['Custom storefronts and product pages', 'Stripe and local payment gateways', 'Inventory and order management', 'Customer accounts and wishlists', 'Checkout speed optimisation'],
      },
      {
        id: 'seo', label: 'SEO &\nPerformance', eyebrow: '04 — seo & performance',
        title: 'Found fast.\nLoaded faster.',
        desc: 'Technical SEO and Core Web Vitals tuning so your site ranks higher, loads instantly and keeps visitors on the page.',
        cta: 'Get a quote →', cardTitle: 'SEO & Performance Scope',
        list: ['Technical SEO audit and fixes', 'Core Web Vitals optimisation', 'Structured data and metadata', 'Analytics and conversion tracking', 'Monthly maintenance and monitoring'],
      },
    ],
  },

  projects: {
    eyebrow: 'selected work',
    title: "Things I've built",
    footer_title: "There's more where that came from.",
    footer_btn: 'See All Work',
    empty: 'No projects yet. Check back soon.',
  },

  stats: {
    items: [
      { n: 12, suffix: '+', l: 'Projects Delivered', decimal: false },
      { n: 7, suffix: 'd', l: 'Avg MVP Delivery', decimal: false },
      { n: 100, suffix: '%', l: 'Revision Satisfaction', decimal: false },
      { n: 4.7, suffix: '★', l: 'Client Satisfaction', decimal: true },
    ],
  },

  skills: {
    eyebrow: 'skills & tools',
    title: 'What I work with',
    groups: [
      { title: 'Frontend', items: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'HTML5', 'CSS3', 'Framer Motion'] },
      { title: 'Backend', items: ['Node.js', 'REST APIs', 'GraphQL', 'Serverless', 'Authentication'] },
      { title: 'Database & Cloud', items: ['PostgreSQL', 'Supabase', 'Row Level Security', 'Vercel', 'Git & GitHub'] },
      { title: 'Design', items: ['Figma', 'Design Systems', 'Responsive UI', 'Accessibility', 'Motion'] },
    ],
  },

  experience: {
    eyebrow: 'experience',
    title: 'Where I\'ve been\nbuilding.',
    items: [
      { period: '2024 — Present', role: 'Freelance Full-Stack Developer', org: 'Self-employed · Remote', desc: 'Building websites, web apps and online stores for clients worldwide with Next.js, React and Supabase.' },
      { period: '2023 — 2024', role: 'Web Developer', org: 'Projects & collaborations', desc: 'Shipped business sites and dashboards, learning production-grade performance, SEO and deployment workflows.' },
      { period: '2022 — 2023', role: 'Self-taught Developer', org: 'Online learning', desc: 'Started with HTML, CSS and JavaScript, then moved into React, TypeScript and full-stack development.' },
    ],
  },

  process: {
    eyebrow: 'how i work',
    title: 'Proven Delivery\nWorkflow',
    steps: [
      { t: 'We talk first', d: 'A short call to understand your goals, audience and budget. You get a clear scope and an exact quote before any work starts.' },
      { t: 'Plan & design', d: 'Sitemap, wireframes and a visual direction you approve — so the build never drifts from what you wanted.' },
      { t: 'Full-Stack Engineering', d: 'Clean, typed code on Next.js and Supabase, with a live staging link you can review at any time.' },
      { t: 'Testing, SEO & Launch', d: 'Cross-device testing, performance and SEO checks, then a smooth launch with post-launch support.' },
    ],
  },

  reviews: {
    eyebrow: 'client reviews',
    title: 'What clients say',
    empty_title: 'Reviews coming soon.',
    empty_desc: "I'm growing my client base. Early project partners get priority pricing and direct access to me — no account managers, no handoffs.",
    cta: { text: 'Be my first review →', href: '#contact' },
    items: [],
  },

  faq: {
    eyebrow: 'quick answers',
    title: 'Things people\nusually ask.',
    items: [
      { q: 'How long does a website take?', a: 'A landing page ships in about a week. Business sites take 2–3 weeks, and custom web apps or stores take 4–8 weeks. We agree a timeline in writing before I start and I stick to it.' },
      { q: 'What tech stack do you use?', a: 'Next.js, React, TypeScript and Tailwind CSS on the front end, with Supabase, PostgreSQL and serverless APIs behind it. Hosted on Vercel, so deploys are fast and rollbacks are one click.' },
      { q: 'Do you work with clients outside Bangladesh?', a: 'Yes — most of my clients are remote. We work over calls, shared Figma files and a live staging link you can review any time. I reply within a few hours on business days.' },
      { q: 'How many revisions are included?', a: 'Every project includes two rounds of revisions at no extra cost. I share a staging link early so there are never any surprises at launch.' },
      { q: 'Can I edit the website myself after launch?', a: 'Yes. I build a simple admin dashboard so you can update text, images and projects without touching code, and walk you through it on a handover call.' },
      { q: 'Who owns the code when the project is done?', a: 'You do — completely. Source code, design files and assets are yours once payment is complete. I also keep a backup for 30 days and offer monthly maintenance.' },
    ],
  },

  pricing: {
    eyebrow: 'pricing',
    title: 'Honest rates.\nNo surprises.',
    desc: 'Every quote is exact and agreed before I start. These are starting points — your project gets a custom number based on scope.',
    toggle_project: 'Per Project',
    toggle_monthly: 'Monthly',
    toggle_note: 'Monthly retainer saves',
    toggle_save: 'up to 20%',
    note_project: '// starting price per project',
    note_monthly: '// per month · cancel anytime',
    cta: 'Get a quote',
    footnote: 'All prices in USD  ·  Exact quote before work begins  ·  50% upfront, 50% on delivery  ·  Full source code included',
    plans: [
      { type: 'Starter', name: 'Landing Page', desc: 'A fast, conversion-focused single page for a product, campaign or personal brand.', project: 299, retainer: 249, featured: false, features: ['Up to 5 sections', 'Responsive on every device', 'Contact form with email alerts', 'Basic on-page SEO', 'Deployed on Vercel', '2 rounds of revisions included', 'Delivered within 7 days'] },
      { type: 'Business', name: 'Business Website', desc: 'A multi-page website with a custom design and an admin dashboard you can edit yourself.', project: 799, retainer: 649, featured: true, badge: 'Most Popular', features: ['Up to 10 custom-designed pages', 'Admin dashboard to edit content', 'Supabase database and forms', 'Technical SEO and analytics', 'Core Web Vitals optimised', '2 rounds of revisions included', '14-day post-launch support'] },
      { type: 'Advanced', name: 'Web App & Store', desc: 'Full-stack web apps and e-commerce stores with logins, payments and custom features.', project: 1499, retainer: 1199, featured: false, features: ['Custom full-stack web application', 'Stripe payments and subscriptions', 'User accounts and roles', 'Inventory and order management', 'API and third-party integrations', '2 rounds of revisions included', '30-day post-launch support'] },
    ],
  },

  contact: {
    eyebrow: "let's work together",
    title: 'Ready to build\nsomething great?',
    sub: "Fill in the form and I'll get back to you within 24 hours. No commitment needed.",
    success_title: 'Message received.',
    success_text: "I'll get back to you within 24 hours.\nIn the meantime, feel free to reach out directly.",
    types: ['Web Design', 'Web Development', 'E-commerce', 'SEO & Performance', 'Maintenance', 'Other / Not sure'],
    budgets: ['Under $300', '$300 – $600', '$600 – $1,000', '$1,000+'],
    consent: 'I agree to KS Labib storing my details to respond to this enquiry. My data is never shared with third parties.',
  },

  ticker: {
    items: ['Web Design', 'Web Development', 'E-commerce', 'SEO & Performance', 'Maintenance', 'UI/UX Design', 'Design Systems', 'Core Web Vitals', 'API Integrations', 'Cloud Deployments'],
  },
};
