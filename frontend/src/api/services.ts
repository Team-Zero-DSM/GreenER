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

import { getAuthSession } from '@/api/session';

const API_URL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/+$/, '');

export class ApiError extends Error {
    constructor(
        message: string,
        readonly status: number,
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

interface ApiRequestOptions {
    authenticated?: boolean;
}

// Extrai a mensagem de erro retornada pelo backend.
async function getErrorMessage(response: Response): Promise<string> {
    const responseText = await response.text().catch(() => '');

    if (responseText) {
        try {
            const body = JSON.parse(responseText) as {
                error?: { message?: string };
            };

            if (body.error?.message) {
                return body.error.message;
            }
        } catch {
            // Mantém a mensagem padrão caso a resposta não seja JSON.
        }
    }

    return `Falha na comunicação com a API (HTTP ${response.status})`;
}

// Lê a resposta JSON e também permite respostas sem conteúdo (204).
async function parseResponse<TResponse>(response: Response): Promise<TResponse> {
    if (response.status === 204) {
        return undefined as TResponse;
    }

    const responseText = await response.text();

    if (!responseText) {
        return undefined as TResponse;
    }

    try {
        return JSON.parse(responseText) as TResponse;
    } catch {
        throw new ApiError('A API retornou uma resposta em formato inválido.', response.status);
    }
}

// Centraliza a comunicação HTTP com o backend.
async function requestJson<TResponse>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT',
    body?: unknown,
    options: ApiRequestOptions = {},
): Promise<TResponse> {
    const headers = new Headers({
        Accept: 'application/json',
    });

    const requestOptions: RequestInit = {
        method,
        headers,
    };

    if (body !== undefined) {
        headers.set('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(body);
    }

    // Adiciona o JWT somente quando a chamada exige autenticação.
    if (options.authenticated) {
        const session = getAuthSession();

        if (!session?.token) {
            throw new ApiError('Sessão não encontrada. Faça login novamente.', 401);
        }

        headers.set('Authorization', `Bearer ${session.token}`);
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const response = await fetch(`${API_URL}/api/v1${normalizedPath}`, requestOptions);

    if (!response.ok) {
        throw new ApiError(await getErrorMessage(response), response.status);
    }

    return parseResponse<TResponse>(response);
}

export async function getJson<T>(path: string, options: ApiRequestOptions = {}): Promise<T> {
    return requestJson<T>(path, 'GET', undefined, options);
}

export async function postJson<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
): Promise<TResponse> {
    return requestJson<TResponse>(path, 'POST', body, options);
}

export async function patchJson<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
): Promise<TResponse> {
    return requestJson<TResponse>(path, 'PATCH', body, options);
}

export async function putJson<TRequest, TResponse>(
    path: string,
    body: TRequest,
    options: ApiRequestOptions = {},
): Promise<TResponse> {
    return requestJson<TResponse>(path, 'PUT', body, options);
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
    const params = new URLSearchParams();

    if (query.regionCode) params.set('regionCode', query.regionCode);
    if (query.active !== undefined) {
        params.set('active', String(query.active));
    }

    const search = params.toString() ? `?${params}` : '';

    const data = await getJson<ServicesListResponse>(`/services${search}`, { authenticated: true });

    return data.services.map(toSummary);
}

export async function fetchServiceOverview(id: string): Promise<ServiceOverview> {
    const data = await getJson<{
        service: ServiceDto;
        latestCollection: LatestCollection | null;
    }>(`/services/${encodeURIComponent(id)}`, {
        authenticated: true,
    });

    return {
        service: {
            ...data.service,
            status: toStatus(data.service.status),
        },
        latestCollection: data.latestCollection,
    };
}

export async function fetchServiceHistory(
    id: string,
    range: HistoryRange,
    maxPoints = 120,
): Promise<ServiceHistory> {
    return getJson<ServiceHistory>(
        `/services/${encodeURIComponent(id)}/collections?range=${range}&maxPoints=${maxPoints}`,
        { authenticated: true },
    );
}
