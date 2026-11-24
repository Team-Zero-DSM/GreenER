import type {
    RegionSection,
    ReportData,
    ReportFilters,
    ReportRegion,
    ReportService,
    ReportTotals,
    StatusCounts,
} from '@/types/report';
import { REPORT_STATUSES, STATUS_ORDER } from '@/utils/reportStatusMeta';

function emptyCounts(): StatusCounts {
    return Object.fromEntries(STATUS_ORDER.map((s) => [s, 0])) as StatusCounts;
}

function sum(list: ReportService[], pick: (s: ReportService) => number | null): number | null {
    let total: number | null = null;
    for (const s of list) {
        const value = pick(s);
        if (value !== null) total = (total ?? 0) + value;
    }
    return total;
}

export function summarize(list: ReportService[]): ReportTotals {
    const byStatus = emptyCounts();
    for (const s of list) byStatus[s.status] += 1;
    return {
        total: list.length,
        byStatus,
        energyKwh: sum(list, (s) => s.energyKwh),
        co2eGrams: sum(list, (s) => s.co2eGrams),
    };
}

export function buildReport(
    services: ReportService[],
    regions: ReportRegion[],
    filters: ReportFilters,
    now: Date = new Date(),
): ReportData {
    const statusSet = new Set(filters.statuses.length > 0 ? filters.statuses : REPORT_STATUSES);
    const from = filters.from ? new Date(`${filters.from}T00:00:00`).getTime() : -Infinity;
    const to = filters.to ? new Date(`${filters.to}T23:59:59.999`).getTime() : Infinity;

    const matches = services.filter((s) => {
        const t = new Date(s.updatedAt).getTime();
        return statusSet.has(s.status) && t >= from && t <= to;
    });

    const known = new Set(regions.map((r) => r.code));
    const groups = regions.map((region) => ({
        region,
        list: matches.filter((s) => s.regionCode === region.code),
    }));
    const orphans = matches.filter((s) => !known.has(s.regionCode));
    if (orphans.length > 0)
        groups.push({ region: { code: 'none', name: 'Sem região' }, list: orphans });

    const sections: RegionSection[] = groups
        .map(({ region, list }) => {
            const sorted = [...list].sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
            return { region, ...summarize(sorted), services: sorted };
        })
        .filter((section) => section.total > 0);

    return { generatedAt: now.toISOString(), filters, ...summarize(matches), sections };
}
