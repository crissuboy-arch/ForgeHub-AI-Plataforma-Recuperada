// src/data/storage.ts — Upload real no Supabase Storage (bucket 'asset-media').
import { supabase } from '../lib/supabaseClient';

const BUCKET = 'asset-media';
const BASE = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

/** Faz upload com barra de progresso real (XHR) e retorna a URL pública. */
export async function uploadMedia(file: File, onProgress?: (pct: number) => void): Promise<string> {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (!token) throw new Error('Faça login para enviar arquivos.');

  const ext = (file.name.split('.').pop() || 'bin').toLowerCase();
  const path = `${Date.now()}-${Math.round(Math.random() * 1e9)}.${ext}`;

  await new Promise<void>((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('POST', `${BASE}/storage/v1/object/${BUCKET}/${path}`);
    xhr.setRequestHeader('authorization', `Bearer ${token}`);
    xhr.setRequestHeader('apikey', KEY);
    xhr.setRequestHeader('x-upsert', 'true');
    xhr.setRequestHeader('content-type', file.type || 'application/octet-stream');
    xhr.upload.onprogress = (e) => {
      if (e.lengthComputable && onProgress) onProgress(Math.round((e.loaded / e.total) * 100));
    };
    xhr.onload = () =>
      xhr.status >= 200 && xhr.status < 300
        ? resolve()
        : reject(new Error(`Upload falhou (${xhr.status}): ${xhr.responseText}`));
    xhr.onerror = () => reject(new Error('Erro de rede no upload.'));
    xhr.send(file);
  });

  return `${BASE}/storage/v1/object/public/${BUCKET}/${path}`;
}

/** Remove um arquivo do Storage a partir da sua URL pública. */
export async function deleteMedia(url: string): Promise<void> {
  const marker = `/object/public/${BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;
  const path = url.slice(idx + marker.length);
  const { error } = await supabase.storage.from(BUCKET).remove([path]);
  if (error) throw error;
}
