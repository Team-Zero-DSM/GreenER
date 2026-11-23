import type {
    HistoryQuery,
    ReportData,
    ReportFilters,
    ReportHistory,
    ReportPdfRequest,
    ReportRegion,
} from '@/types/report';

export interface ReportsApi {
    getRegions(signal?: AbortSignal): Promise<ReportRegion[]>;
    getReport(filters: ReportFilters, signal?: AbortSignal): Promise<ReportData>;
    getHistory(
        serviceIds: string[],
        query: HistoryQuery,
        signal?: AbortSignal,
    ): Promise<ReportHistory>;
    getPdf(request: ReportPdfRequest, signal?: AbortSignal): Promise<Blob>;
}
