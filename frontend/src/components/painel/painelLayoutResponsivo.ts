import type {
    PainelBreakpoint,
    PainelConfig,
    PainelWidget,
    PainelWidgetPosition,
} from '@/types/painel';

import { addWidget, arrangeWidgets, PAINEL_WIDGET_MIN_SIZE } from './painelLayout';
import {
    PAINEL_GRID_COLUMNS,
    PAINEL_TABLET_COLUMNS,
    PAINEL_WIDGET_LIBRARY,
} from './painelLayoutPadrao';

// Cada tamanho de tela tem o seu arranjo dos widgets:
// - desktop: as coordenadas dos próprios widgets (config.widgets), em 12 colunas;
// - tablet: as posições guardadas em config.tablet, em 6 colunas;
// - celular: uma coluna só, com os widgets empilhados na ordem de config.mobileOrder.
// As funções deste arquivo entregam à grade os widgets já com a posição do tamanho
// de tela em uso e gravam de volta, na configuração, o que a grade alterou.

function byRowThenColumn(a: PainelWidget, b: PainelWidget): number {
    return a.y - b.y || a.x - b.x;
}

// Tamanho de um widget do desktop na grade do tablet: os que passam de meia tela
// ocupam a largura inteira e os demais, metade.
export function toTabletSize(widget: PainelWidget): PainelWidget {
    const half = PAINEL_TABLET_COLUMNS / 2;
    const width = widget.w > PAINEL_GRID_COLUMNS / 2 ? PAINEL_TABLET_COLUMNS : half;

    return {
        ...widget,
        x: 0,
        y: 0,
        w: Math.min(Math.max(width, PAINEL_WIDGET_MIN_SIZE[widget.type].w), PAINEL_TABLET_COLUMNS),
    };
}

// Widgets com a posição do tablet. Quem ainda não tem posição própria (painel
// nunca arrumado no tablet, ou widget adicionado depois no desktop) entra no
// primeiro espaço livre, seguindo a ordem do desktop.
function getTabletWidgets(config: PainelConfig): PainelWidget[] {
    const stored = config.tablet ?? {};

    let placed = arrangeWidgets(
        config.widgets
            .filter((widget) => stored[widget.id] !== undefined)
            .map((widget) => ({ ...widget, ...stored[widget.id] })),
    );

    const missing = config.widgets
        .filter((widget) => stored[widget.id] === undefined)
        .sort(byRowThenColumn);

    for (const widget of missing) {
        placed = addWidget(placed, toTabletSize(widget), PAINEL_TABLET_COLUMNS);
    }

    return placed;
}

// Widgets na ordem em que são empilhados no celular: primeiro os que o usuário já
// ordenou, na ordem definida por ele, e depois os demais, na ordem de leitura do
// desktop (linha por linha, da esquerda para a direita).
function getMobileWidgets(config: PainelConfig): PainelWidget[] {
    const order = config.mobileOrder ?? [];
    const byId = new Map(config.widgets.map((widget) => [widget.id, widget]));

    const ordered = order.flatMap((id) => byId.get(id) ?? []);
    const remaining = config.widgets
        .filter((widget) => !order.includes(widget.id))
        .sort(byRowThenColumn);

    return [...ordered, ...remaining];
}

// Widgets do painel com a posição do tamanho de tela informado.
export function getLayoutWidgets(
    config: PainelConfig,
    breakpoint: PainelBreakpoint,
): PainelWidget[] {
    if (breakpoint === 'tablet') {
        return getTabletWidgets(config);
    }

    if (breakpoint === 'mobile') {
        return getMobileWidgets(config);
    }

    return [...config.widgets];
}

function toPosition({ x, y, w, h }: PainelWidget): PainelWidgetPosition {
    return { x, y, w, h };
}

// Grava na configuração o arranjo que a grade devolveu para um tamanho de tela. O
// arranjo dos outros tamanhos é preservado; só entram e saem os widgets que foram
// adicionados ou removidos.
export function setLayoutWidgets(
    config: PainelConfig,
    breakpoint: PainelBreakpoint,
    widgets: readonly PainelWidget[],
): PainelConfig {
    const ids = new Set(widgets.map((widget) => widget.id));

    if (breakpoint === 'desktop') {
        const tablet = config.tablet
            ? Object.fromEntries(Object.entries(config.tablet).filter(([id]) => ids.has(id)))
            : undefined;

        return {
            ...config,
            widgets,
            tablet,
            mobileOrder: config.mobileOrder?.filter((id) => ids.has(id)),
        };
    }

    // O desktop mantém as próprias posições: sai quem foi removido e quem foi
    // adicionado entra no primeiro espaço livre, com o tamanho padrão do widget.
    let desktop = arrangeWidgets(config.widgets.filter((widget) => ids.has(widget.id)));

    for (const widget of widgets) {
        if (!desktop.some((item) => item.id === widget.id)) {
            const metricId = widget.metric ?? widget.id;

            const size =
                PAINEL_WIDGET_LIBRARY.find(
                    (item) =>
                        item.id === widget.id ||
                        (item.type === widget.type && (item.metric ?? item.id) === metricId),
                ) ?? widget;

            desktop = addWidget(desktop, { ...widget, w: size.w, h: size.h });
        }
    }

    if (breakpoint === 'tablet') {
        return {
            ...config,
            widgets: desktop,
            tablet: Object.fromEntries(widgets.map((widget) => [widget.id, toPosition(widget)])),
            mobileOrder: config.mobileOrder?.filter((id) => ids.has(id)),
        };
    }

    // No celular o que se guarda é a ordem em que os widgets aparecem.
    return { ...config, widgets: desktop, mobileOrder: widgets.map((widget) => widget.id) };
}