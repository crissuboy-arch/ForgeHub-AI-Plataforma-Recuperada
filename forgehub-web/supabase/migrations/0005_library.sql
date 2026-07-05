-- ============================================================================
-- ForgeHub AI — Etapa 1: Biblioteca Multilíngue de Kits (aditivo, não-destrutivo)
--  + assets.language (idioma primário)  + assets.niche (nicho de negócio)
--  + lookup `niches` (seed dos 10 nichos)
-- Idempotente. Nenhuma coluna/tabela existente é alterada ou removida.
-- ============================================================================

-- Idioma primário do Kit (filtro global). Reaproveita o conceito de user_settings.language.
alter table assets add column if not exists language text not null default 'pt-BR';
alter table assets add column if not exists niche    text;

create index if not exists idx_assets_language on assets(language);
create index if not exists idx_assets_niche    on assets(niche);

-- Lookup de nichos (dimensão de negócio — ortogonal a category/tipo)
create table if not exists niches (
  slug     text primary key,
  label    text not null,
  icon     text,
  position integer not null default 0
);
alter table niches enable row level security;
drop policy if exists "read niches" on niches;
create policy "read niches" on niches for select using (true);
drop policy if exists "admin writes niches" on niches;
create policy "admin writes niches" on niches for all to authenticated using (true) with check (true);

insert into niches (slug, label, icon, position) values
  ('nutricao',                'Nutrição',              'sparkles', 1),
  ('financas',                'Finanças',              'money',    2),
  ('beleza-estetica',         'Beleza e Estética',     'star',     3),
  ('psicologia',              'Psicologia',            'user',     4),
  ('desenvolvimento-pessoal', 'Desenvolvimento Pessoal','rocket',  5),
  ('marketing-digital',       'Marketing Digital',     'chart',    6),
  ('educacao',                'Educação',              'docs',     7),
  ('relacionamentos',         'Relacionamentos',       'favorite', 8),
  ('devocional',              'Devocional',            'command',  9),
  ('lifestyle',               'Lifestyle',             'globe',   10)
on conflict (slug) do nothing;
