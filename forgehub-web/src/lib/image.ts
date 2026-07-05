// src/lib/image.ts — Upload Inteligente: gera variações de imagem no cliente.
// Detecta orientação, corta proporcionalmente (cover) centralizado, otimiza e
// exporta em WebP quando possível. Zero dependências externas (usa <canvas>).

export type PresetKey = 'thumbnail' | 'card' | 'hero' | 'preview';

export const IMAGE_PRESETS: Record<PresetKey, { w: number; h: number; label: string; ratio: string }> = {
  thumbnail: { w: 800, h: 800, label: 'Thumbnail', ratio: '1:1' },
  card: { w: 1200, h: 900, label: 'Card', ratio: '4:3' },
  hero: { w: 1600, h: 900, label: 'Hero / Banner', ratio: '16:9' },
  preview: { w: 1200, h: 630, label: 'Preview', ratio: '1200×630' },
};

function loadImage(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error('Não foi possível ler a imagem.'));
    };
    img.src = url;
  });
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

/** Processa uma imagem para um preset: cover-crop centralizado + WebP (fallback JPEG). */
export async function processImage(img: HTMLImageElement, w: number, h: number): Promise<Blob> {
  const canvas = document.createElement('canvas');
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext('2d');
  if (!ctx) throw new Error('Canvas indisponível.');

  // cover: mantém proporção, corta o excedente, centraliza
  const scale = Math.max(w / img.width, h / img.height);
  const dw = img.width * scale;
  const dh = img.height * scale;
  const dx = (w - dw) / 2;
  const dy = (h - dh) / 2;
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(img, dx, dy, dw, dh);

  // WebP quando suportado; senão JPEG
  const webp = await toBlob(canvas, 'image/webp', 0.85);
  if (webp) return webp;
  const jpeg = await toBlob(canvas, 'image/jpeg', 0.85);
  if (jpeg) return jpeg;
  throw new Error('Falha ao gerar a imagem.');
}

/** Gera todas as variações (thumbnail, card, hero, preview) a partir de UM arquivo. */
export async function generateVariants(
  file: File,
  presets: PresetKey[] = ['thumbnail', 'card', 'hero', 'preview'],
): Promise<Record<PresetKey, Blob>> {
  const img = await loadImage(file);
  const out = {} as Record<PresetKey, Blob>;
  for (const key of presets) {
    const p = IMAGE_PRESETS[key];
    out[key] = await processImage(img, p.w, p.h);
  }
  return out;
}
