import { findServiceById, listServices } from '@/mocks/services';
import { buildServiceHistory, mockOverview } from '@/mocks/serviceHistory';
import { statusInfo } from '@/lib/serviceStatus';
import type {
    HistoryRange,
    LatestCollection,
    ServiceDto,
    ServiceHistory,
    ServiceOverview,
    ServicesListResponse,
    ServiceStatus,
    ServiceSummary,
} from '@/types/service';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
// A API é o padrão; os dados de exemplo só aparecem com VITE_USE_MOCKS=true.
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS === 'true';

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
    }
}

export async function getJson<T>(path: string): Promise<T> {
    const response = await fetch(`${API_URL}/api/v1${path}`);

    if (!response.ok) {
        // O backend responde { error: { message } } nas falhas.
        const body = (await response.json().catch(() => null)) as {
            error?: { message?: string };
        } | null;
        throw new ApiError(
            body?.error?.message ?? `Falha na comunicação com a API (HTTP ${response.status})`,
            response.status,
        );
    }

    return response.json() as Promise<T>;
}

// Estados que o frontend não conhece viram "unknown" para o selo não quebrar.
function toStatus(status: string): ServiceStatus {
    return status in statusInfo ? (status as ServiceStatus) : 'unknown';
}

// Converte o serviço do backend (com latestCollection aninhada) para a linha da tabela.
function toSummary(
    service: ServiceDto & { latestCollection: LatestCollection | null },
): ServiceSummary {
    const collection = service.latestCollection;

    return {
        id: service.id,
        name: service.name,
        active: service.active,
        status: toStatus(service.status),
        statusUpdatedAt: service.statusUpdatedAt,
        lastSeenAt: service.lastSeenAt,
        collectedAt: collection?.collectedAt,
        collectionIntervalSeconds: collection?.collectionIntervalSeconds,
        location: service.location,
        metrics: collection?.metrics ?? null,
        environmental: collection
            ? {
                  powerWatts: collection.estimates.powerWatts,
                  energyKwh: collection.estimates.energyKwh,
                  co2eGrams: collection.estimates.co2eGrams,
                  carbonIntensity: collection.estimates.carbonIntensityGco2ePerKwh,
                  renewableSharePercent: null,
              }
            : null,
    };
}

export interface ServicesQuery {
    regionCode?: string;
    active?: boolean;
}

export async function fetchServices(query: ServicesQuery = {}): Promise<ServiceSummary[]> {
    if (USE_MOCKS) {
        return listServices().filter(
            (service) =>
                (query.regionCode === undefined ||
                    service.location?.regionCode === query.regionCode) &&
                (query.active === undefined || (service.active ?? true) === query.active),
        );
    }

    const params = new URLSearchParams();
    if (query.regionCode) params.set('regionCode', query.regionCode);
    if (query.active !== undefined) params.set('active', String(query.active));
    const search = params.toString() ? `?${params}` : '';

    const data = await getJson<ServicesListResponse>(`/services${search}`);
    return data.services.map(toSummary);
}

export async function fetchServiceOverview(id: string): Promise<ServiceOverview> {
    if (USE_MOCKS) {
        const service = findServiceById(id);
        if (!service) throw new ApiError('Serviço não encontrado nos dados simulados.', 404);
        return mockOverview(service);
    }

    const data = await getJson<{
        service: ServiceDto;
        latestCollection: LatestCollection | null;
    }>(`/services/${encodeURIComponent(id)}`);
    return {
        service: { ...data.service, status: toStatus(data.service.status) },
        latestCollection: data.latestCollection,
    };
}

export async function fetchServiceHistory(
    id: string,
    range: HistoryRange,
): Promise<ServiceHistory> {
    if (USE_MOCKS) {
        const service = findServiceById(id);
        if (!service) throw new ApiError('Serviço não encontrado nos dados simulados.', 404);
        return buildServiceHistory(service, range);
    }

    return getJson<ServiceHistory>(
        `/services/${encodeURIComponent(id)}/collections?range=${range}&maxPoints=120`,
    );
}
