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

// Calcula a área de interseção entre dois widgets.
function overlapArea(a: PainelWidget, b: PainelWidget): number {
    const width = Math.max(0, Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x));
    const height = Math.max(0, Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y));

    return width * height;
}

// Distância entre os centros de dois widgets.
function centerDistance(a: PainelWidget, b: PainelWidget): number {
    const centerAX = a.x + a.w / 2;
    const centerAY = a.y + a.h / 2;
    const centerBX = b.x + b.w / 2;
    const centerBY = b.y + b.h / 2;

    return Math.hypot(centerAX - centerBX, centerAY - centerBY);
}

function byRowThenColumn(a: PainelWidget, b: PainelWidget): number {
    return a.y - b.y || a.x - b.x;
}

// Procura um espaço livre começando pela linha da posição original.
// Dentro da linha, prioriza as colunas mais próximas da posição original.
// Só procura linhas inferiores quando não encontra espaço na mesma linha.
function findNearestFreePosition(
    widget: PainelWidget,
    origin: { x: number; y: number },
    placed: readonly PainelWidget[],
    columns: number,
): { x: number; y: number } {
    const maxX = Math.max(0, columns - widget.w);

    const xPositions = Array.from({ length: maxX + 1 }, (_, index) => index).sort(
        (a, b) => Math.abs(a - origin.x) - Math.abs(b - origin.x) || a - b,
    );

    const lastOccupiedRow = Math.max(origin.y, 0, ...placed.map((item) => item.y + item.h));

    // Primeiro tenta encontrar espaço na mesma linha da posição original.
    for (const x of xPositions) {
        const candidate = { ...widget, x, y: origin.y };

        if (!placed.some((other) => widgetsOverlap(candidate, other))) {
            return { x, y: origin.y };
        }
    }

    // Não encontrou espaço na mesma linha.
    // Procura nas linhas inferiores, mantendo a proximidade horizontal.
    for (let y = origin.y + 1; y <= lastOccupiedRow; y += 1) {
        for (const x of xPositions) {
            const candidate = { ...widget, x, y };

            if (!placed.some((other) => widgetsOverlap(candidate, other))) {
                return { x, y };
            }
        }
    }

    // Se chegou até aqui, a próxima linha está livre.
    return {
        x: xPositions[0] ?? 0,
        y: lastOccupiedRow + 1,
    };
}

// Movimenta um widget utilizando troca inteligente de posição.
// O widget arrastado tenta ocupar a posição do widget atingido. O widget atingido,
// por sua vez, tenta ocupar a posição original do widget arrastado.
export function moveWidgetWithSwap(
    widgets: readonly PainelWidget[],
    id: string,
    originalPosition: Pick<PainelWidget, 'x' | 'y' | 'w' | 'h'>,
    columns = PAINEL_GRID_COLUMNS,
): PainelWidget[] {
    const moving = widgets.find((widget) => widget.id === id);

    if (!moving) {
        return [...widgets];
    }

    // Identifica os widgets que estão sendo atingidos pelo movimento.
    const collisions = widgets.filter(
        (widget) => widget.id !== id && widgetsOverlap(moving, widget),
    );

    // Sem sobreposição, mantém a posição solicitada e não reorganiza os demais.
    if (collisions.length === 0) {
        return [...widgets];
    }

    // Escolhe o widget com maior área de interseção.
    // Em caso de empate, escolhe o mais próximo do centro do widget arrastado.
    const primaryCollision = [...collisions].sort(
        (a, b) =>
            overlapArea(moving, b) - overlapArea(moving, a) ||
            centerDistance(moving, a) - centerDistance(moving, b),
    )[0];

    // Encaixa o widget arrastado na posição do widget atingido.
    const snapped = {
        ...moving,
        x: Math.min(Math.max(primaryCollision.x, 0), columns - moving.w),
        y: Math.max(primaryCollision.y, 0),
    };

    // Identifica todos os widgets que realmente ficaram sobrepostos
    // depois do encaixe do widget arrastado.
    const displaced = widgets
        .filter((widget) => widget.id !== id && widgetsOverlap(snapped, widget))
        .sort((a, b) => {
            // Prioriza quem consegue ocupar a posição original do widget arrastado.
            const aFits = a.w <= originalPosition.w && a.h <= originalPosition.h ? 0 : 1;
            const bFits = b.w <= originalPosition.w && b.h <= originalPosition.h ? 0 : 1;

            return aFits - bFits || byRowThenColumn(a, b);
        });

    if (displaced.length === 0) {
        return widgets.map((widget) => (widget.id === id ? snapped : widget));
    }

    const displacedIds = new Set(displaced.map((widget) => widget.id));

    // O widget arrastado mantém a posição escolhida.
    // Os widgets que não foram atingidos continuam exatamente onde estavam.
    const placed: PainelWidget[] = [
        snapped,
        ...widgets.filter((widget) => widget.id !== id && !displacedIds.has(widget.id)),
    ];

    // Reposiciona somente os widgets que foram atingidos.
    for (const widget of displaced) {
        const position = findNearestFreePosition(
            widget,
            {
                x: originalPosition.x,
                y: originalPosition.y,
            },
            placed,
            columns,
        );

        placed.push({
            ...widget,
            x: position.x,
            y: position.y,
        });
    }

    const positions = new Map(placed.map((widget) => [widget.id, widget]));

    // Mantém a ordem original da lista, alterando somente as posições.
    return widgets.map((widget) => positions.get(widget.id) ?? widget);
}

// Reorganiza a grade para que nenhum widget fique sobre outro. O widget que o
// usuário acabou de redimensionar (fixedId) fica onde foi solto e os demais
// descem até caber. No fim, todos sobem para fechar as linhas vazias.
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

// Troca um widget de lugar com o vizinho de cima (-1) ou de baixo (+1) na lista.
// É como a ordem é alterada no celular, onde os widgets ficam empilhados.
export function shiftWidget(
    widgets: readonly PainelWidget[],
    id: string,
    direction: -1 | 1,
): PainelWidget[] {
    const index = widgets.findIndex((widget) => widget.id === id);
    const target = index + direction;

    if (index < 0 || target < 0 || target >= widgets.length) {
        return [...widgets];
    }

    const reordered = [...widgets];

    [reordered[index], reordered[target]] = [reordered[target], reordered[index]];

    return reordered;
}
