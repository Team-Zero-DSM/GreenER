import type { ZodType } from 'zod';
import { ExternalApiError } from '../shared/errors/external-api-error.js';
import {
  servicesResponseSchema,
  type MetricsService,
} from './metrics-api.schema.js';

const BASE_URL = process.env.METRICS_API_URL;
const TIMEOUT_MS = 8_000;

async function request<T>(path: string, schema: ZodType<T>): Promise<T> {
  if (!BASE_URL) throw new Error('METRICS_API_URL não configurada');

  let response: Response;
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
  } catch (err) {
    const isTimeout = err instanceof Error && err.name === 'TimeoutError';
    throw new ExternalApiError(
      isTimeout
        ? `Timeout de ${TIMEOUT_MS}ms em ${path}`
        : `Metrics API indisponível em ${path}`,
      isTimeout ? 'timeout' : 'unavailable',
      { cause: err },
    );
  }

  if (!response.ok) {
    throw new ExternalApiError(
      `Metrics API respondeu ${response.status} em ${path}`,
      'bad_status',
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
    throw new ExternalApiError(
      `Resposta fora do contrato em ${path}`,
      'invalid_response',
      { cause: parsed.error },
    );
  }
  return parsed.data;
}

export function getServices(): Promise<MetricsService[]> {
  return request('/services', servicesResponseSchema);
}
