import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto neste diretório. Sem isso, o Turbopack pode inferir
  // uma raiz errada quando há outros lockfiles no sistema (ex.: home do usuário).
  turbopack: {
    root: __dirname,
  },
  images: {
    // AVIF primeiro (≈20% menor que WebP), WebP como fallback. Sem mudança
    // visual — só reduz bytes servidos em <Image> na LP (hero, showcases).
    formats: ["image/avif", "image/webp"],
    // Mantém as variantes otimizadas no cache por 31 dias (imagens da LP são
    // estáticas). Menos reprocessamento = respostas mais rápidas.
    minimumCacheTTL: 2678400,
  },
};

export default nextConfig;
