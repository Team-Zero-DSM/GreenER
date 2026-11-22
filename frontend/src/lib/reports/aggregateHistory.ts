import type { HistoryQuery, ReportHistory } from '@/types/report';
import type { ServiceHistory } from '@/types/service';
import { RANGE_MS } from './historyRanges';

const MAX_BUCKETS = 48;
const MIN_BUCKETS = 6;

interface Options {
    query: HistoryQuery;
    failedCount: number;
    maxPoints: number;
    now?: number;
}

function sumNullable(values: Array<number | null>): number | null {
    let total: number | null = null;
    for (const v of values) {
        if (v !== null) total = (total ?? 0) + v;
    }
    return total;
}

export function aggregateHistory(
    histories: ServiceHistory[],
    { query, failedCount, maxPoints, now = Date.now() }: Options,
): ReportHistory {
    const { range, window, truncated } = query;

    let from: number;
    let to: number;
    if (window) {
        from = window.from;
        to = window.to;
    } else {
        const froms = histories.map((h) => Date.parse(h.period.from)).filter(Number.isFinite);
        const tos = histories.map((h) => Date.parse(h.period.to)).filter(Number.isFinite);
        to = tos.length ? Math.max(...tos) : now;
        from = froms.length ? Math.min(...froms) : to - RANGE_MS[range];
    }

    const span = Math.max(to - from, 1);
    const apiBucket = RANGE_MS[range] / maxPoints;
    const count = Math.min(MAX_BUCKETS, Math.max(MIN_BUCKETS, Math.floor(span / (2 * apiBucket))));
    const step = span / count;

    const points = Array.from({ length: count }, (_, i) => ({
        time: from + i * step,
        energyKwh: 0,
        co2eGrams: 0,
    }));

    for (const h of histories) {
        for (const p of h.points ?? []) {
            const t = Date.parse(p.timestamp);
            if (!Number.isFinite(t)) continue;
            if (window && (t < from || t > to)) continue;
            const i = Math.min(count - 1, Math.max(0, Math.floor((t - from) / step)));
            points[i].energyKwh += p.energyKwh || 0;
            points[i].co2eGrams += p.co2eGrams || 0;
        }
    }

    const hasData = histories.length > 0;
    const totalEnergyKwh = window
        ? hasData
            ? points.reduce((a, p) => a + p.energyKwh, 0)
            : null
        : sumNullable(histories.map((h) => h.summary.energyKwh));
    const totalCo2eGrams = window
        ? hasData
            ? points.reduce((a, p) => a + p.co2eGrams, 0)
            : null
        : sumNullable(histories.map((h) => h.summary.co2eGrams));

    return {
        range,
        from,
        to,
        custom: Boolean(window),
        truncated,
        points,
        totalEnergyKwh,
        totalCo2eGrams,
        serviceCount: histories.length,
        failedCount,
    };
}
