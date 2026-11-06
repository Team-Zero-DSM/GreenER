# 🚀 Sprint 2 — Planejamento e Acompanhamento

## Leitura dos estados

O acompanhamento distingue o relato da daily, a integração de um PR e o
aceite de uma história. A inspeção de serviços por região segue nesta sprint
como saldo da T15 da Sprint 1, associado à issue #32. As evidências de
implementação e as verificações pendentes estão no [registro da DoD](./evidencias-dod.md).

## 🎯 Sprint Goal

O objetivo é ampliar a análise ambiental com rankings e comparação entre
serviços, registrar falhas e recuperação das coletas e evoluir o dashboard e as
visualizações regionais.

---

## 📅 Período

- **Início:** 20/10/2026
- **Término:** 09/11/2026

---

## 👥 User Stories Contempladas

| ID | User Story | Relação com a sprint |
|---|---|---|
| **US04** | Identificação de indisponibilidade | Selecionada no planejamento |
| **US05** | Identificação de ausência de métricas | Selecionada no planejamento |
| **US07** | Indicadores ambientais consolidados | Selecionada no planejamento |
| **US08** | Dashboard operacional | Continuidade da Sprint 1; parcialmente entregue |
| **US13** | Ranking de impacto | Selecionada no planejamento |
| **US14** | Comparação entre serviços | Selecionada no planejamento |

---

## Sprint Backlog

## 📋 Sprint Backlog — Sprint 2

| ID | Tarefa | Responsável | Status | Pontos |
|---|---|---|:---:|---:|
| **T01** | Implementar componentes e interações da comparação (#83) | henrique | ❌ | 8 |
| **T02** | Implementação da listagem de serviços e integração com o globo na landing page (#80) | gabriel | ❌ | 8 |
| **T03** | Criar componente de visualização das métricas (#32) | gabriel | ❌ | 3 |
| **T04** | Criar componente para exibição das regiões (#97) | vitor | ❌ | 3 |
| **T05** | Criar componente para exibição de carbono por região (#98) | gabriel | ❌ | 3 |
| **T06** | Criar componente para exibição do mapa 2D com as regiões (#99) | gabriel | ❌ | 8 |
| **T07** | Criar estrutura da tela de ranking (#102) | paulo | ❌ | 3 |
| **T08** | Implementar filtros de critério e período do ranking (#103) | paulo | ❌ | 3 |
| **T09** | Integrar a tela de ranking ao backend (#104) | paulo | ❌ | 5 |
| **T10** | Implementar gráfico de barras do ranking (#105) | paulo | ❌ | 5 |
| **T11** | Implementar tabela de classificação do ranking (#106) | paulo | ❌ | 3 |
| **T12** | Atualizar diagrama de casos de uso (#77) | henrique | ✅ | 2 |
| **T13** | Elaborar diagramas de sequência (#78) | henrique | ✅ | 5 |
| **T14** | Criar estrutura da tela de comparação (#82) | henrique | ✅ | 2 |
| **T15** | Criar tabela de histórico de status das coletas (#89) | pedro | ✅ | 3 |
| **T16** | Implementar registro do histórico de status das coletas (#90) | pedro | ✅ | 3 |
| **T17** | Criar componente de visualização das métricas (#63) | gabriel | ✅ | 3 |
| **T18** | Implementação das funcionalidades do globo (#79) | gabriel | ❌ | 0 |
| **T19** | Atualização da Header do projeto (#81) | gabriel | ❌ | 0 |
| **T20** | Integrar a tela de comparação ao backend (#84) | henrique | ❌ | 0 |
| **T21** | Implementar a visualização dos resultados comparativos (#85) | henrique | ❌ | 0 |
| **T22** | Implementar cálculos e resumo comparativo (#86) | henrique | ❌ | 0 |
| **T23** | Criar endpoint para consultar o histórico de status das coletas (#91) | pedro | ❌ | 0 |
| **T24** | Criar endpoints para a tela de ranking (#92) | pedro | ❌ | 0 |
| **T25** | Criar endpoints para a tela de comparação entre serviços (#93) | pedro | ❌ | 0 |
| **T26** | Validar endpoint de serviços por região (#94) | Vitor | ❌ | 0 |
| **T27** | Realizar testes das funcionalidades do backend (#95) | pedro | ❌ | 0 |
| **T28** | Atualizar documentação do backend e do banco de dados (#96) | pedro | ❌ | 0 |

As seis histórias e as 28 tarefas estão reunidas no [backlog por issue](./evidencias-dod.md#sprint-backlog),
com responsáveis, estimativas registradas e a situação observada em 25/10.
Os PRs integrados depois dessa conferência constam nas [evidências de integração](./evidencias-dod.md#evidências-e-limites-de-conclusão).

---

## 📈 Burndown da Sprint

<p align="center">
    <img src="./Burndown-Sprint2.svg" alt="Gráfico de Burndown">
</p>

---

## Evidências e rastreabilidade

| História | Tarefas vinculadas | Evidência disponível |
|---|---|---|
| US04 e US05 | #89–#91 | PRs #101, #107 e #108 integrados. A daily de 28/10 registra a entrega do histórico de status. |
| US07 | #97 como contribuição regional | PR #110 integrado para o componente regional. A consolidação dos indicadores globais segue como critério da história. |
| US08 | #32, #79–#81, #94 e #97–#99 | A daily de 22/10 registra avanço em visualização. Os PRs #110, #115 e #118 registram entregas regionais. |
| US13 | #92 e #102–#106 | PRs #109, #112, #114 e #116 integram estrutura, filtros, módulo de ranking e gráfico. A integração da tela está vinculada à #104. |
| US14 | #82–#86 e #93 | PRs #100, #111 e #113 integram estrutura, interações e endpoint. A ligação da tela ao backend está vinculada à #84. |

Os vínculos com os PRs, a revisão de `develop` usada na conferência e as
ressalvas estão no [registro de evidências](./evidencias-dod.md#evidências-e-limites-de-conclusão).

## Participação da equipe

| Integrante | Presença nas sete dailies registradas | Atividades registradas |
|---|---:|---|
| Henrique | 7 | Diagramas de casos de uso e sequência. Planejamento da integração da comparação. |
| Paulo | 5 | Desenvolvimento e entrega da estrutura da página de ranking. |
| Gabriel | 5 | Visualização das métricas e ajustes da página inicial. |
| Pedro | 7 | Planejamento dos endpoints e entrega do histórico de status de coleta. |
| Vitor | 7 | Tags da tela de regiões e ajustes para dispositivos móveis e tablets. |

A contagem cobre os registros de 20 a 28/10. O planejamento em equipe de 20/10
e o ajuste a partir do feedback do cliente em 21/10 também estão nas [dailies](./dailies.md).

## Verificações e Definition of Done

| Critério | Registro disponível | Pendência |
|---|---|---|
| Rastreabilidade | Histórias, issues e PRs identificados no registro de evidências. | Associar tarefa e responsável aos indicadores globais da US07. |
| Integração | Merges conferidos no histórico de `develop`. | Registrar os resultados das verificações das entregas na #95. |
| Aceite por história | Critérios e dependências relacionados no plano de entregas. | Consolidar o resultado por história na Sprint Review. |

Consulte as [pendências para o encerramento](./evidencias-dod.md#dependências-e-pendências-para-o-encerramento).

## 🔎 Sprint Review

> Preencher ao final da sprint

---

## 🔄 Sprint Retrospective

### O que funcionou?

> Preencher ao final da sprint

### O que não funcionou?

> Preencher ao final da sprint

### O que melhorar na próxima Sprint?

> Preencher ao final da sprint

---

## 🎥 Demonstração da Sprint

Link da apresentação da sprint: 

> Preencher ao final da sprint
