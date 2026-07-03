-- ============================================================================
-- ForgeHub AI — Sprint 5 — Migration 0004: Core Functionality
--  Storage + prompt_content + favoritos + coleções + recentes + settings.
--  Idempotente.
-- ============================================================================

-- ---------------------------------------------------------------- Enum links extra
alter type link_type add value if not exists 'base44';
alter type link_type add value if not exists 'cursor';
alter type link_type add value if not exists 'sales';

-- ---------------------------------------------------------------- Prompt content
alter table assets add column if not exists prompt_content text;
alter table assets add column if not exists prompt_format  text default 'markdown';

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

-- ---------------------------------------------------------------- Favoritos
create table if not exists favorite_assets (
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  asset_id   uuid not null references assets(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, asset_id)
);
alter table favorite_assets enable row level security;
drop policy if exists "own favorites" on favorite_assets;
create policy "own favorites" on favorite_assets for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------- Coleções
create table if not exists collections (
  id         uuid primary key default gen_random_uuid(),
  user_id    uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name       text not null,
  slug       text not null,
  created_at timestamptz not null default now(),
  unique (user_id, slug)
);
alter table collections enable row level security;
drop policy if exists "own collections" on collections;
create policy "own collections" on collections for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

create table if not exists collection_assets (
  collection_id uuid not null references collections(id) on delete cascade,
  asset_id      uuid not null references assets(id) on delete cascade,
  position      integer not null default 0,
  added_at      timestamptz not null default now(),
  primary key (collection_id, asset_id)
);
alter table collection_assets enable row level security;
drop policy if exists "own collection assets" on collection_assets;
create policy "own collection assets" on collection_assets for all to authenticated
  using (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()))
  with check (exists (select 1 from collections c where c.id = collection_id and c.user_id = auth.uid()));

-- ---------------------------------------------------------------- Recentes
create table if not exists recent_assets (
  user_id   uuid not null default auth.uid() references auth.users(id) on delete cascade,
  asset_id  uuid not null references assets(id) on delete cascade,
  opened_at timestamptz not null default now(),
  primary key (user_id, asset_id)
);
alter table recent_assets enable row level security;
drop policy if exists "own recents" on recent_assets;
create policy "own recents" on recent_assets for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());

-- ---------------------------------------------------------------- Configurações
create table if not exists user_settings (
  user_id     uuid primary key default auth.uid() references auth.users(id) on delete cascade,
  full_name   text,
  avatar_url  text,
  theme       text not null default 'dark',
  language    text not null default 'pt',
  workspace   text,
  preferences jsonb not null default '{}'::jsonb,
  updated_at  timestamptz not null default now()
);
alter table user_settings enable row level security;
drop policy if exists "own settings" on user_settings;
create policy "own settings" on user_settings for all to authenticated
  using (user_id = auth.uid()) with check (user_id = auth.uid());
