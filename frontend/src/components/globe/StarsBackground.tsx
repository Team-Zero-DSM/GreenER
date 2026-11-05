import { useEffect, useMemo, useRef } from 'react';

const STAR_COUNT = 450;

export function StarsBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const stars = useMemo(
        () =>
            Array.from({ length: STAR_COUNT }, () => ({
                x: Math.random(),
                y: Math.random(),
                r: 0.4 + Math.random() * 1.1,
                a: 0.35 + Math.random() * 0.5,
            })),
        [],
    );

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const draw = () => {
            const dpr = Math.min(window.devicePixelRatio, 2);
            const width = canvas.clientWidth;
            const height = canvas.clientHeight;
            if (!width || !height) return;

            canvas.width = width * dpr;
            canvas.height = height * dpr;

            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            ctx.scale(dpr, dpr);
            ctx.fillStyle = '#bae6fd';

            for (const star of stars) {
                ctx.globalAlpha = star.a;
                ctx.beginPath();
                ctx.arc(star.x * width, star.y * height, star.r, 0, Math.PI * 2);
                ctx.fill();
            }
        };

        draw();
        const observer = new ResizeObserver(draw);
        observer.observe(canvas);
        return () => observer.disconnect();
    }, [stars]);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden="true"
            className="absolute inset-0 h-full w-full"
        />
    );
}