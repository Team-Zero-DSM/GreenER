import { CarbonClient } from '../../integrations/carbon-api.js';
import type { RegionsResponse } from '../../integrations/carbon-api.schema.js';
import { MetricsClient } from '../../integrations/metrics-api.js';
import type { MetricsResponse, MetricsService } from '../../integrations/metrics-api.schema.js';
import { ExternalApiError } from '../../shared/errors/external-api-error.js';
import { CollectionsRepository } from './collections.repository.js';
import type {
    ActiveService,
    Emissions,
    EstimateParameter,
    ProcessedMetrics,
    ServiceStatus,
} from './collections.types.js';

export class CollectionsService {
    constructor(
        private readonly repository: CollectionsRepository,
        private readonly carbon: CarbonClient,
        private readonly metrics: MetricsClient,
    ) {}

    async syncRegions(): Promise<void> {
        let response: RegionsResponse;
        try {
            response = await this.carbon.getRegions();
        } catch (err) {
            if (err instanceof ExternalApiError) {
                console.warn(
                    `[sync-regions] falha na API de carbono (${err.kind}), mantendo regiões já salvas`,
                );
                return;
            }
            throw err;
        }

        for (const region of response.regions) {
            try {
                if (await this.repository.existsByCode(region.code)) {
                    await this.repository.updateRegion(region);
                } else {
                    await this.repository.createRegion(region);
                }
            } catch (err) {
                console.error(`Falha ao sincronizar região ${region.code}:`, err);
            }
        }
    }

    async syncServices(): Promise<void> {
        let services: MetricsService[];
        try {
            services = await this.metrics.getServices();
        } catch (err) {
            if (err instanceof ExternalApiError) {
                console.warn(
                    `[sync-services] falha na API de métricas (${err.kind}), mantendo serviços já salvos`,
                );
                return;
            }
            throw err;
        }

        for (const service of services) {
            try {
                if (await this.repository.existsServiceByExternalId(service.id)) {
                    await this.repository.updateServiceRegion(
                        service.id,
                        service.location.region_code,
                    );
                } else {
                    await this.repository.createService(service);
                }
            } catch (err) {
                console.error(`Falha ao sincronizar serviço ${service.id}:`, err);
            }
        }
    }

    async runCollectionRound(): Promise<number> {
        const params = await this.repository.findActiveEstimateParameter();
        if (!params) throw new Error('Nenhum parâmetro de estimativa ativo');

        const services = await this.repository.findActiveServices();
        const outcomes = await Promise.allSettled(
            services.map((service) => this.collectService(service, params)),
        );

        let collected = 0;
        outcomes.forEach((outcome, i) => {
            if (outcome.status === 'fulfilled') {
                collected++;
                return;
            }
            const reason = outcome.reason;
            const detail =
                reason instanceof ExternalApiError
                    ? `${reason.kind}${reason.status ? ` ${reason.status}` : ''}: ${reason.message}`
                    : `inesperado: ${String(reason)}`;
            console.error(`[collection] falha em ${services[i].external_id} -> ${detail}`);
        });
        return collected;
    }

    private async collectService(service: ActiveService, params: EstimateParameter): Promise<void> {
        try {
            const raw = await this.metrics.getMetrics(service.metrics_path);
            const metrics = this.processMetrics(raw);
            const e = this.calculateEmissions(metrics, params, service.carbon_intensity);

            await this.repository.createCollection({
                service_id: service.id,
                estimate_parameter_id: params.id,
                metric_interval_seconds: metrics.collectionIntervalSeconds,
                cpu_percent: metrics.cpuPercent,
                memory_gb: metrics.memoryGb,
                disk_gb: metrics.diskGb,
                network_gb: metrics.networkGb,
                cpu_watts: e.cpuWatts,
                memory_watts: e.memoryWatts,
                disk_watts: e.diskWatts,
                network_watts: e.networkWatts,
                estimated_power_w: e.powerW,
                estimated_energy_kwh: e.energyKwh,
                carbon_intensity: service.carbon_intensity,
                estimated_co2e_g: e.co2eG,
            });
            await this.repository.updateStatus(service.id, 'available');
        } catch (err) {
            const status = this.statusFromError(err);
            if (status) await this.repository.updateStatus(service.id, status);
            throw err; // o allSettled da rodada registra a falha
        }
    }

    private processMetrics(raw: MetricsResponse): ProcessedMetrics {
        return {
            cpuPercent: raw.metrics.cpu_percent,
            memoryGb: raw.metrics.memory_gb,
            diskGb: raw.metrics.disk_gb,
            networkGb: raw.metrics.network_gb,
            collectionIntervalSeconds: raw.collection_interval_seconds,
            collectionIntervalHours: raw.collection_interval_seconds / 3600,
        };
    }

    private calculateEmissions(
        m: ProcessedMetrics,
        p: EstimateParameter,
        carbonIntensity: number,
    ): Emissions {
        const cpuWatts = (m.cpuPercent / 100) * p.cpu_max_watts;
        const memoryWatts = m.memoryGb * p.ram_watts_per_gb;
        const diskWatts = m.diskGb * p.disk_watts_per_gb;
        const networkWatts = m.networkGb * p.network_watts_per_gb;

        const powerW = cpuWatts + memoryWatts + diskWatts + networkWatts;
        const energyKwh = (powerW * m.collectionIntervalHours) / 1000;
        const co2eG = energyKwh * carbonIntensity;

        return { cpuWatts, memoryWatts, diskWatts, networkWatts, powerW, energyKwh, co2eG };
    }

    private statusFromError(err: unknown): ServiceStatus | null {
        if (!(err instanceof ExternalApiError)) return null;
        if (err.kind !== 'bad_status') return null;

        if (err.status === 404) return 'metrics_missing';
        if (err.status === 500) return 'unavailable';
        return null;
    }
}
