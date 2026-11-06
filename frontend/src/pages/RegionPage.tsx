import { useCallback } from 'react';
import { Link } from 'react-router';
import { fetchRegionsLast24Hours } from '@/api/regions';
import { useApiQuery } from '@/hooks/useApiQuery';
import { CarbonIntensityChart } from '@/components/charts/CarbonIntensityChart';
import { ChartCard } from '@/components/charts/ChartCard';
import { RegionsCarousel } from '@/components/regions/RegionsCarousel';
import { RegionsMap2D } from '@/components/regions/RegionsMap2D';

export function RegionPage() {
    const fetcher = useCallback(() => fetchRegionsLast24Hours(), []);
    const { data: regions, isLoading, error } = useApiQuery(fetcher);

    return (
        <main className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:space-y-12">
            <header className="flex flex-wrap items-start justify-between gap-4">
                <div className="space-y-2">
                    <h1 className="text-3xl font-semibold">Regiões</h1>
                    <p className="text-muted-foreground">
                        Intensidade de carbono de cada região e o impacto dos serviços hospedados
                        nela
                    </p>
                </div>
                <Link
                    to="/#explorar"
                    className="inline-flex shrink-0 items-center rounded-lg border border-white/15 bg-white/5 px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-cyan-400/50 hover:bg-cyan-400/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
                >
                    Ver no globo 3D
                </Link>
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

                    <article className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-2">
                        <ChartCard
                            title="Intensidade de carbono por região"
                            subtitle="gCO₂e por kWh · quanto menor o valor, menor a intensidade de carbono"
                            contentClassName="flex flex-1 items-center"
                            titleClassName="lg:text-lg"
                        >
                            <div className="w-full">
                                <CarbonIntensityChart regions={regions} />
                            </div>
                        </ChartCard>
                        <ChartCard
                            title="Mapa das regiões"
                            subtitle="Localização geográfica e intensidade relativa de carbono"
                        >
                            <RegionsMap2D regions={regions} />
                        </ChartCard>
                    </article>
                </>
            ) : (
                <p className="text-muted-foreground">Nenhuma região disponível.</p>
            )}
        </main>
    );
}
