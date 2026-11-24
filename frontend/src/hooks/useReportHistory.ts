import { useCallback, useEffect, useState } from 'react';
import { reportsApi } from '@/api/reports/reportIndex';
import { resolveHistoryQuery } from '@/lib/reports/historyQuery';
import type { ReportHistory } from '@/types/report';
import type { HistoryRange } from '@/types/service';

type Status = 'loading' | 'ready' | 'error';

interface Settled {
    ids: string[];
    range: HistoryRange;
    from: string;
    to: string;
    attempt: number;
    error: string | null;
}

export function useReportHistory(
    serviceIds: string[],
    range: HistoryRange,
    from: string,
    to: string,
    enabled: boolean,
) {
    const [data, setData] = useState<ReportHistory | null>(null);
    const [settled, setSettled] = useState<Settled | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!enabled || serviceIds.length === 0) return;
        const ctrl = new AbortController();
        const query = resolveHistoryQuery({ range, from, to }, Date.now());
        reportsApi
            .getHistory(serviceIds, query, ctrl.signal)
            .then((history: ReportHistory) => {
                if (ctrl.signal.aborted) return;
                setData(history);
                setSettled({ ids: serviceIds, range, from, to, attempt, error: null });
            })
            .catch((err: unknown) => {
                if (ctrl.signal.aborted) return;
                setSettled({
                    ids: serviceIds,
                    range,
                    from,
                    to,
                    attempt,
                    error: err instanceof Error ? err.message : 'Erro desconhecido',
                });
            });
        return () => ctrl.abort();
    }, [serviceIds, range, from, to, enabled, attempt]);

    const current =
        settled?.ids === serviceIds &&
        settled.range === range &&
        settled.from === from &&
        settled.to === to &&
        settled.attempt === attempt
            ? settled
            : null;
    const idle = !enabled || serviceIds.length === 0;
    const status: Status = idle
        ? 'ready'
        : current === null
          ? 'loading'
          : current.error !== null
            ? 'error'
            : 'ready';
    const error = current?.error ?? null;

    const reload = useCallback(() => setAttempt((a) => a + 1), []);

    return { data, status, error, reload };
}
