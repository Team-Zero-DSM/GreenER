import type { ReportData, ReportFilters, ReportHistory, ReportRegion } from '@/types/report';
import type { HistoryRange } from '@/types/service';

export interface ReportsApi {
  getRegions(signal?: AbortSignal): Promise<ReportRegion[]>;
  getReport(filters: ReportFilters, signal?: AbortSignal): Promise<ReportData>;
  getHistory(serviceIds: string[], range: HistoryRange, signal?: AbortSignal): Promise<ReportHistory>;
  downloadPdf(filters: ReportFilters): Promise<void>;
}