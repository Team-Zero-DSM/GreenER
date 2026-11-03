import { useCallback } from 'react';
import { fetchRegionsLast24Hours } from '@/api/regions';
import { useApiQuery } from '@/hooks/useApiQuery';
import { CarbonIntensityChart } from '@/components/charts/CarbonIntensityChart';
import { ChartCard } from '@/components/charts/ChartCard';
import { RegionsCarousel } from '@/components/regions/RegionsCarousel';

export function RegionPage() {
    const fetcher = useCallback(() => fetchRegionsLast24Hours(), []);
    const { data: regions, isLoading, error } = useApiQuery(fetcher);

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:space-y-12">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">Regiões</h1>
                <p className="text-muted-foreground">
                    Intensidade de carbono de cada região e o impacto dos serviços hospedados nela
                </p>
            </header>

            {error && (
                <p role="alert" className="text-sm text-destructive">
                    {error}
                </p>
            )}

            {isLoading ? (
                <p className="text-muted-foreground">Carregando regiões...</p>
            ) : regions?.length ? (
                <>
                    <section aria-label="Indicadores por região">
                        <RegionsCarousel regions={regions} />
                    </section>

                    <section className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                        <ChartCard
                            title="Intensidade de carbono por região"
                            subtitle="gCO₂e por kWh · quanto menor o valor, menor a intensidade de carbono"
                        >
                            <CarbonIntensityChart regions={regions} />
                        </ChartCard>
                    </section>
                </>
            ) : (
                <p className="text-muted-foreground">Nenhuma região disponível.</p>
            )}
        </main>
    );
}
