import { getAuthSession } from '@/api/session';
import { downloadBlob } from '@/lib/reports/download';
import type { ReportPdfRequest } from '@/types/report';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

// Baixa o PDF montado pelo backend com a identidade visual do GreenER.
export async function downloadReportPdf(request: ReportPdfRequest) {
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
    });
    if (!res.ok) throw new Error(`Falha ao gerar o PDF (HTTP ${res.status})`);

    downloadBlob(
        await res.blob(),
        `GreenER-relatorio-${new Date().toISOString().slice(0, 10)}.pdf`,
    );
}
