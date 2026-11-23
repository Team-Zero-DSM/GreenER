import { fetchRegions } from '@/api/regions';
import { postJson } from '@/api/client';
import { toReportRegions } from '@/lib/reports/regionLabel';
import type { ReportData, ReportFilters } from '@/types/report';
import type { ReportsApi } from './reportContract';
import { loadReportHistory } from './history';
import { downloadReportPdf } from './reportPdf';

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
    downloadPdf: downloadReportPdf,
};
