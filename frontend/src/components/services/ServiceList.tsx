import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ServiceStatusBadge } from '@/components/services/ServiceStatusBadge';
import type { ServiceSummary } from '@/types/service';

interface ServiceListProps {
  services: ServiceSummary[];
}

export function ServiceList({ services }: ServiceListProps) {
  return (
    <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {services.map((service) => (
        <li key={service.id}>
          <Card>
            <CardHeader>
              <CardTitle>{service.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <ServiceStatusBadge status={service.status} />
              <p className="text-sm text-muted-foreground">
                {service.location.city}, {service.location.country}
              </p>
            </CardContent>
          </Card>
        </li>
      ))}
    </ul>
  );
}