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

export interface ApiRequestOptions {
    authenticated?: boolean;
    token?: string;
}

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
            // Usa as mensagens amigáveis abaixo caso a resposta não seja JSON.
        }
    }

    const statusMessages: Record<number, string> = {
        401: 'Sua sessão expirou. Faça login novamente.',
        403: 'Você não tem permissão para realizar esta ação.',
        404: 'Os dados solicitados não foram encontrados.',
        500: 'Ocorreu um erro interno. Tente novamente mais tarde.',
    };

    return (
        statusMessages[response.status] ??
        `Falha na comunicação com a API (HTTP ${response.status})`
    );
}

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

async function requestJson<TResponse>(
    path: string,
    method: 'GET' | 'POST' | 'PATCH' | 'PUT',
    body?: unknown,
    options: ApiRequestOptions = {},
): Promise<TResponse> {
    const headers = new Headers({ Accept: 'application/json' });
    const requestOptions: RequestInit = { method, headers };

    if (body !== undefined) {
        headers.set('Content-Type', 'application/json');
        requestOptions.body = JSON.stringify(body);
    }

    if (options.authenticated || options.token) {
        const token = options.token ?? getAuthSession()?.token;

        if (!token) {
            throw new ApiError('Sessão não encontrada. Faça login novamente.', 401);
        }

        headers.set('Authorization', `Bearer ${token}`);
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    let response: Response;

    try {
        response = await fetch(`${API_URL}/api/v1${normalizedPath}`, requestOptions);
    } catch {
        throw new ApiError(
            'Não foi possível conectar à API. Verifique sua conexão e tente novamente.',
            0,
        );
    }

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
