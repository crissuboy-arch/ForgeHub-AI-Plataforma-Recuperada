# FORGEHUB AI DESIGN SYSTEM & DEVELOPMENT BIBLE
> **A Referência Suprema de Engenharia, Identidade Visual e Governança Técnica**  
> *Versão 1.0.0 — Documento de Engenharia de Produto, Padrões Visuais e Cronograma Ágil*  
> *Autor: CEO, Chief Product Officer (CPO) & Arquiteto de Sistemas da ForgeHub AI*

---

## 1. FILOSOFIA DE PRODUTO

A **ForgeHub AI** não é uma plataforma de cursos, nem um repositório passivo de templates e prompts. Nós somos uma **empresa de software de alto impacto especializada na criação, customização dinâmica e distribuição de ativos digitais inteligentes**. 

Cada decisão de código, espaçamento de pixel ou infraestrutura de dados deve transpirar os seguintes pilares fundamentais:

*   **Simplicidade**: A interface deve ocultar a complexidade computacional. O usuário leigo em IA deve se sentir no controle total sem ver códigos ou engenharia reversa.
*   **Velocidade**: A plataforma deve ser rápida no clique, na busca e no deploy. O tempo de resposta (Time-to-Value) é nossa métrica de vida ou morte.
*   **Elegância**: Adotamos o design estrito de alta fidelidade (Craftsmanship). O minimalismo funcional cria confiança comercial.
*   **Organização**: Com mais de 500+ Assets, o caos é o inimigo. A taxonomia modular rígida garante que nada se perca.
*   **Alta Tecnologia**: Nossos algoritmos operam silenciosamente para compilar, reescrever e hospedar servidores e dados em background.
*   **Escalabilidade**: O sistema deve crescer exponencialmente em volume de assets e requisições sem quebras de integridade no banco ou degradação de performance.

> **Regra Suprema**: O usuário nunca deve sentir que está utilizando um template genérico. Ele deve sentir que possui uma ferramenta de nível enterprise construída exclusivamente para o seu negócio.

---

## 2. PRINCÍPIOS DE DESIGN DE INTERFACE (UX/UI)

### 2.1 Clareza Acima de Tudo (Visual Focus)
Cada tela ou modal do sistema deve responder a apenas uma pergunta principal por vez. Eliminamos o excesso de informações redundantes, gráficos confusos ou telemetry logs desnecessários nas telas dos usuários comuns. O espaço em branco (Negative Space) é tratado como um elemento de design ativo para guiar a atenção do olhar.

### 2.2 Um Clique a Menos (Friction Reduction)
Toda funcionalidade, configuração, arquivo ou histórico de transação deve ser acessível com o menor número possível de interações ou navegações. Reduzir a fadiga de cliques do usuário é uma prioridade inegociável do nosso time de front-end.

### 2.3 Zero Tela Branca (Onboarding Contínuo)
Não existem telas vazias na ForgeHub AI. Se uma lista, painel de favoritos, histórico ou biblioteca estiver vazia, o sistema apresentará ativamente:
*   Sugestões personalizadas baseadas no segmento de mercado do usuário.
*   Templates mais populares no Marketplace para início rápido.
*   Exemplos reais e interativos pré-carregados.
*   Tutoriais curtos em formato de progresso visual.

### 2.4 Mobile First + Desktop Premium
O portal e os MicroApps devem funcionar perfeitamente em telas pequenas de celulares (responsividade fluida de Toque Mínimo 48dp), mas no desktop o sistema deve parecer um software profissional premium de produtividade (estilo Linear e Figma), tirando proveito máximo de telas largas e atalhos rápidos de teclado.

---

## 3. LINGUAGEM DE DESIGN (DESIGN LANGUAGE SPECIFICATION)

Para garantir consistência impecável em todas as futuras telas e componentes do sistema, estabelecemos a seguinte especificação técnica de estilo de marca:

### 3.1 Paleta de Cores (Color Palette - Dark Slate Theme)
Adotamos uma paleta de alto contraste, moderna, focada em produtividade e de baixo cansaço visual (eye-safe):

*   **Primary (Azul de Ação)**: `#3B82F6` — Utilizado para ações primárias, botões de checkout e focos visuais ativos.
*   **Secondary (Azul de Apoio)**: `#60A5FA` — Usado para hovers, tags de categorias e links interativos.
*   **Background (Canvas)**: `#0B0F19` — O plano de fundo escuro e profundo da plataforma.
*   **Surface (Painéis e Containers)**: `#131A24` — Utilizado para delimitar seções principais e blocos de ferramentas.
*   **Card (Ativos e Widgets)**: `#1A2332` — O plano de fundo padrão para os cards de assets individuais e blocos de telemetria.
*   **Success (Confirmação)**: `#22C55E` — Status ativo, pagamentos concluídos e deploys online.
*   **Warning (Alerta)**: `#F59E0B` — Rascunhos pendentes, créditos acabando e revisões necessárias.
*   **Danger (Erro/Exclusão)**: `#EF4444` — Deploys suspensos, falhas de integração e ações destrutivas (excluir).
*   **Text (Leitura Principal)**: `#FFFFFF` — Textos e títulos que requerem legibilidade máxima.
*   **Secondary Text (Apoio e Metadados)**: `#94A3B8` — Descrições, datas, tags menores e legendas explicativas.

### 3.2 Gradientes Corporativos (Gradients)
*   *Brand Glow*: Linear Gradient de `#3B82F6` a `#8B5CF6` (Roxo de Inovação) com 45 graus de inclinação. Utilizado em banners de destaque do Dashboard e capas de Asset Packs premium.

### 3.3 Tipografia (Typography System)
*   **Família de Fontes**: `Inter` (Sans-Serif geométrica altamente legível em telas digitais de alta densidade).
*   **Pesos de Fonte Utilizados**:
    *   *Regular (400)*: Textos corridos, documentações, e-mails e metadados secundários.
    *   *Medium (500)*: Rótulos de inputs, textos de botões secundários, navegação lateral.
    *   *SemiBold (600)*: Títulos de seções, cabeçalhos de cards de ativos, botões primários.
    *   *Bold (700)*: Display Headings de grandes banners, preços e títulos principais de páginas.

### 3.4 Espaçamentos e Grid (Grid System)
*   Adotamos o **Grid Estrito de 8px**. Todos os elementos de padding, margens, lacunas (gap), alturas e larguras devem respeitar de forma rigorosa múltiplos matemáticos de 8 (ex: 8px, 16px, 24px, 32px, 48px, 64px, 128px) para garantir proporção visual áurea em qualquer resolução.

### 3.5 Bordas (Border Radius)
*   **Interactive Components (Botões, Inputs, Badges)**: `Border-Radius: 12px` (Efeito moderno e amigável).
*   **Structural Containers (Cards, Modais, Sidebars)**: `Border-Radius: 16px` (Elegância de contornos flutuantes).

### 3.6 Sombras (Shadows)
*   *Soft Elevation*: `box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)`
*   *Modal Elevation*: `box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.3), 0 10px 10px -5px rgba(0, 0, 0, 0.04)`

---

## 4. BIBLIOTECA DE COMPONENTES PADRONIZADOS

### 4.1 Botões (Buttons)
*   **Primary Button**: Altura de 48dp, bordas de 12dp, preenchimento com a cor Primary (`#3B82F6`). Utiliza efeito de Ripple no clique. O hover ativa a cor Secondary (`#60A5FA`) de forma suave (transição de 200ms).
*   **Secondary Button**: Altura de 48dp, bordas de 12dp, plano de fundo transparente com borda fina (1.5px) de cor de apoio. No hover, preenche levemente com opacidade cinza.
*   **Danger Button**: Altura de 48dp, preenchimento com a cor Danger (`#EF4444`). Usado estritamente para ações críticas e irreversíveis.

### 4.2 Cards de Assets (Unified Card Standard)
Todo asset exibido na plataforma usa exatamente a mesma estrutura visual para garantir escaneabilidade imediata:
*   **Topo**: Thumbnail/Ícone do Asset alinhado à esquerda; Botão de Favoritar (ícone de estrela) e Botão de Remixar (ícone de ramificação) alinhados à direita.
*   **Corpo**: Título do Asset (Bold, 16sp); Categoria (Badge colorido de apoio); Descrição curta resumida (Máximo de 2 linhas, TextSecondary, 12sp).
*   **Rodapé**: Versão Ativa (ex: `v1.2.0`); Status de Atualização (ex: *"Atualizado há 3 dias"*); Botão de Ação Direta ("Abrir" ou "Testar" dependendo da permissão).

### 4.3 Outros Componentes de Interface
*   **Inputs (Campos de Texto)**: Campos preenchidos (Filled Style) de altura 48dp com cantos arredondados (12dp). Contornos destacados em azul ao receber o foco do cursor. Textos de placeholder de cor TextSecondary de tamanho de leitura amigável (14sp).
*   **Modais (Pop-ups)**: Centralizados na tela, cercados por uma camada de escurecimento translúcido (backdrop blur) de fundo de 50% de opacidade para focar completamente a tomada de decisão do usuário no centro.
*   **Sidebar (Barra Lateral)**: Largura estática de 260dp no desktop, abrigando o perfil do usuário, seletor dinâmico de Workspace e as opções de menus ordenados hierarquicamente por prioridade de uso.

---

## 5. FORGEHUB ASSET STANDARD (Padrão de Entrega do Produto)

Para manter o selo de qualidade da ForgeHub AI, nenhum ativo digital pode ser listado no Marketplace ou considerado "Concluído" se não contiver a estrutura completa abaixo, dividida em três camadas estruturais homogêneas:

```
┌──────────────────────────────────────────────────────────────────────────┐
│                          FORGEHUB PREMIUM ASSET KIT                      │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│  [ CAMADA 1: INFORMAÇÕES E METADADOS DE CONTROLE ]                        │
│  • Nome Comercial  • Descrição Prática  • Imagem de Capa  • Banner       │
│  • Categoria       • Licença Legal      • Versão SemVer   • Autor/Criador│
│                                                                          │
│  [ CAMADA 2: NÚCLEO COMPUTACIONAL (IA ATIVA) ]                           │
│  • MicroApp UI     • Skill API Schema   • AI Agent Persona• Prompts      │
│  • Tutoriais       • Vídeos Práticos    • Checklist de Sucesso           │
│                                                                          │
│  [ CAMADA 3: MATÉRIAS-PRIMAS E APOIO GO-TO-MARKET ]                      │
│  • Landing Pages   • Checkouts          • Copies de Email • Criativos    │
│  • Links Canva     • Planilhas Excel    • PDFs e Manuais  • ZIP Completo │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
```

### 5.1 O Padrão do Google Drive (Google Drive Standard Layout)
Toda exportação e backup do Asset sincroniza nativamente no Google Drive do usuário final sob a seguinte estrutura numérica e imutável de pastas:

*   `01_MicroApp/` — Contém arquivos de mockups de interface e payloads JSON de configuração visual.
*   `02_Skill/` — Códigos de transformação, schemas de Webhooks e pacotes de cenários de integração.
*   `03_AI_Agent/` — Arquivos de instruções de sistema, contexto comportamental e parâmetros de LLM.
*   `04_Landing/` — Arquivo HTML bruto de backup e links diretos para templates de alta conversão.
*   `05_Checkout/` — Roteiros de conversão de checkout e guias de redução de carrinho abandonado.
*   `06_Copy/` — Cartas de vendas, copies de anúncio e sequências automáticas de e-mails de vendas.
*   `07_Canva/` — Links diretos para cópia imediata dos criativos e artes visuais de tráfego orgânico.
*   `08_Criativos/` — Banco de imagens e vetores limpos sem marca d'água para uso livre de direitos.
*   `09_Documentos/` — Modelos de contratos, termos comerciais e formulários em formatos abertos.
*   `10_PDF/` — Manuais operacionais ilustrados, Playbooks de negócios e guias visuais em alta resolução.
*   `11_Word/` — Documentos Word (`.docx`) prontos para edição local pelo cliente final.
*   `12_Excel/` — Simuladores de lucros, calculadoras de ROI e planilhas financeiras de precificação.
*   `13_PowerPoint/` — Apresentações comerciais de pitch e materiais educacionais para webinários.
*   `14_Prompts/` — O Prompt Mestre estruturado e variações otimizadas para diferentes modelos de IA.
*   `15_Vídeos/` — Roteiros detalhados para criativos de alta retenção no TikTok e Reels.
*   `16_Mockups/` — Imagens fotorrealistas de produtos em 3D para envolver visualmente a oferta comercial.
*   `17_Licença/` — Termos legais detalhando direitos autorais, white-label e permissões de revenda.
*   `18_Atualizações/` — Arquivo de texto simples contendo o histórico de changelogs e correções.

---

## 6. FORGEHUB AI AUTO SETUP (O Grande Diferencial Competitivo)

A funcionalidade **ForgeHub AI Auto Setup** é a coroa do nosso fosso competitivo. Quando um cliente adquire um Asset Pack, ele não quer configurar variáveis complexas ou passar horas editando mídias. O Auto Setup realiza a personalização dinâmica e completa de toda a infraestrutura física e criativa do kit em **menos de 2 minutos**.

### 6.1 O Fluxo de Onboarding do Auto Setup (As 8 Perguntas Mágicas)
Ao clicar no botão "Instalar Ativo Personalizado", um modal interativo e limpo guiará o usuário coletando as seguintes definições de negócios:

1.  **Nome do Negócio**: Nome da marca ou da empresa do cliente (ex: *Estética Clean*).
2.  **Logo Corporativo**: Upload do arquivo de imagem do logotipo em alta definição.
3.  **Cor Principal**: Seleção da paleta cromática da marca do usuário através de um seletor visual intuitivo.
4.  **Instagram**: Nome de usuário das redes sociais para inserção automática nos rodapés e CTAs.
5.  **WhatsApp Comercial**: Número de suporte para direcionamento instantâneo nos links e formulários de vendas.
6.  **Site / Canal Principal**: Domínio corporativo de destino do usuário.
7.  **Domínio Escolhido**: O subdomínio desejado para o deploy de seu MicroApp (ex: `agendamento.esteticaclean.com.br`).
8.  **Idioma de Preferência**: Tradução e adequação semântica automática de todo o ecossistema.

### 6.2 O Mecanismo em Ação (The Setup Engine)
Ao clicar em "Confirmar e Lançar", a nossa Inteligência Artificial executa de forma paralela e invisível as seguintes refatorações profundas:

```
[ Inputs do Usuário ]
          │
          ▼
┌─────────────────────────────────┐
│     ForgeHub Compilation Core   │
└─────────────────┬───────────────┘
                  │
        ┌─────────┼────────────────────────────────────────┐
        ▼         ▼                                        ▼
┌──────────────┐┌────────────────┐┌────────────────────────────────┐
│ UI Branding  ││ Copy Refactor  ││ Document Dynamic Generator     │
│ Injeta cores,││ Reescreve as   ││ Altera de forma binária os    │
│ logo e links ││ copies, e-mails││ metadados das planilhas XLSX, │
│ no MicroApp e││ e scripts com  ││ contratos DOCX e PDFs,         │
│ Landing Pages││ a nova marca   ││ entregando arquivos prontos   │
└──────────────┘└────────────────┘└────────────────────────────────┘
        │         │                                        │
        └─────────┼────────────────────────────────────────┘
                  │
                  ▼
┌──────────────────────────────────────────────────────────────────┐
│                  Deploy Automático & Sincronia                   │
│   - Ativa subdomínio via Edge Router CNAME                       │
│   - Sincroniza árvore de pastas estruturada no Google Drive       │
│   - Gera o arquivo compactado ZIP para o Download Center          │
└──────────────────────────────────────────────────────────────────┘
```

---

## 7. CRONOGRAMA DE DESENVOLVIMENTO ÁGIL (DEVELOPMENT ROADMAP)

Para organizar o progresso do time de engenharia e produto de forma enxuta (Lean Startup), dividimos o ciclo de entrega da versão 1.0 (V1) da ForgeHub AI em 4 Sprints estruturadas de 15 dias cada:

### 🚀 Sprint 1: Fundações, Autenticação e Entrada no Vault
*   **Módulos Desenvolvidos**: Login/Cadastro, Dashboard Principal, Sidebar de Navegação, Barra Global de Pesquisa (`⌘K`), Favoritos e Visualização em Modo Paisagem.
*   **Metas de Entrega**:
    *   Painel central visual rodando em alta performance e sem cansaço visual.
    *   Mecanismo de busca de assets operando com indexação estática rápida.
    *   Filtros básicos por categorias e estrutura de Workspace configurada no banco.

### 🚀 Sprint 2: Gerenciamento de Ativos e Downloads de Valor
*   **Módulos Desenvolvidos**: Biblioteca de Assets, Download Center, Integração com Google Drive Library e Módulo de Execução de Prompts/Skills.
*   **Metas de Entrega**:
    *   Visual Detail Sheet lateral integrado para visualização de parâmetros e teste rápido.
    *   Gerador de pacotes ZIP dinâmicos e disparo de links de cópias do Canva e Google Docs.
    *   Lógica de execução síncrona dos Prompts utilizando roteamento robusto de APIs de IA.

### 🚀 Sprint 3: Economia de Criadores e Gestão Corporativa
*   **Módulos Desenvolvidos**: Marketplace Global, Sistema de Licenciamento, Checkout de Pagamentos integrado, Perfil do Usuário e Configurações de Workspace.
*   **Metas de Entrega**:
    *   Vitrine limpa do Marketplace operando com curadoria de criadores parceiros.
    *   Controle de saldo de créditos, recargas e logs de auditoria de uso em tempo real.
    *   Controle de acesso baseado em papéis (Dono, Administrador, Editor, Visualizador) no Workspace.

### 🚀 Sprint 4: Deploy Avançado e Personalização Auto Setup
*   **Módulos Desenvolvidos**: One-Click Cloud Deploy, White-Label Agency Client Portal, Analytics de Performance e Motor ForgeHub AI Auto Setup.
*   **Metas de Entrega**:
    *   Roteamento CNAME e portal white-label operacional sem nenhuma menção à marca ForgeHub.
    *   Mecanismo serverless para rodar webhooks e automações nos nossos servidores.
    *   Módulo completo Auto Setup compilando criativos, copies e documentos de negócios personalizados em menos de 2 minutos.

---

## 8. REGRAS DE OURO E CONTROLE DE QUALIDADE (THE QUALITY GATES)

### 8.1 Selo de Aprovação Premium
Nenhum Asset Pack ou ativo digital será aceito ou publicado no Marketplace da ForgeHub AI se não passar por 100% de conformidade com os seguintes requisitos auditados por IA e humanos:

*   **[CONFORMIDADE 1]**: Possuir Tutorial e Documentação detalhados e didáticos explicando a operação e os benefícios práticos de negócios.
*   **[CONFORMIDADE 2]**: Possuir o Prompt Mestre totalmente estruturado, blindado contra injeções (Prompt Injection Defense) e otimizado com exemplos (Few-shot learning).
*   **[CONFORMIDADE 3]**: Possuir a Landing Page e estrutura de Checkout otimizadas com copies reais de altíssima conversão.
*   **[CONFORMIDADE 4]**: Fornecer arquivos de alta fidelidade e abertos (Word, Excel, PDF) para download agrupado.
*   **[CONFORMIDADE 5]**: Sincronização impecável com o padrão numérico de pastas do Google Drive.
*   **[CONFORMIDADE 6]**: Garantia de atualização e manutenção do kit perante novas atualizações de APIs de LLMs do mercado mundial.

### 8.2 A Regra de Ouro da Experiência (The Golden Rule)
Qualquer usuário interativo, mesmo sem nenhuma familiaridade com tecnologia ou inteligência artificial, deve conseguir navegar e executar os seguintes caminhos com perfeição:

1.  **Encontrar o Asset de valor ideal** na barra global de busca semântica em **menos de 10 segundos**.
2.  **Fazer o Remix** de um ativo para seu próprio ambiente em **menos de 30 segundos**.
3.  **Personalizar completamente todos os recursos corporativos** através do Auto Setup em **menos de 5 minutos**.
4.  **Colocar o deploy do MicroApp e sua automação no ar** (produção estável) em **menos de 10 minutos**.

> *Se qualquer funcionalidade, fluxo de clique, modal ou botão de nossa plataforma exigir mais tempo do que o estabelecido por esta Regra de Ouro, o recurso é considerado defeituoso e deve ser imediatamente retirado do ar para completo redesenho de UX pelo time de produto.*

---
*Este documento é a Constituição Visual, de Engenharia e de Produto definitiva da ForgeHub AI. Todo o desenvolvimento tático, design de componentes e expansão tecnológica da nossa startup mundial devem respeitar e seguir estritamente as diretrizes contidas neste manual!*
