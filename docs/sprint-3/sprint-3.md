# 🚀 Sprint 3 — Entregas e Acompanhamento

## Situação da entrega

O [milestone da Sprint 3](https://github.com/Team-Zero-DSM/GreenER/milestone/3?closed=1)
reúne **34 tarefas concluídas**, além de cinco histórias fechadas no GitHub:
US06, US10, US15, US16 e US17. Todas estão em Done no Projects.
A refatoração final do frontend (#176) foi entregue pelo PR #220.

As entregas incluem autenticação e perfil, painel personalizável, administração,
configuração da coleta e das estimativas, relatórios em PDF e ajustes visuais.
Os PRs e os resultados dos testes estão nas [evidências da DoD](./evidencias-dod.md).

## 🎯 Sprint Goal

Entregar acesso autenticado ao GreenER, permitir que cada usuário personalize e
salve seu painel de monitoramento e disponibilizar a administração de usuários,
intervalos de coleta e parâmetros de estimativa, além da consulta e exportação
de relatórios com dados históricos. Preservar as funcionalidades das sprints
anteriores e aprimorar a consistência visual e a responsividade.

---

## 📅 Período

- **Início:** 10/11/2026
- **Término:** 23/11/2026

---

## 👥 User Stories Contempladas

| ID | User Story | Relação com a sprint |
|---|---|---|
| **US15** | Autenticação de usuários ([#151](https://github.com/Team-Zero-DSM/GreenER/issues/151)) | Selecionada no milestone; issue fechada. Cadastro, login, perfil, recuperação e controle de acesso. |
| **US17** | Painel de monitoramento personalizável ([#142](https://github.com/Team-Zero-DSM/GreenER/issues/142)) | Selecionada no milestone; issue fechada. Widgets, templates, edição, persistência e adaptação por dispositivo. |
| **US03** | Coleta periódica de métricas | Ampliação: intervalo configurável e aplicação nas próximas rodadas (#163/#164). |
| **US06** | Cálculo do impacto individual ([#153](https://github.com/Team-Zero-DSM/GreenER/issues/153)) | Presente no milestone; issue fechada. Ampliação: consulta, simulação e ativação de coeficientes (#165). |
| **US07** | Indicadores ambientais consolidados | Reutilizados no painel e nos relatórios (#144/#149/#167/#168). |
| **US08** | Dashboard operacional | Evolução visual, administração, responsividade e refatoração final (#176). |
| **US10** | Consulta do histórico de coletas ([#154](https://github.com/Team-Zero-DSM/GreenER/issues/154)) | Presente no milestone; issue fechada. Ampliação: prévia e exportação de relatórios (#167/#168). |
| **US14** | Comparação entre serviços | Vínculo registrado na tarefa de frontend dos relatórios (#195). |
| **US16** | Continuidade do monitoramento diante de falhas ([#155](https://github.com/Team-Zero-DSM/GreenER/issues/155)) | Presente no milestone; issue fechada. Ampliação da validação e preservação do intervalo diante de falhas de leitura (#164/#169). |

US06, US10, US15, US16 e US17 são as cinco histórias presentes no milestone.
As demais são relacionadas às tarefas e às funcionalidades ampliadas, sem
reclassificar as entregas das sprints anteriores. RF16 é o requisito do painel personalizável
definido na issue #142. Os demais códigos RF/RNF seguem a nomenclatura interna
do projeto.

A #195 vincula a interface de relatórios à US14; #167 e #168 vinculam o backend
principalmente à US10, com apoio da US07. Os vínculos foram preservados conforme
as issues. A simulação regional da comparação já existia na Sprint 2 e não foi
contabilizada como uma nova entrega de cenários avançados nesta sprint.

---

## 📋 Sprint Backlog — Sprint 3

| ID | Tarefa / issue | Responsável | Status | Pontos |
|---|---|---|:---:|---:|
| **T01** | [#136](https://github.com/Team-Zero-DSM/GreenER/issues/136) — Criar estrutura da página de perfil | Henrique | ✅ | 3 |
| **T02** | [#137](https://github.com/Team-Zero-DSM/GreenER/issues/137) — Desenvolver componentes da página de perfil | Henrique | ✅ | 5 |
| **T03** | [#138](https://github.com/Team-Zero-DSM/GreenER/issues/138) — Integrar página de perfil ao backend | Henrique | ✅ | 5 |
| **T04** | [#139](https://github.com/Team-Zero-DSM/GreenER/issues/139) — Criar estrutura das paginas de login e cadastro | Henrique | ✅ | 3 |
| **T05** | [#140](https://github.com/Team-Zero-DSM/GreenER/issues/140) — Desenvolver componentes das páginas de login e cadastro | Henrique | ✅ | 5 |
| **T06** | [#141](https://github.com/Team-Zero-DSM/GreenER/issues/141) — Integrar autenticação ao backend | Henrique | ✅ | 8 |
| **T07** | [#143](https://github.com/Team-Zero-DSM/GreenER/issues/143) — Criar estrutura da página do painel de monitoramento | Paulo | ✅ | 3 |
| **T08** | [#144](https://github.com/Team-Zero-DSM/GreenER/issues/144) — Desenvolver biblioteca de widgets do painel | Paulo | ✅ | 8 |
| **T09** | [#145](https://github.com/Team-Zero-DSM/GreenER/issues/145) — Implementar edição do layout do painel (arrastar, redimensionar e reposicionar) | Paulo | ✅ | 8 |
| **T10** | [#146](https://github.com/Team-Zero-DSM/GreenER/issues/146) — Implementar templates pré-definidos do painel | Paulo | ✅ | 5 |
| **T11** | [#147](https://github.com/Team-Zero-DSM/GreenER/issues/147) — Implementar personalização dos widgets (tipo de gráfico, cores e métrica) | Paulo | ✅ | 5 |
| **T12** | [#148](https://github.com/Team-Zero-DSM/GreenER/issues/148) — Criar persistência da configuração do painel no backend | Paulo | ✅ | 5 |
| **T13** | [#149](https://github.com/Team-Zero-DSM/GreenER/issues/149) — Integrar painel de monitoramento ao backend | Paulo | ✅ | 3 |
| **T14** | [#150](https://github.com/Team-Zero-DSM/GreenER/issues/150) — Adaptar painel de monitoramento para tablet e mobile | Paulo | ✅ | 2 |
| **T15** | [#156](https://github.com/Team-Zero-DSM/GreenER/issues/156) — Preparar banco de dados para cadastro e autenticação de usuários | Pedro | ✅ | 3 |
| **T16** | [#157](https://github.com/Team-Zero-DSM/GreenER/issues/157) — Implementar autenticação e proteção das rotas do backend | Pedro | ✅ | 5 |
| **T17** | [#158](https://github.com/Team-Zero-DSM/GreenER/issues/158) — Criar endpoints para as telas de login e cadastro | Pedro | ✅ | 5 |
| **T18** | [#159](https://github.com/Team-Zero-DSM/GreenER/issues/159) — Criar endpoints para a tela de perfil | Pedro | ✅ | 3 |
| **T19** | [#160](https://github.com/Team-Zero-DSM/GreenER/issues/160) — Criar endpoints para as telas de recuperação e redefinição de senha | Pedro | ✅ | 5 |
| **T20** | [#161](https://github.com/Team-Zero-DSM/GreenER/issues/161) — Criar rotina para cadastrar o primeiro administrador | Pedro | ✅ | 2 |
| **T21** | [#162](https://github.com/Team-Zero-DSM/GreenER/issues/162) — Criar endpoints para a tela de gerenciamento de usuários | Pedro | ✅ | 5 |
| **T22** | [#163](https://github.com/Team-Zero-DSM/GreenER/issues/163) — Criar endpoints para a configuração do intervalo de coleta | Pedro | ✅ | 3 |
| **T23** | [#164](https://github.com/Team-Zero-DSM/GreenER/issues/164) — Integrar o intervalo configurado à rotina de coleta | Pedro | ✅ | 5 |
| **T24** | [#165](https://github.com/Team-Zero-DSM/GreenER/issues/165) — Criar endpoints para a configuração dos parâmetros de estimativa | Pedro | ✅ | 5 |
| **T25** | [#167](https://github.com/Team-Zero-DSM/GreenER/issues/167) — Criar endpoint para a tela de relatórios | Pedro | ✅ | 5 |
| **T26** | [#168](https://github.com/Team-Zero-DSM/GreenER/issues/168) — Criar endpoint para exportação de relatórios em PDF | Pedro | ✅ | 5 |
| **T27** | [#169](https://github.com/Team-Zero-DSM/GreenER/issues/169) — Realizar testes das funcionalidades do backend da Sprint 3 | Pedro | ✅ | 5 |
| **T28** | [#170](https://github.com/Team-Zero-DSM/GreenER/issues/170) — Atualizar documentação do backend e do banco de dados | Pedro | ✅ | 3 |
| **T29** | [#172](https://github.com/Team-Zero-DSM/GreenER/issues/172) — Desenvolvimento componentes da tela de administrador | Vitor | ✅ | 3 |
| **T30** | [#173](https://github.com/Team-Zero-DSM/GreenER/issues/173) — Reformulação do design padrão do site | Vitor | ✅ | 8 |
| **T31** | [#176](https://github.com/Team-Zero-DSM/GreenER/issues/176) — Refatoração da versão final do front-end | Vitor | ✅ | 5 |
| **T32** | [#183](https://github.com/Team-Zero-DSM/GreenER/issues/183) — Refinar o design das páginas de cadastro e perfil | Henrique | ✅ | 3 |
| **T33** | [#195](https://github.com/Team-Zero-DSM/GreenER/issues/195) — Implementar página de relatórios | Gabriel | ✅ | 5 |
| **T34** | [#196](https://github.com/Team-Zero-DSM/GreenER/issues/196) — Adicionar responsividade a landing page | Gabriel | ✅ | 3 |

### 📌 Progresso

As 34 tarefas possuem pontuação no Projects e na documentação, com o total
de 154 pontos em Done.

Os responsáveis vêm das atribuições das issues; quando ausentes, da autoria dos
PRs correspondentes, conforme o [registro de evidências](./evidencias-dod.md#sprint-backlog).

---

## 📈 Burndown da Sprint

O gráfico e os dados de burndown permanecem fora desta atualização documental.

---

## Evidências e rastreabilidade

| Entrega / requisitos | Tarefas | Implementação e evidências |
|---|---|---|
| Autenticação, perfil e recuperação — US15, RNF01/RNF05 | #136–#141, #156–#162, #183 | [Contas](../../backend/src/modules/accounts/), [autorização](../../backend/src/shared/middleware/auth.ts), [autenticação](../../frontend/src/pages/AuthPage.tsx) e [perfil](../../frontend/src/pages/ProfilePage.tsx). PRs #152, #174, #177, #178, #180, #181, #184–#186, #189, #194, #199, #200, #203 e #215. |
| Painel pessoal — US17, RF16/RF08/RF09/RF11 | #143–#150 | [Página](../../frontend/src/pages/PainelPage.tsx), [widgets e edição](../../frontend/src/components/painel/), [dados reais](../../frontend/src/hooks/usePainelData.ts) e [persistência](../../backend/src/modules/dashboards/). PRs #171, #188, #190–#193, #197 e #198. |
| Administração e coleta — US03/US15/US16 | #161–#164, #172 | [Tela administrativa](../../frontend/src/pages/AdminSettingsPage.tsx), [API](../../backend/src/modules/project/) e [agendador](../../backend/src/jobs/collections.job.ts). PRs #199, #203–#205 e #213. |
| Estimativas ambientais — US06/US15, RF07 | #165, #172 | [Cálculo compartilhado](../../backend/src/modules/collections/collections.estimate.ts) e [contrato](../API.md#27-parâmetros-de-estimativa). PR #206 e integração da tela no #213. |
| Relatórios — US10/US07 e vínculo de frontend com US14 | #167, #168, #195 | [API e PDF](../../backend/src/modules/reports/), [consulta consolidada](../../backend/src/modules/analytics/metrics-snapshot.repository.ts) e [página](../../frontend/src/pages/ReportsPage.tsx). PRs #207, #208 e #217. |
| Design, responsividade e refatoração — US08/US15, RNF01/RNF03 | #173, #176, #183, #196 | PRs #219, #220, #215 e #218. |
| Testes, banco e documentação — RNF04/RNF06/RNF08 | #156, #169, #170 | [Suíte](../../backend/tests/), [migrações](../../database/migrations/), [API](../API.md), [backend](../../backend/arquitetura.md) e [banco](../../database/arquitetura.md). PRs #174, #211 e #214. |

Os links individuais de todos os PRs estão no
[registro de evidências](./evidencias-dod.md#evidências-e-limites-de-conclusão).

## Participação da equipe

| Integrante | Contribuições rastreáveis |
|---|---|
| Henrique | Estrutura, componentes e integração das telas de autenticação e perfil (#136–#141), refinamento visual (#183) e cabeçalho (PR #216). |
| Paulo | Painel personalizável, widgets, edição, templates, persistência, dados reais e responsividade (#143–#150). Evoluções do painel e configuração de publicação nos PRs #209, #210 e #212. |
| Gabriel | Página de relatórios (#195) e adaptação da página inicial para mobile e tablet (#196). |
| Pedro | Contas, JWT, recuperação, primeiro administrador, gerenciamento de usuários, coleta, estimativas, relatórios, testes e documentação (#156–#165, #167–#170). |
| Vitor | Tela administrativa (#172), padronização visual (#173) e refatoração final (#176), entregue no PR #220. |

A participação acima é sustentada pelas issues e pelos PRs relacionados.

## Verificações e Definition of Done

| Critério | Resultado registrado |
|---|---|
| Implementação integrada | 34 tarefas concluídas com PRs integrados; #176 entregue no PR #220. |
| Testes do backend | 111 testes aprovados com PostgreSQL 17; [PR #211](https://github.com/Team-Zero-DSM/GreenER/pull/211) e [suíte do backend](../../backend/tests/). |
| Integração e construção | Execução conjunta em Docker e HTTP 200; três [testes de cache](../../frontend/tests/painelStorage.test.ts), lint, TypeScript e build do frontend aprovados. |
| Banco e migrações | Migrações 002/003 testadas; coletas e painéis preservados após reinício do PostgreSQL. Resultados nas [evidências da DoD](./evidencias-dod.md#validação-integrada). |
| Critérios e limites | Cobertura de autenticação, permissões, painel, administração e relatórios detalhada nas [evidências da DoD](./evidencias-dod.md#aplicação-da-definition-of-done). |
| Documentação | API, arquitetura do backend, banco e cálculo atualizados no PR #214; acompanhamento da sprint neste documento. |

Os resultados e as instruções de execução estão nas
[evidências da DoD](./evidencias-dod.md). As verificações usaram dados
sintéticos em ambiente isolado.

## 🔎 Sprint Review

As entregas integradas permitem cadastrar e autenticar usuários,
gerenciar o perfil, recuperar a senha, montar e salvar um painel pessoal,
administrar acessos, configurar a coleta e as estimativas e gerar relatórios em
PDF. A interface recebeu padronização visual e ajustes de responsividade.

As 34 tarefas do milestone estão concluídas, incluindo a refatoração final
(#176), integrada pelo PR #220.
