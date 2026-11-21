
import {
    useLayoutEffect,
    useRef,
    useState,
    type ReactNode,
} from 'react';

interface AnimatedContentProps {
    children: ReactNode;
    animationKey: string;
    className?: string;
}

export function AnimatedContent({
    children,
    animationKey,
    className = '',
}: AnimatedContentProps) {
    const contentRef = useRef<HTMLDivElement>(null);
    const previousKeyRef = useRef(animationKey);

    const [height, setHeight] = useState<number | null>(null);

    // Observa o conteúdo e acompanha suas mudanças de altura.
    useLayoutEffect(() => {
        const content = contentRef.current;

        if (!content) return;

        const updateHeight = () => {
            setHeight(content.getBoundingClientRect().height);
        };

        const resizeObserver = new ResizeObserver(updateHeight);

        resizeObserver.observe(content);
        updateHeight();

        return () => {
            resizeObserver.disconnect();
        };
    }, []);

    // Anima a entrada do conteúdo quando a seção muda.
    useLayoutEffect(() => {
        if (previousKeyRef.current === animationKey) return;

        previousKeyRef.current = animationKey;

        const content = contentRef.current;

        if (!content) return;

        // Respeita a preferência por movimento reduzido.
        if (
            window.matchMedia('(prefers-reduced-motion: reduce)').matches
        ) {
            return;
        }

        const animation = content.animate(
            [
                {
                    opacity: 0,
                    transform: 'translateY(8px)',
                },
                {
                    opacity: 1,
                    transform: 'translateY(0)',
                },
            ],
            {
                duration: 240,
                easing: 'cubic-bezier(0.22, 1, 0.36, 1)',
            },
        );

        return () => animation.cancel();
    }, [animationKey]);

    return (
        <div
            className={`w-full overflow-hidden transition-[height] duration-300 ease-in-out motion-reduce:transition-none ${className}`}
            style={
                height !== null
                    ? { height: `${height}px` }
                    : undefined
            }
        >
            <div ref={contentRef}>{children}</div>
        </div>
    );
}
