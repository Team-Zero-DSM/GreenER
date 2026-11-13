import type { PainelWidget } from '@/types/painel';

import { PAINEL_GRID_COLUMNS } from './painelLayoutPadrao';

// Devolve a lista com o widget na nova posição. A coluna é limitada para o widget
// não sair pela lateral da grade, e a linha não pode ser negativa.
export function moveWidget(
    widgets: readonly PainelWidget[],
    id: string,
    x: number,
    y: number,
): PainelWidget[] {
    return widgets.map((widget) => {
        if (widget.id !== id) {
            return widget;
        }

        return {
            ...widget,
            x: Math.min(Math.max(x, 0), PAINEL_GRID_COLUMNS - widget.w),
            y: Math.max(y, 0),
        };
    });
}
