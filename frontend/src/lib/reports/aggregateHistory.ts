import type { ReportHistory } from '@/types/report';
import type { HistoryRange, ServiceHistory } from '@/types/service';
import { RANGE_MS } from './historyRanges';

const BUCKETS = 48;

function sumNullable(values: Array<number | null>): number | null {
  let total: number | null = null;
  for (const v of values) {
    if (v !== null) total = (total ?? 0) + v;
  }
  return total;
}

export function aggregateHistory(
  histories: ServiceHistory[],
  range: HistoryRange,
  failedCount: number,
  now: number = Date.now(),
): ReportHistory {
  const froms = histories.map((h) => Date.parse(h.period.from)).filter(Number.isFinite);
  const tos = histories.map((h) => Date.parse(h.period.to)).filter(Number.isFinite);
  const to = tos.length ? Math.max(...tos) : now;
  const from = froms.length ? Math.min(...froms) : to - RANGE_MS[range];
  const step = Math.max(to - from, 1) / BUCKETS;

  const points = Array.from({ length: BUCKETS }, (_, i) => ({
    time: from + i * step,
    energyKwh: 0,
    co2eGrams: 0,
  }));

  for (const h of histories) {
    for (const p of h.points) {
      const t = Date.parse(p.timestamp);
      if (!Number.isFinite(t)) continue;
      const i = Math.min(BUCKETS - 1, Math.max(0, Math.floor((t - from) / step)));
      points[i].energyKwh += p.energyKwh || 0;
      points[i].co2eGrams += p.co2eGrams || 0;
    }
  }

  return {
    range,
    from,
    to,
    points,
    totalEnergyKwh: sumNullable(histories.map((h) => h.summary.energyKwh)),
    totalCo2eGrams: sumNullable(histories.map((h) => h.summary.co2eGrams)),
    serviceCount: histories.length,
    failedCount,
  };
}