import { getAuthSession } from '@/api/session';
import type { ReportPdfRequest } from '@/types/report';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

// Retorna o mesmo arquivo para a prévia e o download.
export async function getReportPdf(request: ReportPdfRequest, signal?: AbortSignal): Promise<Blob> {
    const session = getAuthSession();
    if (!session?.token) throw new Error('Sessão não encontrada. Faça login novamente.');

    const res = await fetch(`${API_URL}/api/v1/reports/pdf`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Accept: 'application/pdf',
            Authorization: `Bearer ${session.token}`,
        },
        body: JSON.stringify(request),
        signal,
    });
    if (!res.ok) throw new Error(`Falha ao gerar o PDF (HTTP ${res.status})`);

    return res.blob();
}
