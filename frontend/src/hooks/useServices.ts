import { useEffect, useState } from 'react';
import { fetchServices } from '@/api/services';
import type { ServiceSummary } from '@/types/service';

export function useServices(regionCode?: string, active?: boolean) {
    const [allServices, setAllServices] = useState<ServiceSummary[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        let cancelled = false;

        fetchServices()
            .then((data) => {
                if (!cancelled) setAllServices(data);
            })
            .catch((err: unknown) => {
                if (!cancelled) {
                    setError(err instanceof Error ? err.message : 'Erro ao carregar os serviços.');
                }
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false);
            });

        return () => {
            cancelled = true;
        };
    }, []);

    // Filtros de região e de listagem (ativo / não listado) aplicados sobre o que veio da API ou dos mocks.
    const services = allServices.filter(
        (service) =>
            (regionCode === undefined || service.location?.regionCode === regionCode) &&
            (active === undefined || service.active === active),
    );

    return { services, isLoading, error };
}
