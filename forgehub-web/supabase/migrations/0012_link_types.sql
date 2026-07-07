-- ============================================================================
-- ForgeHub AI — 0012: novos tipos de link para entregáveis dos kits
-- Aditiva/idempotente. NÃO rode apply_all.sql.
-- Obs.: ADD VALUE não pode ser usado na mesma transação que o consome; rode este
-- arquivo isolado no SQL Editor (cada statement é aplicado).
-- ============================================================================
alter type link_type add value if not exists 'checkout';
alter type link_type add value if not exists 'ebook_pdf';
alter type link_type add value if not exists 'ebook_canva';
alter type link_type add value if not exists 'criativos';
alter type link_type add value if not exists 'videos';
alter type link_type add value if not exists 'instrucoes';
