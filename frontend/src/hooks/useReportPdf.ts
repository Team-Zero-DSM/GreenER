import { useCallback, useEffect, useState } from 'react';
import { reportsApi } from '@/api/reports/reportIndex';
import type { ReportPdfRequest } from '@/types/report';

interface PdfFile {
    blob: Blob;
    filename: string;
}

interface Settled {
    request: ReportPdfRequest;
    attempt: number;
    file: PdfFile | null;
    error: string | null;
}

export function useReportPdf(request: ReportPdfRequest | null) {
    const [settled, setSettled] = useState<Settled | null>(null);
    const [attempt, setAttempt] = useState(0);

    useEffect(() => {
        if (!request) return;
        const controller = new AbortController();

        // Aguarda as alterações rápidas nos filtros antes de gerar outro arquivo.
        const timer = window.setTimeout(() => {
            reportsApi
                .getPdf(request, controller.signal)
                .then((blob) => {
                    if (controller.signal.aborted) return;
                    setSettled({
                        request,
                        attempt,
                        file: {
                            blob,
                            filename: `GreenER-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`,
                        },
                        error: null,
                    });
                })
                .catch((error: unknown) => {
                    if (controller.signal.aborted) return;
                    setSettled({
                        request,
                        attempt,
                        file: null,
                        error: error instanceof Error ? error.message : 'Erro desconhecido',
                    });
                });
        }, 300);

        return () => {
            window.clearTimeout(timer);
            controller.abort();
        };
    }, [request, attempt]);

    // Um arquivo anterior nunca deve aparecer ou ser exportado com filtros novos.
    const current =
        request && settled?.request === request && settled.attempt === attempt ? settled : null;
    const status = !request ? 'idle' : !current ? 'loading' : current.error ? 'error' : 'ready';
    const reload = useCallback(() => setAttempt((value) => value + 1), []);

    return { file: current?.file ?? null, error: current?.error ?? null, status, reload };
}
