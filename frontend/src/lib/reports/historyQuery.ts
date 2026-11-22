import type { HistoryQuery } from '@/types/report';
import type { HistoryRange } from '@/types/service';
import { HISTORY_RANGES, RANGE_MS } from './historyRanges';

interface Input {
  range: HistoryRange;
  from: string;
  to: string;
}

export function resolveHistoryQuery({ range, from, to }: Input, now: number): HistoryQuery {
  if (!from && !to) return { range, truncated: false };

  const end = Math.min(to ? new Date(`${to}T23:59:59.999`).getTime() : now, now);
  const start = from ? new Date(`${from}T00:00:00`).getTime() : end - RANGE_MS[range];

  const covering = HISTORY_RANGES.find((r) => RANGE_MS[r] >= now - start);
  const truncated = covering === undefined;
  const windowFrom = truncated ? now - RANGE_MS['30d'] : start;

  return {
    range: covering ?? '30d',
    window: { from: windowFrom, to: Math.max(end, windowFrom + 1) },
    truncated,
  };
}