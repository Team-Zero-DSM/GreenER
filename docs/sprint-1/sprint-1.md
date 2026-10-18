# 🚀 Sprint 1 — Planejamento e Acompanhamento

## Leitura dos estados

✅ representa implementação no escopo da tarefa; aceite da história depende dos
critérios e das [evidências da DoD](./evidencias-dod.md). Lista, detalhe, histórico
e atualização automática usam dados reais. A parte restante de T15 foi transferida
para a Sprint 2: ao inspecionar uma região, apresentar seus serviços associados.
Review, retrospectiva e vídeo aguardam o encerramento de 19/10.

## 🎯 Sprint Goal

Entregar a primeira versão funcional do GreenER, capaz de consultar serviços e métricas por meio das APIs disponibilizadas pelo projeto, processar essas informações no backend, persistir as coletas, consultar o histórico e apresentá-las em uma interface web atualizada automaticamente, com toda a aplicação executando através de containers Docker.

---

## 📅 Período

- **Início:** 28/09/2026
- **Término:** 19/10/2026

---

## 👥 User Stories Contempladas

| ID | User Story |
|------|------|
| **US01** | Descoberta de serviços |
| **US03** | Coleta periódica de métricas |
| **US08** | Dashboard operacional |
| **US09** | Atualização automática do dashboard |

Estas são as quatro histórias selecionadas para a Sprint 1. Persistência e
histórico foram confirmados como entregas técnicas desta sprint; sua presença
no código não inclui automaticamente a US10 na seleção nem representa seu aceite. A
visualização geográfica já possui globo integrado, vinculado à US08 e à issue #32.
Por decisão da equipe, apresentar os serviços associados ao inspecionar uma região
fica para a Sprint 2, como continuação de T15, sob responsabilidade de Gabriel. Autenticação fica na Sprint 3; configuração do
intervalo pela aplicação terá sua sprint definida posteriormente.

---

## 📋 Sprint Backlog — Sprint 1

| ID | Tarefa | Responsável | Status | Pontos | Requisito |
|---|---|---|---|---:|---|
| **T01** | Definir e documentar a arquitetura do projeto | henrique | ✅ | 5 | RNF08 |
| **T02** | Configurar estrutura inicial do backend | pedro | ✅ | 2 | RF01 |
| **T03** | Implementar integração com endpoint de descoberta de serviços | vitor | ✅ | 5 | RF01 |
| **T04** | Criar modelo de representação dos serviços (DTO/Entidade) | vitor/pedro | ✅ | 3 | RF01 |
| **T05** | Implementar endpoint interno para disponibilizar serviços ao frontend | vitor | ✅ | 5 | RF01 |
| **T06** | Integrar `/metrics/{id_servico}` | pedro | ✅ | 5 | RF03 |
| **T07** | Processar métricas recebidas | pedro | ✅ | 5 | RF03 |
| **T08** | Rotina periódica de coleta | vitor | ✅ | 8 | RF03, RF11 |
| **T09** | Disponibilizar métricas processadas pelo backend | pedro | ✅ | 5 | RF03 |
| **T10** | Testar atualização periódica | vitor | ✅ | 2 | RF03 |
| **T11** | Layout inicial da aplicação | paulo/gabriel | ✅ | 3 | RF09 |
| **T12** | Página inicial GreenER | gabriel | ✅ | 5 | RF09 |
| **T13** | Página de detalhamento de serviço | paulo | ✅ | 5 | RF09 |
| **T14** | Componente de listagem dos serviços | paulo | ✅ | 3 | RF09 |
| **T15** | Criar componente de visualização das métricas | gabriel | ➡️ | 3 | RF09 |
| **T16** | Indicadores visuais de status | paulo/gabriel | ✅ | 3 | RF05, RF06, RF09 |
| **T17** | Integrar frontend com endpoints backend | paulo/gabriel | ✅ | 5 | RF09 |
| **T18** | Atualização automática das informações exibidas | paulo/gabriel | ✅ | 8 | RF11, RNF02 |
| **T19** | Testar atualização automática sem recarregar | paulo/gabriel | ✅ | 2 | RF11, RNF02 |
| **T20** | Preparar estrutura inicial PostgreSQL para futuras funcionalidades | pedro | ✅ | 3 | RNF06 |
| **T21** | Configurar container PostgreSQL | pedro | ✅ | 2 | RNF07 |
| **T22** | Configurar Docker backend | pedro | ✅ | 2 | RNF07 |
| **T23** | Configurar Docker frontend | pedro | ✅ | 2 | RNF07 |
| **T24** | Configurar Docker Compose | pedro | ✅ | 5 | RNF07 |
| **T25** | Ambiente de desenvolvimento compartilhado | pedro | ✅ | 3 | RNF09 |
| **T26** | Documentação inicial de execução | henrique | ✅ | 3 | RNF08 |
| **T27** | Diagrama de casos de uso geral | henrique | ✅ | 3 | RNF08 |
| **T28** | Diagrama de classes inicial | henrique | ✅ | 5 | RNF08, RNF09 |
| **T29** | Diagramas de sequência iniciais | henrique | ✅ | 5 | RNF08, RNF09 |
| **T30** | Modelagem do banco MER/DER | vitor | ✅ | 5 | RNF08, RNF09 |

## 📌 Legenda de Status
- ❌ Não iniciada
- 🔄 Em andamento
- ➡️ Parcialmente implementada; saldo transferido para a Sprint 2
- ✅ Concluída

## 📊 Progresso da Sprint
- Total: 120 pontos
- Concluídos: 117 pontos
- Transferidos para a Sprint 2: 3 pontos de T15, sem contabilizar conclusão parcial
- Em andamento nesta sprint: 0 pontos
- Não iniciados: 0 pontos
- Progresso sobre o compromisso original: 97,50%

O compromisso original de 120 pontos foi preservado. A transferência de T15 não
transforma os 3 pontos restantes em entrega concluída nem implica aceite integral
da US08. O burndown deve preservar esse saldo; a decisão não altera retroativamente
os registros diários.

---

## 📈 Burndown da Sprint

<p align="center">
    <img src="./BurndownSprint1.svg" alt="Gráfico de Burndown">
</p>

---

## Evidências e rastreabilidade

| Entrega / requisitos | Tarefas | Implementação e evidências |
|---|---|---|
| Descoberta — US01, RF01 | T02–T05 | [Services](../../backend/src/modules/services/), [integrações](../../backend/src/integrations/); PRs [#59](https://github.com/Team-Zero-DSM/GreenER/pull/59) e [#61](https://github.com/Team-Zero-DSM/GreenER/pull/61). |
| Coleta e métricas — US03, RF03/RF11 | T06–T10 | [Collections](../../backend/src/modules/collections/), [job](../../backend/src/jobs/collections.job.ts); PR [#55](https://github.com/Team-Zero-DSM/GreenER/pull/55). |
| Interface — US08, RF09 | T11–T17 | [Páginas](../../frontend/src/pages/), [globo](../../frontend/src/components/3d/GlobeView.tsx); PRs [#60](https://github.com/Team-Zero-DSM/GreenER/pull/60), [#63](https://github.com/Team-Zero-DSM/GreenER/pull/63) e [#64](https://github.com/Team-Zero-DSM/GreenER/pull/64). T15 conserva saldo para a Sprint 2. |
| Atualização — US09, RF11 | T18–T19 | [Provider](../../frontend/src/contexts/MonitoringProvider.tsx), [consultas](../../frontend/src/hooks/useApiQuery.ts); PR [#65](https://github.com/Team-Zero-DSM/GreenER/pull/65). |
| Persistência e infraestrutura — RNF06/RNF07 | T20–T25, T30 | [Schema](../../database/schema.sql), [Compose](../../docker-compose.yml), [banco](../../database/arquitetura.md). |
| Documentação e modelagem — RNF08/RNF09 | T01, T26–T29 | [Arquitetura](../arquitetura/arquitetura.md), [protótipos](../prototipo/prototipo.md), [plano](../plano-de-entregas.md). |

## Participação da equipe

| Integrante | Contribuições rastreáveis |
|---|---|
| Henrique | Arquitetura, documentação e diagramas: T01, T26–T29; [histórico](https://github.com/Team-Zero-DSM/GreenER/commits/). |
| Pedro | Backend, processamento, histórico e Docker: T02, T04, T06–T09, T20–T25; módulos e Compose vinculados acima. |
| Vitor | Descoberta, listagem, rotina, testes e modelagem: T03–T05, T08, T10, T30; PRs #55, #59 e #61. |
| Paulo | Detalhe, listagem, status e atualização: T11, T13–T14, T16–T19; PRs #64 e #65. |
| Gabriel | Layout, página inicial, globo e integração: T11–T12, T15–T19; PRs #60 e #63. Continuação de T15 na Sprint 2. |

As contribuições são verificáveis nos artefatos e no histórico; esta tabela não
substitui presença nas cerimônias, feedback ou aceite formal.

## Verificações e Definition of Done

Resultados, procedimentos e limites estão no [registro de evidências](./evidencias-dod.md).
As verificações distinguem os resultados anteriores à integração dos resultados
da aplicação integrada.
Persistência após reinicialização, aceite final das histórias e encerramento da
sprint permanecem pendentes até seus respectivos registros.

## 🔎 Sprint Review

> A ser preenchido ao final da Sprint.

---

## 🔄 Sprint Retrospective

### O que funcionou?

> A ser preenchido ao final da Sprint.

### O que não funcionou?

> A ser preenchido ao final da Sprint.

### O que melhorar na próxima Sprint?

> A ser preenchido ao final da Sprint.

---

## 🎥 Demonstração da Sprint

Link da apresentação ou vídeo e versão demonstrada: [PREENCHER após a gravação].
