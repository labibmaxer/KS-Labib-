import { createClient, SupabaseClient } from '@supabase/supabase-js';

export const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ygoeznfjkhoedrfgpdsh.supabase.co';
export const SUPABASE_ANON =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

/** Server / public read client (no session persistence). */
export function serverClient(accessToken?: string): SupabaseClient {
  return createClient(SUPABASE_URL, SUPABASE_ANON || 'missing-anon-key', {
    auth: { persistSession: false, autoRefreshToken: false },
    global: accessToken ? { headers: { Authorization: `Bearer ${accessToken}` } } : undefined,
  });
}

let browser: SupabaseClient | null = null;
/** Browser client (keeps the admin login session). */
export function browserClient(): SupabaseClient {
  if (!browser) {
    browser = createClient(SUPABASE_URL, SUPABASE_ANON || 'missing-anon-key', {
      auth: { persistSession: true, autoRefreshToken: true, storageKey: 'kslabib-admin-auth' },
    });
  }
  return browser;
}
