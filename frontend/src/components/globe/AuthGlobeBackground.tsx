
import { useEffect, useRef, useState } from 'react';

import {
    GlobeView,
    type GlobeMarker,
    type GlobeState,
} from './GlobeView';

const EMPTY_MARKERS: GlobeMarker[] = [];

export function AuthGlobeBackground() {
    const globeState = useRef<GlobeState>({
        progress: 0,
        target: { x: 0, y: 0 },
        lon: -90,
    });

    const [reduceMotion, setReduceMotion] = useState(
        () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    );

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

    return (
        <div
            aria-hidden="true"
            className="pointer-events-none fixed inset-0 z-0 overflow-hidden"
        >
            {/* Brilho atmosférico atrás do planeta. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_88%,rgba(14,165,233,0.16),transparent_50%)]" />

            {/* Cena 3D ocupando toda a tela para distribuir as estrelas. */}
            <div className="absolute inset-0 opacity-[0.9]">
                <GlobeView
                    autoRotate={!reduceMotion}
                    stateRef={globeState}
                    focusTarget={null}
                    markers={EMPTY_MARKERS}
                    cameraDistance={2.9}
                    globeScale={1.72}
                    verticalOffset={-1.8}
                    backlit
                />
            </div>

            {/* Integração com o fundo da aplicação. */}
            <div className="absolute inset-0 bg-linear-to-b from-[#050816]/45 via-transparent to-[#050816]/55" />
        </div>
    );
}
