import { memo, useMemo, type CSSProperties, type KeyboardEvent, type PointerEvent } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { PainelWidget, PainelWidgetAction, PainelWidgetSource } from '@/types/painel';

import { PainelWidgetView } from './PainelWidgetView';

// Bordas por onde o widget pode ser redimensionado.
export type PainelResizeEdge = 'e' | 's' | 'se';

// Funções que a grade entrega aos widgets. São estáveis (não mudam a cada
// renderização), então os widgets que não mudaram não redesenham durante um gesto.
export interface PainelCardHandlers {
    onPointerDown: (id: string, event: PointerEvent<HTMLElement>) => void;
    onResizeStart: (id: string, edge: PainelResizeEdge, event: PointerEvent<HTMLElement>) => void;
    onKeyDown: (id: string, event: KeyboardEvent<HTMLElement>) => void;
    onConfigure?: (id: string) => void;
    onRemove?: (id: string) => void;
    onShift?: (id: string, direction: -1 | 1) => void;
}

interface PainelWidgetCardProps {
    widget: PainelWidget;
    // Situação e conteúdo vindos do backend. Sem fonte, o widget fica "sem dados".
    source?: PainelWidgetSource;
    editing: boolean;
    // Pode ser arrastado e redimensionado (desktop e tablet no modo de edição).
    arrangeable: boolean;
    // Widget que está sendo arrastado ou redimensionado no momento.
    active: boolean;
    // Reordenação no celular: botões de subir e descer no cabeçalho.
    reorderable: boolean;
    canMoveUp: boolean;
    canMoveDown: boolean;
    handlers: PainelCardHandlers;
}

const REORDER_BUTTON =
    'inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40';

// Campos que mudam o desenho do conteúdo. Posição e tamanho ficam de fora: mudar
// de lugar não redesenha o gráfico, e o tamanho novo chega pelo próprio elemento.
function sameContent(a: PainelWidget, b: PainelWidget): boolean {
    return (
        a.id === b.id &&
        a.type === b.type &&
        a.chart === b.chart &&
        a.metric === b.metric &&
        a.palette === b.palette &&
        a.region === b.region &&
        a.title === b.title &&
        a.alert?.threshold === b.alert?.threshold &&
        a.alert?.direction === b.alert?.direction
    );
}

// Conteúdo do widget, que só redesenha quando os dados ou a configuração mudam.
const PainelWidgetBody = memo(
    PainelWidgetView,
    (previous, next) =>
        previous.source === next.source &&
        previous.editing === next.editing &&
        previous.active === next.active &&
        previous.showGrip === next.showGrip &&
        previous.actions === next.actions &&
        previous.headerExtra === next.headerExtra &&
        sameContent(previous.widget, next.widget),
);

function PainelWidgetCardComponent({
    widget,
    source,
    editing,
    arrangeable,
    active,
    reorderable,
    canMoveUp,
    canMoveDown,
    handlers,
}: PainelWidgetCardProps) {
    const { id } = widget;
    const canRemove = editing && handlers.onRemove !== undefined;

    const actions = useMemo<readonly PainelWidgetAction[]>(
        () => [
            {
                label: 'Configurar widget',
                onSelect: handlers.onConfigure ? () => handlers.onConfigure?.(id) : undefined,
                disabled: handlers.onConfigure === undefined,
            },
            {
                label: 'Remover widget',
                onSelect: canRemove ? () => handlers.onRemove?.(id) : undefined,
                disabled: !canRemove,
            },
        ],
        [handlers, id, canRemove],
    );

    const headerExtra = useMemo(
        () =>
            reorderable ? (
                <div className="-mt-1 flex shrink-0 gap-1">
                    <button
                        type="button"
                        aria-label={`Subir o widget ${widget.title}`}
                        disabled={!canMoveUp}
                        onClick={() => handlers.onShift?.(id, -1)}
                        className={REORDER_BUTTON}
                    >
                        <ArrowUp aria-hidden="true" className="size-4" />
                    </button>
                    <button
                        type="button"
                        aria-label={`Descer o widget ${widget.title}`}
                        disabled={!canMoveDown}
                        onClick={() => handlers.onShift?.(id, 1)}
                        className={REORDER_BUTTON}
                    >
                        <ArrowDown aria-hidden="true" className="size-4" />
                    </button>
                </div>
            ) : undefined,
        [reorderable, canMoveUp, canMoveDown, handlers, id, widget.title],
    );

    // No desktop e no tablet o widget fica exatamente na coordenada do arranjo
    // daquele tamanho de tela (a grade do CSS começa em 1, as coordenadas em 0).
    // No celular os widgets são empilhados na ordem da lista: só a altura vale.
    const position = {
        '--painel-col': `${widget.x + 1} / span ${widget.w}`,
        '--painel-row': `${widget.y + 1} / span ${widget.h}`,
        '--painel-h': widget.h,
    } as CSSProperties;

    return (
        <article
            data-painel-id={id}
            data-active={active || undefined}
            style={position}
            tabIndex={arrangeable ? 0 : undefined}
            aria-roledescription={arrangeable ? 'widget móvel' : undefined}
            aria-label={
                arrangeable
                    ? `${widget.title}. Setas movem, Shift e setas redimensionam.`
                    : undefined
            }
            onPointerDown={arrangeable ? (event) => handlers.onPointerDown(id, event) : undefined}
            onKeyDown={arrangeable ? (event) => handlers.onKeyDown(id, event) : undefined}
            className={`painel-card group/card relative min-w-0 rounded-xl [grid-row:span_var(--painel-h)] md:[grid-column:var(--painel-col)] md:[grid-row:var(--painel-row)] ${
                arrangeable
                    ? `touch-none outline-none select-none focus-visible:ring-2 focus-visible:ring-primary ${
                          active ? 'z-30 cursor-grabbing' : 'cursor-grab'
                      }`
                    : ''
            }`}
        >
            <PainelWidgetBody
                widget={widget}
                source={source}
                actions={actions}
                headerExtra={headerExtra}
                editing={editing}
                active={active}
                showGrip={arrangeable}
            />

            {arrangeable && (
                <>
                    {/* Bordas direita e inferior: áreas largas e invisíveis para puxar. */}
                    <span
                        role="presentation"
                        data-painel-resize="e"
                        onPointerDown={(event) => handlers.onResizeStart(id, 'e', event)}
                        className="absolute top-3 -right-1.5 bottom-6 w-3 cursor-ew-resize touch-none"
                    />
                    <span
                        role="presentation"
                        data-painel-resize="s"
                        onPointerDown={(event) => handlers.onResizeStart(id, 's', event)}
                        className="absolute right-6 -bottom-1.5 left-3 h-3 cursor-ns-resize touch-none"
                    />
                    {/* Canto: alça visível, que cresce ao passar o mouse. */}
                    <span
                        role="presentation"
                        title="Arraste para redimensionar"
                        data-painel-resize="se"
                        onPointerDown={(event) => handlers.onResizeStart(id, 'se', event)}
                        className="absolute -right-1 -bottom-1 flex size-8 cursor-nwse-resize touch-none items-end justify-end p-2"
                    >
                        <span className="size-3 rounded-br-md border-r-2 border-b-2 border-emerald-400/80 transition-all duration-150 group-hover/card:size-4 group-hover/card:border-emerald-300" />
                    </span>
                </>
            )}
        </article>
    );
}

export const PainelWidgetCard = memo(PainelWidgetCardComponent);
