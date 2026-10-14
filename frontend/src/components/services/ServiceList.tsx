import type { ServiceSummary } from '@/types/service';

interface ServiceListProps {
    services: ServiceSummary[];
}

export function ServiceList({ services }: ServiceListProps) {
    return (
        <ul className="space-y-2">
            {services.map((service) => (
                <li key={service.id}>{service.name}</li>
            ))}
        </ul>
    );
}   