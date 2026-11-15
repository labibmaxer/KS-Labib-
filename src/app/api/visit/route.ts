import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase';

export async function POST(req: Request) {
  try {
    const b = await req.json().catch(() => ({}));
    await serverClient().from('pf_visits').insert({
      page: String(b.page || '/').slice(0, 300),
      referred: b.referred ? String(b.referred).slice(0, 500) : null,
      ua: (req.headers.get('user-agent') || '').slice(0, 300),
    });
  } catch {}
  return NextResponse.json({ ok: true });
}
