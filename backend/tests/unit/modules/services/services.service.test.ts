import { describe, expect, it, vi } from 'vitest';
import { ServicesService } from '../../../../src/modules/services/services.service.js';
import type { ServiceRepository } from '../../../../src/modules/services/services.repository.js';
import type { ServiceWithLatestRow } from '../../../../src/modules/services/types/services.types.js';

const makeServiceRow = (
    overrides: Partial<ServiceWithLatestRow> = {},
): ServiceWithLatestRow => ({
    id: 'db-service-1',
    external_id: 'service-api',
    nome: 'API de exemplo',
    ativo: true,
    status: 'available',
    status_atualizado_em: new Date('2026-01-10T12:00:00.000Z'),
    ultima_vez_visto_em: new Date('2026-01-10T12:05:00.000Z'),
    codigo: 'BR-SUL',
    pais: 'Brasil',
    regiao: 'Sul',
    cidade: 'Curitiba',
    latitude: -25.43,
    longitude: -49.27,
    carbon_intensity: 120,

    coletado_em: new Date('2026-01-10T12:00:00.000Z'),
    intervalo_metrica_segundos: 60,
    cpu_percent: 25.5,
    memory_gb: 8,
    disk_gb: 100,
    network_gb: 2.5,
    potencia_estimada_w: 45.678,
    energia_estimada_kwh: 0.000759,
    collection_carbon_intensity: 115,
    co2e_estimado_g: 0.087285,

    ...overrides,
});

const makeRepository = () =>
    ({
        findAllWithLatest: vi.fn(),
    }) as unknown as ServiceRepository;

describe('ServicesService.list', () => {
    it('encaminha os filtros de região e status ativo ao repositório', async () => {
        const repository = makeRepository();
        vi.mocked(repository.findAllWithLatest).mockResolvedValue([]);

        const service = new ServicesService(repository);

        await service.list({
            regionCode: 'BR-SUL',
            active: true,
        });

        expect(repository.findAllWithLatest).toHaveBeenCalledTimes(1);
        expect(repository.findAllWithLatest).toHaveBeenCalledWith({
            regionCode: 'BR-SUL',
            active: true,
        });
    });

    it('retorna identificação, status, região e dados da última coleta', async () => {
        const repository = makeRepository();
        vi.mocked(repository.findAllWithLatest).mockResolvedValue([
            makeServiceRow(),
        ]);

        const service = new ServicesService(repository);

        const result = await service.list({ regionCode: 'BR-SUL' });

        expect(result.filters).toEqual({
            regionCode: 'BR-SUL',
            active: null,
        });
        expect(result.services).toHaveLength(1);
        expect(result.services[0]).toMatchObject({
            id: 'service-api',
            name: 'API de exemplo',
            active: true,
            status: 'available',
            statusUpdatedAt: '2026-01-10T12:00:00Z',
            lastSeenAt: '2026-01-10T12:05:00Z',
            location: {
                regionCode: 'BR-SUL',
                country: 'Brasil',
                region: 'Sul',
                city: 'Curitiba',
            },
            latestCollection: {
                collectedAt: '2026-01-10T12:00:00Z',
                collectionIntervalSeconds: 60,
                metrics: {
                    cpuPercent: 25.5,
                    memoryGb: 8,
                    diskGb: 100,
                    networkGb: 2.5,
                },
                estimates: {
                    powerWatts: 45.7,
                    energyKwh: 0.000759,
                    co2eGrams: 0.087285,
                    carbonIntensityGco2ePerKwh: 115,
                },
            },
        });

        expect(result.generatedAt).toMatch(
            /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}Z$/,
        );
    });

    it('retorna latestCollection como null quando o serviço ainda não tem coleta', async () => {
        const repository = makeRepository();
        vi.mocked(repository.findAllWithLatest).mockResolvedValue([
            makeServiceRow({
                coletado_em: null,
                intervalo_metrica_segundos: null,
                cpu_percent: null,
                memory_gb: null,
                disk_gb: null,
                network_gb: null,
                potencia_estimada_w: null,
                energia_estimada_kwh: null,
                collection_carbon_intensity: null,
                co2e_estimado_g: null,
            }),
        ]);

        const service = new ServicesService(repository);

        const result = await service.list({ regionCode: 'BR-SUL' });

        expect(result.services).toHaveLength(1);
        expect(result.services[0].latestCollection).toBeNull();
    });

    it('retorna lista vazia quando a região não tem serviços', async () => {
        const repository = makeRepository();
        vi.mocked(repository.findAllWithLatest).mockResolvedValue([]);

        const service = new ServicesService(repository);

        const result = await service.list({ regionCode: 'BR-SEM-SERVICOS' });

        expect(result.filters).toEqual({
            regionCode: 'BR-SEM-SERVICOS',
            active: null,
        });
        expect(result.services).toEqual([]);
    });
});