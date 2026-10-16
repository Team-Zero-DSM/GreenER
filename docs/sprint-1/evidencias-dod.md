# Evidências de aplicação da Definition of Done — Sprint 1

Data da verificação: **15/10/2026**, horário de Brasília. Os timestamps das APIs
registrados abaixo estão em UTC; `16/10/2026 01:05 UTC` corresponde a
`15/10/2026 22:05` em Brasília.

Branch: `40-documentar-readme-e-registrar-dailys`. Código-base: `41808d7`.

Este registro aplica a [DoD do projeto](../../README.md) às **22 tarefas
marcadas como concluídas**, identificando escopo, procedimento, resultado e
evidência. As quatro histórias selecionadas continuam sendo **US01, US03,
US08 e US09**. A conclusão de uma tarefa não conclui automaticamente a história.

## 1. Critérios operacionais da DoD

Para declarar uma tarefa concluída, conferir os itens aplicáveis ao seu escopo:

1. Artefato ou comportamento previsto implementado.
2. Critérios de aceite da tarefa conferidos, com resultado registrado.
3. Verificações necessárias executadas ou inspeção do artefato documentada.
4. Integração exigida pela própria tarefa validada na versão apresentada.
5. Ausência de erro conhecido que impeça esse comportamento.
6. Código ou artefato integrado e disponível para a equipe.
7. Documentação correspondente atualizada.

Testes automatizados não são uma exigência acrescentada por este documento.
Validação de navegador, comandos, consultas HTTP/SQL e inspeção de artefatos
podem fornecer evidências, desde que o resultado e os limites fiquem claros.

T13 e T14 têm escopo visual: usar mocks identificados permite verificar esses
componentes. Integração real continua em T17. O globo pertence a T15, em andamento,
e não foi considerado entregue pela presença dos gráficos no detalhe.

## 2. Aplicação às tarefas concluídas

Os responsáveis pela implementação permanecem no [Sprint Backlog](./sprint-1.md).
Os resultados desta tabela foram registrados pela verificação técnica, não
atribuídos retrospectivamente a uma validação executada pelos integrantes.

| Tarefa | Escopo considerado concluído | Procedimento e resultado | Evidência | Limite da conclusão |
|---|---|---|---|---|
| T01 — Arquitetura | Documentação das partes, responsabilidades e fluxos. | Inspeção das arquiteturas, referências e distinção entre código existente e proposta futura. | [Backend](../../backend/arquitetura.md), [frontend](../../frontend/arquitetura.md), [API](../API.md). | Diagramas futuros não comprovam funcionalidades executáveis. |
| T02 — Estrutura do backend | Processo Express e organização inicial. | Health HTTP 200; TypeScript e lint sem erros; runtime Node 24 no diretório /backend. | [app.ts](../../backend/src/app.ts), [server.ts](../../backend/src/server.ts); verificações V01/V02. | Não inclui a listagem pendente de T05. |
| T03 — Descoberta | Consultar e interpretar os serviços da API externa. | MetricsClient.getServices retornou oito serviços; resposta validada pelo schema. | [MetricsClient](../../backend/src/integrations/metrics-api.ts); V03. | Endpoint interno de listagem é T05. |
| T04 — Modelo dos serviços | Converter o contrato externo ao modelo interno usado por collections. | Asserções confirmaram nomes internos, normalização de opcionais ausentes para null e preservação de cidade/coordenadas presentes. | [Mapper](../../backend/src/integrations/metrics-api.mapper.ts), [tipo](../../backend/src/shared/types/discovered-service.types.ts); V04, PR #59. | A issue #21 ainda deve refletir o aceite registrado; não foi alterada remotamente. |
| T06 — Integração de métricas | Consultar e validar métricas pelo metrics_path. | Consulta real de billing-api retornou os quatro campos de métricas e intervalo de amostra positivo de 27 s naquela execução. | [Schema](../../backend/src/integrations/metrics-api.schema.ts); V03. | Os valores e o intervalo variam entre chamadas. |
| T07 — Processamento | Calcular e persistir estimativas com os fatores associados à coleta. | Vinte coletas recalculadas: potência, energia e CO₂e conferiram dentro da precisão de armazenamento. | [CollectionsService](../../backend/src/modules/collections/collections.service.ts), [modelo](../cálculo.md); V05. | Verifica o modelo didático do desafio, não medição física. |
| T08 — Rotina periódica | Agendar rodadas sem reiniciar manualmente o processo. | Duas observações mostraram avanço de rodada e de última coleta; ambas registraram oito sucessos. | [Job](../../backend/src/jobs/collections.job.ts); V06. | Não conclui T10, que possui trabalho de testes e critérios próprios ainda em revisão. |
| T09 — Métricas no backend | Expor detalhe e última coleta de serviço. | Serviço conhecido retornou 200; ausente 404; identificador inválido 400; histórico válido 200 e filtro inválido 400. | [Rotas](../../backend/src/modules/services/services.routes.ts), [contrato](../API.md); V02. | A interface ainda não consome essas rotas reais. |
| T11 — Layout inicial | Referência visual do produto para três formatos. | PDFs desktop, tablet e mobile versionados; lista e detalhe abertos no navegador apresentam o tema e a composição implementados. | [Protótipos](../prototipo/prototipo.md), PR #50; V07/V09. | Não comprova toda a responsividade nem todas as telas futuras. |
| T13 — Detalhe visual | Exibir identificação, status, localização, métricas e indicadores. | svc-001 exibiu os campos e gráficos; 24h → 1h alterou seleção e totais; svc-002 mostrou ausência de métricas e de dados no período. | [Página](../../frontend/src/pages/ServiceDetailPage.tsx), PRs #53/#58; V07. | Resultados explicitamente simulados; integração pertence a T17. |
| T14 — Listagem visual | Receber serviços e apresentar identificação, campos e navegação. | Seis serviços renderizados; busca por svc-001 isolou um; filtros e estado vazio funcionaram; Detalhes navegou para /servicos/svc-001. | [Componente](../../frontend/src/components/services/ServiceList.tsx), PR #58; V08. | Mocks não demonstram listagem real do backend. |
| T20 — Estrutura PostgreSQL | DDL e base utilizada na persistência. | Schema aplicado sem erro em PostgreSQL vazio e descartável, criando seis tabelas e um conjunto ativo de parâmetros; consulta no banco existente confirmou seis tabelas. | [Schema](../../database/schema.sql), PR #41; V10. | Não representa migração de banco existente. |
| T21 — Container PostgreSQL | Serviço de banco acessível à aplicação e volume configurado. | pg_isready confirmou disponibilidade; backend leu dados; Compose declara volume persistente. | [Compose](../../docker-compose.yml), PR #43; V01/V10. | Retenção após reinicialização controlada ainda precisa de verificação própria para BD03. |
| T22 — Docker do backend | Backend executando no container com ambiente de desenvolvimento. | Processo saudável; /backend e Node v24.21.0 confirmados; health, tipagem e lint passaram. | [Dockerfile](../../backend/Dockerfile); V01/V02. | Não foi reconstruída uma imagem sem cache nesta verificação. |
| T23 — Docker do frontend | Vite e aplicação acessíveis pelo container. | /app e Node v24.21.0 confirmados; páginas abertas no navegador; tipagem e lint passaram. | [Dockerfile](../../frontend/Dockerfile); V01/V07/V08. | Não substitui teste completo em dispositivos móveis. |
| T24 — Docker Compose | Serviços e rede de desenvolvimento definidos e executando. | compose config --quiet aceitou a configuração; três serviços ativos, backend e banco saudáveis. | [Compose](../../docker-compose.yml); V01. | Validação nos containers existentes, não em clone limpo. |
| T25 — Ambiente compartilhado | Configuração versionada de ambiente, Git e fluxo de branches. | Inspeção de exemplos de ambiente, Compose, workflow e histórico de branches/PRs; branch atual confirmada. | [Backend .env.example](../../backend/.env.example), [frontend .env.example](../../frontend/.env.example), [CI](../../.github/workflows/ci.yml). | Não afirma que cada computador da equipe foi individualmente testado. |
| T26 — Documentação inicial de execução | Descrever instalação, ambiente, endereços e operação. | Comandos de status, configuração, tipagem e lint executados; caminhos relativos e limites da interface conferidos. | [README](../../README.md); V01/V02/V09. | Reprodução a partir de clone limpo permanece não executada. |
| T27 — Casos de uso | Artefato de modelagem versionado e acessível na documentação. | Arquivo SVG e referências locais conferidos; XML bem formado. | [Modelagem](../arquitetura/arquitetura.md), [SVG](../arquitetura/images/caso-de-uso.svg); V09. | Inspeção estrutural não equivale a homologação de cada fluxo futuro. |
| T28 — Classes | Modelo inicial de classes versionado. | SVG e referência documental conferidos; XML bem formado. | [SVG](../arquitetura/images/diagrama-de-classes.svg), PR #49; V09. | Modelo inicial pode incluir responsabilidades futuras já identificadas na arquitetura. |
| T29 — Sequências | Diagramas iniciais disponíveis e vinculados aos fluxos descritos. | Três SVGs de sequência e links locais conferidos; XML bem formado. | [Diagramas](../arquitetura/arquitetura.md), PR #57; V09. | Fluxos de mapa/ranking são modelagem; não implementação concluída. |
| T30 — MER/DER | Modelo de dados e relações documentados. | Presença e XML de MER/DER conferidos; relacionamentos do schema e explicação das tabelas disponíveis para consulta. | [Banco](../../database/arquitetura.md), PR #42; V09/V10. | Inspeção dos artefatos não substitui aprovação semântica dos diagramas pelo avaliador. |

## 3. Resultados e reprodução

### V01 — Infraestrutura e comandos de qualidade

Executados na raiz do projeto, com os containers existentes:

```powershell
docker compose ps
docker compose config --quiet
docker compose exec -T backend npx tsc --noEmit
docker compose exec -T backend npm run lint
docker compose exec -T frontend npx tsc --noEmit
docker compose exec -T frontend npm run lint
docker compose exec -T backend sh -c 'pwd; node --version'
docker compose exec -T frontend sh -c 'pwd; node --version'
docker compose exec -T database pg_isready -U postgres -d greener
```

Resultado: tipagem e lint sem erros, Compose válido, runtimes Node v24.21.0;
backend em `/backend`, frontend em `/app` e PostgreSQL aceitando conexões.

### V02 — Contratos HTTP

Consultas feitas sem alterar os dados da aplicação:

| Consulta | Esperado | Observado |
|---|---|---|
| GET /health | 200 | 200 |
| GET /api/v1/service/billing-api | 200 | 200 |
| GET /api/v1/service/unknown-service-review | 404 | 404 |
| GET /api/v1/service/a%20b | 400 | 400 |
| Histórico de billing-api com range=1h e maxPoints=3 | 200 | 200 |
| Histórico com range=invalid | 400 | 400 |
| GET /api/v1/services | 404 nesta versão | 404: dependência pendente, não teste de integração aprovado. |

Para reproduzir o detalhe no PowerShell:

```powershell
Invoke-RestMethod 'http://localhost:3000/api/v1/service/billing-api'
Invoke-RestMethod 'http://localhost:3000/api/v1/service/billing-api/collections?range=1h&maxPoints=3'
```

Um serviço externo pode deixar de estar disponível; nesse caso, selecionar um
identificador presente no banco e registrar a mudança no procedimento.

### V03 — Integrações externas

Instanciados os clients existentes com as URLs do ambiente e executados
`MetricsClient.getServices()`, `CarbonClient.getRegions()` e
`MetricsClient.getMetrics(services[0].metrics_path)`. As respostas passaram pelos
schemas usados pelos próprios clients.

Resultado desta execução: **8 serviços**, **5 regiões**, métricas de
`billing-api`, intervalo de amostra de **27 segundos** e campos `cpu_percent`,
`memory_gb`, `disk_gb`, `network_gb` presentes. Isso verifica a integração de
coleta, não o endpoint interno de listagem ainda pendente.

### V04 — Modelo e mapper da T04

Verificação em runtime com `node:assert/strict` e os módulos TypeScript carregados
por `node --import tsx --input-type=module`, dentro do container backend:

1. Entrada com id, nome, metrics_path e região válida, sem opcionais.
2. Comparação do objeto completo com o contrato esperado: metricsPath e
   regionCode convertidos; city, latitude e longitude iguais a null.
3. Nova entrada com cidade São Paulo e coordenadas -23.55/-46.63.
4. Conferência de preservação dos três valores na saída.

Resultado: **todas as asserções passaram**. O código da aplicação não foi
alterado para realizar a verificação. O commit `a98d4e5`, integrado no PR #59,
contém o modelo e o mapper usados pela sincronização.

### V05 — Reprocessamento das estimativas

Uma consulta de leitura recuperou as vinte coletas mais recentes, ligando cada
uma ao seu `parametro_estimativa_id`. Para cada registro foram recalculados:

```text
P = CPU% / 100 × CPU_MAX + RAM × F_RAM + DISCO × F_DISCO + REDE × F_REDE
E = P × intervalo_metrica_segundos / 3600000
CO₂e = E × carbon_intensity
```

As diferenças absolutas em relação aos valores armazenados foram menores que
`0.000002 W`, `0.0000000001 kWh` e `0.00000001 g`, respectivamente. As tolerâncias
consideram a precisão numérica das colunas e o cálculo com ponto flutuante.
**Vinte de vinte coletas passaram.** Referência dos fatores: [modelo do desafio](../cálculo.md).

### V06 — Recorrência da coleta

Duas consultas a `GET /api/v1/monitoring/status`, com o processo continuamente ativo:

| Observação | lastRoundStartedAt (UTC) | lastSuccessfulCollectionAt (UTC) | Resultado da rodada |
|---|---|---|---|
| Inicial | 2026-10-16T01:05:13.298Z | 2026-10-16T01:05:14.999Z | success; 8 tentativas, 8 coletas, 0 falhas. |
| Posterior | 2026-10-16T01:06:47.846Z | 2026-10-16T01:06:49.861Z | success; 8 tentativas, 8 coletas, 0 falhas. |

Os timestamps avançaram sem reinicialização manual. Esse procedimento confirma
recorrência em execução; não substitui todos os cenários do PR de testes #55.
Uma leitura posterior do banco encontrou **17.966 coletas**, valor dinâmico e
sem significado de meta de aceite.

### V07 — Detalhe visual da T13

Navegação real no navegador para `http://localhost:5173/dashboard`, seguida do
link Detalhes do serviço `svc-001`:

- Abriu `/servicos/svc-001`, com nome API de Pagamentos e identificação do serviço.
- Exibiu status, localização, CPU, memória, disco, rede, potência, energia e CO₂e.
- Exibiu os quatro gráficos e o aviso de dados simulados.
- Selecionar 1h alterou a seleção de 24h para 1h e os totais de aproximadamente
  1,117 kWh/109,47 g para 0,047 kWh/4,56 g naquele mock.
- `/servicos/svc-002` exibiu Sem métricas, campos ausentes como travessão,
  zero faixas e mensagem Sem dados no período, sem substituir ausência por zeros.

Resultado: comportamento visual observado para esses cenários. Não foram
executados testes completos de responsividade, acessibilidade ou integração real.

### V08 — Listagem visual da T14

Procedimento no navegador, usando os mocks existentes:

| Ação | Resultado observado |
|---|---|
| Abrir /dashboard | Seis serviços com nome, ID, estado, localização e campos de métricas/estimativas. |
| Buscar svc-001 | Um serviço apresentado; identificação correspondente. |
| Clicar em Detalhes | Navegação para /servicos/svc-001. |
| Filtrar estado Indisponível | Dois serviços apresentados. |
| Voltar estado para Todos e filtrar país Brasil | API de Pagamentos e Relatórios Financeiros apresentados. |
| Buscar nenhum-servico-dod | Nenhum resultado e mensagem Nenhum serviço com esses filtros. |

Resultado: busca, filtros exercitados, apresentação e navegação conferidos.
Não foi validada chamada real à listagem HTTP; a ausência dessa rota continua
registrada em T05/T17 e no README.

### V09 — Artefatos e documentação

Procedimento: conferir existência dos destinos de links locais, estrutura dos
arquivos SVG, cabeçalho dos três PDFs, seleção das quatro histórias e cobertura
das 22 tarefas concluídas nesta tabela. A inspeção estrutural de arquivo não
equivale a revisão visual completa dos PDFs ou homologação semântica da UML.

Resultado: cobertura de **22/22 tarefas concluídas**, **3 PDFs** com cabeçalho
válido, **7 SVGs** de modelagem com XML bem formado e **142 links locais** com
destinos existentes nos documentos conferidos. Blocos de código estavam
balanceados; a seleção permaneceu US01, US03, US08 e US09.

As dailies permanecem como registros da equipe. Não foram inventadas presença,
reuniões, aprovação dos integrantes ou feedback da Sprint Review.

### V10 — Banco e DDL

O script `database/schema.sql` da versão de referência foi executado com
`ON_ERROR_STOP=1` em PostgreSQL 17 vazio, descartável, sem rede e removido ao
final. Resultado: seis tabelas, índices e restrições criados; um conjunto ativo
de parâmetros inserido, sem erro de SQL.

Nesta aplicação da DoD, a leitura do banco em uso confirmou seis tabelas e
coletas existentes. Não houve reinicialização do banco do projeto. O
[procedimento de retenção](../../database/arquitetura.md) permanece como
verificação específica pendente para BD03, sem invalidar a tarefa de configurar
o serviço e seu volume.

### V11 — Consistência da consulta histórica

Para `billing-api`, foram comparados o resumo de
`GET /api/v1/service/billing-api/collections?range=1h&maxPoints=3` e uma consulta
SQL de leitura com o mesmo serviço e os limites devolvidos em `period`:

```text
from = 2026-10-15T23:59:45.566Z
to   = 2026-10-16T00:59:45.566Z
Condição: coletado_em > from AND coletado_em <= to
```

| Indicador | API | SQL |
|---|---|---|
| Quantidade de amostras | 207 | 207 |
| Energia total (kWh) | 0.112142979 | 0.112142979 |
| CO₂e total (g) | 9.5321531861 | 9.5321531861 |

As contagens coincidiram, as diferenças absolutas de energia e CO₂e foram
menores que `0.000000000001` e os pontos da resposta estavam ordenados por
timestamp. Os números descrevem aquela execução, não valores fixos esperados
em consultas futuras. A reprodução deve usar os limites retornados na nova
resposta e comparar novamente com o SQL do mesmo período.

## 4. Pendências de aceite

- [ ] Sincronizar os checklists das issues com os resultados das verificações.
- [ ] Validar a integração da interface com os dados reais do backend.
- [ ] Validar o mapa/globo e a apresentação dos serviços por região.
- [ ] Validar a atualização automática dos dados sem recarregamento da página.
- [ ] Registrar os resultados necessários ao aceite das histórias selecionadas.

As verificações deste documento cobrem os escopos das tarefas concluídas.
O aceite das histórias depende também da conclusão e validação das tarefas
de integração e das funcionalidades ainda em desenvolvimento.
