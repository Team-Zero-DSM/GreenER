import { listServices } from '@/mocks/services';
import type { ServiceSummary } from '@/types/service';

const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000';
export const USE_MOCKS = import.meta.env.VITE_USE_MOCKS !== 'false';

export async function fetchServices(): Promise<ServiceSummary[]> {
    if (USE_MOCKS) {
        return listServices();
    }

    const response = await fetch(`${API_URL}/api/v1/services`);

    if (!response.ok) {
        throw new Error(`Falha ao buscar serviços (HTTP ${response.status})`);
    }

    return response.json();
}
