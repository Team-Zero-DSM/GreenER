import { getAuthSession } from '@/api/session';
import { fetchRegions } from '@/api/regions';
import { postJson } from '@/api/client';
import { downloadBlob } from '@/lib/reports/download';
import { toReportRegions } from '@/lib/reports/regionLabel';
import type { ReportData, ReportFilters } from '@/types/report';
import type { ReportsApi } from './reportContract';
import { loadReportHistory } from './history';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

function toReportData(raw: unknown): ReportData {
    return raw as ReportData;
}

export const httpReportsApi: ReportsApi = {
    async getRegions() {
        return toReportRegions(await fetchRegions());
    },
    async getReport(filters: ReportFilters) {
        const raw = await postJson<ReportFilters, unknown>('/reports/preview', filters, {
            authenticated: true,
        });
        return toReportData(raw);
    },
    getHistory(serviceIds, query, signal) {
        return loadReportHistory(serviceIds, query, signal);
    },
    async downloadPdf(filters: ReportFilters) {
        const session = getAuthSession();
        if (!session?.token) throw new Error('Sessão não encontrada. Faça login novamente.');

        const res = await fetch(`${API_URL}/api/v1/reports/pdf`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/pdf',
                Authorization: `Bearer ${session.token}`,
            },
            body: JSON.stringify(filters),
        });
        if (!res.ok) throw new Error(`Falha ao gerar o PDF (HTTP ${res.status})`);

        downloadBlob(await res.blob(), `relatorio-${new Date().toISOString().slice(0, 10)}.pdf`);
    },
};
