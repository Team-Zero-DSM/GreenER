import { useEffect, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react';

import type { PainelBreakpoint, PainelSourceGetter, PainelWidget } from '@/types/painel';

import { arrangeWidgets, moveWidget, removeWidget, resizeWidget } from './painelLayout';
import { PAINEL_COLUMNS } from './painelLayoutPadrao';
import { PainelWidgetCard } from './PainelWidgetCard';

interface PainelGridProps {
    // Widgets já com a posição do tamanho de tela em uso.
    widgets: readonly PainelWidget[];
    breakpoint: PainelBreakpoint;
    // Entrega os dados de cada widget.
    getSource: PainelSourceGetter;
    // No modo de edição os widgets ganham os controles de layout; no modo de
    // visualização a grade só exibe.
    editing?: boolean;
    onWidgetsChange?: (widgets: readonly PainelWidget[]) => void;
    onConfigureWidget?: (widget: PainelWidget) => void;
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
    // Colunas da grade no tamanho de tela em que o gesto começou.
    columns: number;
    initialWidgets: readonly PainelWidget[];
}

export function PainelGrid({
    widgets,
    breakpoint,
    getSource,
    editing = false,
    onWidgetsChange,
    onConfigureWidget,
}: PainelGridProps) {
    const gridRef = useRef<HTMLElement>(null);
    const gestureRef = useRef<PainelGesture | null>(null);
    const [activeWidgetId, setActiveWidgetId] = useState<string | null>(null);

    // Arrastar e redimensionar valem nas grades com coordenadas (desktop e tablet).
    // No celular os widgets são empilhados, então não há o que arrastar.
    const columns = PAINEL_COLUMNS[breakpoint];
    const canArrange = editing && breakpoint !== 'mobile' && onWidgetsChange !== undefined;

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
                          gesture.columns,
                      )
                    : resizeWidget(
                          gesture.initialWidgets,
                          gesture.widget.id,
                          gesture.widget.w + columns,
                          gesture.widget.h + rows,
                          gesture.columns,
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
            columnStep: (grid.getBoundingClientRect().width + columnGap) / columns,
            columns,
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
                    source={getSource(widget)}
                    editing={editing}
                    active={widget.id === activeWidgetId}
                    onConfigure={onConfigureWidget ? () => onConfigureWidget(widget) : undefined}
                    onRemove={
                        editing && onWidgetsChange
                            ? () =>
                                  onWidgetsChange(
                                      // No celular não há posições a reorganizar: o
                                      // widget só sai da pilha.
                                      breakpoint === 'mobile'
                                          ? widgets.filter((item) => item.id !== widget.id)
                                          : removeWidget(widgets, widget.id),
                                  )
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
