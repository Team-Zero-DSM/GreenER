export type ServiceStatus = 'available' | 'unavailable' | 'metrics_missing' | 'removed' | 'unknown';

export interface ServiceLocation {
    regionCode: string;
    country: string;
    region: string;
    city: string | null;
    latitude: number | null;
    longitude: number | null;
}

export interface ServiceMetrics {
    cpuPercent: number;
    memoryGb: number;
    diskGb: number;
    networkGb: number;
}

export interface ServiceEnvironmental {
    powerWatts: number;
    energyKwh: number;
    co2eGrams: number;
    carbonIntensity: number;
    renewableSharePercent: number | null;
}

export interface ServiceDetail {
    active?: boolean;
    statusUpdatedAt?: string;
    collectedAt?: string;
    collectionIntervalSeconds?: number;
    id: string;
    name: string;
    status: ServiceStatus;
    lastSeenAt: string;
    location: ServiceLocation | null;
    metrics: ServiceMetrics | null;
    environmental: ServiceEnvironmental | null;
}

export type ServiceSummary = ServiceDetail;