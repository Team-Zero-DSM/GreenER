import { useParams } from 'react-router';

export function ServiceDetailPage() {
  const { id } = useParams();

  return (
    <main className="mx-auto min-h-screen max-w-5xl bg-background p-6">
      <h1 className="text-2xl font-semibold">Serviço {id}</h1>
    </main>
  );
}