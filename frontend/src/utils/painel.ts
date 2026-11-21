import type { CollectionStatusResponse } from '@/api/collection-status';
import type { PainelRegionsData, PainelServiceHistory } from '@/api/painel';
import type { Region } from '@/types/api';
import type { PainelWidgetContent } from '@/types/painel';
import type { RankingResponse } from '@/types/ranking';
import type { HistoryRange, ServiceSummary } from '@/types/service';

// Funções que convertem as respostas do backend no conteúdo de cada widget do
// painel. Devolvem null quando não há dados, e o widget mostra "sem dados".

const MAX_SERIES = 5;
const TOP_EMITTERS = 5;
const MAX_FAILURES = 5;
const MAX_ATTEMPTS = 8;

// Soma um total das regiões. Fica null quando nenhuma região tem valor no período.
function sumRegions(regions: readonly Region[], key: 'energyKwh' | 'co2eGrams'): number | null {
    const values = regions.map((region) => region[key]).filter((value) => value !== null);

    return values.length > 0 ? values.reduce((sum, value) => sum + value, 0) : null;
}

function formatGrams(grams: number): string {
    return grams >= 1000
        ? `${(grams / 1000).toLocaleString('pt-BR', { maximumFractionDigits: 2 })} kg`
        : `${grams.toLocaleString('pt-BR', { maximumFractionDigits: 1 })} g`;
}

// "há 5 min", "há 3 h", "há 2 d".
function formatElapsed(timestamp: string, now: number): string {
    const minutes = Math.max(0, Math.round((now - new Date(timestamp).getTime()) / 60_000));

    if (minutes < 1) return 'agora';
    if (minutes < 60) return `há ${minutes} min`;
    if (minutes < 60 * 24) return `há ${Math.round(minutes / 60)} h`;

    return `há ${Math.round(minutes / (60 * 24))} d`;
}

export function buildCo2eKpi({ current, previous }: PainelRegionsData): PainelWidgetContent | null {
    const grams = sumRegions(current, 'co2eGrams');

    if (grams === null) return null;

    // A partir de 1 kg o indicador troca de unidade, e o período anterior acompanha.
    const inKilograms = grams >= 1000;
    const divisor = inKilograms ? 1000 : 1;
    const previousGrams = sumRegions(previous, 'co2eGrams');

    return {
        type: 'kpi',
        data: {
            label: 'Emissão total',
            value: grams / divisor,
            unit: inKilograms ? 'kg CO₂e' : 'g CO₂e',
            previousValue: previousGrams === null ? null : previousGrams / divisor,
            lowerIsBetter: true,
            fractionDigits: inKilograms ? 2 : 1,
        },
    };
}

export function buildEnergyKpi({
    current,
    previous,
}: PainelRegionsData): PainelWidgetContent | null {
    const energy = sumRegions(current, 'energyKwh');

    if (energy === null) return null;

    return {
        type: 'kpi',
        data: {
            label: 'Energia consumida',
            value: energy,
            unit: 'kWh',
            previousValue: sumRegions(previous, 'energyKwh'),
            lowerIsBetter: true,
            fractionDigits: energy >= 100 ? 0 : 2,
        },
    };
}

// Intensidade média ponderada: todo o CO₂e do período dividido por toda a energia.
function carbonIntensity(regions: readonly Region[]): number | null {
    const grams = sumRegions(regions, 'co2eGrams');
    const energy = sumRegions(regions, 'energyKwh');

    return grams === null || energy === null || energy === 0 ? null : grams / energy;
}

export function buildCarbonIntensityKpi({
    current,
    previous,
}: PainelRegionsData): PainelWidgetContent | null {
    const intensity = carbonIntensity(current);

    if (intensity === null) return null;

    return {
        type: 'kpi',
        data: {
            label: 'Média ponderada',
            value: intensity,
            unit: 'g CO₂e/kWh',
            previousValue: carbonIntensity(previous),
            lowerIsBetter: true,
            fractionDigits: 0,
        },
    };
}

function countStatuses(regions: readonly Region[]) {
    return regions.reduce(
        (total, region) => ({
            available: total.available + region.statusCounts.available,
            unavailable: total.unavailable + region.statusCounts.unavailable,
            metricsMissing: total.metricsMissing + region.statusCounts.metricsMissing,
        }),
        { available: 0, unavailable: 0, metricsMissing: 0 },
    );
}

// Parcela dos serviços que está disponível agora. O backend só informa a
// situação atual, então este indicador não tem período anterior para comparar.
export function buildAvailabilityKpi({ current }: PainelRegionsData): PainelWidgetContent | null {
    const counts = countStatuses(current);
    const total = counts.available + counts.unavailable + counts.metricsMissing;

    if (total === 0) return null;

    return {
        type: 'kpi',
        data: {
            label: `${counts.available} de ${total} serviços disponíveis`,
            value: (counts.available / total) * 100,
            unit: '%',
            previousValue: null,
            lowerIsBetter: false,
        },
    };
}

export function buildServiceStatus({ current }: PainelRegionsData): PainelWidgetContent | null {
    const counts = countStatuses(current);

    if (counts.available + counts.unavailable + counts.metricsMissing === 0) return null;

    return { type: 'status', data: counts };
}

// Divide um total entre as regiões, da maior para a menor. Além das maiores, o
// resto vira "Outras".
function buildRegionDistribution(
    regions: readonly Region[],
    key: 'energyKwh' | 'co2eGrams',
    unit: string,
): PainelWidgetContent | null {
    const shares = regions
        .map((region) => ({ label: region.code, value: region[key] ?? 0 }))
        .filter((region) => region.value > 0)
        .sort((a, b) => b.value - a.value);

    if (shares.length === 0) return null;

    const items =
        shares.length > MAX_SERIES
            ? [
                  ...shares.slice(0, MAX_SERIES - 1),
                  {
                      label: 'Outras',
                      value: shares
                          .slice(MAX_SERIES - 1)
                          .reduce((sum, region) => sum + region.value, 0),
                  },
              ]
            : shares;

    return { type: 'distribuicao', data: { unit, items } };
}

export function buildEnergyByRegion({ current }: PainelRegionsData): PainelWidgetContent | null {
    return buildRegionDistribution(current, 'energyKwh', 'kWh');
}

export function buildCo2eByRegion({ current }: PainelRegionsData): PainelWidgetContent | null {
    return buildRegionDistribution(current, 'co2eGrams', 'g CO₂e');
}

export function buildTopEmitters(ranking: RankingResponse): PainelWidgetContent | null {
    const emitters = ranking.items
        .filter((item) => item.position !== null && item.co2eGrams !== null)
        .slice(0, TOP_EMITTERS);

    if (emitters.length === 0) return null;

    return {
        type: 'tabela',
        data: {
            columns: [
                { key: 'posicao', label: '#' },
                { key: 'servico', label: 'Serviço' },
                { key: 'regiao', label: 'Região' },
                { key: 'co2e', label: 'CO₂e', align: 'right' },
            ],
            rows: emitters.map((item) => ({
                id: item.externalId,
                cells: {
                    posicao: String(item.position),
                    servico: item.name,
                    regiao: item.region.code,
                    co2e: formatGrams(item.co2eGrams ?? 0),
                },
            })),
        },
    };
}

export function buildCollectionFailures(
    statuses: CollectionStatusResponse,
): PainelWidgetContent | null {
    const failed = statuses.items.slice(0, MAX_FAILURES);

    if (failed.length === 0) return null;

    const now = Date.now();

    return {
        type: 'tabela',
        data: {
            columns: [
                { key: 'servico', label: 'Serviço' },
                { key: 'motivo', label: 'Motivo' },
                { key: 'quando', label: 'Quando', align: 'right' },
            ],
            rows: failed.map((item) => ({
                id: item.externalId,
                cells: {
                    servico: item.name,
                    motivo: item.latestAttempt?.description ?? 'Falha na coleta',
                    quando: item.latestAttempt
                        ? formatElapsed(item.latestAttempt.observedAt, now)
                        : '—',
                },
            })),
        },
    };
}

// Serviços que estão no ar, mas sem enviar métricas.
export function buildServicesWithoutMetrics(
    services: readonly ServiceSummary[],
): PainelWidgetContent | null {
    const missing = services.filter((service) => service.status === 'metrics_missing');

    if (missing.length === 0) return null;

    const now = Date.now();

    return {
        type: 'tabela',
        data: {
            columns: [
                { key: 'servico', label: 'Serviço' },
                { key: 'regiao', label: 'Região' },
                { key: 'visto', label: 'Visto', align: 'right' },
            ],
            rows: missing.map((service) => ({
                id: service.id,
                cells: {
                    servico: service.name,
                    regiao: service.location?.regionCode ?? '—',
                    visto: formatElapsed(service.lastSeenAt, now),
                },
            })),
        },
    };
}

const ATTEMPT_RESULT_LABELS = {
    success: 'Sucesso',
    failure: 'Falha',
    pending: 'Pendente',
} as const;

// Tentativa de coleta mais recente de cada serviço, da mais nova para a mais antiga.
export function buildLatestAttempts(
    statuses: CollectionStatusResponse,
): PainelWidgetContent | null {
    const attempts = statuses.items
        .filter((item) => item.latestAttempt !== null)
        .sort(
            (a, b) =>
                new Date(b.latestAttempt?.observedAt ?? 0).getTime() -
                new Date(a.latestAttempt?.observedAt ?? 0).getTime(),
        )
        .slice(0, MAX_ATTEMPTS);

    if (attempts.length === 0) return null;

    const now = Date.now();

    return {
        type: 'tabela',
        data: {
            columns: [
                { key: 'servico', label: 'Serviço' },
                { key: 'resultado', label: 'Resultado' },
                { key: 'quando', label: 'Quando', align: 'right' },
            ],
            rows: attempts.map((item) => ({
                id: item.externalId,
                cells: {
                    servico: item.name,
                    resultado: ATTEMPT_RESULT_LABELS[item.result],
                    quando: formatElapsed(item.latestAttempt?.observedAt ?? '', now),
                },
            })),
        },
    };
}

// Rótulo do eixo do tempo: hora nos períodos de até um dia, data nos mais longos.
function formatSeriesLabel(timestamp: string, range: HistoryRange): string {
    const date = new Date(timestamp);

    return range === '7d' || range === '30d'
        ? date.toLocaleString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              day: '2-digit',
              month: '2-digit',
              // Em 7 dias cabem várias faixas por dia; a hora evita rótulos repetidos.
              ...(range === '7d' ? { hour: '2-digit' as const } : {}),
          })
        : date.toLocaleTimeString('pt-BR', {
              timeZone: 'America/Sao_Paulo',
              hour: '2-digit',
              minute: '2-digit',
          });
}

interface SeriesGrid {
    start: number;
    stepMs: number;
}

// Grade de tempo comum: começo e tamanho das faixas do primeiro histórico com pontos.
function seriesGrid(histories: readonly PainelServiceHistory[]): SeriesGrid | null {
    const reference = histories.find(({ history }) => history.points.length > 0)?.history;
    if (!reference) return null;

    const start = new Date(reference.points[0].timestamp).getTime();
    const second = reference.points[1] ? new Date(reference.points[1].timestamp).getTime() : NaN;
    const stepMs =
        reference.bucketSeconds && reference.bucketSeconds > 0
            ? reference.bucketSeconds * 1000
            : second - start;

    return Number.isFinite(stepMs) && stepMs > 0 ? { start, stepMs } : null;
}

function alignToGrid(time: number, grid: SeriesGrid | null): number {
    if (!grid) return time;
    return grid.start + Math.round((time - grid.start) / grid.stepMs) * grid.stepMs;
}

// Soma o valor dos serviços por região em cada faixa de tempo. Ficam no gráfico
// as regiões com os maiores totais no período.
function buildRegionSeries(
    histories: readonly PainelServiceHistory[],
    range: HistoryRange,
    key: 'co2eGrams' | 'energyKwh',
    unit: string,
): PainelWidgetContent | null {
    const totals = new Map<string, number>();
    const buckets = new Map<number, Record<string, number>>();

    // Cada serviço é buscado num instante um pouco diferente, então as faixas de um
    // começam alguns milissegundos depois das do outro. Encaixa todas na grade do
    // primeiro histórico para que a mesma faixa some todas as regiões.
    const grid = seriesGrid(histories);

    for (const { service, history } of histories) {
        const region = service.location?.regionCode ?? 'sem-região';

        for (const point of history.points) {
            const time = alignToGrid(new Date(point.timestamp).getTime(), grid);
            const bucket = buckets.get(time) ?? {};

            bucket[region] = (bucket[region] ?? 0) + point[key];
            buckets.set(time, bucket);
            totals.set(region, (totals.get(region) ?? 0) + point[key]);
        }
    }

    if (buckets.size === 0) return null;

    const regions = [...totals.entries()]
        .sort((a, b) => b[1] - a[1])
        .slice(0, MAX_SERIES)
        .map(([region]) => region);

    const points = [...buckets.entries()]
        .sort((a, b) => a[0] - b[0])
        .map(([time, bucket]) => ({
            label: formatSeriesLabel(new Date(time).toISOString(), range),
            // Região sem coleta na faixa entra como zero para a série não quebrar.
            values: Object.fromEntries(regions.map((region) => [region, bucket[region] ?? 0])),
        }));

    return {
        type: 'serie-temporal',
        data: {
            unit,
            series: regions.map((region) => ({ key: region, label: region })),
            points,
        },
    };
}

export function buildEmissionSeries(
    histories: readonly PainelServiceHistory[],
    range: HistoryRange,
): PainelWidgetContent | null {
    return buildRegionSeries(histories, range, 'co2eGrams', 'g CO₂e');
}

export function buildEnergySeries(
    histories: readonly PainelServiceHistory[],
    range: HistoryRange,
): PainelWidgetContent | null {
    return buildRegionSeries(histories, range, 'energyKwh', 'kWh');
}
