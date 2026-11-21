import { buildReport } from '@/lib/reports/buildReport';
import { RANGE_MS } from '@/lib/reports/historyRanges';
import type { ReportHistory, ReportRegion, ReportService } from '@/types/report';
import type { HistoryRange, ServiceStatus } from '@/types/service';
import type { ReportsApi } from './reportContract';

const REGIONS: ReportRegion[] = [
  { code: 'sa-east-1', name: 'sa-east-1 (Brasil)' },
  { code: 'us-east-1', name: 'us-east-1 (Estados Unidos)' },
  { code: 'eu-north-1', name: 'eu-north-1 (Suécia)' },
  { code: 'eu-west-3', name: 'eu-west-3 (França)' },
  { code: 'ap-south-1', name: 'ap-south-1 (Índia)' },
];

type Row = [string, string, string, ServiceStatus, string, number | null, number | null];

const ROWS: Row[] = [
  ['s1', 'api-gateway', 'sa-east-1', 'available', '2026-11-20', 1.82, 109.2],
  ['s2', 'auth-service', 'sa-east-1', 'available', '2026-11-20', 0.94, 56.4],
  ['s3', 'billing-worker', 'sa-east-1', 'unavailable', '2026-11-19', null, null],
  ['s4', 'checkout', 'us-east-1', 'available', '2026-11-20', 3.1, 1178],
  ['s5', 'search-index', 'us-east-1', 'available', '2026-11-18', 5.4, 2052],
  ['s6', 'notifications', 'us-east-1', 'metrics_missing', '2026-11-17', null, null],
  ['s7', 'data-pipeline', 'eu-north-1', 'available', '2026-11-20', 7.25, 217.5],
  ['s8', 'media-encoder', 'eu-north-1', 'available', '2026-11-16', 4.8, 144],
  ['s9', 'legacy-reports', 'eu-north-1', 'removed', '2026-10-02', null, null],
  ['s10', 'cms', 'eu-west-3', 'available', '2026-11-19', 1.35, 74.3],
  ['s11', 'email-relay', 'eu-west-3', 'available', '2026-11-12', 0.62, 34.1],
  ['s12', 'edge-cache', 'eu-west-3', 'unknown', '2026-10-18', null, null],
  ['s13', 'analytics', 'ap-south-1', 'available', '2026-11-20', 6.1, 4270],
  ['s14', 'image-resizer', 'ap-south-1', 'available', '2026-11-15', 2.45, 1715],
  ['s15', 'queue-broker', 'ap-south-1', 'unavailable', '2026-11-14', null, null],
];

const SERVICES: ReportService[] = ROWS.map(([id, name, regionCode, status, date, energyKwh, co2eGrams]) => ({
  id,
  name,
  regionCode,
  status,
  updatedAt: `${date}T12:00:00-03:00`,
  energyKwh,
  co2eGrams,
}));

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    if (signal?.aborted) return reject(new DOMException('Aborted', 'AbortError'));
    const timer = setTimeout(resolve, ms);
    signal?.addEventListener(
      'abort',
      () => {
        clearTimeout(timer);
        reject(new DOMException('Aborted', 'AbortError'));
      },
      { once: true },
    );
  });
}

const HISTORY_BUCKETS = 48;

const hash = (text: string) => [...text].reduce((acc, ch) => (acc * 31 + ch.charCodeAt(0)) >>> 0, 7);

function fakeHistory(serviceIds: string[], range: HistoryRange): ReportHistory {
  const to = Date.now();
  const from = to - RANGE_MS[range];
  const step = (to - from) / HISTORY_BUCKETS;
  const scale = step / 1_800_000;
  const points = Array.from({ length: HISTORY_BUCKETS }, (_, i) => ({
    time: from + i * step,
    energyKwh: 0,
    co2eGrams: 0,
  }));

  for (const id of serviceIds) {
    const h = hash(id);
    const base = (0.05 + (h % 100) / 1000) * scale;
    const phase = (h % 628) / 100;
    const intensity = 40 + (h % 400); // gCO2e por kWh
    points.forEach((p, i) => {
      const kwh = base * (1 + 0.5 * Math.sin(i / 6 + phase));
      p.energyKwh += kwh;
      p.co2eGrams += kwh * intensity;
    });
  }

  const has = serviceIds.length > 0;
  return {
    range,
    from,
    to,
    points,
    totalEnergyKwh: has ? points.reduce((a, p) => a + p.energyKwh, 0) : null,
    totalCo2eGrams: has ? points.reduce((a, p) => a + p.co2eGrams, 0) : null,
    serviceCount: serviceIds.length,
    failedCount: 0,
  };
}

export const mockReportsApi: ReportsApi = {
  async getRegions(signal) {
    await delay(150, signal);
    return REGIONS;
  },
  async getReport(filters, signal) {
    await delay(450, signal);
    return buildReport(SERVICES, REGIONS, filters);
  },
  async getHistory(serviceIds, range, signal) {
    await delay(350, signal);
    return fakeHistory(serviceIds, range);
  },
  async downloadPdf() {
    window.print();
  },
};