-- ============================================================================
-- ForgeHub AI — APPLY ALL (Sprint 2) — rode UMA vez, tudo numa transação.
-- reset -> schema -> RLS -> seed. Idempotente: pode rodar de novo sem quebrar.
-- ============================================================================

-- ============================================================================
-- ForgeHub AI — RESET (somente DEV) — remove todos os objetos da Sprint 2.
-- Rode ANTES de reaplicar 0001 → 0002 → seed quando houver estado parcial.
-- Apaga apenas objetos da ForgeHub no schema public; não toca em auth/storage.
-- ============================================================================

-- Tabelas (CASCADE resolve FKs, triggers, policies e índices dependentes)
drop table if exists
  asset_ai_tools, asset_platforms, asset_languages, asset_countries, asset_tags,
  asset_analytics, asset_reviews, asset_updates, asset_checklist, asset_screenshots,
  asset_versions, asset_files, asset_links, assets,
  ai_tools, platforms, tags, categories, workspace_members, workspaces
cascade;

-- Funções
drop function if exists trg_health_from_checklist() cascade;
drop function if exists recompute_health_score(uuid) cascade;
drop function if exists ensure_asset_analytics() cascade;
drop function if exists set_updated_at() cascade;
drop function if exists asset_is_readable(uuid) cascade;
drop function if exists asset_is_owner(uuid) cascade;

-- Enums
drop type if exists
  member_role, platform_kind, delivery_bundle, revenue_model, update_type,
  analytics_metric, checklist_item, link_type, asset_license, asset_difficulty,
  asset_level, asset_status
cascade;


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


-- ============================================================================
-- ForgeHub AI — Sprint 2 — Seed realista
-- Rode com service_role (Supabase SQL Editor ou `supabase db reset`).
-- health_score e asset_analytics são preenchidos automaticamente por triggers.
-- ============================================================================

-- ---------------------------------------------------------------- Workspace
insert into workspaces (id, name, slug, plan) values
  ('f0000000-0000-0000-0000-000000000001', 'Meu Workspace', 'meu-workspace', 'pro');

-- ---------------------------------------------------------------- Categorias
insert into categories (slug, label, icon) values
  ('microapp',  'MicroApp',  'asset'),
  ('ai-agent',  'AI Agent',  'sparkles'),
  ('landing',   'Landing',   'stack'),
  ('prompt',    'Prompt',    'command'),
  ('planilha',  'Planilha',  'stack'),
  ('copy',      'Copy',      'command'),
  ('checkout',  'Checkout',  'bolt'),
  ('criativos', 'Criativos', 'asset');

-- ---------------------------------------------------------------- Tags
insert into tags (id, slug, label) values
  ('c0000000-0000-0000-0000-000000000001', 'agendamento', 'Agendamento'),
  ('c0000000-0000-0000-0000-000000000002', 'whatsapp',    'WhatsApp'),
  ('c0000000-0000-0000-0000-000000000003', 'vendas',      'Vendas'),
  ('c0000000-0000-0000-0000-000000000004', 'copywriting', 'Copywriting'),
  ('c0000000-0000-0000-0000-000000000005', 'saude',       'Saúde'),
  ('c0000000-0000-0000-0000-000000000006', 'trafego',     'Tráfego'),
  ('c0000000-0000-0000-0000-000000000007', 'financeiro',  'Financeiro'),
  ('c0000000-0000-0000-0000-000000000008', 'email',       'E-mail');

-- ---------------------------------------------------------------- Plataformas
insert into platforms (slug, label, kind) values
  ('lovable', 'Lovable', 'build_tool'),
  ('bolt',    'Bolt',    'build_tool'),
  ('cursor',  'Cursor',  'build_tool'),
  ('vscode',  'VSCode',  'build_tool'),
  ('claude_code', 'Claude Code', 'build_tool'),
  ('replit',  'Replit',  'build_tool'),
  ('vercel',  'Vercel',  'deploy'),
  ('netlify', 'Netlify', 'deploy'),
  ('github',  'GitHub',  'deploy'),
  ('hotmart', 'Hotmart', 'sales'),
  ('kiwify',  'Kiwify',  'sales'),
  ('stripe',  'Stripe',  'sales'),
  ('shopify', 'Shopify', 'sales'),
  ('meta_ads','Meta Ads','marketing'),
  ('tiktok',  'TikTok',  'marketing'),
  ('google_ads','Google Ads','marketing'),
  ('wordpress','WordPress','cms'),
  ('framer',  'Framer',  'cms'),
  ('webflow', 'Webflow', 'cms'),
  ('notion',  'Notion',  'cms');

-- ---------------------------------------------------------------- IA de construção
insert into ai_tools (slug, label) values
  ('claude',    'Claude'),
  ('gpt',       'GPT'),
  ('gemini',    'Gemini'),
  ('llama',     'Llama'),
  ('mistral',   'Mistral'),
  ('midjourney','Midjourney');

-- ---------------------------------------------------------------- Assets
insert into assets
  (id, workspace_id, slug, name, category_slug, short_description, full_description,
   status, version, level, license, suggested_price, setup_time_minutes, difficulty,
   revenue_model, time_to_publish_minutes, delivery_bundle)
values
  ('a0000000-0000-0000-0000-000000000001','f0000000-0000-0000-0000-000000000001',
   'agendamento-clinico-ai','Agendamento Clínico AI','microapp',
   'MicroApp de agendamento com confirmação automática por WhatsApp.',
   'Solução completa para clínicas: agendamento, lembretes inteligentes e confirmação via WhatsApp. Inclui landing, copy e planilhas de controle.',
   'active','v2.1.0','elite','comercial',297.00,5,'intermediario','one_time',10,'full_kit'),

  ('a0000000-0000-0000-0000-000000000002','f0000000-0000-0000-0000-000000000001',
   'copywriter-de-anuncios','Copywriter de Anúncios','ai-agent',
   'Agente que gera copies de alta conversão para Meta Ads e Google.',
   'Agente de IA treinado em campanhas milionárias. Gera headlines, criativos e variações por nível de consciência.',
   'updated','v1.4.2','pro','comercial',197.00,8,'iniciante','subscription',15,'pack'),

  ('a0000000-0000-0000-0000-000000000003','f0000000-0000-0000-0000-000000000001',
   'landing-de-lancamento','Landing de Lançamento','landing',
   'Template de landing premium com checkout integrado.',
   'Landing de alta conversão pronta para Framer/Webflow com blocos de prova social e checkout otimizado.',
   'active','v3.0.0','pro','white_label',147.00,15,'intermediario','one_time',20,'solo'),

  ('a0000000-0000-0000-0000-000000000004','f0000000-0000-0000-0000-000000000001',
   'calculadora-de-roi','Calculadora de ROI','planilha',
   'Planilha inteligente que simula lucro, ticket médio e retorno.',
   'Simulador financeiro para ofertas de serviço com projeções e gráficos automáticos.',
   'draft','v1.0.3','starter','uso_pessoal',47.00,10,'iniciante','free',12,'solo'),

  ('a0000000-0000-0000-0000-000000000005','f0000000-0000-0000-0000-000000000001',
   'prompt-mestre-vendas','Prompt Mestre — Vendas','prompt',
   'Prompt estruturado e blindado, otimizado com few-shot para vendas.',
   'Prompt Mestre com defesa contra injeção e variações por modelo (Claude, GPT, Gemini).',
   'active','v2.2.1','pro','comercial',97.00,3,'avancado','license_resale',5,'solo'),

  ('a0000000-0000-0000-0000-000000000006','f0000000-0000-0000-0000-000000000001',
   'suite-lancamento-completa','Suíte de Lançamento Completa','copy',
   'Combo ponta a ponta: agente, landing, copy, criativos e automações.',
   'Bundle Enterprise reunindo MicroApp, landing, sequência de e-mails, criativos e documentação.',
   'active','v1.2.0','enterprise','white_label',997.00,25,'avancado','one_time',30,'suite');

-- ---------------------------------------------------------------- Links (por asset)
insert into asset_links (asset_id, type, url) values
  ('a0000000-0000-0000-0000-000000000001','microapp','https://demo.forgehub.ai/agendamento'),
  ('a0000000-0000-0000-0000-000000000001','deploy','https://agendamento.vercel.app'),
  ('a0000000-0000-0000-0000-000000000001','github','https://github.com/forgehub/agendamento'),
  ('a0000000-0000-0000-0000-000000000001','remix','https://lovable.dev/remix/agendamento'),
  ('a0000000-0000-0000-0000-000000000001','drive','https://drive.google.com/drive/folders/agendamento'),
  ('a0000000-0000-0000-0000-000000000001','canva','https://canva.com/agendamento-templates'),
  ('a0000000-0000-0000-0000-000000000001','docs','https://docs.forgehub.ai/agendamento'),
  ('a0000000-0000-0000-0000-000000000002','microapp','https://demo.forgehub.ai/copywriter'),
  ('a0000000-0000-0000-0000-000000000002','remix','https://bolt.new/remix/copywriter'),
  ('a0000000-0000-0000-0000-000000000002','drive','https://drive.google.com/drive/folders/copywriter'),
  ('a0000000-0000-0000-0000-000000000002','canva','https://canva.com/copywriter-templates'),
  ('a0000000-0000-0000-0000-000000000003','deploy','https://landing-lancamento.framer.app'),
  ('a0000000-0000-0000-0000-000000000003','drive','https://drive.google.com/drive/folders/landing'),
  ('a0000000-0000-0000-0000-000000000003','canva','https://canva.com/landing-templates'),
  ('a0000000-0000-0000-0000-000000000004','drive','https://drive.google.com/drive/folders/roi'),
  ('a0000000-0000-0000-0000-000000000005','drive','https://drive.google.com/drive/folders/prompt'),
  ('a0000000-0000-0000-0000-000000000005','docs','https://docs.forgehub.ai/prompt-vendas'),
  ('a0000000-0000-0000-0000-000000000006','microapp','https://demo.forgehub.ai/suite'),
  ('a0000000-0000-0000-0000-000000000006','deploy','https://suite.vercel.app'),
  ('a0000000-0000-0000-0000-000000000006','github','https://github.com/forgehub/suite'),
  ('a0000000-0000-0000-0000-000000000006','remix','https://lovable.dev/remix/suite'),
  ('a0000000-0000-0000-0000-000000000006','drive','https://drive.google.com/drive/folders/suite'),
  ('a0000000-0000-0000-0000-000000000006','canva','https://canva.com/suite-templates'),
  ('a0000000-0000-0000-0000-000000000006','docs','https://docs.forgehub.ai/suite');

-- ---------------------------------------------------------------- Checklist (dirige o Health Score)
-- Todos os 12 itens; present=true onde há entrega. a1 e a6 = 100%.
insert into asset_checklist (asset_id, item, present) values
  -- a1: completo (100%)
  ('a0000000-0000-0000-0000-000000000001','github',true),('a0000000-0000-0000-0000-000000000001','deploy',true),
  ('a0000000-0000-0000-0000-000000000001','drive',true),('a0000000-0000-0000-0000-000000000001','canva',true),
  ('a0000000-0000-0000-0000-000000000001','prompt',true),('a0000000-0000-0000-0000-000000000001','landing',true),
  ('a0000000-0000-0000-0000-000000000001','copy',true),('a0000000-0000-0000-0000-000000000001','criativos',true),
  ('a0000000-0000-0000-0000-000000000001','documentacao',true),('a0000000-0000-0000-0000-000000000001','videos',true),
  ('a0000000-0000-0000-0000-000000000001','microapp',true),('a0000000-0000-0000-0000-000000000001','mockups',true),
  -- a2: faltam github, deploy, landing, videos (8/12 ≈ 67%)
  ('a0000000-0000-0000-0000-000000000002','github',false),('a0000000-0000-0000-0000-000000000002','deploy',false),
  ('a0000000-0000-0000-0000-000000000002','drive',true),('a0000000-0000-0000-0000-000000000002','canva',true),
  ('a0000000-0000-0000-0000-000000000002','prompt',true),('a0000000-0000-0000-0000-000000000002','landing',false),
  ('a0000000-0000-0000-0000-000000000002','copy',true),('a0000000-0000-0000-0000-000000000002','criativos',true),
  ('a0000000-0000-0000-0000-000000000002','documentacao',true),('a0000000-0000-0000-0000-000000000002','videos',false),
  ('a0000000-0000-0000-0000-000000000002','microapp',true),('a0000000-0000-0000-0000-000000000002','mockups',true),
  -- a3: faltam github, prompt, videos, mockups, microapp (7/12 ≈ 58%)
  ('a0000000-0000-0000-0000-000000000003','github',false),('a0000000-0000-0000-0000-000000000003','deploy',true),
  ('a0000000-0000-0000-0000-000000000003','drive',true),('a0000000-0000-0000-0000-000000000003','canva',true),
  ('a0000000-0000-0000-0000-000000000003','prompt',false),('a0000000-0000-0000-0000-000000000003','landing',true),
  ('a0000000-0000-0000-0000-000000000003','copy',true),('a0000000-0000-0000-0000-000000000003','criativos',true),
  ('a0000000-0000-0000-0000-000000000003','documentacao',true),('a0000000-0000-0000-0000-000000000003','videos',false),
  ('a0000000-0000-0000-0000-000000000003','microapp',false),('a0000000-0000-0000-0000-000000000003','mockups',false),
  -- a4: rascunho incompleto (só drive) (1/12 ≈ 8%)
  ('a0000000-0000-0000-0000-000000000004','github',false),('a0000000-0000-0000-0000-000000000004','deploy',false),
  ('a0000000-0000-0000-0000-000000000004','drive',true),('a0000000-0000-0000-0000-000000000004','canva',false),
  ('a0000000-0000-0000-0000-000000000004','prompt',false),('a0000000-0000-0000-0000-000000000004','landing',false),
  ('a0000000-0000-0000-0000-000000000004','copy',false),('a0000000-0000-0000-0000-000000000004','criativos',false),
  ('a0000000-0000-0000-0000-000000000004','documentacao',false),('a0000000-0000-0000-0000-000000000004','videos',false),
  ('a0000000-0000-0000-0000-000000000004','microapp',false),('a0000000-0000-0000-0000-000000000004','mockups',false),
  -- a5: prompt puro (drive, prompt, documentacao) (3/12 = 25%)
  ('a0000000-0000-0000-0000-000000000005','github',false),('a0000000-0000-0000-0000-000000000005','deploy',false),
  ('a0000000-0000-0000-0000-000000000005','drive',true),('a0000000-0000-0000-0000-000000000005','canva',false),
  ('a0000000-0000-0000-0000-000000000005','prompt',true),('a0000000-0000-0000-0000-000000000005','landing',false),
  ('a0000000-0000-0000-0000-000000000005','copy',false),('a0000000-0000-0000-0000-000000000005','criativos',false),
  ('a0000000-0000-0000-0000-000000000005','documentacao',true),('a0000000-0000-0000-0000-000000000005','videos',false),
  ('a0000000-0000-0000-0000-000000000005','microapp',false),('a0000000-0000-0000-0000-000000000005','mockups',false),
  -- a6: suíte completa (100%)
  ('a0000000-0000-0000-0000-000000000006','github',true),('a0000000-0000-0000-0000-000000000006','deploy',true),
  ('a0000000-0000-0000-0000-000000000006','drive',true),('a0000000-0000-0000-0000-000000000006','canva',true),
  ('a0000000-0000-0000-0000-000000000006','prompt',true),('a0000000-0000-0000-0000-000000000006','landing',true),
  ('a0000000-0000-0000-0000-000000000006','copy',true),('a0000000-0000-0000-0000-000000000006','criativos',true),
  ('a0000000-0000-0000-0000-000000000006','documentacao',true),('a0000000-0000-0000-0000-000000000006','videos',true),
  ('a0000000-0000-0000-0000-000000000006','microapp',true),('a0000000-0000-0000-0000-000000000006','mockups',true);

-- ---------------------------------------------------------------- Versões
insert into asset_versions (asset_id, version, notes, released_at, is_current) values
  ('a0000000-0000-0000-0000-000000000001','v1.0.0','Lançamento inicial.','2026-05-01',false),
  ('a0000000-0000-0000-0000-000000000001','v2.0.0','Nova UI + integração WhatsApp.','2026-06-10',false),
  ('a0000000-0000-0000-0000-000000000001','v2.1.0','Lembretes inteligentes.','2026-06-28',true),
  ('a0000000-0000-0000-0000-000000000002','v1.4.2','Novos criativos e correções.','2026-06-30',true),
  ('a0000000-0000-0000-0000-000000000006','v1.2.0','Suíte consolidada.','2026-06-20',true);

-- ---------------------------------------------------------------- Atualizações (feed novidades)
insert into asset_updates (asset_id, type, title, description) values
  ('a0000000-0000-0000-0000-000000000001','novo_prompt','Novo Prompt Mestre','Otimizado para objeções difíceis.'),
  ('a0000000-0000-0000-0000-000000000001','novo_canva','5 novos criativos verticais','Modelos para Reels.'),
  ('a0000000-0000-0000-0000-000000000002','nova_copy','Nova sequência de e-mails','Fluxo de recuperação atualizado.'),
  ('a0000000-0000-0000-0000-000000000006','novo_agente','Novo agente de suporte','Incluído na suíte.');

-- ---------------------------------------------------------------- Screenshots
insert into asset_screenshots (asset_id, url, caption, position) values
  ('a0000000-0000-0000-0000-000000000001','https://picsum.photos/seed/ag1/1200/800','Tela de agendamento',0),
  ('a0000000-0000-0000-0000-000000000001','https://picsum.photos/seed/ag2/1200/800','Confirmação WhatsApp',1),
  ('a0000000-0000-0000-0000-000000000003','https://picsum.photos/seed/ld1/1200/800','Hero da landing',0),
  ('a0000000-0000-0000-0000-000000000006','https://picsum.photos/seed/su1/1200/800','Visão da suíte',0);

-- ---------------------------------------------------------------- Países / Idiomas
insert into asset_countries (asset_id, country_code) values
  ('a0000000-0000-0000-0000-000000000001','BR'),('a0000000-0000-0000-0000-000000000001','PT'),
  ('a0000000-0000-0000-0000-000000000002','BR'),('a0000000-0000-0000-0000-000000000002','US'),
  ('a0000000-0000-0000-0000-000000000003','BR'),
  ('a0000000-0000-0000-0000-000000000005','BR'),('a0000000-0000-0000-0000-000000000005','US'),
  ('a0000000-0000-0000-0000-000000000006','BR');
insert into asset_languages (asset_id, language_code) values
  ('a0000000-0000-0000-0000-000000000001','pt'),('a0000000-0000-0000-0000-000000000001','en'),
  ('a0000000-0000-0000-0000-000000000002','pt'),('a0000000-0000-0000-0000-000000000002','en'),
  ('a0000000-0000-0000-0000-000000000003','pt'),
  ('a0000000-0000-0000-0000-000000000005','pt'),('a0000000-0000-0000-0000-000000000005','en'),
  ('a0000000-0000-0000-0000-000000000006','pt');

-- ---------------------------------------------------------------- Plataformas suportadas
insert into asset_platforms (asset_id, platform_slug) values
  ('a0000000-0000-0000-0000-000000000001','lovable'),('a0000000-0000-0000-0000-000000000001','cursor'),
  ('a0000000-0000-0000-0000-000000000001','vercel'),('a0000000-0000-0000-0000-000000000001','github'),
  ('a0000000-0000-0000-0000-000000000001','hotmart'),('a0000000-0000-0000-0000-000000000001','meta_ads'),
  ('a0000000-0000-0000-0000-000000000002','bolt'),('a0000000-0000-0000-0000-000000000002','meta_ads'),
  ('a0000000-0000-0000-0000-000000000002','google_ads'),
  ('a0000000-0000-0000-0000-000000000003','framer'),('a0000000-0000-0000-0000-000000000003','webflow'),
  ('a0000000-0000-0000-0000-000000000003','stripe'),
  ('a0000000-0000-0000-0000-000000000005','claude_code'),('a0000000-0000-0000-0000-000000000005','cursor'),
  ('a0000000-0000-0000-0000-000000000006','lovable'),('a0000000-0000-0000-0000-000000000006','vercel'),
  ('a0000000-0000-0000-0000-000000000006','github'),('a0000000-0000-0000-0000-000000000006','hotmart'),
  ('a0000000-0000-0000-0000-000000000006','notion');

-- ---------------------------------------------------------------- IA de construção
insert into asset_ai_tools (asset_id, ai_slug) values
  ('a0000000-0000-0000-0000-000000000001','claude'),('a0000000-0000-0000-0000-000000000001','gpt'),
  ('a0000000-0000-0000-0000-000000000002','gpt'),('a0000000-0000-0000-0000-000000000002','gemini'),
  ('a0000000-0000-0000-0000-000000000003','claude'),
  ('a0000000-0000-0000-0000-000000000005','claude'),('a0000000-0000-0000-0000-000000000005','gemini'),
  ('a0000000-0000-0000-0000-000000000006','claude'),('a0000000-0000-0000-0000-000000000006','midjourney');

-- ---------------------------------------------------------------- Tags
insert into asset_tags (asset_id, tag_id) values
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000001'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000002'),
  ('a0000000-0000-0000-0000-000000000001','c0000000-0000-0000-0000-000000000005'),
  ('a0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000002','c0000000-0000-0000-0000-000000000006'),
  ('a0000000-0000-0000-0000-000000000003','c0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000004','c0000000-0000-0000-0000-000000000007'),
  ('a0000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000005','c0000000-0000-0000-0000-000000000004'),
  ('a0000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000003'),
  ('a0000000-0000-0000-0000-000000000006','c0000000-0000-0000-0000-000000000008');

-- ---------------------------------------------------------------- Analytics (semente de números; linhas já criadas por trigger)
update asset_analytics set views=1240, downloads=310, remixes=48, favorites=92, opens=540, shares=25 where asset_id='a0000000-0000-0000-0000-000000000001';
update asset_analytics set views=980,  downloads=210, remixes=63, favorites=71, opens=430, shares=31 where asset_id='a0000000-0000-0000-0000-000000000002';
update asset_analytics set views=760,  downloads=180, remixes=22, favorites=54, opens=300, shares=12 where asset_id='a0000000-0000-0000-0000-000000000003';
update asset_analytics set views=120,  downloads=15,  remixes=2,  favorites=8,  opens=40,  shares=1  where asset_id='a0000000-0000-0000-0000-000000000004';
update asset_analytics set views=2100, downloads=520, remixes=110,favorites=140,opens=890, shares=60 where asset_id='a0000000-0000-0000-0000-000000000005';
update asset_analytics set views=3400, downloads=760, remixes=95, favorites=230,opens=1200,shares=88 where asset_id='a0000000-0000-0000-0000-000000000006';

-- Recarrega o cache do PostgREST (resolve PGRST205)
notify pgrst, 'reload schema';
