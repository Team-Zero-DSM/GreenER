import { ServiceList } from '@/components/services/ServiceList';
import { useServices } from '@/hooks/useServices';

export function DashboardPage() {
  const { services, isLoading, error } = useServices();

  return (
    <main className="mx-auto min-h-screen max-w-5xl space-y-6 bg-background p-6">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      {isLoading && <p className="text-muted-foreground">Carregando serviços...</p>}
      {error && <p className="text-red-700">{error}</p>}
      {!isLoading && !error && services.length === 0 && (
        <p className="text-muted-foreground">Nenhum serviço cadastrado.</p>
      )}
      {!isLoading && !error && <ServiceList services={services} />}
    </main>
  );
}