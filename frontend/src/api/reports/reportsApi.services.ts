import { fetchRegions } from '@/api/regions';
import { fetchServices } from '@/api/services';
import { buildReport } from '@/lib/reports/buildReport';
import { toReportRegions } from '@/lib/reports/regionLabel';
import type { ReportService } from '@/types/report';
import type { ServiceSummary } from '@/types/service';
import type { ReportsApi } from './reportContract';
import { loadReportHistory } from './history';

function toReportService(s: ServiceSummary): ReportService {
  return {
    id: s.id,
    name: s.name,
    regionCode: s.location?.regionCode ?? '',
    status: s.status,
    updatedAt: s.collectedAt ?? s.statusUpdatedAt ?? s.lastSeenAt,
    energyKwh: s.environmental?.energyKwh ?? null,
    co2eGrams: s.environmental?.co2eGrams ?? null,
  };
}

function throwIfAborted(signal?: AbortSignal) {
  if (signal?.aborted) throw new DOMException('Aborted', 'AbortError');
}

export const servicesReportsApi: ReportsApi = {
  async getRegions(signal) {
    const regions = await fetchRegions();
    throwIfAborted(signal);
    return toReportRegions(regions);
  },
  async getReport(filters, signal) {
    const [services, regions] = await Promise.all([fetchServices(), fetchRegions()]);
    throwIfAborted(signal);
    return buildReport(services.map(toReportService), toReportRegions(regions), filters);
  },
  getHistory(serviceIds, query, signal) {
    return loadReportHistory(serviceIds, query, signal);
  },
  async downloadPdf() {
    window.print();
  },
};