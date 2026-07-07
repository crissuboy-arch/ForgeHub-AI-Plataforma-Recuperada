/*
 * scripts/generate-niche-images.ts
 * Geração das imagens de fundo dos nichos — BUILD-TIME, roda UMA vez (manual/CI).
 * NUNCA é chamado no runtime do app. O app só lê arquivos estáticos de /public.
 *
 * Uso:  npx tsx scripts/generate-niche-images.ts
 * Requer: OPENAI_API_KEY (no ambiente ou em .env.local / .env)
 *
 * Para cada niche: se /public{backgroundImage} já existir → PULA (economiza custo).
 * Senão → gera via OpenAI (gpt-image-1, 1536x1024, quality high) e salva como .jpg.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { niches } from '../src/config/niches';

const __dirnameLocal = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirnameLocal, '..');
const PUBLIC = path.join(ROOT, 'public');

// Carrega OPENAI_API_KEY do ambiente ou dos arquivos .env locais.
function loadKey(): string {
  if (process.env.OPENAI_API_KEY) return process.env.OPENAI_API_KEY;
  for (const f of ['.env.local', '.env']) {
    try {
      const content = fs.readFileSync(path.join(ROOT, f), 'utf8');
      const m = content.match(/^\s*OPENAI_API_KEY\s*=\s*"?([^"\r\n]+)"?\s*$/m);
      if (m?.[1]) return m[1].trim();
    } catch {
      /* arquivo ausente */
    }
  }
  return '';
}

async function generateOne(prompt: string): Promise<Buffer> {
  const key = loadKey();
  const res = await fetch('https://api.openai.com/v1/images/generations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` },
    body: JSON.stringify({
      model: 'gpt-image-1',
      prompt,
      size: '1536x1024',
      quality: 'high',
      output_format: 'jpeg',
      n: 1,
    }),
  });
  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI ${res.status}: ${txt.slice(0, 300)}`);
  }
  const json = (await res.json()) as { data?: { b64_json?: string }[] };
  const b64 = json.data?.[0]?.b64_json;
  if (!b64) throw new Error('Resposta sem b64_json.');
  return Buffer.from(b64, 'base64');
}

async function main() {
  const key = loadKey();
  if (!key) {
    console.error('❌ OPENAI_API_KEY não encontrada (ambiente, .env.local ou .env). Abortando.');
    process.exit(1);
  }

  // Filtro opcional por ids: `npx tsx scripts/generate-niche-images.ts relacionamentos gospel`
  const only = process.argv.slice(2).filter((a) => !a.startsWith('-'));
  const list = only.length ? niches.filter((n) => only.includes(n.id)) : niches;

  let generated = 0;
  let skipped = 0;
  for (const niche of list) {
    const target = path.join(PUBLIC, niche.backgroundImage.replace(/^\//, ''));
    if (fs.existsSync(target)) {
      console.log(`⏭️  Já existe: ${path.basename(target)}`);
      skipped += 1;
      continue;
    }
    try {
      fs.mkdirSync(path.dirname(target), { recursive: true });
      const buf = await generateOne(niche.imagePrompt);
      fs.writeFileSync(target, buf);
      console.log(`✅ Gerada: ${path.basename(target)} (${(buf.length / 1024).toFixed(0)} KB)`);
      generated += 1;
    } catch (e) {
      console.error(`⚠️  Falha em ${niche.id}: ${e instanceof Error ? e.message : String(e)}`);
    }
  }
  console.log(`\nConcluído. Geradas: ${generated} · Puladas: ${skipped}`);
}

main();
