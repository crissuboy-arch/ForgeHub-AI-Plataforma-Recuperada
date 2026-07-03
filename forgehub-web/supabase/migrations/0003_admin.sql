-- ============================================================================
-- ForgeHub AI — Sprint 4 — Migration 0003: Admin Asset Studio
--  (a) colunas de mídia extras   (b) RLS de admin (authenticated CRUD)
--  (c) seed de plataformas/IAs para os selects reais do formulário
-- Idempotente: pode rodar novamente sem quebrar.
-- ============================================================================

-- ---------------------------------------------------------------- (0) Tipos de link
-- Amplia link_type para cobrir os 12 links do Admin Studio.
alter type link_type add value if not exists 'lovable_remix';
alter type link_type add value if not exists 'bolt_remix';
alter type link_type add value if not exists 'vercel';
alter type link_type add value if not exists 'netlify';
alter type link_type add value if not exists 'figma';
alter type link_type add value if not exists 'demo';
alter type link_type add value if not exists 'prompt';

-- ---------------------------------------------------------------- (a) Mídia
alter table assets add column if not exists logo_url          text;
alter table assets add column if not exists video_youtube_url text;
alter table assets add column if not exists video_loom_url    text;
alter table assets add column if not exists thumbnail_url      text;
alter table assets add column if not exists preview_url        text;

-- Preenche created_by automaticamente com o usuário logado (admin)
alter table assets alter column created_by set default auth.uid();

-- ---------------------------------------------------------------- (b) RLS admin
-- Qualquer usuário AUTENTICADO pode gerenciar o catálogo pelo Admin Studio.
-- (Somável às políticas públicas de leitura da 0002 — políticas são OR.)
do $$
declare t text;
begin
  foreach t in array array[
    'assets','asset_links','asset_files','asset_versions','asset_screenshots',
    'asset_checklist','asset_updates','asset_analytics','asset_tags',
    'asset_countries','asset_languages','asset_platforms','asset_ai_tools',
    'tags','asset_reviews'
  ] loop
    execute format('drop policy if exists "admin all authenticated" on %I;', t);
    execute format(
      'create policy "admin all authenticated" on %I for all to authenticated using (true) with check (true);', t);
  end loop;
end $$;

-- Admin autenticado também pode ler assets em rascunho (para editar)
drop policy if exists "authenticated reads all assets" on assets;
create policy "authenticated reads all assets" on assets for select to authenticated using (true);

-- Admin autenticado lê o(s) workspace(s) para vincular novos assets
drop policy if exists "authenticated reads workspaces" on workspaces;
create policy "authenticated reads workspaces" on workspaces for select to authenticated using (true);

-- ---------------------------------------------------------------- (c) Seed lookups
-- Plataformas (checkboxes do formulário) — kinds válidos do enum platform_kind
insert into platforms (slug, label, kind) values
  ('base44',     'Base44',     'build_tool'),
  ('flutterflow','FlutterFlow','build_tool'),
  ('bubble',     'Bubble',     'build_tool'),
  ('nextjs',     'Next.js',    'build_tool'),
  ('react',      'React',      'build_tool'),
  ('node',       'Node',       'build_tool'),
  ('supabase',   'Supabase',   'deploy'),
  ('firebase',   'Firebase',   'deploy'),
  ('hostinger',  'Hostinger',  'deploy')
on conflict (slug) do nothing;

-- IA utilizadas na construção
insert into ai_tools (slug, label) values
  ('deepseek',  'DeepSeek'),
  ('grok',      'Grok'),
  ('cursor_ai', 'Cursor AI'),
  ('lovable_ai','Lovable AI'),
  ('bolt_ai',   'Bolt AI'),
  ('base44_ai', 'Base44 AI')
on conflict (slug) do nothing;
