import Link from 'next/link';
import { Typography } from '../components/atoms/Typography';
import { Badge } from '../components/atoms/Badge';
import { Icon } from '../components/atoms/Icon';

const features = [
  {
    iconName: 'sparkles',
    title: 'Auto Setup em minutos',
    description:
      'Personalize marca, cores, copies e documentos de um Asset Pack inteiro em menos de 2 minutos.',
  },
  {
    iconName: 'stack',
    title: 'Vault de 500+ Assets',
    description:
      'Biblioteca organizada por taxonomia rígida — encontre o ativo ideal em menos de 10 segundos.',
  },
  {
    iconName: 'bolt',
    title: 'Deploy com um clique',
    description:
      'Coloque MicroApps e automações no ar em produção estável, sem configurar servidores.',
  },
  {
    iconName: 'command',
    title: 'Velocidade de teclado',
    description:
      'Barra global ⌘K onipresente para buscar, executar ações e navegar sem tocar no mouse.',
  },
];

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col bg-canvas">
      {/* Header */}
      <header className="flex items-center justify-between px-6 py-5 sm:px-10">
        <div className="flex items-center gap-2">
          <span className="flex h-9 w-9 items-center justify-center rounded-interactive bg-brand-glow text-base font-bold text-white">
            F
          </span>
          <Typography variant="h5">ForgeHub AI</Typography>
        </div>
        <nav className="flex items-center gap-3">
          <Link
            href="/login"
            className="rounded-interactive px-4 py-2 text-sm font-medium text-muted transition-colors hover:text-content"
          >
            Entrar
          </Link>
          <Link
            href="/signup"
            className="inline-flex h-10 items-center rounded-interactive bg-primary px-5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Começar grátis
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="flex flex-1 flex-col items-center px-6 pt-20 text-center sm:pt-28">
        <Badge tone="primary" className="mb-6">
          <Icon name="sparkles" size={14} />
          Plataforma de ativos digitais inteligentes
        </Badge>
        <h1 className="max-w-3xl text-4xl font-bold leading-tight tracking-tight text-content sm:text-6xl">
          Crie, personalize e distribua{' '}
          <span className="text-brand-glow">ativos digitais com IA</span>
        </h1>
        <Typography variant="p" className="mt-6 max-w-2xl text-lg">
          A ForgeHub AI não é um repositório de templates. É uma ferramenta enterprise que compila,
          reescreve e hospeda seus MicroApps, copies e documentos — pronta para o seu negócio.
        </Typography>
        <div className="mt-10 flex flex-col gap-3 sm:flex-row">
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-interactive bg-primary px-7 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
          >
            Começar agora
          </Link>
          <Link
            href="/dashboard"
            className="inline-flex h-12 items-center justify-center gap-2 rounded-interactive border border-border bg-transparent px-7 text-sm font-semibold text-content transition-colors hover:bg-surface"
          >
            Ver demonstração
            <Icon name="chevron" size={16} />
          </Link>
        </div>

        {/* Preview do produto */}
        <div className="mt-20 w-full max-w-5xl">
          <div className="rounded-container border border-border bg-brand-glow/10 p-2 shadow-modal">
            <div className="flex h-72 items-center justify-center rounded-[12px] border border-border bg-surface sm:h-96">
              <div className="text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-container bg-brand-glow">
                  <Icon name="stack" size={32} className="text-white" />
                </div>
                <Typography variant="small">Prévia do Dashboard ForgeHub AI</Typography>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Features */}
      <section className="px-6 py-24 sm:px-10">
        <div className="mx-auto max-w-5xl">
          <div className="mb-12 text-center">
            <Typography variant="h2" className="mb-3">
              Tudo para lançar mais rápido
            </Typography>
            <Typography variant="p" className="mx-auto max-w-xl">
              Do primeiro clique ao deploy em produção, cada detalhe é pensado para velocidade e
              elegância.
            </Typography>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-container border border-border bg-card p-6 shadow-soft transition-colors hover:border-primary/50"
              >
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-interactive bg-primary/15 text-primary-hover">
                  <Icon name={f.iconName} size={22} />
                </div>
                <Typography variant="h5" className="mb-2">
                  {f.title}
                </Typography>
                <Typography variant="small">{f.description}</Typography>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="px-6 pb-24 sm:px-10">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-container bg-brand-glow p-10 text-center sm:p-16">
          <Typography variant="h2" className="mb-3 text-white">
            Pronto para forjar seu próximo ativo?
          </Typography>
          <p className="mx-auto mb-8 max-w-xl text-lg text-white/80">
            Junte-se aos criadores que entregam soluções de nível enterprise em minutos.
          </p>
          <Link
            href="/signup"
            className="inline-flex h-12 items-center justify-center rounded-interactive bg-white px-8 text-sm font-semibold text-canvas transition-opacity hover:opacity-90"
          >
            Criar minha conta
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-6 py-8 sm:px-10">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="flex h-7 w-7 items-center justify-center rounded-interactive bg-brand-glow text-xs font-bold text-white">
              F
            </span>
            <Typography variant="small">© 2026 ForgeHub AI</Typography>
          </div>
          <Typography variant="caption">Feito para criadores de alto impacto.</Typography>
        </div>
      </footer>
    </div>
  );
}
