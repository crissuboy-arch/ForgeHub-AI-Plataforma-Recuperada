-- ============================================================================
-- ForgeHub AI — 0009: Perfil do usuário (item 10)
-- Campos país e plano em user_settings. Aditiva/idempotente.
-- ============================================================================
alter table user_settings add column if not exists country text;
alter table user_settings add column if not exists plan text not null default 'starter';
