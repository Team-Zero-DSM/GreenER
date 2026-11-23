import type { MetricService } from '../../analytics/types/metrics-snapshot.types.js';
import type { Report } from '../types/reports.types.js';
import { summedMetrics, type Metric } from './theme.js';

// Totais do período: energia e emissões somadas, demais métricas como média ponderada
// pelo número de amostras de cada serviço.
export function metricTotal(services: MetricService[], metric: Metric) {
    const withData = services.filter((service) => service[metric] !== null);
    if (!withData.length) return null;
    if (summedMetrics.includes(metric)) {
        return withData.reduce((total, service) => total + (service[metric] ?? 0), 0);
    }
    const samples = withData.reduce((total, service) => total + service.samples, 0);
    if (!samples) return null;
    return (
        withData.reduce((total, service) => total + (service[metric] ?? 0) * service.samples, 0) /
        samples
    );
}

export function statusCounts(services: MetricService[]) {
    const counts = { available: 0, metrics_missing: 0, unavailable: 0 };
    for (const service of services) counts[service.status]++;
    return counts;
}

export function regionTotals(services: MetricService[], metric: Metric) {
    const regions = new Map<
        string,
        { code: string; name: string; intensity: number; services: number; value: number }
    >();
    for (const service of services) {
        const region = regions.get(service.regionCode) ?? {
            code: service.regionCode,
            name: service.region,
            intensity: service.intensity,
            services: 0,
            value: 0,
        };
        region.services++;
        region.value += service[metric] ?? 0;
        regions.set(service.regionCode, region);
    }
    return [...regions.values()].sort((a, b) => b.value - a.value);
}

// Métrica usada nos destaques: emissões, se escolhidas; senão energia; senão a primeira.
export function highlightMetric(report: Report): Metric {
    if (report.metrics.includes('carbon')) return 'carbon';
    if (report.metrics.includes('energy')) return 'energy';
    return report.metrics[0];
}

export const totalSamples = (report: Report) =>
    report.services.reduce((total, service) => total + service.samples, 0);
