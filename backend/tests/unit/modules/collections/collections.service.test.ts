import { describe, it, expect, vi } from 'vitest';
import { CollectionsService } from '../../../../src/modules/collections/collections.service.js';
import type { CollectionsRepository } from '../../../../src/modules/collections/collections.repository.js';
import type { CarbonClient } from '../../../../src/integrations/carbon-api.js';
import type { MetricsClient } from '../../../../src/integrations/metrics-api.js';
import type {
    ActiveService,
    EstimateParameter,
} from '../../../../src/modules/collections/types/collections.types.js';
import type { MetricsResponse } from '../../../../src/integrations/metrics-api.schema.js';

describe('Processamento de métricas em coletas (CollectionsService)', () => {
    it('deve processar valores diferentes retornados entre coletas consecutivas', async () => {
        const mockParams: EstimateParameter = {
            id: 'param-1',
            cpu_max_watts: 200,
            ram_watts_per_gb: 3,
            disk_watts_per_gb: 1,
            network_watts_per_gb: 2,
            active: true,
        };

        const mockServices: ActiveService[] = [
            {
                id: 'service-1',
                external_id: 'service-api',
                metrics_path: '/metrics',
                carbon_intensity: 150,
            },
        ];

        const mockRepo = {
            findActiveEstimateParameter: vi.fn().mockResolvedValue(mockParams),
            findActiveServices: vi.fn().mockResolvedValue(mockServices),
            createCollection: vi.fn().mockResolvedValue({
                id: 'collection-1',
                coletado_em: new Date(),
            }),
            createStatusCollection: vi.fn().mockResolvedValue(undefined),
            updateStatus: vi.fn().mockResolvedValue(true),
        } as unknown as CollectionsRepository;

        const mockCarbonClient = {} as CarbonClient;

        const mockMetricsClient = {
            getMetrics: vi.fn(),
        } as unknown as MetricsClient;

        const service = new CollectionsService(mockRepo, mockCarbonClient, mockMetricsClient);

        // Inicia coleta
        const firstMetrics: MetricsResponse = {
            collection_interval_seconds: 60,
            metrics: {
                cpu_percent: 20,
                memory_gb: 4,
                disk_gb: 10,
                network_gb: 1,
            },
        };
        vi.mocked(mockMetricsClient.getMetrics).mockResolvedValueOnce(firstMetrics);

        const firstResult = await service.runCollectionRound();
        expect(firstResult).toBe(1);
        expect(mockRepo.createCollection).toHaveBeenCalledTimes(1);
        expect(mockRepo.createCollection).toHaveBeenNthCalledWith(
            1,
            expect.objectContaining({
                service_id: 'service-1',
                cpu_percent: 20,
                memory_gb: 4,
                disk_gb: 10,
                network_gb: 1,
            }),
        );

        const secondMetrics: MetricsResponse = {
            collection_interval_seconds: 60,
            metrics: {
                cpu_percent: 80,
                memory_gb: 8,
                disk_gb: 15,
                network_gb: 5,
            },
        };
        vi.mocked(mockMetricsClient.getMetrics).mockResolvedValueOnce(secondMetrics);

        const secondResult = await service.runCollectionRound();
        expect(secondResult).toBe(1);
        expect(mockRepo.createCollection).toHaveBeenCalledTimes(2);
        expect(mockRepo.createCollection).toHaveBeenNthCalledWith(
            2,
            expect.objectContaining({
                service_id: 'service-1',
                cpu_percent: 80,
                memory_gb: 8,
                disk_gb: 15,
                network_gb: 5,
            }),
        );

        // Compara os dados entre as coletas
        const firstCall = vi.mocked(mockRepo.createCollection).mock.calls[0][0];
        const secondCall = vi.mocked(mockRepo.createCollection).mock.calls[1][0];

        expect(secondCall.cpu_percent).not.toBe(firstCall.cpu_percent);
        expect(secondCall.memory_gb).not.toBe(firstCall.memory_gb);
        expect(secondCall.estimated_power_w).toBeGreaterThan(firstCall.estimated_power_w);
        expect(secondCall.estimated_co2e_g).toBeGreaterThan(firstCall.estimated_co2e_g);
    });
});
