'use client';
// src/components/analytics/MetaPixel.tsx
// Tag base OFICIAL do Meta Pixel (copiada do Gerenciador de Eventos), carregada
// via next/script com strategy="afterInteractive" — não bloqueia render/hidratação
// e não expõe nada além do ID do Pixel (que é público por natureza).
//
// PageView:
//  - carga "dura" (F5 / primeiro acesso): disparado pela própria tag base.
//  - navegação SPA (App Router, sem reload): re-disparado por efeito em cima do
//    pathname, pulando o primeiro render para NÃO duplicar o PageView inicial.
import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { META_PIXEL_ID } from '../../lib/analytics/meta-pixel';

export function MetaPixel() {
  const pathname = usePathname();
  const firstRender = useRef(true);

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false; // PageView inicial já veio da tag base
      return;
    }
    const fbq = (window as unknown as { fbq?: (...a: unknown[]) => void }).fbq;
    if (typeof fbq === 'function') fbq('track', 'PageView');
  }, [pathname]);

  return (
    <>
      <Script id="meta-pixel-base" strategy="afterInteractive">
        {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
      </Script>
      <noscript>
        {/* Beacon de rastreio 1×1 do Meta (fallback sem JS) — não é conteúdo,
            next/image não se aplica. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          height="1"
          width="1"
          style={{ display: 'none' }}
          src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
          alt=""
        />
      </noscript>
    </>
  );
}
