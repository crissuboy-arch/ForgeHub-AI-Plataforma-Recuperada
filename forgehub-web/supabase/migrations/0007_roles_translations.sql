-- ============================================================================
-- ForgeHub AI — 0007: Permissões (Admin × Aluno) + fundação de traduções de Kit
-- Aditivo/idempotente. NÃO rode apply_all.sql (aquele faz reset do Sprint 2).
-- ============================================================================

-- ---------------------------------------------------------------- Papel do usuário
alter table user_settings add column if not exists role text not null default 'aluno';

-- Promove o dono da plataforma a admin (ajuste o e-mail se necessário)
insert into user_settings (user_id, role)
  select id, 'admin' from auth.users where email = 'cris.suboy@gmail.com'
on conflict (user_id) do update set role = 'admin';

-- Helper: o usuário atual é admin?
create or replace function is_admin() returns boolean language sql stable as $$
  select coalesce((select role from user_settings where user_id = auth.uid()) = 'admin', false);
$$;

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
create table if not exists asset_translations (
  asset_id          uuid not null references assets(id) on delete cascade,
  language          text not null,               -- pt-BR | es | en
  name              text,
  short_description text,
  full_description  text,
  prompt_content    text,
  primary key (asset_id, language)
);
alter table asset_translations enable row level security;
drop policy if exists "read translations" on asset_translations;
create policy "read translations" on asset_translations for select using (true);
drop policy if exists "admin or owner writes translations" on asset_translations;
create policy "admin or owner writes translations" on asset_translations for all to authenticated
  using (is_admin() or asset_is_owner(asset_id)) with check (is_admin() or asset_is_owner(asset_id));
