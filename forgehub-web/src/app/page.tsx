import Link from 'next/link';
import { Typography } from '../components/atoms/Typography';
import { Badge } from '../components/atoms/Badge';
import { Icon } from '../components/atoms/Icon';
import { Logo, LogoSymbol } from '../components/atoms/Logo';

const features = [
  { icon: 'sparkles', title: 'Auto Setup em minutos', desc: 'Personalize marca, cores, copies e documentos de um Asset Pack inteiro em menos de 2 minutos.' },
  { icon: 'stack', title: 'Vault de 500+ Assets', desc: 'Biblioteca organizada por taxonomia rígida — encontre o ativo ideal em segundos.' },
  { icon: 'bolt', title: 'Deploy com um clique', desc: 'Coloque MicroApps e automações no ar em produção estável, sem configurar servidores.' },
  { icon: 'command', title: 'Velocidade de teclado', desc: 'Barra global ⌘K onipresente para buscar, executar ações e navegar sem tocar no mouse.' },
];

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col bg-deep">
      {/* Nav */}
      <header className="sticky top-0 z-20 border-b border-border/60">
        <div className="glass mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Logo />
          <nav className="flex items-center gap-2">
            <Link href="/login" className="rounded-interactive px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-content">Entrar</Link>
            <Link href="/signup" className="bg-brand-glow inline-flex h-10 items-center rounded-interactive px-5 text-sm font-semibold text-white transition-shadow hover:shadow-[var(--shadow-glow-blue)]">Começar grátis</Link>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <main className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col items-center px-6 pt-24 text-center">
        <Badge tone="primary" className="mb-6">
          <Icon name="sparkles" size={14} /> Plataforma de ativos digitais inteligentes
        </Badge>
        <h1 className="max-w-3xl font-display text-5xl font-extrabold leading-[1.05] tracking-tight text-content sm:text-6xl">
          Crie, personalize e distribua{' '}
          <span className="text-brand-glow">ativos digitais com IA</span>
        </h1>
        <Typography variant="p" className="mt-6 max-w-2xl text-lg">
          A ForgeHub AI não é um repositório de templates. É uma ferramenta enterprise que compila, reescreve e hospeda seus
          MicroApps, copies e documentos — pronta para o seu negócio.
        </Typography>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link href="/signup" className="bg-brand-glow inline-flex h-12 items-center justify-center rounded-interactive px-7 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-[var(--shadow-glow-blue)]">
            Começar agora
          </Link>
          <Link href="/dashboard" className="inline-flex h-12 items-center justify-center gap-2 rounded-interactive border border-white/15 px-7 text-sm font-semibold text-content transition-colors hover:border-primary/50 hover:bg-surface-2">
            Ver demonstração <Icon name="chevron" size={16} />
          </Link>
        </div>
        <p className="mt-5 text-xs text-dim">Sem cartão de crédito · Cancele quando quiser</p>

        {/* Preview */}
        <div className="relative mt-20 w-full max-w-5xl">
          <div className="absolute inset-0 -z-0 mx-auto h-40 w-3/4 bg-brand-glow opacity-30 blur-3xl" />
          <div className="card-premium relative rounded-container p-2 shadow-modal">
            <div className="flex h-72 items-center justify-center rounded-[12px] border border-border bg-surface sm:h-[26rem]">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-container" style={{ boxShadow: 'var(--shadow-glow-blue)' }}>
                  <LogoSymbol size={64} />
                </div>
                <Typography variant="small">Prévia do Dashboard ForgeHub AI</Typography>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="mx-auto w-full max-w-6xl px-6 py-24">
        <div className="mb-14 text-center">
          <Typography variant="h2" className="mb-3">Tudo para lançar mais rápido</Typography>
          <Typography variant="p" className="mx-auto max-w-xl">Do primeiro clique ao deploy em produção, cada detalhe é pensado para velocidade e elegância.</Typography>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f) => (
            <div key={f.title} className="card-premium lift glow-blue-hover ring-hairline rounded-container p-6 hover:border-primary/40">
              <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-interactive bg-primary/15 text-primary-hover">
                <Icon name={f.icon} size={22} />
              </div>
              <Typography variant="h5" className="mb-2">{f.title}</Typography>
              <Typography variant="small">{f.desc}</Typography>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto w-full max-w-5xl px-6 pb-24">
        <div className="bg-banner-glow relative overflow-hidden rounded-container p-10 text-center shadow-[0_28px_70px_-24px_rgba(124,92,252,0.6)] sm:p-16">
          <span className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan/30 blur-3xl" />
          <Typography variant="h2" className="relative mb-3 text-white">Pronto para forjar seu próximo ativo?</Typography>
          <p className="relative mx-auto mb-8 max-w-xl text-lg text-white/85">Junte-se aos criadores que entregam soluções de nível enterprise em minutos.</p>
          <Link href="/signup" className="relative inline-flex h-12 items-center justify-center rounded-interactive bg-white px-8 text-sm font-semibold text-[#0B1E3C] transition-transform hover:-translate-y-0.5">
            Criar minha conta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 sm:flex-row">
          <Logo />
          <Typography variant="caption">© 2026 ForgeHub AI · Soluções digitais. Inteligência real. Resultados reais.</Typography>
        </div>
      </footer>
    </div>
  );
}
