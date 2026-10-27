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
    
    if (isLoading)return (<main className="mx-auto max-w-7xl p-6">Carregando regiões...</main>);

    if (error)return (<main role="alert" className="mx-auto max-w-7xl p-6">{error}</main>);
    
    if (!regions?.length)return (<main className="mx-auto max-w-7xl p-6">Nenhuma região disponível.</main>);

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">Regiões</h1>
                <p className="text-muted-foreground">
                    Intensidade de carbono de cada região e o impacto dos serviços hospedados nela
                </p>
            </header>
            <section>
                <div className="grid grid-cols-1 mx-auto w-full max-w-[400px] gap-4 md:grid-cols-2 md:max-w-none md:gap-x-10 md:gap-y-5 xl:grid-cols-4 xl:gap-4">
                    {regions.map((region) => (
                        <div
                            key={region.code}
                            className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white transition-colors hover:bg-white/10"
                        >
                            <h3 className="text-lg font-semibold">{regionTitle(region)}</h3>

                            <div className="mt-1 flex gap-1 text-sm text-white/60">
                                <span>{region.code}</span>
                                <span>∙</span>
                                <span>{[region.region, region.country].filter(Boolean).join(', ')}</span>
                            </div>

                            <div className="mt-4 grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-white/60">Intensidade</p>
                                    <p className="mt-1 font-semibold text-sm">
                                        {formatIntensity(region.gco2ePerKwh)}
                                    </p>
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-white/60">Renovaveis</p>
                                    <p className="mt-1 font-semibold text-sm after:content-['%']">
                                        {region.renewableSharePercent}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-sm text-white/60">Serviços</p>
                                    <p className="mt-1 font-semibold text-sm">{region.servicesCount}</p>
                                    {region.statusCounts.metricsMissing > 0 && (
                                        <p className="mt-1 text-xs text-amber-300">{region.statusCounts.metricsMissing} sem métricas</p>
                                    )}
                                </div>

                                <div className="text-right">
                                    <p className="text-sm text-white/60">Energia</p>
                                    <p className="mt-1 font-semibold text-sm">{formatEnergy(region.energyKwh)}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-white/60">CO₂e</p>
                                    <p className="mt-1 font-semibold text-sm">{formatCo2e(region.co2eGrams)}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>
        </main>
    );
} 