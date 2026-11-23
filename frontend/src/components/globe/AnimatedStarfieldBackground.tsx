import { useEffect, useRef } from 'react';
import * as THREE from 'three';

import { createAnimatedStarfield } from './animatedStarfield';

interface AnimatedStarfieldBackgroundProps {
    className?: string;
}

export function AnimatedStarfieldBackground({ className = '' }: AnimatedStarfieldBackgroundProps) {
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;

        if (!container) return;

        // Inicialização da cena independente para o fundo.
        const scene = new THREE.Scene();

        const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
        camera.position.z = 0;

        const pixelRatio = Math.min(window.devicePixelRatio || 1, 2);

        const renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: true,
        });

        renderer.setPixelRatio(pixelRatio);
        renderer.setClearColor(0x000000, 0);
        renderer.outputColorSpace = THREE.SRGBColorSpace;

        renderer.domElement.style.display = 'block';
        renderer.domElement.style.position = 'absolute';
        renderer.domElement.style.inset = '0';
        renderer.domElement.style.width = '100%';
        renderer.domElement.style.height = '100%';

        container.appendChild(renderer.domElement);

        const starfield = createAnimatedStarfield(scene, camera, pixelRatio);

        // Responsividade do renderizador.
        const resize = () => {
            const width = container.clientWidth;
            const height = container.clientHeight;

            if (!width || !height) return;

            camera.aspect = width / height;
            camera.updateProjectionMatrix();

            renderer.setSize(width, height);
        };

        resize();

        const resizeObserver = new ResizeObserver(resize);
        resizeObserver.observe(container);

        // Respeita a preferência de movimento reduzido.
        const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

        let reducedMotion = motionQuery.matches;

        const handleMotionChange = (event: MediaQueryListEvent) => {
            reducedMotion = event.matches;
        };

        motionQuery.addEventListener('change', handleMotionChange);

        // Ciclo de animação.
        let animationId = 0;
        let previousTime = 0;

        const animate = (time: number) => {
            animationId = requestAnimationFrame(animate);

            const delta = previousTime ? Math.min((time - previousTime) / 1000, 0.05) : 0;

            previousTime = time;

            starfield.update(delta, reducedMotion);

            renderer.render(scene, camera);
        };

        animate(0);

        // Liberação dos recursos.
        return () => {
            cancelAnimationFrame(animationId);
            resizeObserver.disconnect();

            motionQuery.removeEventListener('change', handleMotionChange);

            starfield.dispose();

            renderer.dispose();
            renderer.domElement.remove();
        };
    }, []);

    return (
        <div
            ref={containerRef}
            aria-hidden="true"
            className={`pointer-events-none absolute inset-0 z-0 overflow-hidden ${className}`}
        />
    );
}
