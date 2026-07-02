# FORGEHUB AI — ASSET ARCHITECTURE PLAN
> **Especificação de Arquitetura do Asset (Ficha de Produto Digital + Classificação Comercial)**
> *Documento de planejamento — NÃO é implementação. Consolida a fonte oficial (Product Bible, Operating System, Value Delivery, Competitive Roadmap, Design System Bible).*
> *Status: aguardando aprovação para iniciar a Sprint 2.*

---

## 0. Princípio-mestre
A ForgeHub AI armazena **metadados, links, versões, arquivos-referência, organização, histórico, analytics e classificação comercial — NUNCA o código-fonte**. Cada MicroApp é um projeto independente; a ForgeHub é o índice / vitrine / ficha viva.

> **Conflito de docs registrado:** a estrutura do Google Drive diverge entre o Design System Bible §5.1 (**18 pastas**) e o Value Delivery §5 (**17 pastas**). Canônico adotado: **18 pastas** (Design System Bible), por reconfirmação do CEO.

---

## 1. Enums

```
asset_status     : draft | active | updated | archived
asset_level      : starter | pro | elite | enterprise
asset_difficulty : iniciante | intermediario | avancado
asset_license    : uso_pessoal | comercial | white_label | open_source
link_type        : microapp | deploy | github | remix | drive | canva | docs
checklist_item   : github | deploy | drive | canva | prompt | landing | copy
                 | criativos | documentacao | videos | microapp | mockups
analytics_metric : views | downloads | remixes | favorites | opens | shares
update_type      : novo_prompt | nova_landing | novo_canva | novo_agente | nova_copy | correcao | outro

# --- Classificação comercial (novo) ---
revenue_model    : one_time | subscription | freemium | free | royalties | license_resale
delivery_bundle  : solo | pack | suite | full_kit
platform_kind    : build_tool | deploy | sales | marketing | cms
```

> **Nota de refino:** a tabela `asset_compatibility` do plano anterior é **absorvida** pela nova `asset_platforms` (com `platform_kind` = `build_tool`/`deploy`). Isso evita duas tabelas de plataformas sobrepostas e generaliza "onde funciona" (técnico) + "onde é vendido/distribuído" (comercial) numa só estrutura normalizada.

---

## 2. Tabelas

### 2.1 Núcleo e ficha (do plano anterior)
| Tabela | Campos principais | Rel. |
|---|---|---|
| **categories** | `slug` PK, label, icon, parent_slug | 1→N assets |
| **assets** | `id`, `slug` uniq, name, category_slug FK, short_desc, full_desc(md), status, version, `level`, license, suggested_price, setup_time_minutes, difficulty, cover_url, banner_url, mockup_url, `parent_id`(self→linhagem Remix), created_by FK, health_score(cache), created_at, updated_at | núcleo |
| **tags / asset_tags** | tags(`id`,slug,label) · asset_tags(asset_id,tag_id) | N↔N |
| **asset_links** | `id`, asset_id, `type`(link_type), url, label | 1→N |
| **asset_files** | `id`, asset_id, kind, name, format, url, drive_folder, size_bytes | 1→N |
| **asset_versions** | `id`, asset_id, `version`, notes(md), released_at, is_current | 1→N |
| **asset_screenshots** | `id`, asset_id, url, caption, position | 1→N |
| **asset_checklist** | `id`, asset_id, `item`(checklist_item), present, ref_url, weight | 1→N → Health Score |
| **asset_updates** | `id`, asset_id, version_id FK, `type`(update_type), title, description, created_at | 1→N |
| **asset_analytics** | `asset_id` PK, views, downloads, remixes, favorites, opens, shares | 1↔1 |
| **asset_reviews** | `id`, asset_id, user_id, rating(1–5), comment, created_at | 1→N (preparado) |

### 2.2 Classificação comercial (NOVO)
Campos escalares vão em `assets`; campos multi-valorados viram tabelas de junção normalizadas.

**Colunas adicionadas em `assets`:**
| Campo | Coluna | Tipo | Origem |
|---|---|---|---|
| Modelo de Receita | `revenue_model` | enum `revenue_model` | pedido |
| Tempo médio até publicação | `time_to_publish_minutes` | integer | pedido (distinto de `setup_time_minutes` = tempo de personalização) |
| Bundle de entrega | `delivery_bundle` | enum `delivery_bundle` | pedido |

**Tabelas de junção adicionadas (multi-valor, filtráveis):**
| Tabela | Campos | Padrão | Origem |
|---|---|---|---|
| **asset_countries** | (`asset_id`, `country_code`) | ISO 3166-1 alpha-2 (BR, US, PT…) | País de destino |
| **asset_languages** | (`asset_id`, `language_code`) | ISO 639-1 (pt, en, es…) | Idiomas suportados |
| **platforms** (lookup) | `slug` PK, label, `kind`(platform_kind), icon | — | Plataformas suportadas |
| **asset_platforms** | (`asset_id`, `platform_slug` FK) | — | Plataformas suportadas (+ absorve compatibilidade técnica) |
| **ai_tools** (lookup) | `slug` PK, label, icon | — | IA utilizada na construção |
| **asset_ai_tools** | (`asset_id`, `ai_slug` FK) | — | IA utilizada na construção |

**Seeds sugeridos:**
- `platforms` → `kind=build_tool`: lovable, bolt, cursor, vscode, claude_code, replit · `kind=deploy`: vercel, netlify, github · `kind=sales`: hotmart, kiwify, stripe, shopify · `kind=marketing`: meta_ads, tiktok, google_ads · `kind=cms`: wordpress, framer, webflow, notion.
- `ai_tools` → claude, gpt, gemini, llama, mistral, deepseek, midjourney, etc.

**Por que junção e não `text[]`/enum:** países, idiomas, plataformas e IAs crescem com o tempo e serão **filtros avançados do Vault**. Junções + índices dão busca rápida (`WHERE country_code='BR'`), integridade referencial e nenhuma migração de coluna ao surgir uma nova plataforma/idioma → escala para milhares de assets sem reconstrução.

---

## 3. Diagrama das Tabelas (ERD atualizado)

```
                         ┌──────────────┐
                         │  categories  │
                         └──────┬───────┘
                                │1→N
        users ──1→N──►     ┌───────────┐ ◄─ self (parent_id = linhagem Remix)
       (creator)          │  ASSETS   │  (+ revenue_model, time_to_publish,
                          └─────┬─────┘   delivery_bundle, health_score cache)
   ┌──────────┬──────────┬──────┼──────┬──────────┬───────────┬──────────┐
   ▼1→N       ▼1→N       ▼1→N   ▼1→N   ▼1→N       ▼1→N        ▼1→N       ▼1↔1
 links      files     versions screenshots checklist updates  reviews  analytics
                                              │(alimenta Health Score → assets.health_score)
   ┌───────────────── classificação comercial (N↔N) ─────────────────┐
   ▼                    ▼                     ▼                       ▼
asset_countries   asset_languages      asset_platforms ─N:1─► platforms(kind)
                                       asset_ai_tools  ─N:1─► ai_tools
   asset_tags ─N:1─► tags
```

---

## 4. Mapa de Filtros Avançados do ForgeHub Vault
Cada campo de classificação vira um filtro (uso futuro — sem UI nesta fase):

| Filtro no Vault | Fonte | Tipo de UI (futuro) |
|---|---|---|
| Modelo de Receita | `assets.revenue_model` | chips |
| País de destino | `asset_countries` | multi-select + bandeira |
| Idiomas | `asset_languages` | multi-select |
| Plataformas (técnicas/comerciais) | `asset_platforms.kind` | grupos por `kind` |
| IA de construção | `asset_ai_tools` | multi-select |
| Tempo até publicação | `assets.time_to_publish_minutes` | faixas (<15/<30/<60 min) |
| Bundle de entrega | `assets.delivery_bundle` | chips (Solo/Pack/Suite/Full Kit) |
| Level | `assets.level` | chips (Starter→Enterprise) |
| Dificuldade | `assets.difficulty` | barras |
| Health Score | `assets.health_score` | slider (≥80%) |

---

## 5. Tipos (TypeScript) — proposta para `src/types/index.ts` (a gerar na Sprint 2)

```ts
export type AssetStatus     = 'draft' | 'active' | 'updated' | 'archived';
export type AssetLevel      = 'starter' | 'pro' | 'elite' | 'enterprise';
export type AssetDifficulty = 'iniciante' | 'intermediario' | 'avancado';
export type AssetLicense    = 'uso_pessoal' | 'comercial' | 'white_label' | 'open_source';
export type LinkType        = 'microapp' | 'deploy' | 'github' | 'remix' | 'drive' | 'canva' | 'docs';
export type ChecklistItem   =
  | 'github' | 'deploy' | 'drive' | 'canva' | 'prompt' | 'landing'
  | 'copy' | 'criativos' | 'documentacao' | 'videos' | 'microapp' | 'mockups';
export type AnalyticsMetric = 'views' | 'downloads' | 'remixes' | 'favorites' | 'opens' | 'shares';
export type UpdateType      = 'novo_prompt' | 'nova_landing' | 'novo_canva' | 'novo_agente' | 'nova_copy' | 'correcao' | 'outro';

// --- Classificação comercial (novo) ---
export type RevenueModel   = 'one_time' | 'subscription' | 'freemium' | 'free' | 'royalties' | 'license_resale';
export type DeliveryBundle = 'solo' | 'pack' | 'suite' | 'full_kit';
export type PlatformKind   = 'build_tool' | 'deploy' | 'sales' | 'marketing' | 'cms';

export interface AssetPlatform { slug: string; label: string; kind: PlatformKind; }
export interface AssetLink { type: LinkType; url: string; label?: string; }
export interface AssetScreenshot { url: string; caption?: string; position: number; }
export interface ChangelogEntry { version: string; releasedAt: string; notes?: string; isCurrent: boolean; }
export interface AssetChecklistRow { item: ChecklistItem; present: boolean; weight: number; }

export interface Asset {
  id: string;
  slug: string;
  name: string;
  category: string;
  tags: string[];
  shortDescription?: string;
  fullDescription?: string;

  status: AssetStatus;
  version: string;
  level: AssetLevel;
  license: AssetLicense;
  suggestedPrice?: number;
  setupTimeMinutes?: number;      // tempo de personalização
  difficulty?: AssetDifficulty;

  coverUrl?: string;
  bannerUrl?: string;
  mockupUrl?: string;

  parentId?: string | null;       // linhagem de Remix
  createdBy?: string;
  healthScore: number;            // cache 0–100
  createdAt: string;
  updatedAt: string;

  // --- Classificação comercial (novo) ---
  revenueModel: RevenueModel;
  timeToPublishMinutes?: number;  // tempo médio até publicação
  deliveryBundle: DeliveryBundle;
  targetCountries: string[];      // ISO 3166-1 alpha-2
  languages: string[];            // ISO 639-1
  platforms: AssetPlatform[];     // técnicas + comerciais
  buildAiTools: string[];         // slugs de ai_tools
}
```

---

## 6. Referências de fluxo (detalhados no plano em chat)
Botões **Abrir / Remix / Drive / Canva**, **Health Score** (Σ pesos presentes ÷ total × 100), **Asset Checklist** (validação automática de 12 itens do Drive), **wireframes** da ficha premium e do cadastro, e o **roadmap de Sprints** permanecem conforme apresentado. Este documento adiciona a **camada de classificação comercial** sobre aquela base, sem alterá-la.

---

## 7. Changelog deste documento
- **v1.1** — Adicionada Classificação Comercial: `revenue_model`, `time_to_publish_minutes`, `delivery_bundle` (colunas) + `asset_countries`, `asset_languages`, `platforms`/`asset_platforms`, `ai_tools`/`asset_ai_tools` (junções). `asset_compatibility` absorvida por `asset_platforms`. Mapa de filtros do Vault e tipos TS atualizados.
- **v1.0** — Modelo de Asset como ficha de produto (identidade, comercial, mídia, links, metadados) + camadas de valor (Health Score, Compatibilidade, Level, "O que acompanha", Changelog, Atualizações, Reviews, Analytics) + tabelas, fluxos, wireframes e roadmap.
