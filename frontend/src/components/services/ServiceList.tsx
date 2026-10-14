import { Link as RouterLink } from 'react-router';
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
          <RouterLink
            to={`/servicos/${service.id}`}
            className="block rounded-xl transition hover:shadow-md"
          >
            <Card>
              <CardHeader>
                <CardTitle>{service.name}</CardTitle>
                <p className="font-mono text-sm text-muted-foreground">
                  ID: {service.id}
                </p>
              </CardHeader>
              <CardContent className="space-y-2">
                <ServiceStatusBadge status={service.status} />
                <p className="text-sm text-muted-foreground">
                  {service.location.city}, {service.location.country}
                </p>
              </CardContent>
            </Card>
          </RouterLink>
        </li>
      ))}
    </ul>
  );
}