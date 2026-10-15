import type { RefObject, Dispatch, SetStateAction } from 'react';
import { DataSourceBadge } from '../shared/DataSourceBadge';
import type { Region } from '@/types/api';
import { formatCo2e, formatEnergy, formatIntensity } from '@/utils/format';

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
  zoom: (factor: number) => void;

  regions: Region[];
  onSelectRegion: (code: string) => void;
};

function regionTitle(region: Region): string {
  return region.city ?? region.region ?? region.code;
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
  zoom,
  regions,
  onSelectRegion,
}: ExploreSectionProps) {
  return (
    <section
        id="explorar"
        ref={exploreRef}
        className={`relative z-10 min-w-0`}
        aria-labelledby="explore-title"
    >
      <div className={`grid w-full content-start gap-4`}>
        <div className={`flex items-center gap-3`}>
          <h2 id="explore-title" className="text-xl font-bold text-white md:text-2xl">
            Regiões monitoradas
          </h2>
          <DataSourceBadge source={dataSource} />
        </div>

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
            onClick={() => setAutoRotate(value => !value)}
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
            onClick={() => setForce2D(value => !value)}
            className="rounded-md border border-gray-500 bg-slate-950/60 px-3 py-1 text-sm text-white backdrop-blur transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/15 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Modo 2D
          </button>
        </div>
        
        <div className="mt-3 space-y-3">
        {regions.map((region) => (
            <button
            key={region.code}
            type="button"
            onClick={() => onSelectRegion(region.code)}
            aria-pressed={selectedCode === region.code}
            className="w-full rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white transition-colors hover:bg-white/10 aria-pressed:border-emerald-400/60 aria-pressed:bg-emerald-400/10"
            >
            <div className="flex items-center justify-between gap-3">
                <h3 className="text-lg font-semibold">
                {regionTitle(region)}
                </h3>
                <span className="text-xs text-white/60">
                {region.code}
                </span>
            </div>

            <p className="mt-1 text-sm text-white/60">
                {[region.region, region.country]
                .filter(Boolean)
                .join(', ')}
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
                <p className="mt-1 font-semibold">
                    {region.servicesCount}
                </p>
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
                    Energia total
                </p>
                <p className="mt-1 font-semibold">
                    {formatEnergy(region.energyKwh)}
                </p>
                </div>

                <div className="rounded-lg bg-black/20 p-3">
                <p className="text-xs text-white/60">
                    Emissões totais de CO₂e
                </p>
                <p className="mt-1 font-semibold">
                    {formatCo2e(region.co2eGrams)}
                </p>
                </div>
            </div>
            </button>
        ))}
        </div>
      </div>
    </section>
  );
}
