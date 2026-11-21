import type { CSSProperties, PointerEvent } from 'react';
import { ArrowDown, ArrowUp } from 'lucide-react';

import type { PainelWidget, PainelWidgetAction, PainelWidgetSource } from '@/types/painel';

import { PainelWidgetView } from './PainelWidgetView';

interface PainelWidgetCardProps {
    widget: PainelWidget;
    // Situação e conteúdo vindos do backend. Sem fonte, o widget fica "sem dados".
    source?: PainelWidgetSource;
    editing?: boolean;
    // Widget que está sendo arrastado ou redimensionado no momento.
    active?: boolean;
    // Quando informado, o cabeçalho do widget vira a área de arrastar.
    onMoveStart?: (event: PointerEvent<HTMLElement>) => void;
    // Quando informado, o widget ganha a alça de redimensionar no canto inferior direito.
    onResizeStart?: (event: PointerEvent<HTMLElement>) => void;
    // Quando informado, a ação "Remover widget" do menu fica disponível.
    onRemove?: () => void;
    // Abre o painel de configuração deste widget.
    onConfigure?: () => void;
    // Reordenação no celular: quando o widget é a opção de reordenar, o cabeçalho
    // ganha os botões de subir e descer. undefined desabilita o botão (primeiro ou
    // último da pilha).
    reorder?: { onMoveUp?: () => void; onMoveDown?: () => void };
}

const REORDER_BUTTON =
    'inline-flex size-9 items-center justify-center rounded-lg border border-border text-foreground transition-colors hover:bg-white/5 disabled:cursor-not-allowed disabled:opacity-40';

export function PainelWidgetCard({
    widget,
    source,
    editing = false,
    active = false,
    onMoveStart,
    onResizeStart,
    onRemove,
    onConfigure,
    reorder,
}: PainelWidgetCardProps) {
    // Remover só funciona no modo de edição.
    const actions: readonly PainelWidgetAction[] = [
        { label: 'Configurar widget', onSelect: onConfigure, disabled: onConfigure === undefined },
        { label: 'Remover widget', onSelect: onRemove, disabled: onRemove === undefined },
    ];

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
            style={position}
            className={`relative min-w-0 ${active ? 'z-10' : ''} [grid-row:span_var(--painel-h)] md:[grid-column:var(--painel-col)] md:[grid-row:var(--painel-row)]`}
        >
            <PainelWidgetView
                widget={widget}
                source={source}
                actions={actions}
                headerExtra={
                    reorder && (
                        <div className="-mt-1 flex shrink-0 gap-1">
                            <button
                                type="button"
                                aria-label={`Subir o widget ${widget.title}`}
                                disabled={!reorder.onMoveUp}
                                onClick={reorder.onMoveUp}
                                className={REORDER_BUTTON}
                            >
                                <ArrowUp aria-hidden="true" className="size-4" />
                            </button>
                            <button
                                type="button"
                                aria-label={`Descer o widget ${widget.title}`}
                                disabled={!reorder.onMoveDown}
                                onClick={reorder.onMoveDown}
                                className={REORDER_BUTTON}
                            >
                                <ArrowDown aria-hidden="true" className="size-4" />
                            </button>
                        </div>
                    )
                }
                editing={editing}
                active={active}
                onMoveStart={onMoveStart}
            />

            {onResizeStart && (
                <span
                    role="presentation"
                    title="Arraste para redimensionar o widget"
                    onPointerDown={onResizeStart}
                    className="absolute right-0 bottom-0 flex size-6 cursor-nwse-resize touch-none items-end justify-end p-1.5"
                >
                    <span className="size-2.5 rounded-br-sm border-r-2 border-b-2 border-emerald-400" />
                </span>
            )}
        </article>
    );
}
