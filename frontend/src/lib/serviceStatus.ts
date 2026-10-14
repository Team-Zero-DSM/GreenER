import type { ServiceStatus } from '@/types/service';

export const statusInfo: Record<
  ServiceStatus,
  { label: string; className: string }
> = {
  available: {
    label: 'Disponível',
    className: 'bg-emerald-100 text-emerald-800',
  },
  metrics_missing: {
    label: 'Sem métricas',
    className: 'bg-amber-100 text-amber-800',
  },
  unavailable: {
    label: 'Indisponível',
    className: 'bg-red-100 text-red-800',
  },
};