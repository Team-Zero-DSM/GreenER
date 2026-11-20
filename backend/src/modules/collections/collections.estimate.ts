import type { Emissions, EstimateParameter, ProcessedMetrics } from './types/collections.types.js';

export function calculateEmissions(
    metrics: Pick<
        ProcessedMetrics,
        'cpuPercent' | 'memoryGb' | 'diskGb' | 'networkGb' | 'collectionIntervalHours'
    >,
    parameters: Omit<EstimateParameter, 'id' | 'active'>,
    carbonIntensity: number,
): Emissions {
    const cpuWatts = (metrics.cpuPercent / 100) * parameters.cpu_max_watts;
    const memoryWatts = metrics.memoryGb * parameters.ram_watts_per_gb;
    const diskWatts = metrics.diskGb * parameters.disk_watts_per_gb;
    const networkWatts = metrics.networkGb * parameters.network_watts_per_gb;
    const powerW = cpuWatts + memoryWatts + diskWatts + networkWatts;
    const energyKwh = (powerW * metrics.collectionIntervalHours) / 1000;
    const co2eG = energyKwh * carbonIntensity;

    return { cpuWatts, memoryWatts, diskWatts, networkWatts, powerW, energyKwh, co2eG };
}
