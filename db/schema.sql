-- ═══════════════════════════════════════════════════════════════
--  KS Labib portfolio — database schema (Supabase / Postgres)
--  Run this ONCE in Supabase → SQL Editor → New query → Run.
--  Safe to re-run. It never touches your old agency tables.
-- ═══════════════════════════════════════════════════════════════

-- 1) tables ─────────────────────────────────────────────────────
create table if not exists public.pf_admins (
  email text primary key
);

create table if not exists public.pf_settings (
  key        text primary key,
  value      jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now()
);

create table if not exists public.pf_sections (
  id         text primary key,
  data       jsonb not null default '{}'::jsonb,
  visible    boolean not null default true,
  updated_at timestamptz not null default now()
);

create table if not exists public.pf_projects (
  id                 uuid primary key default gen_random_uuid(),
  slug               text unique,
  title              text not null,
  type               text,
  year               text,
  client             text,
  url                text,
  img                text,
  description        text,
  tags               text[] not null default '{}',
  status             text default 'done',
  gallery            text,
  challenge          text,
  approach           text,
  outcome            text,
  testimonial        text,
  testimonial_author text,
  featured           boolean not null default false,
  sort_order         int not null default 0,
  created_at         timestamptz not null default now()
);

create table if not exists public.pf_leads (
  id           uuid primary key default gen_random_uuid(),
  name         text,
  project_type text,
  budget       text,
  contact      text,
  message      text,
  created_at   timestamptz not null default now()
);

create table if not exists public.pf_visits (
  id         bigint generated always as identity primary key,
  page       text,
  referred   text,
  ua         text,
  visited_at timestamptz not null default now()
);

-- 2) admin check (only emails listed in pf_admins can write) ───
create or replace function public.pf_is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.pf_admins a
    where lower(a.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );
$$;
revoke all on function public.pf_is_admin() from public;
grant execute on function public.pf_is_admin() to anon, authenticated;

-- 3) row level security ─────────────────────────────────────────
alter table public.pf_admins   enable row level security;
alter table public.pf_settings enable row level security;
alter table public.pf_sections enable row level security;
alter table public.pf_projects enable row level security;
alter table public.pf_leads    enable row level security;
alter table public.pf_visits   enable row level security;

do $$ declare r record; begin
  for r in select schemaname, tablename, policyname from pg_policies
           where schemaname='public' and tablename in ('pf_admins','pf_settings','pf_sections','pf_projects','pf_leads','pf_visits')
  loop execute format('drop policy %I on %I.%I', r.policyname, r.schemaname, r.tablename); end loop;
end $$;

-- public can read site content
create policy "public read settings" on public.pf_settings for select using (true);
create policy "public read sections" on public.pf_sections for select using (true);
create policy "public read projects" on public.pf_projects for select using (true);
-- admins write site content
create policy "admin write settings" on public.pf_settings for all using (public.pf_is_admin()) with check (public.pf_is_admin());
create policy "admin write sections" on public.pf_sections for all using (public.pf_is_admin()) with check (public.pf_is_admin());
create policy "admin write projects" on public.pf_projects for all using (public.pf_is_admin()) with check (public.pf_is_admin());
-- anyone can send a lead / log a visit; only admins read them
create policy "anyone insert lead"  on public.pf_leads  for insert with check (
  length(coalesce(name,'')) between 1 and 200 and length(coalesce(message,'')) between 1 and 5000);
create policy "admin read leads"    on public.pf_leads  for select using (public.pf_is_admin());
create policy "admin delete leads"  on public.pf_leads  for delete using (public.pf_is_admin());
create policy "anyone insert visit" on public.pf_visits for insert with check (true);
create policy "admin read visits"   on public.pf_visits for select using (public.pf_is_admin());
-- pf_admins: nobody can read/write through the API (function above reads it as owner)

-- 4) image storage bucket (public read, admin upload) ───────────
insert into storage.buckets (id, name, public)
values ('portfolio', 'portfolio', true)
on conflict (id) do update set public = true;

drop policy if exists "pf public read"   on storage.objects;
drop policy if exists "pf admin insert"  on storage.objects;
drop policy if exists "pf admin update"  on storage.objects;
drop policy if exists "pf admin delete"  on storage.objects;
create policy "pf public read"  on storage.objects for select using (bucket_id = 'portfolio');
create policy "pf admin insert" on storage.objects for insert with check (bucket_id = 'portfolio' and public.pf_is_admin());
create policy "pf admin update" on storage.objects for update using (bucket_id = 'portfolio' and public.pf_is_admin());
create policy "pf admin delete" on storage.objects for delete using (bucket_id = 'portfolio' and public.pf_is_admin());

-- 5) YOU: set the admin email (the login you use for /admin) ────
insert into public.pf_admins (email) values ('mdkhalidshaifullah54@gmail.com')
on conflict do nothing;

-- Done. Content defaults live in the code, so the site works with
-- empty tables. Edit anything from /admin and it saves here.
