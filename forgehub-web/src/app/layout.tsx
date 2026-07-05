import type { Metadata } from "next";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "../lib/i18n/LanguageProvider";

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
  title: "ForgeHub AI — Crie, customize e distribua ativos digitais inteligentes",
  description:
    "A plataforma enterprise para criar, personalizar dinamicamente e distribuir ativos digitais com IA. Rápido, elegante e feito para escalar.",
  applicationName: "ForgeHub AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${montserrat.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-deep text-content">
        <LanguageProvider>{children}</LanguageProvider>
      </body>
    </html>
  );
}
