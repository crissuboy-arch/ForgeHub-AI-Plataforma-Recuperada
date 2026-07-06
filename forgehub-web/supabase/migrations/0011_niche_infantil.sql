-- ============================================================================
-- ForgeHub AI — 0011: Nicho Infantil
-- Aditiva/idempotente. NÃO rode apply_all.sql.
-- ============================================================================
insert into niches (slug, label, icon, position) values
  ('infantil', 'Infantil', 'sparkles', 11)
on conflict (slug) do nothing;
