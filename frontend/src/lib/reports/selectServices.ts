import { summarize } from '@/lib/reports/buildReport';
import type { ReportData } from '@/types/report';

export function selectServices(report: ReportData, excluded: ReadonlySet<string>): ReportData {
    if (excluded.size === 0) return report;

    const sections = report.sections
        .map((section) => {
            const services = section.services.filter((s) => !excluded.has(s.id));
            return { ...section, ...summarize(services), services };
        })
        .filter((section) => section.services.length > 0);

    return { ...report, ...summarize(sections.flatMap((s) => s.services)), sections };
}
