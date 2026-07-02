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
