import { useEffect, useRef, useState } from 'react';

import { GlobeView, type GlobeMarker, type GlobeState } from './GlobeView';

const EMPTY_MARKERS: GlobeMarker[] = [];
const COMPACT_BREAKPOINT = '(max-width: 1023px)';
const HORIZONTAL_OFFSET = 60;

// Define a posição do centro do planeta conforme o dispositivo.
function getGlobeTarget(isCompact: boolean) {
    return {
        x: window.innerWidth * (isCompact ? 0.12 : 0.07) + HORIZONTAL_OFFSET,
        y: window.innerHeight * (isCompact ? 0.82 : 0.53),
    };
}

export function ProfileGlobeBackground() {
    const [isCompact, setIsCompact] = useState(() => window.matchMedia(COMPACT_BREAKPOINT).matches);

    const globeState = useRef<GlobeState>({
        progress: 1,
        target: getGlobeTarget(isCompact),
        lon: -90,
    });

    // Reposiciona o planeta quando a tela muda de tamanho.
    useEffect(() => {
        const mediaQuery = window.matchMedia(COMPACT_BREAKPOINT);

        const updatePosition = () => {
            const compact = mediaQuery.matches;

            setIsCompact(compact);
            globeState.current.target = getGlobeTarget(compact);
        };

        updatePosition();

        window.addEventListener('resize', updatePosition);
        mediaQuery.addEventListener('change', updatePosition);

        return () => {
            window.removeEventListener('resize', updatePosition);
            mediaQuery.removeEventListener('change', updatePosition);
        };
    }, []);

    return (
        <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
            {/* Iluminação atmosférica adaptada ao posicionamento. */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_12%_80%,rgba(14,165,233,0.12)_0%,rgba(14,165,233,0.04)_30%,transparent_62%)] lg:bg-[radial-gradient(ellipse_at_12%_54%,rgba(14,165,233,0.16)_0%,rgba(14,165,233,0.06)_30%,transparent_62%)]" />

            {/* Campo de estrelas ocupando toda a tela. */}
            <div className="absolute inset-0 opacity-[0.65] sm:opacity-[0.78] lg:opacity-[0.9]">
                <GlobeView
                    autoRotate
                    rotationSpeed={0.055}
                    stateRef={globeState}
                    focusTarget={null}
                    markers={EMPTY_MARKERS}
                    cameraDistance={4}
                    globeScale={isCompact ? 0.95 : 1.55}
                    atmosphereIntensity={isCompact ? 0.32 : 0.5}
                    backlit
                />
            </div>
        </div>
    );
}
