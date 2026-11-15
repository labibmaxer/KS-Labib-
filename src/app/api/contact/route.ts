import { NextResponse } from 'next/server';
import { serverClient } from '@/lib/supabase';

export const runtime = 'nodejs';
const clip = (v: unknown, n: number) => String(v ?? '').slice(0, n);

export async function POST(req: Request) {
  let body: any = {};
  try { body = await req.json(); } catch { return NextResponse.json({ ok: false, error: 'bad json' }, { status: 400 }); }
  if (body.hp) return NextResponse.json({ ok: true }); // honeypot: pretend success

  const name = clip(body.name, 120).trim();
  const type = clip(body.project_type, 80).trim();
  const contact = clip(body.contact, 160).trim();
  const budget = clip(body.budget, 60).trim();
  const msg = clip(body.message, 4000).trim();
  if (!name || !type || !contact || !msg) return NextResponse.json({ ok: false, error: 'missing fields' }, { status: 400 });

  let dbOk = false, mailOk = false;
  try {
    const { error } = await serverClient().from('pf_leads').insert({ name, project_type: type, budget, contact, message: msg });
    if (error) throw error;
    dbOk = true;
  } catch (e) { console.error('[contact] db', (e as Error).message); }

  const key = process.env.WEB3FORMS_KEY || 'c8bccb4c-65bf-40e1-a0ec-c0f8ba4ef68d';
  if (key) {
    try {
      const payload: any = { access_key: key, subject: 'New portfolio enquiry — KS Labib', from_name: 'KS Labib portfolio', name, project_type: type, budget, contact, message: msg };
      if (/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(contact)) payload.email = contact;
      const r = await fetch('https://api.web3forms.com/submit', { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' }, body: JSON.stringify(payload) });
      const j = await r.json();
      mailOk = !!j.success;
    } catch (e) { console.error('[contact] mail', (e as Error).message); }
  }
  return NextResponse.json({ ok: dbOk || mailOk });
}
