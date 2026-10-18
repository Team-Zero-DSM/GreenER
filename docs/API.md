# APIs e Contratos — GreenER

Este documento define as fronteiras de comunicação do GreenER. Na arquitetura-alvo, o frontend
consome exclusivamente a API interna do backend; o backend integra as APIs
externas e disponibiliza ao frontend os dados validados e processados.
Responsabilidades e camadas do backend estão em
[`../backend/arquitetura.md`](../backend/arquitetura.md).

## 1. Fluxo de comunicação

```text
Frontend GreenER
    ↓ HTTP
API REST do backend GreenER
    ├── PostgreSQL
    ├── Greener Metrics Aggregator API
    └── Greener Carbon Intensity API
```

O frontend não chama diretamente os serviços externos. Os contratos externos
ficam isolados nas integrações do backend, que validam as respostas antes de
fornecê-las ao restante da aplicação.

## 2. API REST do GreenER

A implementação atual oferece detalhe de serviço, histórico de coletas,
estado do monitoramento e os cards de região. As demais operações abaixo são
planejadas e não devem ser apresentadas como implementadas. O dashboard e o
detalhe de serviço da interface consomem a lista, o detalhe e o histórico de
serviços, sem dados simulados. Essas telas buscam a API ao abrir, ao trocar
filtro, serviço ou período e depois de cada rodada de coleta do backend
(quando `lastRoundFinishedAt` muda), sem recarregar a página; a barra mostra
a data e a hora da última atualização da tela. A barra de
monitoramento consulta `/monitoring/status` 1 segundo depois de cada
`nextCollectionAt` (nunca em intervalo menor que 1 segundo).

### 2.1. Operações implementadas

Base local: `http://localhost:3000`. As rotas de negócio usam o prefixo
`/api/v1`; o recurso atual é `/service`, no singular. Não há aliases em
`/services` nesta versão.

| Método | Caminho real | Responsabilidade | Autenticação |
|---|---|---|---|
| `GET` | `/health` | Informar que o processo HTTP está disponível. | Não exige. |
| `GET` | `/api/v1/service/:externalId` | Entregar identificação, estado, localização e última coleta válida. | Não exige. |
| `GET` | `/api/v1/service/:externalId/collections` | Entregar pontos agrupados e totais do período. | Não exige. |
| `GET` | `/api/v1/regions` | Entregar as regiões, dados ambientais, contadores atuais e totais do período. | Não exige. |
| `GET` | `/api/v1/monitoring/status` | Informar horários, contadores e resultados observados pelo job. | Não exige. |

`externalId` é o identificador da API externa salvo em `servico.external_id`,
por exemplo `billing-api`; não é o BIGINT interno. O parâmetro aceita de 1 a
100 caracteres, usando letras, números, ponto, sublinhado e hífen.

#### Detalhe e última coleta

```http
GET /api/v1/service/billing-api
```

Não recebe corpo nem filtros de período. Resposta 200:

- `service`: `id`, `name`, `active`, `status`, `lastSeenAt` e `location`.
- `location`: código, país, região, cidade, coordenadas e fator de carbono
  atual. Cidade e coordenadas podem ser `null`; a localização também pode
  ser `null`.
- `latestCollection`: horário, intervalo da amostra, métricas e estimativas
  da última coleta válida. Sem coleta, retorna `null`, sem inventar zeros.
- CPU é percentual; recursos usam GB; potência usa W; energia usa kWh; CO₂e
  usa gramas; intensidade usa gCO₂e/kWh.
- `lastSeenAt` é a última aparição na descoberta. `collectedAt` é o horário
  da coleta válida. Falha recente não transforma dados antigos em recentes.

Serviço conhecido, inclusive inativo, retorna 200. Serviço desconhecido
retorna 404; identificador inválido retorna 400; falha interna retorna 500.

#### Histórico e totais

```http
GET /api/v1/service/billing-api/collections?range=6h&maxPoints=120
```

| Query | Regra |
|---|---|
| `range` | Opcional: `1h`, `6h`, `24h`, `7d` ou `30d`; padrão `24h`. |
| `maxPoints` | Opcional: inteiro de 1 a 300; padrão 120. |
| `to` | Opcional: data ISO 8601 com fuso. |

O endpoint atual não recebe `from`: o service o calcula a partir de `range`.
Sem `to`, a referência é a última coleta válida; a implementação acrescenta
1 milissegundo para incluir a fração de microssegundos do PostgreSQL, pois
`Date` tem precisão de milissegundos. Sem qualquer coleta, usa agora como
referência e devolve uma consulta vazia. Com `to` explícito, respeita a data
recebida.

O filtro SQL usa início exclusivo e fim inclusivo: `coletado_em > from` e
`coletado_em <= to`. Os pontos são agrupados por `DATE_BIN`; `timestamp`
representa o início da faixa, não o horário exato de uma medição individual.

Resposta 200:

- `generatedAt`, `serviceId`, `range`, `period.from` e `period.to` em UTC.
- `maxPoints` e `bucketSeconds`, calculado conforme período e resolução.
- `summary`: `sampleCount`, `energyKwh` e `co2eGrams` do período completo.
- `points`: lista ordenada com `timestamp`, `sampleCount`, médias de CPU,
  memória e potência, CO₂e médio por coleta e somas de energia e CO₂e por faixa.
- Sem dados: `points: []`, `sampleCount: 0` e somas `null`.

A quantidade de pontos pode ser menor que `maxPoints`; faixas vazias não
recebem zeros artificiais. Os totais somam as amostras armazenadas, sem
garantir cobertura contínua de todo o período. Quando a referência for uma
coleta antiga, a tela deve informar o período real e a desatualização.

Período sem dados retorna 200. Parâmetros inválidos retornam 400; serviço
desconhecido retorna 404; falha interna retorna 500. Exemplo de erro:

```json
{
  "error": {
    "message": "Serviço nao-existe não foi encontrado"
  }
}
```

O estado do monitoramento está detalhado na seção 7.

#### Regiões — cards e globo

```http
GET /api/v1/regions?from=2026-10-11T19:00:00Z&to=2026-10-12T19:00:00Z
```

Consulta pública, sem corpo. `from` e `to` são opcionais, mas formam um par:
devem ser enviados juntos, com `from` anterior a `to`. Sem o par, a resposta
traz `period: null` e `periodSummary: null`, e os cards entregam apenas o
estado atual.

| Query | Regra |
|---|---|
| `from` | Opcional (junto com `to`): data ISO 8601 com fuso; início exclusivo do período. |
| `to` | Opcional (junto com `from`): data ISO 8601 com fuso; fim inclusivo do período. |

Resposta 200:

- `generatedAt` em UTC; `period` identifica a janela quando o par é enviado.
- `regions[]` lista todas as regiões cadastradas, mesmo sem serviços.
- `serviceCounts` representa o estado **atual** dos serviços da região:
  `totalServices`; `listedServices` e `unlistedServices` por `ativo`;
  `availableServices`, `metricsMissingServices` e `unavailableServices`
  por `status`.
- `periodSummary` existe apenas com o par `from`/`to` e soma as coletas
  armazenadas no período (`basis: "sum_of_stored_samples"`). Sem amostras
  na região: `sampleCount: 0` e somas `null`, sem métricas fabricadas.
- `city`, `latitude` e `longitude` podem ser `null`; a região continua
  listada — apenas o globe não cria marcador para ela.

Limitação histórica: os totais do período agrupam as coletas pela região
**atual** de `servico.regiao_id`, pois `coleta` não armazena a região da
coleta. Após uma mudança de região do serviço, as coletas antigas passam a
contar na nova região; os totais não representam a localização histórica
da amostra.

Regiões ausentes retornam 200 com `regions: []`. Par inválido (incompleto,
`from >= to` ou formato incorreto) retorna 400; falha interna retorna 500.

### 2.2. Operações planejadas

Distribuição confirmada: listagem interna e integração na Sprint 1; rankings
na Sprint 2; autenticação, comparação e cenários na Sprint 3. Persistência e
histórico são da Sprint 1 e já possuem implementação no backend. A configuração
do intervalo por endpoint fica para etapa posterior, sem sprint definida.

Os caminhos desta tabela são propostas para funcionalidades ainda não
implementadas, sem garantia de disponibilidade HTTP na versão atual.

| Método | Caminho | Responsabilidade |
|---|---|---|
| `POST` | `/auth/login` | Validar as credenciais do usuário e emitir um JWT. |
| `GET` | `/services` | Entregar a lista de serviços e os dados de resumo usados no dashboard. |
| `GET` | `/rankings` | Consultar a classificação ambiental com critério e período identificados. |
| `GET` | `/comparisons` | Consultar dados comparáveis de serviços e regiões selecionados. |
| `POST` | `/scenarios` | Calcular uma simulação com serviço, região e hipóteses explicitamente informados. |
| `GET` | `/monitoring-settings` | Consultar as configurações de monitoramento. |
| `PATCH` | `/monitoring-settings` | Atualizar as configurações de monitoramento. |

Para ranking e comparação, os filtros de datas abaixo são planejados. Não
substituem o contrato implementado de `range` e `to` descrito na seção 2.1.

| Caminho | Parâmetros |
|---|---|
| `/rankings` | `from`, `to`, `metric` (`energy` ou `co2e`) |
| `/comparisons` | `serviceIds` (lista), `from`, `to` |

No contrato planejado, `POST /auth/login` recebe `username` e `password` e
retorna um `accessToken` JWT. O token será enviado nas chamadas autenticadas pelo cabeçalho
`Authorization: Bearer <accessToken>`. Operações que alteram configurações ou
iniciam simulações exigem autenticação JWT; o backend autentica e autoriza cada
chamada.

No contrato planejado, `POST /scenarios` recebe `serviceId`, `targetRegionCode`, `from` e `to`. A
resposta identifica o cenário como simulação e inclui as hipóteses e parâmetros
utilizados, distinguindo-o de resultados observados.

### 2.3. Configuração de monitoramento — planejada

O corpo usado para atualizar o intervalo de coleta é:

```json
{
  "collectionIntervalSeconds": 30
}
```

Esta alteração por HTTP ainda não está implementada. Hoje o job lê
`COLLECTION_INTERVAL_SECONDS`; a linha de `configuracao_sistema` não controla
o job. Na entrega dessa funcionalidade, o valor deverá configurar o intervalo
do Collection Job. Ele é independente da
frequência com que o frontend atualiza o dashboard e do intervalo que a API de
métricas associa aos dados de uma coleta.

### 2.4. Respostas e falhas

As respostas dos endpoints implementados são JSON e representam dados preparados pelo backend para o
recurso solicitado. As rotas validam `body`, `params` e `query parameters`
antes de executar os controllers. Dados inválidos de requisição resultam em
`400`. A resposta `401` está prevista para as futuras rotas protegidas; JWT
ainda não está implementado. Falhas de negócio e de integração são retornadas como erros explícitos,
sem respostas com aparência de sucesso ou métricas substituídas por zero.

O frontend deverá apresentar carregamento, sucesso, ausência de dados,
desatualização e falha ao integrar estas rotas. Os horários reais retornados
pelo backend não devem ser substituídos pelo horário da requisição.

## 3. Greener Metrics Aggregator API

Base: `https://metrics.unilaunch.org`.

O backend usa esta API para descobrir serviços monitorados e obter métricas de
um serviço. A operação de métricas documentada é:

| Método | Caminho | Uso |
|---|---|---|
| `GET` | `/services` | Descobrir serviços e obter sua identificação, localização e caminho de métricas. |
| `GET` | `/metrics/{id_servico}` | Obter as métricas operacionais do serviço identificado. |

O identificador `checkout-worker` é um exemplo de `id_servico`. A integração de
descoberta lista os serviços disponíveis conforme a operação definida pelo
OpenAPI da Metrics Aggregator API. A integração respeita esse contrato, sem
inferir um caminho de descoberta não confirmado.

O exemplo abaixo representa os campos de métricas usados no projeto:

```json
{
  "collection_interval_seconds": 27,
  "metrics": {
    "cpu_percent": 62.67,
    "memory_gb": 3.17,
    "disk_gb": 19.26,
    "network_gb": 0.45
  }
}
```

O backend valida a resposta externa e converte os dados para os tipos internos
de domínio antes de armazená-los ou apresentá-los ao frontend. O
`collection_interval_seconds` descreve o período das métricas recebidas e não
configura o Collection Job.

O código atual mapeia timeout, falha de comunicação e HTTP 404 de métricas
para `unavailable`, e HTTP 500 para `metrics_missing`. O contrato externo
também descreve indisponibilidade para 500, portanto essa classificação não
comprova a causa exata. A distinção precisa ser esclarecida com o fornecedor;
não há campo discriminador validado pelo código atual. Uma falha de banco é
interna e não deve ser atribuída ao serviço monitorado.

## 4. Greener Carbon Intensity API

Base: `https://carbon.unilaunch.org`.

O backend consulta a API para associar dados ambientais à região de um serviço.
A operação documentada é:

| Método | Caminho | Uso |
|---|---|---|
| `GET` | `/regions` | Obter as regiões e os indicadores ambientais fornecidos pela API. |

O contrato contém dados como código da região, intensidade de carbono em
`gCO₂e/kWh` e participação renovável. `br-sudeste`, `85 gCO₂e/kWh` e `83%` são
exemplos de referência; não são valores constantes nem garantias de dados
atuais. A integração valida campos regionais e fatores. O schema atual não exige
um timestamp de medição do fornecedor; `regiao.atualizado_em` registra a atualização
local e não comprova que o fator corresponde ao instante físico da amostra.

## 5. Segurança e isolamento

Os itens relativos a JWT e autorização descrevem o contrato planejado; não
comprovam autenticação implementada na versão atual. Sua entrega está prevista para a Sprint 3.

- O navegador comunica-se somente com a API do GreenER.
- Credenciais e segredos das integrações externas permanecem no backend.
- O token JWT acompanha as chamadas autenticadas de acordo com o middleware do
  backend.
- CORS permite somente as origens de frontend configuradas para os ambientes
  do projeto.
- O backend valida entradas e respostas externas antes de utilizá-las.

## 6. Alinhamento entre contrato e implementação

O contrato deverá ser mantido coerente entre rotas, schemas Zod, tipos do
backend e tipos consumidos pela interface. Essa integração ainda está pendente:
a lista solicita `/api/v1/services`, ausente nesta versão; o detalhe usa mocks
sem consultar as rotas de detalhe e histórico já existentes.

Histórico, ranking, comparação, região e simulação são recursos do produto,
mas não estão todos disponíveis na interface. Consulte o [plano](./plano-de-entregas.md)
e as [rotas atuais do frontend](../frontend/arquitetura.md#67-rotas-da-aplicação).

Não existe handler global de rota desconhecida em JSON: um caminho não
registrado pode retornar o 404 padrão do Express em HTML. Isso difere do 404
de serviço desconhecido em uma rota implementada, que passa pelo errorHandler.

## 7. Estado do monitoramento — implementado

No servidor atual, as rotas são montadas sob `/api/v1`. Esta consulta é pública,
não recebe corpo nem parâmetros e não exige JWT:

```http
GET /api/v1/monitoring/status
Accept: application/json
```

Exemplo de resposta HTTP 200:

```json
{
  "serverTime": "2026-10-13T19:00:10Z",
  "running": false,
  "collectionIntervalSeconds": 30,
  "lastRoundStartedAt": "2026-10-13T19:00:00Z",
  "lastRoundFinishedAt": "2026-10-13T19:00:02Z",
  "nextCollectionAt": "2026-10-13T19:00:32Z",
  "lastSuccessfulCollectionAt": "2026-10-13T19:00:01Z",
  "lastRound": {
    "outcome": "partial",
    "attemptedServices": 8,
    "collectedServices": 7,
    "failedServices": 1
  },
  "dependencies": {
    "metricsDiscovery": "available",
    "carbon": "available",
    "database": "available"
  }
}
```

- O estado fica em memória e é reiniciado com o processo. Datas ainda não
  observadas e `lastRound` começam como `null`; dependências começam como
  `unknown`. Não é um histórico persistente de rodadas.
- `running` indica uma rodada em execução. Durante a rodada,
  `nextCollectionAt` é `null`; depois, informa a previsão do próximo início.
  Parar o job também remove essa previsão.
- O intervalo é lido de `COLLECTION_INTERVAL_SECONDS`, com padrão de 30
  segundos, mantendo o funcionamento atual do job. Uma futura barra integrada
  poderá usar `serverTime` e `nextCollectionAt`; o contador atual do frontend
  é demonstrativo e não consome essa rota.
- `attemptedServices` conta os serviços selecionados para consultar métricas;
  `collectedServices` conta coletas válidas efetivamente gravadas;
  `failedServices` é a diferença. Uma falha anterior à seleção pode encerrar
  uma rodada com os três contadores em zero e resultado `failed`.
- `outcome` é `success` quando a rodada termina sem falha observada, `partial`
  quando houve falha mas alguma coleta foi gravada e `failed` quando houve
  falha sem nenhuma coleta gravada. Uma descoberta válida sem serviços pode
  terminar com `success` e contadores zerados.
- Falhas na sincronização ou na atualização de status também afetam
  `outcome`, mesmo que os dados de uma coleta tenham sido gravados.
- `lastSuccessfulCollectionAt` usa o horário retornado pelo INSERT de uma
  coleta válida; falhas posteriores não o substituem por horário de tentativa.
- `dependencies` informa o último resultado observado nas operações de
  descoberta, carbono e banco. Não representa uma checagem contínua de saúde.
  Falha de carbono continua visível mesmo quando o cálculo usa fatores antigos.
- A rota retorna 200 mesmo quando o estado informa falha. Um erro interno ao
  servir a resposta passa pelo `errorHandler` e retorna 500.
- A última coleta global não significa que todos os serviços atualizaram.
  Na integração futura, a interface deverá considerar a `collectedAt` de cada serviço; os mocks atuais não comprovam esse consumo.
