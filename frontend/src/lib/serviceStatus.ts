import type { ServiceStatus } from '@/types/service';

export const statusInfo: Record<
  ServiceStatus,
  { label: string; className: string }
> = {
  available: {
    label: 'Disponível',
    className: 'bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-400/40',
  },
  metrics_missing: {
    label: 'Sem métricas',
    className: 'bg-amber-400/15 text-amber-300 ring-1 ring-amber-400/40',
  },
  unavailable: {
    label: 'Indisponível',
    className: 'bg-red-400/15 text-red-300 ring-1 ring-red-400/40',
  },
  removed: {
    label: 'Removido',
    className: 'bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/40',
  },
  unknown: {
    label: 'Desconhecido',
    className: 'bg-slate-400/15 text-slate-300 ring-1 ring-slate-400/40',
  },
};