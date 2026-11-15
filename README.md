# KS Labib — Portfolio (Next.js + Supabase)

## Deploy (5 steps)
1. **Supabase → SQL Editor**: paste `db/schema.sql` → Run. (Edit the admin email at the bottom first if you log in with a different one.)
2. **Supabase → Authentication → Users**: make sure your admin email/password user exists. Turn OFF open signups (Auth → Providers → Email → disable "Allow new users to sign up").
3. **Vercel → Project → Settings → Environment Variables**:
   - `NEXT_PUBLIC_SUPABASE_URL` = `https://ygoeznfjkhoedrfgpdsh.supabase.co`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` = anon key (Supabase → Project Settings → API)
   - `WEB3FORMS_KEY` = optional (default already set)
4. Push this folder to GitHub. Vercel → Framework Preset **Next.js** → Deploy.
5. Open `/admin`, log in, edit everything.

## Admin
- **Projects**: add/edit/delete, cover + gallery upload, case-study text, tags, sort.
- **Sections**: every homepage block editable (form or raw JSON), show/hide, reset to default.
- **Settings**: name, logo text, contact, socials, footer, SEO.
- **Leads**: contact-form messages.
Saves refresh the live site instantly.

## Local
`npm install && cp .env.example .env.local && npm run dev`

Photos: upload through admin (stored in Supabase bucket `portfolio`) or drop files in `public/assets`.
