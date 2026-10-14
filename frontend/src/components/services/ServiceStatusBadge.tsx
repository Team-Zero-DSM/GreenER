import type { ServiceStatus } from '@/types/service';

const statusInfo: Record<ServiceStatus, { label: string; className: string }> = {
  available: { label: 'Disponível', className: 'bg-emerald-100 text-emerald-800' },
  metrics_missing: { label: 'Sem métricas', className: 'bg-amber-100 text-amber-800' },
  unavailable: { label: 'Indisponível', className: 'bg-red-100 text-red-800' },
};

interface ServiceStatusBadgeProps {
  status: ServiceStatus;
}

export function ServiceStatusBadge({ status }: ServiceStatusBadgeProps) {
  const info = statusInfo[status];

  return (
    <span className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${info.className}`}>
      {info.label}
    </span>
  );
}