# APIs e Contratos — GreenER

Este documento define as fronteiras de comunicação do GreenER. O frontend
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

A API interna entrega dados do dashboard, detalhe e histórico de serviços,
classificações, comparações, regiões e cenários. Também oferece autenticação e
administração das configurações de monitoramento.

### 2.1. Operações centrais

| Método | Caminho | Responsabilidade |
|---|---|---|
| `POST` | `/auth/login` | Validar as credenciais do usuário e emitir um JWT. |
| `GET` | `/services` | Entregar a lista de serviços e os dados de resumo usados no dashboard. |
| `GET` | `/services/{service_id}` | Entregar os dados e as métricas mais recentes do serviço. |
| `GET` | `/services/{service_id}/collections` | Consultar o histórico de coletas do serviço por período. |
| `GET` | `/rankings` | Consultar a classificação ambiental com critério e período identificados. |
| `GET` | `/comparisons` | Consultar dados comparáveis de serviços e regiões selecionados. |
| `GET` | `/regions` | Entregar regiões e os dados ambientais associados. |
| `GET` | `/monitoring/status` | Informar estado, horários e resultados observados pelo job de coleta. |
| `POST` | `/scenarios` | Calcular uma simulação com serviço, região e hipóteses explicitamente informados. |
| `GET` | `/monitoring-settings` | Consultar as configurações de monitoramento. |
| `PATCH` | `/monitoring-settings` | Atualizar as configurações de monitoramento. |

As consultas de histórico e analytics usam datas ISO 8601 no intervalo
`from`–`to`. Os parâmetros são:

| Caminho | Parâmetros |
|---|---|
| `/services/{service_id}/collections` | `from`, `to` |
| `/rankings` | `from`, `to`, `metric` (`energy` ou `co2e`) |
| `/comparisons` | `serviceIds` (lista), `from`, `to` |

`POST /auth/login` recebe `username` e `password` e retorna um `accessToken`
JWT. O token é enviado nas chamadas autenticadas pelo cabeçalho
`Authorization: Bearer <accessToken>`. Operações que alteram configurações ou
iniciam simulações exigem autenticação JWT; o backend autentica e autoriza cada
chamada.

`POST /scenarios` recebe `serviceId`, `targetRegionCode`, `from` e `to`. A
resposta identifica o cenário como simulação e inclui as hipóteses e parâmetros
utilizados, distinguindo-o de resultados observados.

### 2.2. Configuração de monitoramento

O corpo usado para atualizar o intervalo de coleta é:

```json
{
  "collectionIntervalSeconds": 30
}
```

O valor configura o intervalo do Collection Job. Ele é independente da
frequência com que o frontend atualiza o dashboard e do intervalo que a API de
métricas associa aos dados de uma coleta.

### 2.3. Respostas e falhas

As respostas são JSON e representam dados preparados pelo backend para o
recurso solicitado. As rotas validam `body`, `params` e `query parameters`
antes de executar os controllers. Dados inválidos de requisição resultam em
`400`; ausência de autenticação ou token inválido em rota protegida resulta em
`401`. Falhas de negócio e de integração são retornadas como erros explícitos,
sem respostas com aparência de sucesso ou métricas substituídas por zero.

O frontend apresenta os estados de carregamento, sucesso, ausência de dados,
desatualização e falha. O horário da última atualização é fornecido junto aos
dados apresentados.

## 3. Greener Metrics Aggregator API

Base: `https://metrics.unilaunch.org`.

O backend usa esta API para descobrir serviços monitorados e obter métricas de
um serviço. A operação de métricas documentada é:

| Método | Caminho | Uso |
|---|---|---|
| `GET` | `/metrics/{id_servico}` | Obter as métricas operacionais e a localização do serviço identificado. |

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
atuais. A integração valida e mantém o contexto regional e temporal retornado
pela API.

## 5. Segurança e isolamento

- O navegador comunica-se somente com a API do GreenER.
- Credenciais e segredos das integrações externas permanecem no backend.
- O token JWT acompanha as chamadas autenticadas de acordo com o middleware do
  backend.
- CORS permite somente as origens de frontend configuradas para os ambientes
  do projeto.
- O backend valida entradas e respostas externas antes de utilizá-las.

## 6. Alinhamento entre contrato e implementação

Rotas, schemas Zod, tipos do backend e tipos consumidos pelo frontend compõem
um único contrato e são implementados em conjunto. Histórico, ranking,
comparação, região e simulação são recursos do produto; suas telas consomem os
dados disponibilizados pelos respectivos módulos do backend e não acessam
integrações externas diretamente.

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
  segundos, mantendo o funcionamento atual do job. O contador no frontend
  é calculado com `serverTime` e `nextCollectionAt`.
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
  Para cada serviço, o frontend continua usando sua própria `collectedAt`.
