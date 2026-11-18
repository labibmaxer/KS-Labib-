'use client';
import { useEffect } from 'react';
import { initMain } from '@/legacy/main.js';
import { initHero } from '@/legacy/hero.js';
import { initSub } from '@/legacy/sub.js';
import { initLanyard } from '@/legacy/lanyard.js';

/** Boots the theme behaviours (loader, reveal, nav, cursor, 3D hero…). `mode` = home | sub */
export default function LegacyInit({ mode = 'home', words = [] as string[], track = true }: { mode?: 'home' | 'sub'; words?: string[]; track?: boolean }) {
  useEffect(() => {
    const w = window as any;
    if (w.__kslInit) return;
    w.__kslInit = true;
    if (mode === 'home') {
      w.__HERO_WORDS = words;
      initMain();
      initLanyard();
      initHero();
    } else {
      initSub();
    }
    if (track) {
      try {
        if (!sessionStorage.getItem('_rv')) {
          sessionStorage.setItem('_rv', '1');
          fetch('/api/visit', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ page: location.pathname, referred: document.referrer || null }) }).catch(() => {});
        }
      } catch {}
    }
  }, [mode, words, track]);
  return null;
}
