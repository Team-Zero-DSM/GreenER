import { statusInfo } from '@/lib/serviceStatus';
import { statusStyle } from '@/utils/statusStyle';
import type { ServiceStatus } from '@/types/service';

interface ServiceStatusBadgeProps {
    status: ServiceStatus;
    size?: 'default' | 'compact';
}

export function ServiceStatusBadge({ status, size = 'default' }: ServiceStatusBadgeProps) {
    const info = statusInfo[status];
    const sizeClass =
        size === 'compact' ? 'gap-1 px-2.5 py-1 text-xs' : 'gap-1.5 px-3 py-1 text-sm';

    return (
        <span
            title={info.description}
            className={`inline-flex items-center rounded-full font-medium whitespace-nowrap ${sizeClass} ${statusStyle(status).badge}`}
        >
            <span aria-hidden="true">{info.icon}</span>
            {info.label}
        </span>
    );
}
