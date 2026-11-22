import { useCallback, useEffect, useState } from 'react';
import { reportsApi } from '@/api/reports/reportIndex';
import type { ReportData, ReportFilters } from '@/types/report';

type Status = 'loading' | 'ready' | 'error';

interface Settled {
    filters: ReportFilters;
    attempt: number;
    error: string | null;
}

export function useReport(filters: ReportFilters) {
    const [data, setData] = useState<ReportData | null>(null);
    const [settled, setSettled] = useState<Settled | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        const ctrl = new AbortController();
        reportsApi
            .getReport(filters, ctrl.signal)
            .then((report: ReportData) => {
                if (ctrl.signal.aborted) return;
                setData(report);
                setSettled({ filters, attempt, error: null });
            })
            .catch((err: unknown) => {
                if (ctrl.signal.aborted) return;
                setSettled({
                    filters,
                    attempt,
                    error: err instanceof Error ? err.message : 'Erro desconhecido',
                });
            });
        return () => ctrl.abort();
    }, [filters, attempt]);

    const current = settled?.filters === filters && settled.attempt === attempt ? settled : null;
    const status: Status =
        current === null ? 'loading' : current.error !== null ? 'error' : 'ready';
    const error = current?.error ?? null;

    const reload = useCallback(() => setAttempt((a) => a + 1), []);

    return { data, status, error, reload };
}
