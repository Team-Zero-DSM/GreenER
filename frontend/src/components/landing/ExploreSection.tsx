import { Link } from 'react-router';
import type { RefObject, Dispatch, SetStateAction } from 'react';
import { DataSourceBadge } from '../shared/DataSourceBadge';
import type { Region } from '@/types/api';
import { useServices } from '@/hooks/useServices';
import { formatCo2e, formatEnergy, formatIntensity } from '@/utils/format';

type Service = ReturnType<typeof useServices>['services'][number];

type ExploreSectionProps = {
    exploreRef: RefObject<HTMLElement | null>;
    rotateLeft: () => void;
    rotateRight: () => void;

    dataSource: React.ComponentProps<typeof DataSourceBadge>['source'];

    selectedCode: string | null;
    autoRotate: boolean;
    setAutoRotate: Dispatch<SetStateAction<boolean>>;
    force2D: boolean;
    setForce2D: Dispatch<SetStateAction<boolean>>;

    backToGlobal: () => void;
    backToRegions: () => void;
    zoom: (factor: number) => void;

    regions: Region[];
    services: Service[];
    onSelectRegion: (code: string) => void;
};

function regionTitle(region: Region): string {
    return region.city ?? region.region ?? region.code;
}

function serviceStatus(status: Service['status']): string {
    if (status === 'available') return 'Disponível';
    if (status === 'unavailable') return 'Indisponível';
    return 'Sem status';
}

export function ExploreSection({
    exploreRef,
    rotateLeft,
    rotateRight,
    dataSource,
    selectedCode,
    autoRotate,
    setAutoRotate,
    force2D,
    setForce2D,
    backToGlobal,
    backToRegions,
    zoom,
    regions,
    services,
    onSelectRegion,
}: ExploreSectionProps) {
    const selectedRegion = regions.find((region) => region.code === selectedCode);

    const regionServices = selectedCode
        ? services.filter((service) => service.location?.regionCode === selectedCode)
        : [];

    const showingServices = selectedCode !== null;

    return (
        <section
            id="explorar"
            ref={exploreRef}
            className={`relative z-10 min-w-0`}
            aria-labelledby="explore-title"
        >
            <div className="flex h-[calc(100vh-7rem)] min-h-[400px] flex-col gap-4">
                <div className={`flex items-center gap-3`}>
                    <h2 id="explore-title" className="text-xl font-bold text-white md:text-2xl">
                        {showingServices
                            ? `Serviços de ${selectedRegion ? regionTitle(selectedRegion) : selectedCode}`
                            : 'Regiões monitoradas'}
                    </h2>
                    <DataSourceBadge source={dataSource} />
                </div>
                <p className="text-sm text-white/60">
                    {showingServices
                        ? 'Serviços monitorados nesta região e seus respectivos status.'
                        : 'Energia e emissões somam as amostras registradas nas últimas 24 horas em cada região.'}
                </p>

                <div
                    className="mt-3 flex flex-nowrap items-center gap-2 overflow-x-auto text-white"
                    role="group"
                    aria-label="Controles do globo"
                >
                    <button
                        type="button"
                        onClick={backToGlobal}
                        disabled={!selectedCode}
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Visão global
                    </button>

                    <button
                        type="button"
                        aria-pressed={autoRotate}
                        onClick={() => setAutoRotate((value) => !value)}
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Rotação automática
                    </button>

                    <button
                        type="button"
                        onClick={rotateLeft}
                        aria-label="Girar para a esquerda"
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        ←
                    </button>

                    <button
                        type="button"
                        onClick={rotateRight}
                        aria-label="Girar para a direita"
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        →
                    </button>

                    <button
                        type="button"
                        onClick={() => zoom(1.15)}
                        aria-label="Aproximar"
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        +
                    </button>

                    <button
                        type="button"
                        onClick={() => zoom(1 / 1.15)}
                        aria-label="Afastar"
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        −
                    </button>

                    <button
                        type="button"
                        aria-pressed={force2D}
                        onClick={() => setForce2D((value) => !value)}
                        className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        Modo 2D
                    </button>
                </div>

                {showingServices && (
                    <button
                        type="button"
                        onClick={backToRegions}
                        className="flex w-fit items-center gap-2 rounded-lg border border-white/15 bg-white/5 px-3 py-2 text-sm text-white transition-colors hover:bg-white/10"
                    >
                        <span aria-hidden="true">←</span>
                        Voltar para regiões
                    </button>
                )}

                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto pr-2">
                    {!showingServices &&
                        regions.map((region) => (
                            <button
                                key={region.code}
                                type="button"
                                onClick={() => onSelectRegion(region.code)}
                                aria-pressed={selectedCode === region.code}
                                className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/10"
                            >
                                <div className="flex items-center justify-between gap-3">
                                    <h3 className="text-lg font-semibold">{regionTitle(region)}</h3>
                                    <span className="text-xs text-white/60">{region.code}</span>
                                </div>

                                <p className="mt-1 text-sm text-white/60">
                                    {[region.region, region.country].filter(Boolean).join(', ')}
                                </p>

                                <div className="mt-4 grid grid-cols-2 gap-3">
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Intensidade de carbono
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatIntensity(region.gco2ePerKwh)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Serviços monitorados
                                        </p>
                                        <p className="mt-1 font-semibold">{region.servicesCount}</p>
                                        <p className="mt-1 text-xs text-white/60">
                                            {region.statusCounts.available} disponíveis
                                            {' · '}
                                            {region.statusCounts.unavailable} indisponíveis
                                        </p>
                                        {region.statusCounts.metricsMissing > 0 && (
                                            <p className="mt-1 text-xs text-amber-300">
                                                {region.statusCounts.metricsMissing} sem métricas
                                            </p>
                                        )}
                                    </div>

                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Energia nas últimas 24 h
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatEnergy(region.energyKwh)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Emissões de CO₂e nas últimas 24 h
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatCo2e(region.co2eGrams)}
                                        </p>
                                    </div>
                                </div>
                            </button>
                        ))}

                    {showingServices &&
                        regionServices.map((service) => (
                            <Link
                                key={service.id}
                                to={`/servicos/${service.id}`}
                                className="block rounded-xl border border-white/10 bg-white/5 p-4 text-white transition-colors hover:border-emerald-400/40 hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400"
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div className="min-w-0">
                                        <h3 className="break-words text-lg font-semibold">
                                            {service.name}
                                        </h3>

                                        <p className="mt-1 text-sm text-white/60">
                                            {[
                                                service.location?.city,
                                                service.location?.region,
                                                service.location?.country,
                                            ]
                                                .filter(Boolean)
                                                .join(', ') || 'Localização não informada'}
                                        </p>
                                    </div>

                                    <span
                                        className={`shrink-0 rounded-full px-2 py-1 text-xs ${
                                            service.status === 'available'
                                                ? 'bg-emerald-400/15 text-emerald-300'
                                                : service.status === 'unavailable'
                                                  ? 'bg-red-400/15 text-red-300'
                                                  : 'bg-amber-400/15 text-amber-300'
                                        }`}
                                    >
                                        {serviceStatus(service.status)}
                                    </span>
                                </div>

                                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Intensidade de carbono
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatIntensity(
                                                service.environmental?.carbonIntensity ?? null,
                                            )}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            Energia nas últimas 24 h
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatEnergy(service.environmental?.energyKwh ?? null)}
                                        </p>
                                    </div>

                                    <div className="rounded-lg bg-black/20 p-3">
                                        <p className="text-xs text-white/60">
                                            CO₂e nas últimas 24 h
                                        </p>
                                        <p className="mt-1 font-semibold">
                                            {formatCo2e(service.environmental?.co2eGrams ?? null)}
                                        </p>
                                    </div>
                                </div>

                                <p className="mt-3 text-xs text-emerald-300">
                                    Ver detalhes do serviço →
                                </p>
                            </Link>
                        ))}

                    {showingServices && regionServices.length === 0 && (
                        <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/60">
                            Nenhum serviço encontrado para esta região.
                        </p>
                    )}
                </div>
            </div>
        </section>
    );
}
