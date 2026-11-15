import { cache } from 'react';
import { serverClient } from './supabase';
import { DEFAULT_SECTIONS, DEFAULT_SETTINGS, Json } from './defaults';
import type { Project } from './templates';
import { merge } from './merge';

export interface SiteData {
  settings: Json;
  sections: Record<string, Json>;
  hidden: Record<string, boolean>;
  projects: Project[];
}


export async function getProjects(): Promise<Project[]> {
  try {
    const { data, error } = await serverClient()
      .from('pf_projects')
      .select('*')
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: false });
    if (error) throw error;
    return (data || []) as Project[];
  } catch (e) {
    console.error('[content] projects', (e as Error).message);
    return [];
  }
}

export async function getProject(slugOrId: string): Promise<Project | null> {
  try {
    const sb = serverClient();
    let { data } = await sb.from('pf_projects').select('*').eq('slug', slugOrId).maybeSingle();
    if (!data && /^[0-9a-f-]{36}$/i.test(slugOrId)) {
      ({ data } = await sb.from('pf_projects').select('*').eq('id', slugOrId).maybeSingle());
    }
    return (data as Project) || null;
  } catch {
    return null;
  }
}

export const getSite = cache(async function getSite(): Promise<SiteData> {
  let settings: Json = { ...DEFAULT_SETTINGS };
  const sections: Record<string, Json> = {};
  const hidden: Record<string, boolean> = {};
  for (const k of Object.keys(DEFAULT_SECTIONS)) sections[k] = DEFAULT_SECTIONS[k];

  try {
    const sb = serverClient();
    const [st, sc] = await Promise.all([
      sb.from('pf_settings').select('value').eq('key', 'site').maybeSingle(),
      sb.from('pf_sections').select('id,data,visible'),
    ]);
    if (st.data?.value) settings = merge(DEFAULT_SETTINGS, st.data.value);
    for (const row of sc.data || []) {
      if (!(row.id in DEFAULT_SECTIONS)) continue;
      sections[row.id] = merge(DEFAULT_SECTIONS[row.id], row.data || {});
      if (row.visible === false) hidden[row.id] = true;
    }
  } catch (e) {
    console.error('[content] site', (e as Error).message);
  }
  const projects = await getProjects();
  return { settings, sections, hidden, projects };
});
