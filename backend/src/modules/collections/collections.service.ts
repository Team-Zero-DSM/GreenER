import { getServices, getMetrics } from '../../integrations/metrics-api.js';
import type { MetricsService, MetricsResponse } from '../../integrations/metrics-api.schema.js';
import { ExternalApiError } from '../../shared/errors/external-api-error.js';

export type ProcessedMetrics = {
    cpuPercent: number;
    memoryGb: number;
    diskGb: number;
    networkGb: number;
    collectionIntervalSeconds: number;
    collectionIntervalHours: number;
};

export function processMetrics(raw: MetricsResponse): ProcessedMetrics {
    return {
        cpuPercent: raw.metrics.cpu_percent,
        memoryGb: raw.metrics.memory_gb,
        diskGb: raw.metrics.disk_gb,
        networkGb: raw.metrics.network_gb,
        collectionIntervalSeconds: raw.collection_interval_seconds,
        collectionIntervalHours: raw.collection_interval_seconds / 3600,
    };
}

export type CollectionResult = {
    serviceId: string;
    metrics: ProcessedMetrics;
    collectedAt: Date;
};

export async function collectService(service: MetricsService): Promise<CollectionResult> {
    const raw = await getMetrics(service.metrics_path);
    return {
        serviceId: service.id,
        metrics: processMetrics(raw),
        collectedAt: new Date(),
    };
}

export async function runCollectionRound(): Promise<CollectionResult[]> {
    const services = await getServices();

    const outcomes = await Promise.allSettled(services.map((service) => collectService(service)));

    const results: CollectionResult[] = [];
    outcomes.forEach((outcome, i) => {
        if (outcome.status === 'fulfilled') {
            results.push(outcome.value);
        } else {
            const reason = outcome.reason;
            const detail =
                reason instanceof ExternalApiError
                    ? `${reason.kind}: ${reason.message}`
                    : `inesperado: ${String(reason)}`;
            console.error(`[collection] falha em ${services[i].id} -> ${detail}`);
        }
    });
    return results;
}
