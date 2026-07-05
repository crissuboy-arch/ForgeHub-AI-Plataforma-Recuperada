-- ============================================================================
-- ForgeHub AI — 0008: Métricas do Painel Administrativo (item 16)
-- Função SECURITY DEFINER agregada, exposta apenas a administradores (is_admin()).
-- Aditiva/idempotente. NÃO rode apply_all.sql.
-- ============================================================================

create or replace function admin_dashboard_metrics()
returns json
language plpgsql
security definer
set search_path = public
as $$
declare result json;
begin
  if not is_admin() then
    raise exception 'forbidden';
  end if;

  select json_build_object(
    'kits',            (select count(*) from assets),
    'kitsActive',      (select count(*) from assets where status in ('active','updated')),
    'downloads',       coalesce((select sum(downloads) from asset_analytics), 0),
    'favorites',       coalesce((select sum(favorites) from asset_analytics), 0),
    'remixes',         coalesce((select sum(remixes) from asset_analytics), 0),
    'views',           coalesce((select sum(views) from asset_analytics), 0),
    'opens',           coalesce((select sum(opens) from asset_analytics), 0),
    'users',           (select count(*) from user_settings),
    'admins',          (select count(*) from user_settings where role = 'admin'),
    'students',        (select count(*) from user_settings where role <> 'admin'),
    'countries',       (select count(distinct country_code) from asset_countries),
    'niches',          (select count(distinct niche) from assets where niche is not null),
    'languages',       (select count(distinct language) from assets where language is not null),
    'revenuePotential',coalesce((select sum(suggested_price) from assets), 0),
    -- Conversão: remixes / views (proxy de engajamento → ação)
    'conversion',      (
      case when coalesce((select sum(views) from asset_analytics), 0) > 0
        then round(100.0 * coalesce((select sum(remixes) from asset_analytics), 0)
                   / (select sum(views) from asset_analytics), 1)
        else 0 end
    ),
    'byNiche',         (select coalesce(json_agg(x), '[]') from
                          (select niche as key, count(*) as value from assets
                           where niche is not null group by niche order by count(*) desc) x),
    'byLanguage',      (select coalesce(json_agg(x), '[]') from
                          (select language as key, count(*) as value from assets
                           where language is not null group by language order by count(*) desc) x)
  ) into result;

  return result;
end $$;

revoke all on function admin_dashboard_metrics() from public;
grant execute on function admin_dashboard_metrics() to authenticated;
