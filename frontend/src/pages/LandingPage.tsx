import { useRef, useState, useEffect, useMemo } from 'react';
import type { GlobeViewHandle } from '../components/3d/GlobeView';
import { ExploreSection } from '../components/landing/ExploreSection';
import { fetchRegionsLast24Hours } from '@/api/regions';
import { useApiQuery } from '@/hooks/useApiQuery';
import { GlobeView } from '../components/3d/GlobeView';
import { useServices } from '@/hooks/useServices';

export function LandingPage() {
    const globeRef = useRef<GlobeViewHandle>(null);
    const exploreRef = useRef<HTMLElement>(null);
    const exploreContainerRef = useRef<HTMLDivElement>(null);
    const globeTargetRef = useRef<HTMLDivElement>(null);
    const globeLayerRef = useRef<HTMLDivElement>(null);

    const [globeProgress, setGlobeProgress] = useState(0);
    const [globeTarget, setGlobeTarget] = useState({ x: 0, y: 0 });
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [autoRotate, setAutoRotate] = useState(true);
    const [force2D, setForce2D] = useState(false);

    useEffect(() => {
        const updateGlobe = () => {
            const section = exploreContainerRef.current;
            const target = globeTargetRef.current;
            const layer = globeLayerRef.current;

            if (!section || !target || !layer) return;

            const sectionRect = section.getBoundingClientRect();
            const targetRect = target.getBoundingClientRect();
            const layerRect = layer.getBoundingClientRect();

            const progress = Math.max(
                0,
                Math.min(1, (window.innerHeight - sectionRect.top) / (window.innerHeight * 0.7)),
            );

            setGlobeProgress(progress);

            setGlobeTarget({
                x: targetRect.left + targetRect.width / 2 - layerRect.left,
                y: targetRect.top + targetRect.height / 2 - layerRect.top,
            });
        };

        updateGlobe();

        window.addEventListener('scroll', updateGlobe, { passive: true });
        window.addEventListener('resize', updateGlobe);

        return () => {
            window.removeEventListener('scroll', updateGlobe);
            window.removeEventListener('resize', updateGlobe);
        };
    }, []);

    const { services, error } = useServices();
    const {
        data: regions,
        error: regionsError,
        isLoading: regionsLoading,
    } = useApiQuery(fetchRegionsLast24Hours);

    const markers = useMemo(
        () =>
            services.flatMap((service) => {
                const location = service.location;

                if (location?.latitude == null || location.longitude == null) {
                    return [];
                }

                return [
                    {
                        id: service.id,
                        name: service.name,
                        latitude: location.latitude,
                        longitude: location.longitude,
                        status: service.status,
                    },
                ];
            }),
        [services],
    );

    const selectRegion = (code: string) => {
        setSelectedCode(code);
    };

    const rotateLeft = () => {
        globeRef.current?.rotateLeft();
    };

    const rotateRight = () => {
        globeRef.current?.rotateRight();
    };

    const backToGlobal = () => {
        setSelectedCode(null);
        globeRef.current?.resetView();
    };

    const zoom = (factor: number) => {
        globeRef.current?.zoom(factor);
    };

    if (error || regionsError) {
        return (
            <main className="p-6 text-foreground">
                Não foi possível carregar os dados dos serviços ou das regiões.
            </main>
        );
    }

    return (
        <main className="relative bg-[radial-gradient(ellipse_at_50%_120%,#0c1d45_0%,#090d1b_60%)] pt-20 pb-0 text-foreground">
            <section
                id="sobre"
                className="relative z-10 flex min-h-[calc(100svh-6rem)] flex-col justify-center px-6 py-8 md:px-12"
            >
                <div className="mx-auto w-full max-w-6xl">
                    <span className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-400">
                        Sobre o GreenER
                    </span>

                    <h1 className="mt-5 max-w-4xl text-4xl font-bold leading-tight text-white md:text-6xl">
                        Dados ambientais para decisões mais sustentáveis.
                    </h1>

                    <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
                        Uma plataforma para explorar indicadores ambientais, acompanhar o consumo de
                        energia e visualizar informações relacionadas às emissões de CO₂ por região.
                    </p>

                    <a
                        href="#explorar"
                        className="mt-8 inline-flex items-center rounded-lg bg-cyan-500 px-5 py-3 font-semibold text-slate-950 transition-colors hover:bg-cyan-400"
                    >
                        Explorar regiões
                    </a>
                </div>
            </section>

            <div
                ref={globeLayerRef}
                className="pointer-events-none fixed inset-x-0 top-24 bottom-0 z-0"
            >
                <GlobeView
                    ref={globeRef}
                    autoRotate={autoRotate}
                    progress={globeProgress}
                    targetPosition={globeTarget}
                    markers={markers}
                />
            </div>

            <div
                ref={exploreContainerRef}
                id="explorar"
                className="scroll-mt-24 grid grid-cols-1 gap-6 px-6 pt-2 pb-0 md:grid-cols-[minmax(0,560px)_minmax(0,1fr)]"
            >
                <div className="min-w-0">
                    {regionsLoading && (
                        <p className="text-white/60">Carregando totais das últimas 24 horas...</p>
                    )}
                    <ExploreSection
                        exploreRef={exploreRef}
                        rotateLeft={rotateLeft}
                        rotateRight={rotateRight}
                        dataSource="internal"
                        selectedCode={selectedCode}
                        autoRotate={autoRotate}
                        setAutoRotate={setAutoRotate}
                        force2D={force2D}
                        setForce2D={setForce2D}
                        backToGlobal={backToGlobal}
                        zoom={zoom}
                        regions={regions ?? []}
                        onSelectRegion={selectRegion}
                    />
                </div>

                <div ref={globeTargetRef} className="min-w-0"></div>
            </div>
        </main>
    );
}
