import { useCallback, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import { Navigation } from 'swiper/modules';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import 'swiper/css';
import 'swiper/css/navigation';
import { fetchRegionsLast24Hours } from '@/api/regions';
import type { Region } from '@/types/api';
import { useApiQuery } from '@/hooks/useApiQuery';
import { formatCo2e, formatEnergy, formatIntensity } from '@/utils/format';

function regionTitle(region: Region): string {
    return region.city ?? region.region ?? region.code;
}

function RegionCard({ region }: { region: Region }) {
    return (
        <div className="h-full rounded-xl border border-white/10 bg-white/5 p-4 text-left text-white transition-colors hover:bg-white/10">
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
                        <p className="mt-1 text-xs text-amber-300">
                            {region.statusCounts.metricsMissing} sem métricas
                        </p>
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
    );
}

export function RegionPage() {

    const fetcher = useCallback(() => fetchRegionsLast24Hours(), []);
    const { data: regions, isLoading, error } = useApiQuery(fetcher);

    const swiperRef = useRef<SwiperType | null>(null);
    const [prevEl, setPrevEl] = useState<HTMLButtonElement | null>(null);
    const [nextEl, setNextEl] = useState<HTMLButtonElement | null>(null);

    if (isLoading) return <main className="mx-auto max-w-7xl p-6">Carregando regiões...</main>;

    if (error) return (<main role="alert" className="mx-auto max-w-7xl p-6">{error}</main>);

    if (!regions?.length) return <main className="mx-auto max-w-7xl p-6">Nenhuma região disponível.</main>;

    return (
        <main className="mx-auto max-w-7xl space-y-6 p-6">
            <header className="space-y-2">
                <h1 className="text-3xl font-semibold">Regiões</h1>
                <p className="text-muted-foreground">
                    Intensidade de carbono de cada região e o impacto dos serviços hospedados nela
                </p>
            </header>

            {/* Versão mobile e tablet (grid) */}
            <section className="xl:hidden">
                <div className="mx-auto grid w-full max-w-[400px] grid-cols-1 gap-4 md:max-w-none md:grid-cols-2 md:gap-x-10 md:gap-y-5">
                    {regions.map((region) => (
                        <RegionCard key={region.code} region={region} />
                    ))}
                </div>
            </section>

            {/* Versão desktop (slider com navegação) */}
            <section className="hidden xl:block">
                <div className="region-slider relative px-12">
                    <button ref={setPrevEl} type="button" aria-label="Região anterior" className="swiper-button-prev !left-0" onClick={() => swiperRef.current?.slidePrev()}>
                        <ChevronLeft className="size-5" />
                    </button>

                    <Swiper
                        modules={[Navigation]}
                        navigation={{
                            prevEl,
                            nextEl,
                        }}
                        onSwiper={(swiper) => {
                            swiperRef.current = swiper;
                        }}
                        slidesPerView={4}
                        spaceBetween={16}
                        className="w-full"
                    >
                        {regions.map((region) => (
                            <SwiperSlide key={region.code}>
                                <RegionCard region={region} />
                            </SwiperSlide>
                        ))}
                    </Swiper>

                    <button ref={setNextEl} type="button" aria-label="Próxima região" className="swiper-button-next !right-0"onClick={() => swiperRef.current?.slideNext()}>
                        <ChevronRight className="size-5" />
                    </button>
                </div>
            </section>
        </main>
    );
}
