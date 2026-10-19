import { ServiceStatusBadge } from '@/components/services/ServiceStatusBadge';
import { statusInfo } from '@/lib/serviceStatus';
import type { ServiceStatus } from '@/types/service';

// Estados que o backend grava em servico.status.
const statuses: ServiceStatus[] = ['available', 'metrics_missing', 'unavailable'];

export function StatusLegend() {
    return (
        <dl className="grid gap-3 text-xs text-muted-foreground sm:grid-cols-3">
            {statuses.map((status) => (
                <div key={status} className="flex flex-col items-start gap-1">
                    <dt>
                        <ServiceStatusBadge status={status} />
                    </dt>
                    <dd>{statusInfo[status].description}</dd>
                </div>
            ))}
        </dl>
    );
}
