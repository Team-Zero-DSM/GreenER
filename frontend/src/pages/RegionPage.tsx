import { useCallback } from 'react';
import { fetchRegionsLast24Hours } from '@/api/regions';
import type { Region } from '@/types/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { formatCo2e, formatEnergy, formatIntensity } from '@/utils/format';

function regionTitle(region: Region): string {
  return region.city ?? region.region ?? region.code;
}

export function RegionPage(){

    const fetcher = useCallback(() => fetchRegionsLast24Hours(), []);
    const { data: regions, isLoading, error } = useApiQuery(fetcher);
    
    if (isLoading) return <main>Carregando regiões...</main>;
    if (error) return <main role="alert">{error}</main>;
    if (!regions?.length) return <main>Nenhuma região disponível.</main>;

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">Regiões</h1>
                <p className="text-muted-foreground">
                    Intensidade de carbono de cada região e o impacto dos serviços hospedados nela
                </p>
            </header>
            <section className="w-full overflow-x-auto">
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(230px,1fr))]">
                    {regions.length === 0 ? (
                        <p className="text-sm text-white/60">Nenhuma região disponível.</p>
                    ) : (
                        regions.map((region) => (
                            <div
                                key={region.code}
                                className="max-w-400 m-auto md:w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/10"
                            >
                                <div>
                                    <h3 className="text-lg font-semibold">{regionTitle(region)}</h3>
                                </div>

                                <div className="flex gap-1 mt-1 text-xs text-white/60">
                                    <p>{region.code}</p>
                                    <p>∙</p>
                                    <p>{[region.region, region.country].filter(Boolean).join(', ')}</p>
                                </div>

                                <div className="mt-4 grid grid-cols-2 gap-3">

                                    <div className="">
                                        <p className="text-xs text-white/60">Intensidade de carbono</p>
                                        <p className="mt-1 font-semibold text-sm">
                                            {formatIntensity(region.gco2ePerKwh)}
                                        </p>
                                    </div>

                                    <div className="">
                                        <p className="text-xs text-white/60">Renovaveis</p>
                                        <p className="after:content-['%']">{region.renewableSharePercent}</p>
                                    </div>

                                    <div className="">
                                        <p className="text-xs text-white/60">Serviços</p>
                                        <p className="mt-1 font-semibold">{region.servicesCount}</p>
                                        {region.statusCounts.metricsMissing > 0 && (
                                            <p className="mt-1 text-xs text-amber-300">{region.statusCounts.metricsMissing} sem métricas </p>
                                        )}
                                    </div>

                                    <div className="">
                                        <p className="text-xs text-white/60">Energia</p>
                                        <p className="mt-1 font-semibold">{formatEnergy(region.energyKwh)}</p>
                                    </div>

                                    <div className="">
                                        <p className="text-xs text-white/60">CO₂e</p>
                                        <p className="mt-1 font-semibold">{formatCo2e(region.co2eGrams)}</p>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </section>
        </main>
    );
} 