import type { HistoryRange } from '@/types/service';
import type { ComparisonPoint, ComparisonRequest, ComparisonResponse } from '@/types/comparison';

// Configurações exclusivas deste mock.
const MOCK_MAX_POINTS = 120;
const MOCK_COLLECTION_INTERVAL_SECONDS = 30;

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

    return Array.from({ length: MOCK_MAX_POINTS }, (_, indice) => {
        const variacao = 0.9 + ((seed + indice * 7) % 21) / 100;

        const energiaKwh = arredondar((potenciaWatts / 1000) * (bucketSeconds / 3600) * variacao);

        const co2eGrams = arredondar(energiaKwh * intensidade);

        return {
            timestamp: new Date(inicioMs + indice * bucketMs).toISOString(),

            sampleCount: Math.max(1, Math.round(bucketSeconds / MOCK_COLLECTION_INTERVAL_SECONDS)),

            // O nome do campo segue o tipo ComparisonPoint.
            energyKwh: energiaKwh,
            co2eGrams: co2eGrams,
        };
    });
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
