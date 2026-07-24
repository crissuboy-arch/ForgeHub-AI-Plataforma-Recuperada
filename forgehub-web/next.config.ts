import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fixa a raiz do projeto neste diretório. Sem isso, o Turbopack pode inferir
  // uma raiz errada quando há outros lockfiles no sistema (ex.: home do usuário).
  turbopack: {
    root: __dirname,
  },
};

export default nextConfig;
