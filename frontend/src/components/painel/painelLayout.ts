import type { PainelKpiData, PainelWidget, PainelWidgetType } from '@/types/painel';

import { PAINEL_GRID_COLUMNS } from './painelLayoutPadrao';

// Menor tamanho (em colunas e linhas) em que cada tipo de widget continua legível.
export const PAINEL_WIDGET_MIN_SIZE: Record<PainelWidgetType, { w: number; h: number }> = {
    kpi: { w: 2, h: 2 },
    'serie-temporal': { w: 4, h: 3 },
    distribuicao: { w: 3, h: 3 },
    tabela: { w: 3, h: 3 },
    status: { w: 3, h: 3 },
};

// As funções abaixo recebem em `columns` a quantidade de colunas da grade em uso
// (12 no desktop, 6 no tablet), para valerem em qualquer tamanho de tela.

// Devolve a lista com o widget na nova posição. A coluna é limitada para o widget
// não sair pela lateral da grade, e a linha não pode ser negativa.
export function moveWidget(
    widgets: readonly PainelWidget[],
    id: string,
    x: number,
    y: number,
    columns = PAINEL_GRID_COLUMNS,
): PainelWidget[] {
    return widgets.map((widget) => {
        if (widget.id !== id) {
            return widget;
        }

        return {
            ...widget,
            x: Math.min(Math.max(x, 0), columns - widget.w),
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
    columns = PAINEL_GRID_COLUMNS,
): PainelWidget[] {
    return widgets.map((widget) => {
        if (widget.id !== id) {
            return widget;
        }

        const minimum = PAINEL_WIDGET_MIN_SIZE[widget.type];

        return {
            ...widget,
            w: Math.min(Math.max(w, minimum.w), columns - widget.x),
            h: Math.max(h, minimum.h),
        };
    });
}

// Dois widgets se sobrepõem quando seus retângulos se cruzam na grade.
function widgetsOverlap(a: PainelWidget, b: PainelWidget): boolean {
    return a.x < b.x + b.w && b.x < a.x + a.w && a.y < b.y + b.h && b.y < a.y + a.h;
}

function byRowThenColumn(a: PainelWidget, b: PainelWidget): number {
    return a.y - b.y || a.x - b.x;
}

// Reorganiza a grade para que nenhum widget fique sobre outro. O widget que o
// usuário acabou de mover ou redimensionar (fixedId) fica onde foi solto e os
// demais descem até caber. No fim, todos sobem para fechar as linhas vazias.
// A ordem da lista é mantida, só as posições mudam.
export function arrangeWidgets(widgets: readonly PainelWidget[], fixedId?: string): PainelWidget[] {
    const fixed = widgets.find((widget) => widget.id === fixedId);
    const placed: PainelWidget[] = fixed ? [fixed] : [];

    // 1. Empurra para baixo quem estiver em cima de um widget já posicionado.
    for (const widget of widgets.filter((item) => item !== fixed).sort(byRowThenColumn)) {
        let candidate = widget;

        while (placed.some((other) => widgetsOverlap(candidate, other))) {
            candidate = { ...candidate, y: candidate.y + 1 };
        }

        placed.push(candidate);
    }

    // 2. Sobe cada widget até encostar na borda de cima ou em outro widget.
    const compacted: PainelWidget[] = [];

    for (const widget of placed.sort(byRowThenColumn)) {
        let candidate = widget;

        while (candidate.y > 0) {
            const above = { ...candidate, y: candidate.y - 1 };

            if (compacted.some((other) => widgetsOverlap(above, other))) {
                break;
            }

            candidate = above;
        }

        compacted.push(candidate);
    }

    const positions = new Map(compacted.map((widget) => [widget.id, widget]));

    return widgets.map((widget) => positions.get(widget.id) ?? widget);
}

// Adiciona um widget no primeiro espaço livre em que ele couber, procurando linha
// por linha, da esquerda para a direita. Se não houver vão, ele entra no fim do painel.
export function addWidget(
    widgets: readonly PainelWidget[],
    widget: PainelWidget,
    columns = PAINEL_GRID_COLUMNS,
): PainelWidget[] {
    const lastRow = Math.max(0, ...widgets.map((item) => item.y + item.h));

    for (let y = 0; y <= lastRow; y += 1) {
        for (let x = 0; x <= columns - widget.w; x += 1) {
            const candidate = { ...widget, x, y };

            if (!widgets.some((other) => widgetsOverlap(candidate, other))) {
                return arrangeWidgets([...widgets, candidate]);
            }
        }
    }

    return arrangeWidgets([...widgets, { ...widget, x: 0, y: lastRow }]);
}

// Remove um widget e sobe os que estavam abaixo dele para ocupar o espaço.
export function removeWidget(widgets: readonly PainelWidget[], id: string): PainelWidget[] {
    return arrangeWidgets(widgets.filter((widget) => widget.id !== id));
}

// Diz se o valor do indicador passou do limite de alerta configurado no widget.
export function isAlerting(widget: PainelWidget, data: PainelKpiData): boolean {
    if (!widget.alert) {
        return false;
    }

    return widget.alert.direction === 'acima'
        ? data.value > widget.alert.threshold
        : data.value < widget.alert.threshold;
}
