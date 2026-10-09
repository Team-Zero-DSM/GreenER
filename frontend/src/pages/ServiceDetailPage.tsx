import { useParams } from 'react-router';
import { findServiceById } from '@/mocks/services';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { ServiceStatus } from '@/types/service';

const statusInfo: Record<ServiceStatus, { label: string; className: string }> = {
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

export function ServiceDetailPage() {
  const { id } = useParams();
  const service = id ? findServiceById(id) : undefined;

  if (!service) {
    return (
      <main className="mx-auto min-h-screen max-w-5xl bg-background p-6">
        <h1 className="text-2xl font-semibold">Serviço não encontrado</h1>
        <p className="mt-2 text-muted-foreground">
          Não existe serviço com o identificador "{id}".
        </p>
      </main>
    );
  }

const status = statusInfo[service.status];

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 bg-background p-6">
      <header>
        <p className="text-sm text-muted-foreground">Detalhamento de serviço</p>
        <h1 className="text-3xl font-semibold">{service.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">
          ID: {service.id}
        </p>
      </header>
      <Card>
        <CardHeader>
          <CardTitle>Estado do serviço</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <span
            className={`inline-block rounded-full px-3 py-1 text-sm font-medium ${status.className}`}
          >
            {status.label}
          </span>
          <p className="text-sm text-muted-foreground">
            Visto por último em{' '}
            {new Date(service.lastSeenAt).toLocaleString('pt-BR')}
          </p>
        </CardContent>
      </Card>
    </main>
  );
}