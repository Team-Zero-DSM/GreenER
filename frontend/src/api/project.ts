import { getJson, patchJson, postJson } from '@/api/client';
import type { ProfileRole } from '@/types/profile';

export interface CollectionSettings {
    intervalSeconds: number;
    effectiveIntervalSeconds: number;
    lastRoundAt: string | null;
    nextRoundAt: string | null;
}

export interface EstimateCoefficients {
    id: string;
    cpuMaxWatts: number;
    ramWattsPerGb: number;
    diskWattsPerGb: number;
    networkWattsPerGb: number;
}

export interface EstimateInputs {
    cpuMaxWatts: number;
    ramWattsPerGb: number;
    diskWattsPerGb: number;
    networkWattsPerGb: number;
}

export interface EstimateResult {
    cpuWatts: number;
    memoryWatts: number;
    diskWatts: number;
    networkWatts: number;
    powerW: number;
    energyKwh: number;
    co2eG: number;
}

export interface EstimatePreview {
    example: {
        cpuPercent: number;
        memoryGb: number;
        diskGb: number;
        networkGb: number;
        collectionIntervalHours: number;
        carbonIntensity: number;
    };
    current: EstimateResult | null;
    proposed: EstimateResult;
}

export interface ProjectMember {
    id: string;
    name: string;
    email: string;
    role: ProfileRole;
    active: boolean;
}

export interface MemberAccessUpdate {
    role: ProfileRole;
    active: boolean;
}

export function getCollectionSettings(): Promise<CollectionSettings> {
    return getJson<CollectionSettings>('/project/collection', { authenticated: true });
}

export function updateCollectionSettings(
    intervalSeconds: number,
): Promise<{ intervalSeconds: number }> {
    return patchJson<{ intervalSeconds: number }, { intervalSeconds: number }>(
        '/project/collection',
        { intervalSeconds },
        { authenticated: true },
    );
}

export function getEstimateCoefficients(): Promise<EstimateCoefficients | null> {
    return getJson<EstimateCoefficients | null>('/project/coefficients', { authenticated: true });
}

export function previewEstimate(input: EstimateInputs): Promise<EstimatePreview> {
    return postJson<EstimateInputs, EstimatePreview>('/project/coefficients/preview', input, {
        authenticated: true,
    });
}

export function activateEstimate(input: EstimateInputs): Promise<EstimateCoefficients> {
    return postJson<EstimateInputs, EstimateCoefficients>('/project/coefficients', input, {
        authenticated: true,
    });
}

export function getProjectMembers(search = ''): Promise<ProjectMember[]> {
    const params = new URLSearchParams();
    if (search.trim()) params.set('search', search.trim());
    const query = params.size ? `?${params.toString()}` : '';
    return getJson<ProjectMember[]>(`/project/members${query}`, { authenticated: true });
}

export function updateProjectMember(
    id: string,
    access: MemberAccessUpdate,
): Promise<ProjectMember> {
    return patchJson<MemberAccessUpdate, ProjectMember>(
        `/project/members/${encodeURIComponent(id)}`,
        access,
        {
            authenticated: true,
        },
    );
}
