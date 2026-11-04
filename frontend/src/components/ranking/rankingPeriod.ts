import type { HistoryRange } from '@/types/service';

const RANGE_MS: Record<HistoryRange, number> = {
    '1h': 60 * 60 * 1000,
    '6h': 6 * 60 * 60 * 1000,
    '24h': 24 * 60 * 60 * 1000,
    '7d': 7 * 24 * 60 * 60 * 1000,
    '30d': 30 * 24 * 60 * 60 * 1000,
};

// Simulado até a integração (#104): o backend passará a informar o período usado.
export function getRankingPeriod(range: HistoryRange, to: string) {
    const from = new Date(new Date(to).getTime() - RANGE_MS[range]).toISOString();

    return { from, to };
}
