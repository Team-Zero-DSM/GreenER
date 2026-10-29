import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router';
import { CollectionStatusPanel } from '@/components/services/CollectionStatusPanel';
import { ServiceFilters } from '@/components/services/ServiceFilters';
import { ServiceList } from '@/components/services/ServiceList';
import { StatusLegend } from '@/components/services/StatusLegend';
import {
    defaultFilters,
    filterServices,
    listCountries,
} from '@/components/services/filterServices';
import { useServices } from '@/hooks/useServices';

export function DashboardPage() {
    const [searchParams, setSearchParams] = useSearchParams();
    const collectionView = searchParams.get('visao') === 'coletas';
    const [regionCode, setRegionCode] = useState('');
    const [active, setActive] = useState('all');
    const { services, isLoading, error } = useServices(
        regionCode || undefined,
        active === 'all' ? undefined : active === 'true',
    );
    const [filters, setFilters] = useState(defaultFilters);

    const countries = useMemo(() => listCountries(services), [services]);
    const visibleServices = useMemo(() => filterServices(services, filters), [services, filters]);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-4 sm:p-6">
            <header>
                <h1 className="text-3xl font-semibold">Serviços</h1>
                <p className="text-muted-foreground">
                    Estado, localização, métricas e impacto estimado de cada serviço.
                </p>
            </header>
            <nav aria-label="Visualização dos serviços" className="flex gap-2 border-b pb-3">
                {[
                    { label: 'Métricas dos serviços', value: 'metricas' },
                    { label: 'Status de coleta', value: 'coletas' },
                ].map((tab) => (
                    <button
                        key={tab.value}
                        type="button"
                        aria-current={
                            (collectionView ? 'coletas' : 'metricas') === tab.value
                                ? 'page'
                                : undefined
                        }
                        onClick={() =>
                            setSearchParams((previous) => {
                                const next = new URLSearchParams(previous);
                                next.set('visao', tab.value);
                                return next;
                            })
                        }
                        className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${(collectionView ? 'coletas' : 'metricas') === tab.value ? 'bg-primary/15 text-primary' : 'text-muted-foreground hover:bg-white/5'}`}
                    >
                        {tab.label}
                    </button>
                ))}
            </nav>
            {collectionView ? (
                <CollectionStatusPanel />
            ) : (
                <>
                    <div className="flex flex-wrap gap-4">
                        <label className="flex flex-col gap-1 text-sm">
                            Código da região
                            <input
                                className="rounded-md border bg-secondary px-3 py-2"
                                placeholder="Todas as regiões"
                                value={regionCode}
                                onChange={(event) => setRegionCode(event.target.value)}
                            />
                        </label>
                        <label className="flex flex-col gap-1 text-sm">
                            Listagem
                            <select
                                className="rounded-md border bg-secondary px-3 py-2"
                                value={active}
                                onChange={(event) => setActive(event.target.value)}
                            >
                                <option value="all">Todos os serviços</option>
                                <option value="true">Listados</option>
                                <option value="false">Não listados</option>
                            </select>
                        </label>
                    </div>

                    {isLoading && <p className="text-muted-foreground">Carregando serviços...</p>}
                    {error && <p className="text-destructive">{error}</p>}

                    {!isLoading && !error && (
                        <>
                            <ServiceFilters
                                filters={filters}
                                countries={countries}
                                onChange={setFilters}
                            />
                            <p className="text-sm text-muted-foreground">
                                Mostrando {visibleServices.length} de {services.length} serviços
                            </p>
                            {visibleServices.length === 0 ? (
                                <p className="text-muted-foreground">
                                    Nenhum serviço com esses filtros.
                                </p>
                            ) : (
                                <ServiceList services={visibleServices} />
                            )}
                            <p className="text-xs text-muted-foreground">
                                Energia e CO₂e referem-se à última coleta de cada serviço.
                            </p>
                            <StatusLegend />
                        </>
                    )}
                </>
            )}
        </main>
    );
}
