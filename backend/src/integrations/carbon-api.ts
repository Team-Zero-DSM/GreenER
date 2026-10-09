// src/carbon-api/carbon.client.ts
import type { ZodType } from 'zod';
import { ExternalApiError } from '../shared/errors/external-api-error.js';
import { type RegionsResponse, regionsResponseSchema } from './carbon-api.schema.js';

export class CarbonClient {
    constructor(
        private readonly baseUrl: string,
        private readonly timeoutMs = 8_000,
    ) {}

    getRegions(): Promise<RegionsResponse> {
        return this.request('/regions', regionsResponseSchema);
    }

    private async request<T>(path: string, schema: ZodType<T>): Promise<T> {
        let response: Response;
        try {
            response = await fetch(`${this.baseUrl}${path}`, {
                signal: AbortSignal.timeout(this.timeoutMs),
            });
        } catch (err) {
            const isTimeout = err instanceof Error && err.name === 'TimeoutError';
            throw new ExternalApiError(
                isTimeout
                    ? `Timeout de ${this.timeoutMs}ms em ${path}`
                    : `Carbon API indisponível em ${path}`,
                isTimeout ? 'timeout' : 'unavailable',
                { cause: err },
            );
        }

        if (!response.ok) {
            throw new ExternalApiError(
                `Carbon API respondeu ${response.status} em ${path}`,
                'bad_status',
                { status: response.status },
            );
        }

        let json: unknown;
        try {
            json = await response.json();
        } catch (err) {
            throw new ExternalApiError(`JSON inválido em ${path}`, 'invalid_response', {
                cause: err,
            });
        }

        const parsed = schema.safeParse(json);
        if (!parsed.success) {
            throw new ExternalApiError(`Resposta fora do contrato em ${path}`, 'invalid_response', {
                cause: parsed.error,
            });
        }
        return parsed.data;
    }
}
