import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../lib/i18n/LanguageProvider";
import { ThemeProvider } from "../lib/theme/ThemeProvider";
import { ToastProvider } from "../components/organisms/Toast";
import { OfflineBanner } from "../components/organisms/OfflineBanner";

// Evita flash de tema errado (FOUC): aplica data-theme antes da hidratação.
const themeInit = `(function(){try{var m=localStorage.getItem('fh-theme')||'dark';var r=m==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):m;document.documentElement.dataset.theme=r;}catch(e){}})();`;

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  title: {
    default: "ForgeHub AI — Pare de criar produtos digitais do zero",
    template: "%s · ForgeHub AI",
  },
  description:
    "A maior biblioteca de kits de negócios digitais remixáveis: aplicativo, página de venda, checkout, ebook, criativos, vídeos e prompts — prontos para personalizar e vender como seus.",
  applicationName: "ForgeHub AI",
  keywords: ["produtos digitais", "kits remixáveis", "infoprodutos", "biblioteca de negócios", "ForgeHub AI", "remix", "Kiwify", "Hotmart"],
  openGraph: {
    title: "ForgeHub AI — Pare de criar produtos digitais do zero",
    description:
      "Uma fábrica de produtos digitais: escolha um kit, remixe, personalize e venda como seu. Novos kits todos os meses.",
    type: "website",
    siteName: "ForgeHub AI",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-deep text-content">
        <script dangerouslySetInnerHTML={{ __html: themeInit }} />
        <LanguageProvider>
          <ThemeProvider>
            <ToastProvider>
              {children}
              <OfflineBanner />
            </ToastProvider>
          </ThemeProvider>
        </LanguageProvider>
      </body>
    </html>
  );
}
