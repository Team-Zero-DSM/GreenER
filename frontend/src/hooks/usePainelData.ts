import { useCallback, useMemo } from 'react';

import { fetchCollectionStatuses } from '@/api/collection-status';
import { fetchPainelRegions, fetchPainelServiceHistories } from '@/api/painel';
import { fetchRanking } from '@/api/rankings';
import { fetchServices } from '@/api/services';
import { useApiQuery } from '@/hooks/useApiQuery';
import { getWidgetMetricId } from '@/components/painel/painelMetricas';
import type {
    PainelSourceGetter,
    PainelWidgetContent,
    PainelWidgetSource,
    PainelWidgetSources,
} from '@/types/painel';
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
    buildEnergySeries,
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

// Busca mais itens do que o widget mostra, para sobrar o que exibir quando o
// widget está filtrado por uma região.
const STATUS_FETCH_LIMIT = 50;

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

// Busca no backend os dados de todas as métricas do painel e devolve a função que
// entrega, para cada widget, a situação e o conteúdo da métrica configurada nele
// (ou da métrica original do widget). Métricas que saem da mesma rota
// compartilham a mesma consulta. O período escolhido na barra do painel vale para
// todas as consultas: quando ele muda, todas são refeitas.
export function usePainelData(range: HistoryRange) {
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
                    limit: STATUS_FETCH_LIMIT,
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
                    limit: STATUS_FETCH_LIMIT,
                }),
            [],
        ),
    );

    const { data: services, error: servicesError } = useApiQuery(
        useCallback(() => fetchServices(), []),
    );

    // Regiões que existem no monitoramento, para o filtro dos widgets.
    const currentRegions = regions?.current;
    const regionCodes = useMemo(
        () => (currentRegions ?? []).map((region) => region.code).sort(),
        [currentRegions],
    );

    // Monta as fontes de todas as métricas: um conjunto com todos os dados ('') e
    // um para cada região, usado pelos widgets filtrados. Só recalcula quando
    // alguma consulta muda, para os widgets não redesenharem à toa.
    const sourcesByRegion = useMemo(() => {
        function buildSources(region: string | undefined): PainelWidgetSources {
            function inRegion<T>(items: readonly T[], code: (item: T) => string | undefined) {
                return region ? items.filter((item) => code(item) === region) : [...items];
            }

            const filtered = {
                regions: regions && {
                    current: inRegion(regions.current, (item) => item.code),
                    previous: inRegion(regions.previous, (item) => item.code),
                },
                ranking: ranking && {
                    ...ranking,
                    items: inRegion(ranking.items, (item) => item.region.code),
                },
                failures: failures && {
                    ...failures,
                    items: inRegion(failures.items, (item) => item.location.regionCode),
                },
                attempts: attempts && {
                    ...attempts,
                    items: inRegion(attempts.items, (item) => item.location.regionCode),
                },
                services: services && inRegion(services, (item) => item.location?.regionCode),
                histories:
                    histories && inRegion(histories, (item) => item.service.location?.regionCode),
            };

            const periodLabel = region ? `${period} · ${region}` : period;
            const nowLabel = region ? `${NOW_LABEL} · ${region}` : NOW_LABEL;

            return {
                'co2e-total': toSource(filtered.regions, regionsError, periodLabel, buildCo2eKpi),
                'energia-total': toSource(
                    filtered.regions,
                    regionsError,
                    periodLabel,
                    buildEnergyKpi,
                ),
                disponibilidade: toSource(
                    filtered.regions,
                    regionsError,
                    nowLabel,
                    buildAvailabilityKpi,
                ),
                'intensidade-carbono': toSource(
                    filtered.regions,
                    regionsError,
                    periodLabel,
                    buildCarbonIntensityKpi,
                ),
                'energia-por-regiao': toSource(
                    filtered.regions,
                    regionsError,
                    periodLabel,
                    buildEnergyByRegion,
                ),
                'co2e-distribuicao': toSource(
                    filtered.regions,
                    regionsError,
                    periodLabel,
                    buildCo2eByRegion,
                ),
                'status-servicos': toSource(
                    filtered.regions,
                    regionsError,
                    nowLabel,
                    buildServiceStatus,
                ),
                'top-emissores': toSource(
                    filtered.ranking,
                    rankingError,
                    periodLabel,
                    buildTopEmitters,
                ),
                'falhas-coleta': toSource(
                    filtered.failures,
                    failuresError,
                    nowLabel,
                    buildCollectionFailures,
                ),
                'ultimas-tentativas': toSource(
                    filtered.attempts,
                    attemptsError,
                    nowLabel,
                    buildLatestAttempts,
                ),
                'servicos-sem-metricas': toSource(
                    services,
                    servicesError,
                    nowLabel,
                    buildServicesWithoutMetrics,
                ),
                'co2e-por-regiao': toSource(
                    filtered.histories,
                    historiesError,
                    periodLabel,
                    (data) => buildEmissionSeries(data, range),
                ),
                'energia-no-tempo': toSource(
                    filtered.histories,
                    historiesError,
                    periodLabel,
                    (data) => buildEnergySeries(data, range),
                ),
            };
        }

        const all: Record<string, PainelWidgetSources> = { '': buildSources(undefined) };

        for (const code of regionCodes) {
            all[code] = buildSources(code);
        }

        return all;
    }, [
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
        regionCodes,
    ]);

    const getSource: PainelSourceGetter = useCallback(
        (widget) =>
            sourcesByRegion[widget.region ?? '']?.[getWidgetMetricId(widget)] ?? {
                status: 'empty',
            },
        [sourcesByRegion],
    );

    return { getSource, regionCodes };
}
