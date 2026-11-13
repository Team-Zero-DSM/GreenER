import type { PainelWidget, PainelWidgetType } from '@/types/painel';

import { PAINEL_GRID_COLUMNS } from './painelLayoutPadrao';

// Menor tamanho (em colunas e linhas) em que cada tipo de widget continua legível.
export const PAINEL_WIDGET_MIN_SIZE: Record<PainelWidgetType, { w: number; h: number }> = {
    kpi: { w: 2, h: 2 },
    'serie-temporal': { w: 4, h: 3 },
    distribuicao: { w: 3, h: 3 },
    tabela: { w: 3, h: 3 },
    status: { w: 3, h: 3 },
};

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

// Devolve a lista com o widget no novo tamanho, sem passar do tamanho mínimo do
// tipo nem da borda direita da grade.
export function resizeWidget(
    widgets: readonly PainelWidget[],
    id: string,
    w: number,
    h: number,
): PainelWidget[] {
    return widgets.map((widget) => {
        if (widget.id !== id) {
            return widget;
        }

        const minimum = PAINEL_WIDGET_MIN_SIZE[widget.type];

        return {
            ...widget,
            w: Math.min(Math.max(w, minimum.w), PAINEL_GRID_COLUMNS - widget.x),
            h: Math.max(h, minimum.h),
        };
    });
}
