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
- Configuração do intervalo pela aplicação fica para depois, com sprint e
  responsável ainda a definir. Até a entrega final, sua alocação deve ser
  conciliada com os requisitos obrigatórios de configuração do desafio.

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
| ES06 | RNF12 | Review, feedback e adaptação do backlog | Conferir resultados e decisões no encerramento | Equipe | [Sprint Review](./sprint-1/sprint-1.md#-sprint-review) | Pendente de encerramento |
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

**Fonte e data de conferência:** todas as issues abertas e fechadas do
[milestone Sprint 2](https://github.com/Team-Zero-DSM/GreenER/milestone/2?closed=1),
consultadas em **25/10/2026**. São **34 issues: 6 histórias e 28 tarefas**;
**30 abertas e 4 fechadas**. Entre as tarefas, são 24 abertas e 4 fechadas.
PRs são evidências separadas e não entram nessa contagem.

**Histórias selecionadas no GitHub:** US04 ([#72](https://github.com/Team-Zero-DSM/GreenER/issues/72)),
US05 ([#73](https://github.com/Team-Zero-DSM/GreenER/issues/73)),
US07 ([#75](https://github.com/Team-Zero-DSM/GreenER/issues/75)),
US08 ([#3](https://github.com/Team-Zero-DSM/GreenER/issues/3)),
US13 ([#74](https://github.com/Team-Zero-DSM/GreenER/issues/74)) e
US14 ([#76](https://github.com/Team-Zero-DSM/GreenER/issues/76)).
US08 continua o trabalho anterior; a seleção original da Sprint 1 permanece preservada.

### Entregas e critérios de verificação

| Entrega | Escopo e verificação esperada | Issues | Responsáveis no GitHub |
|---|---|---|---|
| Histórico de status — US04/US05 | Tabela com serviço, horário e motivo; registrar falhas e recuperação sem interromper os demais serviços; consulta por serviço/período com paginação e validação. Distinguir indisponibilidade de serviço ativo sem métricas. | #89, #90, #91; histórias #72 e #73 | Pedro |
| Ranking — US13 | API com coletas armazenadas, período e ordenação por energia ou CO₂e; tela com filtros de 1h, 6h, 24h, 7d e 30d, gráfico e tabela; dados reais, atualização após coleta e tratamento de estados vazios/falhas. Conferir valores com o banco no mesmo período. | #92, #102–#106; história #74 | Paulo no frontend; backend a definir |
| Comparação — US14 | Selecionar de dois a cinco serviços sem duplicação, usar o mesmo período, selecionar métrica e serviço principal; integrar API, gráficos e resumo com diferença percentual, ausência de dados e média zero. As opções regionais/cenários de #83/#84 exigem delimitação com a Sprint 3. | #82–#86, #93; história #76 | Henrique no frontend; backend a definir |
| Dashboard e regiões — US08 | Concluir inspeção regional da #32; listagem e foco no globo/mapa, modo 2D, marcadores proporcionais, header, cards regionais, gráfico de intensidade e mapa das regiões. Validar serviços por região e responsividade. | #32, #79–#81, #94, #97–#99; história #3 | Gabriel em #32/#79–#81; Vitor em #97; demais a definir |
| Indicadores consolidados — US07 | Demonstrar energia total, CO₂e total, serviços ativos e indisponíveis do ambiente. Os cards regionais de #97 não comprovam sozinhos os quatro critérios globais. | História #75; #97 como contribuição regional | A definir; falta tarefa explícita para consolidar os quatro indicadores |
| Documentação e validação | Atualizar diagramas, README, dailies, contratos e modelo; validar histórico de status, ranking, comparação e filtro regional com dados reais e registrar resultados. | #40, #77, #78, #95, #96 | Henrique em #40/#77/#78; #95/#96 a definir |

Os títulos, links, responsáveis e estados individuais das **28 tarefas**, inclusive
as fechadas, estão no [Sprint Backlog completo](./sprint-2/sprint-2.md#sprint-backlog).
Responsável a definir significa ausência de atribuição na issue consultada;
não foi inferida uma divisão individual.

### Situação observada e sequência de entrega

- **Fechadas:** #77 e #78, com PRs #87/#88 integrados em `develop`, e #82,
  com PR #100 integrado. A estrutura da comparação não encerra a US14.
  #40 também está fechada, mas seu fechamento ocorreu em **19/10**, antes
  desta sprint; documentação e dailies continuam sendo acompanhamento recorrente.
- **Abertas com avanço declarado:** #89 tem checklist completo, mas o
  [PR #101](https://github.com/Team-Zero-DSM/GreenER/pull/101) permanece aberto;
  integração e preservação dos dados ainda precisam de evidência. #80 tem três
  critérios marcados e dois pendentes. #32 mantém a inspeção regional desmarcada.
- **Divergência a conciliar:** a [daily de 22/10](./sprint-2/dailies.md#-22102026)
  relata conclusão da visualização das métricas; a #32 segue aberta com critério
  pendente. Preservar o relato sem declarar o saldo de T15 aceito.
- **Dependências do histórico:** #89 → #90 → #91; a validação de #95 deve cobrir
  gravação, recuperação e consulta, além da diferença entre US04 e US05.
- **Integrações:** #92 alimenta #104 e os componentes de ranking; #93 fornece os
  dados para #84–#86; #94 sustenta a inspeção/listagem regional. Estruturas visuais
  podem avançar em paralelo, mas a entrega exige integração real.
- **Fechamento:** validar as funcionalidades em #95, atualizar contratos e modelo
  em #96, reunir evidências por história e registrar review/aceite. Não há nova
  estimativa de pontos nem declaração de homologação nesta revisão documental.

### Matriz da Sprint 2

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog vinculado a requisitos e histórias | Conferir as seis histórias e 28 tarefas | Equipe | [Sprint Backlog](./sprint-2/sprint-2.md#sprint-backlog) | Registrado; completar cobertura de US07 |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e dependências | Conferir este plano, atribuições e planejamento de 20/10 | Equipe | [Registro da sprint](./sprint-2/sprint-2.md), [dailies](./sprint-2/dailies.md) | Em execução; há tarefas sem atribuição |
| ES03 | RNF11 | Critérios verificáveis por história | Conferir checklists e resultados de integração | Equipe | Issues #3 e #72–#76 no [registro](./sprint-2/sprint-2.md) | Critérios disponíveis; ampliar histórico em US04/US05 e delimitar cenários |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir issues e PRs vinculados | Equipe | [Backlog e evidências](./sprint-2/sprint-2.md) | PRs #87/#88/#100 integrados; #101 aberto |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe | [Commits](https://github.com/Team-Zero-DSM/GreenER/commits/develop/), PRs no registro | Evolução registrada; acompanhar próximas entregas |
| ES06 | RNF12 | Review, feedback e adaptação | Relacionar feedback às mudanças e registrar encerramento | Equipe | [Dailies](./sprint-2/dailies.md), especialmente 21/10 | Ajustes relatados; review final pendente |
| ES07 | RNF11, RNF12 | DoD sustentada por evidências | Conferir resultados por tarefa e aceite por história | Equipe; #95 sem atribuição | #95 e [ressalvas do registro](./sprint-2/sprint-2.md) | Validação da sprint e aceite pendentes |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir diagramas, README, dailies, contratos e modelo | Henrique; #96 sem atribuição | #40, #77, #78 e #96 no [backlog](./sprint-2/sprint-2.md#sprint-backlog) | Diagramas com PRs integrados; documentação de backend/banco aberta |
| ES09 | RNF12 | Participação dos cinco integrantes | Conferir presença, atividades, atribuições e artefatos | Todos | [Dailies](./sprint-2/dailies.md), [responsáveis](./sprint-2/sprint-2.md#sprint-backlog) | Acompanhamento registrado; consolidar na review |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir alterações e compilar aplicações | Equipe | [Frontend](../frontend/package.json), [backend](../backend/package.json), #95 | Base existente; revalidar alterações da sprint |
| DW02, DW03, DW07 | Recursos da Sprint 1 | Preservar integrações, APIs e Docker | Reexecutar verificações relevantes e contratos de #91–#94 | Pedro; endpoints e #95 sem atribuição | #89–#95 no [backlog](./sprint-2/sprint-2.md#sprint-backlog) | Revalidação e novas integrações pendentes |
| DW04, DW05 | RF09, RF11, RF14, RF15 | Ranking, comparação e regiões com dados reais | Validar filtros, período, atualização e falhas na interface | Paulo, Henrique, Gabriel e Vitor; atribuições conforme backlog | #32, #79–#86, #97–#99, #102–#106 | Estrutura de comparação fechada; integrações abertas |
| BD01–BD04 | RF05, RF06, RF08, RF10, RF14, RF15; RP03 | Histórico de status, consultas e agregações | Preservar dados existentes e comparar API × SQL no mesmo período | Pedro; #92/#93/#95 sem atribuição | #89–#93, #95/#96 | PR de tabela aberto; persistência, consulta e validação pendentes |
| TP01–TP03 | Histórico, ranking, comparação e regiões | Modelagem, tipos e isolamento de falhas | Conferir entradas inválidas, dados ausentes, recuperação e média zero | Equipe | Critérios de #90–#95 e #86 | Verificações previstas; resultados a registrar |

## Sprint 3 — Autenticação e cenários avançados

**10/11/2026 a 23/11/2026**

**Objetivo e entrega:** implementar autenticação JWT e proteção das áreas
correspondentes e desenvolver simulações avançadas de impacto em regiões
alternativas. A comparação entre serviços em períodos equivalentes foi alocada
à Sprint 2 no GitHub (#76, #82–#86 e #93). Delimitar as simulações avançadas em
relação à configuração regional/cenários já prevista em #83/#84, evitando contar
a mesma entrega nas duas sprints. Manter as funcionalidades das entregas anteriores.

O planejamento detalhado será registrado no início da sprint. Não existe
implementação de autenticação funcional nem evidência de Sprint 3 concluída.

### Matriz da Sprint 3

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog priorizado e vinculado a requisitos | Conferir histórias e tarefas selecionadas | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e entregas | Conferir plano e Sprint Backlog | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES03 | RNF11 | Critérios de aceite verificáveis | Relacionar critérios das histórias às evidências | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir links de issues e PRs da sprint | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES06 | RNF12 | Review, feedback e adaptação do backlog | Conferir resultados e decisões no encerramento | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES07 | RNF11, RNF12 | DoD aplicada às entregas concluídas | Conferir critérios, resultados e limites de validação | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir links, comandos, contratos e limites | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| ES09 | RNF12 | Participação verificável dos cinco integrantes | Conferir artefatos por integrante, além de commits | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir código e dependências usadas | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 3 a criar | Planejado; revalidar os itens anteriores |
| DW06 | RP06; RNF05 interno | Login JWT e proteção no backend | Validar login, rejeição de token e acesso autorizado | [PREENCHER] | Módulo auth e verificações a implementar | Planejado para a Sprint 3 |
| DW02, DW03, DW07 | Recursos das sprints anteriores | Preservar integrações, API e execução | Revalidar comportamento e regressões | Equipe | Código e verificações da entrega | Planejado e cumulativo |
| DW04, DW05 | Cenários regionais; RF15 cumulativo | Simulações avançadas e preservação da comparação da Sprint 2 | Delimitar cenários adicionais e conferir resultados com dados reais | A definir | Issues e PRs a definir; #83/#84 como limite do escopo anterior | Planejado; delimitação pendente |
| BD01–BD04 | RP03; histórico e análises | Consultas e modelo para cenários adicionais | Conferir filtros e relacionamentos por período | A definir | SQL e evidências a definir | Planejado e cumulativo |
| TP01–TP03 | Autenticação e análises | Manter modelagem, tipos e tratamento de falhas | Validar regras e comportamentos de falha | Equipe | Código e verificações a definir | Planejado e cumulativo |

## Decisões de escopo e pendências de planejamento

| Item | Decisão confirmada | Reflexo no planejamento |
|---|---|---|
| Autenticação | Sprint 3. | Removida da entrega da Sprint 1; continua no backlog do produto. |
| Persistência e histórico de métricas | Entregas técnicas da Sprint 1. | Relacionados às tarefas de backend/banco e BD01–BD04; não incluem automaticamente a US10 na seleção. |
| Histórico de status | Ampliação da Sprint 2 vinculada a US04/US05. | #89–#91; registrar critérios adicionais nas histórias e validar preservação dos dados. |
| Comparação entre serviços | Sprint 2, conforme milestone e #76/#82–#86/#93. | Corrigida a alocação anterior na Sprint 3; estrutura entregue não equivale a comparação integrada. |
| Cenários regionais | #83/#84 já preveem opções regionais na comparação da Sprint 2. | Delimitar o que será simulação avançada adicional da Sprint 3 antes de fechar seu backlog. |
| Indicadores consolidados | US07 selecionada na Sprint 2 (#75). | Associar tarefa e responsável para os quatro indicadores globais; cards regionais não encerram a história. |
| Mapa/globo | Globo integrado na Sprint 1; continuação de T15 na Sprint 2, com Gabriel. | Falta apresentar os serviços associados ao inspecionar uma região; #32 continua como referência do saldo, sem declarar a tarefa inteira concluída. |
| Intervalo pela aplicação | Depois; sprint a definir. | Não confundir variável de ambiente, tabela existente e endpoint funcional. Alocar antes do fechamento do plano final. |
| Parâmetros ambientais | Valores iniciais correspondem ao exemplo do modelo simplificado do desafio. | Fonte, unidades e aplicação registradas em [cálculo.md](./cálculo.md); não representam calibração de hardware real. |

As decisões acima orientam o planejamento das entregas.
Não representam uma Sprint Review realizada. Feedback, responsáveis futuros
e aceite formal devem ser registrados quando efetivamente definidos.
