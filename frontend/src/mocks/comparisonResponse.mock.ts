import type { HistoryRange } from '@/types/service';
import type { ComparisonPoint, ComparisonRequest, ComparisonResponse } from '@/types/comparison';

// Quantidade de pontos recentes sem métricas no Checkout.
const MOCK_PONTOS_RECENTES_SEM_METRICAS_CHECKOUT = 5;

// Configurações exclusivas deste mock.
const MOCK_MAX_POINTS = 120;
const MOCK_COLLECTION_INTERVAL_SECONDS = 30;

// Ativa ou desativa os cenários de falha para testes.
const MOCK_SIMULAR_FALHAS = true;

// Checkout Worker: início do histórico e posição da falha isolada.
const MOCK_PONTOS_SEM_HISTORICO_CHECKOUT = 60;
const MOCK_PONTO_FALHA_ISOLADA_CHECKOUT = 85;

// Auth API: região com pontos consecutivos sem métricas.
const MOCK_INICIO_FALHAS_CONSECUTIVAS = 60;
const MOCK_QUANTIDADE_PONTOS_ESTIMADOS = 5;

// Duração de cada período em milissegundos.
const RANGE_MS: Record<HistoryRange, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
};

// Potência fictícia de cada serviço.
const MOCK_POWER_WATTS: Record<string, number> = {
    'checkout-worker': 42,
    'auth-api': 28,
    'notification-worker': 16,
};

// Intensidade de carbono fictícia de cada região.
const MOCK_REGION_INTENSITY: Record<string, number> = {
    'br-sudeste': 85,
    'ca-toronto': 250,
    'us-east': 350,
};

// Intensidade fictícia da região original de cada serviço.
const MOCK_ORIGINAL_INTENSITY: Record<string, number> = {
    'checkout-worker': 350,
    'auth-api': 250,
    'notification-worker': 180,
};

// Arredonda um número para até 8 casas decimais.
function arredondar(valor: number): number {
    return Number(valor.toFixed(8));
}

// Descobre qual intensidade de carbono será usada.
function obterIntensidade(externalId: string, simulatedRegionCode: string | null): number {
    if (simulatedRegionCode === null) {
        return MOCK_ORIGINAL_INTENSITY[externalId] ?? 200;
    }

    return MOCK_REGION_INTENSITY[simulatedRegionCode] ?? 200;
}

// Simula uma coleta ausente em um ponto.
// Ajusta os valores restantes proporcionalmente à quantidade de coletas válidas.
function simularColetaAusente(ponto: ComparisonPoint): ComparisonPoint {
    const amostrasOriginais = ponto.sampleCount;

    if (amostrasOriginais <= 1) {
        return {
            ...ponto,
            sampleCount: 0,
            energyKwh: null,
            co2eGrams: null,
        };
    }

    const amostrasValidas = amostrasOriginais - 1;
    const proporcaoValida = amostrasValidas / amostrasOriginais;

    return {
        ...ponto,
        sampleCount: amostrasValidas,
        energyKwh: ponto.energyKwh === null ? null : arredondar(ponto.energyKwh * proporcaoValida),
        co2eGrams: ponto.co2eGrams === null ? null : arredondar(ponto.co2eGrams * proporcaoValida),
    };
}

// Prepara pontos com falhas para testar o tratamento de dados.
function simularFalhasDeTeste(pontos: ComparisonPoint[], externalId: string): ComparisonPoint[] {
    if (!MOCK_SIMULAR_FALHAS) {
        return pontos;
    }

    const pontosComFalhas = pontos.map((ponto) => ({ ...ponto }));

    // Cenário 1: Checkout Worker possui histórico parcial,
    // uma falha isolada e uma indisponibilidade recente.
    if (externalId === 'checkout-worker') {
        // Primeira metade do período sem histórico.
        for (let indice = 0; indice < MOCK_PONTOS_SEM_HISTORICO_CHECKOUT; indice++) {
            pontosComFalhas[indice] = {
                ...pontosComFalhas[indice],
                sampleCount: 0,
                energyKwh: null,
                co2eGrams: null,
            };
        }

        // Falha isolada dentro do histórico disponível.
        pontosComFalhas[MOCK_PONTO_FALHA_ISOLADA_CHECKOUT] = simularColetaAusente(
            pontosComFalhas[MOCK_PONTO_FALHA_ISOLADA_CHECKOUT],
        );

        // Últimos cinco pontos sem métricas.
        const inicioFalhaRecente = Math.max(
            0,
            pontosComFalhas.length - MOCK_PONTOS_RECENTES_SEM_METRICAS_CHECKOUT,
        );

        for (let indice = inicioFalhaRecente; indice < pontosComFalhas.length; indice++) {
            pontosComFalhas[indice] = {
                ...pontosComFalhas[indice],
                sampleCount: 0,
                energyKwh: null,
                co2eGrams: null,
            };
        }
    }

    // Cenário 2: Auth API possui cinco agrupamentos consecutivos
    // sem métricas, permitindo testar a interpolação.
    if (externalId === 'auth-api') {
        for (
            let indice = MOCK_INICIO_FALHAS_CONSECUTIVAS;
            indice < MOCK_INICIO_FALHAS_CONSECUTIVAS + MOCK_QUANTIDADE_PONTOS_ESTIMADOS;
            indice++
        ) {
            pontosComFalhas[indice] = {
                ...pontosComFalhas[indice],
                sampleCount: 0,
                energyKwh: null,
                co2eGrams: null,
            };
        }
    }

    // Cenário 3: Notification Worker não possui nenhuma métrica disponível.
    if (externalId === 'notification-worker') {
        return pontosComFalhas.map((ponto) => ({
            ...ponto,
            sampleCount: 0,
            energyKwh: null,
            co2eGrams: null,
        }));
    }

    return pontosComFalhas;
}

// Gera os pontos fictícios do gráfico de um serviço.
function gerarPontos(
    externalId: string,
    range: HistoryRange,
    simulatedRegionCode: string | null,
    inicioMs: number,
): ComparisonPoint[] {
    const duracaoMs = RANGE_MS[range];
    const bucketMs = duracaoMs / MOCK_MAX_POINTS;
    const bucketSeconds = Math.ceil(bucketMs / 1000);

    const potenciaWatts = MOCK_POWER_WATTS[externalId] ?? 20;

    const intensidade = obterIntensidade(externalId, simulatedRegionCode);

    // Cria uma variação previsível para os valores do gráfico.
    const seed = [...externalId].reduce((total, caractere) => total + caractere.charCodeAt(0), 0);

    const pontos = Array.from({ length: MOCK_MAX_POINTS }, (_, indice) => {
        const variacao = 0.9 + ((seed + indice * 7) % 21) / 100;

        const energiaKwh = arredondar((potenciaWatts / 1000) * (bucketSeconds / 3600) * variacao);

        const co2eGrams = arredondar(energiaKwh * intensidade);

        return {
            timestamp: new Date(inicioMs + indice * bucketMs).toISOString(),

            sampleCount: Math.max(1, Math.round(bucketSeconds / MOCK_COLLECTION_INTERVAL_SECONDS)),

            energyKwh: energiaKwh,
            co2eGrams,
        };
    });

    return simularFalhasDeTeste(pontos, externalId);
}

// Calcula os totais dos pontos gerados.
function gerarResumo(pontos: ComparisonPoint[]) {
    return {
        sampleCount: pontos.reduce((total, ponto) => total + ponto.sampleCount, 0),

        energyKwh: pontos.every((ponto) => ponto.energyKwh === null)
            ? null
            : arredondar(pontos.reduce((total, ponto) => total + (ponto.energyKwh ?? 0), 0)),

        co2eGrams: pontos.every((ponto) => ponto.co2eGrams === null)
            ? null
            : arredondar(pontos.reduce((total, ponto) => total + (ponto.co2eGrams ?? 0), 0)),
    };
}

// Monta a resposta fictícia da comparação.
export function gerarMockComparisonResponse(request: ComparisonRequest): ComparisonResponse {
    const periodoFinal = Date.now();

    const duracaoMs = RANGE_MS[request.range];
    const periodoInicial = periodoFinal - duracaoMs;

    const series = request.selections.map((selecao) => {
        const points = gerarPontos(
            selecao.externalId,
            request.range,
            selecao.simulatedRegionCode,
            periodoInicial,
        );

        return {
            selectionId: selecao.selectionId,
            summary: gerarResumo(points),
            points,
        };
    });

    return {
        range: request.range,

        period: {
            from: new Date(periodoInicial).toISOString(),
            to: new Date(periodoFinal).toISOString(),
        },

        series,
    };
}
