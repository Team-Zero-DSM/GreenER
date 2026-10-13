import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { CollectionsService } from './collections.service.js';
import type { CollectionsRepository } from './collections.repository.js';
import type { CarbonClient } from '../../integrations/carbon-api.js';
import type { RegionsResponse } from '../../integrations/carbon-api.schema.js';
import type { MetricsClient } from '../../integrations/metrics-api.js';
import type { MetricsResponse } from '../../integrations/metrics-api.schema.js';
import { ExternalApiError } from '../../shared/errors/external-api-error.js';
import type {
    ActiveService,
    Collection,
    EstimateParameter,
    ServiceStatus,
} from './collections.types.js';

vi.mock('../../db/connection.js', () => ({ pool: {} }));

const mockFindActiveEstimateParameter = vi.fn<() => Promise<EstimateParameter | null>>();
const mockFindActiveServices = vi.fn<() => Promise<ActiveService[]>>();
const mockCreateCollection = vi.fn<(collection: Collection) => Promise<void>>();
const mockUpdateStatus = vi.fn<(id: number, status: ServiceStatus) => Promise<boolean>>();

const repositoryStub = {
    findActiveEstimateParameter: mockFindActiveEstimateParameter,
    findActiveServices: mockFindActiveServices,
    createCollection: mockCreateCollection,
    updateStatus: mockUpdateStatus,
} as unknown as CollectionsRepository;

const carbonStub = {
    getRegions: vi.fn<() => Promise<RegionsResponse>>(),
} as unknown as CarbonClient;

const defaultParams: EstimateParameter = {
    id: 1,
    cpu_max_watts: 100,
    ram_watts_per_gb: 0.375,
    disk_watts_per_gb: 0.01,
    network_watts_per_gb: 0.02,
    active: true,
};

function activeService(overrides: Partial<ActiveService> = {}): ActiveService {
    return {
        id: 1,
        external_id: 'service-1',
        metrics_path: '/metrics/service-1',
        carbon_intensity: 400,
        ...overrides,
    };
}

function metricsResponse(
    cpuPercent: number,
    memoryGb: number,
    networkGb: number,
    collectionIntervalSeconds: number,
): MetricsResponse {
    return {
        collection_interval_seconds: collectionIntervalSeconds,
        metrics: {
            cpu_percent: cpuPercent,
            memory_gb: memoryGb,
            disk_gb: 100,
            network_gb: networkGb,
        },
    };
}

function createService(getMetrics: MetricsClient['getMetrics']): CollectionsService {
    return new CollectionsService(repositoryStub, carbonStub, {
        getMetrics,
    } as unknown as MetricsClient);
}

describe('collections service', () => {
    beforeEach(() => {
        vi.resetAllMocks();
        mockFindActiveEstimateParameter.mockResolvedValue(defaultParams);
        mockFindActiveServices.mockResolvedValue([activeService()]);
        mockCreateCollection.mockResolvedValue(undefined);
        mockUpdateStatus.mockResolvedValue(true);
        vi.spyOn(console, 'error').mockImplementation(() => undefined);
    });

    afterEach(() => {
        vi.restoreAllMocks();
    });

    describe('rodadas consecutivas com métricas diferentes', () => {
        it('duas rodadas com respostas diferentes geram coletas com valores processados diferentes', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockResolvedValueOnce(metricsResponse(50, 4, 10, 30))
                .mockResolvedValueOnce(metricsResponse(80, 6, 20, 60));
            const service = createService(getMetrics);

            await service.runCollectionRound();
            await service.runCollectionRound();

            expect(getMetrics).toHaveBeenCalledTimes(2);
            expect(mockCreateCollection).toHaveBeenCalledTimes(2);

            const [primeira] = mockCreateCollection.mock.calls[0];
            expect(primeira.service_id).toBe(1);
            expect(primeira.estimate_parameter_id).toBe(1);
            expect(primeira.metric_interval_seconds).toBe(30);
            expect(primeira.cpu_percent).toBe(50);
            expect(primeira.memory_gb).toBe(4);
            expect(primeira.disk_gb).toBe(100);
            expect(primeira.network_gb).toBe(10);
            expect(primeira.carbon_intensity).toBe(400);
            expect(primeira.estimated_power_w).toBeCloseTo(52.7, 3);
            expect(primeira.estimated_energy_kwh).toBeCloseTo(0.000439167, 8);
            expect(primeira.estimated_co2e_g).toBeCloseTo(0.175667, 5);

            const [segunda] = mockCreateCollection.mock.calls[1];
            expect(segunda.metric_interval_seconds).toBe(60);
            expect(segunda.cpu_percent).toBe(80);
            expect(segunda.memory_gb).toBe(6);
            expect(segunda.disk_gb).toBe(100);
            expect(segunda.network_gb).toBe(20);
            expect(segunda.estimated_power_w).toBeCloseTo(83.65, 3);
            expect(segunda.estimated_energy_kwh).toBeCloseTo(0.001394167, 8);
            expect(segunda.estimated_co2e_g).toBeCloseTo(0.557667, 5);

            expect(primeira.estimated_power_w).not.toBe(segunda.estimated_power_w);
            expect(primeira.estimated_co2e_g).not.toBe(segunda.estimated_co2e_g);
            expect(mockUpdateStatus).toHaveBeenCalledTimes(2);
            expect(mockUpdateStatus).toHaveBeenCalledWith(1, 'available');
        });

        it('getMetrics é chamado com o metrics_path de cada serviço ativo em cada rodada', async () => {
            mockFindActiveServices.mockResolvedValue([
                activeService({ id: 1, external_id: 'svc-a', metrics_path: '/metrics/a' }),
                activeService({ id: 2, external_id: 'svc-b', metrics_path: '/metrics/b' }),
                activeService({ id: 3, external_id: 'svc-c', metrics_path: '/metrics/c' }),
            ]);
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockResolvedValue(metricsResponse(50, 4, 10, 30));
            const service = createService(getMetrics);

            await service.runCollectionRound();

            expect(getMetrics).toHaveBeenCalledTimes(3);
            expect(getMetrics).toHaveBeenCalledWith('/metrics/a');
            expect(getMetrics).toHaveBeenCalledWith('/metrics/b');
            expect(getMetrics).toHaveBeenCalledWith('/metrics/c');
            expect(mockCreateCollection).toHaveBeenCalledTimes(3);
            expect(mockUpdateStatus).toHaveBeenCalledTimes(3);

            await service.runCollectionRound();

            expect(getMetrics).toHaveBeenCalledTimes(6);
            expect(mockCreateCollection).toHaveBeenCalledTimes(6);
            expect(mockFindActiveServices).toHaveBeenCalledTimes(2);
        });
    });

    describe('tolerância a falhas na rodada', () => {
        it('falha em um serviço não interrompe a coleta dos demais', async () => {
            mockFindActiveServices.mockResolvedValue([
                activeService({ id: 1, external_id: 'svc-fail', metrics_path: '/metrics/fail' }),
                activeService({ id: 2, external_id: 'svc-ok', metrics_path: '/metrics/ok' }),
            ]);
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValueOnce(new ExternalApiError('Timeout de 8000ms', 'timeout'))
                .mockResolvedValueOnce(metricsResponse(50, 4, 10, 30));
            const service = createService(getMetrics);

            const collected = await service.runCollectionRound();

            expect(collected).toBe(1);
            expect(mockCreateCollection).toHaveBeenCalledTimes(1);
            expect(mockCreateCollection.mock.calls[0][0].service_id).toBe(2);
            expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
            expect(mockUpdateStatus).toHaveBeenCalledWith(2, 'available');
            expect(console.error).toHaveBeenCalledTimes(1);
        });
    });

    describe('mapeamento de status do serviço', () => {
        it('timeout não altera o status do serviço', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(new ExternalApiError('Timeout de 8000ms', 'timeout'));
            const service = createService(getMetrics);

            const collected = await service.runCollectionRound();

            expect(collected).toBe(0);
            expect(mockUpdateStatus).not.toHaveBeenCalled();
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });

        it('indisponibilidade não altera o status do serviço', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(new ExternalApiError('API fora do ar', 'unavailable'));
            const service = createService(getMetrics);

            await service.runCollectionRound();

            expect(mockUpdateStatus).not.toHaveBeenCalled();
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });

        it('resposta inválida não altera o status do serviço', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(new ExternalApiError('JSON inválido', 'invalid_response'));
            const service = createService(getMetrics);

            await service.runCollectionRound();

            expect(mockUpdateStatus).not.toHaveBeenCalled();
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });

        it('HTTP 404 marca o serviço como metrics_missing', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(
                    new ExternalApiError('Recurso não encontrado', 'bad_status', { status: 404 }),
                );
            const service = createService(getMetrics);

            const collected = await service.runCollectionRound();

            expect(collected).toBe(0);
            expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
            expect(mockUpdateStatus).toHaveBeenCalledWith(1, 'metrics_missing');
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });

        it('HTTP 500 marca o serviço como unavailable', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(
                    new ExternalApiError('Erro interno', 'bad_status', { status: 500 }),
                );
            const service = createService(getMetrics);

            await service.runCollectionRound();

            expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
            expect(mockUpdateStatus).toHaveBeenCalledWith(1, 'unavailable');
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });

        it('HTTP diferente de 404/500 não altera o status do serviço', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValue(
                    new ExternalApiError('Serviço degradado', 'bad_status', { status: 503 }),
                );
            const service = createService(getMetrics);

            await service.runCollectionRound();

            expect(mockUpdateStatus).not.toHaveBeenCalled();
            expect(mockCreateCollection).not.toHaveBeenCalled();
        });
    });

    describe('recuperação sem reinício manual', () => {
        it('serviço que falha na rodada 1 volta a ser coletado na rodada 2', async () => {
            const getMetrics = vi
                .fn<MetricsClient['getMetrics']>()
                .mockRejectedValueOnce(new ExternalApiError('Timeout de 8000ms', 'timeout'))
                .mockResolvedValueOnce(metricsResponse(60, 5, 15, 45));
            const service = createService(getMetrics);

            const primeiraRodada = await service.runCollectionRound();
            expect(primeiraRodada).toBe(0);
            expect(mockCreateCollection).not.toHaveBeenCalled();
            expect(mockUpdateStatus).not.toHaveBeenCalled();

            const segundaRodada = await service.runCollectionRound();
            expect(segundaRodada).toBe(1);
            expect(mockCreateCollection).toHaveBeenCalledTimes(1);
            expect(mockCreateCollection).toHaveBeenCalledWith(
                expect.objectContaining({
                    service_id: 1,
                    estimate_parameter_id: 1,
                    metric_interval_seconds: 45,
                    carbon_intensity: 400,
                }),
            );
            expect(mockCreateCollection.mock.calls[0][0].estimated_power_w).toBeCloseTo(63.175, 3);
            expect(mockCreateCollection.mock.calls[0][0].estimated_energy_kwh).toBeCloseTo(
                0.000789688,
                8,
            );
            expect(mockCreateCollection.mock.calls[0][0].estimated_co2e_g).toBeCloseTo(0.315875, 5);
            expect(mockUpdateStatus).toHaveBeenCalledTimes(1);
            expect(mockUpdateStatus).toHaveBeenCalledWith(1, 'available');
        });
    });

    describe('parâmetro de estimativa ausente', () => {
        it('a rodada falha e nada é gravado quando não há parâmetro ativo', async () => {
            mockFindActiveEstimateParameter.mockResolvedValue(null);
            const getMetrics = vi.fn<MetricsClient['getMetrics']>();
            const service = createService(getMetrics);

            await expect(service.runCollectionRound()).rejects.toThrow(
                'Nenhum parâmetro de estimativa ativo',
            );
            expect(getMetrics).not.toHaveBeenCalled();
            expect(mockCreateCollection).not.toHaveBeenCalled();
            expect(mockUpdateStatus).not.toHaveBeenCalled();
        });
    });
});
