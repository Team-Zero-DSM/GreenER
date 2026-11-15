import { useCallback } from 'react';

import { fetchCollectionStatuses } from '@/api/collection-status';
import { fetchPainelRegions, fetchPainelServiceHistories } from '@/api/painel';
import { fetchRanking } from '@/api/rankings';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { PainelWidgetContent, PainelWidgetSource, PainelWidgetSources } from '@/types/painel';
import type { HistoryRange } from '@/types/service';
import {
    buildAvailabilityKpi,
    buildCarbonIntensityKpi,
    buildCo2eKpi,
    buildCollectionFailures,
    buildEmissionSeries,
    buildEnergyByRegion,
    buildEnergyKpi,
    buildServiceStatus,
    buildTopEmitters,
} from '@/utils/painel';

// Texto do período no subtítulo dos widgets.
const RANGE_LABELS: Record<HistoryRange, string> = {
    '1h': 'Última hora',
    '6h': 'Últimas 6 horas',
    '24h': 'Últimas 24 horas',
    '7d': 'Últimos 7 dias',
    '30d': 'Últimos 30 dias',
};

// Subtítulo dos widgets que mostram a situação do momento, sem depender do período.
const NOW_LABEL = 'Situação atual';

const FAILURES_LIMIT = 5;

interface Query<T> {
    data: T | null;
    error: string | null;
}

// Traduz o estado de uma consulta na situação do widget que depende dela.
function toSource<T>(
    query: Query<T>,
    subtitle: string,
    build: (data: T) => PainelWidgetContent | null,
): PainelWidgetSource {
    if (query.data === null) {
        return query.error
            ? { status: 'error', subtitle, errorMessage: query.error }
            : { status: 'loading', subtitle };
    }

    const content = build(query.data);

    return content ? { status: 'ready', subtitle, content } : { status: 'empty', subtitle };
}

// Busca no backend os dados de todos os widgets do painel e devolve, pelo id do
// widget, a situação e o conteúdo de cada um. Widgets que saem da mesma rota
// compartilham a mesma consulta. O período escolhido na barra do painel vale para
// todas as consultas: quando ele muda, todas são refeitas.
export function usePainelData(range: HistoryRange): PainelWidgetSources {
    const period = RANGE_LABELS[range];

    const regions = useApiQuery(useCallback(() => fetchPainelRegions(range), [range]));

    const ranking = useApiQuery(useCallback(() => fetchRanking('co2eGrams', range), [range]));

    const failures = useApiQuery(
        useCallback(
            () =>
                fetchCollectionStatuses({
                    search: '',
                    result: 'failure',
                    page: 1,
                    limit: FAILURES_LIMIT,
                }),
            [],
        ),
    );

    const histories = useApiQuery(useCallback(() => fetchPainelServiceHistories(range), [range]));

    return {
        'co2e-total': toSource(regions, period, buildCo2eKpi),
        'energia-total': toSource(regions, period, buildEnergyKpi),
        disponibilidade: toSource(regions, NOW_LABEL, buildAvailabilityKpi),
        'intensidade-carbono': toSource(regions, period, buildCarbonIntensityKpi),
        'energia-por-regiao': toSource(regions, period, buildEnergyByRegion),
        'status-servicos': toSource(regions, NOW_LABEL, buildServiceStatus),
        'top-emissores': toSource(ranking, period, buildTopEmitters),
        'falhas-coleta': toSource(failures, NOW_LABEL, buildCollectionFailures),
        'co2e-por-regiao': toSource(histories, period, (data) => buildEmissionSeries(data, range)),
    };
}
