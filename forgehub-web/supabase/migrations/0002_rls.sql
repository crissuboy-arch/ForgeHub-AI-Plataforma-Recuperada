-- ============================================================================
-- ForgeHub AI — Sprint 2 — Migration 0002: Row Level Security (básica)
-- Modelo: catálogo público (lê assets 'active'/'updated' + suas relações);
--         escrita restrita ao criador (created_by = auth.uid()).
--         Lookups globais são somente-leitura pública; escrita só service_role.
-- service_role (backend) ignora RLS por padrão — usado por seed/admin.
-- ============================================================================

-- Helper: um asset é "acessível para leitura" se público ou do próprio usuário
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

-- ----------------------------------------------------------------------------
-- Habilita RLS em todas as tabelas
-- ----------------------------------------------------------------------------
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

-- ----------------------------------------------------------------------------
-- Lookups globais: leitura pública
-- ----------------------------------------------------------------------------
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
