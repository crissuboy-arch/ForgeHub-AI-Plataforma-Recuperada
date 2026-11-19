-- ============================================================================
-- ForgeHub AI — 0015: Otimização de imagens dos kits (2026-11-19)
-- Os objetos de imagem no bucket asset-media foram recomprimidos
-- (PNG originais de 1,7–4,9 MB -> JPG <=1200px q82, 52–372 KB; total
-- 54,4 MB -> 5,3 MB) e os PNG antigos removidos. Esta migration alinha
-- as referências guardadas (.png -> .jpg). Idempotente.
-- ============================================================================
update assets set
  cover_url = replace(cover_url, '.png', '.jpg'),
  banner_url = replace(banner_url, '.png', '.jpg'),
  mockup_url = replace(mockup_url, '.png', '.jpg'),
  logo_url = replace(logo_url, '.png', '.jpg'),
  thumbnail_url = replace(thumbnail_url, '.png', '.jpg')
where cover_url like '%.png' or banner_url like '%.png' or mockup_url like '%.png'
   or logo_url like '%.png' or thumbnail_url like '%.png';
update asset_screenshots set url = replace(url, '.png', '.jpg') where url like '%.png';
update asset_files set url = replace(url, '.png', '.jpg'), format = 'jpg'
where url like '%.png' and format = 'png';
update asset_links set url = replace(url, '.png', '.jpg') where url like '%.png';
