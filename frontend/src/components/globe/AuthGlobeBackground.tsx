
import { useEffect, useRef, useState } from 'react';

import {
    GlobeView,
    type GlobeMarker,
    type GlobeState,
} from './GlobeView';

const EMPTY_MARKERS: GlobeMarker[] = [];

type ViewportSize = 'mobile' | 'tablet' | 'desktop';

// Identifica a faixa de largura atual.
function getViewportSize(): ViewportSize {
    const width = window.innerWidth;

    if (width < 640) return 'mobile';
    if (width < 1024) return 'tablet';

    return 'desktop';
}

export function AuthGlobeBackground() {
    const globeState = useRef<GlobeState>({
        progress: 0,
        target: { x: 0, y: 0 },
        lon: -90,
    });

    const [viewport, setViewport] = useState<ViewportSize>(
        getViewportSize,
    );

    const [reduceMotion, setReduceMotion] = useState(
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

    // Atualiza a configuração do globo conforme a largura da tela.
    useEffect(() => {
        const updateViewport = () => {
            setViewport(getViewportSize());
        };

        window.addEventListener('resize', updateViewport);

        return () => {
            window.removeEventListener('resize', updateViewport);
        };
    }, []);

    // Respeita a preferência por movimento reduzido.
    useEffect(() => {
        const mediaQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        const handleChange = (event: MediaQueryListEvent) => {
            setReduceMotion(event.matches);
        };

        mediaQuery.addEventListener('change', handleChange);

        return () => {
            mediaQuery.removeEventListener('change', handleChange);
        };
    }, []);

    // Configurações específicas de cada dispositivo.
    const globeSettings = {
        mobile: {
            cameraDistance: 3.6,
            globeScale: 1.1,
            verticalOffset: -1.35,
            atmosphereIntensity: 0.45,
            opacity: 0.68,
        },
        tablet: {
            cameraDistance: 3.2,
            globeScale: 1.45,
            verticalOffset: -1.65,
            atmosphereIntensity: 0.75,
            opacity: 0.82,
        },
        desktop: {
            cameraDistance: 2.9,
            globeScale: 1.72,
            verticalOffset: -1.8,
            atmosphereIntensity: 1,
            opacity: 0.9,
        },
    }[viewport];

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            {/* Brilho atmosférico atrás do planeta. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_96%,rgba(14,165,233,0.14),transparent_55%)] sm:bg-[radial-gradient(ellipse_at_50%_88%,rgba(14,165,233,0.16),transparent_50%)]" />

            {/* Cena 3D ocupando toda a tela. */}
            <div
                className="absolute inset-0"
                style={{ opacity: globeSettings.opacity }}
            >
                <GlobeView
                    autoRotate={!reduceMotion}
                    rotationSpeed={0.2}
                    stateRef={globeState}
                    focusTarget={null}
                    markers={EMPTY_MARKERS}
                    cameraDistance={globeSettings.cameraDistance}
                    globeScale={globeSettings.globeScale}
                    verticalOffset={globeSettings.verticalOffset}
                    atmosphereIntensity={globeSettings.atmosphereIntensity}
                    backlit
                />
            </div>

            {/* Integração do fundo com a tela de autenticação. */}
            <div className="absolute inset-0 bg-linear-to-b from-[#050816]/45 via-transparent to-[#050816]/55" />
        </div>
    );
}
