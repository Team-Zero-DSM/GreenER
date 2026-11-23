# Plano de Entregas

As situações abaixo descrevem evidências e pendências, não uma nota atribuída.

## Convenções e critérios da avaliação

- ES01–ES09 e DW01 são previstos em todas as sprints. Critérios adicionais
  acompanham as entregas selecionadas; a avaliação é cumulativa.
- Os códigos RF e RNF do backlog são internos. A correspondência com o desafio
  está no [README](../README.md): JWT corresponde a RP06, persistência a RF10/RP03,
  Docker a RP04 e documentação a RNF05 oficial/RNF08 interno.
- Responsáveis já definidos no Sprint Backlog foram mantidos. "Equipe" indica
  responsabilidade coletiva; futuras divisões individuais continuam a definir.
- Implementado não significa história aceita: observar aceite, DoD e evidências.
- A autenticação foi alocada à Sprint 3. Persistência e histórico de métricas são
  Sprint 1; o histórico de status das coletas é uma ampliação da Sprint 2.
  Globo integrado na Sprint 1; saldo de T15 transferido para a Sprint 2:
  apresentar os serviços associados ao inspecionar uma região, com Gabriel.
- A configuração administrativa do intervalo foi implementada na Sprint 3
  pelas tasks #163 e #164. A tabela abaixo relaciona as entregas do backend
  aos contratos, User Stories e evidências de validação.

## Sprint 1 — Monitoramento, persistência, histórico e visualização

**28/09/2026 a 19/10/2026**

**Objetivo:** estabelecer a plataforma de monitoramento com coleta periódica,
persistência, consulta histórica, estimativas ambientais e interface de
acompanhamento com atualização automática, executada em Docker.

**User Stories selecionadas:** somente US01, US03, US08 e US09. Persistência,
histórico e mapa são documentados pelas entregas e tarefas técnicas pertinentes;
não acrescentam automaticamente US10, US11 ou US12 à seleção da sprint.

**Entregas selecionadas:** descoberta e coleta, tratamento de indisponibilidade,
cálculos, banco e histórico; dashboard, detalhe e integração; atualização
periódica; mapa/globo com pins e inspeção regional, sob responsabilidade de Gabriel.
O escopo inclui as condições das histórias e tarefas do
[registro da Sprint 1](./sprint-1/sprint-1.md).

O backend armazena e consulta o histórico; lista, detalhe, histórico e atualização
automática estão integrados à interface real. O globo está integrado. A apresentação
dos serviços associados ao inspecionar uma região permanece pendente e foi
transferida para a Sprint 2 como saldo de T15, sem concluir integralmente a tarefa.
Autenticação e configuração do intervalo pela aplicação não compõem esta entrega.

### Matriz da Sprint 1

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog priorizado e vinculado a requisitos | Conferir histórias e tarefas selecionadas | Henrique e equipe | [Backlog](../README.md) | Documentado; revisar cobertura |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e entregas | Conferir plano e Sprint Backlog | Henrique e equipe | [Sprint 1](./sprint-1/sprint-1.md) | Documentado; acompanhar execução |
| ES03 | RNF11 | Critérios de aceite de US01, US03, US08 e US09 | Relacionar os critérios das quatro histórias selecionadas às evidências | Equipe | [User Stories](../README.md) | Documentado; validar por história |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir links de issues e PRs da sprint | Equipe | [Rastreabilidade](./sprint-1/sprint-1.md#evidências-e-rastreabilidade) | Vínculos restaurados; aceite formal e saldo de T15 permanecem explícitos |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe | [Commits](https://github.com/Team-Zero-DSM/GreenER/commits/develop/) | Histórico disponível |
| ES06 | RNF12 | Review, feedback e adaptação do backlog | Conferir resultados e decisões no encerramento | Equipe | [Sprint Review](./sprint-1/sprint-1.md#-sprint-review) | Documentado |
| ES07 | RNF11, RNF12 | DoD aplicada às entregas concluídas | Conferir escopo, procedimento, resultado e limite por tarefa | Equipe | [DoD geral](../README.md) e [evidências históricas e atuais](./sprint-1/evidencias-dod.md) | 29 tarefas declaradas concluídas; evidências atuais e ressalvas registradas, sem aceite automático das histórias |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir links, comandos, contratos e limites | Henrique e equipe | [README](../README.md) e documentos vinculados | Documentação e README alinhados à implementação; clone limpo permanece não verificado |
| ES09 | RNF12 | Participação verificável dos cinco integrantes | Conferir artefatos por integrante, além de commits | Todos os integrantes | [Participação](./sprint-1/sprint-1.md#participação-da-equipe) | Evidências registradas |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir código e dependências usadas | Pedro, Paulo, Gabriel e equipe | [Frontend](../frontend/package.json), [backend](../backend/package.json) | Implementado |
| DW02 | RF01, RF03; impacto ambiental | Descoberta, métricas e carbono | Observar integrações, coletas e falhas | Pedro e Vitor | [Integrações](../backend/src/integrations/), [verificações V03/V06](./sprint-1/evidencias-dod.md) | Consultas reais e recorrência verificadas; ampliar cenários de falha |
| DW03 | RF01, RF03, RF10 | API modular, contratos e SQL nos repositories | Consultar rotas reais e validar respostas | Pedro e Vitor | [API](./API.md), [verificação V02](./sprint-1/evidencias-dod.md) | Lista, detalhe, histórico e regiões verificados por HTTP; #22 integrada |
| DW04 | RF09, RF10; RNF01 interno | Interface consumindo o backend | Conferir chamadas reais, navegação e renderização | Paulo e Gabriel | [Interface](../frontend/arquitetura.md) | Integração real observada em lista, detalhe e histórico |
| DW05 | RF11; RNF02 interno | Dashboard atualizado sem recarga | Observar consultas sucessivas e horário real | Paulo e Gabriel | [Issues #36](https://github.com/Team-Zero-DSM/GreenER/issues/36) e [#37](https://github.com/Team-Zero-DSM/GreenER/issues/37) | Dados e horário de atualização avançaram sem recarga manual |
| DW07 | RP04; RNF07 interno | Frontend, backend e banco no Compose | Iniciar serviços e conferir status | Pedro | [Compose](../docker-compose.yml), [verificação V01](./sprint-1/evidencias-dod.md) | Configuração válida e três serviços ativos; clone limpo não verificado |
| BD01 | RF10, RP03 | Modelo, DDL e restrições | Aplicar schema em banco vazio de avaliação | Pedro e Vitor | [Schema](../database/schema.sql), [modelo](../database/arquitetura.md), [verificação V10](./sprint-1/evidencias-dod.md) | DDL executado sem erro em banco vazio descartável; seis tabelas criadas |
| BD02 | RF10, RP03 | DML explícito e parametrizado | Conferir placeholders e operações | Pedro e Vitor | [Repositories](../backend/src/modules/) | Implementado |
| BD03 | RF10, RP03 | Gravação, recuperação e retenção | Comparar registro antes e depois de reinicialização | Pedro | [Banco](../database/arquitetura.md) | Integração presente; retenção a registrar |
| BD04 | RF10 | Histórico e totais por período | Consultar dados conhecidos e conferir filtros/agregações | Pedro | [Analytics](../backend/src/modules/analytics/analytics.repository.ts), [verificação V11](./sprint-1/evidencias-dod.md) | Contagem, energia e CO₂e da API coincidiram com SQL no mesmo período; pontos ordenados |
| TP01 | Organização do código | Classes usadas com responsabilidades definidas | Inspecionar services, repositories e clients | Pedro e Vitor | [Módulos](../backend/src/modules/) | Implementado |
| TP02 | RP01, RP02 | Tipos coerentes e validação de contratos | Executar TypeScript e conferir schemas | Equipe | [Schemas](../backend/src/integrations/), [verificações V01/V04](./sprint-1/evidencias-dod.md) | TypeScript sem erros nas duas aplicações; mapper verificado em runtime |
| TP03 | RNF04 interno | Tratamento de falhas preservando o sistema | Verificar validações e falhas isoladas | Pedro e Vitor | [Coleta](../backend/src/modules/collections/collections.service.ts) | Implementado; ampliar evidências de falhas |

## Sprint 2 — Rankings, comparação, histórico de status e visualização regional

**20/10/2026 a 09/11/2026**

**Objetivo:** ampliar a análise do impacto ambiental com ranking e comparação
entre serviços no mesmo período, registrar falhas e recuperação das coletas e
evoluir o dashboard e a navegação por regiões, preservando as entregas da Sprint 1.

O [milestone Sprint 2](https://github.com/Team-Zero-DSM/GreenER/milestone/2?closed=1)
reúne as issues da sprint. O [backlog documentado](./sprint-2/evidencias-dod.md#sprint-backlog)
registra 28 tarefas e inclui o PR #63 como apoio da entrega anterior.

**Histórias selecionadas no GitHub:** US04 ([#72](https://github.com/Team-Zero-DSM/GreenER/issues/72)),
US05 ([#73](https://github.com/Team-Zero-DSM/GreenER/issues/73)),
US07 ([#75](https://github.com/Team-Zero-DSM/GreenER/issues/75)),
US08 ([#3](https://github.com/Team-Zero-DSM/GreenER/issues/3)),
US13 ([#74](https://github.com/Team-Zero-DSM/GreenER/issues/74)) e
US14 ([#76](https://github.com/Team-Zero-DSM/GreenER/issues/76)).
US08 continua o trabalho anterior; a seleção original da Sprint 1 permanece preservada.

### Entregas e critérios de verificação

| Entrega | Escopo e verificação esperada | Issues | Responsáveis registrados no backlog |
|---|---|---|---|
| Histórico de status — US04/US05 | Registrar falhas e recuperação com serviço, horário e motivo. Consultar até 100 tentativas recentes por serviço e distinguir indisponibilidade de ausência de métricas. | #89, #90, #91; histórias #72 e #73 | Pedro |
| Ranking — US13 | API com coletas armazenadas, período e ordenação por energia ou CO₂e; tela com filtros de 1h, 6h, 24h, 7d e 30d, gráfico e tabela; dados reais, atualização após coleta e tratamento de estados vazios/falhas. Conferir valores com o banco no mesmo período. | #92, #102–#106; história #74 | Paulo no frontend e Pedro no backend |
| Comparação — US14 | Selecionar de dois a cinco serviços sem duplicação, usar o mesmo período, selecionar métrica e serviço principal; integrar API, gráficos e resumo com diferença percentual, ausência de dados e média zero. As opções regionais/cenários de #83/#84 exigem delimitação com a Sprint 3. | #82–#86, #93; história #76 | Henrique no frontend e Pedro no backend |
| Dashboard e regiões — US08 | Concluir inspeção regional da #32; listagem e foco no globo/mapa, modo 2D, marcadores proporcionais, header, cards regionais, gráfico de intensidade e mapa das regiões. Validar serviços por região e responsividade. | #32, #79–#81, #94, #97–#99; história #3 | Gabriel em #32/#79–#81 e Vitor em #94/#97–#99 |
| Indicadores consolidados — US07 | Apresentar energia total, CO₂e total e contagens de serviços ativos e indisponíveis do ambiente. | [História #75](https://github.com/Team-Zero-DSM/GreenER/issues/75) | Equipe |
| Documentação e validação | Atualizar diagramas, README, dailies, contratos e modelo; validar histórico de status, ranking, comparação e filtro regional com dados reais e registrar resultados. | #40, #77, #78, #95, #96 | Henrique em #40/#77/#78 e Pedro em #95/#96 |

Os títulos, links, responsáveis do planejamento, estimativas e situações das
**28 tarefas** estão no [Sprint Backlog completo](./sprint-2/evidencias-dod.md#sprint-backlog).

### Integrações e sequência de entrega

- **Integrações da sprint:** o histórico de status, a inspeção regional, o
  ranking e a comparação têm PRs integrados. Os vínculos e os limites de cada
  entrega estão no [registro de evidências](./sprint-2/evidencias-dod.md#evidências-e-limites-de-conclusão).
- **Saldo de T15:** a listagem regional da #80, integrada no
  [PR #118](https://github.com/Team-Zero-DSM/GreenER/pull/118), cobre o saldo
  da inspeção de serviços por região associado à #32.
- **Dependências do histórico:** #89 → #90 → #91. O
  [PR #127](https://github.com/Team-Zero-DSM/GreenER/pull/127) registra os
  testes de gravação, recuperação, consulta e distinção entre US04 e US05.
- **Integrações:** #92 alimenta #104 e os componentes de ranking; #93 fornece os
  dados para #84–#86; #94 sustenta a inspeção/listagem regional. Estruturas visuais
  podem avançar em paralelo, mas a entrega exige integração real.
- **Validação e documentação:** o [PR #127](https://github.com/Team-Zero-DSM/GreenER/pull/127)
  registra os testes da #95. O [PR #130](https://github.com/Team-Zero-DSM/GreenER/pull/130)
  reúne as atualizações de contratos e do modelo da #96.

### Matriz da Sprint 2

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog vinculado a requisitos e histórias | Conferir as seis histórias e 28 tarefas | Equipe | [Sprint Backlog](./sprint-2/evidencias-dod.md#sprint-backlog) | Histórias e tarefas registradas |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e dependências | Conferir este plano, atribuições e planejamento de 20/10 | Equipe | [Registro da sprint](./sprint-2/sprint-2.md), [dailies](./sprint-2/dailies.md) | Backlog e responsáveis registrados |
| ES03 | RNF11 | Critérios verificáveis por história | Conferir checklists e resultados de integração | Equipe | [Histórias selecionadas](./sprint-2/evidencias-dod.md#histórias-selecionadas) | Critérios registrados nas issues e nas evidências da sprint |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir issues e PRs vinculados | Equipe | [Backlog e evidências](./sprint-2/evidencias-dod.md) | Entregas vinculadas às issues e aos PRs no registro |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe | [Commits](https://github.com/Team-Zero-DSM/GreenER/commits/develop/), PRs no registro | Evolução registrada; acompanhar próximas entregas |
| ES06 | RNF12 | Review, feedback e adaptação | Relacionar feedback às mudanças e registrar encerramento | Equipe | [Dailies](./sprint-2/dailies.md), especialmente 21/10 | Ajustes relatados; review final pendente |
| ES07 | RNF11, RNF12 | DoD sustentada por evidências | Conferir integração, testes e critérios de aceite por história | Equipe | [DoD da Sprint 2](./sprint-2/sprint-2.md#verificações-e-definition-of-done) e [registro de evidências](./sprint-2/evidencias-dod.md) | Validação técnica registrada. Na US07, os totais do ambiente foram conferidos no banco e a apresentação foi demonstrada por região. |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir diagramas, README, dailies, contratos e modelo | Henrique e Pedro | #40, #77, #78 e #96 no [backlog](./sprint-2/evidencias-dod.md#sprint-backlog) | Documentação técnica entregue pelo PR #130. Registro e dailies na branch da #40 |
| ES09 | RNF12 | Participação dos cinco integrantes | Conferir presença, atividades, atribuições e artefatos | Todos | [Dailies](./sprint-2/dailies.md), [participação](./sprint-2/sprint-2.md#participação-da-equipe) | Presenças e atividades consolidadas para os registros até 28/10 |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir alterações e compilar aplicações | Equipe | [Frontend](../frontend/package.json), [backend](../backend/package.json), #95 | Base existente; revalidar alterações da sprint |
| DW02, DW03, DW07 | Recursos da Sprint 1 | Preservar integrações, APIs e Docker | Reexecutar verificações relevantes e contratos de #91–#94 | Pedro e Vitor conforme o backlog | [PR #127](https://github.com/Team-Zero-DSM/GreenER/pull/127), [PR #128](https://github.com/Team-Zero-DSM/GreenER/pull/128) e [evidências da sprint](./sprint-2/evidencias-dod.md#evidências-e-limites-de-conclusão) | Validação de API, filtro regional e subida em cópia limpa registrada |
| DW04, DW05 | RF09, RF11, RF14, RF15 | Ranking, comparação e regiões com dados reais | Validar filtros, período, atualização e falhas na interface | Paulo, Henrique, Gabriel e Vitor conforme o backlog | [Ranking #126](https://github.com/Team-Zero-DSM/GreenER/pull/126), [comparação #129](https://github.com/Team-Zero-DSM/GreenER/pull/129) e [inspeção regional #118](https://github.com/Team-Zero-DSM/GreenER/pull/118) | Telas integradas ao backend |
| BD01–BD04 | RF05, RF06, RF08, RF10, RF14, RF15; RP03 | Histórico de status, consultas e agregações | Preservar dados existentes e comparar API × SQL no mesmo período | Pedro | [PR #127](https://github.com/Team-Zero-DSM/GreenER/pull/127) e [migração de volume](../database/arquitetura.md#conferir-um-volume-existente) | Testes com PostgreSQL e preservação da amostra da Sprint 1 após migração e reinício registrados |
| TP01–TP03 | Histórico, ranking, comparação e regiões | Modelagem, tipos e isolamento de falhas | Conferir entradas inválidas, dados ausentes, recuperação e média zero | Equipe | [PR #127](https://github.com/Team-Zero-DSM/GreenER/pull/127) | Testes automatizados e verificações HTTP registrados |

## Sprint 3 — Autenticação e cenários avançados

**10/11/2026 a 23/11/2026**

**Objetivo e entrega:** implementar autenticação JWT e perfil, painel de
monitoramento personalizável, administração de usuários, configuração da coleta
e das estimativas, relatórios e exportação em PDF, preservando as funcionalidades
anteriores e aprimorando a interface.

O [registro da Sprint 3](./sprint-3/sprint-3.md) e as
[evidências da DoD](./sprint-3/evidencias-dod.md) registram **34 tarefas concluídas**.
O backlog documentado e o
[Projects](https://github.com/orgs/Team-Zero-DSM/projects/3/views/10)
totalizam **154 pontos**, incluindo 5 pontos para #195 e 3 para #196.
Todas as tarefas estão concluídas. A #176 (refatoração final) foi entregue no PR #220.
US06 (#153), US10 (#154), US15 (#151), US16 (#155) e US17 (#142) são as
cinco histórias presentes no milestone e estão fechadas. As demais histórias
relacionadas às tarefas são identificadas no registro.

A previsão original de cenários avançados permanece como contexto do planejamento.
A comparação regional já era contemplada na Sprint 2 (#76, #82–#86 e #93);
não foi identificada tarefa específica de uma nova simulação avançada no milestone
da Sprint 3. Essa funcionalidade não foi contada novamente como entrega.

As tabelas seguintes relacionam as entregas do backend e do frontend.

### Entregas do backend na Sprint 3

| Tasks | Entrega e User Stories | Implementação e evidência |
|---|---|---|
| [#156](https://github.com/Team-Zero-DSM/GreenER/issues/156), [#157](https://github.com/Team-Zero-DSM/GreenER/issues/157), [#158](https://github.com/Team-Zero-DSM/GreenER/issues/158) | Banco de contas, JWT, cadastro e login — US15 (#151). | [PR #174](https://github.com/Team-Zero-DSM/GreenER/pull/174), [#177](https://github.com/Team-Zero-DSM/GreenER/pull/177), [#181](https://github.com/Team-Zero-DSM/GreenER/pull/181); [contrato](./API.md#23-autenticação-e-perfil). |
| [#159](https://github.com/Team-Zero-DSM/GreenER/issues/159), [#160](https://github.com/Team-Zero-DSM/GreenER/issues/160) | Perfil, alteração e recuperação de senha — US15 (#151). | [PR #186](https://github.com/Team-Zero-DSM/GreenER/pull/186), [#185](https://github.com/Team-Zero-DSM/GreenER/pull/185), [#194](https://github.com/Team-Zero-DSM/GreenER/pull/194); [guia de e-mail](../README.md#recuperação-de-senha). |
| [#161](https://github.com/Team-Zero-DSM/GreenER/issues/161), [#162](https://github.com/Team-Zero-DSM/GreenER/issues/162) | Primeiro administrador e gerenciamento de usuários — US15 (#151). | [PR #199](https://github.com/Team-Zero-DSM/GreenER/pull/199), [#203](https://github.com/Team-Zero-DSM/GreenER/pull/203); [contrato](./API.md#28-gerenciamento-de-usuários). |
| [#163](https://github.com/Team-Zero-DSM/GreenER/issues/163), [#164](https://github.com/Team-Zero-DSM/GreenER/issues/164) | Persistência e aplicação do intervalo — US03 (#2), US15 (#151), US16 (#155). | [PR #204](https://github.com/Team-Zero-DSM/GreenER/pull/204), [#205](https://github.com/Team-Zero-DSM/GreenER/pull/205); [contrato](./API.md#24-configuração-de-monitoramento--implementada). |
| [#165](https://github.com/Team-Zero-DSM/GreenER/issues/165) | Consulta, prévia e ativação de coeficientes — US06 (#153), US15 (#151). | [PR #206](https://github.com/Team-Zero-DSM/GreenER/pull/206); [cálculo compartilhado](./cálculo.md#prévia-e-ativação-de-parâmetros). |
| [#148](https://github.com/Team-Zero-DSM/GreenER/issues/148) | Persistência do painel pessoal — US17. | [PR #198](https://github.com/Team-Zero-DSM/GreenER/pull/198); [GET/PUT /dashboards/me](./API.md#26-painel-de-monitoramento--implementado). |
| [#167](https://github.com/Team-Zero-DSM/GreenER/issues/167), [#168](https://github.com/Team-Zero-DSM/GreenER/issues/168) | Prévia e PDF — US10 (#154), apoiada pelos indicadores da US07 (#75). | [PR #207](https://github.com/Team-Zero-DSM/GreenER/pull/207), [#208](https://github.com/Team-Zero-DSM/GreenER/pull/208); [contrato](./API.md#29-relatórios-e-exportação-em-pdf). |
| [#169](https://github.com/Team-Zero-DSM/GreenER/issues/169) | Validação dos fluxos acima e migração — US03, US06, US07, US08, US10, US15 e US16. | [PR #211](https://github.com/Team-Zero-DSM/GreenER/pull/211); [suíte](../backend/tests/), [CI aprovado](https://github.com/Team-Zero-DSM/GreenER/actions/runs/44851909389). |
| [#170](https://github.com/Team-Zero-DSM/GreenER/issues/170) | Documentação técnica dessas entregas. | [PR #214](https://github.com/Team-Zero-DSM/GreenER/pull/214); API, backend, banco, cálculo e execução. |

Na validação da #169, 111 testes passaram com PostgreSQL 17, incluindo 48 casos
adicionados para os fluxos da Sprint 3. Backend, frontend e construção Docker
passaram no CI vinculado. A suíte cria bancos descartáveis e simula o envio de
e-mail; verifica fluxos básicos e preservação de dados nas migrações 002/003.
Essa evidência não comprova entrega real de SMTP/Brevo, desempenho sob carga ou
aceite formal das User Stories.

### Entregas do frontend na Sprint 3

| Tasks | Entrega | Evidências |
|---|---|---|
| #136–#141, #183 | Autenticação e perfil: estrutura, formulários, integração e refinamento visual. | PRs #152, #178, #180, #184, #189, #200 e #215; [rastreabilidade](./sprint-3/evidencias-dod.md#evidências-e-limites-de-conclusão). |
| #143–#150 | Painel personalizável: widgets, templates, edição, configuração persistida, dados reais e responsividade. | PRs #171, #188, #190–#193, #197 e #198; evoluções #210/#212. |
| #172 | Tela administrativa integrada à coleta, estimativas e gerenciamento de acessos. | [PR #213](https://github.com/Team-Zero-DSM/GreenER/pull/213). |
| #173, #196 | Padrão visual e responsividade da página inicial. | PRs #219 e #218; cabeçalho complementar no #216. |
| #195 | Seleção de serviços, filtros, prévia, histórico, CSV e impressão do relatório. | [PR #217](https://github.com/Team-Zero-DSM/GreenER/pull/217). |
| #176 | Refatoração final do frontend. | [PR #220](https://github.com/Team-Zero-DSM/GreenER/pull/220) integrado; tarefa concluída. |

### Matriz da Sprint 3

A matriz relaciona as entregas da Sprint 3 aos requisitos, responsáveis
e artefatos do projeto.

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog com requisitos, tarefas, descrição e prioridade | Conferir Product Backlog, issues e prioridades | Equipe | [Product Backlog](../README.md), [34 tarefas](./sprint-3/sprint-3.md#-sprint-backlog--sprint-3) | US17 com prioridade Alta na história e no Product Backlog; 34 tarefas pontuadas. |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e entregas verificáveis | Relacionar planejamento, issues e atribuições | Equipe | [Registro da sprint](./sprint-3/sprint-3.md), [histórias selecionadas](./sprint-3/evidencias-dod.md#histórias-selecionadas) | Cinco histórias no milestone e 34 tarefas com responsáveis. |
| ES03 | RNF11 | Critérios de aceite das histórias e tarefas selecionadas | Conferir condições verificáveis de US06, US10, US15, US16 e US17 | Equipe | [Histórias](./sprint-3/evidencias-dod.md#histórias-selecionadas), [DoD por entrega](./sprint-3/evidencias-dod.md#aplicação-da-definition-of-done) | Critérios nas issues e relação com implementação e testes. |
| ES04 | RNF11 | Rastreabilidade entre requisito, tarefa, código e entrega | Seguir vínculos de issues, PRs e arquivos | Equipe | [Rastreabilidade](./sprint-3/sprint-3.md#evidências-e-rastreabilidade), [PRs das tarefas](./sprint-3/evidencias-dod.md#evidências-e-limites-de-conclusão) | As 34 tarefas concluídas possuem PRs vinculados. |
| ES05 | RNF12 | Evolução incremental durante a sprint | Conferir distribuição das implementações e integrações no histórico | Equipe | [PRs e evoluções complementares](./sprint-3/evidencias-dod.md#evidências-e-limites-de-conclusão) | Contas, painel, administração, relatórios e refatoração entregues progressivamente. |
| ES06 | RNF12 | Review com resumo das entregas | Conferir feedback e decisões de encerramento | Equipe | [Sprint Review](./sprint-3/sprint-3.md#-sprint-review) | Resumo das funcionalidades integrado ao registro da sprint. |
| ES07 | RNF11, RNF12 | DoD objetiva e aplicada aos itens concluídos | Conferir critérios, testes e integração dos fluxos | Equipe | [DoD geral](../README.md#-definition-of-done--geral), [aplicação por entrega](./sprint-3/evidencias-dod.md#aplicação-da-definition-of-done) | Testes de API/banco e fluxos visuais conferidos na [aplicação da DoD](./sprint-3/evidencias-dod.md#aplicação-da-definition-of-done). |
| ES08 | RNF08 | Documentação e instruções compatíveis com a entrega | Conferir README, contratos, comandos, links e registros da sprint | Pedro e equipe | [README](../README.md), [PR #214](https://github.com/Team-Zero-DSM/GreenER/pull/214), [acompanhamento](./sprint-3/evidencias-dod.md#acompanhamento) | [Arquitetura do frontend](../frontend/arquitetura.md), contratos e [instruções de execução e testes](./sprint-3/evidencias-dod.md#execução-e-testes) atualizados. |
| ES09 | RNF12 | Contribuição relevante e verificável dos cinco integrantes | Conferir responsabilidades e artefatos de cada integrante | Todos | [Participação da equipe](./sprint-3/sprint-3.md#participação-da-equipe) | Os cinco integrantes possuem entregas vinculadas. |
| DW01 | RP01, RP02; RNF09 interno | React/TypeScript, Node/TypeScript e separação das partes | Conferir dependências, código e compilação | Equipe | [Frontend](../frontend/package.json), [backend](../backend/package.json), [CI integrado](https://github.com/Team-Zero-DSM/GreenER/actions/runs/45190146902) | Tecnologias efetivamente usadas e verificações aprovadas. |
| DW02 | RF01, RF03; APIs auxiliares | Descoberta, coleta de métricas e intensidade de carbono | Inspecionar clients, processamento e tratamento de falhas | Pedro e Vitor | [Integrações](../backend/src/integrations/), [coleta](../backend/src/modules/collections/collections.service.ts), [testes](../backend/tests/unit/modules/collections/collections.service.test.ts) | Integrações e tratamento de falhas implementados nos clients e na coleta. |
| DW03 | RF03, RF07, RF10; RNF09 interno | API REST modular com SQL nos repositories e sem ORM | Conferir recursos, métodos, respostas e separação das responsabilidades | Pedro e Paulo | [API](./API.md), [módulos](../backend/src/modules/), [testes HTTP](../backend/tests/integration/modules/) | Atendido por código e testes: contas, painel, administração e relatórios seguem as camadas documentadas. |
| DW04 | RF08, RF09, RF10, RF16; RNF09 interno | Frontend modular e integrado ao backend | Conferir pages, components, camada HTTP, hooks e providers em uso | Henrique, Paulo, Gabriel e Vitor | [Frontend](../frontend/arquitetura.md), [API HTTP](../frontend/src/api/), [hooks](../frontend/src/hooks/), [contexts](../frontend/src/contexts/) | Atendido por código e PRs: autenticação, perfil, painel, administração e relatórios integrados. |
| DW05 | RF09, RF11, RF16; RNF02 interno | Dashboard compreensível e atualizado sem recarga manual | Conferir disparo após rodadas e indicação da última atualização | Paulo e equipe | [MonitoringProvider](../frontend/src/contexts/MonitoringProvider.tsx), [useApiQuery](../frontend/src/hooks/useApiQuery.ts), [painel](../frontend/src/pages/PainelPage.tsx) | Atualização e horário da última consulta implementados no painel. |
| DW06 | RP06; RNF05 interno | JWT no backend e proteção da área de configuração | Conferir login, token, senhas e autorização administrativa | Pedro, Henrique e Vitor | [Sessão](../backend/src/modules/accounts/accounts.session.ts), [middleware](../backend/src/shared/middleware/auth.ts), [rotas administrativas](../backend/src/modules/project/project.routes.ts), [testes](../backend/tests/integration/modules/accounts/accounts.routes.test.ts) | Atendido por código e testes: JWT, bcrypt, sessões revogadas, 401/403 e restrição a administradores. |
| DW07 | RP04; RNF07 interno | Execução de frontend, backend e PostgreSQL em Docker | Conferir Dockerfiles, Compose, exemplos de ambiente e subida conjunta | Equipe | [Compose](../docker-compose.yml), [backend](../backend/Dockerfile), [frontend](../frontend/Dockerfile), [CI Docker](https://github.com/Team-Zero-DSM/GreenER/actions/runs/45190146902) | Execução conjunta de frontend, backend e PostgreSQL conferida; [instruções no README](../README.md#como-executar). |
| BD01 | RP03, RF10; RNF06 interno | Modelo e DDL explícito com chaves, relacionamentos e restrições | Conferir schema, dicionário e aplicação em banco vazio | Pedro e Paulo | [Schema](../database/schema.sql), [dicionário](../database/arquitetura.md), [bancos de teste](../backend/tests/integration/helpers/database.ts) | Atendido por DDL e testes: o schema real cria bancos descartáveis e o CI prepara o PostgreSQL do zero. |
| BD02 | RP03; RNF06 interno | DML explícito e parâmetros enviados separadamente ao PostgreSQL | Conferir placeholders, valores e ausência de ORM | Pedro e Paulo | [AccountsRepository](../backend/src/modules/accounts/accounts.repository.ts), [ProjectRepository](../backend/src/modules/project/project.repository.ts), [DashboardsRepository](../backend/src/modules/dashboards/dashboards.repository.ts) | Dados de requisição usam parâmetros. Identificadores internos dos bancos descartáveis de teste não são entradas da API. |
| BD03 | RP03, RF10; RNF06 interno | Integração, gravação, recuperação e retenção após reinício | Conferir persistência e leitura dos mesmos registros após reiniciar containers | Pedro e Paulo | [Conexão](../backend/src/db/connection.ts), [Compose](../docker-compose.yml), [persistência do painel](../backend/tests/integration/modules/dashboards/dashboards.repository.test.ts), [migrações](../backend/tests/integration/database/migrations.test.ts) | Coletas e painéis preservados após reinício; resultados na [DoD](./sprint-3/evidencias-dod.md#validação-integrada) e consultas na [documentação do banco](../database/arquitetura.md#consultar-a-estrutura-e-as-coletas-existentes). |
| BD04 | RF08, RF10, RF14, RF15 | SQL para histórico, indicadores, ranking, comparação e relatórios | Conferir filtros, ordenação, agregações e resultados contra o banco | Pedro | [Analytics](../backend/src/modules/analytics/), [rankings](../backend/src/modules/rankings/), [comparisons](../backend/src/modules/comparisons/), [conferência API × SQL](../backend/tests/integration/modules/reports/reports.routes.test.ts) | Atendido por código e testes: consultas por serviço e período, agregações e resultados conferidos com PostgreSQL. |
| TP01 | Modelagem orientada a objetos | Classes com comportamento, encapsulamento e responsabilidades | Conferir classes usadas na aplicação e dependências privadas | Pedro e equipe | [AccountsService](../backend/src/modules/accounts/accounts.service.ts), [AccountsRepository](../backend/src/modules/accounts/accounts.repository.ts), [CollectionsService](../backend/src/modules/collections/collections.service.ts) | Classes funcionais, métodos de domínio e dependências privadas. |
| TP02 | RP01, RP02 | Tipagem coerente de parâmetros, retornos e dados | Conferir tipos, interfaces, schemas e TypeScript | Equipe | [Tipos do backend](../backend/src/modules/), [tipos do frontend](../frontend/src/types/), [CI](https://github.com/Team-Zero-DSM/GreenER/actions/runs/45190146902) | Contratos tipados, validação com Zod e checagem TypeScript aprovada. |
| TP03 | RNF04 interno | Exceções compreensíveis e continuidade nas operações que falham | Conferir lançamento, tratamento, respostas e isolamento de falhas | Pedro e equipe | [Erros](../backend/src/shared/errors/), [middleware](../backend/src/shared/middleware/), [job](../backend/src/jobs/collections.job.ts), [teste de continuidade](../backend/tests/unit/modules/collections/collections.service.test.ts) | Tratamento de erros e continuidade conferidos pelos testes vinculados. |


## Decisões de escopo

| Item | Decisão confirmada | Reflexo no planejamento |
|---|---|---|
| Autenticação | Implementada na Sprint 3. | Banco, cadastro, login, perfil e recuperação vinculados às tasks #156–#162 e aos testes da #169. |
| Persistência e histórico de métricas | Entregas técnicas da Sprint 1. | Relacionados às tarefas de backend/banco e BD01–BD04; não incluem automaticamente a US10 na seleção. |
| Histórico de status | Ampliação da Sprint 2 vinculada a US04/US05. | #89–#91; preservação dos dados verificada em banco de teste com schema da Sprint 1. |
| Comparação entre serviços | Sprint 2, vinculada às issues #76, #82–#86 e #93. | Tela de comparação integrada à API pelo [PR #129](https://github.com/Team-Zero-DSM/GreenER/pull/129). |
| Cenários regionais | #83/#84 já preveem opções regionais na comparação da Sprint 2. | Não foi identificada tarefa de nova simulação avançada no milestone da Sprint 3; não contar novamente as opções regionais da Sprint 2. |
| Indicadores consolidados | US07 fechada na Sprint 2. A [validação](./sprint-2/evidencias-dod.md#validação-da-us07) cobre os cards regionais e os quatro totais do ambiente no banco. | A [demonstração](https://www.youtube.com/watch?v=jaLqoq2bONs&t=280s) apresenta a tela de visão geral no plano da Sprint 3. |
| Mapa/globo | Globo integrado na Sprint 1. Continuação de T15 na Sprint 2, com Gabriel. | A #32 identifica o saldo e o PR #118 fornece evidência da listagem regional para a review. |
| Intervalo pela aplicação | Implementado na Sprint 3. | #163 persiste a configuração e #164 aplica o valor no agendador; #169 valida os fluxos básicos. |
| Parâmetros ambientais | Valores iniciais correspondem ao exemplo do modelo simplificado do desafio. | Fonte, unidades e aplicação registradas em [cálculo.md](./cálculo.md); não representam calibração de hardware real. |

As decisões acima orientam o planejamento das entregas.
