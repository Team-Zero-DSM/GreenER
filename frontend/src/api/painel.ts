import { fetchRegionsByPeriod } from '@/api/regions';
import { fetchServiceHistory, fetchServices } from '@/api/services';
import type { Region } from '@/types/api';
import type { HistoryRange, ServiceHistory, ServiceSummary } from '@/types/service';

// Duração de cada período do seletor, em milissegundos.
const HOUR_MS = 60 * 60 * 1000;

export const PAINEL_RANGE_MS: Record<HistoryRange, number> = {
    '1h': HOUR_MS,
    '6h': 6 * HOUR_MS,
    '24h': 24 * HOUR_MS,
    '7d': 7 * 24 * HOUR_MS,
    '30d': 30 * 24 * HOUR_MS,
};

// Quantidade de pontos do gráfico de emissão no tempo.
const PAINEL_SERIES_POINTS = 24;

export interface PainelRegionsData {
    current: Region[];
    // Mesmo intervalo imediatamente anterior, usado na variação dos indicadores.
    previous: Region[];
}

// Totais por região (GET /regions) no período do painel e no período anterior.
// A janela é recalculada a cada chamada, para acompanhar as novas coletas.
export async function fetchPainelRegions(range: HistoryRange): Promise<PainelRegionsData> {
    const to = new Date();
    const from = new Date(to.getTime() - PAINEL_RANGE_MS[range]);
    const previousFrom = new Date(from.getTime() - PAINEL_RANGE_MS[range]);

    const [current, previous] = await Promise.all([
        fetchRegionsByPeriod(from, to),
        // Sem o período anterior os indicadores só ficam sem a variação, então a
        // falha desta consulta não derruba os widgets.
        fetchRegionsByPeriod(previousFrom, from).catch((): Region[] => []),
    ]);

    return { current, previous };
}

export interface PainelServiceHistory {
    service: ServiceSummary;
    history: ServiceHistory;
}

// Histórico de cada serviço ativo (GET /services e GET /service/:id/collections),
// que o painel soma por região para montar a emissão ao longo do tempo.
export async function fetchPainelServiceHistories(
    range: HistoryRange,
): Promise<PainelServiceHistory[]> {
    const services = await fetchServices({ active: true });

    const results = await Promise.allSettled(
        services.map(async (service) => ({
            service,
            history: await fetchServiceHistory(service.id, range, PAINEL_SERIES_POINTS),
        })),
    );

    const histories = results
        .filter((result) => result.status === 'fulfilled')
        .map((result) => result.value);

    // O histórico de um serviço fora do ar não impede o gráfico dos demais. Só é
    // erro quando nenhum serviço respondeu.
    if (services.length > 0 && histories.length === 0) {
        throw new Error('Não foi possível carregar o histórico dos serviços.');
    }

    return histories;
}
