# FORGEHUB AI OPERATING SYSTEM
> **A Constituição da Plataforma ForgeHub AI**  
> *Versão 1.0.0 — Documento de Arquitetura Lógica e Especificação Funcional Global*  
> *Autor: Chief Product Officer (CPO) & Equipe de Design de Sistemas da ForgeHub AI*

---

## 1. INTRODUÇÃO E PRINCÍPIOS DE DESIGN

A **ForgeHub AI** é uma plataforma SaaS projetada para ser o sistema operacional para criação, remixagem e distribuição de recursos de inteligência artificial (MicroApps, Skills, AI Agents e Automações).

Inspirados pelo minimalismo funcional da **Apple**, pela capacidade computacional e generativa da **OpenAI**, pela flexibilidade de blocos do **Notion** e pela velocidade e foco teclado-clique do **Linear**, estabelecemos esta **Constituição** como a base conceitual e lógica do nosso ecossistema. 

### O Desafio dos 500+ Assets
Uma plataforma com mais de 500 itens ativos torna-se inutilizável se depender de listas simples ou grades genéricas. Para resolver isso, a ForgeHub AI adota os seguintes princípios de arquitetura de informação:
1. **Hierarquia Modular**: Itens de dados menores são compostos em entidades maiores (ex: Prompts compõem Skills, que compõem Agentes).
2. **Busca Omnipresente (Foco no Teclado)**: O atalho global `⌘K` (ou `Ctrl+K`) é a espinha dorsal de navegação. Toda ação, asset ou configuração está a menos de 3 toques de distância.
3. **Coleções e Organização Multidimensional**: Um asset pode pertencer a categorias formais (estrutura de árvore) e a coleções dinâmicas (tags, uso ou favoritos).
4. **Tratamento de Estado Local e Nuvem**: Sincronização impecável em tempo de execução com tratamento transparente de conflitos de versão de dados.

---

## 2. REGRAS DE FUNCIONAMENTO DO SISTEMA OPERACIONAL

### 2.1 Workspace
* **O que é**: O Workspace é a unidade organizacional primária, isolando dados, faturamento, equipes e recursos.
* **Isolamento de Dados**: Nada flui entre Workspaces diferentes a menos que seja explicitamente exportado, publicado no Marketplace global ou compartilhado.
* **Hierarquia de Recursos**: Cada Workspace possui sua própria Biblioteca local de Assets, Projetos ativos, histórico de execuções e tokens/créditos de computação.
* **Controle de Membros**: Suporta níveis de acesso distintos (Dono, Administrador, Editor, Visualizador/Executor).

### 2.2 Biblioteca (Library)
* **O que é**: O repositório centralizado de Assets do Workspace. É o "painel de controle" do desenvolvedor ou criador.
* **Organização**: Divide-se em abas dinâmicas ou visualizações filtradas: *Meus Assets*, *Instalados do Marketplace*, *Remixes Ativos* e *Arquivados*.
* **Escalabilidade**: Oferece filtros de busca avançados por tipo (MicroApp, Skill, Agent, Automation), tags e status (Em Rascunho, Publicado, Deploy Ativo).

### 2.3 Asset
* **O que é**: A entidade fundamental compartilhável e executável na ForgeHub AI. Todo MicroApp, Skill, AI Agent ou Automação é, por definição, um Asset.
* **Imutabilidade de Instâncias**: Uma vez publicado, a versão específica do Asset é imutável. Alterações geram novas versões, garantindo que deploys existentes nunca quebrem (Zero-Downtime e Dependência Segura).
* **Estrutura Básica**: Possui metadados essenciais (ID único, nome, descrição, tags, banner/ícone, criador, licença de uso, parâmetros de entrada/saída).

### 2.4 Skill
* **O que é**: Um bloco funcional isolado de capacidade de inteligência artificial ou de integração. Uma Skill resolve um problema de forma determinística ou probabilística (ex: "Traduzir texto", "Consultar base de dados", "Gerar copy para e-mail").
* **Composição**: Consiste em um ou mais Prompts otimizados, uma chamada de API configurável, ou lógica executável de transformação de dados.
* **Consumo**: Skills não rodam sozinhas no vácuo; elas são plugadas em **AI Agents** para dar-lhes "superpoderes" ou chamadas dentro de **Automações**.

### 2.5 AI Agent
* **O que é**: Uma entidade autônoma e inteligente configurada com uma Persona (System Prompt), Memória de longo/curto prazo e uma lista de **Skills** autorizadas.
* **Processamento**: Opera em um ciclo de raciocínio dinâmico (Reasoning Loop - ex: ReAct). Ele recebe inputs do usuário, decide quais Skills executar, consolida as respostas e retorna o resultado.
* **Comunicação**: Pode expor uma interface conversacional (Chat) ou API endpoint.

### 2.6 Template
* **O que é**: Um modelo de Asset pré-configurado que serve como ponto de partida (esquema estrutural).
* **Inicialização**: Ao utilizar um Template, o usuário cria uma nova instância de Asset independente (fork) dentro de seu Workspace, herdando todas as conexões, prompts e configurações padrão prontos para modificação.

### 2.7 Automação (Automation)
* **O que é**: Um fluxo de trabalho baseado em eventos (Trigger -> Action) que orquestra múltiplos Assets, Skills ou integrações externas em sequência.
* **Lógica**: Utiliza estruturas condicionais (If/Else), loops (For Each) e esperas (Wait) para executar tarefas em background sem intervenção humana.

### 2.8 Projeto (Project)
* **O que é**: Um ambiente de desenvolvimento sandbox ou pasta lógica no Workspace.
* **Função**: Agrupa múltiplos Assets correlacionados que fazem parte do mesmo produto ou iniciativa comercial (ex: "Projeto Lançamento Produto X" que agrupa o Agent de suporte, o MicroApp de copy e a Automação de e-mails).

### 2.9 Remix
* **O que é**: O ato de clonar um Asset existente (do Marketplace ou de outro criador autorizado) para o próprio Workspace para fins de customização.
* **Rastreabilidade**: O novo Asset gerado mantém um link indelével com o Asset pai (Linhagem de Criação). Se o criador original atualizar o Asset pai, o proprietário do Remix é notificado e pode optar por mesclar (Merge) as atualizações ou manter a bifurcação isolada.

### 2.10 Atualização (Update)
* **O que é**: O processo de aplicar modificações em um Asset existente.
* **Fluxo Semântico**: Toda alteração de código ou de lógica incrementa a versão (ex: v1.0.1 para correções menores, v1.1.0 para novas Skills, v2.0.0 para mudanças que alteram os parâmetros de entrada).

### 2.11 Publicação (Publishing)
* **O que é**: A transição de um Asset de estado *Privado* para *Público* ou *Corporativo* (dentro da organização).
* **Validação**: Passa por uma esteira automática de conformidade (validação de injeção de prompt, checagem de integridade de links e segurança de chaves de API ocultas).

### 2.12 Favorito (Favorite)
* **O que é**: Um atalho rápido do usuário para acesso instantâneo a Assets específicos na barra lateral ou no painel do Dashboard principal.
* **Escopo**: É uma preferência a nível de usuário (User-level Preference), não afetando a Biblioteca ou o Workspace de outros membros da equipe.

### 2.13 Categoria (Category)
* **O que é**: Uma taxonomia formal, estática e mútua-exclusiva atribuída pelo sistema para fins de classificação estrutural no Marketplace e na busca.
* **Exemplos**: Marketing, Produtividade, Educação, Desenvolvimento, Finanças.

### 2.14 Coleção (Collection)
* **O que é**: Uma estrutura de agrupamento dinâmico e flexível criada pelo usuário dentro do seu Workspace.
* **Características**: Um único Asset pode pertencer a múltiplas Coleções simultaneamente (ex: "Marketing de Conteúdo" e "Projetos Q3").

### 2.15 Histórico (Logs / Run History)
* **O que é**: O diário de bordo imutável de todas as transações, chamadas de API, execuções de prompts e fluxos de automação realizados no Workspace.
* **Importância**: Essencial para depuração (Debugging), auditoria de custos e verificação de alocação de créditos consumidos por cada agente ou usuário.

### 2.16 Backup
* **O que é**: Uma imagem (Snapshot) em tempo real do estado completo do Workspace, incluindo layouts de assets, dados salvos nas memórias dos agentes e histórico.
* **Restauração**: Permite restaurar o Workspace a qualquer ponto histórico em caso de erros fatais de configuração de equipe.

### 2.17 Versão (Version Control)
* **O que é**: Controle de versionamento nativo inspirado em Git adaptado para lógica No-Code de Inteligência Artificial.
* **Branches**: Suporta desenvolvimento em rascunhos (Draft) paralelos ao Deploy em produção estável (Active Version).

### 2.18 Deploy
* **O que é**: O ato de empacotar e disponibilizar uma versão específica de um Asset para execução real.
* **Atribuição de URL**: Gera um endpoint REST API estável e seguro, um widget de chat embutível (iframe/SDK) ou uma página web estática independente para o usuário final interagir com o Asset.

### 2.19 Compartilhamento (Share)
* **O que é**: Mecanismo de colaboração externa.
* **Níveis de Compartilhamento**:
  1. *Apenas Execução*: Usuários externos interagem com a IA sem visualizar a engenharia de prompt ou configurações.
  2. *Duplicação Comercial*: Outros usuários podem instalar uma cópia do Asset em seus próprios Workspaces (Remix).

### 2.20 Licença (License)
* **O que é**: Contrato legal anexado a Assets publicados no Marketplace.
* **Modelos**:
  * *Open Source (MIT/Apache)*: Uso livre e modificação sem royalties.
  * *Uso Comercial Limitado*: Permite executar mas proíbe a redistribuição ou comercialização de Remixes derivados.
  * *Royalties por Execução*: Cobrança de micro-tarifas enviadas ao criador original a cada chamada realizada.

### 2.21 Assinatura e Faturamento (Billing & Subscription)
* **O que é**: O modelo de monetização do Workspace.
* **Vínculo**: A assinatura está vinculada ao Workspace, não ao usuário individual. Uma organização pode gerenciar múltiplos Workspaces com planos e métodos de pagamento diferentes.

### 2.22 Plano Gratuito (Free Tier)
* **O que é**: Limite de entrada para experimentação.
* **Limitações**: Restrito a 1 Workspace pessoal, até 3 Assets ativos, número limitado de execuções de agentes por mês (cota básica de tokens) e sem direito a deploys de API externos ou white-label.

### 2.23 Plano Premium (Pro/Enterprise Tier)
* **O que é**: Plano para times e criadores profissionais.
* **Vantagens**: Workspaces colaborativos com membros ilimitados, deploys de API de alta performance com baixa latência, histórico de logs estendido por 90 dias, acesso prioritário a modelos avançados de IA (OpenAI, Gemini Pro, Anthropic) e exportação/importação irrestrita.

### 2.24 Busca Inteligente (Semantic Search)
* **O que é**: Motor de busca alimentado por embeddings vetoriais de IA.
* **Diferencial**: Compreende a intenção conceitual do usuário na barra global. Digitar "preciso de algo para escrever e-mails de vendas frios" retornará Skills de escrita de copy mesmo que o termo exato não exista no título do Asset.

### 2.25 Dashboard
* **O que é**: O centro nervoso visual do Workspace.
* **Função**: Exibe em tempo real o uso do Workspace (créditos gastos, performance dos agentes ativos, deploys com erros, acessos recentes e atividades recentes da equipe).

### 2.26 Pesquisa Global (Omni-Search)
* **O que é**: A interface unificada de comando e busca acionada por `⌘K`.
* **Escopo de Resultados**: Retorna instantaneamente arquivos, assets, membros da equipe, configurações, documentação de ajuda e comandos rápidos de ação (ex: `/create agent`).

### 2.27 Documentação (Docs)
* **O que é**: Base de conhecimento interativa integrada diretamente à interface.
* **Contextualização**: Oferece guias detalhados sobre como criar prompts, depurar conexões de API e otimizar a velocidade de processamento dos agentes.

### 2.28 Sistema de Ajuda (Help & Support)
* **O que é**: Canal direto de suporte integrado com assistente de IA treinado na documentação da ForgeHub. Resolve dúvidas técnicas em tempo real e escala problemas de faturamento para atendentes humanos quando necessário.

### 2.29 Marketplace
* **O que é**: A loja descentralizada de Assets da ForgeHub.
* **Economia de Criadores**: Permite que desenvolvedores de IA vendam suas Skills, Agentes avançados e Automações, criando um fluxo contínuo de receita e uma biblioteca infinita para os usuários da plataforma.

### 2.30 Sistema de Avaliações (Review & Rating System)
* **O que é**: Mecanismo de curadoria social do Marketplace baseado em provas de execução bem-sucedidas.
* **Critérios**: Usuários avaliam a precisão, velocidade de resposta, documentação e custo de execução de cada Asset do Marketplace.

### 2.31 Importação
* **O que é**: Capacidade de trazer estruturas externas para a ForgeHub.
* **Formatos**: Suporta importação de arquivos de configuração JSON/YAML contendo definições de Prompts no formato padrão de orquestradores (LangChain, LlamaIndex, OpenAI Assistant specs).

### 2.32 Exportação
* **O que é**: Garantia de não aprisionamento tecnológico (No Vendor Lock-In).
* **Formatos**: Exporta qualquer Asset ou fluxo de Automação para formatos universais ou SDKs executáveis em infraestrutura própria de nuvem (ex: Dockerfile gerado automaticamente ou código nativo em Python/Node.js).

---

## 3. MODELO DE ENTIDADES (SCHEMA CONCEITUAL)

Abaixo, detalhamos o dicionário de dados conceitual das entidades principais que governam o ecossistema ForgeHub AI.

```
+---------------------------------------------------------------------------------+
|                                 1. WORKSPACE                                    |
|  - id: UUID (Primary Key)                                                       |
|  - name: String                                                                 |
|  - slug: String (Unique, URL safe)                                              |
|  - plan_id: UUID (Foreign Key to Plan)                                          |
|  - credit_balance: Decimal                                                       |
|  - created_at: DateTime                                                         |
|  - active_settings: JSONB (Configurations)                                      |
+---------------------------------------------------------------------------------+
                                      | 1
                                      |
                                      | N
+---------------------------------------------------------------------------------+
|                                  2. USER                                        |
|  - id: UUID (Primary Key)                                                       |
|  - email: String (Unique)                                                       |
|  - full_name: String                                                            |
|  - avatar_url: String (Nullable)                                                |
|  - status: Enum (ACTIVE, INACTIVE, SUSPENDED)                                   |
+---------------------------------------------------------------------------------+
                                      | 1
                                      |
                                      | N (via WorkspaceMember)
+---------------------------------------------------------------------------------+
|                             3. WORKSPACE_MEMBER                                 |
|  - workspace_id: UUID (FK to Workspace)                                         |
|  - user_id: UUID (FK to User)                                                   |
|  - role: Enum (OWNER, ADMIN, EDITOR, VIEWER)                                    |
|  - joined_at: DateTime                                                          |
+---------------------------------------------------------------------------------+
                                      |
                       +--------------+--------------+
                       | 1                           | 1
                       | N                           | N
+----------------------+----------------------+ +----+----------------------------+
|               4. ASSET                      | |           5. PROJECT               |
|  - id: UUID (PK)                            | |  - id: UUID (PK)                   |
|  - workspace_id: UUID (FK to Workspace)     | |  - workspace_id: UUID (FK)         |
|  - type: Enum (MICROAPP, SKILL, AGENT, AUTO)| |  - name: String                    |
|  - parent_id: UUID (FK to Asset, Nullable)  | |  - description: Text               |
|  - name: String                             | |  - created_at: DateTime            |
|  - status: Enum (DRAFT, STABLE, DEPLOYED)   | +------------------------------------+
|  - rating: Float                            |
|  - is_premium: Boolean                      |
+---------------------------------------------+
                       | 1
                       |
                       +---------------+---------------+
                       | 1                             | 1
                       | 1                             | 1
+----------------------+----------------------+ +------+----------------------------+
|             6. ASSET_VERSION                | |         7. DEPLOYMENT              |
|  - id: UUID (PK)                            | |  - id: UUID (PK)                   |
|  - asset_id: UUID (FK to Asset)             | |  - asset_version_id: UUID (FK)     |
|  - version_string: String (SemVer, ex: 1.2.0)| |  - endpoint_url: String           |
|  - configuration: JSONB (Engine schema)     | |  - status: Enum (ONLINE, OFFLINE)  |
|  - created_by: UUID (FK to User)            | |  - rate_limit: Integer             |
+---------------------------------------------+ +------------------------------------+
```

### 3.1 Definição Detalhada de Atributos das Entidades

#### Entity: Asset
* **id**: UUID v4 (Identificador global absoluto).
* **workspace_id**: UUID (Referência ao Workspace que possui ou licenciou o Asset).
* **type**: Enum (`MICROAPP`, `SKILL`, `AGENT`, `AUTOMATION`) - Especificação estrutural do Asset.
* **parent_id**: UUID (Referência ao Asset original de onde este foi derivado via Remix. Null se criado do zero).
* **name**: String (Título legível do Asset).
* **description**: Text (Descrição funcional e explicativa do Asset).
* **category_id**: UUID (Vínculo com a taxonomia estática do sistema).
* **created_by_user_id**: UUID (Criador inicial da primeira versão).
* **status**: Enum (`DRAFT`, `STABLE`, `ARCHIVED`) - Estado de ciclo de vida de desenvolvimento do Asset.
* **rating**: Float (Média de avaliações se publicado no Marketplace).
* **is_premium**: Boolean (Se requer assinatura Premium ou créditos extras para execução).

#### Entity: Skill (Extensão da tabela base Asset ou tabela filha 1:1)
* **asset_id**: UUID (Referência 1:1 à entidade base Asset).
* **engine_type**: Enum (`GENERATIVE_PROMPT`, `CODE_FUNCTION`, `REST_API_ACTION`).
* **prompt_template**: Text (Template estruturado com placeholders entre chaves `{input_data}`).
* **api_endpoint**: String (Configuração de URL se a Skill for uma integração externa de API).
* **secrets_mapping**: JSONB (Chaves criptografadas de API mapeadas do cofre de segredos do Workspace).

#### Entity: AI Agent (Extensão da tabela base Asset ou tabela filha 1:1)
* **asset_id**: UUID (Referência 1:1 à entidade base Asset).
* **persona_prompt**: Text (Instruções de sistema dominantes do agente que moldam seu comportamento).
* **model_provider**: Enum (`OPENAI`, `GEMINI`, `ANTHROPIC`, `LOCAL_LLM`).
* **temperature**: Float (Nível de criatividade/consistência do modelo, de 0.0 a 1.0).
* **memory_type**: Enum (`SHORT_TERM_CONTEXT`, `VECTOR_LONG_TERM`, `NO_MEMORY`).
* **skills_allowed**: Array[UUID] (Lista de IDs de Skills que o agente tem permissão para acionar durante o fluxo).

#### Entity: Project
* **id**: UUID v4.
* **workspace_id**: UUID (FK para Workspace).
* **name**: String.
* **description**: Text.
* **assets_included**: Array[UUID] (Relacionamento N:M mapeado entre Assets e Projetos).
* **created_at**: DateTime.

#### Entity: Category
* **id**: UUID v4.
* **name**: String (Nome da categoria, ex: "Negócios", "Marketing").
* **slug**: String (URL formatada, ex: "negocios", "marketing").
* **icon_key**: String (Identificador do ícone vetorial correspondente no sistema).

#### Entity: Collection
* **id**: UUID v4.
* **workspace_id**: UUID (FK para Workspace).
* **name**: String (Título personalizado pelo usuário).
* **tag_color**: String (Código Hexadecimal de cor para diferenciação visual).
* **assets**: Array[UUID] (Lista dinâmica de Assets pertencentes à Coleção).

#### Entity: Workspace
* **id**: UUID v4.
* **name**: String.
* **slug**: String (URL exclusiva da organização, ex: `empresa-alfa`).
* **plan_id**: UUID (FK para a definição de limites e funcionalidades de faturamento).
* **credit_balance**: Decimal (Saldo monetário de créditos para execução de chamadas e processamento de tokens).

#### Entity: User
* **id**: UUID v4.
* **email**: String (Campo de login unificado).
* **full_name**: String.
* **avatar_url**: String (Link da imagem de perfil).
* **created_at**: DateTime.

#### Entity: Team (Configuração Organizacional)
* **id**: UUID v4.
* **name**: String.
* **organization_domain**: String (Permite agrupamento por domínio de e-mail comum, ex: `@empresa.com`).

#### Entity: Plan
* **id**: UUID v4.
* **name**: Enum (`FREE_TIER`, `PRO_PLAN`, `ENTERPRISE_ORGANIZATION`).
* **monthly_cost**: Decimal.
* **token_limit**: Long (Limite de tokens de processamento incluídos).
* **max_members**: Integer (Máximo de usuários permitidos por Workspace).
* **max_deploys**: Integer (Máximo de deploys ativos concorrentes).

#### Entity: License
* **id**: UUID v4.
* **asset_id**: UUID (FK para o Asset original no Marketplace).
* **purchased_by_workspace_id**: UUID (FK para o Workspace comprador).
* **license_type**: Enum (`SINGLE_USE`, `DEVELOPER_UNLIMITED`, `COMMERCIAL_REDISTRIBUTE`).
* **price_paid**: Decimal.
* **purchased_at**: DateTime.

#### Entity: AssetVersion
* **id**: UUID v4.
* **asset_id**: UUID (FK para o Asset pai).
* **version_string**: String (Siga o padrão Semantic Versioning, ex: `v2.1.4`).
* **changelog**: Text (Explicação sobre as alterações introduzidas).
* **engine_payload**: JSONB (A árvore de configuração completa do Asset serializada de forma estável no momento da publicação).
* **created_at**: DateTime.

#### Entity: Template (Esquema lógico para novas instâncias)
* **id**: UUID v4.
* **asset_id**: UUID (Referência ao Asset que serve como modelo de herança estrutural).
* **is_featured**: Boolean (Destaque editorial na página de onboarding/criação).

#### Entity: MicroApp
* **asset_id**: UUID (Referência 1:1 à base de Assets).
* **ui_schema**: JSONB (A definição visual dos campos de formulário dinâmico que o usuário interage - ex: inputs de texto, upload de arquivos, seletores de arquivos).
* **output_format**: Enum (`TEXT_MARKDOWN`, `JSON_STRUCTURED`, `IMAGE_GENERATIVE`, `AUDIO_FILE`).

#### Entity: Automation (Orquestrador de Fluxos)
* **asset_id**: UUID (Referência 1:1 à base de Assets).
* **trigger_config**: JSONB (O gatilho de execução: ex: Webhook recebido, Cron agendado ou alteração no banco de dados).
* **step_sequence**: JSONB (A lista sequencial e ramificada de ações lógicas contendo chamadas para Skills, condicionais e saídas).

#### Entity: Prompt (Bloco básico de lógica LLM)
* **id**: UUID v4.
* **skill_id**: UUID (FK para a Skill proprietária).
* **raw_prompt_text**: Text (Contém a engenharia de prompt base).
* **system_context**: Text (Contextualização e restrições de comportamento).
* **variables**: JSONB (Estrutura de variáveis aceitas, ex: `["cliente", "proposta"]`).

#### Entity: Document (Documentação Técnica Contextual)
* **id**: UUID v4.
* **title**: String.
* **slug**: String.
* **content_markdown**: Text.
* **associated_asset_id**: UUID (FK para o Asset correspondente se for uma documentação específica).

#### Entity: Tutorial (Guias passo-a-passo)
* **id**: UUID v4.
* **title**: String.
* **steps**: JSONB (Lista ordenada de passos interativos com imagens, explicações e metas de progresso para onboarding do usuário).

---

## 4. RELACIONAMENTOS DO SISTEMA OPERACIONAL

### 4.1 Isolar e Conectar: A Visão de Relacionamento de Entidades

A força operacional da ForgeHub AI reside na forma como as entidades se acoplam de maneira flexível (loosely coupled) e escalam sem gerar gargalos de consistência no banco de dados.

1. **Workspace e Membros (1:N & N:M)**
   * Um **Workspace** possui múltiplos **WorkspaceMembers**.
   * Um **User** pode se associar a múltiplos Workspaces via a tabela de associação **WorkspaceMember**, permitindo transitar instantaneamente entre contextos de trabalho sem precisar de novas contas ou autenticação.

2. **A Hierarquia de Assets (Herança e Remix - 1:N)**
   * Um **Asset** pode dar origem a múltiplos Assets via **Remix**. A rastreabilidade é mantida pelo campo `parent_id`.
   * Quando ocorre o Remix, um registro de **Asset** inteiramente novo é gerado apontando para o Workspace de destino. O relacionamento entre o Asset filho e o original é puramente genealógico, garantindo isolamento total de modificações.

3. **Assets e suas Especializações (Herança Conceitual 1:1)**
   * A entidade abstrata **Asset** é concretizada através de relacionamentos de cardinalidade 1:1 estritos com **Skill**, **AI Agent**, **MicroApp** ou **Automation**.
   * Isso nos permite usar uma única tabela unificada para o motor de Busca Global, Marketplace, Favoritos, logs e licenciamento, simplificando imensamente as buscas rápidas.

4. **Skills de IA, Prompts e Agentes (N:M)**
   * Uma **Skill** pode conter múltiplos **Prompts** (1:N) que rodam sob diferentes condições.
   * Um **AI Agent** pode possuir autorização para acionar múltiplas **Skills** durante o processamento.
   * Este relacionamento é do tipo N:M, implementado através de uma tabela de junção contendo metadados de acesso, garantindo que uma única Skill otimizada possa servir simultaneamente a 50 agentes diferentes no Workspace sem duplicação de dados.

5. **Assinatura, Limites e Consumos (1:1)**
   * O **Plan** define limites estritos e fixos de recursos.
   * O **Workspace** consome esses limites. No momento da execução de qualquer Skill de IA ou agente, o sistema verifica a saúde financeira (saldo de tokens/créditos) do Workspace de forma síncrona antes de liberar a computação e registra o consumo exato de tokens na tabela imutável de **Logs/Histórico**.

---

## 5. ARQUITETURA LÓGICA DO ECOSSISTEMA

### 5.1 O Fluxo de Dados de Execução (AI Execution Pipeline)

Abaixo, o diagrama detalhado mostra a jornada de uma requisição de usuário interagindo com um AI Agent através de um deploy de produção (API ou Chat Widget) até a resolução das Skills configuradas:

```
[ Usuário / Endpoint REST API ]
              │
              ▼  (1) Envia Input de Texto / Arquivos
     ┌─────────────────┐
     │  API Gateway &  │◄───── (2) Valida Chave de API, Limites de Uso
     │ Rate Limiter    │       e Saldo de Créditos do Workspace
     └────────┬────────┘
              │
              ├───────► [ Se Saldo Negativo ] ──────► [ Retorna Erro 402 Payment Required ]
              │
              ▼  (3) Fluxo Autorizado
     ┌─────────────────┐
     │  Agent Runtime  │◄───── (4) Busca Prompt de Persona, Temperatura
     │  Context Engine │       e Lista de Skills autorizadas no Banco
     └────────┬────────┘
              │
              ├───────► [ Se Raciocínio requer uso de ferramentas externas ]
              │                       │
              │                       ▼ (5) Dispara Skill
              │              ┌─────────────────┐
              │              │  Skill Executor │◄──── (6) Injeta variáveis no Prompt e
              │              │   Sub-Engine    │      conecta segredos criptografados
              │              └────────┬────────┘
              │                       │
              │                       ▼ (7) Envia payload limpo para o LLM
              │              ┌──────────────────┐
              │              │ LLM Provider     │ (OpenAI, Gemini, local)
              │              │ (Inference API)  │
              │              └────────┬─────────┘
              │                       │
              │                       ▼ (8) Retorna resultado processador
              │              ┌─────────────────┐
              │              │  Skill Outbound │
              │              │  Data Sanitizer │
              │              └────────┬────────┘
              │                       │
              ◄───────────────────────┘ (9) Retorna o resultado da ferramenta para o Agente
              │
              ▼ (10) Raciocínio concluído pelo Agente
     ┌─────────────────┐
     │ Log & Billing   │───────► (11) Calcula quantidade de tokens usados,
     │ Transaction     │         grava log de auditoria imutável e debita saldo.
     └────────┬────────┘
              │
              ▼ (12) Retorna resposta limpa
[ Usuário / Resposta Final ]
```

---

## 6. NAVEGAÇÃO E MAPA DE TELAS (500+ ASSETS SCALING)

Para organizar uma volumosa biblioteca contendo centenas de assets sem perder a fluidez visual, estruturamos a navegação em uma hierarquia de três níveis estritos, projetada para evitar rolagem interminável e cansaço visual.

### 6.1 Árvore Completa de Navegação da Interface (Sitemap)

```
[Raiz do Aplicativo]
 │
 ├── 1. ONBOARDING & AUTENTICAÇÃO (Módulos de Entrada)
 │    ├── Splash Screen / Boas-vindas (Conceitual)
 │    ├── Login / Cadastro Corporativo
 │    └── Assistente de Criação do Primeiro Workspace (Interativo)
 │
 ├── 2. PORTAL DO SAAS (Área de Trabalho Principal - Layout de Duas Colunas Adaptável)
 │    │
 │    ├── barra_lateral (Sidebar Estática / Teclado Rápido)
 │    │    ├── Perfil do Usuário Ativo (Cristiane Silva - Plano Pro)
 │    │    ├── Seletor de Workspace (Troca de escopo em 1 clique)
 │    │    ├── Menu de Navegação Primário:
 │    │    │    ├── Dashboard (Visão geral de telemetria)
 │    │    │    ├── Biblioteca (Foco em Gerenciamento)
 │    │    │    ├── MicroApps
 │    │    │    ├── Skills
 │    │    │    ├── AI Agents
 │    │    │    ├── Automations
 │    │    │    ├── Templates (Ponto de partida)
 │    │    │    └── Academy (Documentação & Tutoriais)
 │    │    └── Central de Atalhos Corporativos (Upgrade para Pro / Gestão de Membros)
 │    │
 │    ├── painel_de_busca_global (⌘K Overlay Inteligente - Busca Semântica)
 │    │    ├── Resultados Recentes
 │    │    ├── Sugestões de Agentes / Skills recomendados
 │    │    └── Modo Console de Ações Rápidas (Ex: digite "> criar" para ver atalhos de criação)
 │    │
 │    ├── 2.1 DASHBOARD CENTRAL (Visão Geral Operacional)
 │    │    ├── Banner de Status do Sistema (Crie, Personalize, Lance)
 │    │    ├── Indicadores de Telemetria (Assets totais, publicados, horas salvas)
 │    │    ├── Bloco de Acesso Rápido a itens de uso frequente
 │    │    ├── Visualização de Atividade Recente (Feed em tempo real)
 │    │    └── Módulos de Estatísticas Visuais (Gráficos de alocação de uso e categorias populares)
 │    │
 │    ├── 2.2 BIBLIOTECA DE ASSETS (O Coração da Organização para 500+ Itens)
 │    │    ├── Seletor de Filtro de Categoria (Todos, Recentes, Favoritos, Remixados)
 │    │    ├── Grade Dinâmica de Itens (Paginação infinita com carregamento sob demanda/lazy-loading)
 │    │    └── Painel de Visualização Lateral (Detail Sheet - abre ao clicar em um Asset sem trocar de tela)
 │    │         ├── Metadados técnicos & histórico de versões do Asset
 │    │         ├── Botão Executar / Testar instantaneamente
 │    │         └── Ações de Desenvolvimento (Editar Prompt, Configurar Skills, Duplicar, Deletar)
 │    │
 │    ├── 2.3 ESTÚDIO DE DESIGN & CRIAÇÃO (Canvas Visual de Engenharia)
 │    │    ├── Modo Rascunho de Prompt (Prompt Engineer Studio com chat teste lateral)
 │    │    ├── Configuração de Ferramentas / Skills (Arrastar e Soltar capacidades para o Agente)
 │    │    └── Gerenciador de Segredos e Parâmetros de API (Variáveis de ambiente isoladas)
 │    │
 │    └── 2.4 CENTRAL DE CONTROLE DE INFRAESTRUTURA & GESTÃO (Configurações)
 │         ├── Controle de Equipe (Convites, Permissões baseadas em papéis)
 │         ├── Faturamento, Histórico de Faturas e Compra de Créditos computacionais
 │         ├── Monitoramento de Logs Técnicos (Logs em formato de terminal para desenvolvedores)
 │         └── Cofre de Chaves de API Global (Criptografia AES-GCM ponta a ponta)
 │
 └── 3. THE MARKETPLACE (Ecossistema Descentralizado de Compra/Venda de Recursos)
      ├── Vitrine de Assets em Destaque (Estilo de App Store limpa, alto contraste)
      ├── Categorias recomendadas e coleções curadas por editores
      ├── Página de Detalhes de Compra de Asset
      │    ├── Termos de Licenciamento de Uso
      │    ├── Avaliações, taxa de sucesso de execução e comentários de compradores
      │    └── Visualização de Documentação do Asset
      └── Painel do Vendedor (Rendimentos obtidos com royalties, relatórios de uso externo)
```

---

## 7. JORNADA DO USUÁRIO FINAL (USER FLOWS)

### 7.1 Fluxo de Remixagem de um Asset do Marketplace (Jornada de Customização)

O fluxo a seguir mapeia a experiência de um usuário que encontra um asset de terceiros e o adapta para seu uso corporativo sem tocar em uma única linha de código:

```
[ Usuário entra no Marketplace ] ──► [ Filtra ou busca semanticamente por "Escrita de E-mail" ]
                                                      │
                                                      ▼
                                   [ Clica no Asset "AI Cold Email Specialist" ]
                                                      │
                                                      ▼
                                   [ Lê documentação, preço de licença e avaliações ]
                                                      │
                                                      ▼
                                   [ Clica no botão "Fazer Remix para meu Workspace" ]
                                                      │
                                                      ▼
                       [ Plataforma valida saldo de créditos ou status do Plano Premium ]
                                                      │
                                                      ▼
                     [ Clona estrutura lógica básica do Asset e gera registro filho ]
                                                      │
                                                      ▼
                     [ Abre o Estúdio de Edição com o Asset clonado no modo "Draft" ]
                                                      │
                                                      ▼
                     [ Usuário altera instruções de contexto para se adequar ao seu tom ]
                                                      │
                                                      ▼
                     [ Testa em tempo real usando o chat de depuração lateral embutido ]
                                                      │
                                                      ▼
                     [ Clica em "Publicar Nova Versão estável (v1.0.0)" para o Workspace ]
```

### 7.2 Fluxo de Deploy de uma Automação Corporativa baseada em Eventos

Este fluxo documenta o processo de colocar uma automação para funcionar integrando disparadores externos de mercado:

```
[ Usuário clica em "Criar Automação" ] ──► [ Define o gatilho, ex: "Nova Proposta no CRM" ]
                                                       │
                                                       ▼
                                     [ Seleciona a Skill "Analisar Tom da Proposta" ]
                                                       │
                                                       ▼
                                     [ Seleciona a Skill "Gerar Contraproposta Personalizada" ]
                                                       │
                                                       ▼
                                     [ Conecta à Skill de Envio "Notificar Canal Slack" ]
                                                       │
                                                       ▼
                                     [ Clica em "Ativar Deploy e Monitoramento" ]
                                                       │
                                                       ▼
                             [ Plataforma gera o endpoint seguro e inicia escuta ativa ]
                                                       │
                                                       ▼
                     [ Monitora execuções, tempo de resposta e consumo no painel de Logs ]
```

---

## 8. CONSIDERAÇÕES FINAIS: A CONSTITUIÇÃO DA PLATAFORMA

Este documento do **Sistema Operacional ForgeHub AI** estabelece os alicerces definitivos para a governança de dados, comportamento da interface e arquitetura de componentes e serviços do ecossistema. 

Qualquer implementação técnica futura, design de telas, alteração em fluxos de banco de dados ou integração de novas capacidades de inteligência artificial deve, obrigatoriamente, ser avaliada em relação à conformidade com esta **Constituição**.

Com essa arquitetura de informação limpa, clara e focada no controle de versão, modularidade de blocos lógicos e escalabilidade taxonômica, a ForgeHub AI está capacitada para hospedar milhares de recursos inteligentes garantindo aos criadores e empresas mundiais uma experiência de desenvolvimento excepcionalmente rápida, fluida e de altíssimo valor de mercado.
