# 🚀 Sprint 1 — Planejamento e Acompanhamento

## 🎯 Sprint Goal

Entregar a primeira versão funcional do GreenER, capaz de consultar serviços e métricas por meio das APIs disponibilizadas pelo projeto, processar essas informações no backend e apresentá-las em uma interface web atualizada automaticamente, com toda a aplicação executando através de containers Docker.

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

---

## 📋 Sprint Backlog

| ID | Tarefa | Responsável | Status | Pontos | Requisito |
|------|------|------|------|------|------|
| **T01** | Definir e documentar a arquitetura do projeto | Henrique | 🔄 | 5 | RNF08 |
| **T02** | Configurar estrutura inicial do backend | Pedro | ✅ | 2 | RF01 |
| **T03** | Implementar integração com o endpoint de descoberta de serviços | Vitor | ✅ | 5 | RF01 |
| **T04** | Criar modelo de representação dos serviços (DTO/Entidade) | Vitor / Pedro | 🔄 | 3 | RF01 |
| **T05** | Implementar endpoint interno para disponibilizar os serviços ao frontend | Vitor | ❌ | 5 | RF01 |
| **T06** | Implementar integração com o endpoint `/metrics/{id_servico}` | Pedro | ✅ | 5 | RF03 |
| **T07** | Implementar processamento das métricas recebidas | Pedro | 🔄 | 5 | RF03 |
| **T08** | Implementar rotina periódica de coleta de métricas | Vitor | ❌ | 8 | RF03, RF11 |
| **T09** | Disponibilizar métricas processadas através do backend | Pedro | ❌ | 5 | RF03 |
| **T10** | Testar atualização periódica das métricas | Vitor | ❌ | 2 | RF03 |
| **T11** | Definir layout inicial da aplicação | Paulo / Gabriel | 🔄 | 3 | RF09 |
| **T12** | Desenvolver página inicial do GreenER | Gabriel | 🔄 | 5 | RF09 |
| **T13** | Desenvolver página de detalhamento de serviço | Paulo | 🔄 | 5 | RF09 |
| **T14** | Criar componente de listagem dos serviços | Gabriel | ❌ | 3 | RF09 |
| **T15** | Criar componente de visualização das métricas | Paulo | ❌ | 3 | RF09 |
| **T16** | Implementar indicadores visuais de status dos serviços | Paulo / Gabriel | 🔄 | 3 | RF05, RF06, RF09 |
| **T17** | Integrar frontend com os endpoints do backend | Paulo / Gabriel | ❌ | 5 | RF09 |
| **T18** | Implementar atualização automática das informações exibidas | Paulo / Gabriel | ❌ | 8 | RF11, RNF02 |
| **T19** | Testar atualização automática dos dados sem recarregamento da página | Paulo / Gabriel | ❌ | 2 | RF11, RNF02 |
| **T20** | Preparar estrutura inicial do PostgreSQL para futuras funcionalidades | Pedro | ✅ | 3 | RNF06 |
| **T21** | Configurar container PostgreSQL | Pedro | ✅ | 2 | RNF07 |
| **T22** | Configurar Docker do backend | Pedro | ✅ | 2 | RNF07 |
| **T23** | Configurar Docker do frontend | Pedro | ✅ | 2 | RNF07 |
| **T24** | Configurar Docker Compose do projeto | Pedro | ✅ | 5 | RNF07 |
| **T25** | Configurar ambiente de desenvolvimento compartilhado (Git, branches e fluxo de trabalho) | Pedro | ✅ | 3 | RNF09 |
| **T26** | Elaborar documentação inicial de execução do projeto | Henrique | ✅ | 3 | RNF08 |
| **T27** | Criar diagrama de casos de uso geral do sistema | Henrique | ✅ | 3 | RNF08 |
| **T28** | Criar diagrama de classes inicial do sistema | Henrique | ✅ | 5 | RNF08, RNF09 |
| **T29** | Criar diagramas de sequência iniciais do projeto | Henrique | ❌ | 5 | RNF08, RNF09 |
| **T30** | Documentar modelagem do banco (MER/DER) | Vitor | ✅ | 5 | RNF08, RNF09 |

## 📌 Legenda de Status

- **❌ Não iniciada**
- **🔄 Em andamento**
- **✅ Concluída**

## 📊 Progresso da Sprint

- **Total:** 120 pontos
- **Concluídos:** 45 pontos
- **Em andamento:** 29 pontos
- **Restantes:** 46 pontos
- **Progresso Geral:** 37,5%

---

## 📈 Burndown da Sprint

<p align="center">
    <img src="./burndown.svg" alt="Grafico de Burndown">
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

> Link da apresentação ou vídeo demonstrando as entregas realizadas durante a Sprint.