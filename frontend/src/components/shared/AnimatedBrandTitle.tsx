
import { useEffect, useRef, useState } from 'react';

interface Particle {
    startX: number;
    startY: number;
    targetX: number;
    targetY: number;
    color: string;
    alpha: number;
    size: number;
    delay: number;
    arc: number;
    sparkle: boolean;
}

const ANIMATION_DURATION = 1900;
const SAMPLE_SPACING = 3;

const clamp = (value: number, min = 0, max = 1) =>
    Math.min(Math.max(value, min), max);

const easeOutCubic = (value: number) =>
    1 - Math.pow(1 - value, 3);

export function AnimatedBrandTitle() {
    const titleRef = useRef<HTMLHeadingElement>(null);
    const greenRef = useRef<HTMLSpanElement>(null);
    const erRef = useRef<HTMLSpanElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const [consolidated, setConsolidated] = useState(false);

    useEffect(() => {
        const title = titleRef.current;
        const green = greenRef.current;
        const er = erRef.current;
        const canvas = canvasRef.current;

        if (!title || !green || !er || !canvas) return;

        const context = canvas.getContext('2d');

        if (!context) return;

        const motionQuery = window.matchMedia(
            '(prefers-reduced-motion: reduce)',
        );

        let reducedMotion = motionQuery.matches;
        let animationFinished = false;
        let disposed = false;

        let animationFrame = 0;
        let animationStartedAt = 0;

        let particles: Particle[] = [];

        let previousWidth = 0;
        let previousHeight = 0;
        let pixelRatio = 1;

        // Gera a máscara e define a posição final de cada partícula.
        const buildParticles = (force = false) => {
            if (animationFinished || disposed) return;

            const bounds = title.getBoundingClientRect();

            const width = bounds.width;
            const height = bounds.height;

            if (!width || !height) return;

            if (
                !force &&
                Math.abs(width - previousWidth) < 0.5 &&
                Math.abs(height - previousHeight) < 0.5
            ) {
                return;
            }

            previousWidth = width;
            previousHeight = height;

            pixelRatio = Math.min(
                window.devicePixelRatio || 1,
                2,
            );

            // A área de desenho fica maior que o próprio título.
            // Isso permite visualizar as partículas desde o início.
            const bleed = Math.max(
                220,
                Math.ceil(height * 1.8),
            );

            const canvasWidth = width + bleed * 2;
            const canvasHeight = height + bleed * 2;

            canvas.width = Math.ceil(canvasWidth * pixelRatio);
            canvas.height = Math.ceil(canvasHeight * pixelRatio);

            canvas.style.width = `${canvasWidth}px`;
            canvas.style.height = `${canvasHeight}px`;
            canvas.style.left = `${-bleed}px`;
            canvas.style.top = `${-bleed}px`;

            // Canvas auxiliar para identificar os pixels das letras.
            const buffer = document.createElement('canvas');

            buffer.width = canvas.width;
            buffer.height = canvas.height;

            const bufferContext = buffer.getContext('2d', {
                willReadFrequently: true,
            });

            if (!bufferContext) return;

            bufferContext.scale(pixelRatio, pixelRatio);
            bufferContext.textBaseline = 'alphabetic';

            const gradient = bufferContext.createLinearGradient(
                bleed,
                0,
                bleed + width,
                0,
            );

            gradient.addColorStop(0, '#6ee7b7');
            gradient.addColorStop(1, '#22d3ee');

            bufferContext.fillStyle = gradient;

            // Desenha cada segmento respeitando seu peso tipográfico.
            const drawTextSegment = (
                element: HTMLElement,
                text: string,
            ) => {
                const elementBounds = element.getBoundingClientRect();
                const style = window.getComputedStyle(element);

                bufferContext.font = [
                    style.fontStyle,
                    style.fontWeight,
                    style.fontSize,
                    style.fontFamily,
                ].join(' ');

                const metrics = bufferContext.measureText(text);

                const ascent =
                    metrics.actualBoundingBoxAscent || 60;

                const descent =
                    metrics.actualBoundingBoxDescent || 15;

                const x =
                    elementBounds.left -
                    bounds.left +
                    bleed;

                const centerY =
                    elementBounds.top -
                    bounds.top +
                    elementBounds.height / 2 +
                    bleed;

                const baselineY =
                    centerY + (ascent - descent) / 2;

                const letterSpacing =
                    Number.parseFloat(style.letterSpacing) || 0;

                if (Math.abs(letterSpacing) < 0.1) {
                    bufferContext.fillText(
                        text,
                        x,
                        baselineY,
                    );

                    return;
                }

                let cursorX = x;

                for (const character of text) {
                    bufferContext.fillText(
                        character,
                        cursorX,
                        baselineY,
                    );

                    cursorX +=
                        bufferContext.measureText(character).width +
                        letterSpacing;
                }
            };

            drawTextSegment(green, 'Green');
            drawTextSegment(er, 'ER');

            const image = bufferContext.getImageData(
                0,
                0,
                buffer.width,
                buffer.height,
            );

            const data = image.data;

            const samplingStep = Math.max(
                3,
                Math.round(SAMPLE_SPACING * pixelRatio),
            );

            const nextParticles: Particle[] = [];

            // Quanto maior o bleed, maior a distância de dispersão.
            const spreadRadius = bleed;

            for (
                let y = 0;
                y < buffer.height;
                y += samplingStep
            ) {
                for (
                    let x = 0;
                    x < buffer.width;
                    x += samplingStep
                ) {
                    const index = (y * buffer.width + x) * 4;
                    const alpha = data[index + 3] / 255;

                    if (alpha < 0.35) continue;

                    const targetX = x / pixelRatio;
                    const targetY = y / pixelRatio;

                    const angle = Math.random() * Math.PI * 2;

                    const distance =
                        spreadRadius *
                        (0.68 + Math.random() * 0.25);

                    nextParticles.push({
                        targetX,
                        targetY,

                        startX:
                            targetX + Math.cos(angle) * distance,

                        startY:
                            targetY + Math.sin(angle) * distance,

                        color: `rgb(${data[index]}, ${data[index + 1]}, ${data[index + 2]})`,

                        alpha,

                        size: 0.65 + Math.random() * 0.75,

                        delay: Math.random() * 0.2,

                        arc: (Math.random() - 0.5) * 14,

                        sparkle: Math.random() < 0.05,
                    });
                }
            }

            particles = nextParticles;

            if (reducedMotion) {
                animationFinished = true;
                setConsolidated(true);
            } else {
                startAnimation();
            }
        };

        // Desenha todas as partículas no Canvas.
        const renderParticles = (time: number) => {
            context.setTransform(
                pixelRatio,
                0,
                0,
                pixelRatio,
                0,
                0,
            );

            context.clearRect(
                0,
                0,
                canvas.width / pixelRatio,
                canvas.height / pixelRatio,
            );

            context.globalCompositeOperation = 'lighter';

            const elapsed = time - animationStartedAt;

            const progress = clamp(
                elapsed / ANIMATION_DURATION,
            );

            for (const particle of particles) {
                const localProgress = clamp(
                    (progress - particle.delay) /
                        (1 - particle.delay),
                );

                const eased = easeOutCubic(localProgress);

                const arcOffset =
                    Math.sin(eased * Math.PI) *
                    particle.arc *
                    (1 - eased);

                const x =
                    particle.startX +
                    (particle.targetX - particle.startX) * eased +
                    arcOffset;

                const y =
                    particle.startY +
                    (particle.targetY - particle.startY) * eased +
                    arcOffset * 0.35;

                const opacity =
                    particle.alpha * (0.55 + eased * 0.45);

                // Brilho externo.
                context.globalAlpha = opacity * 0.18;
                context.fillStyle = particle.color;

                context.beginPath();
                context.arc(
                    x,
                    y,
                    particle.size * 2.8,
                    0,
                    Math.PI * 2,
                );
                context.fill();

                // Núcleo da partícula.
                context.globalAlpha = opacity;

                context.beginPath();
                context.arc(
                    x,
                    y,
                    particle.size,
                    0,
                    Math.PI * 2,
                );
                context.fill();

                // Pequenos brilhos em algumas partículas.
                if (particle.sparkle) {
                    const sparkleSize = particle.size * 2.5;

                    context.globalAlpha = opacity * 0.45;
                    context.strokeStyle = particle.color;
                    context.lineWidth = 0.6;

                    context.beginPath();
                    context.moveTo(x - sparkleSize, y);
                    context.lineTo(x + sparkleSize, y);

                    context.moveTo(x, y - sparkleSize);
                    context.lineTo(x, y + sparkleSize);

                    context.stroke();
                }
            }

            context.globalAlpha = 1;
            context.globalCompositeOperation = 'source-over';

            return progress;
        };

        // Executa a animação uma única vez.
        const animate = (time: number) => {
            if (disposed) return;

            const progress = renderParticles(time);

            if (progress >= 1) {
                // O formato já está completo.
                // O texto sólido assume o lugar das partículas.
                animationFinished = true;
                setConsolidated(true);
                return;
            }

            animationFrame = requestAnimationFrame(animate);
        };

        const startAnimation = () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            if (reducedMotion || animationFinished) {
                setConsolidated(true);
                return;
            }

            animationStartedAt = performance.now();

            setConsolidated(false);

            animationFrame = requestAnimationFrame(animate);
        };

        const handleMotionChange = (
            event: MediaQueryListEvent,
        ) => {
            reducedMotion = event.matches;

            if (reducedMotion) {
                animationFinished = true;

                if (animationFrame) {
                    cancelAnimationFrame(animationFrame);
                }

                setConsolidated(true);
            }
        };

        const handleResize = () => {
            if (animationFinished) return;

            buildParticles();
        };

        motionQuery.addEventListener('change', handleMotionChange);

        const resizeObserver = new ResizeObserver(handleResize);

        resizeObserver.observe(title);

        window.addEventListener('resize', handleResize);

        // Aguarda a fonte definitiva antes de gerar a máscara.
        document.fonts.ready.then(() => {
            if (disposed) return;

            buildParticles(true);
        });

        return () => {
            disposed = true;

            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }

            resizeObserver.disconnect();

            window.removeEventListener('resize', handleResize);

            motionQuery.removeEventListener(
                'change',
                handleMotionChange,
            );
        };
    }, []);

    return (
        <h1
            ref={titleRef}
            aria-label="GreenER"
            className="relative inline-flex items-baseline whitespace-nowrap text-6xl font-extrabold leading-none tracking-tight sm:text-8xl md:text-9xl"
        >
            {/* Texto definitivo: substitui as partículas. */}
            <span
                className={`
                    bg-linear-to-r from-emerald-300 to-cyan-400
                    bg-clip-text text-transparent
                    transition-opacity duration-500 ease-out
                    ${consolidated ? 'opacity-100' : 'opacity-0'}
                `}
                aria-hidden="true"
            >
                <span ref={greenRef} className="font-extrabold">
                    Green
                </span>

                <span ref={erRef} className="font-light">
                    ER
                </span>
            </span>

            {/* Camada das partículas. */}
            <canvas
                ref={canvasRef}
                aria-hidden="true"
                className={`
                    pointer-events-none absolute
                    transition-opacity duration-500 ease-out
                    ${consolidated ? 'opacity-0' : 'opacity-100'}
                `}
            />
        </h1>
    );
}
