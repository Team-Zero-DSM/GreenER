import { getJson } from '@/api/services';
import type { Region } from '@/types/api';

interface RegionsResponse {
    regions: Array<{
        code: string;
        country: string;
        region: string;
        city: string | null;
        latitude: number | null;
        longitude: number | null;
        carbonIntensityGco2ePerKwh: number | null;
        renewableSharePercent: number | null;
        serviceCounts: {
            totalServices: number;
            availableServices: number;
            unavailableServices: number;
            metricsMissingServices: number;
        };
        periodSummary: {
            energyKwh: number | null;
            co2eGrams: number | null;
        } | null;
    }>;
}

function toRegion(region: RegionsResponse['regions'][number]): Region {
    return {
        code: region.code,
        country: region.country,
        region: region.region,
        city: region.city,
        latitude: region.latitude,
        longitude: region.longitude,
        gco2ePerKwh: region.carbonIntensityGco2ePerKwh,
        renewableSharePercent: region.renewableSharePercent,
        servicesCount: region.serviceCounts.totalServices,
        energyKwh: region.periodSummary?.energyKwh ?? null,
        co2eGrams: region.periodSummary?.co2eGrams ?? null,
        statusCounts: {
            available: region.serviceCounts.availableServices,
            unavailable: region.serviceCounts.unavailableServices,
            metricsMissing: region.serviceCounts.metricsMissingServices,
        },
    };
}

export async function fetchRegions(): Promise<Region[]> {
    const data = await getJson<RegionsResponse>('/regions');

    return data.regions.map(toRegion);
}

// Regiões com os totais de energia e CO₂e somados entre `from` e `to`.
export async function fetchRegionsByPeriod(from: Date, to: Date): Promise<Region[]> {
    const params = new URLSearchParams({ from: from.toISOString(), to: to.toISOString() });
    const data = await getJson<RegionsResponse>(`/regions?${params}`);

    return data.regions.map(toRegion);
}

export async function fetchRegionsLast24Hours(): Promise<Region[]> {
    // Recalcula a janela a cada atualização automática da tela.
    const to = new Date();
    const from = new Date(to.getTime() - 24 * 60 * 60 * 1000);

    return fetchRegionsByPeriod(from, to);
}
