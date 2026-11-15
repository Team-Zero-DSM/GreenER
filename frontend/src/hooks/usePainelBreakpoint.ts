import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { PainelBreakpoint } from '@/types/painel';

// Tamanho de tela em que o painel está sendo exibido. Os limites são os mesmos
// das classes md: (768 px) e lg: (1024 px) usadas na grade.
export function usePainelBreakpoint(): PainelBreakpoint {
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const isTablet = useMediaQuery('(min-width: 768px)');

    if (isDesktop) return 'desktop';

    return isTablet ? 'tablet' : 'mobile';
}
