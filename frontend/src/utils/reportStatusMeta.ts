import { statusInfo } from '@/lib/serviceStatus';
import type { ServiceStatus } from '@/types/service';

export const STATUS_ORDER: ServiceStatus[] = ['available', 'metrics_missing', 'unavailable', 'removed', 'unknown'];

const COLORS: Record<ServiceStatus, string> = {
  available: '#2e8b62',
  metrics_missing: '#b7791f',
  unavailable: '#b5483d',
  removed: '#6b7780',
  unknown: '#6b7780',
};

export const STATUS_META = Object.fromEntries(
  STATUS_ORDER.map((s) => [s, { label: statusInfo[s].label, icon: statusInfo[s].icon, color: COLORS[s] }]),
) as Record<ServiceStatus, { label: string; icon: string; color: string }>;