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
