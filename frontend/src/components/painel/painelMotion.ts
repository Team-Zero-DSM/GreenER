// Movimento do painel: curvas de mola usadas nas animações de arrastar,
// redimensionar e reorganizar os widgets.

export interface PainelSpring {
    easing: string;
    duration: number;
}

// Curva de reserva para navegadores sem suporte a linear() (um leve passo além do
// destino, como uma mola).
const FALLBACK_EASING = 'cubic-bezier(0.22, 1.25, 0.36, 1)';

// Simula uma mola amortecida e transforma o resultado numa curva linear() do CSS,
// que o navegador interpola em qualquer taxa de atualização (60, 120 ou 144 Hz).
function buildSpring(stiffness: number, damping: number, mass = 1): PainelSpring {
    const step = 1 / 240;
    const samples: number[] = [];
    let position = 0;
    let velocity = 0;
    let time = 0;

    // Integra até a mola ficar praticamente parada no destino.
    while (time < 2) {
        const force = -stiffness * (position - 1) - damping * velocity;
        velocity += (force / mass) * step;
        position += velocity * step;
        time += step;
        samples.push(position);

        if (time > 0.1 && Math.abs(position - 1) < 0.001 && Math.abs(velocity) < 0.01) break;
    }

    // Cerca de 60 pontos são suficientes para a curva ficar lisa.
    const stride = Math.max(1, Math.floor(samples.length / 60));
    const points = samples.filter((_, index) => index % stride === 0);
    points.push(1);

    const supportsLinear =
        typeof CSS !== 'undefined' &&
        CSS.supports('animation-timing-function', 'linear(0, 0.5, 1)');

    return {
        easing: supportsLinear
            ? `linear(0, ${points.map((value) => value.toFixed(4)).join(', ')})`
            : FALLBACK_EASING,
        duration: Math.round(time * 1000),
    };
}

// Mola dos widgets que abrem espaço: rápida e quase sem balanço.
export const PAINEL_SPRING_LAYOUT = buildSpring(380, 32);
// Mola do widget solto pelo usuário: um pouco de balanço para dar sensação de peso.
export const PAINEL_SPRING_DROP = buildSpring(300, 22);

// Quem pede menos movimento no sistema vê as mudanças sem animação.
export function prefersReducedMotion(): boolean {
    return (
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches
    );
}
