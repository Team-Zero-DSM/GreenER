import type { HistoryRange, ServiceStatus } from '@/types/service';

export interface ReportRegion {
  code: string;
  name: string;
}

export interface ReportService {
  id: string;
  name: string;
  regionCode: string;
  status: ServiceStatus;
  updatedAt: string;
  energyKwh: number | null;
  co2eGrams: number | null;
}

export interface ReportFilters {
  statuses: ServiceStatus[];
  from: string;
  to: string;
}

export type StatusCounts = Record<ServiceStatus, number>;

export interface ReportTotals {
  total: number;
  byStatus: StatusCounts;
  energyKwh: number | null;
  co2eGrams: number | null;
}

export interface RegionSection extends ReportTotals {
  region: ReportRegion;
  services: ReportService[];
}

export interface ReportData extends ReportTotals {
  generatedAt: string;
  filters: ReportFilters;
  sections: RegionSection[];
}

export type ChartType = 'line' | 'bar';

export interface ReportChartOptions {
  enabled: boolean;
  type: ChartType;
  range: HistoryRange;
}

export interface ReportHistoryPoint {
  time: number;
  energyKwh: number;
  co2eGrams: number;
}

export interface ReportHistory {
  range: HistoryRange;
  from: number;
  to: number;
  custom: boolean;
  truncated: boolean;
  points: ReportHistoryPoint[];
  totalEnergyKwh: number | null;
  totalCo2eGrams: number | null;
  serviceCount: number;
  failedCount: number;
}

export interface HistoryWindow {
  from: number;
  to: number;
}

export interface HistoryQuery {
  range: HistoryRange;
  window?: HistoryWindow;
  truncated: boolean;
}