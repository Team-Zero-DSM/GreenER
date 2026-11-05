import { getRankingPeriod } from '@/components/ranking/rankingPeriod';
import type { RankingCriterion, RankingItem, RankingResponse } from '@/types/ranking';
import type { HistoryRange } from '@/types/service';

// Simulado até a integração (#104) com GET /api/v1/rankings.

// Quantidade de horas de cada período.
const RANGE_HOURS: Record<HistoryRange, number> = {
    '1h': 1,
    '6h': 6,
    '24h': 24,
    '7d': 7 * 24,
    '30d': 30 * 24,
};

// Totais fictícios de 24 horas, baseados no protótipo.
const MOCK_SERVICES: Omit<RankingItem, 'position'>[] = [
    {
        externalId: 'fraud-detector',
        name: 'Fraud Detector',
        region: { code: 'us-east', city: 'Ashburn' },
        energyKwh: 1.79,
        co2eGrams: 676.17,
        sampleCount: 2880,
    },
    {
        externalId: 'recommendation-ai',
        name: 'Recommendation AI',
        region: { code: 'eu-west', city: 'Dublin' },
        energyKwh: 2.06,
        co2eGrams: 606.77,
        sampleCount: 2880,
    },
    {
        externalId: 'checkout-worker',
        name: 'Checkout Worker',
        region: { code: 'us-east', city: 'Ashburn' },
        energyKwh: 1.19,
        co2eGrams: 448.18,
        sampleCount: 2880,
    },
    {
        externalId: 'audit-stream',
        name: 'Audit Stream',
        region: { code: 'jp-east', city: 'Tokyo' },
        energyKwh: 0.74742,
        co2eGrams: 347.55,
        sampleCount: 2880,
    },
    {
        externalId: 'billing-api',
        name: 'Billing API',
        region: { code: 'br-sudeste', city: 'São Paulo' },
        energyKwh: 1.35,
        co2eGrams: 114.82,
        sampleCount: 2880,
    },
    {
        externalId: 'email-dispatcher',
        name: 'Email Dispatcher',
        region: { code: 'br-sudeste', city: 'São Paulo' },
        energyKwh: 0.36221,
        co2eGrams: 30.79,
        sampleCount: 1930,
    },
    {
        externalId: 'reporting-batch',
        name: 'Reporting Batch',
        region: { code: 'ca-central', city: 'Toronto' },
        energyKwh: 0.44545,
        co2eGrams: 17.82,
        sampleCount: 1440,
    },
    {
        externalId: 'inventory-sync',
        name: 'Inventory Sync',
        region: { code: 'ca-central', city: 'Toronto' },
        energyKwh: 0.44212,
        co2eGrams: 17.68,
        sampleCount: 2880,
    },
    {
        externalId: 'legacy-importer',
        name: 'Legacy Importer',
        region: { code: 'eu-west', city: 'Dublin' },
        energyKwh: null,
        co2eGrams: null,
        sampleCount: 0,
    },
];

function scale(value: number | null, factor: number): number | null {
    return value === null ? null : Number((value * factor).toFixed(6));
}

export function getRankingMock(
    criterion: RankingCriterion,
    range: HistoryRange,
    to: string,
): RankingResponse {
    const factor = RANGE_HOURS[range] / 24;

    const items = MOCK_SERVICES.map((service) => ({
        ...service,
        energyKwh: scale(service.energyKwh, factor),
        co2eGrams: scale(service.co2eGrams, factor),
        sampleCount: Math.round(service.sampleCount * factor),
    }));

    // Mesma regra do backend: decrescente pelo critério e sem dados ao final.
    items.sort(
        (a, b) =>
            (b[criterion] ?? -1) - (a[criterion] ?? -1) || a.externalId.localeCompare(b.externalId),
    );

    return {
        criterion,
        range,
        period: getRankingPeriod(range, to),
        items: items.map((item, index) => ({
            position: item.sampleCount === 0 ? null : index + 1,
            ...item,
        })),
    };
}
