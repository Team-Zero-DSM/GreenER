# Arquitetura do Frontend — GreenER

Este documento descreve a organização e as funcionalidades da aplicação web
GreenER na versão integrada da Sprint 3. A arquitetura do backend está em
[`../backend/arquitetura.md`](../backend/arquitetura.md); os contratos de
comunicação estão em [`../docs/API.md`](../docs/API.md), e o modelo ambiental
está em [`../docs/cálculo.md`](../docs/cálculo.md).

## Estado atual e escopo

- `App.tsx` define login, início, serviços, regiões, ranking, comparação,
  relatórios, perfil, painel e configurações.
- `AuthProvider` mantém a sessão e consulta o perfil para restaurar o acesso.
  `ProtectedRoute` exige autenticação nas páginas internas.
- Os módulos de `api/` consultam o backend real e enviam JWT nas operações protegidas.
- `useApiQuery` busca ao montar, ao mudar dependências e quando `refreshKey` muda.
- `MonitoringProvider` observa `lastRoundFinishedAt` e solicita novas consultas.
- `ServiceDetailPage` usa detalhe e histórico persistido; os gráficos não usam mocks.
- `MonitoringBar` apresenta estado real, previsão de coleta e horário de atualização.
- O globo e os cards regionais exibem dados do backend; energia e emissões
  somam as amostras das últimas 24 horas.
- `PainelPage` permite escolher templates, editar widgets e salvar a configuração
  por usuário em `/api/v1/dashboards/me`.
- `AdminSettingsPage` reúne intervalo de coleta, parâmetros de estimativa e
  gerenciamento de usuários, com autorização de administrador no backend.
- `ReportsPage` apresenta seleção de serviços, filtros, prévia, histórico,
  exportação CSV e impressão pelo navegador.

## 1. Objetivo do frontend

O frontend é a interface pela qual usuários acompanham os serviços de software
monitorados pelo GreenER e compreendem suas métricas operacionais e seu impacto
ambiental estimado. A interface oferece uma visão consolidada e detalhada dos
serviços, localização, histórico, classificações, comparações e análises de
cenários, além de atualizar as informações sem recarga manual.

A interface deve apresentar dados rastreáveis, com unidades, contexto temporal
e estado operacional claros. Valores de consumo energético e CO₂e são
apresentados como estimativas somente quando o backend fornecer resultados
produzidos pelo modelo documentado. A interface não inventa nem recalcula
valores ambientais.

## 2. Responsabilidades e limites

O frontend:

- apresenta dashboard, listagens e detalhes de serviços;
- apresenta métricas operacionais, estado, região e momento da última
  atualização;
- oferece visualizações para histórico, classificação, comparação de serviços
  e regiões e simulação de cenários;
- executa a atualização periódica da interface sem recarregar a página;
- gerencia a experiência de autenticação e o envio de credenciais ou token nas
  operações protegidas;
- representa carregamento, sucesso, ausência de dados, dados desatualizados e
  falhas de comunicação.

O frontend comunica-se exclusivamente com a API do backend GreenER. O backend
integra as APIs externas, valida e processa seus dados, calcula os indicadores
ambientais, aplica as regras de negócio e consulta o PostgreSQL. O navegador
não acessa diretamente as APIs externas ou o banco e não é responsável por
autorização de acesso ou regras de negócio.

## 3. Fluxo e camadas da interface

```text
Usuário
   ↓
Rotas e páginas React
   ↓
Componentes de apresentação
   ↓
Hooks de consulta e estado de interface
   ↓
Serviços HTTP do frontend
   ↓
API REST do backend GreenER
   ↓
Services / Integrations / Repositories do backend
   ↓
APIs externas e PostgreSQL
```

- **Rotas** identificam as áreas da aplicação e os parâmetros de navegação,
  incluindo identificadores de serviços e regiões.
- **Páginas** coordenam os dados necessários à tela e compõem componentes
  reutilizáveis.
- **Componentes** exibem dados e controles da interface sem executar chamadas
  diretas à rede ou incorporar regras de negócio.
- **Hooks** encapsulam consultas, atualização periódica, filtros e outros
  comportamentos reutilizados pela interface.
- **Serviços HTTP** concentram a comunicação com os endpoints internos e a
  conversão das respostas em tipos utilizados pelo frontend.
- **Contexts e providers** compartilham somente estado que seja comum a
  diferentes áreas, como a sessão autenticada.

Na integração atual, os dados percorrem backend → frontend. Arquivos de mocks são demonstrativos e não alimentam as páginas integradas. As respostas e operações
seguem [`../docs/API.md`](../docs/API.md); o frontend não depende dos contratos
das APIs externas.

## 4. Tecnologias e padrões

A stack do frontend é:

- React e TypeScript;
- Vite;
- Tailwind CSS;
- shadcn/ui e Radix UI para componentes acessíveis;
- Lucide React para ícones;
- Geist Variable como tipografia;
- ESLint e Prettier para análise e formatação.

O código usa TypeScript estrito, JSX e o alias `@/` para importações a partir
de `src/`. O CSS global e `styles/theme.css` centralizam tema, tipografia, cores, bordas e
raios. Componentes derivados de shadcn/ui seguem esse sistema visual e devem
ser reutilizados em vez de duplicados.

O roteamento, o estado de consultas e o cache da API são infraestrutura
compartilhada da aplicação. A camada de serviços encapsula as consultas, e as
páginas não duplicam transporte HTTP nem lógica de sessão.

## 5. Estrutura de diretórios

```text
frontend/
├── arquitetura.md, Dockerfile, .env.example, package.json
├── tests/               # testes do armazenamento do painel por usuário
└── src/
    ├── App.tsx, main.tsx, index.css
    ├── api/             # cliente HTTP, sessão, contas, serviços, regiões,
    │                    # monitoramento, ranking, comparação, painel e relatórios
    ├── components/      # auth, painel, reports, charts, globe, services, shared e ui
    ├── contexts/        # AuthProvider, MonitoringProvider e contratos de contexto
    ├── hooks/           # autenticação, consultas, perfil, painel e histórico
    ├── layouts/         # AuthLayout e DashboardLayout
    ├── lib/             # transformação de dados e exportação de relatórios
    ├── pages/           # composição das telas
    ├── styles/          # tokens e tema compartilhado
    ├── types/           # modelos e contratos TypeScript
    └── utils/           # formatação, status e armazenamento do painel
```

### 5.1. Responsabilidades por área

- `main.tsx`: inicializa o React, `BrowserRouter` e `AuthProvider`.
- `App.tsx`: declara as rotas e aplica `ProtectedRoute` às páginas internas.
- `layouts/`: separa a autenticação da navegação principal. `DashboardLayout`
  compõe o cabeçalho, a barra e o provider de monitoramento.
- `pages/`: reúne componentes, hooks e ações de cada tela.
- `components/`: organiza formulários, widgets, gráficos e controles compartilhados.
- `api/`: concentra URLs, requisições, autenticação e contratos de transporte.
- `hooks/`: controla carregamento, filtros, atualização e gravação dos dados.
- `contexts/`: compartilha sessão e estado de monitoramento.
- `types/`: define os dados recebidos da API e os modelos usados pela interface.
- `lib/` e `utils/`: reúnem transformações, exportação, formatação e armazenamento local.

## 6. Áreas do produto e navegação

### 6.1. Serviços e indicadores

`DashboardPage` apresenta serviços, estados operacionais e métricas recentes.
`ServiceDetailPage` reúne identificação, região, métricas, gráficos e histórico
persistido. Os valores incluem unidades e período de consulta.

### 6.2. Histórico, ranking e comparação

O histórico é consultado no detalhe de cada serviço. `RankingPage` apresenta
classificações com filtros de critério e período. `ComparisonPage` consulta
os serviços selecionados no mesmo intervalo e permite comparar cenários regionais.
Os resultados vêm dos endpoints do backend.

### 6.3. Regiões

`LandingPage` apresenta o globo e os cards regionais. `RegionPage` reúne
as visualizações de regiões, intensidade de carbono e indicadores ambientais.
Esses dados são consultados pela API do GreenER.

### 6.4. Autenticação, perfil e configurações

`AuthPage` reúne cadastro, login, solicitação de recuperação e redefinição
de senha. `AuthProvider` guarda a sessão, restaura o perfil e encerra o acesso
quando o backend rejeita o token. `ProfilePage` permite editar nome e e-mail
e alterar a senha atual.

`AdminSettingsPage` permite salvar o intervalo de coleta, simular e ativar
coeficientes e gerenciar papéis e acessos. A tela restringe as ações ao papel
administrador; o backend valida o JWT e a permissão em todas essas operações.
O intervalo é persistido e aplicado pelo agendador nas próximas rodadas.

### 6.5. Painel personalizável

`PainelPage` permite escolher templates, adicionar e remover widgets,
reposicionar, redimensionar e configurar os indicadores. O layout usa grades
para desktop e tablet e uma lista ordenada no mobile.

`usePainelConfig` consulta e grava o painel em `/api/v1/dashboards/me`.
A configuração local usa o ID do usuário na chave de armazenamento, mantendo
as preferências separadas entre contas do mesmo navegador.

### 6.6. Relatórios

`ReportsPage` reúne filtros e prévia na mesma página. Os serviços são agrupados
por região e podem ser selecionados individualmente, por grupo ou pelos botões
Todos e Nenhum. Os filtros incluem status e data da última atualização.
O histórico de energia e CO₂e pode ser incluído em linhas ou barras.

A fonte ativa, definida em `api/reports/reportConfig.ts`, é `services`.
`reportsApi.services.ts` consulta serviços, regiões e histórico pela API e
prepara os dados exibidos. A exportação CSV usa os serviços selecionados;
Exportar PDF aciona `window.print()` e permite salvar pelo diálogo do navegador.
Os endpoints de prévia e PDF do backend são operações separadas, descritas
no [contrato da API](../docs/API.md#29-relatórios-e-exportação-em-pdf).

### 6.7. Rotas da aplicação

| Rota             | Componente          | Comportamento                                           |
| ---------------- | ------------------- | ------------------------------------------------------- |
| `/`              | `Navigate`          | Redireciona para `/login`.                              |
| `/login`         | `AuthPage`          | Cadastro, login e recuperação de senha em `AuthLayout`. |
| `/inicio`        | `LandingPage`       | Globo, regiões e totais das últimas 24 horas.           |
| `/dashboard`     | `DashboardPage`     | Serviços, filtros, status e última coleta.              |
| `/servicos/:id`  | `ServiceDetailPage` | Detalhe e histórico do serviço.                         |
| `/regioes`       | `RegionPage`        | Visualizações e indicadores regionais.                  |
| `/ranking`       | `RankingPage`       | Classificação por critério e período.                   |
| `/comparacao`    | `ComparisonPage`    | Comparação de serviços e cenários regionais.            |
| `/painel`        | `PainelPage`        | Widgets e configuração pessoal do painel.               |
| `/relatorio`     | `ReportsPage`       | Filtros, prévia, histórico, CSV e impressão.            |
| `/perfil`        | `ProfilePage`       | Dados pessoais e segurança da conta.                    |
| `/configuracoes` | `AdminSettingsPage` | Coleta, estimativas e usuários para administradores.    |

As páginas internas usam `ProtectedRoute` e `DashboardLayout`. O histórico
fica no detalhe; não há rota `/history`. A autorização administrativa também
é aplicada pelo backend, conforme o [contrato](../docs/API.md).

## 7. Atualização e estados de interface

`useMonitoringStatus` consulta `/api/v1/monitoring/status`. A próxima consulta é
agendada para `nextCollectionAt` mais 1 segundo; durante uma rodada, verifica de
novo em 1 segundo. Sem previsão ou após erro, tenta em 30 segundos.
`MonitoringProvider` detecta nova conclusão de rodada e incrementa `refreshKey`;
`useApiQuery` recarrega os dados da página sem navegação ou recarga manual.
O relógio da barra é atualizado a cada segundo, mas não substitui as consultas.
`screenUpdatedAt` indica a conclusão de uma consulta da interface; `collectedAt`
identifica a amostra de cada serviço. Uma resposta bem-sucedida não implica que
todos os serviços tiveram coleta recente.

Os estados abaixo orientam a apresentação; responsividade, acessibilidade e
cenários completos de falha ainda exigem validações próprias.

Cada consulta apresenta estados distintos:

- carregamento inicial;
- dados disponíveis;
- resposta válida sem registros;
- falha de rede ou erro retornado pelo backend;
- dados existentes cuja última atualização não é recente;
- atualização em andamento sem ocultar dados já apresentados.

Filtros e seleção de serviço, região e período permanecem coerentes durante as
atualizações. Uma falha de atualização não substitui dados válidos por zeros ou
por uma resposta com aparência de sucesso.

## 8. Dados ambientais e transparência

O backend é a fonte dos resultados calculados. O frontend apresenta consumo
energético e CO₂e quando o backend os fornecer, junto das unidades, período,
região e caráter estimado. A intensidade de carbono e a participação renovável
são exibidas com a região e o contexto temporal correspondentes.

As métricas operacionais não são, por si só, consumo energético. Portanto, a
interface não converte CPU, memória, disco ou rede em energia ou emissão. Se o
backend não puder fornecer um resultado válido, a interface informa que o
indicador não está disponível e, quando fornecida, apresenta a razão. Regras,
fórmulas, parâmetros e limitações estão em
[`../docs/cálculo.md`](../docs/cálculo.md).

## 9. Responsividade e acessibilidade

As telas devem ser verificadas em desktop, tablet e dispositivos móveis, usando os
protótipos do GreenER como referência visual. Navegação, tabelas e gráficos se
adaptam aos tamanhos de tela e preservam acesso às informações essenciais.

A implementação adota HTML semântico, rótulos acessíveis, navegação por teclado,
foco visível e contraste adequado. Estados e classificações não são
comunicados apenas por cor; valores incluem unidades e textos de apoio.

## 10. Configuração, segurança e qualidade

`VITE_API_URL` define a origem da API do backend. As páginas atuais usam HTTP real;
`VITE_USE_MOCKS` não controla esse fluxo. Variáveis `VITE_*` são
incorporadas ao bundle e, portanto, contêm somente configuração pública; tokens,
senhas e segredos não são armazenados nelas.

O cliente HTTP concentra a formação de URLs, cabeçalhos, tratamento de respostas
e erros. A sessão autenticada segue o contrato do backend; controles de rota
melhoram a experiência, mas não substituem autorização no servidor.

Os scripts de qualidade do frontend são:

```text
npm test             executar os testes do armazenamento do painel
npm run typecheck    verificar tipos TypeScript
npm run build        verificar tipos e gerar o build
npm run lint         executar ESLint
npm run format:check verificar formatação com Prettier
```

Cada tela deve ser validada nos estados de carregamento, sucesso, ausência de dados e
erro, em larguras desktop, tablet e mobile. A integração deve ser validada contra a API
do GreenER, e não por chamadas diretas às APIs externas.

## 11. Construção do produto

O frontend segue o [plano de entregas](../docs/plano-de-entregas.md):

1. **Sprint 1:** monitoramento, persistência, histórico, dashboard, mapa/globo,
   integração real e atualização automática.
2. **Sprint 2:** rankings e continuação de T15: serviços associados à região inspecionada.
3. **Sprint 3:** autenticação JWT, perfil, painel personalizável, administração
   de usuários, intervalo de coleta, coeficientes de estimativa e relatórios.

Ranking e comparação regional, implementados na Sprint 2, continuam disponíveis
na versão integrada.

As etapas organizam a implementação; não reduzem o escopo final do produto. As
telas descritas nesta arquitetura são parte da experiência GreenER e devem ser
integradas às capacidades correspondentes do backend, conforme
[`../backend/arquitetura.md`](../backend/arquitetura.md).
