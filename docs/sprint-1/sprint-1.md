# 🚀 Sprint 1 — Planejamento e Acompanhamento

## Versão e leitura dos estados

Atualizado em 15/10/2026, código-base `41808d7` desta branch.
✅ na tabela representa tarefa implementada no seu escopo, não aceite automático
da história. Telas podem ter escopo visual concluído com mocks enquanto a
integração permanece pendente em T17. Review, retrospectiva e vídeo ainda
aguardam confirmação no encerramento de 19/10.

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
visualização geográfica permanece nesta entrega, vinculada à US08 e à issue #32,
com Gabriel em desenvolvimento. Autenticação fica na Sprint 3; configuração do
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
| **T15** | Criar componente de visualização das métricas | gabriel | 🔄 | 3 | RF09 |
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
- ✅ Concluída

## 📊 Progresso da Sprint
- Total: 120 pontos
- Concluídos: 117 pontos
- Em andamento: 3 pontos
- Não iniciados: 0 pontos
- Progresso geral: 97,50%

---

## 📈 Burndown da Sprint

<p align="center">
    <img src="./BurndownSprint1.svg" alt="Gráfico de Burndown">
</p>

---

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
