-- ============================================================================
-- ForgeHub AI — Sprint 2 — Migration 0001: Schema base
-- Fonte: FORGEHUB_AI_ASSET_ARCHITECTURE_PLAN.md (+ Operating System doc)
-- Princípio: metadados, links, versões e classificação — NUNCA o código-fonte.
-- Multi-workspace preparado desde a fundação (workspace_id).
-- ============================================================================

create extension if not exists pgcrypto; -- gen_random_uuid()

-- ----------------------------------------------------------------------------
-- 1. ENUMS
-- ----------------------------------------------------------------------------
create type asset_status     as enum ('draft', 'active', 'updated', 'archived');
create type asset_level      as enum ('starter', 'pro', 'elite', 'enterprise');
create type asset_difficulty as enum ('iniciante', 'intermediario', 'avancado');
create type asset_license    as enum ('uso_pessoal', 'comercial', 'white_label', 'open_source');
create type link_type        as enum ('microapp', 'deploy', 'github', 'remix', 'drive', 'canva', 'docs');
create type checklist_item   as enum (
  'github', 'deploy', 'drive', 'canva', 'prompt', 'landing',
  'copy', 'criativos', 'documentacao', 'videos', 'microapp', 'mockups'
);
create type analytics_metric as enum ('views', 'downloads', 'remixes', 'favorites', 'opens', 'shares');
create type update_type      as enum (
  'novo_prompt', 'nova_landing', 'novo_canva', 'novo_agente', 'nova_copy', 'correcao', 'outro'
);
-- Classificação comercial
create type revenue_model    as enum ('one_time', 'subscription', 'freemium', 'free', 'royalties', 'license_resale');
create type delivery_bundle  as enum ('solo', 'pack', 'suite', 'full_kit');
create type platform_kind    as enum ('build_tool', 'deploy', 'sales', 'marketing', 'cms');
-- Membros de workspace
create type member_role       as enum ('owner', 'admin', 'editor', 'viewer');

-- ----------------------------------------------------------------------------
-- 2. WORKSPACES (multi-tenant desde a fundação)
-- ----------------------------------------------------------------------------
create table workspaces (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  plan        text not null default 'free',
  created_at  timestamptz not null default now()
);

create table workspace_members (
  workspace_id uuid not null references workspaces(id) on delete cascade,
  user_id      uuid not null references auth.users(id) on delete cascade,
  role         member_role not null default 'viewer',
  joined_at    timestamptz not null default now(),
  primary key (workspace_id, user_id)
);
create index idx_workspace_members_user on workspace_members(user_id);

-- ----------------------------------------------------------------------------
-- 3. LOOKUPS GLOBAIS (sem workspace_id — compartilhados por toda a plataforma)
-- ----------------------------------------------------------------------------
create table categories (
  slug        text primary key,
  label       text not null,
  icon        text,
  parent_slug text references categories(slug) on delete set null
);

create table tags (
  id    uuid primary key default gen_random_uuid(),
  slug  text not null unique,
  label text not null
);

create table platforms (
  slug  text primary key,
  label text not null,
  kind  platform_kind not null,
  icon  text
);

create table ai_tools (
  slug  text primary key,
  label text not null,
  icon  text
);

-- ----------------------------------------------------------------------------
-- 4. ASSETS (núcleo — ficha de produto + classificação comercial)
-- ----------------------------------------------------------------------------
create table assets (
  id                     uuid primary key default gen_random_uuid(),
  workspace_id           uuid not null references workspaces(id) on delete cascade,
  slug                   text not null,
  name                   text not null,
  category_slug          text references categories(slug) on delete set null,
  short_description      text,
  full_description       text,                         -- markdown

  status                 asset_status not null default 'draft',
  version                text not null default 'v1.0.0',
  level                  asset_level not null default 'starter',
  license                asset_license not null default 'comercial',
  suggested_price        numeric(10,2),
  setup_time_minutes     integer,                      -- tempo de personalização
  difficulty             asset_difficulty,

  cover_url              text,
  banner_url             text,
  mockup_url             text,

  parent_id              uuid references assets(id) on delete set null, -- linhagem de Remix
  created_by             uuid references auth.users(id) on delete set null,
  health_score           integer not null default 0,   -- cache 0..100

  -- Classificação comercial (valor único por Asset)
  revenue_model          revenue_model not null default 'one_time',
  time_to_publish_minutes integer,                      -- tempo médio até publicação
  delivery_bundle        delivery_bundle not null default 'solo',

  created_at             timestamptz not null default now(),
  updated_at             timestamptz not null default now(),

  unique (workspace_id, slug)
);
create index idx_assets_workspace  on assets(workspace_id);
create index idx_assets_category   on assets(category_slug);
create index idx_assets_status     on assets(status);
create index idx_assets_level      on assets(level);
create index idx_assets_revenue    on assets(revenue_model);
create index idx_assets_bundle     on assets(delivery_bundle);
create index idx_assets_parent     on assets(parent_id);

-- ----------------------------------------------------------------------------
-- 5. TABELAS FILHAS (1:N do Asset)
-- ----------------------------------------------------------------------------
create table asset_links (
  id       uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  type     link_type not null,
  url      text not null,
  label    text,
  unique (asset_id, type)
);
create index idx_asset_links_asset on asset_links(asset_id);

create table asset_files (
  id           uuid primary key default gen_random_uuid(),
  asset_id     uuid not null references assets(id) on delete cascade,
  kind         text,
  name         text not null,
  format       text,
  url          text,
  drive_folder text,                    -- ex.: '01_MicroApp' .. '18_Atualizacoes'
  size_bytes   bigint
);
create index idx_asset_files_asset on asset_files(asset_id);

create table asset_versions (
  id          uuid primary key default gen_random_uuid(),
  asset_id    uuid not null references assets(id) on delete cascade,
  version     text not null,            -- SemVer
  notes       text,                     -- markdown
  released_at date not null default current_date,
  is_current  boolean not null default false,
  unique (asset_id, version)
);
create index idx_asset_versions_asset on asset_versions(asset_id);

create table asset_screenshots (
  id       uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  url      text not null,
  caption  text,
  position integer not null default 0
);
create index idx_asset_screenshots_asset on asset_screenshots(asset_id);

create table asset_checklist (
  id       uuid primary key default gen_random_uuid(),
  asset_id uuid not null references assets(id) on delete cascade,
  item     checklist_item not null,
  present  boolean not null default false,
  ref_url  text,
  weight   integer not null default 1,
  unique (asset_id, item)
);
create index idx_asset_checklist_asset on asset_checklist(asset_id);

create table asset_updates (
  id          uuid primary key default gen_random_uuid(),
  asset_id    uuid not null references assets(id) on delete cascade,
  version_id  uuid references asset_versions(id) on delete set null,
  type        update_type not null,
  title       text not null,
  description text,
  created_at  timestamptz not null default now()
);
create index idx_asset_updates_asset on asset_updates(asset_id);

create table asset_reviews (
  id         uuid primary key default gen_random_uuid(),
  asset_id   uuid not null references assets(id) on delete cascade,
  user_id    uuid references auth.users(id) on delete set null,
  rating     integer not null check (rating between 1 and 5),
  comment    text,
  created_at timestamptz not null default now()
);
create index idx_asset_reviews_asset on asset_reviews(asset_id);

create table asset_analytics (
  asset_id  uuid primary key references assets(id) on delete cascade,
  views     bigint not null default 0,
  downloads bigint not null default 0,
  remixes   bigint not null default 0,
  favorites bigint not null default 0,
  opens     bigint not null default 0,
  shares    bigint not null default 0
);

-- ----------------------------------------------------------------------------
-- 6. JUNÇÕES N:N (tags + classificação comercial multi-valor)
-- ----------------------------------------------------------------------------
create table asset_tags (
  asset_id uuid not null references assets(id) on delete cascade,
  tag_id   uuid not null references tags(id) on delete cascade,
  primary key (asset_id, tag_id)
);
create index idx_asset_tags_tag on asset_tags(tag_id);

create table asset_countries (
  asset_id     uuid not null references assets(id) on delete cascade,
  country_code char(2) not null,             -- ISO 3166-1 alpha-2
  primary key (asset_id, country_code)
);

create table asset_languages (
  asset_id      uuid not null references assets(id) on delete cascade,
  language_code varchar(5) not null,         -- ISO 639-1
  primary key (asset_id, language_code)
);

create table asset_platforms (
  asset_id      uuid not null references assets(id) on delete cascade,
  platform_slug text not null references platforms(slug) on delete cascade,
  primary key (asset_id, platform_slug)
);
create index idx_asset_platforms_platform on asset_platforms(platform_slug);

create table asset_ai_tools (
  asset_id uuid not null references assets(id) on delete cascade,
  ai_slug  text not null references ai_tools(slug) on delete cascade,
  primary key (asset_id, ai_slug)
);
create index idx_asset_ai_tools_ai on asset_ai_tools(ai_slug);

-- ----------------------------------------------------------------------------
-- 7. TRIGGERS
-- ----------------------------------------------------------------------------

-- 7.1 updated_at automático em assets
create or replace function set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_assets_updated_at
  before update on assets
  for each row execute function set_updated_at();

-- 7.2 Garante linha 1:1 em asset_analytics ao criar um Asset
create or replace function ensure_asset_analytics()
returns trigger language plpgsql as $$
begin
  insert into asset_analytics(asset_id) values (new.id)
  on conflict (asset_id) do nothing;
  return new;
end;
$$;

create trigger trg_assets_analytics
  after insert on assets
  for each row execute function ensure_asset_analytics();

-- 7.3 Recalcula Health Score a partir do checklist (Σ pesos presentes ÷ total × 100)
create or replace function recompute_health_score(p_asset_id uuid)
returns void language plpgsql as $$
declare
  v_total   integer;
  v_present integer;
begin
  select coalesce(sum(weight), 0),
         coalesce(sum(weight) filter (where present), 0)
    into v_total, v_present
    from asset_checklist
   where asset_id = p_asset_id;

  update assets
     set health_score = case when v_total = 0 then 0
                             else round(v_present::numeric / v_total * 100) end
   where id = p_asset_id;
end;
$$;

create or replace function trg_health_from_checklist()
returns trigger language plpgsql as $$
begin
  perform recompute_health_score(coalesce(new.asset_id, old.asset_id));
  return null;
end;
$$;

create trigger trg_checklist_health
  after insert or update or delete on asset_checklist
  for each row execute function trg_health_from_checklist();
