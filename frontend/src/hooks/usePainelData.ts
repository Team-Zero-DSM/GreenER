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

// Período usado nas consultas do painel.
const PAINEL_RANGE: HistoryRange = '24h';

const FAILURES_LIMIT = 5;

interface Query<T> {
    data: T | null;
    error: string | null;
}

// Traduz o estado de uma consulta na situação do widget que depende dela.
function toSource<T>(
    query: Query<T>,
    build: (data: T) => PainelWidgetContent | null,
): PainelWidgetSource {
    if (query.data === null) {
        return query.error ? { status: 'error', errorMessage: query.error } : { status: 'loading' };
    }

    const content = build(query.data);

    return content ? { status: 'ready', content } : { status: 'empty' };
}

// Busca no backend os dados de todos os widgets do painel e devolve, pelo id do
// widget, a situação e o conteúdo de cada um. Widgets que saem da mesma rota
// compartilham a mesma consulta.
export function usePainelData(): PainelWidgetSources {
    const range = PAINEL_RANGE;

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
        'co2e-total': toSource(regions, buildCo2eKpi),
        'energia-total': toSource(regions, buildEnergyKpi),
        disponibilidade: toSource(regions, buildAvailabilityKpi),
        'intensidade-carbono': toSource(regions, buildCarbonIntensityKpi),
        'energia-por-regiao': toSource(regions, buildEnergyByRegion),
        'status-servicos': toSource(regions, buildServiceStatus),
        'top-emissores': toSource(ranking, buildTopEmitters),
        'falhas-coleta': toSource(failures, buildCollectionFailures),
        'co2e-por-regiao': toSource(histories, (data) => buildEmissionSeries(data, range)),
    };
}
