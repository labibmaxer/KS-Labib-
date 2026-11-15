import type { Metadata, Viewport } from 'next';
import './globals.css';
import { getSite } from '@/lib/content';

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { settings: s } = await getSite();
  const base = s.site_url || 'https://kslabib.vercel.app';
  return {
    metadataBase: new URL(base),
    title: s.meta_title,
    description: s.meta_description,
    authors: [{ name: s.brand_name }],
    alternates: { canonical: '/' },
    robots: { index: true, follow: true },
    openGraph: { type: 'website', url: base, title: s.meta_title, description: s.meta_description, siteName: s.brand_name, images: s.og_image ? [s.og_image] : undefined },
    twitter: { card: 'summary_large_image', title: s.meta_title, description: s.meta_description, images: s.og_image ? [s.og_image] : undefined },
    icons: { icon: '/favicon.svg' },
  };
}

export const viewport: Viewport = { themeColor: '#0a0a0a', width: 'device-width', initialScale: 1 };

const THEME_BOOT = `try{var t=localStorage.getItem('kslabib-theme');if(t)document.documentElement.dataset.theme=t;}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Arvo:ital,wght@0,400;0,700;1,400&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,400&family=JetBrains+Mono:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <script dangerouslySetInnerHTML={{ __html: THEME_BOOT }} />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
