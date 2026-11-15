import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { serverClient } from '@/lib/supabase';

/** Called by the admin panel after every save. Requires a valid admin session token. */
export async function POST(req: Request) {
  const token = (req.headers.get('authorization') || '').replace(/^Bearer\s+/i, '');
  if (!token) return NextResponse.json({ ok: false }, { status: 401 });
  const sb = serverClient(token);
  const { data, error } = await sb.rpc('pf_is_admin');
  if (error || data !== true) return NextResponse.json({ ok: false }, { status: 403 });
  revalidatePath('/', 'layout');
  return NextResponse.json({ ok: true, at: Date.now() });
}
