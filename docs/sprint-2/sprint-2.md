# Sprint 2 — Ranking, comparação, histórico de status e regiões

**Período:** 20/10/2026 a 09/11/2026.
**Conferência do GitHub:** 25/10/2026.
**Fonte:** [milestone Sprint 2, incluindo fechadas](https://github.com/Team-Zero-DSM/GreenER/milestone/2?closed=1).

O objetivo é ampliar a análise ambiental com rankings e comparação entre
serviços, registrar falhas e recuperação das coletas e evoluir o dashboard e as
visualizações regionais. O [plano de entregas](../plano-de-entregas.md) contém
os critérios de verificação, a matriz de avaliação e a sequência das dependências.

A consulta abrangeu todas as issues abertas e fechadas do milestone e as duas
páginas de issues do repositório, sem encontrar outras issues fora do milestone
com menção textual a Sprint 2. Foram lidos descrições, critérios, atribuições,
estados e PRs relacionados. O estado do GitHub não representa uma nova execução
de testes, homologação da aplicação ou aceite formal das histórias.

## Histórias selecionadas

| História | Issue | Requisito | Situação no GitHub |
|---|---|---|---|
| US04 — Identificação de indisponibilidade | [#72](https://github.com/Team-Zero-DSM/GreenER/issues/72) | RF05, RNF04 | Aberta |
| US05 — Identificação de ausência de métricas | [#73](https://github.com/Team-Zero-DSM/GreenER/issues/73) | RF06, RNF04 | Aberta |
| US07 — Indicadores ambientais consolidados | [#75](https://github.com/Team-Zero-DSM/GreenER/issues/75) | RF08 | Aberta |
| US08 — Dashboard operacional | [#3](https://github.com/Team-Zero-DSM/GreenER/issues/3) | RF09, RNF01, RNF03 | Aberta; continuação da Sprint 1 |
| US13 — Ranking de impacto | [#74](https://github.com/Team-Zero-DSM/GreenER/issues/74) | RF14 | Aberta |
| US14 — Comparação entre serviços | [#76](https://github.com/Team-Zero-DSM/GreenER/issues/76) | RF15 | Aberta |

A seleção da Sprint 1 continua sendo US01, US03, US08 e US09. Persistência e
histórico de métricas da entrega anterior são a base das novas consultas;
histórico de **status** é a ampliação de US04/US05 prevista em #89–#91.
A comparação integra a Sprint 2 conforme o GitHub, substituindo sua alocação
anterior à Sprint 3. Autenticação continua na Sprint 3.

## Sprint Backlog

**34 issues: 6 histórias e 28 tarefas.** As histórias acima estão abertas;
a tabela abaixo reúne **24 tarefas abertas e 4 fechadas**. PRs não entram na
contagem. Responsáveis seguem as atribuições atuais das issues; onde não há
atribuição, consta “A definir”. As relações com histórias reproduzem os vínculos
dos corpos das issues; “Documentação” não cria uma história adicional.

| Issue | Tarefa | História / natureza | Responsável | Estado no GitHub / observação |
|---|---|---|---|---|
| [#32](https://github.com/Team-Zero-DSM/GreenER/issues/32) | Criar componente de visualização das métricas | US08 | Gabriel | Aberta; inspeção regional desmarcada; saldo de T15 |
| [#40](https://github.com/Team-Zero-DSM/GreenER/issues/40) | Documentar README e registrar Dailys | Documentação | Henrique | Fechada em 19/10, antes desta sprint; manutenção documental continua |
| [#77](https://github.com/Team-Zero-DSM/GreenER/issues/77) | Atualizar diagrama de casos de uso | Documentação | Henrique | Fechada; PR #87 integrado |
| [#78](https://github.com/Team-Zero-DSM/GreenER/issues/78) | Elaborar diagramas de sequência | Documentação | Henrique | Fechada; PR #88 integrado |
| [#79](https://github.com/Team-Zero-DSM/GreenER/issues/79) | Implementação das funcionalidades do globo | US08 | Gabriel | Aberta |
| [#80](https://github.com/Team-Zero-DSM/GreenER/issues/80) | Implementação da listagem de serviços e integração com o globo na landing page | US08 | Gabriel | Aberta; 3 de 5 critérios marcados |
| [#81](https://github.com/Team-Zero-DSM/GreenER/issues/81) | Atualização da Header do projeto | US08 | Gabriel | Aberta |
| [#82](https://github.com/Team-Zero-DSM/GreenER/issues/82) | Criar estrutura da tela de comparação | US14 | Henrique | Fechada; PR #100 integrado; estrutura inicial |
| [#83](https://github.com/Team-Zero-DSM/GreenER/issues/83) | Implementar componentes e interações da comparação | US14 | Henrique | Aberta |
| [#84](https://github.com/Team-Zero-DSM/GreenER/issues/84) | Integrar a tela de comparação ao backend | US14 | Henrique | Aberta |
| [#85](https://github.com/Team-Zero-DSM/GreenER/issues/85) | Implementar a visualização dos resultados comparativos | US14 | Henrique | Aberta |
| [#86](https://github.com/Team-Zero-DSM/GreenER/issues/86) | Implementar cálculos e resumo comparativo | US14 | Henrique | Aberta |
| [#89](https://github.com/Team-Zero-DSM/GreenER/issues/89) | Criar tabela de histórico de status das coletas | US04, US05 | Pedro | Aberta; checklist completo; PR #101 aberto |
| [#90](https://github.com/Team-Zero-DSM/GreenER/issues/90) | Implementar registro do histórico de status das coletas | US04, US05 | Pedro | Aberta |
| [#91](https://github.com/Team-Zero-DSM/GreenER/issues/91) | Criar endpoint para consultar o histórico de status das coletas | US04, US05 | Pedro | Aberta |
| [#92](https://github.com/Team-Zero-DSM/GreenER/issues/92) | Criar endpoints para a tela de ranking | US13 | A definir | Aberta |
| [#93](https://github.com/Team-Zero-DSM/GreenER/issues/93) | Criar endpoints para a tela de comparação entre serviços | US14 | A definir | Aberta |
| [#94](https://github.com/Team-Zero-DSM/GreenER/issues/94) | Validar endpoint de serviços por região | US08 | A definir | Aberta |
| [#95](https://github.com/Team-Zero-DSM/GreenER/issues/95) | Realizar testes das funcionalidades do backend | US04, US05, US08, US13, US14 | A definir | Aberta |
| [#96](https://github.com/Team-Zero-DSM/GreenER/issues/96) | Atualizar documentação do backend e do banco de dados | US04, US05, US08, US13, US14 | A definir | Aberta |
| [#97](https://github.com/Team-Zero-DSM/GreenER/issues/97) | Criar componente para exibição das regiões | US08 | Vitor | Aberta |
| [#98](https://github.com/Team-Zero-DSM/GreenER/issues/98) | Criar componente para exibição de carbono por região | US08 | A definir | Aberta |
| [#99](https://github.com/Team-Zero-DSM/GreenER/issues/99) | Criar componente para exibição do mapa 2D com as regiões | US08 | A definir | Aberta |
| [#102](https://github.com/Team-Zero-DSM/GreenER/issues/102) | Criar estrutura da tela de ranking | US13 | Paulo | Aberta |
| [#103](https://github.com/Team-Zero-DSM/GreenER/issues/103) | Implementar filtros de critério e período do ranking | US13 | Paulo | Aberta |
| [#104](https://github.com/Team-Zero-DSM/GreenER/issues/104) | Integrar a tela de ranking ao backend | US13 | Paulo | Aberta |
| [#105](https://github.com/Team-Zero-DSM/GreenER/issues/105) | Implementar gráfico de barras do ranking | US13 | Paulo | Aberta |
| [#106](https://github.com/Team-Zero-DSM/GreenER/issues/106) | Implementar tabela de classificação do ranking | US13 | Paulo | Aberta |

## Evidências e limites de conclusão

| Item | Evidência consultada | Interpretação para a entrega |
|---|---|---|
| #77 — Casos de uso | [PR #87](https://github.com/Team-Zero-DSM/GreenER/pull/87), integrado em `develop` em 21/10 | Tarefa fechada com alteração documental integrada. |
| #78 — Sequência | [PR #88](https://github.com/Team-Zero-DSM/GreenER/pull/88), integrado em `develop` em 22/10 | Tarefa fechada com alteração documental integrada. |
| #82 — Estrutura da comparação | [PR #100](https://github.com/Team-Zero-DSM/GreenER/pull/100), integrado em `develop` em 24/10 | Estrutura inicial entregue; interações, API e resultados continuam em #83–#86/#93. |
| #89 — Tabela de status | [PR #101](https://github.com/Team-Zero-DSM/GreenER/pull/101), aberto na consulta | Checklist completo não comprova integração; gravação e consulta são tarefas separadas. Validar preservação dos dados existentes. |
| #40 — README e dailies | Issue fechada em 19/10; [dailies desta sprint](./dailies.md) em 20, 21 e 22/10 | Não contabilizar o fechamento antigo como nova entrega; manutenção documental permanece necessária. |
| #32 — Inspeção regional | Critério desmarcado na issue; daily de 22/10 relata conclusão da visualização das métricas | Conciliar relato, critérios e integração; manter saldo da Sprint 1 pendente de validação. |
| #3 — Dashboard | Checklist completo, mas issue aberta e #32 com critério pendente | Não declarar US08 formalmente aceita pelo checklist isolado. |

## Dependências e pendências para o encerramento

- Histórico de status: #89 → #90 → #91. A existência da tabela não comprova
  gravação das ocorrências, consulta paginada nem recuperação após falhas.
- Ranking: #92 fornece dados para #104; a integração deve alimentar filtros,
  gráfico e tabela de #102–#106, com os mesmos valores e período do banco.
- Comparação: #82 é a base visual; #83 define as interações, #93 fornece dados
  para #84 e os resultados de #85/#86. Validar período comum, serviços sem
  dados, diferença percentual e média igual a zero.
- Dashboard/regiões: #94 valida os dados para a inspeção da #32 e a listagem
  de #80. Diferenciar o mapa da landing page (#79/#80) do mapa da tela de
  regiões (#99), mantendo header e navegação de #81 coerentes.
- US07 (#75): falta associação explícita de tarefa e responsável para energia
  total, CO₂e total, serviços ativos e indisponíveis do ambiente. #97 contribui
  com cards regionais e não comprova sozinha a consolidação global.
- US04/US05: #89–#91 ampliam o escopo para histórico; registrar essa ampliação
  nos critérios das histórias. A distinção entre indisponibilidade e serviço
  disponível sem métricas continua exigindo validação específica.
- Cenários: #83 prevê configurar região por serviço e #84 prevê enviar
  configurações de cenários. Delimitar o alcance disso nesta sprint e o que
  permanece como simulação avançada da Sprint 3.
- Atribuir responsáveis às tarefas sem responsável; estimativas e pontos não
  foram inferidos das propostas anteriores nem do estado das issues.
- #95 deve registrar validações reais de histórico, ranking, comparação e
  serviços por região, incluindo entradas inválidas e ausência de dados.
  #96 deve atualizar contratos, modelo e evidências da entrega.
- Registrar Sprint Review, feedback e aceite por história no encerramento.
  A contagem de issues fechadas não representa percentual de histórias aceitas.

## Acompanhamento

As [dailies](./dailies.md) registram planejamento em 20/10, ajustes a partir do
feedback do cliente em 21/10 e atividades/impedimentos em 22/10. Esses relatos
são preservados com seus limites de evidência. Este registro consolida a consulta
do GitHub em 25/10 e deve ser atualizado conforme novas integrações e validações.
