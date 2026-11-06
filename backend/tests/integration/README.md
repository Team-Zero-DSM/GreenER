# Testes básicos com PostgreSQL — task #95

Estes três testes usam os serviços e repositórios reais, sem mocks de banco. A estrutura continua separada por módulo em `tests/integration/modules/`.

## 1. Preparação

`helpers/database.ts` cria um banco novo com nome aleatório para cada arquivo e executa o `database/schema.sql` do projeto. Cada teste tem seu próprio banco. Ao terminar, a conexão é encerrada e o banco criado pelo teste é removido.

O usuário do PostgreSQL precisa poder criar bancos e instalar a extensão `uuid-ossp`. Use um servidor local de testes. A variável `TEST_DATABASE_URL` deve apontar para um banco existente nesse servidor; os testes não alteram suas tabelas.

## 2. Dados conhecidos

| Serviço | Data (UTC)       | Energia (kWh) | CO₂e (g) |
| ------- | ---------------- | ------------- | -------- |
| A       | 06/11/2026 11:00 | 1             | 100      |
| A       | 06/11/2026 12:00 | 2             | 200      |
| B       | 06/11/2026 11:30 | 4             | 800      |
| A       | 04/11/2026 12:00 | 99            | 9900     |

Para 24 horas contadas a partir da coleta mais recente, o resultado esperado é A = 3 kWh/300 g e B = 4 kWh/800 g. A coleta de 04/11 fica fora do período. As métricas são dados artificiais destinados a facilitar a conferência.

## 3. Histórico persistido

`modules/services/services.repository.test.ts` grava sucesso e falha usando `CollectionsRepository`. Outra conexão consulta o histórico via `ServicesService` e `ServiceRepository`. O teste verifica descrições, tipos, HTTP 503, ordem dos eventos e vínculo do sucesso com a coleta.

Isso comprova leitura em outra conexão após a gravação; não testa reinicialização do servidor PostgreSQL.

## 4. Ranking

`modules/rankings/rankings.repository.test.ts` executa `RankingsService` com seu repositório real. Confere a posição de B antes de A, os totais conhecidos e as quantidades de amostras. Uma consulta SQL adicional confere os totais no mesmo período.

## 5. Comparação

`modules/comparisons/comparisons.repository.test.ts` compara A e B com repositórios reais. Confere os resumos com os valores conhecidos e com SQL. Também soma os pontos usados pelo gráfico para verificar se representam os mesmos totais dos resumos.

## Executar

Na raiz do projeto, crie um PostgreSQL de testes (se ainda não existir):

```bash
docker run -d --name greener-95-postgres \
  -e POSTGRES_USER=test -e POSTGRES_PASSWORD=test \
  -e POSTGRES_DB=greener_test -p 127.0.0.1:55495:5432 postgres:17-bookworm
```

Espere `docker exec greener-95-postgres pg_isready -U test -d greener_test` informar que aceita conexões. Então:

```bash
cd backend
npm ci
TEST_DATABASE_URL=postgresql://test:test@127.0.0.1:55495/greener_test npm test
npm run lint
```

Sem `TEST_DATABASE_URL`, os três testes de integração são ignorados; os unitários continuam sendo executados. O CI atual precisa receber essa variável explicitamente para executar os testes de banco.

Para encerrar e remover o contêiner local criado para testes:

```bash
docker rm -f -v greener-95-postgres
```

## Resultado observado em 06/11/2026

- PostgreSQL 17 e Node.js 24.
- 3 testes de integração e 22 testes unitários passaram: 25 no total, nenhum ignorado na execução com `TEST_DATABASE_URL`.
- Lint aprovado.
- Não foram feitas requisições às APIs externas nem alterações em dados de produção.
