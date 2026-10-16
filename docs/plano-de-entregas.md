# Plano de Entregas

Revisado em 15/10/2026 na branch `40-documentar-readme-e-registrar-dailys`,
com base no código `41808d7`, no GitHub e nas decisões confirmadas pela equipe.
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
- A autenticação foi alocada à Sprint 3. Persistência e histórico são Sprint 1.
  Mapa/globo permanece na Sprint 1, em desenvolvimento por Gabriel.
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

O backend já armazena e consulta o histórico. A interface ainda utiliza mocks;
integração, atualização automática e mapa continuam em desenvolvimento.
Autenticação e configuração do intervalo pela aplicação não compõem esta entrega.

### Matriz da Sprint 1

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog priorizado e vinculado a requisitos | Conferir histórias e tarefas selecionadas | Henrique e equipe | [Backlog](../README.md) | Documentado; revisar cobertura |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e entregas | Conferir plano e Sprint Backlog | Henrique e equipe | [Sprint 1](./sprint-1/sprint-1.md) | Documentado; acompanhar execução |
| ES03 | RNF11 | Critérios de aceite de US01, US03, US08 e US09 | Relacionar os critérios das quatro histórias selecionadas às evidências | Equipe | [User Stories](../README.md) | Documentado; validar por história |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir links de issues e PRs da sprint | Equipe | [Rastreabilidade](./sprint-1/sprint-1.md#evidências-e-rastreabilidade) | Há vínculos; reconciliar issues abertas |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe | [Commits](https://github.com/Team-Zero-DSM/GreenER/commits/develop/) | Histórico disponível |
| ES06 | RNF12 | Review, feedback e adaptação do backlog | Conferir resultados e decisões no encerramento | Equipe | [Sprint Review](./sprint-1/sprint-1.md#-sprint-review) | Pendente de encerramento |
| ES07 | RNF11, RNF12 | DoD aplicada às entregas concluídas | Conferir escopo, procedimento, resultado e limite por tarefa | Equipe | [DoD geral](../README.md) e [evidências de 22 tarefas](./sprint-1/evidencias-dod.md) | Aplicação registrada por tarefa; preservar pendências de integração e aceite das histórias |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir links, comandos, contratos e limites | Henrique e equipe | [README](../README.md) e documentos vinculados | Revisada; reprodução externa a conferir |
| ES09 | RNF12 | Participação verificável dos cinco integrantes | Conferir artefatos por integrante, além de commits | Todos os integrantes | [Participação](./sprint-1/sprint-1.md#participação-da-equipe) | Evidências registradas |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir código e dependências usadas | Pedro, Paulo, Gabriel e equipe | [Frontend](../frontend/package.json), [backend](../backend/package.json) | Implementado |
| DW02 | RF01, RF03; impacto ambiental | Descoberta, métricas e carbono | Observar integrações, coletas e falhas | Pedro e Vitor | [Integrações](../backend/src/integrations/), [verificações V03/V06](./sprint-1/evidencias-dod.md) | Consultas reais e recorrência verificadas; ampliar cenários de falha |
| DW03 | RF01, RF03, RF10 | API modular, contratos e SQL nos repositories | Consultar rotas reais e validar respostas | Pedro e Vitor | [API](./API.md), [verificação V02](./sprint-1/evidencias-dod.md) | Estrutura e contratos existentes verificados; listagem interna pendente em T05 (#22) |
| DW04 | RF09, RF10; RNF01 interno | Interface consumindo o backend | Desativar mocks e conferir chamadas e renderização | Paulo e Gabriel | [Interface](../frontend/arquitetura.md) | Parcial: integração pendente (#35) |
| DW05 | RF11; RNF02 interno | Dashboard atualizado sem recarga | Observar consultas sucessivas e horário real | Paulo e Gabriel | [Issues #36](https://github.com/Team-Zero-DSM/GreenER/issues/36) e [#37](https://github.com/Team-Zero-DSM/GreenER/issues/37) | Pendente; contador demonstrativo |
| DW07 | RP04; RNF07 interno | Frontend, backend e banco no Compose | Iniciar serviços e conferir status | Pedro | [Compose](../docker-compose.yml), [verificação V01](./sprint-1/evidencias-dod.md) | Configuração válida e três serviços ativos; clone limpo não verificado |
| BD01 | RF10, RP03 | Modelo, DDL e restrições | Aplicar schema em banco vazio de avaliação | Pedro e Vitor | [Schema](../database/schema.sql), [modelo](../database/arquitetura.md), [verificação V10](./sprint-1/evidencias-dod.md) | DDL executado sem erro em banco vazio descartável; seis tabelas criadas |
| BD02 | RF10, RP03 | DML explícito e parametrizado | Conferir placeholders e operações | Pedro e Vitor | [Repositories](../backend/src/modules/) | Implementado |
| BD03 | RF10, RP03 | Gravação, recuperação e retenção | Comparar registro antes e depois de reinicialização | Pedro | [Banco](../database/arquitetura.md) | Integração presente; retenção a registrar |
| BD04 | RF10 | Histórico e totais por período | Consultar dados conhecidos e conferir filtros/agregações | Pedro | [Analytics](../backend/src/modules/analytics/analytics.repository.ts), [verificação V11](./sprint-1/evidencias-dod.md) | Contagem, energia e CO₂e da API coincidiram com SQL no mesmo período; pontos ordenados |
| TP01 | Organização do código | Classes usadas com responsabilidades definidas | Inspecionar services, repositories e clients | Pedro e Vitor | [Módulos](../backend/src/modules/) | Implementado |
| TP02 | RP01, RP02 | Tipos coerentes e validação de contratos | Executar TypeScript e conferir schemas | Equipe | [Schemas](../backend/src/integrations/), [verificações V01/V04](./sprint-1/evidencias-dod.md) | TypeScript sem erros nas duas aplicações; mapper verificado em runtime |
| TP03 | RNF04 interno | Tratamento de falhas preservando o sistema | Verificar validações e falhas isoladas | Pedro e Vitor | [Coleta](../backend/src/modules/collections/collections.service.ts) | Implementado; ampliar evidências de falhas |

## Sprint 2 — Rankings de impacto ambiental

**20/10/2026 a 09/11/2026**

**Objetivo e entrega:** apresentar rankings de consumo energético e emissões
por período, usando as coletas e o histórico da Sprint 1. Preservar os recursos
aceitos anteriormente. Persistência e histórico técnico são entregas da Sprint 1;
isso não altera a seleção original de quatro histórias nem equivale ao aceite da US10.

O Sprint Backlog, responsáveis individuais, PRs e procedimentos serão
detalhados no início da sprint; não existe registro de execução da Sprint 2.

### Matriz da Sprint 2

| Código | Requisito relacionado | Entrega concreta | Como verificar | Responsáveis | Evidência no GitHub | Situação |
|---|---|---|---|---|---|---|
| ES01 | RNF11, RNF12 | Backlog priorizado e vinculado a requisitos | Conferir histórias e tarefas selecionadas | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES02 | RNF12 | Objetivo, seleção, responsáveis e entregas | Conferir plano e Sprint Backlog | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES03 | RNF11 | Critérios de aceite verificáveis | Relacionar critérios das histórias às evidências | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES04 | RNF11 | Rastreabilidade requisito → tarefa → código | Seguir links de issues e PRs da sprint | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES05 | RNF12 | Evolução incremental | Examinar commits e merges do período | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES06 | RNF12 | Review, feedback e adaptação do backlog | Conferir resultados e decisões no encerramento | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES07 | RNF11, RNF12 | DoD aplicada às entregas concluídas | Conferir critérios, resultados e limites de validação | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES08 | RNF08 | Documentação compatível com a entrega | Conferir links, comandos, contratos e limites | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| ES09 | RNF12 | Participação verificável dos cinco integrantes | Conferir artefatos por integrante, além de commits | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| DW01 | RP01, RP02; RNF09 interno | React/TS, Node/TS e separação das partes | Conferir código e dependências usadas | Equipe; detalhar no planejamento | [Plano](./plano-de-entregas.md); registro da Sprint 2 a criar | Planejado; revalidar os itens anteriores |
| DW02, DW03, DW07 | Recursos aceitos na Sprint 1 | Preservar APIs, backend e execução Docker | Reexecutar verificações relevantes | Equipe; detalhar | Código e verificações da entrega anterior | Revalidação planejada |
| DW04, DW05 | RF09, RF11, RF14 interno | Ranking integrado e atualização dos dados | Validar tela com consultas reais e período | [PREENCHER] | Issues e PRs a definir | Planejado |
| BD01–BD04 | RF10, RF14 interno; RP03 | SQL e persistência que suportam rankings | Conferir filtros, ordenação e totais com dados conhecidos | [PREENCHER] | Repositories e evidências a definir | Planejado e cumulativo |
| TP01–TP03 | Implementação dos rankings | Manter modelagem, tipos e tratamento de falhas | Revalidar alterações e regressões | Equipe | Código e verificações a definir | Planejado e cumulativo |

## Sprint 3 — Autenticação, comparação e análises avançadas

**10/11/2026 a 23/11/2026**

**Objetivo e entrega:** implementar autenticação JWT e proteção das áreas
correspondentes, comparar serviços em períodos equivalentes e simular o impacto
em regiões alternativas. Manter as funcionalidades aceitas nas entregas anteriores.

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
| DW04, DW05 | RF15 e cenários regionais | Interfaces integradas de comparação e simulação | Selecionar serviços/período/região e conferir resultados | [PREENCHER] | Issues e PRs a definir | Planejado e cumulativo |
| BD01–BD04 | RP03; histórico e análises | Consultas e modelo para comparação e cenários | Conferir filtros e relacionamentos por período | [PREENCHER] | SQL e evidências a definir | Planejado e cumulativo |
| TP01–TP03 | Autenticação e análises | Manter modelagem, tipos e tratamento de falhas | Validar regras e comportamentos de falha | Equipe | Código e verificações a definir | Planejado e cumulativo |

## Decisões de escopo e pendências de planejamento

| Item | Decisão confirmada | Reflexo no planejamento |
|---|---|---|
| Autenticação | Sprint 3. | Removida da entrega da Sprint 1; continua no backlog do produto. |
| Persistência e histórico | Entregas técnicas da Sprint 1. | Relacionados às tarefas de backend/banco e BD01–BD04; não incluem automaticamente a US10 na seleção. |
| Mapa/globo | Sprint 1; Gabriel em desenvolvimento. | Rastreado pela página inicial (#29) e pelo escopo visual da #32. |
| Intervalo pela aplicação | Depois; sprint a definir. | Não confundir variável de ambiente, tabela existente e endpoint funcional. Alocar antes do fechamento do plano final. |
| Parâmetros ambientais | Valores iniciais correspondem ao exemplo do modelo simplificado do desafio. | Fonte, unidades e aplicação registradas em [cálculo.md](./cálculo.md); não representam calibração de hardware real. |

As decisões acima orientam o planejamento das entregas.
Não representam uma Sprint Review realizada. Feedback, responsáveis futuros
e aceite formal devem ser registrados quando efetivamente definidos.
