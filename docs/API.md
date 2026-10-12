# API — GreenER

Este documento reúne as operações HTTP mencionadas na arquitetura e os contratos
das APIs externas utilizadas pelo GreenER. Os detalhes de implementação do
backend estão em [../backend/arquitetura.md](../backend/arquitetura.md).

## API do GreenER

O frontend consulta o backend GreenER. Não deve acessar diretamente as APIs
externas.

### Operações identificadas

| Método | Caminho | Finalidade |
|---|---|---|
| `GET` | `/services` | Consultar os serviços e os dados persistidos disponíveis para o dashboard. |
| `PATCH` | `/monitoring-settings` | Alterar configurações do monitoramento. |

O exemplo de corpo para a atualização de configuração é:

```json
{
  "collectionIntervalSeconds": 30
}
```

O endpoint de login é mencionado no fluxo de autenticação, mas seu caminho e o
formato completo da requisição e da resposta não estão definidos no documento
de origem.

As rotas de configuração protegidas exigem autenticação JWT. O frontend deve
apresentar a data e a hora da última atualização dos dados. A frequência de
atualização da interface não precisa ser igual ao intervalo de coleta do
backend.

As entradas das requisições são validadas em tempo de execução. O fluxo
documentado prevê resposta `400` para dados de requisição inválidos e resposta
`401` quando o token de acesso não é válido.

## Greener Metrics Aggregator API

O backend utiliza a API externa para descobrir os serviços disponíveis e
consultar as métricas de cada serviço.

| Método | Caminho | Finalidade |
|---|---|---|
| `GET` | `/services` | Obter a lista atual de serviços monitorados. |
| `GET` | `/metrics/{service_id}` | Obter as métricas de um serviço específico. |

O exemplo de resposta documentado para a consulta de métricas é:

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

O intervalo retornado junto às métricas descreve o período relacionado àquela
coleta. Ele não representa automaticamente o intervalo de execução do Job do
GreenER. Seu uso no cálculo de energia está descrito em
[cálculo.md](./cálculo.md).

## Greener Carbon Intensity API

O backend consulta a intensidade de carbono da região em que o serviço está
hospedado. A consulta utiliza o código da região; `br-sudeste` é o exemplo
registrado no documento de origem. Entre os dados retornados está
`carbon_intensity_gco2e_per_kwh`.

O caminho do endpoint e o formato completo da requisição e da resposta da Carbon
Intensity API não estão especificados no documento de origem.

## Tratamento das respostas externas

As respostas das APIs externas são consideradas dados não confiáveis até serem
validadas. O backend valida os dados recebidos antes de utilizá-los. Uma
resposta inválida ou uma falha externa deve ser tratada sem interromper a coleta
dos demais serviços.
