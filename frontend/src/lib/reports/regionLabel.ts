import type { Region } from '@/types/api';
import type { ReportRegion } from '@/types/report';

export function regionLabel(region: Region): string {
  return `${region.region} (${region.country})`;
}

export function toReportRegions(regions: Region[]): ReportRegion[] {
  return regions.map((r) => ({ code: r.code, name: regionLabel(r) }));
}