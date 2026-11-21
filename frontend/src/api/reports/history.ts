import { fetchServiceHistory } from '@/api/services';
import { aggregateHistory } from '@/lib/reports/aggregateHistory';
import type { ReportHistory } from '@/types/report';
import type { HistoryRange, ServiceHistory } from '@/types/service';

const CONCURRENCY = 6;
const MAX_POINTS = 120;

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
}

export async function loadReportHistory(
  serviceIds: string[],
  range: HistoryRange,
  signal?: AbortSignal,
): Promise<ReportHistory> {
  const histories: ServiceHistory[] = [];
  let failed = 0;

  for (let i = 0; i < serviceIds.length; i += CONCURRENCY) {
    throwIfAborted(signal);
    const batch = serviceIds.slice(i, i + CONCURRENCY);
    const results = await Promise.allSettled(batch.map((id) => fetchServiceHistory(id, range, MAX_POINTS)));
    for (const r of results) {
      if (r.status === 'fulfilled') histories.push(r.value);
      else failed += 1;
    }
  }
  throwIfAborted(signal);

  if (histories.length === 0 && failed > 0) {
    throw new Error('Não foi possível carregar o histórico dos serviços.');
  }
  return aggregateHistory(histories, range, failed);
}