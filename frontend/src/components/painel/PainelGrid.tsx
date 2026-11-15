import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import { useMediaQuery } from '@/hooks/useMediaQuery';
import type { PainelWidget, PainelWidgetSources } from '@/types/painel';

import { arrangeWidgets, moveWidget, removeWidget, resizeWidget } from './painelLayout';
import { PAINEL_GRID_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetCard } from './PainelWidgetCard';

interface PainelGridProps {
    widgets: readonly PainelWidget[];
    // Dados de cada widget, pelo id.
    sources: PainelWidgetSources;
    // No modo de edição os widgets ganham os controles de layout; no modo de
    // visualização a grade só exibe.
    editing?: boolean;
    onWidgetsChange?: (widgets: readonly PainelWidget[]) => void;
}

// Gesto em andamento: guarda onde o ponteiro começou e como o layout estava, para
// calcular a nova posição sempre a partir do início do gesto.
interface PainelGesture {
    kind: 'move' | 'resize';
    widget: PainelWidget;
    startX: number;
    startY: number;
    // Tamanho, em pixels, de um passo de coluna e de linha (célula + espaçamento).
    columnStep: number;
    rowStep: number;
    initialWidgets: readonly PainelWidget[];
}

export function PainelGrid({
    widgets,
    sources,
    editing = false,
    onWidgetsChange,
}: PainelGridProps) {
    const gridRef = useRef<HTMLElement>(null);
    const gestureRef = useRef<PainelGesture | null>(null);
    const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

    // As coordenadas só valem na grade de 12 colunas (desktop). No tablet e no
    // celular a posição é automática, então não há o que arrastar.
    const isDesktop = useMediaQuery('(min-width: 1024px)');
    const canArrange = editing && isDesktop && onWidgetsChange !== undefined;

    useEffect(() => {
        if (activeWidgetId === null) {
            return;
        }

        function handlePointerMove(event: PointerEvent) {
            const gesture = gestureRef.current;

            if (!gesture) {
                return;
            }

            // Converte o deslocamento do ponteiro em colunas e linhas inteiras.
            const columns = Math.round((event.clientX - gesture.startX) / gesture.columnStep);
            const rows = Math.round((event.clientY - gesture.startY) / gesture.rowStep);

            const changed =
                gesture.kind === 'move'
                    ? moveWidget(
                          gesture.initialWidgets,
                          gesture.widget.id,
                          gesture.widget.x + columns,
                          gesture.widget.y + rows,
                      )
                    : resizeWidget(
                          gesture.initialWidgets,
                          gesture.widget.id,
                          gesture.widget.w + columns,
                          gesture.widget.h + rows,
                      );

            // Os outros widgets abrem espaço para o que está sendo editado.
            onWidgetsChange?.(arrangeWidgets(changed, gesture.widget.id));
        }

        function handlePointerEnd() {
            gestureRef.current = null;
            setActiveWidgetId(null);
        }

        window.addEventListener('pointermove', handlePointerMove);
        window.addEventListener('pointerup', handlePointerEnd);
        window.addEventListener('pointercancel', handlePointerEnd);

        return () => {
            window.removeEventListener('pointermove', handlePointerMove);
            window.removeEventListener('pointerup', handlePointerEnd);
            window.removeEventListener('pointercancel', handlePointerEnd);
        };
    }, [activeWidgetId, onWidgetsChange]);

    function startGesture(
        kind: PainelGesture['kind'],
        widget: PainelWidget,
        event: ReactPointerEvent<HTMLElement>,
    ) {
        const grid = gridRef.current;

        // Só o botão principal do mouse (ou o toque) inicia o gesto.
        if (!canArrange || !grid || event.button !== 0) {
            return;
        }

        event.preventDefault();

        const styles = window.getComputedStyle(grid);
        const columnGap = Number.parseFloat(styles.columnGap) || 0;
        const rowGap = Number.parseFloat(styles.rowGap) || 0;
        const rowHeight = Number.parseFloat(styles.gridAutoRows) || 0;

        gestureRef.current = {
            kind,
            widget,
            startX: event.clientX,
            startY: event.clientY,
            columnStep: (grid.getBoundingClientRect().width + columnGap) / PAINEL_GRID_COLUMNS,
            rowStep: rowHeight + rowGap,
            initialWidgets: widgets,
        };
        setActiveWidgetId(widget.id);
    }

    if (widgets.length === 0) {
        return (
            <p className="rounded-xl border border-dashed border-border px-4 py-16 text-center text-sm text-muted-foreground">
                {editing
                    ? 'O painel está vazio. Use "Adicionar widget" para escolher um widget do catálogo.'
                    : 'O painel está vazio. Clique em "Editar layout" e depois em "Adicionar widget" para montar o seu.'}
            </p>
        );
    }

    return (
        <section
            ref={gridRef}
            aria-label="Widgets do painel"
            data-editing={editing}
            className="grid auto-rows-[4.875rem] grid-cols-1 gap-3 md:grid-cols-6 lg:grid-cols-12"
        >
            {widgets.map((widget) => (
                <PainelWidgetCard
                    key={widget.id}
                    widget={widget}
                    source={sources[widget.id]}
                    editing={editing}
                    active={widget.id === activeWidgetId}
                    onRemove={
                        editing && onWidgetsChange
                            ? () => onWidgetsChange(removeWidget(widgets, widget.id))
                            : undefined
                    }
                    onMoveStart={
                        canArrange ? (event) => startGesture('move', widget, event) : undefined
                    }
                    onResizeStart={
                        canArrange ? (event) => startGesture('resize', widget, event) : undefined
                    }
                />
            ))}
        </section>
    );
}
