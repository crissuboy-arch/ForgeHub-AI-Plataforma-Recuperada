-- ============================================================================
-- ForgeHub AI — 0010: Tipo do ativo (App / Prompt / Kit / Template)
-- Aditiva/idempotente. NÃO rode apply_all.sql.
-- ============================================================================
alter table assets add column if not exists asset_type text not null default 'kit';
