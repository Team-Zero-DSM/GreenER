# Sprint 3 — Evidências das entregas

**Período planejado:** 10/11/2026 a 23/11/2026.

**Data da consulta:** 22/11/2026.

**Fontes:** [milestone Sprint 3](https://github.com/Team-Zero-DSM/GreenER/milestone/3?closed=1),
[GitHub Projects — GreenER-ABP2](https://github.com/orgs/Team-Zero-DSM/projects/3/views/10),
issues, PRs e código disponível na branch desta documentação.

A [página da Sprint 3](./sprint-3.md) reúne o objetivo, o backlog e as contribuições
da equipe. Este registro distingue o estado das issues, a implementação integrada,
os resultados de testes já registrados e as pendências de aceite.

## Histórias selecionadas

| História | Issue | Requisitos internos | Situação consultada |
|---|---|---|---|
| US15 — Autenticação de usuários | [#151](https://github.com/Team-Zero-DSM/GreenER/issues/151) | RNF01, RNF05 | Fechada; implementação de cadastro, login, perfil, recuperação e permissões vinculada abaixo. |
| US17 — Painel de monitoramento personalizável | [#142](https://github.com/Team-Zero-DSM/GreenER/issues/142) | RF16, RF08, RF09, RF11, RNF01, RNF02, RNF03, RNF05 | Fechada; critérios marcados na issue e tarefas #143–#150 integradas. |

Essas são as duas histórias presentes no milestone. As tarefas também ampliam
US03, US06, US07, US08, US10, US14 e US16, conforme a
[rastreabilidade](./sprint-3.md#evidências-e-rastreabilidade). Os vínculos não
transferem para esta sprint o crédito das funcionalidades já entregues.

## Sprint Backlog

O [backlog da sprint](./sprint-3.md#-sprint-backlog--sprint-3) contém **35 tarefas**,
de T01 a T35, ordenadas pelo número da issue. **33 estão fechadas e duas abertas**.
US15 e US17 são histórias agregadoras e não entram nessa contagem de tarefas.
PRs complementares não foram contados como novas tarefas.

Responsáveis foram transcritos das issues. As tasks #157–#165 e #167–#170
não possuem assignee na consulta; a atribuição a Pedro é baseada na autoria
dos PRs correspondentes. A #156 possui atribuição explícita a Pedro.

As estimativas foram transcritas do campo `Estimate` do
[Projects](https://github.com/orgs/Team-Zero-DSM/projects/3/views/10), com o filtro
`milestone:"Sprint 3"`, em 22/11/2026. **33 tarefas têm estimativa preenchida,
somando 151 pontos**. A soma dos valores por tarefa coincide com os totais
exibidos no quadro:

| Status no Projects | Pontos preenchidos |
|---|---:|
| Done | 141 |
| In progress — #176 | 5 |
| Backlog — #175 | 5 |
| Ready / In review | 0 |
| **Total estimado preenchido** | **151** |

As tasks #195 e #196 estão em Done, mas o campo `Estimate` está vazio, confirmado
nos detalhes de cada cartão. Elas continuam no backlog de 35 tarefas, sem
valor atribuído na coluna de pontos. Campo vazio não foi tratado como zero.

O filtro mostra 39 cartões: 35 tarefas, duas histórias agregadoras (US15/US17)
e os PRs #217/#218. Histórias e PRs não foram contados como tarefas adicionais
nem duplicaram a pontuação. O burndown foi preservado.

## Evidências e limites de conclusão

Os PRs abaixo constam como integrados no GitHub e suas alterações estão presentes
no histórico do checkout. Uma issue fechada pode manter itens de checklist
desmarcados; seu fechamento não substitui a conferência da DoD.

| Tarefa / issue | Estado em 22/11 | PR de implementação |
|---|---|---|
| [#136](https://github.com/Team-Zero-DSM/GreenER/issues/136) | Fechada | [PR #152](https://github.com/Team-Zero-DSM/GreenER/pull/152) |
| [#137](https://github.com/Team-Zero-DSM/GreenER/issues/137) | Fechada | [PR #178](https://github.com/Team-Zero-DSM/GreenER/pull/178) |
| [#138](https://github.com/Team-Zero-DSM/GreenER/issues/138) | Fechada | [PR #200](https://github.com/Team-Zero-DSM/GreenER/pull/200) |
| [#139](https://github.com/Team-Zero-DSM/GreenER/issues/139) | Fechada | [PR #180](https://github.com/Team-Zero-DSM/GreenER/pull/180) |
| [#140](https://github.com/Team-Zero-DSM/GreenER/issues/140) | Fechada | [PR #184](https://github.com/Team-Zero-DSM/GreenER/pull/184) |
| [#141](https://github.com/Team-Zero-DSM/GreenER/issues/141) | Fechada | [PR #189](https://github.com/Team-Zero-DSM/GreenER/pull/189) |
| [#143](https://github.com/Team-Zero-DSM/GreenER/issues/143) | Fechada | [PR #171](https://github.com/Team-Zero-DSM/GreenER/pull/171) |
| [#144](https://github.com/Team-Zero-DSM/GreenER/issues/144) | Fechada | [PR #188](https://github.com/Team-Zero-DSM/GreenER/pull/188) |
| [#145](https://github.com/Team-Zero-DSM/GreenER/issues/145) | Fechada | [PR #190](https://github.com/Team-Zero-DSM/GreenER/pull/190) |
| [#146](https://github.com/Team-Zero-DSM/GreenER/issues/146) | Fechada | [PR #192](https://github.com/Team-Zero-DSM/GreenER/pull/192) |
| [#147](https://github.com/Team-Zero-DSM/GreenER/issues/147) | Fechada | [PR #193](https://github.com/Team-Zero-DSM/GreenER/pull/193) |
| [#148](https://github.com/Team-Zero-DSM/GreenER/issues/148) | Fechada | [PR #198](https://github.com/Team-Zero-DSM/GreenER/pull/198) |
| [#149](https://github.com/Team-Zero-DSM/GreenER/issues/149) | Fechada | [PR #191](https://github.com/Team-Zero-DSM/GreenER/pull/191) |
| [#150](https://github.com/Team-Zero-DSM/GreenER/issues/150) | Fechada | [PR #197](https://github.com/Team-Zero-DSM/GreenER/pull/197) |
| [#156](https://github.com/Team-Zero-DSM/GreenER/issues/156) | Fechada | [PR #174](https://github.com/Team-Zero-DSM/GreenER/pull/174) |
| [#157](https://github.com/Team-Zero-DSM/GreenER/issues/157) | Fechada | [PR #177](https://github.com/Team-Zero-DSM/GreenER/pull/177) |
| [#158](https://github.com/Team-Zero-DSM/GreenER/issues/158) | Fechada | [PR #181](https://github.com/Team-Zero-DSM/GreenER/pull/181) |
| [#159](https://github.com/Team-Zero-DSM/GreenER/issues/159) | Fechada | [PR #186](https://github.com/Team-Zero-DSM/GreenER/pull/186) |
| [#160](https://github.com/Team-Zero-DSM/GreenER/issues/160) | Fechada | [PR #185](https://github.com/Team-Zero-DSM/GreenER/pull/185) |
| [#161](https://github.com/Team-Zero-DSM/GreenER/issues/161) | Fechada | [PR #199](https://github.com/Team-Zero-DSM/GreenER/pull/199) |
| [#162](https://github.com/Team-Zero-DSM/GreenER/issues/162) | Fechada | [PR #203](https://github.com/Team-Zero-DSM/GreenER/pull/203) |
| [#163](https://github.com/Team-Zero-DSM/GreenER/issues/163) | Fechada | [PR #204](https://github.com/Team-Zero-DSM/GreenER/pull/204) |
| [#164](https://github.com/Team-Zero-DSM/GreenER/issues/164) | Fechada | [PR #205](https://github.com/Team-Zero-DSM/GreenER/pull/205) |
| [#165](https://github.com/Team-Zero-DSM/GreenER/issues/165) | Fechada | [PR #206](https://github.com/Team-Zero-DSM/GreenER/pull/206) |
| [#167](https://github.com/Team-Zero-DSM/GreenER/issues/167) | Fechada | [PR #207](https://github.com/Team-Zero-DSM/GreenER/pull/207) |
| [#168](https://github.com/Team-Zero-DSM/GreenER/issues/168) | Fechada | [PR #208](https://github.com/Team-Zero-DSM/GreenER/pull/208) |
| [#169](https://github.com/Team-Zero-DSM/GreenER/issues/169) | Fechada | [PR #211](https://github.com/Team-Zero-DSM/GreenER/pull/211) |
| [#170](https://github.com/Team-Zero-DSM/GreenER/issues/170) | Fechada | [PR #214](https://github.com/Team-Zero-DSM/GreenER/pull/214) |
| [#172](https://github.com/Team-Zero-DSM/GreenER/issues/172) | Fechada | [PR #213](https://github.com/Team-Zero-DSM/GreenER/pull/213) |
| [#173](https://github.com/Team-Zero-DSM/GreenER/issues/173) | Fechada | [PR #219](https://github.com/Team-Zero-DSM/GreenER/pull/219) |
| [#175](https://github.com/Team-Zero-DSM/GreenER/issues/175) | Aberta | Sem PR de conclusão identificado |
| [#176](https://github.com/Team-Zero-DSM/GreenER/issues/176) | Aberta | Sem PR de conclusão identificado |
| [#183](https://github.com/Team-Zero-DSM/GreenER/issues/183) | Fechada | [PR #215](https://github.com/Team-Zero-DSM/GreenER/pull/215) |
| [#195](https://github.com/Team-Zero-DSM/GreenER/issues/195) | Fechada | [PR #217](https://github.com/Team-Zero-DSM/GreenER/pull/217) |
| [#196](https://github.com/Team-Zero-DSM/GreenER/issues/196) | Fechada | [PR #218](https://github.com/Team-Zero-DSM/GreenER/pull/218) |

### Evoluções complementares

| PR | Evidência |
|---|---|
| [#194](https://github.com/Team-Zero-DSM/GreenER/pull/194) | Separa atualização do perfil e troca de senha autenticada; complementa #159. |
| [#209](https://github.com/Team-Zero-DSM/GreenER/pull/209) | Configurações de publicação e correções relatadas na homologação. A disponibilidade atual dos serviços publicados não foi verificada nesta atualização. |
| [#210](https://github.com/Team-Zero-DSM/GreenER/pull/210), [#212](https://github.com/Team-Zero-DSM/GreenER/pull/212) | Evoluções de arraste, redimensionamento, desfazer/refazer, tela cheia e seleção de templates do painel. |
| [#216](https://github.com/Team-Zero-DSM/GreenER/pull/216) | Cabeçalho e navegação adaptados a desktop e dispositivos móveis. |

## Aplicação da Definition of Done

A referência é a [DoD geral do projeto](../../README.md#-definition-of-done--geral).
A matriz relaciona critérios e artefatos; a atualização da documentação não
representa homologação visual nem aceite formal das histórias.

| Entrega / critérios | Evidência de implementação e validação | Limites |
|---|---|---|
| US15: cadastro e login autenticados pelo backend, JWT e feedback | [Rotas de contas](../../backend/src/modules/accounts/accounts.routes.ts), [serviço](../../backend/src/modules/accounts/accounts.service.ts), [tela de autenticação](../../frontend/src/pages/AuthPage.tsx) e [testes HTTP](../../backend/tests/integration/modules/accounts/accounts.routes.test.ts). Cobrem cadastro, e-mail duplicado, credenciais válidas e inválidas. | A suíte automatizada cobre a API; não substitui o percurso completo da interface em todos os dispositivos. |
| US15: recursos protegidos e autorização no backend | [Middleware](../../backend/src/shared/middleware/auth.ts), [rotas administrativas](../../backend/src/modules/project/project.routes.ts) e testes de contas/administração. Cobrem ausência de token, JWT inválido ou expirado, sessão revogada e bloqueio de visualizador. | A interface exige sessão nas rotas internas, mas APIs públicas de monitoramento continuam sem JWT conforme o [contrato](../API.md#21-operações-implementadas). |
| US15: consulta/edição de perfil e troca de senha | [Perfil](../../frontend/src/pages/ProfilePage.tsx), [hook](../../frontend/src/hooks/useProfile.ts) e testes de contas. Conferem atualização de nome/e-mail, invalidação do token anterior e confirmação da senha atual na troca de senha. | PATCH do perfil e PATCH da senha são operações separadas; a documentação da Sprint 3 usa o contrato posterior ao PR #194. |
| US15: recuperação e redefinição de senha | [Recuperação](../../backend/src/modules/accounts/reset-mail.ts), [rotas](../../backend/src/modules/accounts/accounts.routes.ts) e testes HTTP. Conferem resposta sem revelar a existência da conta, token expirado e uso único. | O envio de e-mail é simulado na suíte. Entrega real por SMTP/Brevo não foi verificada aqui. |
| US15: primeiro administrador e gerenciamento de acessos | [Comando](../../backend/src/scripts/create-admin.ts), [testes do primeiro admin](../../backend/tests/integration/modules/accounts/first-admin.repository.test.ts) e [testes administrativos](../../backend/tests/integration/modules/project/project.routes.test.ts). Conferem papéis, último administrador ativo, desativação e revogação. | A execução do comando altera contas; não foi realizada nesta atualização documental. |
| US15: responsividade e consistência de autenticação/perfil | [AuthPage](../../frontend/src/pages/AuthPage.tsx), [ProfilePage](../../frontend/src/pages/ProfilePage.tsx), PRs #184/#200/#215. | Implementação e relato dos PRs disponíveis; sem nova inspeção visual nesta atualização. |
| US17: rota autenticada e ocupação da tela | [Rotas](../../frontend/src/App.tsx), [página](../../frontend/src/pages/PainelPage.tsx) e [estrutura do painel](../../frontend/src/components/painel/PainelShell.tsx). PRs #171/#197/#212. | Ocupação da tela e ausência de rolagem são entregas descritas nos PRs; homologação de resoluções adicionais pendente de registro. |
| US17: templates e inclusão/remoção de widgets | [Templates](../../frontend/src/components/painel/painelTemplates.ts), [catálogo](../../frontend/src/components/painel/PainelWidgetCatalog.tsx) e PRs #188/#190/#192. | Sem teste automatizado de interação do frontend registrado nesta suíte. |
| US17: arrastar, reposicionar, redimensionar e configurar widgets | [Grade](../../frontend/src/components/painel/PainelGrid.tsx), [configurações](../../frontend/src/components/painel/PainelWidgetSettings.tsx) e PRs #190/#193/#210. | Evidência de código e PRs; conferir interações por toque na homologação visual. |
| US17: configuração mantida entre acessos | [Hook](../../frontend/src/hooks/usePainelConfig.ts), [API do painel](../../backend/src/modules/dashboards/), [testes de persistência](../../backend/tests/integration/modules/dashboards/dashboards.repository.test.ts) e [autorização](../../backend/tests/unit/modules/dashboards/dashboards.auth.test.ts). | Banco e autenticação testados; o fluxo visual de sair e entrar não foi repetido nesta atualização. |
| US17: dados reais e atualização automática | [Dados do painel](../../frontend/src/hooks/usePainelData.ts), [consulta](../../frontend/src/hooks/useApiQuery.ts), [monitoramento](../../frontend/src/contexts/MonitoringProvider.tsx) e [conferência API × SQL](../../backend/tests/integration/modules/reports/reports.routes.test.ts). | A conferência automatizada usa dados sintéticos; não comprova disponibilidade contínua das APIs externas. |
| US17: desktop, tablet e mobile | [Layouts responsivos](../../frontend/src/components/painel/painelLayoutResponsivo.ts), [breakpoints](../../frontend/src/hooks/usePainelBreakpoint.ts), PR #197 e critérios da #142. | Sem nova bateria visual em navegadores e dispositivos. |
| Administração: intervalo e continuidade | [Módulo project](../../backend/src/modules/project/), [job](../../backend/src/jobs/collections.job.ts), [testes do intervalo](../../backend/tests/unit/jobs/collection-interval.test.ts) e [job](../../backend/tests/unit/jobs/collections.job.test.ts). Cobrem valor salvo, fallback e retenção do último intervalo se a consulta falhar. | Não representa teste prolongado sob carga ou falha real de infraestrutura. |
| Estimativas: prévia e ativação sem alterar coletas antigas | [Cálculo](../../backend/src/modules/collections/collections.estimate.ts), [administração](../../backend/src/modules/project/) e testes de project. Cobrem prévia, ativação e recusa de coeficiente negativo. | O modelo estima consumo e emissões; os coeficientes não são calibração física do hardware. |
| Relatórios: filtros, dados históricos, ausência de amostras e PDF | [Tela](../../frontend/src/pages/ReportsPage.tsx), [API](../../backend/src/modules/reports/) e [testes](../../backend/tests/integration/modules/reports/reports.routes.test.ts). Conferem dados com SQL, métricas nulas sem amostras, filtros inválidos, autenticação e assinatura/cabeçalhos do PDF. | Os testes de PDF verificam estrutura e resposta HTTP; não houve nova conferência visual do documento nem do fluxo completo da tela. |
| US16: falha isolada sem interromper os demais serviços | [Teste de continuidade](../../backend/tests/unit/modules/collections/collections.service.test.ts) e tratamento do intervalo nos testes da #169. | Cobertura de falhas simuladas; não equivale a validação exaustiva de todas as falhas externas. |
| Banco: migração e preservação de dados | [Teste de migrações](../../backend/tests/integration/database/migrations.test.ts), [migração 002](../../database/migrations/002_contas_e_dashboards.sql) e [003](../../database/migrations/003_painel_usuario.sql). | Banco descartável; aplicação e repetição preservam usuários/coletas. Não foi migrado o banco de uso da equipe. |
| Documentação e integração | [PR #214](https://github.com/Team-Zero-DSM/GreenER/pull/214), [API](../API.md), [backend](../../backend/arquitetura.md), [banco](../../database/arquitetura.md), [cálculo](../cálculo.md) e [CI](https://github.com/Team-Zero-DSM/GreenER/actions/runs/44851909389). | O README não foi alterado nesta atualização. Cerimônias e aceite do cliente continuam dependentes de registro. |

### Resultados registrados na validação da #169

O [PR #211](https://github.com/Team-Zero-DSM/GreenER/pull/211) registra **111 testes
aprovados com PostgreSQL 17**, sendo 63 existentes e 48 adicionados na task.
A execução de [CI 44851909389](https://github.com/Team-Zero-DSM/GreenER/actions/runs/44851909389)
foi consultada e está aprovada para a revisão
`ab0747068a2d162efe22ca25faaef0a997407966`.

| Verificação | Resultado registrado |
|---|---|
| Backend | Instalação, lint, formatação, TypeScript, build e testes aprovados. |
| Frontend | Instalação, lint, TypeScript e build aprovados. |
| Docker | Validação do Compose e construção das imagens aprovadas. |
| Integração | Bancos descartáveis com schema real; chamadas HTTP à aplicação e comparações com PostgreSQL. |
| Migrações | Aplicação e repetição das migrações 002/003 preservando usuários e coletas existentes no banco de teste. |

O passo de testes do frontend usa `--if-present`; o
[package.json do frontend](../../frontend/package.json) não define uma suíte de
testes. O CI aprovado, portanto, não comprova testes automatizados da interface.
As imagens construídas também não comprovam execução prolongada em produção.

Os resultados acima são históricos, vinculados à revisão indicada. Não foram
executados novamente no HEAD para esta alteração de documentação.

## Dependências e pendências para o encerramento

| Item | Situação |
|---|---|
| Tema claro — [#175](https://github.com/Team-Zero-DSM/GreenER/issues/175) | Issue aberta; sem conclusão registrada. |
| Refatoração final do frontend — [#176](https://github.com/Team-Zero-DSM/GreenER/issues/176) | Issue aberta; sem conclusão registrada. |
| Pontuação | 151 pontos preenchidos no Projects: 141 em Done, 5 em In progress (#176) e 5 em Backlog (#175). #195/#196 sem estimativa preenchida. |
| Cenários regionais avançados | A comparação regional já era prevista na Sprint 2. Não foi identificada tarefa específica de uma nova simulação avançada no milestone consultado. |
| Review e aceite do cliente | Sem registro localizado para esta consolidação. |
| Retrospectiva | Aguardando registro da equipe. |
| Demonstração | Link da Sprint 3 ainda não registrado. |

As dependências de implementação entregues seguem os fluxos banco de contas →
JWT → login/perfil/recuperação; autenticação → persistência do painel e
administração; intervalo persistido → agendador; prévia de relatório → PDF.
A tela administrativa integra as configurações e os acessos; a página de
relatórios consome os endpoints de prévia e exportação.

## Acompanhamento

O burndown e as [dailies](./dailies.md) foram preservados. O arquivo de dailies
desta pasta ainda identifica suas datas como Sprint 2; não sustenta contagem
de presença da Sprint 3. A [página da sprint](./sprint-3.md) registra as
contribuições verificáveis por issues e PRs.
