# Sprint 3 — Evidências das entregas

**Período planejado:** 10/11/2026 a 23/11/2026.
**Fontes:** [GitHub Projects — GreenER-ABP2](https://github.com/orgs/Team-Zero-DSM/projects/3)
e [milestone Sprint 3, incluindo fechadas](https://github.com/Team-Zero-DSM/GreenER/milestone/3?closed=1).

O backlog registra 34 tarefas concluídas, somando **154 pontos**.
As entregas abrangem autenticação, perfil, painel personalizável, administração
e relatórios.

## Histórias selecionadas

| História | Issue | Requisitos internos | Situação |
|---|---|---|---|
| US06 — Cálculo do impacto individual | [#153](https://github.com/Team-Zero-DSM/GreenER/issues/153) | RF07 | Fechada; configuração dos coeficientes ampliada pela #165. |
| US10 — Consulta do histórico de coletas | [#154](https://github.com/Team-Zero-DSM/GreenER/issues/154) | RF10, RNF06 | Fechada; prévia e exportação de relatórios entregues em #167/#168. |
| US15 — Autenticação de usuários | [#151](https://github.com/Team-Zero-DSM/GreenER/issues/151) | RNF01, RNF05 | Fechada; implementação de cadastro, login, perfil, recuperação e permissões vinculada abaixo. |
| US16 — Continuidade do monitoramento diante de falhas | [#155](https://github.com/Team-Zero-DSM/GreenER/issues/155) | RNF04 | Fechada; testes de continuidade e preservação do intervalo registrados na #169. |
| US17 — Painel de monitoramento personalizável | [#142](https://github.com/Team-Zero-DSM/GreenER/issues/142) | RF16, RF08, RF09, RF11, RNF01, RNF02, RNF03, RNF05 | Fechada; critérios marcados na issue e tarefas #143–#150 integradas. |

As cinco histórias estão fechadas no milestone. As tarefas também ampliam
US03, US07, US08 e US14, conforme a
[rastreabilidade da sprint](./sprint-3.md#evidências-e-rastreabilidade).

## Sprint Backlog

O backlog da Sprint 3 reúne 34 tarefas, de T01 a T34.
As estimativas somam **154 pontos**, registrados no campo `Estimate`
da coluna **Done** do Projects com o filtro da Sprint 3.
As histórias e os PRs de apoio não entram nessa contagem de tarefas.

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

Os responsáveis seguem as atribuições das issues e a autoria dos PRs.
As tarefas #195 e #196 têm, respectivamente, 5 e 3 pontos no Projects.

## Evidências e limites de conclusão

| Entrega | Issues | PRs vinculados |
|---|---|---|
| Páginas de cadastro, login e perfil | #136, #137, #138, #139, #140, #141, #183 | [#152](https://github.com/Team-Zero-DSM/GreenER/pull/152), [#178](https://github.com/Team-Zero-DSM/GreenER/pull/178), [#200](https://github.com/Team-Zero-DSM/GreenER/pull/200), [#180](https://github.com/Team-Zero-DSM/GreenER/pull/180), [#184](https://github.com/Team-Zero-DSM/GreenER/pull/184), [#189](https://github.com/Team-Zero-DSM/GreenER/pull/189), [#215](https://github.com/Team-Zero-DSM/GreenER/pull/215) |
| Banco de contas, autenticação, perfil e recuperação de senha | #156, #157, #158, #159, #160 | [#174](https://github.com/Team-Zero-DSM/GreenER/pull/174), [#177](https://github.com/Team-Zero-DSM/GreenER/pull/177), [#181](https://github.com/Team-Zero-DSM/GreenER/pull/181), [#186](https://github.com/Team-Zero-DSM/GreenER/pull/186), [#185](https://github.com/Team-Zero-DSM/GreenER/pull/185) |
| Primeiro administrador e gerenciamento de usuários | #161, #162 | [#199](https://github.com/Team-Zero-DSM/GreenER/pull/199), [#203](https://github.com/Team-Zero-DSM/GreenER/pull/203) |
| Painel: estrutura, widgets, templates, edição, persistência e responsividade | #143, #144, #145, #146, #147, #148, #149, #150 | [#171](https://github.com/Team-Zero-DSM/GreenER/pull/171), [#188](https://github.com/Team-Zero-DSM/GreenER/pull/188), [#190](https://github.com/Team-Zero-DSM/GreenER/pull/190), [#192](https://github.com/Team-Zero-DSM/GreenER/pull/192), [#193](https://github.com/Team-Zero-DSM/GreenER/pull/193), [#198](https://github.com/Team-Zero-DSM/GreenER/pull/198), [#191](https://github.com/Team-Zero-DSM/GreenER/pull/191), [#197](https://github.com/Team-Zero-DSM/GreenER/pull/197) |
| Intervalo de coleta e integração com o agendador | #163, #164 | [#204](https://github.com/Team-Zero-DSM/GreenER/pull/204), [#205](https://github.com/Team-Zero-DSM/GreenER/pull/205) |
| Configuração dos parâmetros de estimativa | #165 | [#206](https://github.com/Team-Zero-DSM/GreenER/pull/206) |
| Relatórios: página, prévia e exportação em PDF | #167, #168, #195 | [#207](https://github.com/Team-Zero-DSM/GreenER/pull/207), [#208](https://github.com/Team-Zero-DSM/GreenER/pull/208), [#217](https://github.com/Team-Zero-DSM/GreenER/pull/217) |
| Tela administrativa | #172 | [#213](https://github.com/Team-Zero-DSM/GreenER/pull/213) |
| Padronização visual, responsividade e refatoração do frontend | #173, #176, #196 | [#219](https://github.com/Team-Zero-DSM/GreenER/pull/219), [#220](https://github.com/Team-Zero-DSM/GreenER/pull/220), [#218](https://github.com/Team-Zero-DSM/GreenER/pull/218) |
| Testes do backend | #169 | [#211](https://github.com/Team-Zero-DSM/GreenER/pull/211) |
| Documentação do backend e banco | #170 | [#214](https://github.com/Team-Zero-DSM/GreenER/pull/214) |

Os PRs vinculados documentam a implementação das tarefas. O
[PR #194](https://github.com/Team-Zero-DSM/GreenER/pull/194) complementa a edição
de perfil e a troca de senha. As melhorias de publicação, edição do painel e
navegação estão nos PRs [#209](https://github.com/Team-Zero-DSM/GreenER/pull/209),
[#210](https://github.com/Team-Zero-DSM/GreenER/pull/210),
[#212](https://github.com/Team-Zero-DSM/GreenER/pull/212) e
[#216](https://github.com/Team-Zero-DSM/GreenER/pull/216).

## Aplicação da Definition of Done

A [DoD geral](../../README.md#-definition-of-done--geral) orienta a conferência
das funcionalidades, testes e documentação.

| Entrega | Critérios verificados | Evidências |
|---|---|---|
| Autenticação e perfil — US15 | Cadastro, login, edição do perfil, troca e recuperação de senha, sessão JWT e permissões por papel. | [Módulo de contas](../../backend/src/modules/accounts/), [testes HTTP](../../backend/tests/integration/modules/accounts/accounts.routes.test.ts), [autenticação](../../frontend/src/pages/AuthPage.tsx) e [perfil](../../frontend/src/pages/ProfilePage.tsx). |
| Painel personalizável — US17 | Templates, widgets, edição do layout, configuração por usuário e adaptação para desktop, tablet e mobile. | [Componentes do painel](../../frontend/src/components/painel/), [API de persistência](../../backend/src/modules/dashboards/), [testes de persistência](../../backend/tests/integration/modules/dashboards/dashboards.repository.test.ts) e [testes de isolamento do cache](../../frontend/tests/painelStorage.test.ts). |
| Administração — US03, US06 e US15 | Gerenciamento de acessos, gravação e aplicação do intervalo, simulação e ativação dos coeficientes. | [Módulo project](../../backend/src/modules/project/), [agendador](../../backend/src/jobs/collections.job.ts) e [tela administrativa](../../frontend/src/pages/AdminSettingsPage.tsx). |
| Continuidade da coleta — US16 | Falha de um serviço sem interromper os demais e preservação do último intervalo quando a consulta falha. | [Teste de continuidade](../../backend/tests/unit/modules/collections/collections.service.test.ts) e [testes do intervalo](../../backend/tests/unit/jobs/collection-interval.test.ts). |
| Histórico e relatórios — US10 | Consulta por serviço e período, filtros, prévia, CSV e impressão na tela; prévia e geração de PDF também disponíveis pela API. | [Tarefa da interface #195](https://github.com/Team-Zero-DSM/GreenER/issues/195), [módulo reports](../../backend/src/modules/reports/), [testes HTTP](../../backend/tests/integration/modules/reports/reports.routes.test.ts) e [página de relatórios](../../frontend/src/pages/ReportsPage.tsx). |
| Banco e documentação | Migrações, preservação dos registros e atualização dos contratos e da arquitetura. | [Migrações](../../database/migrations/), [testes](../../backend/tests/integration/database/migrations.test.ts), [API](../API.md), [arquitetura do frontend](../../frontend/arquitetura.md), [backend](../../backend/arquitetura.md) e [banco](../../database/arquitetura.md). |

### Resultados registrados na validação da #169

A validação da #169 está no [PR #211](https://github.com/Team-Zero-DSM/GreenER/pull/211).
Foram aprovados **111 testes com PostgreSQL 17**, incluindo 48 casos adicionados
na tarefa. O [CI](https://github.com/Team-Zero-DSM/GreenER/actions/runs/44851909389)
aprovou instalação, lint, formatação, TypeScript, build e testes do backend,
além das verificações do frontend e da construção das imagens Docker.

### Validação integrada

A aplicação também foi executada em um projeto Compose isolado, com PostgreSQL
17, duas regiões e dois serviços de teste.

| Verificação | Resultado |
|---|---|
| Execução em Docker | Frontend, backend e PostgreSQL iniciaram juntos. Frontend e `/health` responderam HTTP 200. |
| Suíte do backend | 111 testes aprovados em 22 arquivos da [suíte do backend](../../backend/tests/). |
| Frontend | Três [testes de cache](../../frontend/tests/painelStorage.test.ts), lint, TypeScript, build e formatação dos arquivos alterados aprovados. |
| Autenticação e perfil | Cadastro, login, erro de credenciais, edição do nome e restrição de acesso administrativo conferidos pela interface. |
| Painel | Alteração de posição, título e paleta mantida ao recarregar e entrar novamente; configurações separadas entre contas. Layouts conferidos em desktop, tablet e mobile. |
| Administração | Intervalo de 12 segundos salvo e conjunto de parâmetros 2 ativado após simulação. |
| Relatórios | Seleção dos serviços, prévia, gráfico de barras e CSV conferidos na interface. PDF da API gerado e inspecionado. |
| Persistência após reinício | As 80 coletas, os dois painéis, as contas e as configurações permaneceram no banco. As consultas antes e depois retornaram os mesmos hashes. |

As verificações usaram dados sintéticos e APIs auxiliares locais. O envio de
e-mail é simulado nos testes. Na página de relatórios, Exportar PDF usa a impressão
do navegador; a geração de PDF pela API foi conferida separadamente. O fluxo
da interface e seus critérios estão descritos na
[tarefa #195](https://github.com/Team-Zero-DSM/GreenER/issues/195) e na
[arquitetura do frontend](../../frontend/arquitetura.md#66-relatórios).

### Execução e testes

As instruções para iniciar frontend, backend e PostgreSQL estão no
[README](../../README.md#como-executar), com os arquivos de ambiente e o
[Compose do projeto](../../docker-compose.yml).

Os testes de integração do backend seguem o
[guia de testes](../../README.md#testes-do-backend). No diretório `frontend/`,
com Node.js 24 e as dependências instaladas, execute:

```powershell
npm test
npm run lint
npm run build
```

A [documentação do banco](../../database/arquitetura.md#consultar-a-estrutura-e-as-coletas-existentes)
descreve as consultas para conferir os registros antes e depois de reiniciar
o PostgreSQL. O volume `postgres_data` do Compose mantém os dados entre as
execuções.

## Entregas integradas

As entregas seguem os fluxos de contas e autenticação (#156–#162), persistência
do painel (#148), configuração da coleta (#163 → #164), parâmetros (#165)
e relatórios (#167 → #168). A refatoração final do frontend foi integrada
pelo [PR #220](https://github.com/Team-Zero-DSM/GreenER/pull/220).

## Acompanhamento

A [página da Sprint 3](./sprint-3.md) reúne o objetivo, o backlog e a participação
da equipe. As atividades estão relacionadas às issues e aos PRs desta entrega.
