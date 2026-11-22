import { ServiceStatusBadge } from '@/components/services/ServiceStatusBadge';
import { statusInfo } from '@/lib/serviceStatus';
import type { ServiceStatus } from '@/types/service';

const statuses: ServiceStatus[] = ['available', 'metrics_missing', 'unavailable'];

export function StatusLegend() {
    return (
        <section aria-label="Legenda de estados" className="space-y-3">
            <h3 className="text-center text-xs font-semibold uppercase tracking-[0.08em] text-muted-foreground">
                Estados dos serviços
            </h3>

            <dl className="grid gap-3 sm:grid-cols-3 sm:gap-4">
                {statuses.map((status) => (
                    <div
                        key={status}
                        className="flex flex-col items-center gap-2 rounded-xl px-2 py-2 text-center"
                    >
                        <dt>
                            <ServiceStatusBadge status={status} size="compact" />
                        </dt>

                        <dd className="max-w-xs text-xs leading-relaxed text-muted-foreground">
                            {statusInfo[status].description}
                        </dd>
                    </div>
                ))}
            </dl>
        </section>
    );
}
