# ForgeHub AI — Estrutura de Banco de Dados (Sprint 2)

Camada de dados da plataforma. **Princípio:** a ForgeHub guarda metadados, links,
versões, arquivos-referência, classificação, histórico e analytics — **nunca o
código-fonte** dos MicroApps.

## Arquivos
| Arquivo | Conteúdo |
|---|---|
| `migrations/0001_init.sql` | Enums, tabelas, `workspace_id`, índices e triggers |
| `migrations/0002_rls.sql` | Row Level Security (básica) |
| `seed.sql` | Dados realistas de demonstração (6 assets completos) |

## Como aplicar

**Opção A — Supabase SQL Editor (mais rápido):**
1. Projeto Supabase → **SQL Editor**.
2. Rode `migrations/0001_init.sql`, depois `migrations/0002_rls.sql`, depois `seed.sql` (nesta ordem).

**Opção B — Supabase CLI:**
```bash
supabase link --project-ref <ref>
supabase db push          # aplica migrations/
psql "$DATABASE_URL" -f supabase/seed.sql
```

> O seed usa `service_role` (SQL Editor já roda como service_role), que ignora a RLS.

## Modelo de dados

```
workspaces ─1:N─ assets ─┬─1:N─ asset_links       ─┐
   │                     ├─1:N─ asset_files         │
workspace_members        ├─1:N─ asset_versions      │
                         ├─1:N─ asset_screenshots    │ RLS: leitura pública se
categories ─1:N─ assets  ├─1:N─ asset_checklist ──► Health Score  asset 'active'/'updated';
                         ├─1:N─ asset_updates        │ escrita só do created_by.
tags ─N:N─ assets        ├─1:N─ asset_reviews        │
                         ├─1:1─ asset_analytics      │
platforms ─N:N─ assets   ├─N:N─ asset_countries      │
ai_tools  ─N:N─ assets   ├─N:N─ asset_languages     ─┘
                         └─self─ parent_id (linhagem de Remix)
```

## Regras automáticas (triggers)
- **`updated_at`** — atualizado em todo `UPDATE` de `assets`.
- **`asset_analytics`** — linha 1:1 criada automaticamente ao inserir um Asset.
- **Health Score** — recalculado a cada mudança no `asset_checklist`:
  `health_score = round(Σ(weight onde present) ÷ Σ(weight) × 100)`.

## Classificação comercial (filtros futuros do Vault)
- Escalares em `assets`: `revenue_model`, `time_to_publish_minutes`, `delivery_bundle`.
- Multi-valor normalizado: `asset_countries` (ISO 3166-1), `asset_languages` (ISO 639-1),
  `asset_platforms` (+ `platforms.kind`: build_tool/deploy/sales/marketing/cms),
  `asset_ai_tools`.

## Google Drive
Estrutura canônica única de **18 pastas** (`01_MicroApp` … `18_Atualizações`),
conforme Design System Bible §5.1. O `asset_files.drive_folder` referencia essas pastas.

## Camada de dados (app)
- `src/types/index.ts` — tipos de domínio (`AssetSummary`, `Asset`, `AssetDetail`, relações).
- `src/data/assets.ts` — queries + mapeamento snake_case → camelCase.
- `src/hooks/useAssets.ts` — hooks React Query (`useAssets`, `useAssetDetail`, `useCategories`, `usePlatforms`).

> **Sprint 2 não liga a UI ao banco.** A UI atual segue com `mockAssets`. O consumo real
> (ficha premium) entra na **Sprint 3**.
