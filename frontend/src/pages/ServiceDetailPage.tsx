import { useParams } from 'react-router';
import { findServiceById } from '@/mocks/services';

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

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 bg-background p-6">
      <header>
        <p className="text-sm text-muted-foreground">Detalhamento de serviço</p>
        <h1 className="text-3xl font-semibold">{service.name}</h1>
        <p className="font-mono text-sm text-muted-foreground">
          ID: {service.id}
        </p>
      </header>
    </main>
  );
}