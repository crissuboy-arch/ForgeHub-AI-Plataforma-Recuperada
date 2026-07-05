-- ============================================================================
-- ForgeHub AI — 0006: Classificação dos Kits de demonstração (nicho + idioma)
-- Dá vida à Biblioteca por nicho. Idempotente (pode rodar de novo sem problema).
-- ============================================================================

update assets set niche = 'beleza-estetica',         language = 'pt-BR' where slug = 'agendamento-clinico-ai';
update assets set niche = 'marketing-digital',       language = 'pt-BR' where slug = 'copywriter-de-anuncios';
update assets set niche = 'marketing-digital',       language = 'es'    where slug = 'landing-de-lancamento';
update assets set niche = 'financas',                language = 'pt-BR' where slug = 'calculadora-de-roi';
update assets set niche = 'marketing-digital',       language = 'en'    where slug = 'prompt-mestre-vendas';
update assets set niche = 'desenvolvimento-pessoal', language = 'pt-BR' where slug = 'suite-lancamento-completa';

-- Remove assets de teste que possam ter sobrado de diagnósticos
delete from assets where slug like 'diag-%';
