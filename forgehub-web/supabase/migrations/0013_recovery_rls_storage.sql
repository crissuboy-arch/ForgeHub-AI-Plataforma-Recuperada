-- ============================================================================
-- ForgeHub AI — 0013: Estado canónico de RLS + Storage (garantia versionada)
-- Recuperação 2026-11-19 (NOVO Supabase aysevfmlwodgzzsrctwl).
-- NOTA DE VERIFICAÇÃO (2026-11-19): no projeto novo, as policies públicas já
-- correspondiam ao conjunto canónico das migrations 0002-0007 e o bucket
-- asset-media já existia com as policies da 0004 — confirmado por pg_policies
-- e por testes reais anon/authenticated (HTTP 200, 7 kits). Esta migration
-- mantém-se como garantia idempotente desse estado (reaplica o conjunto
-- canónico das 27 tabelas públicas + bucket), para que o estado do banco
-- nunca dependa de SQL aplicado fora do Git. Inclui a confirmação da conta
-- de teste da recuperação (remover a conta depois de validada).
-- ============================================================================
create or replace function asset_is_readable(p_asset_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from assets a
     where a.id = p_asset_id
       and (a.status in ('active', 'updated') or a.created_by = auth.uid())
  );
$$;

-- Helper: o usuário é dono do asset (pode escrever)
create or replace function asset_is_owner(p_asset_id uuid)
returns boolean language sql stable as $$
  select exists (
    select 1 from assets a
     where a.id = p_asset_id and a.created_by = auth.uid()
  );
$$;

create or replace function is_admin() returns boolean language sql stable as $$
  select coalesce((select role from user_settings where user_id = auth.uid()) = 'admin', false);
$$;

-- ------------------------------------------------- Apagar policies atuais
-- (somente das tabelas da arquitetura ForgeHub, schema public)
do $$
declare r record;
begin
  for r in
    select policyname, tablename from pg_policies
     where schemaname = 'public'
       and tablename in (
         'workspaces','workspace_members','categories','tags','platforms',
         'ai_tools','assets','asset_links','asset_files','asset_versions',
         'asset_screenshots','asset_checklist','asset_updates','asset_reviews',
         'asset_analytics','asset_tags','asset_countries','asset_languages',
         'asset_platforms','asset_ai_tools','favorite_assets','collections',
         'collection_assets','recent_assets','user_settings','niches',
         'asset_translations')
  loop
    execute format('drop policy if exists %I on public.%I', r.policyname, r.tablename);
  end loop;
end $$;

-- ---------------------------------------------------------------- RLS on
alter table workspaces        enable row level security;
alter table workspace_members enable row level security;
alter table categories        enable row level security;
alter table tags              enable row level security;
alter table platforms         enable row level security;
alter table ai_tools          enable row level security;
alter table assets            enable row level security;
alter table asset_links       enable row level security;
alter table asset_files       enable row level security;
alter table asset_versions    enable row level security;
alter table asset_screenshots enable row level security;
alter table asset_checklist   enable row level security;
alter table asset_updates     enable row level security;
alter table asset_reviews     enable row level security;
alter table asset_analytics   enable row level security;
alter table asset_tags        enable row level security;
alter table asset_countries   enable row level security;
alter table asset_languages   enable row level security;
alter table asset_platforms   enable row level security;
alter table asset_ai_tools    enable row level security;
alter table asset_translations enable row level security;
alter table collection_assets enable row level security;
alter table collections enable row level security;
alter table favorite_assets enable row level security;
alter table niches enable row level security;
alter table recent_assets enable row level security;
alter table user_settings enable row level security;

-- ------------------------------------------------- Policies canónicas 0002
create policy "read categories" on categories for select using (true);
create policy "read tags"       on tags       for select using (true);
create policy "read platforms"  on platforms  for select using (true);
create policy "read ai_tools"   on ai_tools   for select using (true);

-- ----------------------------------------------------------------------------
-- Workspaces / membros
-- ----------------------------------------------------------------------------
create policy "member reads workspace" on workspaces for select
  using (exists (
    select 1 from workspace_members m
     where m.workspace_id = workspaces.id and m.user_id = auth.uid()
  ));
create policy "authenticated creates workspace" on workspaces for insert
  to authenticated with check (true);

create policy "member reads own membership" on workspace_members for select
  using (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Assets: leitura pública dos ativos + próprios; escrita só do dono
-- ----------------------------------------------------------------------------
create policy "read public or own assets" on assets for select
  using (status in ('active', 'updated') or created_by = auth.uid());
create policy "owner inserts asset" on assets for insert
  to authenticated with check (created_by = auth.uid());
create policy "owner updates asset" on assets for update
  using (created_by = auth.uid()) with check (created_by = auth.uid());
create policy "owner deletes asset" on assets for delete
  using (created_by = auth.uid());

-- ----------------------------------------------------------------------------
-- Tabelas filhas / junções: seguem a acessibilidade do Asset pai
-- ----------------------------------------------------------------------------
do $$
declare t text;
begin
  foreach t in array array[
    'asset_links','asset_files','asset_versions','asset_screenshots',
    'asset_checklist','asset_updates','asset_analytics','asset_tags',
    'asset_countries','asset_languages','asset_platforms','asset_ai_tools'
  ] loop
    execute format(
      'create policy "read child of readable asset" on %I for select using (asset_is_readable(asset_id));', t);
    execute format(
      'create policy "owner writes child" on %I for all using (asset_is_owner(asset_id)) with check (asset_is_owner(asset_id));', t);
  end loop;
end $$;

-- ----------------------------------------------------------------------------
-- Reviews: leitura pública (do asset acessível), escrita pelo próprio usuário
-- ----------------------------------------------------------------------------
create policy "read reviews of readable asset" on asset_reviews for select
  using (asset_is_readable(asset_id));
create policy "user writes own review" on asset_reviews for insert
  to authenticated with check (user_id = auth.uid());
create policy "user updates own review" on asset_reviews for update
  using (user_id = auth.uid()) with check (user_id = auth.uid());
create policy "user deletes own review" on asset_reviews for delete
  using (user_id = auth.uid());

-- ------------------------------------------------- Policies canónicas 0003
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

-- ------------------------------------------------- Storage (bucket+policies, 0004)

-- ---------------------------------------------------------------- Storage bucket
insert into storage.buckets (id, name, public)
values ('asset-media', 'asset-media', true)
on conflict (id) do nothing;

do $$
begin
  drop policy if exists "asset-media public read"   on storage.objects;
  drop policy if exists "asset-media auth insert"    on storage.objects;
  drop policy if exists "asset-media auth update"    on storage.objects;
  drop policy if exists "asset-media auth delete"    on storage.objects;
  create policy "asset-media public read" on storage.objects for select
    using (bucket_id = 'asset-media');
  create policy "asset-media auth insert" on storage.objects for insert to authenticated
    with check (bucket_id = 'asset-media');
  create policy "asset-media auth update" on storage.objects for update to authenticated
    using (bucket_id = 'asset-media');
  create policy "asset-media auth delete" on storage.objects for delete to authenticated
    using (bucket_id = 'asset-media');
end $$;

-- --------------------------------------- Policies canónicas 0004 (utilizador)
alter table favorite_assets enable row level security;
drop policy if exists "own favorites" on favorite_assets;
create policy "own favorites" on favorite_assets for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table collections enable row level security;
drop policy if exists "own collections" on collections;
create policy "own collections" on collections for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table collection_assets enable row level security;
drop policy if exists "own collection assets" on collection_assets;
create policy "own collection assets" on collection_assets for all to authenticated
  using (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()))
  with check (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()));

alter table recent_assets enable row level security;
drop policy if exists "own recents" on recent_assets;
create policy "own recents" on recent_assets for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

alter table user_settings enable row level security;
drop policy if exists "own settings" on user_settings;
create policy "own settings" on user_settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ------------------------------------------------- Policies canónicas 0005
alter table niches enable row level security;
drop policy if exists "read niches" on niches;
create policy "read niches" on niches for select using (true);
drop policy if exists "admin writes niches" on niches;
create policy "admin writes niches" on niches for all to authenticated using (true) with check (true);

-- ------------------------------------------------- Policies canónicas 0007
-- (substituem as "admin all authenticated" da 0003 em assets e tabelas-filhas)
-- ---------------------------------------------------------------- RLS: admin gerencia Kits públicos; aluno só os próprios (remixes)
drop policy if exists "admin all authenticated" on assets;
create policy "admin or owner manages assets" on assets for all to authenticated
  using (is_admin() or created_by = auth.uid())
  with check (is_admin() or created_by = auth.uid());
-- (mantém as policies da 0002: "read public or own", "owner inserts/updates/deletes")

do $$
declare t text;
begin
  foreach t in array array[
    'asset_links','asset_files','asset_versions','asset_screenshots',
    'asset_checklist','asset_updates','asset_analytics','asset_tags',
    'asset_countries','asset_languages','asset_platforms','asset_ai_tools'
  ] loop
    execute format('drop policy if exists "admin all authenticated" on %I;', t);
    execute format(
      'create policy "admin or owner writes child" on %I for all to authenticated using (is_admin() or asset_is_owner(asset_id)) with check (is_admin() or asset_is_owner(asset_id));', t);
  end loop;
end $$;

-- ---------------------------------------------------------------- Traduções de Kit (Item 2 — fundação)
create policy "read translations" on asset_translations for select using (true);
drop policy if exists "admin or owner writes translations" on asset_translations;
create policy "admin or owner writes translations" on asset_translations for all to authenticated
  using (is_admin() or asset_is_owner(asset_id)) with check (is_admin() or asset_is_owner(asset_id));

-- ============================================================================
-- OPCIONAL (validação): confirmar a conta de TESTE criada para esta
-- recuperação (teste-recuperacao@devforgehub.online), para validar a leitura
-- autenticada sem usar a conta real da proprietária. Pode ser apagada depois
-- em Authentication → Users. Não afeta nenhum outro utilizador.
-- ============================================================================
update auth.users set email_confirmed_at = now()
 where email = 'teste-recuperacao@devforgehub.online';
