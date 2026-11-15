import { useCallback, useMemo } from 'react';

import { fetchCollectionStatuses } from '@/api/collection-status';
import { fetchPainelRegions, fetchPainelServiceHistories } from '@/api/painel';
import { fetchRanking } from '@/api/rankings';
import { fetchServices } from '@/api/services';
import { useApiQuery } from '@/hooks/useApiQuery';
import type { PainelWidgetContent, PainelWidgetSource, PainelWidgetSources } from '@/types/painel';
import type { HistoryRange } from '@/types/service';
import {
    buildAvailabilityKpi,
    buildCarbonIntensityKpi,
    buildCo2eByRegion,
    buildCo2eKpi,
    buildCollectionFailures,
    buildEmissionSeries,
    buildEnergyByRegion,
    buildEnergyKpi,
    buildLatestAttempts,
    buildServiceStatus,
    buildServicesWithoutMetrics,
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
const ATTEMPTS_LIMIT = 8;

// Traduz o estado de uma consulta na situação do widget que depende dela.
function toSource<T>(
    data: T | null,
    error: string | null,
    subtitle: string,
    build: (data: T) => PainelWidgetContent | null,
): PainelWidgetSource {
    if (data === null) {
        return error
            ? { status: 'error', subtitle, errorMessage: error }
            : { status: 'loading', subtitle };
    }

    const content = build(data);

    return content ? { status: 'ready', subtitle, content } : { status: 'empty', subtitle };
}

// Busca no backend os dados de todos os widgets do painel e devolve, pelo id do
// widget, a situação e o conteúdo de cada um. Widgets que saem da mesma rota
// compartilham a mesma consulta. O período escolhido na barra do painel vale para
// todas as consultas: quando ele muda, todas são refeitas.
export function usePainelData(range: HistoryRange): PainelWidgetSources {
    const period = RANGE_LABELS[range];

    const { data: regions, error: regionsError } = useApiQuery(
        useCallback(() => fetchPainelRegions(range), [range]),
    );

    const { data: ranking, error: rankingError } = useApiQuery(
        useCallback(() => fetchRanking('co2eGrams', range), [range]),
    );

    const { data: failures, error: failuresError } = useApiQuery(
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

    const { data: histories, error: historiesError } = useApiQuery(
        useCallback(() => fetchPainelServiceHistories(range), [range]),
    );

    const { data: attempts, error: attemptsError } = useApiQuery(
        useCallback(
            () =>
                fetchCollectionStatuses({
                    search: '',
                    result: 'all',
                    page: 1,
                    limit: ATTEMPTS_LIMIT,
                }),
            [],
        ),
    );

    const { data: services, error: servicesError } = useApiQuery(
        useCallback(() => fetchServices(), []),
    );

    // Só recalcula quando alguma consulta muda, para os widgets não redesenharem à toa.
    return useMemo(
        () => ({
            'co2e-total': toSource(regions, regionsError, period, buildCo2eKpi),
            'energia-total': toSource(regions, regionsError, period, buildEnergyKpi),
            disponibilidade: toSource(regions, regionsError, NOW_LABEL, buildAvailabilityKpi),
            'intensidade-carbono': toSource(regions, regionsError, period, buildCarbonIntensityKpi),
            'energia-por-regiao': toSource(regions, regionsError, period, buildEnergyByRegion),
            'co2e-distribuicao': toSource(regions, regionsError, period, buildCo2eByRegion),
            'status-servicos': toSource(regions, regionsError, NOW_LABEL, buildServiceStatus),
            'top-emissores': toSource(ranking, rankingError, period, buildTopEmitters),
            'falhas-coleta': toSource(failures, failuresError, NOW_LABEL, buildCollectionFailures),
            'ultimas-tentativas': toSource(attempts, attemptsError, NOW_LABEL, buildLatestAttempts),
            'servicos-sem-metricas': toSource(
                services,
                servicesError,
                NOW_LABEL,
                buildServicesWithoutMetrics,
            ),
            'co2e-por-regiao': toSource(histories, historiesError, period, (data) =>
                buildEmissionSeries(data, range),
            ),
        }),
        [
            regions,
            regionsError,
            ranking,
            rankingError,
            failures,
            failuresError,
            histories,
            historiesError,
            attempts,
            attemptsError,
            services,
            servicesError,
            period,
            range,
        ],
    );
}
